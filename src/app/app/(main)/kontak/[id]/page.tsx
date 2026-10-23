import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAppContext, href } from "@/lib/app/context";
import { idr, initials, tgl } from "@/lib/app/format";
import { Money, PageHeader, StatCard, StatusBadge } from "@/components/app/ui";
import Icon from "@/components/app/Icon";
import ContactForm from "../ContactForm";

export const metadata: Metadata = { title: "Detail kontak" };

export default async function ContactDetail({ params, searchParams }: { params: { id: string }; searchParams: { ubah?: string } }) {
  const { supabase, org } = await getAppContext();
  const { data: c } = await supabase.from("contacts").select("*").eq("id", params.id).eq("org_id", org.id).single();
  if (!c) notFound();
  const [{ data: sales }, { data: buys }] = await Promise.all([
    supabase.from("sales_documents").select("id, kind, number, date, due_date, status, total, paid_amount").eq("contact_id", c.id).order("date", { ascending: false }).limit(50),
    supabase.from("purchase_documents").select("id, kind, number, date, due_date, status, total, paid_amount").eq("contact_id", c.id).order("date", { ascending: false }).limit(50),
  ]);
  const inv = (sales ?? []).filter((s) => s.kind === "invoice" && s.status !== "void");
  const bills = (buys ?? []).filter((s) => s.kind === "bill" && s.status !== "void");
  const receivable = inv.filter((s) => ["open", "partial"].includes(s.status)).reduce((a, s) => a + Number(s.total) - Number(s.paid_amount), 0);
  const payable = bills.filter((s) => ["open", "partial"].includes(s.status)).reduce((a, s) => a + Number(s.total) - Number(s.paid_amount), 0);
  const docs = [...(sales ?? []).map((d) => ({ ...d, side: "penjualan" })), ...(buys ?? []).map((d) => ({ ...d, side: "pembelian" }))].sort((a, b) => b.date.localeCompare(a.date));
  const label: Record<string, string> = { invoice: "Tagihan", order: "Pemesanan", quote: "Penawaran", bill: "Tagihan pembelian" };

  if (searchParams.ubah) {
    return (
      <div className="mx-auto max-w-3xl">
        <PageHeader title={`Ubah ${c.name}`} icon="contacts" tone="pink" crumbs={[{ label: "Kontak", href: href("/kontak") }, { label: c.name, href: href(`/kontak/${c.id}`) }, { label: "Ubah" }]} />
        <ContactForm c={c} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1200px]">
      <PageHeader
        title={c.name}
        crumbs={[{ label: "Kontak", href: href("/kontak") }, { label: c.name }]}
        actions={
          <>
            <Link href={href(`/kontak/${c.id}?ubah=1`)} className="btn-soft"><Icon name="edit" size={16} /> Ubah</Link>
            <Link href={href(`/penjualan/baru?jenis=invoice&kontak=${c.id}`)} className="btn-primary"><Icon name="plus" size={16} /> Buat tagihan</Link>
          </>
        }
      />
      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <div className="card p-5">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-tide-1 to-tide-2 text-lg font-bold text-white">{initials(c.name)}</span>
          <p className="mt-3 text-lg font-semibold">{c.name}</p>
          {c.company && <p className="text-sm text-muted">{c.company}</p>}
          <dl className="mt-4 space-y-2 text-sm">
            {[["Telepon", c.phone], ["Email", c.email], ["Alamat", [c.address, c.city].filter(Boolean).join(", ")], ["NPWP", c.npwp]].map(([k, v]) => v ? <div key={k as string}><dt className="text-xs text-muted">{k}</dt><dd>{v}</dd></div> : null)}
          </dl>
          {c.phone && <a href={`https://wa.me/${String(c.phone).replace(/\D/g, "").replace(/^0/, "62")}`} target="_blank" rel="noopener noreferrer" className="btn-soft mt-4 w-full">Chat WhatsApp</a>}
        </div>
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <StatCard label="Total penjualan" value={idr(inv.reduce((a, s) => a + Number(s.total), 0))} icon="sales" />
            <StatCard label="Piutang" value={idr(receivable)} icon="clock" tone="amber" />
            <StatCard label="Hutang" value={idr(payable)} icon="purchase" tone="violet" />
          </div>
          <div className="card overflow-hidden">
            <p className="p-5 pb-2 font-semibold">Transaksi</p>
            <div className="overflow-x-auto">
              <table className="table-app">
                <thead><tr><th>Tanggal</th><th>Nomor</th><th>Jenis</th><th>Status</th><th className="text-right">Total</th></tr></thead>
                <tbody>
                  {docs.map((d) => (
                    <tr key={d.id}>
                      <td>{tgl(d.date)}</td>
                      <td><Link href={href(`/${d.side}/dokumen/${d.id}`)} className="mono font-semibold text-accent hover:underline">{d.number}</Link></td>
                      <td>{label[d.kind]}</td>
                      <td><StatusBadge status={d.status} kind={d.kind} dueDate={d.due_date} /></td>
                      <td className="text-right font-semibold"><Money value={d.total} /></td>
                    </tr>
                  ))}
                  {docs.length === 0 && <tr><td colSpan={5} className="py-8 text-center text-muted">Belum ada transaksi.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
