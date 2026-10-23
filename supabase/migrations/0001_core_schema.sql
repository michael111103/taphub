-- TapHub App: skema inti (organisasi, langganan, akuntansi)
create extension if not exists pgcrypto with schema extensions;

-- =========================================================
-- PROFIL, ORGANISASI, ANGGOTA
-- =========================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  current_org_id uuid,
  created_at timestamptz not null default now()
);

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  legal_name text,
  industry text,
  email text,
  phone text,
  address text,
  city text,
  npwp text,
  logo_url text,
  currency text not null default 'IDR',
  created_by uuid references auth.users(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now()
);

alter table public.profiles
  add constraint profiles_current_org_fk foreign key (current_org_id) references public.organizations(id) on delete set null;

create type public.member_role as enum ('owner', 'admin', 'staff');

create table public.org_members (
  org_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.member_role not null default 'staff',
  created_at timestamptz not null default now(),
  primary key (org_id, user_id)
);
create index org_members_user_idx on public.org_members(user_id);

create or replace function public.is_org_member(p_org uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.org_members m where m.org_id = p_org and m.user_id = (select auth.uid()));
$$;

create or replace function public.is_org_admin(p_org uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.org_members m
    where m.org_id = p_org and m.user_id = (select auth.uid()) and m.role in ('owner', 'admin')
  );
$$;

create or replace function public.shares_org_with(p_user uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.org_members a join public.org_members b on a.org_id = b.org_id
    where a.user_id = (select auth.uid()) and b.user_id = p_user
  );
$$;

-- =========================================================
-- PRODUK TAPHUB, PAKET, LANGGANAN, TAGIHAN LANGGANAN
-- =========================================================
create table public.tap_products (
  code text primary key,
  name text not null,
  tagline text,
  sort int not null default 0,
  is_available boolean not null default true
);

create table public.plans (
  id uuid primary key default gen_random_uuid(),
  product_code text not null references public.tap_products(code) on delete cascade,
  code text not null unique,
  name text not null,
  description text,
  price_monthly bigint not null,
  price_yearly bigint not null,
  features text[] not null default '{}',
  highlighted boolean not null default false,
  sort int not null default 0,
  is_active boolean not null default true
);
create index plans_product_idx on public.plans(product_code);

create type public.sub_status as enum ('trial', 'active', 'past_due', 'canceled', 'expired');
create type public.billing_cycle as enum ('monthly', 'yearly');

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  product_code text not null references public.tap_products(code),
  plan_id uuid references public.plans(id),
  status public.sub_status not null default 'trial',
  cycle public.billing_cycle,
  trial_ends_at timestamptz,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  unique (org_id, product_code)
);
create index subscriptions_plan_idx on public.subscriptions(plan_id);
create index subscriptions_product_idx on public.subscriptions(product_code);

create type public.bill_status as enum ('pending', 'paid', 'expired', 'canceled');

create table public.billing_invoices (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  number text not null unique,
  plan_id uuid not null references public.plans(id),
  cycle public.billing_cycle not null,
  subtotal bigint not null,
  discount bigint not null default 0,
  tax bigint not null default 0,
  total bigint not null,
  status public.bill_status not null default 'pending',
  payment_method text,
  payment_channel text,
  external_id text,
  payment_url text,
  expires_at timestamptz,
  paid_at timestamptz,
  created_by uuid references auth.users(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now()
);
create index billing_invoices_org_idx on public.billing_invoices(org_id);
create index billing_invoices_plan_idx on public.billing_invoices(plan_id);
create index billing_invoices_created_by_idx on public.billing_invoices(created_by);

-- =========================================================
-- AKUNTANSI
-- =========================================================
create type public.account_category as enum (
  'kas_bank', 'piutang', 'persediaan', 'aset_lancar_lain', 'aset_tetap', 'depresiasi',
  'hutang', 'kewajiban_lancar_lain', 'kewajiban_jangka_panjang', 'modal',
  'pendapatan', 'hpp', 'beban', 'pendapatan_lain', 'beban_lain'
);

create table public.accounts (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  code text not null,
  name text not null,
  category public.account_category not null,
  system_key text,
  description text,
  is_archived boolean not null default false,
  created_at timestamptz not null default now(),
  unique (org_id, code),
  unique (org_id, system_key)
);

create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  kind text[] not null default '{customer}',
  name text not null,
  company text,
  email text,
  phone text,
  address text,
  city text,
  npwp text,
  notes text,
  created_at timestamptz not null default now()
);
create index contacts_org_idx on public.contacts(org_id);

create table public.items (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  sku text,
  name text not null,
  unit text not null default 'pcs',
  category text,
  description text,
  buy_price numeric(18,2) not null default 0,
  sell_price numeric(18,2) not null default 0,
  track_stock boolean not null default true,
  stock_qty numeric(18,2) not null default 0,
  min_stock numeric(18,2) not null default 0,
  is_archived boolean not null default false,
  created_at timestamptz not null default now(),
  unique (org_id, sku)
);

