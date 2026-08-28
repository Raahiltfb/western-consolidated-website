-- 1. Profiles Table to manage Roles
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  firm_name text,
  role text not null check (role in ('dealer', 'admin')) default 'dealer',
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

create policy "Admins can view and update all profiles" on public.profiles
  for all using (
    public.is_admin()
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
  refer_floor numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Genset Ratings (Dealers cannot read these rows directly)
alter table public.genset_ratings enable row level security;

create policy "Admins can do everything on ratings" on public.genset_ratings
  for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- View for dealers to see kVA list without seeing the floor prices
create or replace view public.active_ratings as
  select kva from public.genset_ratings;

-- Grant select permission on the view to authenticated users
grant select on public.active_ratings to authenticated;

-- Seed Initial Genset Ratings
insert into public.genset_ratings (kva, min_price, refer_floor) values
('15 (3ph) HA', 283183.76, 274787.47),
('15 (3ph) GK', 309018.84, 299856.56),
('20 (3ph)', 333805.07, 323907.88),
('25 (3ph)', 406642.23, 394585.45),
('30 (3ph)', 465699.01, 451891.22),
('35 (3ph)', 473989.88, 459936.27),
('40 (3ph)', 529708.77, 514003.12),
('45', 542412.09, 526329.79),
('58.5', 585006.04, 567660.85),
('82.5', 933761.15, 906075.51),
('125', 1085201.59, 1053025.8),
('160', 1499180.84, 1454730.73),
('200', 1775830.0, 1723177.36),
('250-SB', 1837412.5, 1782933.97),
('250', 1994224.89, 1935096.93),
('320', 2433907.67, 2361743.29),
('400', 3474064.17, 3371059.57),
('500', 3612651.81, 3505538.14),
('625', 5082713.96, 4932013.55),
('750', 5695415.78, 5526549.01),
('15 (1ph) HA', 294351.19, 285623.79),
('15 (1ph) GK', 320186.27, 310692.88),
('20 (1ph)', 346307.56, 336039.69),
('25 (1ph)', 422403.86, 409879.75),
('30 (1ph)', 485698.07, 471297.32),
('35 (1ph)', 509492.53, 494386.28),
('40 (1ph)', 563010.25, 546317.22),
('45 (1ph)', 586451.94, 569063.88),
('58.5 (1ph)', 649361.82, 630108.51)
on conflict (kva) do update
set min_price = excluded.min_price, refer_floor = excluded.refer_floor;

-- 4. Price Submissions Table (Logs)
create table if not exists public.price_submissions (
  id text primary key, -- e.g. WC-XXXXXX
  user_id uuid references auth.users,
  dealer_name text not null,
  kva text not null,
  customer_name text not null,
  offered_price numeric not null,
  verdict text not null check (verdict in ('APPROVED', 'REFER', 'NOT_POSSIBLE')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.price_submissions enable row level security;

create policy "Dealers can view their own price submissions" on public.price_submissions
  for select using (auth.uid() = user_id);

create policy "Admins can view all price submissions" on public.price_submissions
  for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- 5. Orders Table
create table if not exists public.orders (
  id text primary key, -- e.g. OB-XXXXXX
  user_id uuid references auth.users,
  dealer_name text not null,
  kva text not null,
  sets_count integer not null check (sets_count > 0),
  customer_name text not null,
  customer_phone text,
  price_per_set numeric not null,
  dispatch_date date not null,
  status text not null check (status in ('open', 'dispatched')) default 'open',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.orders enable row level security;

create policy "Dealers can view their own orders" on public.orders
  for select using (auth.uid() = user_id);

create policy "Dealers can insert their own orders" on public.orders
  for insert with check (auth.uid() = user_id);

create policy "Admins can select all orders" on public.orders
  for select using (public.is_admin());

create policy "Admins can insert all orders" on public.orders
  for insert with check (public.is_admin());

create policy "Admins can update all orders" on public.orders
  for update using (public.is_admin());

create policy "Admins can delete all orders" on public.orders
  for delete using (public.is_admin());

-- 6. RPC Function for Secure Price Verification
create or replace function public.submit_price_support(
  p_kva text,
  p_customer_name text,
  p_dealer_name text,
  p_offered_price numeric
)
returns json
language plpgsql
security definer
as $$
declare
  v_min_price numeric;
  v_refer_floor numeric;
  v_verdict text;
  v_ref text;
begin
  -- Get thresholds securely
  select min_price, refer_floor into v_min_price, v_refer_floor
  from public.genset_ratings
  where kva = p_kva;
  
  if not found then
    raise exception 'Genset rating not found';
  end if;
  
  -- Calculate verdict
  if p_offered_price >= v_min_price then
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
    kva,
    customer_name,
    offered_price,
    verdict
  ) values (
    v_ref,
    auth.uid(),
    p_dealer_name,
    p_kva,
    p_customer_name,
    p_offered_price,
    v_verdict
  );
  
  return json_build_object(
    'ref', v_ref,
    'verdict', v_verdict,
    'kva', p_kva,
    'customer', p_customer_name,
    'price', p_offered_price
  );
end;
$$;
