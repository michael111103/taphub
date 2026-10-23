-- Pengunjung yang belum login tidak boleh memanggil fungsi apa pun
revoke execute on all functions in schema public from anon, public;
grant execute on function public.is_org_member(uuid) to authenticated;
grant execute on function public.is_org_admin(uuid) to authenticated;
grant execute on function public.shares_org_with(uuid) to authenticated;
alter default privileges in schema public revoke execute on functions from anon, public;
