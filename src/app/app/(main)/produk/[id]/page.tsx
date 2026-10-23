import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAppContext, href } from "@/lib/app/context";
import { idr, num, tgl } from "@/lib/app/format";
import { PageHeader, StatCard } from "@/components/app/ui";
import Icon from "@/components/app/Icon";
import ItemForm from "../ItemForm";

export const metadata: Metadata = { title: "Detail produk" };

export default async function ItemDetail({ params, searchParams }: { params: { id: string }; searchParams: { ubah?: string } }) {
  const { supabase, org } = await getAppContext();
  const { data: i } = await supabase.from("items").select("*").eq("id", params.id).eq("org_id", org.id).single();
  if (!i) notFound();
  if (searchParams.ubah) {
    const { data } = await supabase.from("items").select("category").eq("org_id", org.id);
    return (
      <div className="mx-auto max-w-3xl">
        <PageHeader title={`Ubah ${i.name}`} icon="box" tone="amber" crumbs={[{ label: "Produk", href: href("/produk") }, { label: i.name, href: href(`/produk/${i.id}`) }, { label: "Ubah" }]} />
        <ItemForm i={i} categories={[...new Set((data ?? []).map((d) => d.category).filter(Boolean))] as string[]} />
      </div>
    );
  }
  const [{ data: moves }, { data: sold }] = await Promise.all([
    supabase.from("inventory_movements").select("id, date, qty, unit_cost, note, source_type, source_id").eq("item_id", i.id).order("date", { ascending: false }).order("created_at", { ascending: false }).limit(60),
    supabase.from("sales_document_lines").select("qty, amount, sales_documents!inner(status, kind)").eq("item_id", i.id).eq("sales_documents.kind", "invoice").neq("sales_documents.status", "void"),
  ]);
  const soldQty = (sold ?? []).reduce((a, s) => a + Number(s.qty), 0);
  const soldAmt = (sold ?? []).reduce((a, s) => a + Number(s.amount), 0);
  return (
    <div className="mx-auto max-w-[1200px]">
      <PageHeader title={i.name} icon="box" tone="amber" crumbs={[{ label: "Produk", href: href("/produk") }, { label: i.name }]} actions={<Link href={href(`/produk/${i.id}?ubah=1`)} className="btn-soft"><Icon name="edit" size={16} /> Ubah</Link>} />
      <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Stok" value={i.track_stock ? `${num(i.stock_qty)} ${i.unit}` : "Tanpa stok"} hint={i.track_stock ? `Minimum ${num(i.min_stock)}` : undefined} icon="inventory" tone="teal" />
        <StatCard label="Harga jual" value={idr(i.sell_price)} hint={`Harga beli ${idr(i.buy_price)}`} icon="tag" tone="amber" />
        <StatCard label="Terjual" value={`${num(soldQty)} ${i.unit}`} icon="sales" />
        <StatCard label="Nilai penjualan" value={idr(soldAmt)} icon="report" tone="green" />
      </div>
      <div className="card overflow-hidden">
        <p className="p-5 pb-2 font-semibold">Mutasi stok</p>
        <div className="overflow-x-auto">
          <table className="table-app">
            <thead><tr><th>Tanggal</th><th>Keterangan</th><th className="text-right">Masuk</th><th className="text-right">Keluar</th><th className="text-right">Harga pokok</th></tr></thead>
            <tbody>
              {(moves ?? []).map((m) => (
                <tr key={m.id}>
                  <td>{tgl(m.date)}</td>
                  <td>{m.source_id ? <Link href={href(`/${m.source_type === "sales" ? "penjualan" : "pembelian"}/dokumen/${m.source_id}`)} className="text-accent hover:underline">{m.note}</Link> : m.note}</td>
                  <td className="text-right tabular-nums text-emerald-600 dark:text-emerald-400">{Number(m.qty) > 0 ? num(m.qty) : ""}</td>
                  <td className="text-right tabular-nums text-rose-600 dark:text-rose-400">{Number(m.qty) < 0 ? num(-m.qty) : ""}</td>
                  <td className="text-right tabular-nums">{idr(m.unit_cost)}</td>
                </tr>
              ))}
              {(moves ?? []).length === 0 && <tr><td colSpan={5} className="py-8 text-center text-muted">Belum ada mutasi stok.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
