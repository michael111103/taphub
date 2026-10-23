-- Organisasi bisa diarsipkan (disembunyikan dari pilihan usaha)
alter table public.organizations add column if not exists is_archived boolean not null default false;
