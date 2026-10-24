"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import Icon, { TileIcon } from "@/components/app/Icon";
import { setTheme, useIsDark } from "@/components/app/ThemeToggle";
import { AnimatedNumber, Columns, ComboChart, Donut, Gauge, HBars, MultiLine, PairBars, Sparkline, palette } from "@/components/app/charts";
import { compact, idr, idrShort, pctChange, tglShort } from "@/lib/app/format";

export type Summary = {
  range: { from: string; to: string; days: number };
  sales_total: number;
  sales_prev: number;
  invoice_count: number;
  invoice_prev: number;
  received: number;
  spent: number;
  receivable_open: number;
  receivable_overdue: number;
  payable_open: number;
  billed_period: number;
  collected_period: number;
  low_stock: number;
  daily: { date: string; sales: number; invoices: number; cash_in: number; cash_out: number }[];
  monthly: { month: string; revenue: number; expense: number; customers: number }[];
  top_customers: { name: string; total: number; count: number }[];
  top_items: { name: string; total: number; qty: number }[];
  sales_by_category: { name: string; total: number }[];
  expense_by_account: { name: string; total: number }[];
  cash_accounts: { id: string; name: string; code: string; balance: number }[];
  feed: { type: string; kind: string; id: string; number: string; contact: string | null; amount: number; status: string; at: string }[];
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

function Card({ title, sub, right, children, className = "", delay = 0 }: { title: string; sub?: string; right?: React.ReactNode; children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <section className={`card anim-feed flex min-w-0 flex-col p-4 sm:p-5 ${className}`} style={{ animationDelay: `${delay}ms` }}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold">{title}</h2>
          {sub && <p className="mono mt-0.5 truncate text-[11px] text-muted">{sub}</p>}
        </div>
        {right}
      </div>
      {children}
    </section>
  );
}

function Delta({ value, suffix = "vs periode lalu" }: { value: number; suffix?: string }) {
  const up = value >= 0;
  return (
    <span className="inline-flex items-center gap-1 text-xs">
      <span className={`inline-flex items-center gap-0.5 font-semibold ${up ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
        <Icon name={up ? "arrow-up" : "arrow-down"} size={12} strokeWidth={2.4} />
        {Math.abs(value).toFixed(1)}%
      </span>
      <span className="text-muted">{suffix}</span>
    </span>
  );
}

export default function Dashboard({ summary: s, days, base, orgName, userName }: { summary: Summary; days: number; base: string; orgName: string; userName: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [paused, setPaused] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [visibleFeed, setVisibleFeed] = useState(0);
  const dark = useIsDark();
  const link = (p: string) => (p === "/" ? base || "/" : `${base}${p}`);

  useEffect(() => setLastSync(new Date()), [s]);

  // Data disegarkan otomatis tiap 60 detik (seperti dashboard live)
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => startTransition(() => router.refresh()), 60000);
    return () => clearInterval(t);
  }, [paused, router]);

  // Feed muncul satu per satu
  useEffect(() => {
    setVisibleFeed(0);
    const t = setInterval(() => setVisibleFeed((v) => (v >= s.feed.length ? v : v + 1)), 380);
    return () => clearInterval(t);
  }, [s.feed]);


  const dailyCombo = useMemo(
    () =>
      s.daily.map((d, i) => {
        const win = s.daily.slice(Math.max(0, i - 6), i + 1);
        return { label: tglShort(d.date), value: Number(d.sales), line: win.reduce((a, x) => a + Number(x.sales), 0) / win.length };
      }),
    [s.daily],
  );

  const salesDelta = pctChange(Number(s.sales_total), Number(s.sales_prev));
  const avg = s.invoice_count ? Number(s.sales_total) / s.invoice_count : 0;
  const collect = s.billed_period ? (Number(s.collected_period) / Number(s.billed_period)) * 100 : 0;
  const cashTotal = s.cash_accounts.reduce((a, c) => a + Number(c.balance), 0);
  const recent = s.daily.slice(-Math.min(14, s.daily.length));
  const profitMonthly = s.monthly.map((m, i) => {
    const profit = Number(m.revenue) - Number(m.expense);
    const prev = i > 0 ? Number(s.monthly[i - 1].revenue) - Number(s.monthly[i - 1].expense) : null;
    const ch = prev !== null && prev !== 0 ? ((profit - prev) / Math.abs(prev)) * 100 : null;
    return { label: MONTHS[Number(m.month.slice(5)) - 1], value: profit, sub: ch === null ? undefined : `${ch >= 0 ? "+" : ""}${ch.toFixed(0)}%` };
  });
  const profitGrowth = (() => {
    const first = profitMonthly.find((m) => m.value !== 0)?.value ?? 0;
    const last = profitMonthly[profitMonthly.length - 1]?.value ?? 0;
    return first ? ((last - first) / Math.abs(first)) * 100 : 0;
  })();
  let runIn = 0, runOut = 0;
  const cumulative = s.daily.map((d) => {
    runIn += Number(d.cash_in);
    runOut += Number(d.cash_out);
    return { label: tglShort(d.date), in: runIn, out: runOut, net: runIn - runOut };
  });

  function exportCsv() {
    const rows = [["Tanggal", "Penjualan", "Jumlah tagihan", "Kas masuk", "Kas keluar"], ...s.daily.map((d) => [d.date, d.sales, d.invoices, d.cash_in, d.cash_out])];
    const blob = new Blob([rows.map((r) => r.join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `taphub-dashboard-${s.range.to}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  const syncText = lastSync
    ? new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZone: "Asia/Jakarta" }).format(lastSync)
    : "";

  return (
    <div className="mx-auto max-w-[1480px]">
      {/* Kepala dashboard */}
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-semibold tracking-[-0.01em] sm:text-2xl">Beranda</h1>
            <span className="mono rounded-md border border-line px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted">{orgName}</span>
          </div>
          <p className="mt-1 text-sm text-muted">Halo {userName.split(" ")[0] || "kamu"}, ini ringkasan usahamu {days} hari terakhir.</p>
        </div>
        <div className="no-print flex flex-wrap items-center gap-2">
          <div className="flex rounded-xl border border-line bg-raised p-1 text-xs font-semibold">
            <span className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-emerald-600 dark:text-emerald-400">
              <span className={`h-1.5 w-1.5 rounded-full bg-emerald-500 ${paused ? "" : "live-dot"}`} />
              Live
            </span>
            {[7, 30, 90].map((r) => (
              <Link key={r} href={`${link("/")}?r=${r}`} scroll={false} className={`rounded-lg px-2.5 py-1.5 transition ${r === days ? "bg-tide-2 text-white" : "text-muted hover:text-fg"}`}>
                {r}H
              </Link>
            ))}
          </div>
          <span className="mono inline-flex items-center gap-2 rounded-xl border border-line bg-raised px-3 py-2 text-xs text-muted">
            <span className={`h-1.5 w-1.5 rounded-full ${pending ? "bg-amber-500" : "bg-emerald-500"}`} />
            {pending ? "Menyegarkan..." : `Sinkron ${syncText}`}
          </span>
          <button type="button" onClick={() => setPaused((p) => !p)} className="btn-soft h-9 text-xs">
            <Icon name={paused ? "play" : "pause"} size={14} /> {paused ? "Lanjut" : "Jeda"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12">
        {/* Penjualan */}
        <Card
          className="md:col-span-2 xl:col-span-6"
          title="Penjualan"
          sub={`${days} hari terakhir · per hari`}
          right={
            <div className="flex items-center gap-3 text-[11px] text-muted">
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-[#22D3EE]" />Penjualan</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-0.5 w-3 bg-[#EC4899]" />Rata-rata 7 hari</span>
            </div>
          }
        >
          <div className="mb-2 flex flex-wrap items-end gap-x-3 gap-y-1">
            <p className="text-3xl font-semibold tracking-[-0.02em] sm:text-4xl"><AnimatedNumber key={days} value={Number(s.sales_total)} format={(n) => idr(n)} /></p>
            <Delta value={salesDelta} suffix={`vs ${days} hari sebelumnya`} />
          </div>
          <ComboChart key={`c${days}`} data={dailyCombo} format={compact} height={210} />
        </Card>

        {/* Kategori */}
        <Card className="xl:col-span-3" title="Penjualan per kategori" sub="Porsi dari total penjualan" delay={80}>
          {s.sales_by_category.length ? (
            <Donut key={`d${days}`} segments={s.sales_by_category.map((c) => ({ name: c.name, value: Number(c.total) }))} center={idrShort(s.sales_by_category.reduce((a, c) => a + Number(c.total), 0)).replace("Rp ", "")} sub="penjualan" format={idrShort} size={140} />
          ) : (
            <p className="py-10 text-center text-sm text-muted">Belum ada penjualan.</p>
          )}
        </Card>

        {/* Kas */}
        <Card className="xl:col-span-3" title="Saldo kas & bank" sub="Posisi saat ini" delay={140}>
          <Donut
            key={`k${days}`}
            segments={s.cash_accounts.filter((c) => Number(c.balance) > 0).map((c, i) => ({ name: c.name, value: Number(c.balance), color: palette[(i + 2) % palette.length] }))}
            center={idrShort(cashTotal).replace("Rp ", "")}
            sub="total saldo"
            format={idrShort}
            size={140}
          />
        </Card>

        {/* Produk terlaris */}
        <Card className="xl:col-span-4" title="Produk terlaris" sub="Nilai penjualan per produk" delay={200} right={<Link href={link("/laporan/penjualan-produk")} className="mono text-[11px] text-accent hover:underline">Detail</Link>}>
          {s.top_items.length ? (
            <HBars items={s.top_items.map((t) => ({ name: t.name, value: Number(t.total) }))} format={compact} target={avg * 3} />
          ) : (
            <p className="py-8 text-center text-sm text-muted">Belum ada data.</p>
          )}
        </Card>

        {/* Metrik utama */}
        <Card className="xl:col-span-4" title="Metrik utama" sub={`${days} hari · tren harian`} delay={260}>
          <div className="flex flex-1 flex-col gap-2.5">
            {[
              { l: "Jumlah tagihan", v: s.invoice_count, f: (n: number) => Math.round(n).toLocaleString("id-ID"), d: pctChange(s.invoice_count, s.invoice_prev), vals: s.daily.map((d) => Number(d.invoices)), c: "#22D3EE" },
              { l: "Rata-rata nilai tagihan", v: avg, f: (n: number) => idrShort(n), d: pctChange(avg, s.invoice_prev ? Number(s.sales_prev) / s.invoice_prev : 0), vals: s.daily.map((d) => (d.invoices ? Number(d.sales) / d.invoices : 0)), c: "#EC4899" },
              { l: "Kas diterima", v: Number(s.received), f: (n: number) => idrShort(n), d: null, vals: s.daily.map((d) => Number(d.cash_in)), c: "#8B5CF6" },
            ].map((m) => (
              <div key={m.l} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] items-center gap-3 rounded-xl border border-line bg-panel/60 px-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-medium text-muted">{m.l}</p>
                  <p className="truncate text-lg font-semibold leading-tight"><AnimatedNumber key={`${m.l}${days}`} value={m.v} format={m.f} /></p>
                  {m.d !== null ? <Delta value={m.d} suffix="" /> : <span className="text-[11px] text-muted">dari pelanggan</span>}
                </div>
                <Sparkline key={`${m.l}${days}`} values={m.vals} color={m.c} height={46} />
              </div>
            ))}
          </div>
        </Card>

        {/* Penagihan */}
        <Card className="md:col-span-2 xl:col-span-4" title="Kesehatan penagihan" sub="Tagihan periode ini yang sudah dibayar" delay={320} right={<span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${collect >= 70 ? "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400" : "bg-amber-500/12 text-amber-600"}`}>{collect >= 70 ? "Sehat" : "Perlu perhatian"}</span>}>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:flex-nowrap sm:justify-between">
            <Gauge key={`g${days}`} value={collect} label="terbayar" size={170} />
            <dl className="w-full space-y-3 text-sm sm:w-auto sm:min-w-[150px]">
              <div><dt className="mono text-[10px] uppercase tracking-wider text-muted">Piutang terbuka</dt><dd className="font-semibold tabular-nums">{idrShort(s.receivable_open)}</dd></div>
              <div><dt className="mono text-[10px] uppercase tracking-wider text-muted">Jatuh tempo</dt><dd className="font-semibold tabular-nums text-rose-600 dark:text-rose-400">{idrShort(s.receivable_overdue)}</dd></div>
              <div><dt className="mono text-[10px] uppercase tracking-wider text-muted">Hutang terbuka</dt><dd className="font-semibold tabular-nums">{idrShort(s.payable_open)}</dd></div>
            </dl>
          </div>
        </Card>

        {/* Laba bersih */}
        <Card className="xl:col-span-4" title="Laba bersih" sub="6 bulan terakhir · pendapatan dikurangi beban" delay={380} right={<span className={`mono whitespace-nowrap rounded-md px-2 py-0.5 text-[11px] font-semibold ${profitGrowth >= 0 ? "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400" : "bg-rose-500/10 text-rose-600"}`}>{profitGrowth >= 0 ? "+" : ""}{profitGrowth.toFixed(0)}% · 6 bln</span>}>
          <Columns data={profitMonthly} format={idrShort} trend height={170} />
        </Card>

        {/* Kas masuk vs keluar */}
        <Card className="xl:col-span-4" title="Kas masuk & keluar" sub={`${recent.length} hari terakhir`} delay={440} right={<div className="flex items-center gap-3 text-[11px] text-muted"><span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-[#22D3EE]" />Masuk</span><span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-[#EC4899]" />Keluar</span></div>}>
          <div className="mb-1 flex items-end gap-2">
            <p className="text-2xl font-semibold"><AnimatedNumber key={`n${days}`} value={(Number(s.received) - Number(s.spent))} format={(n) => idrShort(n)} /></p>
            <span className="mb-1 text-xs text-muted">arus kas bersih</span>
          </div>
          <PairBars key={`p${days}`} data={recent.map((d) => ({ label: tglShort(d.date), a: Number(d.cash_in), b: Number(d.cash_out) }))} format={compact} height={150} />
        </Card>

        {/* Pelanggan aktif */}
        <Card className="xl:col-span-4" title="Pelanggan aktif" sub="Pelanggan yang bertransaksi per bulan" delay={500}>
          <Columns
            data={s.monthly.map((m, i) => {
              const prev = i > 0 ? Number(s.monthly[i - 1].customers) : 0;
              const ch = prev ? ((Number(m.customers) - prev) / prev) * 100 : null;
              return { label: MONTHS[Number(m.month.slice(5)) - 1], value: Number(m.customers), sub: ch === null ? undefined : `${ch >= 0 ? "+" : ""}${ch.toFixed(0)}%` };
            })}
            format={(n) => `${Math.round(n)} pelanggan`}
            color={dark ? "#64748B" : "#94A3B8"}
            highlight="#F97316"
            height={170}
          />
        </Card>

        {/* Arus kas kumulatif */}
        <Card className="md:col-span-2 xl:col-span-7" title="Arus kas kumulatif" sub={`${days} hari · masuk, keluar, dan bersih`} delay={560} right={<div className="flex flex-wrap items-center gap-3 text-[11px] text-muted">{[["Masuk", "#22D3EE"], ["Keluar", "#EC4899"], ["Bersih", "#A3E635"]].map(([n, c]) => <span key={n} className="inline-flex items-center gap-1.5"><span className="h-0.5 w-3" style={{ background: c }} />{n}</span>)}</div>}>
          <MultiLine
            key={`m${days}`}
            labels={cumulative.map((c) => c.label)}
            series={[
              { name: "Masuk", color: "#22D3EE", values: cumulative.map((c) => c.in) },
              { name: "Keluar", color: "#EC4899", values: cumulative.map((c) => c.out) },
              { name: "Bersih", color: "#A3E635", values: cumulative.map((c) => c.net) },
            ]}
            format={compact}
            height={300}
          />
        </Card>

        {/* Feed */}
        <Card
          className="md:col-span-2 xl:col-span-5"
          title="Aktivitas terbaru"
          sub={paused ? "Dijeda" : "Streaming · disegarkan tiap 60 detik"}
          delay={620}
          right={<span className={`mt-1 h-2 w-2 rounded-full ${paused ? "bg-amber-500" : "live-dot bg-emerald-500"}`} />}
        >
          <ul className="min-h-[150px] flex-1 space-y-1.5">
            {s.feed.slice(0, Math.min(visibleFeed, 6)).map((f) => {
              const isPay = f.type === "payment";
              const href = f.type === "sales" ? `/penjualan/dokumen/${f.id}` : f.type === "expense" ? `/biaya/${f.id}` : f.number === "sales" ? `/penjualan/dokumen/${f.id}` : f.number === "purchase" ? `/pembelian/dokumen/${f.id}` : `/biaya/${f.id}`;
              const title = isPay ? (f.kind === "in" ? "Pembayaran diterima" : "Pembayaran keluar") : f.type === "expense" ? `Biaya ${f.number}` : `${f.kind === "invoice" ? "Tagihan" : f.kind === "order" ? "Pemesanan" : "Penawaran"} ${f.number}`;
              return (
                <li key={`${f.type}${f.id}${f.at}`} className="anim-feed">
                  <Link href={link(href)} className="flex items-center gap-3 rounded-xl border border-transparent px-2 py-2 transition hover:border-line hover:bg-fg/[0.03]">
                    <TileIcon name={isPay ? "wallet" : f.type === "expense" ? "expense" : "sales"} tone={isPay ? (f.kind === "in" ? "green" : "pink") : f.type === "expense" ? "pink" : "blue"} size={30} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{title}</span>
                      <span className="mono block truncate text-[11px] text-muted">{f.contact ?? "Tanpa kontak"} · {new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta" }).format(new Date(f.at))}</span>
                    </span>
                    <span className={`mono text-sm font-semibold tabular-nums ${isPay && f.kind === "in" ? "text-emerald-600 dark:text-emerald-400" : ""}`}>{isPay && f.kind === "in" ? "+" : ""}{idrShort(f.amount)}</span>
                  </Link>
                </li>
              );
            })}
            {s.feed.length === 0 && <li className="py-8 text-center text-sm text-muted">Belum ada aktivitas.</li>}
          </ul>
          <div className="no-print mt-3 grid grid-cols-5 gap-1 border-t border-line pt-3 text-[10px] text-muted">
            {[
              { i: paused ? "play" : "pause", l: paused ? "Lanjut" : "Jeda", f: () => setPaused((p) => !p) },
              { i: "refresh", l: "Segarkan", f: () => startTransition(() => router.refresh()) },
              { i: dark ? "sun" : "moon", l: dark ? "Terang" : "Gelap", f: () => setTheme(!dark) },
              { i: "fullscreen", l: "Layar penuh", f: () => (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.()) },
              { i: "download", l: "Ekspor", f: exportCsv },
            ].map((b) => (
              <button key={b.l} type="button" onClick={b.f} className="flex flex-col items-center gap-1 rounded-xl py-1.5 transition hover:bg-fg/[0.04] hover:text-fg">
                <span className="grid h-8 w-8 place-items-center rounded-full border border-line"><Icon name={b.i} size={14} /></span>
                {b.l}
              </button>
            ))}
          </div>
        </Card>
      </div>

      {s.low_stock > 0 && (
        <Link href={link("/inventori?filter=menipis")} className="card anim-feed mt-4 flex items-center gap-3 p-4 text-sm transition hover:border-amber-400/50">
          <TileIcon name="inventory" tone="amber" size={32} />
          <span className="flex-1"><b>{s.low_stock} produk</b> stoknya di bawah batas minimum.</span>
          <Icon name="chevron-right" size={18} className="text-muted" />
        </Link>
      )}
    </div>
  );
}
