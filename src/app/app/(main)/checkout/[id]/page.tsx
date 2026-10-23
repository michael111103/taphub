import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAppContext, href } from "@/lib/app/context";
import { idr, tgl } from "@/lib/app/format";
import { PageHeader, StatusBadge } from "@/components/app/ui";
import ActionForm from "@/components/app/ActionForm";
import SubmitButton from "@/components/app/SubmitButton";
import Icon from "@/components/app/Icon";
import { methodLabel } from "@/lib/app/payments";
import { cancelCheckout } from "../../../actions";
import PaymentPanel from "./PaymentPanel";

export const metadata: Metadata = { title: "Pembayaran" };

export default async function PaymentPage({ params }: { params: { id: string } }) {
  const { supabase, org } = await getAppContext();
  const { data } = await supabase.from("billing_invoices").select("*, plans(name, tap_products(name))").eq("id", params.id).eq("org_id", org.id).single();
  if (!data) notFound();
  const b = data as unknown as { id: string; number: string; cycle: string; subtotal: number; tax: number; total: number; status: string; payment_method: string; payment_channel: string | null; payment_url: string | null; expires_at: string; paid_at: string | null; created_at: string; plans: { name: string; tap_products: { name: string } } };
  const expired = b.status === "pending" && new Date(b.expires_at) < new Date();
  const status = expired ? "expired" : b.status;

  return (
    <div className="mx-auto max-w-[1000px]">
      <PageHeader title={`Pembayaran ${b.number}`} icon="card" tone="amber" crumbs={[{ label: "Billing", href: href("/pengaturan/billing") }, { label: b.number }]} />
      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <div className="card p-6">
          {status === "pending" ? (
            <PaymentPanel method={b.payment_method} channel={b.payment_channel} total={Number(b.total)} expiresAt={b.expires_at} number={b.number} paymentUrl={b.payment_url} />
          ) : status === "paid" ? (
            <div className="py-10 text-center">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-500/15 text-emerald-600"><Icon name="check" size={32} strokeWidth={2.5} /></span>
              <p className="mt-4 text-xl font-semibold">Pembayaran berhasil</p>
              <p className="mt-1 text-sm text-muted">Dibayar {tgl(b.paid_at)}. Paket sudah aktif.</p>
            </div>
          ) : (
            <div className="py-10 text-center">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-fg/[0.06] text-muted"><Icon name="clock" size={30} /></span>
              <p className="mt-4 text-xl font-semibold">{status === "expired" ? "Batas waktu pembayaran habis" : "Tagihan dibatalkan"}</p>
              <Link href={href("/langganan")} className="btn-primary mt-5">Buat pesanan baru</Link>
            </div>
          )}
        </div>
        <aside className="space-y-4">
          <div className="card space-y-3 p-5 text-sm">
            <div className="flex items-center justify-between"><span className="text-muted">Status</span><StatusBadge status={status} /></div>
            <div className="flex justify-between"><span className="text-muted">Produk</span><span className="font-medium">{b.plans.tap_products.name} {b.plans.name}</span></div>
            <div className="flex justify-between"><span className="text-muted">Periode</span><span>{b.cycle === "yearly" ? "Tahunan" : "Bulanan"}</span></div>
            <div className="flex justify-between"><span className="text-muted">Metode</span><span>{methodLabel(b.payment_method, b.payment_channel)}</span></div>
            <div className="flex justify-between"><span className="text-muted">Subtotal</span><span className="tabular-nums">{idr(b.subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-muted">PPN 11%</span><span className="tabular-nums">{idr(b.tax)}</span></div>
            <div className="flex justify-between border-t border-line pt-3 text-base font-semibold"><span>Total</span><span className="tabular-nums">{idr(b.total)}</span></div>
          </div>
          {status === "pending" && (
            <ActionForm action={cancelCheckout} className="card p-5" confirm="Batalkan tagihan ini?">
              <input type="hidden" name="id" value={b.id} />
              <p className="text-sm text-muted">Ingin ganti metode pembayaran? Batalkan tagihan ini lalu buat pesanan baru.</p>
              <SubmitButton className="btn-soft mt-3 w-full" pendingText="Membatalkan...">Batalkan tagihan</SubmitButton>
            </ActionForm>
          )}
        </aside>
      </div>
    </div>
  );
}
