-- TapHub App: fungsi bisnis (organisasi, penomoran, jurnal otomatis, transaksi, laporan)

-- Profil otomatis saat user mendaftar
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)), new.raw_user_meta_data->>'phone')
  on conflict (id) do nothing;
  return new;
end $$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Nomor dokumen berurutan per organisasi, contoh INV/00001
create or replace function public.next_doc_number(p_org uuid, p_prefix text)
returns text language plpgsql security invoker set search_path = '' as $$
declare n int;
begin
  if not public.is_org_member(p_org) then raise exception 'Tidak punya akses ke organisasi ini'; end if;
  insert into public.doc_sequences (org_id, key, last) values (p_org, p_prefix, 1)
  on conflict (org_id, key) do update set last = public.doc_sequences.last + 1
  returning last into n;
  return p_prefix || '/' || lpad(n::text, 5, '0');
end $$;

-- Akun default (bagan akun standar)
create or replace function public.seed_chart_of_accounts(p_org uuid)
returns void language plpgsql security definer set search_path = '' as $$
begin
  insert into public.accounts (org_id, code, name, category, system_key) values
    (p_org, '1-10001', 'Kas', 'kas_bank', 'cash'),
    (p_org, '1-10002', 'Rekening Bank', 'kas_bank', 'bank'),
    (p_org, '1-10003', 'Giro', 'kas_bank', 'giro'),
    (p_org, '1-10100', 'Piutang Usaha', 'piutang', 'receivable'),
    (p_org, '1-10200', 'Persediaan Barang', 'persediaan', 'inventory'),
    (p_org, '1-10300', 'Biaya Dibayar Dimuka', 'aset_lancar_lain', 'prepaid'),
    (p_org, '1-10500', 'PPN Masukan', 'aset_lancar_lain', 'vat_in'),
    (p_org, '1-10701', 'Peralatan Kantor', 'aset_tetap', 'fa_equipment'),
    (p_org, '1-10702', 'Kendaraan', 'aset_tetap', 'fa_vehicle'),
    (p_org, '1-10703', 'Bangunan', 'aset_tetap', 'fa_building'),
    (p_org, '1-10751', 'Akumulasi Penyusutan', 'depresiasi', 'accum_depr'),
    (p_org, '2-20100', 'Hutang Usaha', 'hutang', 'payable'),
    (p_org, '2-20200', 'Hutang Gaji', 'kewajiban_lancar_lain', 'salary_payable'),
    (p_org, '2-20500', 'PPN Keluaran', 'kewajiban_lancar_lain', 'vat_out'),
    (p_org, '2-21000', 'Hutang Bank Jangka Panjang', 'kewajiban_jangka_panjang', 'long_debt'),
    (p_org, '3-30000', 'Modal Pemilik', 'modal', 'equity'),
    (p_org, '3-30100', 'Laba Ditahan', 'modal', 'retained'),
    (p_org, '3-30200', 'Saldo Awal', 'modal', 'opening'),
    (p_org, '4-40000', 'Pendapatan Penjualan', 'pendapatan', 'sales'),
    (p_org, '4-40100', 'Diskon Penjualan', 'pendapatan', 'sales_discount'),
    (p_org, '4-40200', 'Pendapatan Jasa', 'pendapatan', 'service_income'),
    (p_org, '5-50000', 'Beban Pokok Pendapatan', 'hpp', 'cogs'),
    (p_org, '6-60100', 'Beban Gaji', 'beban', 'exp_salary'),
    (p_org, '6-60200', 'Beban Sewa', 'beban', 'exp_rent'),
    (p_org, '6-60300', 'Beban Listrik dan Air', 'beban', 'exp_utilities'),
    (p_org, '6-60400', 'Beban Internet dan Telepon', 'beban', 'exp_internet'),
    (p_org, '6-60500', 'Beban Transportasi', 'beban', 'exp_transport'),
    (p_org, '6-60600', 'Beban Pemasaran', 'beban', 'exp_marketing'),
    (p_org, '6-60700', 'Beban Perlengkapan Kantor', 'beban', 'exp_supplies'),
    (p_org, '6-60800', 'Beban Penyusutan', 'beban', 'exp_depr'),
    (p_org, '6-60900', 'Beban Lain-lain', 'beban', 'exp_other'),
    (p_org, '7-70000', 'Pendapatan Bunga', 'pendapatan_lain', 'interest_income'),
    (p_org, '7-70100', 'Pendapatan Lain-lain', 'pendapatan_lain', 'other_income'),
    (p_org, '8-80000', 'Beban Administrasi Bank', 'beban_lain', 'bank_fee'),
    (p_org, '8-80100', 'Beban Pajak', 'beban_lain', 'tax_expense')
  on conflict do nothing;
end $$;

-- Membuat organisasi baru untuk user yang login
create or replace function public.create_organization(p_name text, p_industry text default null, p_phone text default null)
returns uuid language plpgsql security definer set search_path = '' as $$
declare v_org uuid; v_uid uuid := auth.uid();
begin
  if v_uid is null then raise exception 'Harus login'; end if;
  if coalesce(trim(p_name), '') = '' then raise exception 'Nama usaha wajib diisi'; end if;

  insert into public.organizations (name, legal_name, industry, phone, created_by)
  values (trim(p_name), trim(p_name), p_industry, p_phone, v_uid)
  returning id into v_org;

  insert into public.org_members (org_id, user_id, role) values (v_org, v_uid, 'owner');
  perform public.seed_chart_of_accounts(v_org);

  -- Uji coba gratis 14 hari untuk produk yang sudah tersedia
  insert into public.subscriptions (org_id, product_code, status, trial_ends_at)
  select v_org, p.code, 'trial', now() + interval '14 days'
  from public.tap_products p where p.is_available;

  update public.profiles set current_org_id = v_org where id = v_uid;
  return v_org;
