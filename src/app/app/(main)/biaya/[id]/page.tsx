import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAppContext, href } from "@/lib/app/context";
import { idr, tgl, todayJakarta } from "@/lib/app/format";
import { Money, PageHeader, StatusBadge } from "@/components/app/ui";
import ActionForm from "@/components/app/ActionForm";
import SubmitButton from "@/components/app/SubmitButton";
import PrintButton from "@/components/app/PrintButton";
import { TileIcon } from "@/components/app/Icon";
import { recordPayment, voidDocument } from "../../../actions";

export const metadata: Metadata = { title: "Detail biaya" };

export default async function ExpenseDetail({ params }: { params: { id: string } }) {
  const { supabase, org } = await getAppContext();
  const { data } = await supabase.from("expenses").select("*, contacts(id, name), accounts:pay_from_account_id(name), expense_lines(id, description, amount, tax_rate, sort, accounts(code, name))").eq("id", params.id).eq("org_id", org.id).single();
  if (!data) notFound();
  type E = { id: string; number: string; date: string; due_date: string | null; status: string; subtotal: number; tax: number; total: number; paid_amount: number; reference: string | null; notes: string | null; pay_from_account_id: string | null; contacts: { id: string; name: string } | null; accounts: { name: string } | null; expense_lines: { id: string; description: string | null; amount: number; tax_rate: number; sort: number; accounts: { code: string; name: string } | null }[] };
  const e = data as unknown as E;
  const remaining = Number(e.total) - Number(e.paid_amount);
  const { data: cash } = await supabase.from("accounts").select("id, code, name").eq("org_id", org.id).eq("category", "kas_bank").order("code");

  return (
    <div className="mx-auto max-w-[1100px]">
      <PageHeader title={`Biaya ${e.number}`} icon="expense" tone="pink" crumbs={[{ label: "Biaya", href: href("/biaya") }, { label: e.number }]} actions={<PrintButton />} />
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="card overflow-hidden">
          <dl className="grid gap-4 border-b border-line p-5 text-sm sm:grid-cols-4">
            <div><dt className="text-muted">Status</dt><dd className="mt-1"><StatusBadge status={e.status} dueDate={e.due_date} /></dd></div>
            <div><dt className="text-muted">Tanggal</dt><dd className="mt-1 font-medium">{tgl(e.date)}</dd></div>
            <div><dt className="text-muted">Penerima</dt><dd className="mt-1 font-medium">{e.contacts ? <Link href={href(`/kontak/${e.contacts.id}`)} className="hover:text-accent">{e.contacts.name}</Link> : "-"}</dd></div>
            <div><dt className="text-muted">{e.pay_from_account_id ? "Dibayar dari" : "Jatuh tempo"}</dt><dd className="mt-1 font-medium">{e.pay_from_account_id ? e.accounts?.name : tgl(e.due_date)}</dd></div>
          </dl>
          <table className="table-app">
            <thead><tr><th>Akun</th><th>Deskripsi</th><th className="text-right">Pajak</th><th className="text-right">Jumlah</th></tr></thead>
            <tbody>
              {e.expense_lines.sort((a, b) => a.sort - b.sort).map((l) => (
                <tr key={l.id}><td><span className="mono text-xs text-muted">{l.accounts?.code}</span> {l.accounts?.name}</td><td>{l.description ?? "-"}</td><td className="text-right">{Number(l.tax_rate) ? `PPN ${l.tax_rate}%` : "-"}</td><td className="text-right"><Money value={l.amount} /></td></tr>
              ))}
            </tbody>
          </table>
          <dl className="ml-auto max-w-xs space-y-2 p-5 text-sm">
            <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd><Money value={e.subtotal} /></dd></div>
            <div className="flex justify-between"><dt className="text-muted">PPN</dt><dd><Money value={e.tax} /></dd></div>
            <div className="flex justify-between border-t border-line pt-2 text-base font-semibold"><dt>Total</dt><dd>{idr(e.total)}</dd></div>
            {e.status !== "void" && <div className="flex justify-between font-semibold"><dt>Sisa</dt><dd>{idr(remaining)}</dd></div>}
          </dl>
          {e.notes && <p className="border-t border-line p-5 text-sm text-muted">{e.notes}</p>}
        </div>
        <div className="no-print space-y-4">
          {e.status !== "void" && remaining > 0.009 && (
            <div className="card p-5">
              <h2 className="flex items-center gap-2 font-semibold"><TileIcon name="wallet" tone="green" size={28} /> Bayar biaya</h2>
              <ActionForm action={recordPayment} className="mt-4 space-y-3">
                <input type="hidden" name="source_type" value="expense" />
                <input type="hidden" name="source_id" value={e.id} />
                <div><label className="label" htmlFor="amount">Jumlah</label><input id="amount" name="amount" type="number" step="any" defaultValue={remaining} max={remaining} className="field" /></div>
                <div><label className="label" htmlFor="acc">Bayar dari</label><select id="acc" name="account_id" className="field">{(cash ?? []).map((a) => <option key={a.id} value={a.id}>{a.code} · {a.name}</option>)}</select></div>
                <div><label className="label" htmlFor="d">Tanggal</label><input id="d" name="date" type="date" defaultValue={todayJakarta()} className="field" /></div>
                <SubmitButton className="btn-primary w-full">Catat pembayaran</SubmitButton>
              </ActionForm>
            </div>
          )}
          {e.status !== "void" && (
            <div className="card p-5">
              <h2 className="font-semibold">Batalkan biaya</h2>
              <p className="mt-1 text-sm text-muted">Jurnal dibalik otomatis. Riwayat tetap tersimpan.</p>
              <ActionForm action={voidDocument} className="mt-3" confirm={`Batalkan ${e.number}?`}>
                <input type="hidden" name="source_type" value="expense" />
                <input type="hidden" name="id" value={e.id} />
                <SubmitButton className="btn-danger w-full" pendingText="Membatalkan...">Batalkan biaya</SubmitButton>
              </ActionForm>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
