import type { Metadata } from "next";
import Link from "next/link";
import { getAppContext, href } from "@/lib/app/context";
import { initials } from "@/lib/app/format";
import { EmptyState, Money, PageHeader, Pagination, SearchBox, Tabs } from "@/components/app/ui";
import Icon from "@/components/app/Icon";

export const metadata: Metadata = { title: "Kontak" };
const PAGE = 30;
const KIND: Record<string, string> = { customer: "Pelanggan", vendor: "Vendor", employee: "Karyawan", other: "Lainnya" };

export default async function ContactsPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const { supabase, org } = await getAppContext();
  const jenis = searchParams.jenis ?? "semua";
  const q = searchParams.q?.trim().replace(/[,()%]/g, " ");
  const page = Math.max(1, Number(searchParams.page) || 1);
  let query = supabase.from("contacts").select("id, name, company, phone, email, city, kind", { count: "exact" }).eq("org_id", org.id);
  if (jenis !== "semua") query = query.contains("kind", [jenis]);
  if (q) query = query.or(`name.ilike.%${q}%,company.ilike.%${q}%,phone.ilike.%${q}%,email.ilike.%${q}%`);
  const { data, count } = await query.order("name").range((page - 1) * PAGE, page * PAGE - 1);
  const rows = data ?? [];
  const ids = rows.map((r) => r.id);
  const [{ data: sales }, { data: buys }] = await Promise.all([
    ids.length ? supabase.from("sales_documents").select("contact_id, total, paid_amount").eq("kind", "invoice").in("status", ["open", "partial"]).in("contact_id", ids) : Promise.resolve({ data: [] as { contact_id: string; total: number; paid_amount: number }[] }),
    ids.length ? supabase.from("purchase_documents").select("contact_id, total, paid_amount").eq("kind", "bill").in("status", ["open", "partial"]).in("contact_id", ids) : Promise.resolve({ data: [] as { contact_id: string; total: number; paid_amount: number }[] }),
  ]);
  const bal = (list: { contact_id: string; total: number; paid_amount: number }[] | null, id: string) => (list ?? []).filter((x) => x.contact_id === id).reduce((a, x) => a + Number(x.total) - Number(x.paid_amount), 0);
  const qs = (p: Record<string, string | number | undefined>) => {
    const u = new URLSearchParams();
    for (const [k, v] of Object.entries({ jenis, q, ...p })) if (v !== undefined && v !== "" && !(k === "jenis" && v === "semua")) u.set(k, String(v));
    return href(`/kontak${u.toString() ? `?${u}` : ""}`);
  };
  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader title="Kontak" icon="contacts" tone="pink" description="Pelanggan, vendor, dan karyawan usahamu." actions={<Link href={href("/kontak/baru")} className="btn-primary"><Icon name="plus" size={16} /> Tambah kontak</Link>} />
      <div className="card overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:items-center sm:justify-between">
          <Tabs active={jenis} tabs={[["semua", "Semua"], ["customer", "Pelanggan"], ["vendor", "Vendor"], ["employee", "Karyawan"]].map(([key, label]) => ({ key, label, href: qs({ jenis: key, page: undefined }) }))} />
          <SearchBox q={q} placeholder="Cari nama, telepon, email" hidden={{ jenis: jenis === "semua" ? undefined : jenis }} />
        </div>
        {rows.length === 0 ? (
          <EmptyState icon="contacts" title="Belum ada kontak" action={<Link href={href("/kontak/baru")} className="btn-primary">Tambah kontak</Link>} />
        ) : (
          <div className="overflow-x-auto">
            <table className="table-app">
              <thead><tr><th>Nama</th><th>Jenis</th><th>Telepon</th><th>Kota</th><th className="text-right">Piutang</th><th className="text-right">Hutang</th></tr></thead>
              <tbody>
                {rows.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <Link href={href(`/kontak/${c.id}`)} className="flex items-center gap-3">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-tide-2/10 text-xs font-bold text-accent">{initials(c.name)}</span>
                        <span><span className="block font-semibold hover:text-accent">{c.name}</span>{c.company && c.company !== c.name && <span className="text-xs text-muted">{c.company}</span>}</span>
                      </Link>
                    </td>
                    <td><div className="flex flex-wrap gap-1">{(c.kind as string[]).map((k) => <span key={k} className="rounded-full bg-fg/[0.06] px-2 py-0.5 text-xs">{KIND[k] ?? k}</span>)}</div></td>
                    <td>{c.phone ?? "-"}</td>
                    <td>{c.city ?? "-"}</td>
                    <td className="text-right"><Money value={bal(sales, c.id)} /></td>
                    <td className="text-right"><Money value={bal(buys, c.id)} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination page={page} pages={Math.ceil((count ?? 0) / PAGE)} makeHref={(p) => qs({ page: p })} />
      </div>
    </div>
  );
}