end $$;

create or replace function public.acct(p_org uuid, p_key text)
returns uuid language sql stable security invoker set search_path = '' as $$
  select id from public.accounts where org_id = p_org and system_key = p_key;
$$;

-- Jurnal: lines = [{account_id, debit, credit, description}]
create or replace function public.post_journal(
  p_org uuid, p_date date, p_memo text, p_source_type text, p_source_id uuid, p_lines jsonb
) returns uuid language plpgsql security invoker set search_path = '' as $$
declare v_entry uuid; v_dr numeric := 0; v_cr numeric := 0; l jsonb;
begin
  if not public.is_org_member(p_org) then raise exception 'Tidak punya akses'; end if;

  select coalesce(sum((x->>'debit')::numeric), 0), coalesce(sum((x->>'credit')::numeric), 0)
    into v_dr, v_cr from jsonb_array_elements(p_lines) x;
  if round(v_dr, 2) <> round(v_cr, 2) then
    raise exception 'Jurnal tidak seimbang (debit %, kredit %)', v_dr, v_cr;
  end if;
  if v_dr = 0 then return null; end if;

  insert into public.journal_entries (org_id, number, date, memo, source_type, source_id)
  values (p_org, public.next_doc_number(p_org, 'JU'), p_date, p_memo, p_source_type, p_source_id)
  returning id into v_entry;

  for l in select * from jsonb_array_elements(p_lines) loop
    if coalesce((l->>'debit')::numeric, 0) <> 0 or coalesce((l->>'credit')::numeric, 0) <> 0 then
      insert into public.journal_lines (org_id, entry_id, account_id, debit, credit, description)
      values (p_org, v_entry, (l->>'account_id')::uuid, coalesce((l->>'debit')::numeric, 0), coalesce((l->>'credit')::numeric, 0), l->>'description');
    end if;
  end loop;
  return v_entry;
end $$;

-- =========================================================
-- PENJUALAN: penawaran, pemesanan, tagihan
-- p_doc = {kind, contact_id, date, due_date, reference, notes, status, source_id, discount,
--          lines: [{item_id, description, qty, unit, price, discount_pct, tax_rate}]}
-- =========================================================
create or replace function public.create_sales_document(p_org uuid, p_doc jsonb)
returns uuid language plpgsql security invoker set search_path = '' as $$
declare
  v_id uuid; v_kind text := p_doc->>'kind'; v_prefix text; v_status text;
  l jsonb; v_sort int := 0; v_line_amt numeric; v_sub numeric := 0; v_tax numeric := 0;
  v_disc numeric := coalesce((p_doc->>'discount')::numeric, 0); v_total numeric;
  v_cogs numeric := 0; v_item record; v_date date := coalesce((p_doc->>'date')::date, current_date);
begin
  if not public.is_org_member(p_org) then raise exception 'Tidak punya akses'; end if;
  if v_kind not in ('quote', 'order', 'invoice') then raise exception 'Jenis dokumen tidak dikenal'; end if;
  if jsonb_array_length(coalesce(p_doc->'lines', '[]'::jsonb)) = 0 then raise exception 'Minimal satu baris produk'; end if;

  v_prefix := case v_kind when 'quote' then 'QUO' when 'order' then 'SO' else 'INV' end;
  v_status := coalesce(nullif(p_doc->>'status', ''), 'open');

  insert into public.sales_documents (org_id, kind, number, contact_id, date, due_date, reference, notes, status, source_id)
  values (p_org, v_kind, public.next_doc_number(p_org, v_prefix), nullif(p_doc->>'contact_id', '')::uuid, v_date,
          nullif(p_doc->>'due_date', '')::date, p_doc->>'reference', p_doc->>'notes', v_status, nullif(p_doc->>'source_id', '')::uuid)
  returning id into v_id;

  for l in select * from jsonb_array_elements(p_doc->'lines') loop
    v_sort := v_sort + 1;
    v_line_amt := round(coalesce((l->>'qty')::numeric, 1) * coalesce((l->>'price')::numeric, 0)
                  * (1 - coalesce((l->>'discount_pct')::numeric, 0) / 100), 2);
    v_sub := v_sub + v_line_amt;
    v_tax := v_tax + round(v_line_amt * coalesce((l->>'tax_rate')::numeric, 0) / 100, 2);
    insert into public.sales_document_lines (org_id, document_id, item_id, description, qty, unit, price, discount_pct, tax_rate, amount, sort)
    values (p_org, v_id, nullif(l->>'item_id', '')::uuid, l->>'description', coalesce((l->>'qty')::numeric, 1), l->>'unit',
            coalesce((l->>'price')::numeric, 0), coalesce((l->>'discount_pct')::numeric, 0), coalesce((l->>'tax_rate')::numeric, 0), v_line_amt, v_sort);
  end loop;

  v_total := v_sub - v_disc + v_tax;
  update public.sales_documents set subtotal = v_sub, discount = v_disc, tax = v_tax, total = v_total where id = v_id;

  if nullif(p_doc->>'source_id', '') is not null then
    update public.sales_documents set status = 'done' where id = (p_doc->>'source_id')::uuid and org_id = p_org;
  end if;

  -- Tagihan yang bukan draft langsung dijurnal dan mengurangi stok
  if v_kind = 'invoice' and v_status <> 'draft' then
    for v_item in
      select l2.item_id, l2.qty, i.buy_price, i.track_stock
      from public.sales_document_lines l2 join public.items i on i.id = l2.item_id
      where l2.document_id = v_id
    loop
      if v_item.track_stock then
        v_cogs := v_cogs + round(v_item.qty * v_item.buy_price, 2);
        update public.items set stock_qty = stock_qty - v_item.qty where id = v_item.item_id;
        insert into public.inventory_movements (org_id, item_id, date, qty, unit_cost, source_type, source_id, note)
        values (p_org, v_item.item_id, v_date, -v_item.qty, v_item.buy_price, 'sales', v_id, 'Penjualan');
      end if;
    end loop;

    perform public.post_journal(p_org, v_date, 'Tagihan penjualan', 'sales', v_id, jsonb_build_array(
      jsonb_build_object('account_id', public.acct(p_org, 'receivable'), 'debit', v_total, 'credit', 0),
      jsonb_build_object('account_id', public.acct(p_org, 'sales_discount'), 'debit', v_disc, 'credit', 0),
      jsonb_build_object('account_id', public.acct(p_org, 'sales'), 'debit', 0, 'credit', v_sub),
      jsonb_build_object('account_id', public.acct(p_org, 'vat_out'), 'debit', 0, 'credit', v_tax),
      jsonb_build_object('account_id', public.acct(p_org, 'cogs'), 'debit', v_cogs, 'credit', 0),
      jsonb_build_object('account_id', public.acct(p_org, 'inventory'), 'debit', 0, 'credit', v_cogs)
    ));
  end if;
  return v_id;
