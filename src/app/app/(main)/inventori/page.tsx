import type { Metadata } from "next";
import Link from "next/link";
import { getAppContext, href } from "@/lib/app/context";
import { idr, num, tgl } from "@/lib/app/format";
import { Money, PageHeader, StatCard, Tabs } from "@/components/app/ui";
import { HBars } from "@/components/app/charts";
import Icon from "@/components/app/Icon";

export const metadata: Metadata = { title: "Inventori" };

export default async function InventoryPage({ searchParams }: { searchParams: { filter?: string } }) {
  const { supabase, org } = await getAppContext();
  const filter = searchParams.filter ?? "semua";
  const [{ data: items }, { data: moves }] = await Promise.all([
    supabase.from("items").select("id, sku, name, unit, category, stock_qty, min_stock, buy_price").eq("org_id", org.id).eq("track_stock", true).eq("is_archived", false).order("name"),
    supabase.from("inventory_movements").select("id, date, qty, note, items(name, unit)").eq("org_id", org.id).order("created_at", { ascending: false }).limit(15),
  ]);
  const all = items ?? [];
  const list = filter === "menipis" ? all.filter((i) => Number(i.stock_qty) <= Number(i.min_stock)) : all;
  const value = all.reduce((a, i) => a + Number(i.stock_qty) * Number(i.buy_price), 0);
  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader title="Inventori" icon="inventory" tone="teal" description="Posisi stok dan nilai persediaan." actions={<Link href={href("/pembelian/baru?jenis=order")} className="btn-primary"><Icon name="plus" size={16} /> Pesanan pembelian</Link>} />
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <StatCard label="Nilai persediaan" value={idr(value)} icon="inventory" tone="teal" />
        <StatCard label="Produk dilacak" value={num(all.length)} icon="box" tone="amber" />
        <StatCard label="Stok menipis" value={num(all.filter((i) => Number(i.stock_qty) <= Number(i.min_stock)).length)} icon="bell" tone="pink" />
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <div className="card overflow-hidden">
          <div className="border-b border-line p-4"><Tabs active={filter} tabs={[{ key: "semua", label: "Semua", href: href("/inventori") }, { key: "menipis", label: "Stok menipis", href: href("/inventori?filter=menipis") }]} /></div>
          <div className="overflow-x-auto">
            <table className="table-app">
              <thead><tr><th>Produk</th><th className="text-right">Stok</th><th className="text-right">Minimum</th><th className="text-right">Nilai</th></tr></thead>
              <tbody>
                {list.map((i) => {
                  const pct = Math.min(100, (Number(i.stock_qty) / Math.max(1, Number(i.min_stock) * 4)) * 100);
                  const low = Number(i.stock_qty) <= Number(i.min_stock);
                  return (
                    <tr key={i.id}>
                      <td>
                        <Link href={href(`/produk/${i.id}`)} className="font-semibold hover:text-accent">{i.name}</Link>
                        <div className="mt-1.5 h-1.5 w-40 overflow-hidden rounded-full bg-fg/[0.07]"><div className={`anim-grow-x h-full rounded-full ${low ? "bg-rose-500" : "bg-emerald-500"}`} style={{ width: `${pct}%` }} /></div>
                      </td>
                      <td className={`text-right tabular-nums ${low ? "font-semibold text-rose-600 dark:text-rose-400" : ""}`}>{num(i.stock_qty)} {i.unit}</td>
                      <td className="text-right tabular-nums text-muted">{num(i.min_stock)}</td>
                      <td className="text-right"><Money value={Number(i.stock_qty) * Number(i.buy_price)} /></td>
                    </tr>
                  );
                })}
                {list.length === 0 && <tr><td colSpan={4} className="py-8 text-center text-muted">Tidak ada produk.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
        <div className="space-y-4">
          <div className="card p-5">
            <p className="font-semibold">Nilai persediaan terbesar</p>
            <div className="mt-4"><HBars items={[...all].sort((a, b) => Number(b.stock_qty) * Number(b.buy_price) - Number(a.stock_qty) * Number(a.buy_price)).slice(0, 6).map((i) => ({ name: i.name, value: Number(i.stock_qty) * Number(i.buy_price) }))} format="compact" color="#14B8A6" /></div>
          </div>
          <div className="card p-5">
            <p className="font-semibold">Mutasi terakhir</p>
            <ul className="mt-3 space-y-2 text-sm">
              {((moves ?? []) as unknown as { id: string; date: string; qty: number; note: string; items: { name: string; unit: string } | null }[]).map((m) => (
                <li key={m.id} className="flex items-center justify-between gap-3">
                  <span className="min-w-0"><span className="block truncate">{m.items?.name}</span><span className="text-xs text-muted">{tgl(m.date)} · {m.note}</span></span>
                  <span className={`mono font-semibold ${Number(m.qty) > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>{Number(m.qty) > 0 ? "+" : ""}{num(m.qty)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
