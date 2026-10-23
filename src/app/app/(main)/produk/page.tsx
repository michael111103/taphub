import type { Metadata } from "next";
import Link from "next/link";
import { getAppContext, href } from "@/lib/app/context";
import { idr, num } from "@/lib/app/format";
import { EmptyState, Money, PageHeader, Pagination, SearchBox, StatCard, Tabs } from "@/components/app/ui";
import Icon from "@/components/app/Icon";

export const metadata: Metadata = { title: "Produk" };
const PAGE = 30;

export default async function ItemsPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const { supabase, org } = await getAppContext();
  const kat = searchParams.kategori ?? "semua";
  const q = searchParams.q?.trim().replace(/[,()%]/g, " ");
  const page = Math.max(1, Number(searchParams.page) || 1);
  const { data: all } = await supabase.from("items").select("category, stock_qty, buy_price, min_stock, track_stock").eq("org_id", org.id).eq("is_archived", false);
  const cats = [...new Set((all ?? []).map((i) => i.category).filter(Boolean))] as string[];
  let query = supabase.from("items").select("id, sku, name, unit, category, sell_price, buy_price, stock_qty, min_stock, track_stock", { count: "exact" }).eq("org_id", org.id).eq("is_archived", false);
  if (kat !== "semua") query = query.eq("category", kat);
  if (q) query = query.or(`name.ilike.%${q}%,sku.ilike.%${q}%`);
  const { data, count } = await query.order("name").range((page - 1) * PAGE, page * PAGE - 1);
  const rows = data ?? [];
  const tracked = (all ?? []).filter((i) => i.track_stock);
  const qs = (p: Record<string, string | number | undefined>) => {
    const u = new URLSearchParams();
    for (const [k, v] of Object.entries({ kategori: kat, q, ...p })) if (v !== undefined && v !== "" && !(k === "kategori" && v === "semua")) u.set(k, String(v));
    return href(`/produk${u.toString() ? `?${u}` : ""}`);
  };
  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader title="Produk" icon="box" tone="amber" description="Barang dan jasa yang kamu jual atau beli." actions={<Link href={href("/produk/baru")} className="btn-primary"><Icon name="plus" size={16} /> Tambah produk</Link>} />
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <StatCard label="Jumlah produk" value={num((all ?? []).length)} icon="box" tone="amber" />
        <StatCard label="Nilai persediaan" value={idr(tracked.reduce((a, i) => a + Number(i.stock_qty) * Number(i.buy_price), 0))} hint="Stok × harga beli terakhir" icon="inventory" tone="teal" />
        <StatCard label="Stok menipis" value={num(tracked.filter((i) => Number(i.stock_qty) <= Number(i.min_stock)).length)} hint="Di bawah stok minimum" icon="bell" tone="pink" />
      </div>
      <div className="card overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:items-center sm:justify-between">
          <Tabs active={kat} tabs={[{ key: "semua", label: "Semua" }, ...cats.map((c) => ({ key: c, label: c }))].map((t) => ({ ...t, href: qs({ kategori: t.key, page: undefined }) }))} />
          <SearchBox q={q} placeholder="Cari nama atau SKU" hidden={{ kategori: kat === "semua" ? undefined : kat }} />
        </div>
        {rows.length === 0 ? (
          <EmptyState icon="box" title="Belum ada produk" action={<Link href={href("/produk/baru")} className="btn-primary">Tambah produk</Link>} />
        ) : (
          <div className="overflow-x-auto">
            <table className="table-app">
              <thead><tr><th>Produk</th><th>Kategori</th><th className="text-right">Stok</th><th className="text-right">Harga beli</th><th className="text-right">Harga jual</th><th className="text-right">Margin</th></tr></thead>
              <tbody>
                {rows.map((i) => {
                  const low = i.track_stock && Number(i.stock_qty) <= Number(i.min_stock);
                  const margin = Number(i.sell_price) ? ((Number(i.sell_price) - Number(i.buy_price)) / Number(i.sell_price)) * 100 : 0;
                  return (
                    <tr key={i.id}>
                      <td><Link href={href(`/produk/${i.id}`)} className="font-semibold hover:text-accent">{i.name}</Link>{i.sku && <p className="mono text-xs text-muted">{i.sku}</p>}</td>
                      <td>{i.category ?? "-"}</td>
                      <td className={`text-right tabular-nums ${low ? "font-semibold text-rose-600 dark:text-rose-400" : ""}`}>{i.track_stock ? `${num(i.stock_qty)} ${i.unit}` : "Tanpa stok"}</td>
                      <td className="text-right"><Money value={i.buy_price} /></td>
                      <td className="text-right font-semibold"><Money value={i.sell_price} /></td>
                      <td className="text-right tabular-nums">{margin.toFixed(0)}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <Pagination page={page} pages={Math.ceil((count ?? 0) / PAGE)} makeHref={(p) => qs({ page: p })} />
      </div>
    </div>
  );
}