end $$;

-- =========================================================
-- PEMBELIAN: penawaran, pesanan, tagihan pembelian
-- =========================================================
create or replace function public.create_purchase_document(p_org uuid, p_doc jsonb)
returns uuid language plpgsql security invoker set search_path = '' as $$
declare
  v_id uuid; v_kind text := p_doc->>'kind'; v_prefix text; v_status text;
  l jsonb; v_sort int := 0; v_line_amt numeric; v_sub numeric := 0; v_tax numeric := 0;
  v_disc numeric := coalesce((p_doc->>'discount')::numeric, 0); v_total numeric;
  v_date date := coalesce((p_doc->>'date')::date, current_date);
  v_lines jsonb := '[]'::jsonb; v_row record; v_debit_acct uuid; v_qty numeric;
begin
  if not public.is_org_member(p_org) then raise exception 'Tidak punya akses'; end if;
  if v_kind not in ('quote', 'order', 'bill') then raise exception 'Jenis dokumen tidak dikenal'; end if;
  if jsonb_array_length(coalesce(p_doc->'lines', '[]'::jsonb)) = 0 then raise exception 'Minimal satu baris'; end if;

  v_prefix := case v_kind when 'quote' then 'PQ' when 'order' then 'PO' else 'PI' end;
  v_status := coalesce(nullif(p_doc->>'status', ''), 'open');

  insert into public.purchase_documents (org_id, kind, number, contact_id, date, due_date, reference, notes, status, source_id)
  values (p_org, v_kind, public.next_doc_number(p_org, v_prefix), nullif(p_doc->>'contact_id', '')::uuid, v_date,
          nullif(p_doc->>'due_date', '')::date, p_doc->>'reference', p_doc->>'notes', v_status, nullif(p_doc->>'source_id', '')::uuid)
  returning id into v_id;

  for l in select * from jsonb_array_elements(p_doc->'lines') loop
    v_sort := v_sort + 1;
    v_line_amt := round(coalesce((l->>'qty')::numeric, 1) * coalesce((l->>'price')::numeric, 0)
                  * (1 - coalesce((l->>'discount_pct')::numeric, 0) / 100), 2);
    v_sub := v_sub + v_line_amt;
    v_tax := v_tax + round(v_line_amt * coalesce((l->>'tax_rate')::numeric, 0) / 100, 2);
    insert into public.purchase_document_lines (org_id, document_id, item_id, account_id, description, qty, unit, price, discount_pct, tax_rate, amount, sort)
    values (p_org, v_id, nullif(l->>'item_id', '')::uuid, nullif(l->>'account_id', '')::uuid, l->>'description',
            coalesce((l->>'qty')::numeric, 1), l->>'unit', coalesce((l->>'price')::numeric, 0),
            coalesce((l->>'discount_pct')::numeric, 0), coalesce((l->>'tax_rate')::numeric, 0), v_line_amt, v_sort);
  end loop;

  v_total := v_sub - v_disc + v_tax;
  update public.purchase_documents set subtotal = v_sub, discount = v_disc, tax = v_tax, total = v_total where id = v_id;

  if nullif(p_doc->>'source_id', '') is not null then
    update public.purchase_documents set status = 'done' where id = (p_doc->>'source_id')::uuid and org_id = p_org;
  end if;

  if v_kind = 'bill' and v_status <> 'draft' then
    for v_row in
      select pl.item_id, pl.account_id, pl.qty, pl.amount, pl.price, i.track_stock
      from public.purchase_document_lines pl left join public.items i on i.id = pl.item_id
      where pl.document_id = v_id
    loop
      if v_row.account_id is not null then
        v_debit_acct := v_row.account_id;
      elsif v_row.item_id is not null and v_row.track_stock then
        v_debit_acct := public.acct(p_org, 'inventory');
        v_qty := v_row.qty;
        update public.items set stock_qty = stock_qty + v_qty,
          buy_price = case when v_qty > 0 then round(v_row.amount / v_qty, 2) else buy_price end
        where id = v_row.item_id;
        insert into public.inventory_movements (org_id, item_id, date, qty, unit_cost, source_type, source_id, note)
        values (p_org, v_row.item_id, v_date, v_qty, case when v_qty > 0 then round(v_row.amount / v_qty, 2) else 0 end, 'purchase', v_id, 'Pembelian');
      else
        v_debit_acct := public.acct(p_org, 'cogs');
      end if;
      v_lines := v_lines || jsonb_build_array(jsonb_build_object('account_id', v_debit_acct, 'debit', v_row.amount, 'credit', 0));
    end loop;
    -- diskon header mengurangi akun pertama (persediaan/beban) secara proporsional sederhana
    v_lines := v_lines || jsonb_build_array(
      jsonb_build_object('account_id', public.acct(p_org, 'inventory'), 'debit', 0, 'credit', v_disc),
      jsonb_build_object('account_id', public.acct(p_org, 'vat_in'), 'debit', v_tax, 'credit', 0),
      jsonb_build_object('account_id', public.acct(p_org, 'payable'), 'debit', 0, 'credit', v_total)
    );
    perform public.post_journal(p_org, v_date, 'Tagihan pembelian', 'purchase', v_id, v_lines);
  end if;
  return v_id;
