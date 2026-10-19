-- ==============================================================================
-- MIGRATION: Western Consolidated - Transactional Email Notifications & Logs
-- Safe, idempotent migration to be executed in Supabase SQL Editor.
-- Non-destructive: preserves existing data, safely upgrades schema, or halts early.
-- ==============================================================================

-- 1. PRE-MIGRATION SAFETY CHECK
-- Ensure existing schema is compatible before applying any changes.
do $$
declare
  v_incompatible text;
  v_null_count integer;
  v_dup_count integer;
begin
  -- A. Validate dependent tables needed by functions and views
  select string_agg(dep, ', ')
  into v_incompatible
  from (
    select 'orders table missing' as dep where not exists (
      select 1 from information_schema.tables where table_schema = 'public' and table_name = 'orders'
    )
    union all
    select 'orders.dispatch_date missing or not date type' where not exists (
      select 1 from information_schema.columns 
      where table_schema = 'public' and table_name = 'orders' 
        and column_name = 'dispatch_date' and data_type = 'date'
    )
    union all
    select 'orders.status missing' where not exists (
      select 1 from information_schema.columns 
      where table_schema = 'public' and table_name = 'orders' 
        and column_name = 'status'
    )
    union all
    select 'profiles table missing' where not exists (
      select 1 from information_schema.tables where table_schema = 'public' and table_name = 'profiles'
    )
    union all
    select 'profiles.email missing' where not exists (
      select 1 from information_schema.columns 
      where table_schema = 'public' and table_name = 'profiles' 
        and column_name = 'email'
    )
  ) deps;

  if v_incompatible is not null and v_incompatible <> '' then
    raise exception 'Pre-migration check failed: Dependent database schema is missing required tables/columns: %. Halting migration.', v_incompatible;
  end if;

  -- B. Validate public.email_logs if already present
  if exists (
    select 1 from information_schema.tables 
    where table_schema = 'public' and table_name = 'email_logs'
  ) then
    -- Verify core column existence and data type compatibility
    select string_agg(col, ', ')
    into v_incompatible
    from (
      -- Core required columns
      select 'idempotency_key (must be text/varchar)' as col where not exists (
        select 1 from information_schema.columns 
        where table_schema = 'public' and table_name = 'email_logs' 
          and column_name = 'idempotency_key' and data_type in ('text', 'character varying')
      )
      union all
      select 'event_type (must be text/varchar)' where not exists (
        select 1 from information_schema.columns 
        where table_schema = 'public' and table_name = 'email_logs' 
          and column_name = 'event_type' and data_type in ('text', 'character varying')
      )
      union all
      select 'reference_id (must be text/varchar)' where not exists (
        select 1 from information_schema.columns 
        where table_schema = 'public' and table_name = 'email_logs' 
          and column_name = 'reference_id' and data_type in ('text', 'character varying')
      )
      union all
      select 'recipient_emails (must be ARRAY)' where not exists (
        select 1 from information_schema.columns 
        where table_schema = 'public' and table_name = 'email_logs' 
          and column_name = 'recipient_emails' and data_type = 'ARRAY'
      )
      union all
      select 'status (must be text/varchar)' where not exists (
        select 1 from information_schema.columns 
        where table_schema = 'public' and table_name = 'email_logs' 
          and column_name = 'status' and data_type in ('text', 'character varying')
      )
      -- Check that optional columns do not have conflicting types if they already exist
      union all
      select 'subject (incompatible type)' where exists (
        select 1 from information_schema.columns 
        where table_schema = 'public' and table_name = 'email_logs' 
          and column_name = 'subject' and data_type not in ('text', 'character varying')
      )
      union all
      select 'error_message (incompatible type)' where exists (
        select 1 from information_schema.columns 
        where table_schema = 'public' and table_name = 'email_logs' 
          and column_name = 'error_message' and data_type not in ('text', 'character varying')
      )
      union all
      select 'metadata (incompatible type: must be json/jsonb)' where exists (
        select 1 from information_schema.columns 
        where table_schema = 'public' and table_name = 'email_logs' 
          and column_name = 'metadata' and data_type not in ('json', 'jsonb')
      )
      union all
      select 'resend_id (incompatible type)' where exists (
        select 1 from information_schema.columns 
        where table_schema = 'public' and table_name = 'email_logs' 
          and column_name = 'resend_id' and data_type not in ('text', 'character varying')
      )
      union all
      select 'claim_token (incompatible type)' where exists (
        select 1 from information_schema.columns 
        where table_schema = 'public' and table_name = 'email_logs' 
          and column_name = 'claim_token' and data_type not in ('uuid', 'text', 'character varying')
      )
      union all
      select 'claimed_until (incompatible type)' where exists (
        select 1 from information_schema.columns 
        where table_schema = 'public' and table_name = 'email_logs' 
          and column_name = 'claimed_until' and data_type not in ('timestamp with time zone', 'timestamp without time zone')
      )
      union all
      select 'attempts (incompatible type: must be integer)' where exists (
        select 1 from information_schema.columns 
        where table_schema = 'public' and table_name = 'email_logs' 
          and column_name = 'attempts' and data_type not in ('integer', 'smallint', 'bigint')
      )
      union all
      select 'sent_at (incompatible type)' where exists (
        select 1 from information_schema.columns 
        where table_schema = 'public' and table_name = 'email_logs' 
          and column_name = 'sent_at' and data_type not in ('timestamp with time zone', 'timestamp without time zone')
      )
      union all
      select 'created_at (incompatible type)' where exists (
        select 1 from information_schema.columns 
        where table_schema = 'public' and table_name = 'email_logs' 
          and column_name = 'created_at' and data_type not in ('timestamp with time zone', 'timestamp without time zone')
      )
    ) missing_cols;

    if v_incompatible is not null and v_incompatible <> '' then
      raise exception 'Pre-migration check failed: Existing public.email_logs table has incompatible columns: %. Manual inspection required before running migration.', v_incompatible;
    end if;

    -- Detect existing NULL idempotency_key values
    select count(*) into v_null_count
    from public.email_logs
    where idempotency_key is null;

    if v_null_count > 0 then
      raise exception 'Pre-migration check failed: public.email_logs contains % row(s) with NULL idempotency_key. Fix data before running migration.', v_null_count;
    end if;

    -- Detect existing duplicate idempotency_key values
    select count(*) into v_dup_count
    from (
      select idempotency_key
      from public.email_logs
      group by idempotency_key
      having count(*) > 1
    ) dups;

    if v_dup_count > 0 then
      raise exception 'Pre-migration check failed: public.email_logs contains duplicate idempotency_key values across % key(s). Fix duplicates before running migration.', v_dup_count;
    end if;
  end if;
