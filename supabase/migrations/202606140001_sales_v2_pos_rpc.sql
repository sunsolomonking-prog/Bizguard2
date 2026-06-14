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
