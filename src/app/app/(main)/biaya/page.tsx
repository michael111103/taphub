import type { Metadata } from "next";
import Link from "next/link";
import { getAppContext, href } from "@/lib/app/context";
import { idr, tgl, todayJakarta } from "@/lib/app/format";
import { EmptyState, Money, PageHeader, Pagination, SearchBox, StatCard, StatusBadge, Tabs } from "@/components/app/ui";
import Icon from "@/components/app/Icon";

export const metadata: Metadata = { title: "Biaya" };
const PAGE = 25;

export default async function ExpensesPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const { supabase, org } = await getAppContext();
  const today = todayJakarta();
  const status = searchParams.status ?? "semua";
  const q = searchParams.q?.trim().replace(/[,()%]/g, " ");
  const page = Math.max(1, Number(searchParams.page) || 1);

  let query = supabase.from("expenses").select("id, number, date, due_date, status, total, paid_amount, reference, contacts(name), expense_lines(description, accounts(name))", { count: "exact" }).eq("org_id", org.id);
  if (status === "belum-dibayar") query = query.in("status", ["open", "partial"]);
  if (status === "lunas") query = query.eq("status", "paid");
  if (status === "jatuh-tempo") query = query.in("status", ["open", "partial"]).lt("due_date", today);
  if (q) query = query.or(`number.ilike.%${q}%,reference.ilike.%${q}%`);
  const { data, count } = await query.order("date", { ascending: false }).order("number", { ascending: false }).range((page - 1) * PAGE, page * PAGE - 1);
  type Row = { id: string; number: string; date: string; due_date: string | null; status: string; total: number; paid_amount: number; reference: string | null; contacts: { name: string } | null; expense_lines: { description: string | null; accounts: { name: string } | null }[] };
  const rows = (data ?? []) as unknown as Row[];

  const { data: summary } = await supabase.from("expenses").select("date, total, paid_amount, status, due_date").eq("org_id", org.id).neq("status", "void");
  const s = summary ?? [];
  const month = today.slice(0, 7);
  const prevMonth = new Date(`${month}-01T00:00:00Z`);
  prevMonth.setUTCMonth(prevMonth.getUTCMonth() - 1);
  const pm = prevMonth.toISOString().slice(0, 7);
  const sum = (f: (r: (typeof s)[number]) => boolean, v: (r: (typeof s)[number]) => number = (r) => Number(r.total)) => s.filter(f).reduce((a, r) => a + v(r), 0);

  const qs = (p: Record<string, string | number | undefined>) => {
    const u = new URLSearchParams();
    for (const [k, v] of Object.entries({ status, q, ...p })) if (v !== undefined && v !== "" && !(k === "status" && v === "semua")) u.set(k, String(v));
    return href(`/biaya${u.toString() ? `?${u}` : ""}`);
  };

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader title="Biaya" icon="expense" tone="pink" description="Catat pengeluaran operasional seperti sewa, gaji, listrik, dan iklan." actions={<Link href={href("/biaya/baru")} className="btn-primary"><Icon name="plus" size={16} /> Catat biaya</Link>} />
      <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Bulan ini" value={idr(sum((r) => r.date.startsWith(month)))} icon="expense" tone="pink" />
        <StatCard label="Bulan lalu" value={idr(sum((r) => r.date.startsWith(pm)))} icon="clock" tone="violet" />
        <StatCard label="Belum dibayar" value={idr(sum((r) => r.status === "open" || r.status === "partial", (r) => Number(r.total) - Number(r.paid_amount)))} icon="wallet" tone="amber" />
        <StatCard label="Jatuh tempo" value={idr(sum((r) => (r.status === "open" || r.status === "partial") && !!r.due_date && r.due_date < today, (r) => Number(r.total) - Number(r.paid_amount)))} icon="bell" tone="pink" />
      </div>
      <div className="card overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:items-center sm:justify-between">
          <Tabs active={status} tabs={[["semua", "Semua"], ["belum-dibayar", "Belum dibayar"], ["lunas", "Lunas"], ["jatuh-tempo", "Jatuh tempo"]].map(([key, label]) => ({ key, label, href: qs({ status: key, page: undefined }) }))} />
          <SearchBox q={q} placeholder="Cari nomor atau referensi" hidden={{ status: status === "semua" ? undefined : status }} />
        </div>
        {rows.length === 0 ? (
          <EmptyState icon="expense" title="Belum ada biaya" action={<Link href={href("/biaya/baru")} className="btn-primary"><Icon name="plus" size={16} /> Catat biaya</Link>} />
        ) : (
          <div className="overflow-x-auto">
            <table className="table-app">
              <thead><tr><th>Tanggal</th><th>Nomor</th><th>Kategori</th><th>Penerima</th><th>Status</th><th className="text-right">Sisa</th><th className="text-right">Total</th></tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td className="whitespace-nowrap">{tgl(r.date)}</td>
                    <td><Link href={href(`/biaya/${r.id}`)} className="mono font-semibold text-accent hover:underline">{r.number}</Link></td>
                    <td className="max-w-[240px] truncate text-muted">{r.expense_lines.map((l) => l.accounts?.name).filter(Boolean).join(", ")}</td>
                    <td>{r.contacts?.name ?? "-"}</td>
                    <td><StatusBadge status={r.status} dueDate={r.due_date} /></td>
                    <td className="text-right"><Money value={r.status === "void" ? 0 : Number(r.total) - Number(r.paid_amount)} /></td>
                    <td className="text-right font-semibold"><Money value={r.total} /></td>
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