end $$;

-- 2. EMAIL LOGS TABLE: Track delivery, idempotency, worker leases, retries, and errors
create table if not exists public.email_logs (
  id uuid primary key default gen_random_uuid(),
  idempotency_key text unique not null,
  event_type text not null check (event_type in ('order_booking', 'dispatch_reminder', 'price_escalation')),
  reference_id text not null, -- order id (OB-XXXXXX) or submission ref (WC-XXXXXX)
  recipient_emails text[] not null,
  subject text not null,
  status text not null check (status in ('pending', 'sent', 'failed')) default 'pending',
  error_message text,
  metadata jsonb,
  resend_id text,
  claim_token uuid default gen_random_uuid(),
  claimed_until timestamp with time zone default (now() + interval '2 minutes'),
  attempts integer not null default 1,
  sent_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Upgrade existing table if any columns are missing
alter table public.email_logs add column if not exists subject text;
alter table public.email_logs add column if not exists error_message text;
alter table public.email_logs add column if not exists metadata jsonb;
alter table public.email_logs add column if not exists resend_id text;
alter table public.email_logs add column if not exists claim_token uuid default gen_random_uuid();
alter table public.email_logs add column if not exists claimed_until timestamp with time zone default (now() + interval '2 minutes');
alter table public.email_logs add column if not exists attempts integer not null default 1;
alter table public.email_logs add column if not exists sent_at timestamp with time zone;
alter table public.email_logs add column if not exists created_at timestamp with time zone default timezone('utc'::text, now());

-- Ensure a unique index/constraint exists on idempotency_key without creating redundant indexes.
-- Inspects both pg_index and pg_constraint.
do $$
declare
  v_has_unique boolean;
begin
  select exists (
    -- 1. Check pg_index for standalone unique indexes
    select 1
    from pg_index i
    join pg_attribute a on a.attrelid = i.indrelid and a.attnum = i.indkey[0]
    where i.indrelid = 'public.email_logs'::regclass
      and i.indisunique
      and i.indnatts = 1
      and a.attname = 'idempotency_key'
      and i.indpred is null
  ) or exists (
    -- 2. Check pg_constraint for unique or primary key constraints
    select 1
    from pg_constraint c
    join pg_attribute a on a.attrelid = c.conrelid and a.attnum = any(c.conkey)
    where c.conrelid = 'public.email_logs'::regclass
      and c.contype in ('u', 'p')
      and array_length(c.conkey, 1) = 1
      and a.attname = 'idempotency_key'
  ) into v_has_unique;

  if not v_has_unique then
    create unique index idx_email_logs_idempotency on public.email_logs(idempotency_key);
  end if;
end $$;

-- Secondary indexes for efficient lookups
create index if not exists idx_email_logs_ref on public.email_logs(reference_id, event_type);
create index if not exists idx_email_logs_status on public.email_logs(status, created_at);

-- Enable Row Level Security
alter table public.email_logs enable row level security;

-- Only full admins can view email delivery logs (dealers and order_admin cannot view)
drop policy if exists "Admins can view email logs" on public.email_logs;
create policy "Admins can view email logs" on public.email_logs
  for select using (public.is_admin());

-- 3. ATOMIC DISPATCH LOCK FUNCTION WITH LEASE / CLAIM-TOKEN
-- Prevents race conditions and fences out stale workers using unique claim tokens.
create or replace function public.claim_email_dispatch(
  p_idempotency_key text,
  p_event_type text,
  p_reference_id text,
  p_recipient_emails text[],
  p_subject text
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_existing_status text;
  v_created_at timestamptz;
  v_attempts int;
  v_resend_id text;
  v_claim_token uuid;
  v_claimed_until timestamptz;
begin
  -- Comprehensive parameter validation
  if p_idempotency_key is null or trim(p_idempotency_key) = '' then
    raise exception 'claim_email_dispatch: p_idempotency_key cannot be null or empty';
  end if;

  if p_event_type is null or p_event_type not in ('order_booking', 'dispatch_reminder', 'price_escalation') then
    raise exception 'claim_email_dispatch: invalid p_event_type (must be order_booking, dispatch_reminder, or price_escalation)';
  end if;

  if p_reference_id is null or trim(p_reference_id) = '' then
    raise exception 'claim_email_dispatch: p_reference_id cannot be null or empty';
  end if;

  if p_recipient_emails is null or coalesce(array_length(p_recipient_emails, 1), 0) = 0 then
    raise exception 'claim_email_dispatch: p_recipient_emails must contain at least one recipient email';
  end if;

  if p_subject is null or trim(p_subject) = '' then
    raise exception 'claim_email_dispatch: p_subject cannot be null or empty';
  end if;

  v_claim_token := gen_random_uuid();
  v_claimed_until := now() + interval '2 minutes';

  -- 1. Attempt atomic initial claim via ON CONFLICT DO NOTHING
  insert into public.email_logs (
    idempotency_key,
    event_type,
    reference_id,
    recipient_emails,
    subject,
    status,
    attempts,
    claim_token,
    claimed_until
  ) values (
    p_idempotency_key,
    p_event_type,
    p_reference_id,
    p_recipient_emails,
    p_subject,
    'pending',
    1,
    v_claim_token,
    v_claimed_until
  )
  on conflict (idempotency_key) do nothing;

  -- If inserted, caller has secured the initial lock and lease
  if found then
    return jsonb_build_object(
      'status', 'CLAIMED',
      'claim_token', v_claim_token
    );
  end if;

  -- 2. Row already exists: acquire exclusive row lock to serialize concurrent attempts
  select status, created_at, attempts, resend_id, claim_token, claimed_until
  into v_existing_status, v_created_at, v_attempts, v_resend_id, v_claim_token, v_claimed_until
  from public.email_logs
  where idempotency_key = p_idempotency_key
  for update;

  -- If already marked sent or provider accepted it (resend_id is present), do not resend
  if v_existing_status = 'sent' or v_resend_id is not null then
    return jsonb_build_object(
      'status', 'ALREADY_SENT',
      'resend_id', v_resend_id
    );
  elsif v_existing_status = 'pending' and coalesce(v_claimed_until, v_created_at + interval '2 minutes') > now() then
    -- Dispatch is currently in-flight by an active worker within lease window
    return jsonb_build_object(
      'status', 'IN_PROGRESS'
    );
  else
    -- Previous attempt failed or lease expired (> 2 minutes) without recorded delivery -> grant safe retry
    v_claim_token := gen_random_uuid();
    v_claimed_until := now() + interval '2 minutes';

    update public.email_logs
    set status = 'pending',
        attempts = coalesce(v_attempts, 1) + 1,
        claim_token = v_claim_token,
        claimed_until = v_claimed_until,
        error_message = null,
        created_at = now()
    where idempotency_key = p_idempotency_key;

    return jsonb_build_object(
      'status', 'RETRY_CLAIMED',
      'claim_token', v_claim_token
    );
  end if;
end;
$$;

-- Secure function execution grants: Restricted strictly to service_role (used by Edge Function).
-- Direct RPC invocation by authenticated users, dealers, or anon callers is forbidden.
revoke execute on function public.claim_email_dispatch(text, text, text, text[], text) from public, anon, authenticated;
grant execute on function public.claim_email_dispatch(text, text, text, text[], text) to service_role;

-- 4. DISPATCH REMINDER VIEW: Helper view to inspect orders due for dispatch tomorrow (IST)
-- Evaluated against orders.dispatch_date (type: date).
-- Current time in IST (Asia/Kolkata): UTC + 5 hours 30 minutes.
create or replace view public.orders_due_for_dispatch_tomorrow
with (security_invoker = true) as
select 
  o.id,
  o.user_id,
  p.email as dealer_email,
  o.dealer_name,
  o.sales_rep,
  o.customer_name,
  o.customer_phone,
  o.kva,
  o.sets_count,
  o.price_per_set,
  o.dispatch_date,
  o.status,
  o.created_at
from public.orders o
left join public.profiles p on o.user_id = p.id
where o.status = 'open'
  and o.dispatch_date = ((current_timestamp at time zone 'Asia/Kolkata') + interval '1 day')::date;

-- Revoke public access, allow authenticated dealers/admins (subject to RLS on orders/profiles) and service_role
revoke select on public.orders_due_for_dispatch_tomorrow from public, anon;
grant select on public.orders_due_for_dispatch_tomorrow to authenticated, service_role;

-- ==============================================================================
-- 5. CRON CONFIGURATION (pg_cron + pg_net setup instructions)
--
-- Required Supabase Secrets (set via Dashboard -> Project Settings -> Configuration -> Secrets):
--   RESEND_API_KEY      = re_xxxxxxxxxxxx
--   CRON_SECRET         = <generate_high_entropy_random_secret>
--   FROM_EMAIL          = notifications@westernconsolidated.com
--
-- To schedule the 4:00 PM IST dispatch reminder via Supabase SQL Editor:
--
--   create extension if not exists pg_cron;
--   create extension if not exists pg_net;
--
--   select cron.schedule(
--     'dispatch-reminders-daily-4pm-ist',
--     '30 10 * * *', -- 10:30 UTC is exactly 16:00 (4:00 PM) IST every day
--     $$
--     select
--       net.http_post(
--         url := 'https://<PROJECT_REF>.supabase.co/functions/v1/send-email',
--         headers := jsonb_build_object(
--           'Content-Type', 'application/json',
--           'x-cron-secret', '<CRON_SECRET>'
--         ),
--         body := jsonb_build_object(
--           'type', 'dispatch_reminders'
--         )
--       ) as request_id;
--     $$
--   );
-- ==============================================================================