end $$;

-- =========================================================
-- BIAYA
-- p_doc = {contact_id, date, due_date, pay_from_account_id, reference, notes, lines:[{account_id, description, amount, tax_rate}]}
-- =========================================================
create or replace function public.create_expense(p_org uuid, p_doc jsonb)
returns uuid language plpgsql security invoker set search_path = '' as $$
declare
  v_id uuid; l jsonb; v_sort int := 0; v_sub numeric := 0; v_tax numeric := 0; v_total numeric;
  v_pay uuid := nullif(p_doc->>'pay_from_account_id', '')::uuid; v_date date := coalesce((p_doc->>'date')::date, current_date);
  v_lines jsonb := '[]'::jsonb; v_amt numeric;
begin
  if not public.is_org_member(p_org) then raise exception 'Tidak punya akses'; end if;
  if jsonb_array_length(coalesce(p_doc->'lines', '[]'::jsonb)) = 0 then raise exception 'Minimal satu baris biaya'; end if;

  insert into public.expenses (org_id, number, contact_id, date, due_date, pay_from_account_id, reference, notes)
  values (p_org, public.next_doc_number(p_org, 'EXP'), nullif(p_doc->>'contact_id', '')::uuid, v_date,
          nullif(p_doc->>'due_date', '')::date, v_pay, p_doc->>'reference', p_doc->>'notes')
  returning id into v_id;

  for l in select * from jsonb_array_elements(p_doc->'lines') loop
    v_sort := v_sort + 1;
    v_amt := round(coalesce((l->>'amount')::numeric, 0), 2);
    v_sub := v_sub + v_amt;
    v_tax := v_tax + round(v_amt * coalesce((l->>'tax_rate')::numeric, 0) / 100, 2);
    insert into public.expense_lines (org_id, expense_id, account_id, description, amount, tax_rate, sort)
    values (p_org, v_id, (l->>'account_id')::uuid, l->>'description', v_amt, coalesce((l->>'tax_rate')::numeric, 0), v_sort);
    v_lines := v_lines || jsonb_build_array(jsonb_build_object('account_id', (l->>'account_id')::uuid, 'debit', v_amt, 'credit', 0, 'description', l->>'description'));
  end loop;

  v_total := v_sub + v_tax;
  update public.expenses set subtotal = v_sub, tax = v_tax, total = v_total,
    status = case when v_pay is not null then 'paid' else 'open' end,
    paid_amount = case when v_pay is not null then v_total else 0 end
  where id = v_id;

  v_lines := v_lines || jsonb_build_array(
    jsonb_build_object('account_id', public.acct(p_org, 'vat_in'), 'debit', v_tax, 'credit', 0),
    jsonb_build_object('account_id', coalesce(v_pay, public.acct(p_org, 'payable')), 'debit', 0, 'credit', v_total)
  );
  perform public.post_journal(p_org, v_date, 'Biaya', 'expense', v_id, v_lines);

  if v_pay is not null then
    insert into public.payments (org_id, direction, source_type, source_id, account_id, date, amount)
    values (p_org, 'out', 'expense', v_id, v_pay, v_date, v_total);
  end if;
  return v_id;
end $$;

