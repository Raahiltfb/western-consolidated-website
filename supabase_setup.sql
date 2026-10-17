-- 1. Profiles Table to manage Roles
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  firm_name text,
  role text not null check (role in ('dealer', 'admin', 'order_admin')) default 'dealer',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Profiles
alter table public.profiles enable row level security;

create policy "Users can view their own profile" on public.profiles
  for select using (auth.uid() = id);

-- Helper function to avoid RLS recursion when checking admin roles
create or replace function public.is_admin()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$;

-- Helper function to check if user has admin or order_admin role (Ranjan)
create or replace function public.is_order_admin()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'order_admin')
  );
end;
$$;

create policy "Admins can view and update all profiles" on public.profiles
  for all using (
    public.is_admin()
  );

create policy "Order admins can view profiles" on public.profiles
  for select using (
    public.is_order_admin()
  );

-- 2. Trigger to automatically sync auth.users with public.profiles on signup/creation
create or replace function public.handle_new_user()
returns trigger
as $$
begin
  insert into public.profiles (id, email, firm_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'firm_name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'dealer')
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. Genset Ratings Table (Admin configured)
create table if not exists public.genset_ratings (
  kva text primary key,
  min_price numeric not null,
  bulk_min_price numeric not null,
  refer_floor numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Genset Ratings (Dealers and order_admin cannot read these rows directly)
alter table public.genset_ratings enable row level security;

create policy "Admins can do everything on ratings" on public.genset_ratings
  for all using (
    public.is_admin()
  );

-- View for dealers to see kVA list without seeing the floor prices
create or replace view public.active_ratings as
  select kva from public.genset_ratings;

-- Grant select permission on the view to authenticated users
grant select on public.active_ratings to authenticated;

-- Seed Initial Genset Ratings with bulk_min_price
insert into public.genset_ratings (kva, min_price, bulk_min_price, refer_floor) values
('15 (3ph) HA', 283183.76, 283183.76, 274787.47),
('15 (3ph) GK', 309018.84, 309018.84, 299856.56),
('20 (3ph)', 333805.07, 333805.07, 323907.88),
('25 (3ph)', 406642.23, 406642.23, 394585.45),
('30 (3ph)', 465699.01, 465699.01, 451891.22),
('35 (3ph)', 473989.88, 473989.88, 459936.27),
('40 (3ph)', 529708.77, 529708.77, 514003.12),
('45', 542412.09, 542412.09, 526329.79),
('58.5', 585006.04, 585006.04, 567660.85),
('82.5', 933761.15, 933761.15, 906075.51),
('125', 1085201.59, 1085201.59, 1053025.8),
('160', 1499180.84, 1499180.84, 1454730.73),
('200', 1775830.0, 1775830.0, 1723177.36),
('250-SB', 1837412.5, 1837412.5, 1782933.97),
('250', 1994224.89, 1994224.89, 1935096.93),
('320', 2433907.67, 2433907.67, 2361743.29),
('400', 3474064.17, 3474064.17, 3371059.57),
('500', 3612651.81, 3612651.81, 3505538.14),
('625', 5082713.96, 5082713.96, 4932013.55),
('750', 5695415.78, 5695415.78, 5526549.01),
('15 (1ph) HA', 294351.19, 294351.19, 285623.79),
('15 (1ph) GK', 320186.27, 320186.27, 310692.88),
('20 (1ph)', 346307.56, 346307.56, 336039.69),
('25 (1ph)', 422403.86, 422403.86, 409879.75),
('30 (1ph)', 485698.07, 485698.07, 471297.32),
('35 (1ph)', 509492.53, 509492.53, 494386.28),
('40 (1ph)', 563010.25, 563010.25, 546317.22),
('45 (1ph)', 586451.94, 586451.94, 569063.88),
('58.5 (1ph)', 649361.82, 649361.82, 630108.51)
on conflict (kva) do update
set min_price = excluded.min_price,
    bulk_min_price = coalesce(public.genset_ratings.bulk_min_price, excluded.min_price),
    refer_floor = excluded.refer_floor;

-- 4. Pricing Settings Table (Persistent Global Settings)
create table if not exists public.pricing_settings (
  key text primary key,
  value text not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.pricing_settings enable row level security;

create policy "Admins can do everything on pricing settings" on public.pricing_settings
  for all using (public.is_admin());

-- Default bulk threshold = 3 sets
insert into public.pricing_settings (key, value)
values ('bulk_threshold', '3')
on conflict (key) do nothing;

create or replace function public.get_bulk_threshold()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_val text;
begin
  select value into v_val from public.pricing_settings where key = 'bulk_threshold';
  return coalesce(v_val::integer, 3);
end;
$$;

create or replace function public.set_bulk_threshold(p_threshold integer)
returns integer
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Unauthorized: Only full admins can update pricing settings';
  end if;

  if p_threshold is null or p_threshold < 1 then
    raise exception 'Threshold must be a positive whole number';
  end if;

  insert into public.pricing_settings (key, value, updated_at)
  values ('bulk_threshold', p_threshold::text, timezone('utc'::text, now()))
  on conflict (key) do update set
    value = excluded.value,
    updated_at = excluded.updated_at;

  return p_threshold;
end;
$$;

-- 5. Price Submissions Table (Logs)
create table if not exists public.price_submissions (
  id text primary key, -- e.g. WC-XXXXXX
  user_id uuid references public.profiles(id) on delete set null,
  dealer_name text not null,
  sales_rep text,
  kva text not null,
  customer_name text not null,
  offered_price numeric not null,
  verdict text not null check (verdict in ('APPROVED', 'REFER', 'NOT_POSSIBLE')),
  quantity integer not null default 1,
  pricing_tier text not null default 'standard' check (pricing_tier in ('standard', 'bulk')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.price_submissions enable row level security;

create policy "Dealers can view their own price submissions" on public.price_submissions
  for select using (auth.uid() = user_id);

create policy "Admins can view all price submissions" on public.price_submissions
  for all using (
    public.is_admin()
  );

create policy "Admins can delete price submissions" on public.price_submissions
  for delete using (
    public.is_admin()
  );

-- 6. Orders Table
create table if not exists public.orders (
  id text primary key, -- e.g. OB-XXXXXX
  user_id uuid references public.profiles(id) on delete set null,
  dealer_name text not null,
  sales_rep text,
  kva text not null,
  sets_count integer not null check (sets_count > 0),
  customer_name text not null,
  customer_phone text,
  price_per_set numeric not null,
  dispatch_date date not null,
  status text not null check (status in ('open', 'dispatched')) default 'open',
  attachment_path text,
  attachment_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.orders enable row level security;

create policy "Dealers can view their own orders" on public.orders
  for select using (auth.uid() = user_id);

create policy "Dealers can insert their own orders" on public.orders
  for insert with check (auth.uid() = user_id);

create policy "Dealers can update their own orders" on public.orders
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Dealers can delete their own orders" on public.orders
  for delete using (auth.uid() = user_id);

create policy "Order admins can select all orders" on public.orders
  for select using (public.is_order_admin());

create policy "Order admins can insert all orders" on public.orders
  for insert with check (public.is_order_admin());

create policy "Order admins can update all orders" on public.orders
  for update
  using (public.is_order_admin())
  with check (public.is_order_admin());

create policy "Order admins can delete all orders" on public.orders
  for delete using (public.is_order_admin());

-- Trigger function to protect system identity, sales rep, and ownership fields from dealer updates
create or replace function public.restrict_dealer_order_updates()
returns trigger
language plpgsql
security definer
as $$
begin
  -- Full Admins and Order Admins can update any field
  if public.is_order_admin() then
    return new;
  end if;

  -- For non-admin users (dealers), enforce that identity and ownership fields cannot be altered
  if (old.id is distinct from new.id) or
     (old.user_id is distinct from new.user_id) or
     (old.sales_rep is distinct from new.sales_rep) or
     (old.created_at is distinct from new.created_at) then
    raise exception 'Dealers are not permitted to modify system identity, sales rep, or order ownership fields.';
  end if;

  return new;
end;
$$;

drop trigger if exists on_order_before_update on public.orders;
create trigger on_order_before_update
  before update on public.orders
  for each row execute function public.restrict_dealer_order_updates();

-- Trigger to automatically set user_id and sales_rep on order creation
create or replace function public.set_order_auth_fields()
returns trigger
language plpgsql
security definer
as $$
declare
  v_sales_rep text;
begin
  if auth.uid() is not null then
    new.user_id := auth.uid();
    
    select regexp_replace(regexp_replace(coalesce(nullif(firm_name, ''), email), '@.*$', ''), '\s+(Power|Admin)$', '', 'i') into v_sales_rep
    from public.profiles
    where id = auth.uid();
    
    if v_sales_rep is not null and length(v_sales_rep) > 0 then
      v_sales_rep := initcap(v_sales_rep);
    end if;

    new.sales_rep := coalesce(v_sales_rep, new.sales_rep, 'Unknown');
  end if;
  return new;
end;
$$;

drop trigger if exists on_order_before_insert on public.orders;
create trigger on_order_before_insert
  before insert on public.orders
  for each row execute function public.set_order_auth_fields();

-- 7. RPC Function for Secure Price Verification (Standard vs Bulk)
create or replace function public.submit_price_support(
  p_kva text,
  p_customer_name text,
  p_dealer_name text,
  p_offered_price numeric,
  p_quantity integer default 1
)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_min_price numeric;
  v_bulk_min_price numeric;
  v_refer_floor numeric;
  v_applicable_min numeric;
  v_threshold integer;
  v_pricing_tier text;
  v_verdict text;
  v_ref text;
  v_sales_rep text;
  v_role text;
begin
  -- Ensure user is authenticated
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  -- Block Ranjan (order_admin) from accessing or evaluating price support
  select role into v_role from public.profiles where id = auth.uid();
  if v_role = 'order_admin' then
    raise exception 'Access denied: Order administrators are not permitted to use price support';
  end if;

  -- Validate inputs
  if p_quantity is null or p_quantity < 1 then
    raise exception 'Quantity must be a positive whole number';
  end if;

  if p_offered_price is null or p_offered_price <= 0 then
    raise exception 'Offered price must be greater than zero';
  end if;

  -- Fetch configured bulk threshold (default 3)
  v_threshold := public.get_bulk_threshold();
  if p_quantity >= v_threshold then
    v_pricing_tier := 'bulk';
  else
    v_pricing_tier := 'standard';
  end if;

  -- Derive Sales Rep from profiles table
  select regexp_replace(regexp_replace(coalesce(nullif(firm_name, ''), email), '@.*$', ''), '\s+(Power|Admin)$', '', 'i') into v_sales_rep
  from public.profiles
  where id = auth.uid();

  if v_sales_rep is not null and length(v_sales_rep) > 0 then
    v_sales_rep := initcap(v_sales_rep);
  end if;

  -- Get protected pricing thresholds from genset_ratings
  select min_price, coalesce(bulk_min_price, min_price), refer_floor
  into v_min_price, v_bulk_min_price, v_refer_floor
  from public.genset_ratings
  where kva = p_kva;

  if not found then
    raise exception 'Genset rating not found';
  end if;

  -- Select applicable minimum approved price based on quantity tier
  if v_pricing_tier = 'bulk' then
    v_applicable_min := v_bulk_min_price;
  else
    v_applicable_min := v_min_price;
  end if;

  -- Calculate verdict: Both standard and bulk tiers share the exact same refer_floor
  if p_offered_price >= v_applicable_min then
    v_verdict := 'APPROVED';
  elsif p_offered_price >= v_refer_floor then
    v_verdict := 'REFER';
  else
    v_verdict := 'NOT_POSSIBLE';
  end if;

  -- Generate unique reference: WC- followed by a random 6-digit number
  v_ref := 'WC-' || lpad(floor(random() * 1000000)::text, 6, '0');

  -- Record submission
  insert into public.price_submissions (
    id,
    user_id,
    dealer_name,
    sales_rep,
    kva,
    customer_name,
    offered_price,
    verdict,
    quantity,
    pricing_tier
  ) values (
    v_ref,
    auth.uid(),
    p_dealer_name,
    coalesce(v_sales_rep, 'Unknown'),
    p_kva,
    p_customer_name,
    p_offered_price,
    v_verdict,
    p_quantity,
    v_pricing_tier
  );

  return json_build_object(
    'ref', v_ref,
    'verdict', v_verdict,
    'kva', p_kva,
    'customer', p_customer_name,
    'price', p_offered_price,
    'quantity', p_quantity,
    'tier', v_pricing_tier
  );
end;
$$;

-- 8. Storage Bucket & RLS for Order Attachments
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'order-attachments',
  'order-attachments',
  false,
  10485760, -- 10MB limit
  array['application/pdf']
)
on conflict (id) do update set
  public = false,
  file_size_limit = 10485760,
  allowed_mime_types = array['application/pdf'];

create policy "Order admins have full access to order attachments"
  on storage.objects for all
  using (bucket_id = 'order-attachments' and public.is_order_admin())
  with check (bucket_id = 'order-attachments' and public.is_order_admin());

create policy "Dealers can upload attachments to own directory"
  on storage.objects for insert
  with check (
    bucket_id = 'order-attachments'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Dealers can read own attachments"
  on storage.objects for select
  using (
    bucket_id = 'order-attachments'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Dealers can update own attachments"
  on storage.objects for update
  using (
    bucket_id = 'order-attachments'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'order-attachments'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Dealers can delete own attachments"
  on storage.objects for delete
  using (
    bucket_id = 'order-attachments'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