create table public.sales_documents (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  kind text not null check (kind in ('quote', 'order', 'invoice')),
  number text not null,
  contact_id uuid references public.contacts(id) on delete set null,
  date date not null default current_date,
  due_date date,
  reference text,
  notes text,
  status text not null default 'open' check (status in ('draft', 'open', 'partial', 'paid', 'void', 'accepted', 'rejected', 'done')),
  subtotal numeric(18,2) not null default 0,
  discount numeric(18,2) not null default 0,
  tax numeric(18,2) not null default 0,
  total numeric(18,2) not null default 0,
  paid_amount numeric(18,2) not null default 0,
  source_id uuid references public.sales_documents(id) on delete set null,
  created_by uuid references auth.users(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  unique (org_id, number)
);
create index sales_documents_org_kind_idx on public.sales_documents(org_id, kind, date desc);
create index sales_documents_contact_idx on public.sales_documents(contact_id);
create index sales_documents_source_idx on public.sales_documents(source_id);
create index sales_documents_created_by_idx on public.sales_documents(created_by);

create table public.sales_document_lines (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  document_id uuid not null references public.sales_documents(id) on delete cascade,
  item_id uuid references public.items(id) on delete set null,
  description text,
  qty numeric(18,2) not null default 1,
  unit text,
  price numeric(18,2) not null default 0,
  discount_pct numeric(5,2) not null default 0,
  tax_rate numeric(5,2) not null default 0,
  amount numeric(18,2) not null default 0,
  sort int not null default 0
);
create index sales_lines_doc_idx on public.sales_document_lines(document_id);
create index sales_lines_item_idx on public.sales_document_lines(item_id);
create index sales_lines_org_idx on public.sales_document_lines(org_id);

create table public.purchase_documents (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  kind text not null check (kind in ('quote', 'order', 'bill')),
  number text not null,
  contact_id uuid references public.contacts(id) on delete set null,
  date date not null default current_date,
  due_date date,
  reference text,
  notes text,
  status text not null default 'open' check (status in ('draft', 'open', 'partial', 'paid', 'void', 'accepted', 'rejected', 'done')),
  subtotal numeric(18,2) not null default 0,
  discount numeric(18,2) not null default 0,
  tax numeric(18,2) not null default 0,
  total numeric(18,2) not null default 0,
  paid_amount numeric(18,2) not null default 0,
  source_id uuid references public.purchase_documents(id) on delete set null,
  created_by uuid references auth.users(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  unique (org_id, number)
);
create index purchase_documents_org_kind_idx on public.purchase_documents(org_id, kind, date desc);
create index purchase_documents_contact_idx on public.purchase_documents(contact_id);
create index purchase_documents_source_idx on public.purchase_documents(source_id);
create index purchase_documents_created_by_idx on public.purchase_documents(created_by);

create table public.purchase_document_lines (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  document_id uuid not null references public.purchase_documents(id) on delete cascade,
  item_id uuid references public.items(id) on delete set null,
  account_id uuid references public.accounts(id) on delete set null,
  description text,
  qty numeric(18,2) not null default 1,
  unit text,
  price numeric(18,2) not null default 0,
  discount_pct numeric(5,2) not null default 0,
  tax_rate numeric(5,2) not null default 0,
  amount numeric(18,2) not null default 0,
  sort int not null default 0
);
create index purchase_lines_doc_idx on public.purchase_document_lines(document_id);
create index purchase_lines_item_idx on public.purchase_document_lines(item_id);
create index purchase_lines_account_idx on public.purchase_document_lines(account_id);
create index purchase_lines_org_idx on public.purchase_document_lines(org_id);

create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  number text not null,
  contact_id uuid references public.contacts(id) on delete set null,
  date date not null default current_date,
  due_date date,
  pay_from_account_id uuid references public.accounts(id) on delete set null,
  status text not null default 'open' check (status in ('open', 'partial', 'paid', 'void')),
  subtotal numeric(18,2) not null default 0,
  tax numeric(18,2) not null default 0,
  total numeric(18,2) not null default 0,
  paid_amount numeric(18,2) not null default 0,
  reference text,
  notes text,
  created_by uuid references auth.users(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  unique (org_id, number)
);
create index expenses_org_idx on public.expenses(org_id, date desc);
create index expenses_contact_idx on public.expenses(contact_id);
create index expenses_account_idx on public.expenses(pay_from_account_id);
create index expenses_created_by_idx on public.expenses(created_by);

create table public.expense_lines (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  expense_id uuid not null references public.expenses(id) on delete cascade,
  account_id uuid not null references public.accounts(id),
  description text,
  amount numeric(18,2) not null default 0,
  tax_rate numeric(5,2) not null default 0,
  sort int not null default 0
);
create index expense_lines_expense_idx on public.expense_lines(expense_id);
create index expense_lines_account_idx on public.expense_lines(account_id);
create index expense_lines_org_idx on public.expense_lines(org_id);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  direction text not null check (direction in ('in', 'out')),
  source_type text not null check (source_type in ('sales', 'purchase', 'expense')),
  source_id uuid not null,
  account_id uuid not null references public.accounts(id),
  date date not null default current_date,
  amount numeric(18,2) not null,
  notes text,
  created_at timestamptz not null default now()
);
create index payments_org_idx on public.payments(org_id, date desc);
create index payments_source_idx on public.payments(source_id);
create index payments_account_idx on public.payments(account_id);

create table public.bank_transactions (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  number text not null,
  kind text not null check (kind in ('receive', 'spend', 'transfer')),
  account_id uuid not null references public.accounts(id),
  counter_account_id uuid not null references public.accounts(id),
  contact_id uuid references public.contacts(id) on delete set null,
  date date not null default current_date,
  amount numeric(18,2) not null check (amount > 0),
  description text,
  created_at timestamptz not null default now(),
  unique (org_id, number)
);
create index bank_tx_org_idx on public.bank_transactions(org_id, date desc);
create index bank_tx_account_idx on public.bank_transactions(account_id);
create index bank_tx_counter_idx on public.bank_transactions(counter_account_id);
create index bank_tx_contact_idx on public.bank_transactions(contact_id);

create table public.fixed_assets (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  number text not null,
  name text not null,
  acquired_on date not null default current_date,
  cost numeric(18,2) not null,
  asset_account_id uuid not null references public.accounts(id),
  paid_from_account_id uuid references public.accounts(id),
  useful_life_months int not null default 48,
  salvage_value numeric(18,2) not null default 0,
  status text not null default 'active' check (status in ('active', 'disposed')),
  notes text,
  created_at timestamptz not null default now(),
  unique (org_id, number)
);
create index fixed_assets_org_idx on public.fixed_assets(org_id);
create index fixed_assets_asset_acct_idx on public.fixed_assets(asset_account_id);
create index fixed_assets_paid_acct_idx on public.fixed_assets(paid_from_account_id);

create table public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  number text not null,
  date date not null,
  memo text,
  source_type text,
  source_id uuid,
  created_at timestamptz not null default now(),
  unique (org_id, number)
);
create index journal_entries_org_idx on public.journal_entries(org_id, date);
create index journal_entries_source_idx on public.journal_entries(source_id);

