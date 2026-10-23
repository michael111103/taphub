import type { Metadata } from "next";
import Link from "next/link";
import { getAppContext, href } from "@/lib/app/context";
import { idr, tgl } from "@/lib/app/format";
import { EmptyState, PageHeader, StatusBadge } from "@/components/app/ui";
import Icon from "@/components/app/Icon";

export const metadata: Metadata = { title: "Billing" };

export default async function BillingPage() {
  const { supabase, org, subscriptions } = await getAppContext();
  const { data } = await supabase.from("billing_invoices").select("id, number, cycle, total, status, created_at, expires_at, payment_method, payment_channel, plans(name, product_code)").eq("org_id", org.id).order("created_at", { ascending: false });
  type B = { id: string; number: string; cycle: string; total: number; status: string; created_at: string; expires_at: string; payment_method: string; payment_channel: string | null; plans: { name: string; product_code: string } | null };
  const rows = (data ?? []) as unknown as B[];
  const NAMES: Record<string, string> = { books: "TapBooks", pos: "TapPOS", invoice: "TapInvoice", stock: "TapStock", staff: "TapStaff" };
  return (
    <div className="mx-auto max-w-[1100px]">
      <PageHeader title="Billing" icon="card" tone="amber" crumbs={[{ label: "Pengaturan", href: href("/pengaturan") }, { label: "Billing" }]} actions={<Link href={href("/langganan")} className="btn-primary"><Icon name="rocket" size={16} /> Upgrade paket</Link>} />
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        {subscriptions.map((s) => (
          <div key={s.product_code} className="card p-4">
            <p className="text-sm font-semibold">{NAMES[s.product_code] ?? s.product_code}</p>
            <div className="mt-2 flex items-center justify-between"><StatusBadge status={s.status} /><span className="text-xs text-muted">{s.status === "trial" ? `s.d. ${tgl(s.trial_ends_at)}` : s.current_period_end ? `s.d. ${tgl(s.current_period_end)}` : ""}</span></div>
            {s.plan && <p className="mt-2 text-xs text-muted">Paket {s.plan.name}</p>}
          </div>
        ))}
      </div>
      <div className="card overflow-hidden">
        <p className="p-5 pb-2 font-semibold">Riwayat tagihan langganan</p>
        {rows.length === 0 ? (
          <EmptyState icon="card" title="Belum ada tagihan langganan" />
        ) : (
          <table className="table-app">
            <thead><tr><th>Nomor</th><th>Paket</th><th>Tanggal</th><th>Status</th><th className="text-right">Total</th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td><Link href={href(`/checkout/${r.id}`)} className="mono font-semibold text-accent hover:underline">{r.number}</Link></td>
                  <td>{NAMES[r.plans?.product_code ?? ""]} {r.plans?.name} · {r.cycle === "yearly" ? "Tahunan" : "Bulanan"}</td>
                  <td>{tgl(r.created_at)}</td>
                  <td><StatusBadge status={r.status === "pending" && new Date(r.expires_at) < new Date() ? "expired" : r.status} /></td>
                  <td className="text-right font-semibold">{idr(r.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
