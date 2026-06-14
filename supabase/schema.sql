-- BizGuard production multi-tenant core schema, RLS policies, and safety triggers.
-- Apply with Supabase CLI: supabase db push

create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------
create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null default 'retail' check (type in ('retail','wholesale','pharmacy','restaurant','school','church','service','other')),
  industry text not null default 'Retail',
  location text default '',
  currency text not null default 'NGN',
  timezone text not null default 'Africa/Lagos',
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  name text not null default '',
  business_id uuid references public.businesses(id) on delete set null,
  role text not null default 'owner' check (role in ('owner','manager','staff')),
  created_at timestamptz not null default now()
);

create table if not exists public.business_members (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'staff' check (role in ('owner','manager','staff')),
  status text not null default 'active' check (status in ('active','invited','suspended')),
  created_at timestamptz not null default now(),
  unique (business_id, user_id)
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  sku text not null,
  category text not null default 'General',
  description text,
  cost_price numeric(12,2) not null default 0 check (cost_price >= 0),
  selling_price numeric(12,2) not null default 0 check (selling_price >= 0),
  quantity integer not null default 0 check (quantity >= 0),
  reorder_level integer not null default 10 check (reorder_level >= 0),
  supplier text,
  barcode text,
  images text[] not null default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (business_id, sku)
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  address text,
  credit_limit numeric(12,2) not null default 0 check (credit_limit >= 0),
  current_balance numeric(12,2) not null default 0,
  total_purchases numeric(12,2) not null default 0 check (total_purchases >= 0),
  last_purchase_date timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.sales (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  invoice_number text not null,
  subtotal numeric(12,2) not null default 0 check (subtotal >= 0),
  tax numeric(12,2) not null default 0 check (tax >= 0),
  discount numeric(12,2) not null default 0 check (discount >= 0),
  total numeric(12,2) not null default 0 check (total >= 0),
  payment_method text not null check (payment_method in ('cash','card','bank_transfer','mobile_money','mobile','credit')),
  status text not null default 'completed' check (status in ('completed','pending','refunded','cancelled')),
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  unique (business_id, invoice_number)
);

create table if not exists public.sale_items (
  id uuid primary key default gen_random_uuid(),
  sale_id uuid not null references public.sales(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(12,2) not null check (unit_price >= 0),
  discount numeric(12,2) not null default 0 check (discount >= 0),
  total numeric(12,2) not null check (total >= 0)
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  customer_id uuid not null references public.customers(id) on delete cascade,
  sale_id uuid references public.sales(id) on delete set null,
  invoice_number text not null,
  subtotal numeric(12,2) not null default 0 check (subtotal >= 0),
  tax numeric(12,2) not null default 0 check (tax >= 0),
  discount numeric(12,2) not null default 0 check (discount >= 0),
  total numeric(12,2) not null default 0 check (total >= 0),
  amount_paid numeric(12,2) not null default 0 check (amount_paid >= 0),
  balance numeric(12,2) not null default 0,
  due_date date not null,
  status text not null default 'pending' check (status in ('pending','paid','partial','overdue','cancelled')),
  created_at timestamptz not null default now(),
  unique (business_id, invoice_number)
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  customer_id uuid not null references public.customers(id) on delete cascade,
  amount numeric(12,2) not null check (amount > 0),
  method text not null check (method in ('cash','card','bank_transfer','mobile_money','mobile')),
  reference text,
  notes text,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null
);

create table if not exists public.alerts (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  type text not null check (type in ('low_stock','inventory_anomaly','overdue_payment','revenue_drop','sales_spike','risk_score_change','sales_target','anomaly','reminder')),
  severity text not null check (severity in ('info','warning','error','success')),
  title text not null,
  message text not null,
  is_read boolean not null default false,
  action_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.action_cards (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  type text not null check (type in ('urgent','important','routine','opportunity')),
  title text not null,
  description text not null,
  priority integer not null default 5 check (priority between 1 and 10),
  completed boolean not null default false,
  due_date timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.stock_movements (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  type text not null check (type in ('in','out','adjustment','return','sale')),
  quantity integer not null,
  reason text not null,
  reference text,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null
);

create table if not exists public.risk_scores (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  overall_score integer not null check (overall_score between 0 and 100),
  financial_score integer not null default 0 check (financial_score between 0 and 100),
  inventory_score integer not null default 0 check (inventory_score between 0 and 100),
  sales_score integer not null default 0 check (sales_score between 0 and 100),
  customers_score integer not null default 0 check (customers_score between 0 and 100),
  factors jsonb not null default '[]'::jsonb,
  last_updated timestamptz not null default now()
);

create table if not exists public.demand_predictions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  current_stock integer not null default 0,
  predicted_7_days integer not null default 0,
  predicted_30_days integer not null default 0,
  predicted_90_days integer not null default 0,
  recommended_order integer not null default 0,
  confidence numeric(5,2) not null default 0,
  last_updated timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references public.businesses(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  table_name text not null,
  record_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------
create index if not exists idx_business_members_user on public.business_members(user_id, status);
create index if not exists idx_business_members_business on public.business_members(business_id, status);
create index if not exists idx_products_business on public.products(business_id, is_active);
create index if not exists idx_products_search on public.products using gin (to_tsvector('simple', coalesce(name,'') || ' ' || coalesce(sku,'') || ' ' || coalesce(category,'')));
create index if not exists idx_customers_business on public.customers(business_id, is_active);
create index if not exists idx_sales_business_created on public.sales(business_id, created_at desc);
create index if not exists idx_sales_customer on public.sales(business_id, customer_id);
create index if not exists idx_sale_items_sale on public.sale_items(sale_id);
create index if not exists idx_invoices_business_status on public.invoices(business_id, status, due_date);
create index if not exists idx_payments_customer on public.payments(business_id, customer_id, created_at desc);
create index if not exists idx_alerts_business_read on public.alerts(business_id, is_read, created_at desc);
create index if not exists idx_stock_movements_business_product on public.stock_movements(business_id, product_id, created_at desc);
create index if not exists idx_audit_logs_business on public.audit_logs(business_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_businesses_touch_updated_at on public.businesses;
create trigger trg_businesses_touch_updated_at before update on public.businesses for each row execute function public.touch_updated_at();

drop trigger if exists trg_products_touch_updated_at on public.products;
create trigger trg_products_touch_updated_at before update on public.products for each row execute function public.touch_updated_at();

create or replace function public.is_business_member(target_business_id uuid, min_role text default null)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.business_members bm
    where bm.business_id = target_business_id
      and bm.user_id = auth.uid()
      and bm.status = 'active'
      and (
        min_role is null
        or bm.role = 'owner'
        or (min_role = 'staff' and bm.role in ('owner','manager','staff'))
        or (min_role = 'manager' and bm.role in ('owner','manager'))
      )
  );
$$;

create or replace function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_business_id uuid;
  business_name text;
  full_name text;
begin
  business_name := coalesce(new.raw_user_meta_data->>'business_name', 'My Business');
  full_name := coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1), 'Business Owner');

  insert into public.businesses (name, industry)
  values (business_name, coalesce(new.raw_user_meta_data->>'industry', 'Retail'))
  returning id into new_business_id;

  insert into public.users (id, email, name, business_id, role)
  values (new.id, new.email, full_name, new_business_id, 'owner');

  insert into public.business_members (business_id, user_id, role, status)
  values (new_business_id, new.id, 'owner', 'active');

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_create_bizguard_profile on auth.users;
create trigger on_auth_user_created_create_bizguard_profile
  after insert on auth.users
  for each row execute function public.create_profile_for_new_user();

create or replace function public.create_low_stock_alert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.quantity <= new.reorder_level and (tg_op = 'INSERT' or old.quantity is distinct from new.quantity or old.reorder_level is distinct from new.reorder_level) then
    insert into public.alerts (business_id, type, severity, title, message, action_url)
    values (
      new.business_id,
      'low_stock',
      case when new.quantity = 0 then 'error' else 'warning' end,
      'Low stock: ' || new.name,
      new.name || ' has ' || new.quantity || ' units remaining. Reorder level is ' || new.reorder_level || '.',
      '/inventory'
    );
  end if;
  return new;
end;
$$;

drop trigger if exists trg_products_low_stock_alert on public.products;
create trigger trg_products_low_stock_alert after insert or update of quantity, reorder_level on public.products for each row execute function public.create_low_stock_alert();

create or replace function public.apply_payment_to_invoice()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.invoices
     set amount_paid = amount_paid + new.amount,
         balance = greatest(total - (amount_paid + new.amount), 0),
         status = case
           when greatest(total - (amount_paid + new.amount), 0) = 0 then 'paid'
           else 'partial'
         end
   where id = new.invoice_id and business_id = new.business_id;

  update public.customers
     set current_balance = greatest(current_balance - new.amount, 0)
   where id = new.customer_id and business_id = new.business_id;

  return new;
end;
$$;

drop trigger if exists trg_payments_apply_to_invoice on public.payments;
create trigger trg_payments_apply_to_invoice after insert on public.payments for each row execute function public.apply_payment_to_invoice();

create or replace function public.generate_invoice_number(target_business_id uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  seq int;
begin
  select count(*) + 1 into seq
  from public.sales
  where business_id = target_business_id
    and created_at >= date_trunc('month', now());

  return 'INV-' || to_char(now(), 'YYMM') || '-' || lpad(seq::text, 4, '0');
end;
$$;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.businesses enable row level security;
alter table public.users enable row level security;
alter table public.business_members enable row level security;
alter table public.products enable row level security;
alter table public.customers enable row level security;
alter table public.sales enable row level security;
alter table public.sale_items enable row level security;
alter table public.invoices enable row level security;
alter table public.payments enable row level security;
alter table public.alerts enable row level security;
alter table public.action_cards enable row level security;
alter table public.stock_movements enable row level security;
alter table public.risk_scores enable row level security;
alter table public.demand_predictions enable row level security;
alter table public.audit_logs enable row level security;

-- Drop unsafe/old policies if present.
do $$
declare r record;
begin
  for r in select schemaname, tablename, policyname from pg_policies where schemaname = 'public'
  loop
    execute format('drop policy if exists %I on %I.%I', r.policyname, r.schemaname, r.tablename);
  end loop;
end $$;

create policy businesses_select_member on public.businesses for select using (public.is_business_member(id));
create policy businesses_update_manager on public.businesses for update using (public.is_business_member(id, 'manager')) with check (public.is_business_member(id, 'manager'));
create policy businesses_insert_authenticated on public.businesses for insert with check (auth.uid() is not null);

create policy users_select_self_or_member on public.users for select using (id = auth.uid() or public.is_business_member(business_id));
create policy users_update_self on public.users for update using (id = auth.uid()) with check (id = auth.uid());

create policy members_select_business on public.business_members for select using (user_id = auth.uid() or public.is_business_member(business_id));
create policy members_manage_owner on public.business_members for all using (public.is_business_member(business_id, 'owner')) with check (public.is_business_member(business_id, 'owner'));

create policy products_select_member on public.products for select using (public.is_business_member(business_id));
create policy products_insert_manager on public.products for insert with check (public.is_business_member(business_id, 'manager'));
create policy products_update_manager on public.products for update using (public.is_business_member(business_id, 'manager')) with check (public.is_business_member(business_id, 'manager'));
create policy products_delete_manager on public.products for delete using (public.is_business_member(business_id, 'manager'));

create policy customers_select_member on public.customers for select using (public.is_business_member(business_id));
create policy customers_write_staff on public.customers for all using (public.is_business_member(business_id, 'staff')) with check (public.is_business_member(business_id, 'staff'));

create policy sales_select_member on public.sales for select using (public.is_business_member(business_id));
create policy sales_insert_staff on public.sales for insert with check (public.is_business_member(business_id, 'staff'));
create policy sales_update_manager on public.sales for update using (public.is_business_member(business_id, 'manager')) with check (public.is_business_member(business_id, 'manager'));
create policy sales_delete_owner on public.sales for delete using (public.is_business_member(business_id, 'owner'));

create policy sale_items_select_member on public.sale_items for select using (exists (select 1 from public.sales s where s.id = sale_id and public.is_business_member(s.business_id)));
create policy sale_items_insert_staff on public.sale_items for insert with check (exists (select 1 from public.sales s where s.id = sale_id and public.is_business_member(s.business_id, 'staff')));
create policy sale_items_update_manager on public.sale_items for update using (exists (select 1 from public.sales s where s.id = sale_id and public.is_business_member(s.business_id, 'manager'))) with check (exists (select 1 from public.sales s where s.id = sale_id and public.is_business_member(s.business_id, 'manager')));
create policy sale_items_delete_owner on public.sale_items for delete using (exists (select 1 from public.sales s where s.id = sale_id and public.is_business_member(s.business_id, 'owner')));

create policy invoices_select_member on public.invoices for select using (public.is_business_member(business_id));
create policy invoices_write_staff on public.invoices for all using (public.is_business_member(business_id, 'staff')) with check (public.is_business_member(business_id, 'staff'));

create policy payments_select_member on public.payments for select using (public.is_business_member(business_id));
create policy payments_insert_staff on public.payments for insert with check (public.is_business_member(business_id, 'staff'));
create policy payments_update_manager on public.payments for update using (public.is_business_member(business_id, 'manager')) with check (public.is_business_member(business_id, 'manager'));
create policy payments_delete_owner on public.payments for delete using (public.is_business_member(business_id, 'owner'));

create policy alerts_select_member on public.alerts for select using (public.is_business_member(business_id));
create policy alerts_insert_manager on public.alerts for insert with check (public.is_business_member(business_id, 'manager'));
create policy alerts_update_member on public.alerts for update using (public.is_business_member(business_id)) with check (public.is_business_member(business_id));
create policy alerts_delete_manager on public.alerts for delete using (public.is_business_member(business_id, 'manager'));

create policy action_cards_member_all on public.action_cards for all using (public.is_business_member(business_id)) with check (public.is_business_member(business_id));
create policy stock_movements_member_select on public.stock_movements for select using (public.is_business_member(business_id));
create policy stock_movements_staff_insert on public.stock_movements for insert with check (public.is_business_member(business_id, 'staff'));
create policy risk_scores_member_select on public.risk_scores for select using (public.is_business_member(business_id));
create policy risk_scores_manager_write on public.risk_scores for all using (public.is_business_member(business_id, 'manager')) with check (public.is_business_member(business_id, 'manager'));
create policy demand_predictions_member_select on public.demand_predictions for select using (public.is_business_member(business_id));
create policy demand_predictions_manager_write on public.demand_predictions for all using (public.is_business_member(business_id, 'manager')) with check (public.is_business_member(business_id, 'manager'));
create policy audit_logs_owner_select on public.audit_logs for select using (public.is_business_member(business_id, 'owner'));
-- BizGuard Sales V2 atomic POS transaction function.
-- Creates sales, sale_items, invoices, customer balance updates, stock movements,
-- and inventory reductions in one database transaction.

create or replace function public.create_pos_sale(
  p_business_id uuid,
  p_customer_id uuid default null,
  p_payment_method text default 'cash',
  p_discount numeric default 0,
  p_tax numeric default 0,
  p_due_date date default null,
  p_items jsonb default '[]'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  item jsonb;
  product_record record;
  item_product_id uuid;
  item_quantity integer;
  item_discount numeric(12,2);
  line_total numeric(12,2);
  subtotal_amount numeric(12,2) := 0;
  item_discount_total numeric(12,2) := 0;
  total_discount numeric(12,2) := 0;
  total_amount numeric(12,2) := 0;
  new_sale_id uuid;
  new_invoice_number text;
  resolved_due_date date;
  resolved_customer_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if not public.is_business_member(p_business_id, 'staff') then
    raise exception 'You do not have permission to create sales for this business';
  end if;

  if p_payment_method not in ('cash', 'credit') then
    raise exception 'Unsupported payment method: %', p_payment_method;
  end if;

  if p_payment_method = 'credit' and p_customer_id is null then
    raise exception 'Credit sales require a customer';
  end if;

  if p_customer_id is not null and not exists (
    select 1 from public.customers
    where id = p_customer_id
      and business_id = p_business_id
      and is_active = true
  ) then
    raise exception 'Customer does not belong to this business or is inactive';
  end if;

  if p_customer_id is null then
    select id into resolved_customer_id
    from public.customers
    where business_id = p_business_id
      and name = 'Walk-in Customer'
      and is_active = true
    order by created_at asc
    limit 1;

    if resolved_customer_id is null then
      insert into public.customers (business_id, name, is_active)
      values (p_business_id, 'Walk-in Customer', true)
      returning id into resolved_customer_id;
    end if;
  else
    resolved_customer_id := p_customer_id;
  end if;

  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'At least one sale item is required';
  end if;

  -- Validate stock and calculate totals while taking row locks.
  for item in select * from jsonb_array_elements(p_items)
  loop
    item_product_id := (item->>'product_id')::uuid;
    item_quantity := coalesce((item->>'quantity')::integer, 0);
    item_discount := coalesce((item->>'discount')::numeric, 0);

    if item_quantity <= 0 then
      raise exception 'Sale item quantity must be greater than zero';
    end if;

    if item_discount < 0 then
      raise exception 'Sale item discount cannot be negative';
    end if;

    select * into product_record
    from public.products
    where id = item_product_id
      and business_id = p_business_id
      and is_active = true
    for update;

    if not found then
      raise exception 'Product % was not found in this business', item_product_id;
    end if;

    if product_record.quantity < item_quantity then
      raise exception 'Insufficient stock for %. Available: %, requested: %', product_record.name, product_record.quantity, item_quantity;
    end if;

    subtotal_amount := subtotal_amount + (product_record.selling_price * item_quantity);
    item_discount_total := item_discount_total + item_discount;
  end loop;

  total_discount := coalesce(p_discount, 0) + item_discount_total;

  if total_discount < 0 then
    raise exception 'Discount cannot be negative';
  end if;

  if coalesce(p_tax, 0) < 0 then
    raise exception 'Tax cannot be negative';
  end if;

  total_amount := greatest(subtotal_amount + coalesce(p_tax, 0) - total_discount, 0);
  new_invoice_number := public.generate_invoice_number(p_business_id);
  resolved_due_date := coalesce(p_due_date, current_date + interval '14 days');

  insert into public.sales (
    business_id,
    customer_id,
    invoice_number,
    subtotal,
    tax,
    discount,
    total,
    payment_method,
    status,
    created_by
  ) values (
    p_business_id,
    resolved_customer_id,
    new_invoice_number,
    subtotal_amount,
    coalesce(p_tax, 0),
    total_discount,
    total_amount,
    p_payment_method,
    case when p_payment_method = 'credit' then 'pending' else 'completed' end,
    auth.uid()
  ) returning id into new_sale_id;

  -- Create sale items, reduce inventory, and record stock movements.
  for item in select * from jsonb_array_elements(p_items)
  loop
    item_product_id := (item->>'product_id')::uuid;
    item_quantity := coalesce((item->>'quantity')::integer, 0);
    item_discount := coalesce((item->>'discount')::numeric, 0);

    select * into product_record
    from public.products
    where id = item_product_id
      and business_id = p_business_id
      and is_active = true
    for update;

    line_total := greatest((product_record.selling_price * item_quantity) - item_discount, 0);

    insert into public.sale_items (
      sale_id,
      product_id,
      product_name,
      quantity,
      unit_price,
      discount,
      total
    ) values (
      new_sale_id,
      item_product_id,
      product_record.name,
      item_quantity,
      product_record.selling_price,
      item_discount,
      line_total
    );

    update public.products
       set quantity = quantity - item_quantity
     where id = item_product_id
       and business_id = p_business_id;

    insert into public.stock_movements (
      business_id,
      product_id,
      type,
      quantity,
      reason,
      reference,
      created_by
    ) values (
      p_business_id,
      item_product_id,
      'sale',
      -item_quantity,
      'POS sale',
      new_invoice_number,
      auth.uid()
    );
  end loop;

  insert into public.invoices (
    business_id,
    customer_id,
    sale_id,
    invoice_number,
    subtotal,
    tax,
    discount,
    total,
    amount_paid,
    balance,
    due_date,
    status
  ) values (
    p_business_id,
    resolved_customer_id,
    new_sale_id,
    new_invoice_number,
    subtotal_amount,
    coalesce(p_tax, 0),
    total_discount,
    total_amount,
    case when p_payment_method = 'cash' then total_amount else 0 end,
    case when p_payment_method = 'cash' then 0 else total_amount end,
    resolved_due_date,
    case when p_payment_method = 'cash' then 'paid' else 'pending' end
  );

  update public.customers
     set total_purchases = total_purchases + total_amount,
         current_balance = current_balance + case when p_payment_method = 'credit' then total_amount else 0 end,
         last_purchase_date = now()
   where id = resolved_customer_id
     and business_id = p_business_id;

  return new_sale_id;
end;
$$;

grant execute on function public.create_pos_sale(uuid, uuid, text, numeric, numeric, date, jsonb) to authenticated;