-- =========================================================
-- PEMBAYARAN tagihan penjualan / pembelian / biaya
-- =========================================================
create or replace function public.record_payment(
  p_org uuid, p_source_type text, p_source_id uuid, p_account_id uuid, p_amount numeric, p_date date default current_date, p_notes text default null
) returns uuid language plpgsql security invoker set search_path = '' as $$
declare v_pay uuid; v_total numeric; v_paid numeric; v_new numeric; v_status text; v_dir text;
begin
  if not public.is_org_member(p_org) then raise exception 'Tidak punya akses'; end if;
  if p_amount is null or p_amount <= 0 then raise exception 'Jumlah pembayaran harus lebih dari 0'; end if;

  if p_source_type = 'sales' then
    select total, paid_amount into v_total, v_paid from public.sales_documents where id = p_source_id and org_id = p_org and kind = 'invoice';
  elsif p_source_type = 'purchase' then
    select total, paid_amount into v_total, v_paid from public.purchase_documents where id = p_source_id and org_id = p_org and kind = 'bill';
  elsif p_source_type = 'expense' then
    select total, paid_amount into v_total, v_paid from public.expenses where id = p_source_id and org_id = p_org;
  else
    raise exception 'Sumber pembayaran tidak dikenal';
  end if;
  if v_total is null then raise exception 'Dokumen tidak ditemukan'; end if;
  if p_amount > v_total - v_paid + 0.009 then raise exception 'Pembayaran melebihi sisa tagihan'; end if;

  v_new := v_paid + p_amount;
  v_status := case when v_new >= v_total - 0.009 then 'paid' else 'partial' end;
  v_dir := case when p_source_type = 'sales' then 'in' else 'out' end;

  insert into public.payments (org_id, direction, source_type, source_id, account_id, date, amount, notes)
  values (p_org, v_dir, p_source_type, p_source_id, p_account_id, p_date, p_amount, p_notes)
  returning id into v_pay;

  if p_source_type = 'sales' then
    update public.sales_documents set paid_amount = v_new, status = v_status where id = p_source_id;
    perform public.post_journal(p_org, p_date, 'Penerimaan pembayaran', 'payment', v_pay, jsonb_build_array(
      jsonb_build_object('account_id', p_account_id, 'debit', p_amount, 'credit', 0),
      jsonb_build_object('account_id', public.acct(p_org, 'receivable'), 'debit', 0, 'credit', p_amount)));
  else
    if p_source_type = 'purchase' then
      update public.purchase_documents set paid_amount = v_new, status = v_status where id = p_source_id;
    else
      update public.expenses set paid_amount = v_new, status = v_status where id = p_source_id;
    end if;
    perform public.post_journal(p_org, p_date, 'Pembayaran tagihan', 'payment', v_pay, jsonb_build_array(
      jsonb_build_object('account_id', public.acct(p_org, 'payable'), 'debit', p_amount, 'credit', 0),
      jsonb_build_object('account_id', p_account_id, 'debit', 0, 'credit', p_amount)));
  end if;
  return v_pay;
end $$;

-- =========================================================
-- KAS & BANK: terima uang, kirim uang, transfer
-- =========================================================
create or replace function public.create_bank_transaction(p_org uuid, p_doc jsonb)
returns uuid language plpgsql security invoker set search_path = '' as $$
declare v_id uuid; v_kind text := p_doc->>'kind'; v_acc uuid := (p_doc->>'account_id')::uuid;
  v_ctr uuid := (p_doc->>'counter_account_id')::uuid; v_amt numeric := (p_doc->>'amount')::numeric;
  v_date date := coalesce((p_doc->>'date')::date, current_date); v_prefix text;
begin
  if not public.is_org_member(p_org) then raise exception 'Tidak punya akses'; end if;
  if v_kind not in ('receive', 'spend', 'transfer') then raise exception 'Jenis transaksi tidak dikenal'; end if;
  if v_acc = v_ctr then raise exception 'Akun asal dan tujuan tidak boleh sama'; end if;
  v_prefix := case v_kind when 'receive' then 'BR' when 'spend' then 'BP' else 'BT' end;

  insert into public.bank_transactions (org_id, number, kind, account_id, counter_account_id, contact_id, date, amount, description)
  values (p_org, public.next_doc_number(p_org, v_prefix), v_kind, v_acc, v_ctr, nullif(p_doc->>'contact_id', '')::uuid, v_date, v_amt, p_doc->>'description')
  returning id into v_id;

  if v_kind = 'receive' then
    perform public.post_journal(p_org, v_date, coalesce(p_doc->>'description', 'Terima uang'), 'bank', v_id, jsonb_build_array(
      jsonb_build_object('account_id', v_acc, 'debit', v_amt, 'credit', 0),
      jsonb_build_object('account_id', v_ctr, 'debit', 0, 'credit', v_amt)));
  else
    perform public.post_journal(p_org, v_date, coalesce(p_doc->>'description', case when v_kind = 'spend' then 'Kirim uang' else 'Transfer dana' end), 'bank', v_id, jsonb_build_array(
      jsonb_build_object('account_id', v_ctr, 'debit', v_amt, 'credit', 0),
      jsonb_build_object('account_id', v_acc, 'debit', 0, 'credit', v_amt)));
  end if;
  return v_id;
end $$;

-- =========================================================
-- ASET TETAP
-- =========================================================
create or replace function public.create_fixed_asset(p_org uuid, p_doc jsonb)
returns uuid language plpgsql security invoker set search_path = '' as $$
declare v_id uuid; v_cost numeric := (p_doc->>'cost')::numeric; v_date date := coalesce((p_doc->>'acquired_on')::date, current_date);
  v_asset uuid := (p_doc->>'asset_account_id')::uuid; v_pay uuid := nullif(p_doc->>'paid_from_account_id', '')::uuid;
