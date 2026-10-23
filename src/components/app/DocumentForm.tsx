"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import Icon from "./Icon";
import { idr } from "@/lib/app/format";
import { savePurchaseDocument, saveSalesDocument } from "@/app/app/actions";

type Item = { id: string; name: string; sku: string | null; unit: string; sell_price: number; buy_price: number; stock_qty: number; track_stock: boolean };
type Contact = { id: string; name: string };
type Line = { key: number; item_id: string; description: string; qty: number; unit: string; price: number; discount_pct: number; tax_rate: number };

export type DocDefaults = {
  contact_id?: string;
  reference?: string;
  notes?: string;
  source_id?: string;
  discount?: number;
  lines?: Omit<Line, "key">[];
};

let seq = 1;
const blank = (): Line => ({ key: seq++, item_id: "", description: "", qty: 1, unit: "pcs", price: 0, discount_pct: 0, tax_rate: 11 });

export default function DocumentForm({
  side,
  kind,
  kindLabel,
  contacts,
  items,
  today,
  dueDefault,
  defaults,
  cancelHref,
  newContactHref,
}: {
  side: "sales" | "purchase";
  kind: string;
  kindLabel: string;
  contacts: Contact[];
  items: Item[];
  today: string;
  dueDefault: string;
  defaults?: DocDefaults;
  cancelHref: string;
  newContactHref: string;
}) {
  const [contactId, setContactId] = useState(defaults?.contact_id ?? "");
  const [date, setDate] = useState(today);
  const [due, setDue] = useState(dueDefault);
  const [reference, setReference] = useState(defaults?.reference ?? "");
  const [notes, setNotes] = useState(defaults?.notes ?? "");
  const [discount, setDiscount] = useState(defaults?.discount ?? 0);
  const [lines, setLines] = useState<Line[]>(() => (defaults?.lines?.length ? defaults.lines.map((l) => ({ ...l, key: seq++ })) : [blank()]));
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const totals = useMemo(() => {
    let sub = 0, tax = 0;
    for (const l of lines) {
      const amt = Math.round(l.qty * l.price * (1 - l.discount_pct / 100) * 100) / 100;
      sub += amt;
      tax += Math.round(amt * l.tax_rate) / 100;
    }
    return { sub, tax, total: sub - discount + tax };
  }, [lines, discount]);

  const update = (key: number, patch: Partial<Line>) => setLines((ls) => ls.map((l) => (l.key === key ? { ...l, ...patch } : l)));
  const pickItem = (key: number, id: string) => {
    const it = items.find((i) => i.id === id);
    update(key, it ? { item_id: id, description: it.name, unit: it.unit, price: Number(side === "sales" ? it.sell_price : it.buy_price) } : { item_id: "" });
  };

  function submit(draft: boolean) {
    setError(null);
    const valid = lines.filter((l) => (l.item_id || l.description.trim()) && l.qty > 0);
    if (!valid.length) return setError("Tambahkan minimal satu produk atau deskripsi.");
    if (kind !== "quote" && !contactId) return setError(`Pilih ${side === "sales" ? "pelanggan" : "vendor"}.`);
    const payload = {
      kind,
      contact_id: contactId,
      date,
      due_date: due,
      reference,
      notes,
      discount,
      source_id: defaults?.source_id ?? "",
      status: draft ? "draft" : "open",
      lines: valid.map(({ key: _k, ...l }) => l),
    };
    start(async () => {
      const r = side === "sales" ? await saveSalesDocument(payload) : await savePurchaseDocument(payload);
      if (r?.error) setError(r.error);
    });
  }

  return (
    <div className="space-y-4">
      <div className="card grid gap-4 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-4">
        <div className="sm:col-span-2">
          <label className="label" htmlFor="contact">{side === "sales" ? "Pelanggan" : "Vendor"}</label>
          <div className="flex gap-2">
            <select id="contact" value={contactId} onChange={(e) => setContactId(e.target.value)} className="field">
              <option value="">Pilih {side === "sales" ? "pelanggan" : "vendor"}</option>
              {contacts.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <Link href={newContactHref} className="btn-soft shrink-0 px-3" title="Kontak baru" aria-label="Tambah kontak baru"><Icon name="plus" size={16} /></Link>
          </div>
        </div>
        <div>
          <label className="label" htmlFor="date">Tanggal</label>
          <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="field" />
        </div>
        <div>
          <label className="label" htmlFor="due">{kind === "quote" ? "Berlaku sampai" : "Jatuh tempo"}</label>
          <input id="due" type="date" value={due} onChange={(e) => setDue(e.target.value)} className="field" />
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="ref">Referensi</label>
          <input id="ref" value={reference} onChange={(e) => setReference(e.target.value)} placeholder="Nomor PO pelanggan, dll." className="field" />
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-app min-w-[860px]">
            <thead>
              <tr>
                <th className="w-[30%]">Produk</th>
                <th>Deskripsi</th>
                <th className="w-24">Qty</th>
                <th className="w-36">Harga</th>
                <th className="w-20">Disk %</th>
                <th className="w-24">Pajak</th>
                <th className="w-36 text-right">Jumlah</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {lines.map((l) => {
                const it = items.find((i) => i.id === l.item_id);
                const amt = l.qty * l.price * (1 - l.discount_pct / 100);
                const short = side === "sales" && it?.track_stock && l.qty > Number(it.stock_qty) && (kind === "invoice");
                return (
                  <tr key={l.key}>
                    <td>
                      <select value={l.item_id} onChange={(e) => pickItem(l.key, e.target.value)} className="field" aria-label="Produk">
                        <option value="">Tanpa produk</option>
                        {items.map((i) => <option key={i.id} value={i.id}>{i.sku ? `${i.sku} · ` : ""}{i.name}</option>)}
                      </select>
                      {short && <p className="mt-1 text-[11px] text-amber-600">Stok tersedia {Number(it!.stock_qty)} {it!.unit}</p>}
                    </td>
                    <td><input value={l.description} onChange={(e) => update(l.key, { description: e.target.value })} className="field" aria-label="Deskripsi" /></td>
                    <td>
                      <div className="flex items-center gap-1">
                        <input type="number" min={0} step="any" value={l.qty} onChange={(e) => update(l.key, { qty: Number(e.target.value) })} className="field px-2 text-right" aria-label="Kuantitas" />
                      </div>
                      <p className="mt-0.5 text-[11px] text-muted">{l.unit}</p>
                    </td>
                    <td><input type="number" min={0} step="any" value={l.price} onChange={(e) => update(l.key, { price: Number(e.target.value) })} className="field text-right" aria-label="Harga" /></td>
                    <td><input type="number" min={0} max={100} step="any" value={l.discount_pct} onChange={(e) => update(l.key, { discount_pct: Number(e.target.value) })} className="field px-2 text-right" aria-label="Diskon persen" /></td>
                    <td>
                      <select value={l.tax_rate} onChange={(e) => update(l.key, { tax_rate: Number(e.target.value) })} className="field px-2" aria-label="Pajak">
                        <option value={0}>Tanpa</option>
                        <option value={11}>PPN 11%</option>
                      </select>
                    </td>
                    <td className="text-right font-medium tabular-nums">{idr(amt)}</td>
                    <td>
                      <button type="button" onClick={() => setLines((ls) => (ls.length > 1 ? ls.filter((x) => x.key !== l.key) : ls))} className="grid h-9 w-9 place-items-center rounded-lg text-muted hover:bg-rose-500/10 hover:text-rose-500" aria-label="Hapus baris">
                        <Icon name="trash" size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="border-t border-line p-3">
          <button type="button" onClick={() => setLines((ls) => [...ls, blank()])} className="btn-soft h-9 text-accent">
            <Icon name="plus" size={16} /> Tambah baris
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
        <div className="card p-4 sm:p-5">
          <label className="label" htmlFor="notes">Catatan</label>
          <textarea id="notes" rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={side === "sales" ? "Contoh: Pembayaran ke BCA 123456 a.n. PT ..." : "Catatan internal"} className="field" />
        </div>
        <div className="card space-y-3 p-4 text-sm sm:p-5">
          <div className="flex justify-between"><span className="text-muted">Subtotal</span><span className="tabular-nums">{idr(totals.sub)}</span></div>
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="disc" className="text-muted">Diskon tambahan</label>
            <input id="disc" type="number" min={0} value={discount} onChange={(e) => setDiscount(Number(e.target.value))} className="field h-9 w-36 text-right" />
          </div>
          <div className="flex justify-between"><span className="text-muted">PPN</span><span className="tabular-nums">{idr(totals.tax)}</span></div>
          <div className="flex justify-between border-t border-line pt-3 text-base font-semibold"><span>Total</span><span className="tabular-nums">{idr(totals.total)}</span></div>
          {error && <p role="alert" className="rounded-xl bg-rose-500/10 px-3 py-2 text-rose-600 dark:text-rose-300">{error}</p>}
          <div className="flex flex-wrap gap-2 pt-1">
            <Link href={cancelHref} className="btn-soft">Batal</Link>
            <button type="button" disabled={pending} onClick={() => submit(false)} className="btn-primary flex-1">
              {pending ? "Menyimpan..." : `Simpan ${kindLabel.toLowerCase()}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
