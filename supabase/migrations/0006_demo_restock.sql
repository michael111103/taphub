-- Isi data contoh lengkap: transaksi + pembelian susulan agar stok tidak minus
create or replace function public.seed_demo(p_org uuid)
returns void language plpgsql security invoker set search_path = '' as $$
declare v_lines jsonb; v_vendor uuid;
begin
  perform public.seed_demo_data(p_org);
  select coalesce(jsonb_agg(jsonb_build_object('item_id', id, 'qty', ceil(min_stock * 3 - stock_qty), 'unit', unit, 'price', buy_price, 'tax_rate', 11)), '[]'::jsonb)
    into v_lines
  from public.items where org_id = p_org and track_stock and stock_qty < min_stock * 2;
  if jsonb_array_length(v_lines) > 0 then
    select id into v_vendor from public.contacts where org_id = p_org and 'vendor' = any(kind) order by created_at limit 1;
    perform public.create_purchase_document(p_org, jsonb_build_object('kind', 'bill', 'contact_id', v_vendor,
      'date', current_date - 25, 'due_date', current_date + 5, 'reference', 'Restock', 'lines', v_lines));
  end if;
end $$;

revoke all on function public.seed_demo(uuid) from public, anon;
grant execute on function public.seed_demo(uuid) to authenticated;
