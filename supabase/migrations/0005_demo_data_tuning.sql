-- Penyesuaian volume data contoh (sama dengan versi terbaru di 0003)
create or replace function public.seed_demo_data(p_org uuid)
returns void language plpgsql security invoker set search_path = '' as $$
declare
  v_bank uuid := public.acct(p_org, 'bank'); v_cash uuid := public.acct(p_org, 'cash');
  v_customers uuid[]; v_vendors uuid[]; v_items uuid[]; v_prices numeric[]; v_units text[];
  v_day date; v_n int; v_lines jsonb; v_doc uuid; v_k int; v_idx int; v_qty int; v_total numeric;
  v_growth numeric; v_pay uuid;
begin
  if not public.is_org_member(p_org) then raise exception 'Tidak punya akses'; end if;
  if exists (select 1 from public.sales_documents where org_id = p_org) then
    raise exception 'Data contoh hanya bisa diisi saat belum ada transaksi';
  end if;
  perform setseed(0.42);

  with c as (
    insert into public.contacts (org_id, kind, name, company, phone, city) values
      (p_org, '{customer}', 'Kopi Senja', 'Kopi Senja', '0812-1000-2001', 'Semarang'),
      (p_org, '{customer}', 'Warung Sari Rasa', 'Sari Rasa', '0812-1000-2002', 'Yogyakarta'),
      (p_org, '{customer}', 'Toko Berkah Jaya', 'Berkah Jaya', '0812-1000-2003', 'Surabaya'),
      (p_org, '{customer}', 'CV Maju Bersama', 'CV Maju Bersama', '0812-1000-2004', 'Jakarta'),
      (p_org, '{customer}', 'Kedai Teduh', 'Kedai Teduh', '0812-1000-2005', 'Bandung'),
      (p_org, '{customer}', 'Hotel Cendana', 'Hotel Cendana', '0812-1000-2006', 'Solo'),
      (p_org, '{customer}', 'Resto Pelangi', 'Resto Pelangi', '0812-1000-2007', 'Semarang'),
      (p_org, '{customer}', 'Pelanggan Umum', null, null, null)
    returning id)
  select array_agg(id) into v_customers from c;

  with v as (
    insert into public.contacts (org_id, kind, name, company, phone, city) values
      (p_org, '{vendor}', 'PT Sumber Pangan', 'PT Sumber Pangan', '0813-2000-3001', 'Jakarta'),
      (p_org, '{vendor}', 'UD Kemasan Prima', 'UD Kemasan Prima', '0813-2000-3002', 'Semarang'),
      (p_org, '{vendor}', 'CV Biji Kopi Nusantara', 'CV Biji Kopi Nusantara', '0813-2000-3003', 'Temanggung')
    returning id)
  select array_agg(id) into v_vendors from v;

  with i as (
    insert into public.items (org_id, sku, name, unit, category, buy_price, sell_price, track_stock, stock_qty, min_stock) values
      (p_org, 'KP-001', 'Biji Kopi Arabika 1kg', 'kg', 'Bahan Baku', 165000, 240000, true, 0, 10),
      (p_org, 'KP-002', 'Biji Kopi Robusta 1kg', 'kg', 'Bahan Baku', 95000, 150000, true, 0, 10),
      (p_org, 'SU-001', 'Susu UHT 1L', 'pcs', 'Bahan Baku', 16000, 24000, true, 0, 24),
      (p_org, 'GL-001', 'Gula Aren Cair 1L', 'botol', 'Bahan Baku', 38000, 58000, true, 0, 12),
      (p_org, 'CP-001', 'Cup Plastik 16oz (50)', 'pak', 'Kemasan', 32000, 48000, true, 0, 20),
      (p_org, 'MC-001', 'Mesin Grinder Mini', 'unit', 'Peralatan', 850000, 1350000, true, 0, 2),
      (p_org, 'MD-001', 'Tumbler TapHub', 'pcs', 'Merchandise', 45000, 85000, true, 0, 15),
      (p_org, 'JS-001', 'Jasa Pelatihan Barista', 'sesi', 'Jasa', 0, 750000, false, 0, 0)
    returning id, sell_price, unit)
  select array_agg(id), array_agg(sell_price), array_agg(unit) into v_items, v_prices, v_units from i;

  -- Modal awal
  perform public.create_bank_transaction(p_org, jsonb_build_object('kind', 'receive', 'account_id', v_bank,
    'counter_account_id', public.acct(p_org, 'equity'), 'amount', 150000000, 'date', current_date - 170, 'description', 'Setoran modal awal'));
  perform public.create_bank_transaction(p_org, jsonb_build_object('kind', 'transfer', 'account_id', v_bank,
    'counter_account_id', v_cash, 'amount', 10000000, 'date', current_date - 169, 'description', 'Kas kecil operasional'));

  -- Stok awal lewat tagihan pembelian (dibayar)
  for v_k in 1..7 loop
    v_doc := public.create_purchase_document(p_org, jsonb_build_object('kind', 'bill', 'contact_id', v_vendors[1 + (v_k % 3)],
      'date', current_date - 165 + v_k, 'due_date', current_date - 135 + v_k,
      'lines', jsonb_build_array(jsonb_build_object('item_id', v_items[v_k], 'qty', case when v_k = 6 then 15 else 160 end,
        'unit', v_units[v_k], 'price', (select buy_price from public.items where id = v_items[v_k]), 'tax_rate', 11))));
    select total into v_total from public.purchase_documents where id = v_doc;
    perform public.record_payment(p_org, 'purchase', v_doc, v_bank, v_total, current_date - 160 + v_k, null);
  end loop;

  -- Restock bulanan
  for v_k in 1..5 loop
    v_doc := public.create_purchase_document(p_org, jsonb_build_object('kind', 'bill', 'contact_id', v_vendors[1 + (v_k % 3)],
      'date', current_date - 150 + v_k * 30, 'due_date', current_date - 120 + v_k * 30,
      'lines', jsonb_build_array(
        jsonb_build_object('item_id', v_items[1], 'qty', 140, 'unit', 'kg', 'price', 165000, 'tax_rate', 11),
        jsonb_build_object('item_id', v_items[2], 'qty', 90, 'unit', 'kg', 'price', 95000, 'tax_rate', 11),
        jsonb_build_object('item_id', v_items[3], 'qty', 160, 'unit', 'pcs', 'price', 16000, 'tax_rate', 11),
        jsonb_build_object('item_id', v_items[4], 'qty', 70, 'unit', 'botol', 'price', 38000, 'tax_rate', 11),
        jsonb_build_object('item_id', v_items[5], 'qty', 120, 'unit', 'pak', 'price', 32000, 'tax_rate', 11),
        jsonb_build_object('item_id', v_items[7], 'qty', 40, 'unit', 'pcs', 'price', 45000, 'tax_rate', 11),
        jsonb_build_object('item_id', v_items[6], 'qty', 6, 'unit', 'unit', 'price', 850000, 'tax_rate', 11))));
    if v_k < 5 then
      select total into v_total from public.purchase_documents where id = v_doc;
      perform public.record_payment(p_org, 'purchase', v_doc, v_bank, v_total, current_date - 140 + v_k * 30, null);
    end if;
  end loop;

  -- Penjualan harian dengan tren naik
  for v_day in select d::date from generate_series(current_date - 150, current_date, interval '1 day') d loop
    v_growth := 1 + (150 - (current_date - v_day)) / 150.0;
    v_n := 1 + floor(random() * 3 * v_growth)::int + case when extract(isodow from v_day) in (6, 7) then 1 else 0 end;
    for v_k in 1..v_n loop
      v_lines := '[]'::jsonb;
      for v_idx in 1..(1 + floor(random() * 3)::int) loop
        v_qty := 1 + floor(random() * 6)::int;
        declare j int := 1 + floor(power(random(), 1.6) * array_length(v_items, 1))::int;
        begin
          if j > array_length(v_items, 1) then j := array_length(v_items, 1); end if;
          v_lines := v_lines || jsonb_build_array(jsonb_build_object('item_id', v_items[j],
            'qty', case when j in (6, 8) then 1 else v_qty end, 'unit', v_units[j], 'price', v_prices[j], 'tax_rate', 11));
        end;
      end loop;
      v_doc := public.create_sales_document(p_org, jsonb_build_object('kind', 'invoice',
        'contact_id', v_customers[1 + floor(random() * array_length(v_customers, 1))::int],
        'date', v_day, 'due_date', v_day + 14, 'lines', v_lines));
      select total into v_total from public.sales_documents where id = v_doc;
      if v_day < current_date - 20 or random() < 0.45 then
        perform public.record_payment(p_org, 'sales', v_doc, case when random() < 0.7 then v_bank else v_cash end,
          v_total, least(current_date, v_day + floor(random() * 10)::int), null);
      elsif random() < 0.3 then
        perform public.record_payment(p_org, 'sales', v_doc, v_bank, round(v_total / 2), least(current_date, v_day + 3), null);
      end if;
    end loop;
  end loop;

  -- Biaya rutin bulanan
  for v_k in 0..5 loop
    v_day := (date_trunc('month', current_date) - (v_k || ' months')::interval)::date + 1;
    perform public.create_expense(p_org, jsonb_build_object('date', v_day, 'pay_from_account_id', v_bank, 'lines', jsonb_build_array(
      jsonb_build_object('account_id', public.acct(p_org, 'exp_salary'), 'description', 'Gaji karyawan', 'amount', 12500000),
      jsonb_build_object('account_id', public.acct(p_org, 'exp_rent'), 'description', 'Sewa tempat usaha', 'amount', 4500000))));
    perform public.create_expense(p_org, jsonb_build_object('date', v_day + 4, 'pay_from_account_id', v_bank, 'lines', jsonb_build_array(
      jsonb_build_object('account_id', public.acct(p_org, 'exp_utilities'), 'description', 'Listrik dan air', 'amount', 1400000 + floor(random() * 600000)),
      jsonb_build_object('account_id', public.acct(p_org, 'exp_internet'), 'description', 'Internet', 'amount', 450000))));
    perform public.create_expense(p_org, jsonb_build_object('date', v_day + 9, 'pay_from_account_id', v_cash, 'lines', jsonb_build_array(
      jsonb_build_object('account_id', public.acct(p_org, 'exp_marketing'), 'description', 'Iklan media sosial', 'amount', 1500000 + floor(random() * 2500000)),
      jsonb_build_object('account_id', public.acct(p_org, 'exp_transport'), 'description', 'Ongkos kirim dan bensin', 'amount', 600000 + floor(random() * 500000)))));
  end loop;
  -- Satu biaya belum dibayar
  perform public.create_expense(p_org, jsonb_build_object('date', current_date - 3, 'due_date', current_date + 12,
    'contact_id', v_vendors[2], 'lines', jsonb_build_array(
      jsonb_build_object('account_id', public.acct(p_org, 'exp_supplies'), 'description', 'Perlengkapan kantor', 'amount', 2350000, 'tax_rate', 11))));

  -- Aset tetap
  perform public.create_fixed_asset(p_org, jsonb_build_object('name', 'Mesin Espresso 2 Group', 'acquired_on', current_date - 160,
    'cost', 38000000, 'asset_account_id', public.acct(p_org, 'fa_equipment'), 'paid_from_account_id', v_bank, 'useful_life_months', 60));
  perform public.create_fixed_asset(p_org, jsonb_build_object('name', 'Motor Operasional', 'acquired_on', current_date - 120,
    'cost', 21500000, 'asset_account_id', public.acct(p_org, 'fa_vehicle'), 'paid_from_account_id', v_bank, 'useful_life_months', 48));

  -- Penawaran dan pemesanan terbuka
  perform public.create_sales_document(p_org, jsonb_build_object('kind', 'quote', 'contact_id', v_customers[6], 'date', current_date - 2,
    'due_date', current_date + 12, 'lines', jsonb_build_array(
      jsonb_build_object('item_id', v_items[8], 'qty', 3, 'unit', 'sesi', 'price', 750000, 'tax_rate', 11),
      jsonb_build_object('item_id', v_items[6], 'qty', 2, 'unit', 'unit', 'price', 1350000, 'tax_rate', 11))));
  perform public.create_sales_document(p_org, jsonb_build_object('kind', 'order', 'contact_id', v_customers[4], 'date', current_date - 1,
    'due_date', current_date + 6, 'lines', jsonb_build_array(
      jsonb_build_object('item_id', v_items[1], 'qty', 10, 'unit', 'kg', 'price', 240000, 'tax_rate', 11))));
  perform public.create_purchase_document(p_org, jsonb_build_object('kind', 'order', 'contact_id', v_vendors[3], 'date', current_date - 1,
    'lines', jsonb_build_array(jsonb_build_object('item_id', v_items[2], 'qty', 40, 'unit', 'kg', 'price', 95000, 'tax_rate', 11))));
end $$;

