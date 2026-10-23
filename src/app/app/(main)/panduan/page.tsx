import type { Metadata } from "next";
import Link from "next/link";
import { getAppContext, href } from "@/lib/app/context";
import { PageHeader } from "@/components/app/ui";
import Icon from "@/components/app/Icon";

export const metadata: Metadata = { title: "Panduan memulai" };

export default async function GuidePage() {
  const { supabase, org } = await getAppContext();
  const [{ count: contacts }, { count: items }, { count: invoices }, { count: payments }] = await Promise.all([
    supabase.from("contacts").select("id", { count: "exact", head: true }).eq("org_id", org.id),
    supabase.from("items").select("id", { count: "exact", head: true }).eq("org_id", org.id),
    supabase.from("sales_documents").select("id", { count: "exact", head: true }).eq("org_id", org.id).eq("kind", "invoice"),
    supabase.from("payments").select("id", { count: "exact", head: true }).eq("org_id", org.id).eq("direction", "in"),
  ]);
  const steps = [
    { done: (contacts ?? 0) > 0, t: "Tambah pelanggan", d: "Simpan nama dan nomor WhatsApp pelanggan.", h: "/kontak/baru", i: "contacts" },
    { done: (items ?? 0) > 0, t: "Tambah produk", d: "Isi harga jual, harga beli, dan stok minimum.", h: "/produk/baru", i: "box" },
    { done: (invoices ?? 0) > 0, t: "Buat tagihan penjualan", d: "Piutang, pendapatan, PPN, dan stok tercatat otomatis.", h: "/penjualan/baru?jenis=invoice", i: "sales" },
    { done: (payments ?? 0) > 0, t: "Catat pembayaran", d: "Buka tagihan lalu klik Terima pembayaran.", h: "/penjualan/tagihan", i: "wallet" },
    { done: (invoices ?? 0) > 0, t: "Lihat laporan Laba Rugi", d: "Semua transaksi tadi langsung muncul di laporan.", h: "/laporan/laba-rugi", i: "report" },
  ];
  const done = steps.filter((s) => s.done).length;
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Panduan memulai" icon="rocket" tone="blue" description="Lima langkah supaya pembukuan usahamu langsung jalan." />
      <div className="card mb-4 p-5">
        <div className="flex items-center justify-between text-sm"><span className="font-semibold">{done} dari {steps.length} langkah selesai</span><span className="text-muted">{Math.round((done / steps.length) * 100)}%</span></div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-fg/[0.07]"><div className="anim-grow-x h-full rounded-full bg-gradient-to-r from-tide-1 to-tide-2" style={{ width: `${(done / steps.length) * 100}%` }} /></div>
      </div>
      <ol className="space-y-3">
        {steps.map((s, i) => (
          <li key={s.t}>
            <Link href={href(s.h)} className="card group flex items-center gap-4 p-4 transition hover:border-tide-2/40">
              <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${s.done ? "bg-emerald-500 text-white" : "bg-tide-2/10 text-accent"}`}>
                {s.done ? <Icon name="check" size={20} strokeWidth={2.6} /> : <span className="mono font-bold">{i + 1}</span>}
              </span>
              <span className="flex-1"><span className={`block font-semibold ${s.done ? "text-muted line-through" : ""}`}>{s.t}</span><span className="text-sm text-muted">{s.d}</span></span>
              <Icon name="chevron-right" size={18} className="text-muted transition group-hover:translate-x-0.5" />
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
