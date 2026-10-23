"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import Icon from "./Icon";
import { idr } from "@/lib/app/format";
import { saveExpense } from "@/app/app/actions";

type Acc = { id: string; code: string; name: string };
type Line = { key: number; account_id: string; description: string; amount: number; tax_rate: number };
let seq = 1;

export default function ExpenseForm({
  expenseAccounts,
  cashAccounts,
  contacts,
  today,
  cancelHref,
}: {
  expenseAccounts: Acc[];
  cashAccounts: Acc[];
  contacts: { id: string; name: string }[];
  today: string;
  cancelHref: string;
}) {
  const [payNow, setPayNow] = useState(true);
  const [payFrom, setPayFrom] = useState(cashAccounts[0]?.id ?? "");
  const [contactId, setContactId] = useState("");
  const [date, setDate] = useState(today);
  const [due, setDue] = useState("");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");
  const [lines, setLines] = useState<Line[]>([{ key: seq++, account_id: expenseAccounts[0]?.id ?? "", description: "", amount: 0, tax_rate: 0 }]);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const totals = useMemo(() => {
    const sub = lines.reduce((a, l) => a + (l.amount || 0), 0);
    const tax = lines.reduce((a, l) => a + Math.round((l.amount || 0) * l.tax_rate) / 100, 0);
    return { sub, tax, total: sub + tax };
  }, [lines]);
  const update = (key: number, patch: Partial<Line>) => setLines((ls) => ls.map((l) => (l.key === key ? { ...l, ...patch } : l)));

  function submit() {
    setError(null);
    const valid = lines.filter((l) => l.account_id && l.amount > 0);
    if (!valid.length) return setError("Isi minimal satu baris biaya dengan jumlah lebih dari 0.");
    start(async () => {
      const r = await saveExpense({
        contact_id: contactId,
        date,
        due_date: payNow ? "" : due,
        pay_from_account_id: payNow ? payFrom : "",
        reference,
        notes,
        lines: valid.map(({ key: _k, ...l }) => l),
      });
      if (r?.error) setError(r.error);
    });
  }

  return (
    <div className="space-y-4">
      <div className="card grid gap-4 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-4">
          <span className="label">Status pembayaran</span>
          <div className="inline-flex rounded-xl border border-line bg-panel p-1 text-sm font-semibold">
            <button type="button" onClick={() => setPayNow(true)} className={`rounded-lg px-4 py-1.5 ${payNow ? "bg-raised text-accent shadow-sm" : "text-muted"}`}>Sudah dibayar</button>
            <button type="button" onClick={() => setPayNow(false)} className={`rounded-lg px-4 py-1.5 ${!payNow ? "bg-raised text-accent shadow-sm" : "text-muted"}`}>Bayar nanti</button>
          </div>
        </div>
        {payNow ? (
          <div>
            <label className="label" htmlFor="pay">Dibayar dari</label>
            <select id="pay" value={payFrom} onChange={(e) => setPayFrom(e.target.value)} className="field">
              {cashAccounts.map((a) => <option key={a.id} value={a.id}>{a.code} · {a.name}</option>)}
            </select>
          </div>
        ) : (
          <div>
            <label className="label" htmlFor="due">Jatuh tempo</label>
            <input id="due" type="date" value={due} onChange={(e) => setDue(e.target.value)} className="field" />
          </div>
        )}
        <div>
          <label className="label" htmlFor="contact">Penerima</label>
          <select id="contact" value={contactId} onChange={(e) => setContactId(e.target.value)} className="field">
            <option value="">Tanpa kontak</option>
            {contacts.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="date">Tanggal</label>
          <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="field" />
        </div>
        <div>
          <label className="label" htmlFor="ref">Referensi</label>
          <input id="ref" value={reference} onChange={(e) => setReference(e.target.value)} className="field" placeholder="No. kuitansi" />
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-app min-w-[720px]">
            <thead><tr><th className="w-[32%]">Akun biaya</th><th>Deskripsi</th><th className="w-28">Pajak</th><th className="w-44 text-right">Jumlah</th><th className="w-10" /></tr></thead>
            <tbody>
              {lines.map((l) => (
                <tr key={l.key}>
                  <td>
                    <select value={l.account_id} onChange={(e) => update(l.key, { account_id: e.target.value })} className="field" aria-label="Akun biaya">
                      {expenseAccounts.map((a) => <option key={a.id} value={a.id}>{a.code} · {a.name}</option>)}
                    </select>
                  </td>
                  <td><input value={l.description} onChange={(e) => update(l.key, { description: e.target.value })} className="field" aria-label="Deskripsi" /></td>
                  <td>
                    <select value={l.tax_rate} onChange={(e) => update(l.key, { tax_rate: Number(e.target.value) })} className="field px-2" aria-label="Pajak">
                      <option value={0}>Tanpa</option>
                      <option value={11}>PPN 11%</option>
                    </select>
                  </td>
                  <td><input type="number" min={0} step="any" value={l.amount || ""} onChange={(e) => update(l.key, { amount: Number(e.target.value) })} className="field text-right" aria-label="Jumlah" /></td>
                  <td>
                    <button type="button" onClick={() => setLines((ls) => (ls.length > 1 ? ls.filter((x) => x.key !== l.key) : ls))} className="grid h-9 w-9 place-items-center rounded-lg text-muted hover:bg-rose-500/10 hover:text-rose-500" aria-label="Hapus baris"><Icon name="trash" size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-line p-3">
          <button type="button" onClick={() => setLines((ls) => [...ls, { key: seq++, account_id: expenseAccounts[0]?.id ?? "", description: "", amount: 0, tax_rate: 0 }])} className="btn-soft h-9 text-accent"><Icon name="plus" size={16} /> Tambah baris</button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="card p-4 sm:p-5">
          <label className="label" htmlFor="notes">Catatan</label>
          <textarea id="notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} className="field" />
        </div>
        <div className="card space-y-3 p-4 text-sm sm:p-5">
          <div className="flex justify-between"><span className="text-muted">Subtotal</span><span className="tabular-nums">{idr(totals.sub)}</span></div>
          <div className="flex justify-between"><span className="text-muted">PPN</span><span className="tabular-nums">{idr(totals.tax)}</span></div>
          <div className="flex justify-between border-t border-line pt-3 text-base font-semibold"><span>Total</span><span className="tabular-nums">{idr(totals.total)}</span></div>
          {error && <p role="alert" className="rounded-xl bg-rose-500/10 px-3 py-2 text-rose-600 dark:text-rose-300">{error}</p>}
          <div className="flex gap-2">
            <Link href={cancelHref} className="btn-soft">Batal</Link>
            <button type="button" disabled={pending} onClick={submit} className="btn-primary flex-1">{pending ? "Menyimpan..." : "Simpan biaya"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
