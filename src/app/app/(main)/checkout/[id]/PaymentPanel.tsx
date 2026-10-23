"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "@/components/app/Icon";
import { idr } from "@/lib/app/format";
import { PAYMENT_METHODS } from "@/lib/app/payments";

function Countdown({ to }: { to: string }) {
  const [left, setLeft] = useState(0);
  useEffect(() => {
    const tick = () => setLeft(Math.max(0, new Date(to).getTime() - Date.now()));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [to]);
  const h = Math.floor(left / 3600000), m = Math.floor((left % 3600000) / 60000), s = Math.floor((left % 60000) / 1000);
  return (
    <span className="mono inline-flex gap-1 text-lg font-semibold tabular-nums">
      {[h, m, s].map((v, i) => (
        <span key={i} className="flex items-center gap-1">
          <span className="rounded-lg bg-fg/[0.06] px-2 py-1">{String(v).padStart(2, "0")}</span>
          {i < 2 && ":"}
        </span>
      ))}
    </span>
  );
}

/** Pola QR contoh (bukan QR sungguhan) sampai payment gateway tersambung */
function PlaceholderQr({ seed }: { seed: string }) {
  const cells = useMemo(() => {
    let h = 0;
    for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    return Array.from({ length: 25 * 25 }, (_, i) => {
      h = (h * 1103515245 + 12345) >>> 0;
      const x = i % 25, y = Math.floor(i / 25);
      const finder = (x < 7 && y < 7) || (x > 17 && y < 7) || (x < 7 && y > 17);
      if (finder) {
        const fx = x > 17 ? x - 18 : x, fy = y > 17 ? y - 18 : y;
        return fx === 0 || fx === 6 || fy === 0 || fy === 6 || (fx >= 2 && fx <= 4 && fy >= 2 && fy <= 4);
      }
      return (h >> 16) % 2 === 0;
    });
  }, [seed]);
  return (
    <svg viewBox="0 0 25 25" className="h-52 w-52 rounded-xl bg-white p-2" shapeRendering="crispEdges" aria-label="Contoh kode QR">
      {cells.map((on, i) => (on ? <rect key={i} x={i % 25} y={Math.floor(i / 25)} width={1} height={1} fill="#0B1220" /> : null))}
    </svg>
  );
}

export default function PaymentPanel({ method, channel, total, expiresAt, number, paymentUrl }: { method: string; channel: string | null; total: number; expiresAt: string; number: string; paymentUrl: string | null }) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const m = PAYMENT_METHODS.find((x) => x.id === method);
  const c = m?.channels.find((x) => x.id === channel) ?? m?.channels[0];
  const vaNumber = `8808${number.replace(/\D/g, "").slice(-8).padStart(8, "0")}`;
  const copy = (t: string) => navigator.clipboard?.writeText(t).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted">Selesaikan pembayaran dalam</p>
          <Countdown to={expiresAt} />
        </div>
        <div className="text-right">
          <p className="text-sm text-muted">Total tagihan</p>
          <p className="text-2xl font-semibold tabular-nums">{idr(total)}</p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-dashed border-amber-400/50 bg-amber-400/10 p-3 text-xs leading-5 text-amber-800 dark:text-amber-200">
        Payment gateway belum disambungkan. Kode QR dan nomor virtual account di bawah hanya contoh tampilan dan belum bisa dipakai untuk membayar.
      </div>

      <div className="mt-6 flex flex-col items-center text-center">
        {method === "qris" && (
          <>
            <PlaceholderQr seed={number} />
            <p className="mt-4 font-semibold">Scan QRIS dari aplikasi bank atau e-wallet</p>
            <p className="text-sm text-muted">BCA mobile, Livin, BRImo, GoPay, OVO, DANA, ShopeePay, dan lainnya</p>
          </>
        )}
        {method === "va" && (
          <>
            <span className="grid h-12 w-20 place-items-center rounded-xl text-sm font-bold text-white" style={{ background: c?.color }}>{c?.label}</span>
            <p className="mt-4 text-sm text-muted">Nomor Virtual Account {c?.label}</p>
            <button type="button" onClick={() => copy(vaNumber)} className="mono mt-1 inline-flex items-center gap-2 text-2xl font-semibold tracking-wider">
              {vaNumber.replace(/(\d{4})/g, "$1 ").trim()} <Icon name="copy" size={18} className="text-accent" />
            </button>
            {copied && <p className="text-xs text-emerald-600">Tersalin</p>}
            <ol className="mt-5 max-w-sm space-y-1.5 text-left text-sm text-muted">
              <li>1. Buka m-banking {c?.label}, pilih Transfer lalu Virtual Account.</li>
              <li>2. Masukkan nomor di atas dan pastikan nama tujuan TapHub.</li>
              <li>3. Bayar sesuai total. Status berubah otomatis.</li>
            </ol>
          </>
        )}
        {method === "ewallet" && (
          <>
            <span className="grid h-12 w-24 place-items-center rounded-xl text-sm font-bold text-white" style={{ background: c?.color }}>{c?.label}</span>
            <p className="mt-4 font-semibold">Bayar dengan {c?.label}</p>
            <p className="text-sm text-muted">Kamu akan diarahkan ke aplikasi {c?.label} untuk menyetujui pembayaran.</p>
            <a href={paymentUrl ?? "#"} aria-disabled={!paymentUrl} className={`btn-primary mt-4 ${paymentUrl ? "" : "pointer-events-none opacity-50"}`}>Buka {c?.label}</a>
          </>
        )}
        {method === "card" && (
          <>
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-fg/[0.06]"><Icon name="card" size={26} /></span>
            <p className="mt-4 font-semibold">Bayar dengan kartu</p>
            <p className="text-sm text-muted">Form kartu yang aman akan tampil di sini setelah gateway tersambung.</p>
          </>
        )}
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-2">
        <button type="button" onClick={() => router.refresh()} className="btn-soft"><Icon name="refresh" size={16} /> Cek status pembayaran</button>
      </div>
    </div>
  );
}
