import type { Metadata } from "next";
import Link from "next/link";
import { getAppContext, href } from "@/lib/app/context";
import { tgl } from "@/lib/app/format";
import { Money, PageHeader, StatusBadge } from "@/components/app/ui";
import Icon from "@/components/app/Icon";

export const metadata: Metadata = { title: "Cari" };

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const { supabase, org } = await getAppContext();
  const q = searchParams.q?.trim().replace(/[,()%]/g, " ") ?? "";
  const [sales, buys, contacts, items] = q
    ? await Promise.all([
        supabase.from("sales_documents").select("id, kind, number, date, due_date, status, total, contacts(name)").eq("org_id", org.id).or(`number.ilike.%${q}%,reference.ilike.%${q}%`).limit(10),
        supabase.from("purchase_documents").select("id, kind, number, date, due_date, status, total, contacts(name)").eq("org_id", org.id).or(`number.ilike.%${q}%,reference.ilike.%${q}%`).limit(10),
        supabase.from("contacts").select("id, name, phone").eq("org_id", org.id).or(`name.ilike.%${q}%,phone.ilike.%${q}%`).limit(10),
        supabase.from("items").select("id, name, sku").eq("org_id", org.id).or(`name.ilike.%${q}%,sku.ilike.%${q}%`).limit(10),
      ])
    : [{ data: [] }, { data: [] }, { data: [] }, { data: [] }];
  type D = { id: string; kind: string; number: string; date: string; due_date: string | null; status: string; total: number; contacts: { name: string } | null };
  const docs = [...((sales.data ?? []) as unknown as D[]).map((d) => ({ ...d, p: "penjualan" })), ...((buys.data ?? []) as unknown as D[]).map((d) => ({ ...d, p: "pembelian" }))];
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Cari" icon="search" tone="blue" />
      <form className="relative mb-6">
        <input name="q" defaultValue={q} autoFocus placeholder="Nomor tagihan, nama pelanggan, produk..." className="field h-12 pl-11 text-base" />
        <Icon name="search" size={20} className="pointer-events-none absolute left-3.5 top-3.5 text-muted" />
      </form>
      {q && (
        <div className="space-y-4">
          <section className="card p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Transaksi</p>
            {docs.length ? docs.map((d) => (
              <Link key={d.id} href={href(`/${d.p}/dokumen/${d.id}`)} className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-fg/[0.04]">
                <span className="mono font-semibold text-accent">{d.number}</span>
                <span className="flex-1 truncate text-sm text-muted">{d.contacts?.name} · {tgl(d.date)}</span>
                <StatusBadge status={d.status} kind={d.kind} dueDate={d.due_date} />
                <Money value={d.total} className="text-sm font-semibold" />
              </Link>
            )) : <p className="text-sm text-muted">Tidak ada.</p>}
          </section>
          <section className="card p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Kontak</p>
            {(contacts.data ?? []).length ? (contacts.data ?? []).map((c) => <Link key={c.id} href={href(`/kontak/${c.id}`)} className="block rounded-xl px-2 py-2 hover:bg-fg/[0.04]">{c.name} <span className="text-sm text-muted">{c.phone}</span></Link>) : <p className="text-sm text-muted">Tidak ada.</p>}
          </section>
          <section className="card p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Produk</p>
            {(items.data ?? []).length ? (items.data ?? []).map((i) => <Link key={i.id} href={href(`/produk/${i.id}`)} className="block rounded-xl px-2 py-2 hover:bg-fg/[0.04]">{i.name} <span className="mono text-xs text-muted">{i.sku}</span></Link>) : <p className="text-sm text-muted">Tidak ada.</p>}
          </section>
        </div>
      )}
    </div>
  );
}