create table public.journal_lines (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  entry_id uuid not null references public.journal_entries(id) on delete cascade,
  account_id uuid not null references public.accounts(id),
  debit numeric(18,2) not null default 0,
  credit numeric(18,2) not null default 0,
  description text
);
create index journal_lines_entry_idx on public.journal_lines(entry_id);
create index journal_lines_account_idx on public.journal_lines(account_id);
create index journal_lines_org_idx on public.journal_lines(org_id);

create table public.inventory_movements (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  item_id uuid not null references public.items(id) on delete cascade,
  date date not null default current_date,
  qty numeric(18,2) not null,
  unit_cost numeric(18,2) not null default 0,
  source_type text,
  source_id uuid,
  note text,
  created_at timestamptz not null default now()
);
create index inventory_movements_item_idx on public.inventory_movements(item_id, date desc);
create index inventory_movements_org_idx on public.inventory_movements(org_id);

create table public.doc_sequences (
  org_id uuid not null references public.organizations(id) on delete cascade,
  key text not null,
  last int not null default 0,
  primary key (org_id, key)
);

-- =========================================================
-- RLS
-- =========================================================
alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.org_members enable row level security;
alter table public.tap_products enable row level security;
alter table public.plans enable row level security;
alter table public.subscriptions enable row level security;
alter table public.billing_invoices enable row level security;

create policy "profil sendiri atau satu organisasi" on public.profiles for select to authenticated
  using (id = (select auth.uid()) or public.shares_org_with(id));
create policy "ubah profil sendiri" on public.profiles for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

create policy "anggota melihat organisasi" on public.organizations for select to authenticated
  using (public.is_org_member(id));
create policy "admin mengubah organisasi" on public.organizations for update to authenticated
  using (public.is_org_admin(id)) with check (public.is_org_admin(id));

create policy "anggota melihat anggota" on public.org_members for select to authenticated
  using (public.is_org_member(org_id));

create policy "produk publik" on public.tap_products for select to anon, authenticated using (true);
create policy "paket publik" on public.plans for select to anon, authenticated using (is_active);

create policy "anggota melihat langganan" on public.subscriptions for select to authenticated
  using (public.is_org_member(org_id));
create policy "anggota melihat tagihan langganan" on public.billing_invoices for select to authenticated
  using (public.is_org_member(org_id));

do $$
declare t text;
begin
  foreach t in array array[
    'accounts', 'contacts', 'items', 'sales_documents', 'sales_document_lines',
    'purchase_documents', 'purchase_document_lines', 'expenses', 'expense_lines',
    'payments', 'bank_transactions', 'fixed_assets', 'journal_entries', 'journal_lines',
    'inventory_movements', 'doc_sequences'
  ] loop
    execute format('alter table public.%I enable row level security', t);
    execute format(
      'create policy "anggota organisasi" on public.%I for all to authenticated using (public.is_org_member(org_id)) with check (public.is_org_member(org_id))',
      t
    );
  end loop;
end $$;