begin
  if not public.is_org_member(p_org) then raise exception 'Tidak punya akses'; end if;
  insert into public.fixed_assets (org_id, number, name, acquired_on, cost, asset_account_id, paid_from_account_id, useful_life_months, salvage_value, notes)
  values (p_org, public.next_doc_number(p_org, 'FA'), p_doc->>'name', v_date, v_cost, v_asset, v_pay,
          coalesce((p_doc->>'useful_life_months')::int, 48), coalesce((p_doc->>'salvage_value')::numeric, 0), p_doc->>'notes')
  returning id into v_id;

  perform public.post_journal(p_org, v_date, 'Pembelian aset ' || (p_doc->>'name'), 'asset', v_id, jsonb_build_array(
    jsonb_build_object('account_id', v_asset, 'debit', v_cost, 'credit', 0),
    jsonb_build_object('account_id', coalesce(v_pay, public.acct(p_org, 'payable')), 'debit', 0, 'credit', v_cost)));
  return v_id;
end $$;

-- Pembatalan memakai jurnal balik (bukan menghapus), sesuai praktik akuntansi
create or replace function public.void_document(p_org uuid, p_source_type text, p_id uuid)
returns void language plpgsql security invoker set search_path = '' as $$
declare v_paid numeric; v_status text; v_lines jsonb; v_number text;
begin
  if not public.is_org_member(p_org) then raise exception 'Tidak punya akses'; end if;

  if p_source_type = 'sales' then
    select paid_amount, status, number into v_paid, v_status, v_number from public.sales_documents where id = p_id and org_id = p_org;
  elsif p_source_type = 'purchase' then
    select paid_amount, status, number into v_paid, v_status, v_number from public.purchase_documents where id = p_id and org_id = p_org;
  elsif p_source_type = 'expense' then
    select case when pay_from_account_id is null then paid_amount else 0 end, status, number into v_paid, v_status, v_number
    from public.expenses where id = p_id and org_id = p_org;
  else
    raise exception 'Jenis dokumen tidak dikenal';
  end if;
  if v_status is null then raise exception 'Dokumen tidak ditemukan'; end if;
  if v_status = 'void' then return; end if;
  if v_paid > 0 then raise exception 'Dokumen sudah ada pembayaran, tidak bisa dibatalkan'; end if;

  insert into public.inventory_movements (org_id, item_id, date, qty, unit_cost, source_type, source_id, note)
  select org_id, item_id, current_date, -qty, unit_cost, source_type, source_id, 'Pembatalan ' || v_number
  from public.inventory_movements where source_id = p_id and org_id = p_org;
  update public.items i set stock_qty = i.stock_qty - m.total
  from (select item_id, sum(qty) total from public.inventory_movements where source_id = p_id and org_id = p_org and note not like 'Pembatalan%' group by item_id) m
  where m.item_id = i.id;

  select coalesce(jsonb_agg(jsonb_build_object('account_id', jl.account_id, 'debit', jl.credit, 'credit', jl.debit)), '[]'::jsonb) into v_lines
  from public.journal_lines jl join public.journal_entries je on je.id = jl.entry_id
  where je.org_id = p_org and je.source_id = p_id;
  if jsonb_array_length(v_lines) > 0 then
    perform public.post_journal(p_org, current_date, 'Pembatalan ' || v_number, 'void', p_id, v_lines);
  end if;

  if p_source_type = 'sales' then
    update public.sales_documents set status = 'void' where id = p_id;
  elsif p_source_type = 'purchase' then
    update public.purchase_documents set status = 'void' where id = p_id;
  else
    insert into public.payments (org_id, direction, source_type, source_id, account_id, date, amount, notes)
    select org_id, direction, source_type, source_id, account_id, current_date, -amount, 'Pembatalan'
    from public.payments where source_id = p_id and source_type = 'expense' and amount > 0;
    update public.expenses set status = 'void', paid_amount = 0 where id = p_id;
  end if;
end $$;

-- =========================================================
-- LAPORAN
-- =========================================================
-- Saldo per akun dalam periode (p_from null = sejak awal)
create or replace function public.account_balances(p_org uuid, p_from date, p_to date)
returns table (account_id uuid, code text, name text, category public.account_category, debit numeric, credit numeric)
language sql stable security invoker set search_path = '' as $$
  select a.id, a.code, a.name, a.category,
         coalesce(sum(jl.debit) filter (where (p_from is null or je.date >= p_from) and je.date <= p_to), 0),
         coalesce(sum(jl.credit) filter (where (p_from is null or je.date >= p_from) and je.date <= p_to), 0)
  from public.accounts a
  left join public.journal_lines jl on jl.account_id = a.id
  left join public.journal_entries je on je.id = jl.entry_id
  where a.org_id = p_org
  group by a.id, a.code, a.name, a.category
  order by a.code;
$$;

-- Ringkasan dashboard dalam satu panggilan
create or replace function public.dashboard_summary(p_org uuid, p_days int default 30)
returns jsonb language plpgsql stable security invoker set search_path = '' as $$
declare
  v_to date := current_date; v_from date := current_date - (p_days - 1);
  v_prev_from date := current_date - (2 * p_days - 1); v_prev_to date := current_date - p_days;
  r jsonb;
