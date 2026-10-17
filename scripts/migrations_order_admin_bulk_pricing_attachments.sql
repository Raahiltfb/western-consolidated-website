-- ==============================================================================
-- MIGRATION: Western Consolidated - Order Admin, Bulk Pricing & PDF Attachments
-- Safe, idempotent migration to be executed in Supabase SQL Editor.
-- ==============================================================================

-- 1. PROFILES & ROLES: Add 'order_admin' role and helper functions
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check check (role in ('dealer', 'admin', 'order_admin'));

-- Helper to check if caller is a full admin
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

-- Helper to check if caller is an admin or order_admin (Ranjan)
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

-- Allow order_admin to view dealer profile firm_name/email for order listings
drop policy if exists "Order admins can view profiles" on public.profiles;
create policy "Order admins can view profiles" on public.profiles
  for select using (public.is_order_admin());

-- Ensure Ranjan has order_admin role if his user already exists in public.profiles
update public.profiles
set role = 'order_admin',
    firm_name = coalesce(nullif(firm_name, ''), 'Western Consolidated Admin (Orders)')
where email = 'ranjan@westernconsolidated.com';

-- 2. BULK PRICING: Add bulk_min_price to genset_ratings without altering existing data
alter table public.genset_ratings add column if not exists bulk_min_price numeric;
update public.genset_ratings set bulk_min_price = min_price where bulk_min_price is null;
alter table public.genset_ratings alter column bulk_min_price set not null;

-- Ensure Genset Ratings RLS: ONLY full admins can read or modify protected price floors
alter table public.genset_ratings enable row level security;
drop policy if exists "Admins can do everything on ratings" on public.genset_ratings;
create policy "Admins can do everything on ratings" on public.genset_ratings
  for all using (public.is_admin());

-- Secure view for dealers to get kVA list without exposing floor prices
create or replace view public.active_ratings as
  select kva from public.genset_ratings;
grant select on public.active_ratings to authenticated;

