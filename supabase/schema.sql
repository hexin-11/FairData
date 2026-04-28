-- FairData DB Schema
-- Run this in Supabase SQL Editor

-- ============================================================
-- EXTENSIONS
-- ============================================================
create extension if not exists "pgcrypto";

-- ============================================================
-- DATASETS
-- ============================================================
create table datasets (
  id            uuid primary key default gen_random_uuid(),
  creator_id    uuid not null references auth.users(id),
  title         text not null,
  description   text not null,
  license_type  text not null check (license_type in ('commercial_training', 'fine_tuning_only', 'no_derivatives')),
  price_usd     numeric(10, 2) not null check (price_usd > 0),
  file_path     text not null,
  file_size     bigint not null,
  sha256_hash   text,               -- populated by Edge Function after upload
  no_pii_confirmed boolean not null default false,
  ip_confirmed  boolean not null default false,
  status        text not null default 'pending' check (status in ('pending', 'active', 'inactive')),
  created_at    timestamptz not null default now()
);

-- ============================================================
-- TRANSACTIONS
-- ============================================================
create table transactions (
  id                  uuid primary key default gen_random_uuid(),
  dataset_id          uuid not null references datasets(id),
  buyer_email         text not null,
  buyer_company       text not null,
  stripe_payment_id   text not null unique,
  amount_usd          numeric(10, 2) not null,
  platform_fee_usd    numeric(10, 2) not null,
  creator_payout_usd  numeric(10, 2) not null,
  status              text not null default 'pending' check (status in ('pending', 'completed', 'disputed', 'refunded')),
  payout_scheduled_at timestamptz,   -- now() + 10 days, set on completion
  payout_released_at  timestamptz,
  created_at          timestamptz not null default now()
);

-- ============================================================
-- CERTIFICATES (append-only)
-- ============================================================
create table certificates (
  id              uuid primary key default gen_random_uuid(),
  transaction_id  uuid not null references transactions(id) unique,
  dataset_hash    text not null,
  buyer_email     text not null,
  license_type    text not null,
  price_usd       numeric(10, 2) not null,
  issued_at       timestamptz not null default now(),
  pdf_path        text not null        -- path in Supabase Storage
);

-- ============================================================
-- AUDIT LOG (append-only tamper-evidence)
-- ============================================================
create table audit_log (
  id              bigserial primary key,
  certificate_id  uuid not null references certificates(id),
  row_hash        text not null,      -- SHA-256 of pipe-delimited canonical fields
  created_at      timestamptz not null default now()
);

-- ============================================================
-- RESTRICTED ROLE (append-only for certificates + audit_log)
-- Application uses this role for all certificate writes.
-- DO NOT use the service-role key for certificate/audit_log writes.
-- ============================================================
do $$
begin
  if not exists (select from pg_roles where rolname = 'fairdata_writer') then
    create role fairdata_writer;
  end if;
end
$$;

grant usage on schema public to fairdata_writer;
grant insert, select on certificates to fairdata_writer;
grant insert, select on audit_log to fairdata_writer;
grant usage on sequence audit_log_id_seq to fairdata_writer;
-- No UPDATE or DELETE granted — enforces append-only behavior

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table datasets     enable row level security;
alter table transactions  enable row level security;
alter table certificates  enable row level security;
alter table audit_log     enable row level security;

-- Datasets: creators see their own; everyone sees active ones
create policy "creators manage own datasets"
  on datasets for all
  using (auth.uid() = creator_id);

create policy "public can view active datasets"
  on datasets for select
  using (status = 'active');

-- Transactions: buyer can view their own (by email match via JWT claim or function)
-- Simplified for MVP — service role handles inserts via webhook
create policy "service role manages transactions"
  on transactions for all
  using (true)
  with check (true);

-- Certificates: buyer retrieves by transaction_id (public read for download page)
create policy "public can read certificates"
  on certificates for select
  using (true);

-- Audit log: read-only for authenticated users
create policy "authenticated can read audit_log"
  on audit_log for select
  using (auth.role() = 'authenticated');

-- ============================================================
-- INDEXES
-- ============================================================
create index on datasets (creator_id);
create index on datasets (status);
create index on transactions (stripe_payment_id);
create index on transactions (dataset_id);
create index on certificates (transaction_id);
create index on audit_log (certificate_id);