begin
  if not public.is_org_member(p_org) then raise exception 'Tidak punya akses'; end if;

  select jsonb_build_object(
    'range', jsonb_build_object('from', v_from, 'to', v_to, 'days', p_days),
    'sales_total', (select coalesce(sum(total), 0) from public.sales_documents where org_id = p_org and kind = 'invoice' and status not in ('draft', 'void') and date between v_from and v_to),
    'sales_prev', (select coalesce(sum(total), 0) from public.sales_documents where org_id = p_org and kind = 'invoice' and status not in ('draft', 'void') and date between v_prev_from and v_prev_to),
    'invoice_count', (select count(*) from public.sales_documents where org_id = p_org and kind = 'invoice' and status not in ('draft', 'void') and date between v_from and v_to),
    'invoice_prev', (select count(*) from public.sales_documents where org_id = p_org and kind = 'invoice' and status not in ('draft', 'void') and date between v_prev_from and v_prev_to),
    'received', (select coalesce(sum(amount), 0) from public.payments where org_id = p_org and direction = 'in' and date between v_from and v_to),
    'spent', (select coalesce(sum(amount), 0) from public.payments where org_id = p_org and direction = 'out' and date between v_from and v_to),
    'receivable_open', (select coalesce(sum(total - paid_amount), 0) from public.sales_documents where org_id = p_org and kind = 'invoice' and status in ('open', 'partial')),
    'receivable_overdue', (select coalesce(sum(total - paid_amount), 0) from public.sales_documents where org_id = p_org and kind = 'invoice' and status in ('open', 'partial') and due_date < current_date),
    'payable_open', (select coalesce(sum(total - paid_amount), 0) from public.purchase_documents where org_id = p_org and kind = 'bill' and status in ('open', 'partial'))
                    + (select coalesce(sum(total - paid_amount), 0) from public.expenses where org_id = p_org and status in ('open', 'partial')),
    'billed_period', (select coalesce(sum(total), 0) from public.sales_documents where org_id = p_org and kind = 'invoice' and status not in ('draft', 'void') and date between v_from and v_to),
    'collected_period', (select coalesce(sum(paid_amount), 0) from public.sales_documents where org_id = p_org and kind = 'invoice' and status not in ('draft', 'void') and date between v_from and v_to),
    'daily', (
      select coalesce(jsonb_agg(jsonb_build_object('date', d::date,
        'sales', coalesce((select sum(total) from public.sales_documents s where s.org_id = p_org and s.kind = 'invoice' and s.status not in ('draft', 'void') and s.date = d::date), 0),
        'invoices', coalesce((select count(*) from public.sales_documents s where s.org_id = p_org and s.kind = 'invoice' and s.status not in ('draft', 'void') and s.date = d::date), 0),
        'cash_in', coalesce((select sum(amount) from public.payments p where p.org_id = p_org and p.direction = 'in' and p.date = d::date), 0),
        'cash_out', coalesce((select sum(amount) from public.payments p where p.org_id = p_org and p.direction = 'out' and p.date = d::date), 0)
      ) order by d), '[]'::jsonb)
      from generate_series(v_from, v_to, interval '1 day') d
    ),
    'monthly', (
      select coalesce(jsonb_agg(jsonb_build_object('month', to_char(m, 'YYYY-MM'),
        'revenue', coalesce((select sum(jl.credit - jl.debit) from public.journal_lines jl join public.journal_entries je on je.id = jl.entry_id join public.accounts a on a.id = jl.account_id
                   where jl.org_id = p_org and a.category in ('pendapatan', 'pendapatan_lain') and date_trunc('month', je.date) = m), 0),
        'expense', coalesce((select sum(jl.debit - jl.credit) from public.journal_lines jl join public.journal_entries je on je.id = jl.entry_id join public.accounts a on a.id = jl.account_id
                   where jl.org_id = p_org and a.category in ('hpp', 'beban', 'beban_lain') and date_trunc('month', je.date) = m), 0),
        'customers', coalesce((select count(distinct contact_id) from public.sales_documents s where s.org_id = p_org and s.kind = 'invoice' and s.status not in ('draft', 'void') and date_trunc('month', s.date) = m), 0)
      ) order by m), '[]'::jsonb)
      from generate_series(date_trunc('month', current_date) - interval '5 months', date_trunc('month', current_date), interval '1 month') m
    ),
    'top_customers', (
      select coalesce(jsonb_agg(x order by (x->>'total')::numeric desc), '[]'::jsonb) from (
        select jsonb_build_object('name', coalesce(c.name, 'Tanpa kontak'), 'total', sum(s.total), 'count', count(*)) x
        from public.sales_documents s left join public.contacts c on c.id = s.contact_id
        where s.org_id = p_org and s.kind = 'invoice' and s.status not in ('draft', 'void') and s.date between v_from and v_to
        group by c.name order by sum(s.total) desc limit 6) t
    ),
    'top_items', (
      select coalesce(jsonb_agg(x order by (x->>'total')::numeric desc), '[]'::jsonb) from (
        select jsonb_build_object('name', coalesce(i.name, l.description, 'Lainnya'), 'total', sum(l.amount), 'qty', sum(l.qty)) x
        from public.sales_document_lines l join public.sales_documents s on s.id = l.document_id left join public.items i on i.id = l.item_id
        where s.org_id = p_org and s.kind = 'invoice' and s.status not in ('draft', 'void') and s.date between v_from and v_to
        group by coalesce(i.name, l.description, 'Lainnya') order by sum(l.amount) desc limit 6) t
    ),
    'sales_by_category', (
      select coalesce(jsonb_agg(x), '[]'::jsonb) from (
        select jsonb_build_object('name', coalesce(i.category, 'Lainnya'), 'total', sum(l.amount)) x
        from public.sales_document_lines l join public.sales_documents s on s.id = l.document_id left join public.items i on i.id = l.item_id
        where s.org_id = p_org and s.kind = 'invoice' and s.status not in ('draft', 'void') and s.date between v_from and v_to
        group by coalesce(i.category, 'Lainnya') order by sum(l.amount) desc limit 5) t
    ),
    'expense_by_account', (
      select coalesce(jsonb_agg(x), '[]'::jsonb) from (
        select jsonb_build_object('name', a.name, 'total', sum(jl.debit - jl.credit)) x
        from public.journal_lines jl join public.journal_entries je on je.id = jl.entry_id join public.accounts a on a.id = jl.account_id
        where jl.org_id = p_org and a.category in ('beban', 'beban_lain', 'hpp') and je.date between v_from and v_to
        group by a.name having sum(jl.debit - jl.credit) > 0 order by sum(jl.debit - jl.credit) desc limit 5) t
    ),
    'cash_accounts', (
      select coalesce(jsonb_agg(jsonb_build_object('id', a.id, 'name', a.name, 'code', a.code,
        'balance', coalesce((select sum(debit - credit) from public.journal_lines jl where jl.account_id = a.id), 0)) order by a.code), '[]'::jsonb)
      from public.accounts a where a.org_id = p_org and a.category = 'kas_bank' and not a.is_archived
    ),
    'low_stock', (select count(*) from public.items where org_id = p_org and track_stock and not is_archived and stock_qty <= min_stock),
    'feed', (
      select coalesce(jsonb_agg(x order by (x->>'at') desc), '[]'::jsonb) from (
        select * from (
          select jsonb_build_object('type', 'sales', 'kind', s.kind, 'id', s.id, 'number', s.number, 'contact', c.name, 'amount', s.total, 'status', s.status, 'at', s.created_at) x
          from public.sales_documents s left join public.contacts c on c.id = s.contact_id where s.org_id = p_org
          union all
          select jsonb_build_object('type', 'payment', 'kind', p.direction, 'id', p.source_id, 'number', p.source_type, 'contact', null, 'amount', p.amount, 'status', 'paid', 'at', p.created_at)
          from public.payments p where p.org_id = p_org
          union all
          select jsonb_build_object('type', 'expense', 'kind', 'expense', 'id', e.id, 'number', e.number, 'contact', c.name, 'amount', e.total, 'status', e.status, 'at', e.created_at)
          from public.expenses e left join public.contacts c on c.id = e.contact_id where e.org_id = p_org
        ) u order by (x->>'at') desc limit 8
      ) t
    )
  ) into r;
  return r;