-- 3. GLOBAL PRICING SETTINGS: Persistent threshold configuration
create table if not exists public.pricing_settings (
  key text primary key,
  value text not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.pricing_settings enable row level security;

drop policy if exists "Admins can do everything on pricing settings" on public.pricing_settings;
create policy "Admins can do everything on pricing settings" on public.pricing_settings
  for all using (public.is_admin());

-- Insert default bulk threshold = 3 if not present
insert into public.pricing_settings (key, value)
values ('bulk_threshold', '3')
on conflict (key) do nothing;

-- RPC to get current bulk threshold securely
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

-- RPC for full admins to update bulk threshold
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

grant execute on function public.get_bulk_threshold() to authenticated;
grant execute on function public.set_bulk_threshold(integer) to authenticated;

-- 4. PRICE SUBMISSIONS: Add quantity & pricing_tier and enforce strict RLS (user_id)
alter table public.price_submissions add column if not exists quantity integer not null default 1;
alter table public.price_submissions drop constraint if exists price_submissions_pricing_tier_check;
alter table public.price_submissions add column if not exists pricing_tier text not null default 'standard';
alter table public.price_submissions add constraint price_submissions_pricing_tier_check check (pricing_tier in ('standard', 'bulk'));

alter table public.price_submissions enable row level security;

-- Dealers can view ONLY their own submissions (matched on user_id)
drop policy if exists "Dealers can view their own price submissions" on public.price_submissions;
create policy "Dealers can view their own price submissions" on public.price_submissions
  for select using (auth.uid() = user_id);

-- Full admins can view, manage, and delete price submissions (order_admin cannot access)
drop policy if exists "Admins can view all price submissions" on public.price_submissions;
drop policy if exists "Admins can do everything on price submissions" on public.price_submissions;
create policy "Admins can view all price submissions" on public.price_submissions
  for all using (public.is_admin());

drop policy if exists "Admins can delete price submissions" on public.price_submissions;
create policy "Admins can delete price submissions" on public.price_submissions
  for delete using (public.is_admin());

-- 5. SECURE PRICE SUPPORT RPC FUNCTION (Bulk logic, role protection, shared refer floor)
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

  -- Generate unique reference: WC- followed by random 6-digit number
  v_ref := 'WC-' || lpad(floor(random() * 1000000)::text, 6, '0');

  -- Record submission linked to auth.uid() as user_id
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

grant execute on function public.submit_price_support(text, text, text, numeric, integer) to authenticated;

-- 6. ORDERS TABLE: Add PDF Attachment fields & RLS for order_admin & dealers
alter table public.orders add column if not exists attachment_path text;
alter table public.orders add column if not exists attachment_name text;

alter table public.orders enable row level security;

-- Drop all previous order policy names to ensure clean state
drop policy if exists "Admins can select all orders" on public.orders;
drop policy if exists "Admins can insert all orders" on public.orders;
drop policy if exists "Admins can update all orders" on public.orders;
drop policy if exists "Admins can delete all orders" on public.orders;
drop policy if exists "Admins can view all orders" on public.orders;

drop policy if exists "Order admins can select all orders" on public.orders;
drop policy if exists "Order admins can insert all orders" on public.orders;
drop policy if exists "Order admins can update all orders" on public.orders;
drop policy if exists "Order admins can delete all orders" on public.orders;
drop policy if exists "Order admins can view all orders" on public.orders;

-- Order Admins (Full admin & semi-admin Ranjan)
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

-- Dealers: view, insert, update, delete only their own orders
drop policy if exists "Dealers can view their own orders" on public.orders;
create policy "Dealers can view their own orders" on public.orders
  for select using (auth.uid() = user_id);

drop policy if exists "Dealers can insert their own orders" on public.orders;
create policy "Dealers can insert their own orders" on public.orders
  for insert with check (auth.uid() = user_id);

drop policy if exists "Dealers can update their own orders" on public.orders;
create policy "Dealers can update their own orders" on public.orders
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Dealers can delete their own orders" on public.orders;
create policy "Dealers can delete their own orders" on public.orders
  for delete using (auth.uid() = user_id);

-- Update dealer protection trigger to allow order_admin (Ranjan)
create or replace function public.restrict_dealer_order_updates()
returns trigger
language plpgsql
security definer
as $$
begin
  -- Full admins and order admins can update any field
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
    -- Non-admin always assigns own user_id; order_admin can assign if specified or fallback to auth.uid()
    if not public.is_order_admin() or new.user_id is null then
      new.user_id := auth.uid();
    end if;
    
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

-- 7. STORAGE BUCKET & POLICIES FOR ORDER ATTACHMENTS
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

-- Storage RLS: Order admins have full access to view, upload, update, delete
drop policy if exists "Admins have full access to order attachments" on storage.objects;
drop policy if exists "Order admins have full access to order attachments" on storage.objects;
create policy "Order admins have full access to order attachments"
  on storage.objects for all
  using (bucket_id = 'order-attachments' and public.is_order_admin())
  with check (bucket_id = 'order-attachments' and public.is_order_admin());

-- Storage RLS: Dealers can upload only into their own user directory {auth.uid()}
drop policy if exists "Dealers can upload attachments to own directory" on storage.objects;
create policy "Dealers can upload attachments to own directory"
  on storage.objects for insert
  with check (
    bucket_id = 'order-attachments'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Storage RLS: Dealers can read only their own attachments
drop policy if exists "Dealers can read own attachments" on storage.objects;
create policy "Dealers can read own attachments"
  on storage.objects for select
  using (
    bucket_id = 'order-attachments'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Storage RLS: Dealers can update only their own attachments within their directory
drop policy if exists "Dealers can update own attachments" on storage.objects;
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

-- Storage RLS: Dealers can delete only their own attachments
drop policy if exists "Dealers can delete own attachments" on storage.objects;
create policy "Dealers can delete own attachments"
  on storage.objects for delete
  using (
    bucket_id = 'order-attachments'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
