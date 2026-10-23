"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import Icon from "@/components/app/Icon";
import SubmitButton from "@/components/app/SubmitButton";
import { idr } from "@/lib/app/format";
import { PAYMENT_METHODS } from "@/lib/app/payments";
import { createCheckout } from "../../actions";

type Plan = { code: string; name: string; product: string; description: string; monthly: number; yearly: number; features: string[] };

export default function CheckoutForm({ plan, initialCycle, orgName }: { plan: Plan; initialCycle: "monthly" | "yearly"; orgName: string }) {
  const [cycle, setCycle] = useState(initialCycle);
  const [method, setMethod] = useState("qris:qris");
  const [state, action] = useFormState(createCheckout, undefined);
  const sub = cycle === "yearly" ? plan.yearly : plan.monthly;
  const tax = Math.round(sub * 0.11);
  const saving = plan.monthly * 12 - plan.yearly;

  return (
    <form action={action} className="grid gap-4 lg:grid-cols-[1fr_380px]">
      <input type="hidden" name="plan" value={plan.code} />
      <input type="hidden" name="cycle" value={cycle} />
      <input type="hidden" name="method" value={method} />
      <div className="space-y-4">
        <section className="card p-5">
          <h2 className="font-semibold">1. Periode langganan</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {(["monthly", "yearly"] as const).map((c) => (
              <button key={c} type="button" onClick={() => setCycle(c)} className={`rounded-2xl border p-4 text-left transition ${cycle === c ? "border-tide-2/60 bg-tide-2/[0.07] ring-2 ring-tide-2/15" : "border-line hover:border-tide-2/30"}`}>
                <span className="flex items-center justify-between">
                  <span className="font-semibold">{c === "monthly" ? "Bulanan" : "Tahunan"}</span>
                  <span className={`grid h-5 w-5 place-items-center rounded-full border-2 ${cycle === c ? "border-tide-2 bg-tide-2 text-white" : "border-line"}`}>{cycle === c && <Icon name="check" size={12} strokeWidth={3} />}</span>
                </span>
                <span className="mt-2 block text-lg font-semibold">{idr(c === "monthly" ? plan.monthly : plan.yearly)}</span>
                <span className="text-xs text-muted">{c === "monthly" ? "Ditagih setiap bulan" : `Hemat ${idr(saving)} per tahun`}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="card p-5">
          <h2 className="font-semibold">2. Metode pembayaran</h2>
          <div className="mt-4 space-y-3">
            {PAYMENT_METHODS.map((m) => {
              const active = method.startsWith(`${m.id}:`);
              return (
                <div key={m.id} className={`rounded-2xl border transition ${active ? "border-tide-2/60 bg-tide-2/[0.05]" : "border-line"}`}>
                  <button type="button" onClick={() => setMethod(`${m.id}:${m.channels[0].id}`)} className="flex w-full items-center gap-3 p-4 text-left">
                    <span className={`grid h-10 w-10 place-items-center rounded-xl ${active ? "bg-tide-2 text-white" : "bg-fg/[0.05] text-fg/80"}`}><Icon name={m.icon} size={20} /></span>
                    <span className="flex-1"><span className="block font-semibold">{m.label}</span><span className="text-xs text-muted">{m.desc}</span></span>
                    <span className={`grid h-5 w-5 place-items-center rounded-full border-2 ${active ? "border-tide-2 bg-tide-2 text-white" : "border-line"}`}>{active && <Icon name="check" size={12} strokeWidth={3} />}</span>
                  </button>
                  {active && m.channels.length > 1 && (
                    <div className="anim-feed flex flex-wrap gap-2 px-4 pb-4">
                      {m.channels.map((c) => (
                        <button key={c.id} type="button" onClick={() => setMethod(`${m.id}:${c.id}`)} className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition ${method === `${m.id}:${c.id}` ? "border-tide-2/60 bg-raised" : "border-line bg-raised/60 hover:border-tide-2/30"}`}>
                          <span className="grid h-6 w-9 place-items-center rounded-md text-[9px] font-bold text-white" style={{ background: c.color }}>{c.label.slice(0, 4).toUpperCase()}</span>
                          {c.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <aside className="card h-fit space-y-4 p-5 lg:sticky lg:top-24">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Ringkasan pesanan</p>
          <p className="mt-2 text-lg font-semibold">{plan.product} {plan.name}</p>
          <p className="text-sm text-muted">Untuk {orgName}</p>
        </div>
        <ul className="space-y-1.5 border-y border-line py-4 text-sm">
          {plan.features.slice(0, 4).map((f) => <li key={f} className="flex gap-2"><Icon name="check" size={16} className="shrink-0 text-emerald-500" strokeWidth={2.2} />{f}</li>)}
        </ul>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted">Paket ({cycle === "yearly" ? "12 bulan" : "1 bulan"})</span><span className="tabular-nums">{idr(sub)}</span></div>
          <div className="flex justify-between"><span className="text-muted">PPN 11%</span><span className="tabular-nums">{idr(tax)}</span></div>
          <div className="flex items-center gap-2 pt-1">
            <input disabled placeholder="Kode promo (segera)" className="field h-9 flex-1" />
          </div>
          <div className="flex justify-between border-t border-line pt-3 text-base font-semibold"><span>Total bayar</span><span className="tabular-nums">{idr(sub + tax)}</span></div>
        </div>
        {state?.error && <p role="alert" className="rounded-xl bg-rose-500/10 px-3 py-2 text-sm text-rose-600 dark:text-rose-300">{state.error}</p>}
        <SubmitButton className="btn-primary h-11 w-full" pendingText="Membuat tagihan...">Lanjut ke pembayaran</SubmitButton>
        <p className="flex items-start gap-2 text-xs text-muted"><Icon name="lock" size={14} className="mt-0.5 shrink-0" /> Pembayaran diproses aman oleh payment gateway berlisensi Bank Indonesia. Langganan aktif otomatis setelah pembayaran terkonfirmasi.</p>
      </aside>
    </form>
  );
}