end $$;

-- =========================================================
-- LANGGANAN: buat tagihan checkout (pembayaran gateway disambungkan nanti)
-- =========================================================
create or replace function public.create_billing_invoice(p_org uuid, p_plan_code text, p_cycle public.billing_cycle, p_method text, p_channel text default null)
returns uuid language plpgsql security definer set search_path = '' as $$
declare v_plan public.plans; v_sub bigint; v_tax bigint; v_id uuid; v_num text;
begin
  if not public.is_org_admin(p_org) then raise exception 'Hanya pemilik atau admin yang bisa berlangganan'; end if;
  select * into v_plan from public.plans where code = p_plan_code and is_active;
  if v_plan.id is null then raise exception 'Paket tidak ditemukan'; end if;

  v_sub := case when p_cycle = 'yearly' then v_plan.price_yearly else v_plan.price_monthly end;
  v_tax := round(v_sub * 0.11);
  v_num := 'TH-' || to_char(now() at time zone 'Asia/Jakarta', 'YYMMDD') || '-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6));

  insert into public.billing_invoices (org_id, number, plan_id, cycle, subtotal, tax, total, payment_method, payment_channel, expires_at)
  values (p_org, v_num, v_plan.id, p_cycle, v_sub, v_tax, v_sub + v_tax, p_method, p_channel, now() + interval '24 hours')
  returning id into v_id;
  return v_id;
end $$;

create or replace function public.cancel_billing_invoice(p_org uuid, p_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_org_admin(p_org) then raise exception 'Tidak punya akses'; end if;
  update public.billing_invoices set status = 'canceled' where id = p_id and org_id = p_org and status = 'pending';
end $$;

-- Hak eksekusi: fungsi internal tidak bisa dipanggil langsung dari API
revoke execute on function public.seed_chart_of_accounts(uuid) from public, anon, authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.post_journal(uuid, date, text, text, uuid, jsonb) from public, anon;
revoke all on function public.create_organization(text, text, text) from public, anon;
revoke all on function public.create_billing_invoice(uuid, text, public.billing_cycle, text, text) from public, anon;
revoke all on function public.cancel_billing_invoice(uuid, uuid) from public, anon;
grant execute on function public.create_organization(text, text, text) to authenticated;
grant execute on function public.create_billing_invoice(uuid, text, public.billing_cycle, text, text) to authenticated;
grant execute on function public.cancel_billing_invoice(uuid, uuid) to authenticated;
