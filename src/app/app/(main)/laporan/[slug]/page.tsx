import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAppContext, href } from "@/lib/app/context";
import { addDays, idr, pctChange, tgl, todayJakarta } from "@/lib/app/format";
import { Money, PageHeader, Pagination, StatCard } from "@/components/app/ui";
import Icon from "@/components/app/Icon";
import PrintButton from "@/components/app/PrintButton";
import { HBars } from "@/components/app/charts";
import { ASSET_CATS, CATEGORY_LABEL, EQUITY_CATS, EXPENSE_CATS, INCOME_CATS, LIAB_CATS, balanceOf, type Balance } from "@/lib/app/accounting";
import { ALL_REPORTS } from "../reports";

type SP = Record<string, string | undefined>;

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  return { title: ALL_REPORTS.find((r) => r.slug === params.slug)?.name ?? "Laporan" };
}

// ---------------------------------------------------------------- utilitas
type Ctx = Awaited<ReturnType<typeof getAppContext>>;

async function balances(ctx: Ctx, from: string | null, to: string) {
  const { data, error } = await ctx.supabase.rpc("account_balances", { p_org: ctx.org.id, p_from: from, p_to: to });
  if (error) throw new Error(error.message);
  return (data ?? []) as Balance[];
}
const sumCats = (rows: Balance[], cats: readonly string[]) => rows.filter((r) => cats.includes(r.category)).reduce((a, r) => a + balanceOf(r), 0);

function monthStart(d: string) {
  return `${d.slice(0, 7)}-01`;
}
function monthEnd(d: string) {
  const x = new Date(`${d.slice(0, 7)}-01T00:00:00Z`);
  x.setUTCMonth(x.getUTCMonth() + 1);
  x.setUTCDate(0);
  return x.toISOString().slice(0, 10);
}

function PeriodForm({ from, to, single }: { from?: string; to: string; single?: boolean }) {
  return (
    <form className="no-print card mb-4 flex flex-wrap items-end gap-3 p-4">
      {!single && (
        <div>
          <label className="label" htmlFor="dari">Dari</label>
          <input id="dari" type="date" name="dari" defaultValue={from} className="field" />
        </div>
      )}
      <div>
        <label className="label" htmlFor="sampai">{single ? "Per tanggal" : "Sampai"}</label>
        <input id="sampai" type="date" name="sampai" defaultValue={to} className="field" />
      </div>
      <button type="submit" className="btn-soft"><Icon name="filter" size={16} /> Terapkan</button>
    </form>
  );
}

function Section({ title, rows, total, totalLabel, accountLink = true }: { title: string; rows: { id?: string; code?: string; name: string; value: number }[]; total?: number; totalLabel?: string; accountLink?: boolean }) {
  return (
    <tbody>
      <tr className="bg-panel/80 hover:bg-panel/80"><td colSpan={2} className="text-xs font-semibold uppercase tracking-wide text-muted">{title}</td></tr>
      {rows.map((r, i) => (
        <tr key={r.id ?? `${r.name}${i}`}>
          <td className="pl-8">
            {r.code && <span className="mono mr-2 text-xs text-muted">{r.code}</span>}
            {r.id && accountLink ? <Link href={href(`/akun/${r.id}`)} className="hover:text-accent">{r.name}</Link> : r.name}
          </td>
          <td className="text-right"><Money value={r.value} /></td>
        </tr>
      ))}
      {total !== undefined && (
        <tr className="font-semibold"><td>{totalLabel ?? `Total ${title.toLowerCase()}`}</td><td className="text-right"><Money value={total} /></td></tr>
      )}
    </tbody>
  );
}

const nonZero = (rows: Balance[], cats: readonly string[]) =>
  rows.filter((r) => cats.includes(r.category) && Math.abs(balanceOf(r)) > 0.004).map((r) => ({ id: r.account_id, code: r.code, name: r.name, value: balanceOf(r) }));

// ---------------------------------------------------------------- laporan
async function ProfitLoss(ctx: Ctx, sp: SP) {
  const to = sp.sampai ?? todayJakarta();
  const from = sp.dari ?? monthStart(to);
  const b = await balances(ctx, from, to);
  const income = sumCats(b, ["pendapatan"]);
  const cogs = sumCats(b, ["hpp"]);
  const opex = sumCats(b, ["beban"]);
  const otherIn = sumCats(b, ["pendapatan_lain"]);
  const otherEx = sumCats(b, ["beban_lain"]);
  const gross = income - cogs;
  const net = gross - opex + otherIn - otherEx;
  return (
    <>
      <PeriodForm from={from} to={to} />
      <div className="mb-4 grid gap-3 sm:grid-cols-4">
        <StatCard label="Pendapatan" value={idr(income)} icon="sales" />
        <StatCard label="Laba kotor" value={idr(gross)} hint={income ? `Margin ${((gross / income) * 100).toFixed(1)}%` : undefined} icon="report" tone="green" />
        <StatCard label="Beban operasional" value={idr(opex)} icon="expense" tone="pink" />
        <StatCard label="Laba bersih" value={idr(net)} hint={income ? `Margin ${((net / income) * 100).toFixed(1)}%` : undefined} icon="spark" tone={net >= 0 ? "green" : "pink"} />
      </div>
      <div className="card overflow-hidden">
        <p className="border-b border-line p-5 text-sm text-muted">{ctx.org.name} · Periode {tgl(from)} sampai {tgl(to)}</p>
        <table className="table-app">
          <Section title="Pendapatan" rows={nonZero(b, ["pendapatan"])} total={income} />
          <Section title="Harga pokok penjualan" rows={nonZero(b, ["hpp"])} total={cogs} />
          <tbody><tr className="bg-tide-2/[0.06] font-semibold"><td>Laba kotor</td><td className="text-right"><Money value={gross} /></td></tr></tbody>
          <Section title="Beban operasional" rows={nonZero(b, ["beban"])} total={opex} />
          <Section title="Pendapatan lainnya" rows={nonZero(b, ["pendapatan_lain"])} total={otherIn} />
          <Section title="Beban lainnya" rows={nonZero(b, ["beban_lain"])} total={otherEx} />
          <tbody><tr className="bg-tide-2/[0.1] text-base font-semibold"><td>Laba bersih</td><td className="text-right"><Money value={net} /></td></tr></tbody>
        </table>
      </div>
    </>
  );
}

async function BalanceSheet(ctx: Ctx, sp: SP) {
  const to = sp.sampai ?? todayJakarta();
  const b = await balances(ctx, null, to);
  const assets = sumCats(b, ASSET_CATS);
  const liab = sumCats(b, LIAB_CATS);
  const equity = sumCats(b, EQUITY_CATS);
  const earnings = sumCats(b, INCOME_CATS) - sumCats(b, EXPENSE_CATS);
  const diff = assets - (liab + equity + earnings);
  return (
    <>
      <PeriodForm to={to} single />
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <StatCard label="Total aset" value={idr(assets)} icon="asset" tone="blue" />
        <StatCard label="Total kewajiban" value={idr(liab)} icon="purchase" tone="pink" />
        <StatCard label="Total ekuitas" value={idr(equity + earnings)} icon="ledger" tone="green" />
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <div className="card overflow-hidden">
          <p className="border-b border-line p-5 font-semibold">Aset</p>
          <table className="table-app">
            {ASSET_CATS.map((c) => {
              const rows = nonZero(b, [c]);
              return rows.length ? <Section key={c} title={CATEGORY_LABEL[c]} rows={rows} /> : null;
            })}
            <tbody><tr className="bg-tide-2/[0.08] font-semibold"><td>Total aset</td><td className="text-right"><Money value={assets} /></td></tr></tbody>
          </table>
        </div>
        <div className="card overflow-hidden">
          <p className="border-b border-line p-5 font-semibold">Kewajiban dan ekuitas</p>
          <table className="table-app">
            {LIAB_CATS.map((c) => {
              const rows = nonZero(b, [c]);
              return rows.length ? <Section key={c} title={CATEGORY_LABEL[c]} rows={rows} /> : null;
            })}
            <tbody><tr className="font-semibold"><td>Total kewajiban</td><td className="text-right"><Money value={liab} /></td></tr></tbody>
            <Section title="Ekuitas" rows={[...nonZero(b, EQUITY_CATS), { name: "Laba tahun berjalan", value: earnings }]} total={equity + earnings} totalLabel="Total ekuitas" />
            <tbody><tr className="bg-tide-2/[0.08] font-semibold"><td>Total kewajiban dan ekuitas</td><td className="text-right"><Money value={liab + equity + earnings} /></td></tr></tbody>
          </table>
        </div>
      </div>
      <p className={`mt-3 flex items-center gap-2 text-sm ${Math.abs(diff) < 1 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600"}`}>
        <Icon name={Math.abs(diff) < 1 ? "check" : "close"} size={16} /> {Math.abs(diff) < 1 ? "Neraca seimbang." : `Selisih ${idr(diff)}`}
      </p>
    </>
  );
}

async function CashFlow(ctx: Ctx, sp: SP) {
  const to = sp.sampai ?? todayJakarta();
  const from = sp.dari ?? monthStart(to);
  const { data: cashAcc } = await ctx.supabase.from("accounts").select("id").eq("org_id", ctx.org.id).eq("category", "kas_bank");
  const ids = (cashAcc ?? []).map((a) => a.id);
  const [{ data: lines }, open, close] = await Promise.all([
    ids.length
      ? ctx.supabase.from("journal_lines").select("debit, credit, journal_entries!inner(date, source_type, memo)").in("account_id", ids).gte("journal_entries.date", from).lte("journal_entries.date", to)
      : Promise.resolve({ data: [] }),
    balances(ctx, null, addDays(from, -1)),
    balances(ctx, null, to),
  ]);
  type L = { debit: number; credit: number; journal_entries: { source_type: string | null; memo: string | null } };
  const ls = (lines ?? []) as unknown as L[];
  const g = (f: (l: L) => boolean, side: "in" | "out") => ls.filter(f).reduce((a, l) => a + (side === "in" ? Number(l.debit) : Number(l.credit)), 0);
  const opRows = [
    { name: "Penerimaan dari pelanggan", value: g((l) => l.journal_entries.source_type === "payment", "in") },
    { name: "Pembayaran ke vendor", value: -g((l) => l.journal_entries.source_type === "payment", "out") },
    { name: "Pembayaran biaya", value: -g((l) => l.journal_entries.source_type === "expense", "out") + g((l) => l.journal_entries.source_type === "void", "in") },
  ];
  const invRows = [{ name: "Pembelian aset tetap", value: -g((l) => l.journal_entries.source_type === "asset", "out") }];
  const finRows = [
    { name: "Penerimaan lainnya (modal, pinjaman)", value: g((l) => l.journal_entries.source_type === "bank", "in") },
    { name: "Pengeluaran lainnya (prive, cicilan)", value: -g((l) => l.journal_entries.source_type === "bank", "out") },
  ];
  const sum = (r: { value: number }[]) => r.reduce((a, x) => a + x.value, 0);
  const startCash = sumCats(open, ["kas_bank"]);
  const endCash = sumCats(close, ["kas_bank"]);
  return (
    <>
      <PeriodForm from={from} to={to} />
      <div className="card overflow-hidden">
        <p className="border-b border-line p-5 text-sm text-muted">Periode {tgl(from)} sampai {tgl(to)}. Transfer antar rekening sendiri tidak dihitung.</p>
        <table className="table-app">
          <Section title="Aktivitas operasional" rows={opRows} total={sum(opRows)} totalLabel="Kas bersih dari aktivitas operasional" accountLink={false} />
          <Section title="Aktivitas investasi" rows={invRows} total={sum(invRows)} totalLabel="Kas bersih dari aktivitas investasi" accountLink={false} />
          <Section title="Aktivitas pendanaan" rows={finRows} total={sum(finRows)} totalLabel="Kas bersih dari aktivitas pendanaan" accountLink={false} />
          <tbody>
            <tr><td>Saldo kas awal</td><td className="text-right"><Money value={startCash} /></td></tr>
            <tr className="bg-tide-2/[0.08] font-semibold"><td>Saldo kas akhir</td><td className="text-right"><Money value={endCash} /></td></tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

async function EquityChange(ctx: Ctx, sp: SP) {
  const to = sp.sampai ?? todayJakarta();
  const from = sp.dari ?? `${to.slice(0, 4)}-01-01`;
  const [before, period] = await Promise.all([balances(ctx, null, addDays(from, -1)), balances(ctx, from, to)]);
  const openEq = sumCats(before, EQUITY_CATS) + sumCats(before, INCOME_CATS) - sumCats(before, EXPENSE_CATS);
  const contrib = sumCats(period, EQUITY_CATS);
  const net = sumCats(period, INCOME_CATS) - sumCats(period, EXPENSE_CATS);
  return (
    <>
      <PeriodForm from={from} to={to} />
      <div className="card overflow-hidden">
        <table className="table-app">
          <tbody>
            <tr><td>Ekuitas awal per {tgl(from)}</td><td className="text-right"><Money value={openEq} /></td></tr>
            <tr><td className="pl-8">Setoran / penarikan modal</td><td className="text-right"><Money value={contrib} /></td></tr>
            <tr><td className="pl-8">Laba bersih periode ini</td><td className="text-right"><Money value={net} /></td></tr>
            <tr className="bg-tide-2/[0.08] font-semibold"><td>Ekuitas akhir per {tgl(to)}</td><td className="text-right"><Money value={openEq + contrib + net} /></td></tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

async function Executive(ctx: Ctx, sp: SP) {
  const to = sp.sampai ?? todayJakarta();
  const ms = monthStart(to);
  const prevEnd = addDays(ms, -1);
  const prevStart = monthStart(prevEnd);
  const [cur, prev, posNow, posPrev] = await Promise.all([balances(ctx, ms, to), balances(ctx, prevStart, prevEnd), balances(ctx, null, to), balances(ctx, null, prevEnd)]);
  const m = (b: Balance[]) => {
    const rev = sumCats(b, ["pendapatan"]);
    const cogs = sumCats(b, ["hpp"]);
    const opex = sumCats(b, ["beban"]);
    const net = rev - cogs - opex + sumCats(b, ["pendapatan_lain"]) - sumCats(b, ["beban_lain"]);
    return { rev, gross: rev - cogs, opex, net };
  };
  const a = m(cur), p = m(prev);
  const rows: [string, number, number][] = [
    ["Pendapatan", a.rev, p.rev],
    ["Laba kotor", a.gross, p.gross],
    ["Beban operasional", a.opex, p.opex],
    ["Laba bersih", a.net, p.net],
    ["Saldo kas & bank", sumCats(posNow, ["kas_bank"]), sumCats(posPrev, ["kas_bank"])],
    ["Piutang usaha", sumCats(posNow, ["piutang"]), sumCats(posPrev, ["piutang"])],
    ["Hutang usaha", sumCats(posNow, ["hutang"]), sumCats(posPrev, ["hutang"])],
    ["Persediaan", sumCats(posNow, ["persediaan"]), sumCats(posPrev, ["persediaan"])],
  ];
  return (
    <>
      <PeriodForm to={to} single />
      <div className="card overflow-hidden">
        <table className="table-app">
          <thead><tr><th>Indikator</th><th className="text-right">Bulan ini (s.d. {tgl(to)})</th><th className="text-right">Bulan lalu</th><th className="text-right">Perubahan</th></tr></thead>
          <tbody>
            {rows.map(([n, c, pv]) => {
              const ch = pctChange(c, pv);
              return (
                <tr key={n}>
                  <td className="font-medium">{n}</td>
                  <td className="text-right font-semibold"><Money value={c} /></td>
                  <td className="text-right text-muted"><Money value={pv} /></td>
                  <td className={`text-right font-semibold tabular-nums ${ch >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>{ch >= 0 ? "+" : ""}{ch.toFixed(1)}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

async function GeneralLedger(ctx: Ctx, sp: SP) {
  const to = sp.sampai ?? todayJakarta();
  const from = sp.dari ?? monthStart(to);
  const [open, mov] = await Promise.all([balances(ctx, null, addDays(from, -1)), balances(ctx, from, to)]);
  const om = new Map(open.map((o) => [o.account_id, balanceOf(o)]));
  const rows = mov.map((m) => ({ ...m, opening: om.get(m.account_id) ?? 0, closing: (om.get(m.account_id) ?? 0) + balanceOf(m) })).filter((r) => r.opening || Number(r.debit) || Number(r.credit));
  return (
    <>
      <PeriodForm from={from} to={to} />
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-app">
            <thead><tr><th>Akun</th><th className="text-right">Saldo awal</th><th className="text-right">Debit</th><th className="text-right">Kredit</th><th className="text-right">Saldo akhir</th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.account_id}>
                  <td><Link href={href(`/akun/${r.account_id}?dari=${from}&sampai=${to}`)} className="hover:text-accent"><span className="mono mr-2 text-xs text-muted">{r.code}</span>{r.name}</Link></td>
                  <td className="text-right"><Money value={r.opening} /></td>
                  <td className="text-right"><Money value={r.debit} /></td>
                  <td className="text-right"><Money value={r.credit} /></td>
                  <td className="text-right font-semibold"><Money value={r.closing} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

async function Journal(ctx: Ctx, sp: SP) {
  const to = sp.sampai ?? todayJakarta();
  const from = sp.dari ?? monthStart(to);
  const page = Math.max(1, Number(sp.page) || 1);
  const PAGE = 20;
  const { data, count } = await ctx.supabase
    .from("journal_entries")
    .select("id, number, date, memo, source_type, source_id, journal_lines(id, debit, credit, accounts(code, name))", { count: "exact" })
    .eq("org_id", ctx.org.id)
    .gte("date", from)
    .lte("date", to)
    .order("date", { ascending: false })
    .order("number", { ascending: false })
    .range((page - 1) * PAGE, page * PAGE - 1);
  type E = { id: string; number: string; date: string; memo: string | null; journal_lines: { id: string; debit: number; credit: number; accounts: { code: string; name: string } | null }[] };
  const entries = (data ?? []) as unknown as E[];
  return (
    <>
      <PeriodForm from={from} to={to} />
      <div className="space-y-3">
        {entries.map((e) => (
          <div key={e.id} className="card overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3 text-sm">
              <span className="font-semibold">{e.memo}</span>
              <span className="mono text-xs text-muted">{e.number} · {tgl(e.date)}</span>
            </div>
            <table className="table-app">
              <tbody>
                {e.journal_lines.map((l) => (
                  <tr key={l.id}>
                    <td className={Number(l.credit) ? "pl-10" : ""}><span className="mono mr-2 text-xs text-muted">{l.accounts?.code}</span>{l.accounts?.name}</td>
                    <td className="w-40 text-right">{Number(l.debit) ? <Money value={l.debit} /> : ""}</td>
                    <td className="w-40 text-right">{Number(l.credit) ? <Money value={l.credit} /> : ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
        {entries.length === 0 && <p className="card p-8 text-center text-muted">Tidak ada jurnal di periode ini.</p>}
      </div>
      <div className="card mt-3"><Pagination page={page} pages={Math.ceil((count ?? 0) / PAGE)} makeHref={(p) => href(`/laporan/jurnal?dari=${from}&sampai=${to}&page=${p}`)} /></div>
    </>
  );
}

async function TrialBalance(ctx: Ctx, sp: SP) {
  const to = sp.sampai ?? todayJakarta();
  const b = (await balances(ctx, null, to)).filter((r) => Number(r.debit) || Number(r.credit));
  const rows = b.map((r) => {
    const net = Number(r.debit) - Number(r.credit);
    return { ...r, d: net > 0 ? net : 0, c: net < 0 ? -net : 0 };
  });
  const td = rows.reduce((a, r) => a + r.d, 0), tc = rows.reduce((a, r) => a + r.c, 0);
  return (
    <>
      <PeriodForm to={to} single />
      <div className="card overflow-hidden">
        <table className="table-app">
          <thead><tr><th>Akun</th><th className="text-right">Debit</th><th className="text-right">Kredit</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.account_id}><td><span className="mono mr-2 text-xs text-muted">{r.code}</span>{r.name}</td><td className="text-right">{r.d ? <Money value={r.d} /> : ""}</td><td className="text-right">{r.c ? <Money value={r.c} /> : ""}</td></tr>
            ))}
            <tr className="bg-tide-2/[0.08] font-semibold"><td>Total</td><td className="text-right"><Money value={td} /></td><td className="text-right"><Money value={tc} /></td></tr>
          </tbody>
        </table>
      </div>
      <p className={`mt-3 flex items-center gap-2 text-sm ${Math.abs(td - tc) < 1 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600"}`}><Icon name={Math.abs(td - tc) < 1 ? "check" : "close"} size={16} /> {Math.abs(td - tc) < 1 ? "Debit dan kredit seimbang." : `Selisih ${idr(td - tc)}`}</p>
    </>
  );
}

async function ByContact(ctx: Ctx, sp: SP, side: "sales" | "purchase") {
  const to = sp.sampai ?? todayJakarta();
  const from = sp.dari ?? monthStart(addDays(to, -60));
  const { data } = await ctx.supabase.from(side === "sales" ? "sales_documents" : "purchase_documents").select("total, paid_amount, contacts(id, name)").eq("org_id", ctx.org.id).eq("kind", side === "sales" ? "invoice" : "bill").neq("status", "void").gte("date", from).lte("date", to);
  const map = new Map<string, { id?: string; name: string; count: number; total: number; paid: number }>();
  for (const r of (data ?? []) as unknown as { total: number; paid_amount: number; contacts: { id: string; name: string } | null }[]) {
    const k = r.contacts?.id ?? "-";
    const v = map.get(k) ?? { id: r.contacts?.id, name: r.contacts?.name ?? "Tanpa kontak", count: 0, total: 0, paid: 0 };
    v.count++;
    v.total += Number(r.total);
    v.paid += Number(r.paid_amount);
    map.set(k, v);
  }
  const rows = [...map.values()].sort((a, b) => b.total - a.total);
  const grand = rows.reduce((a, r) => a + r.total, 0);
  return (
    <>
      <PeriodForm from={from} to={to} />
      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <div className="card overflow-hidden">
          <table className="table-app">
            <thead><tr><th>{side === "sales" ? "Pelanggan" : "Vendor"}</th><th className="text-right">Transaksi</th><th className="text-right">Total</th><th className="text-right">Dibayar</th><th className="text-right">Sisa</th><th className="text-right">Porsi</th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.name}>
                  <td>{r.id ? <Link href={href(`/kontak/${r.id}`)} className="font-medium hover:text-accent">{r.name}</Link> : r.name}</td>
                  <td className="text-right tabular-nums">{r.count}</td>
                  <td className="text-right font-semibold"><Money value={r.total} /></td>
                  <td className="text-right"><Money value={r.paid} /></td>
                  <td className="text-right"><Money value={r.total - r.paid} /></td>
                  <td className="text-right tabular-nums">{grand ? ((r.total / grand) * 100).toFixed(1) : 0}%</td>
                </tr>
              ))}
              <tr className="font-semibold"><td>Total</td><td className="text-right">{rows.reduce((a, r) => a + r.count, 0)}</td><td className="text-right"><Money value={grand} /></td><td className="text-right"><Money value={rows.reduce((a, r) => a + r.paid, 0)} /></td><td className="text-right"><Money value={rows.reduce((a, r) => a + r.total - r.paid, 0)} /></td><td /></tr>
            </tbody>
          </table>
        </div>
        <div className="card p-5"><p className="mb-4 font-semibold">Teratas</p><HBars items={rows.slice(0, 8).map((r) => ({ name: r.name, value: r.total }))} format="idrShort" color={side === "sales" ? "#22D3EE" : "#8B5CF6"} /></div>
      </div>
    </>
  );
}

async function ByProduct(ctx: Ctx, sp: SP) {
  const to = sp.sampai ?? todayJakarta();
  const from = sp.dari ?? monthStart(addDays(to, -60));
  const { data } = await ctx.supabase.from("sales_document_lines").select("qty, amount, description, items(id, name, unit, buy_price), sales_documents!inner(date, status, kind)").eq("org_id", ctx.org.id).eq("sales_documents.kind", "invoice").neq("sales_documents.status", "void").gte("sales_documents.date", from).lte("sales_documents.date", to);
  const map = new Map<string, { id?: string; name: string; unit: string; qty: number; amount: number; cost: number }>();
  for (const r of (data ?? []) as unknown as { qty: number; amount: number; description: string | null; items: { id: string; name: string; unit: string; buy_price: number } | null }[]) {
    const k = r.items?.id ?? r.description ?? "-";
    const v = map.get(k) ?? { id: r.items?.id, name: r.items?.name ?? r.description ?? "Lainnya", unit: r.items?.unit ?? "", qty: 0, amount: 0, cost: 0 };
    v.qty += Number(r.qty);
    v.amount += Number(r.amount);
    v.cost += Number(r.qty) * Number(r.items?.buy_price ?? 0);
    map.set(k, v);
  }
  const rows = [...map.values()].sort((a, b) => b.amount - a.amount);
  return (
    <>
      <PeriodForm from={from} to={to} />
      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table-app">
              <thead><tr><th>Produk</th><th className="text-right">Terjual</th><th className="text-right">Penjualan</th><th className="text-right">Perkiraan HPP</th><th className="text-right">Margin</th></tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.name}>
                    <td>{r.id ? <Link href={href(`/produk/${r.id}`)} className="font-medium hover:text-accent">{r.name}</Link> : r.name}</td>
                    <td className="text-right tabular-nums">{r.qty.toLocaleString("id-ID")} {r.unit}</td>
                    <td className="text-right font-semibold"><Money value={r.amount} /></td>
                    <td className="text-right"><Money value={r.cost} /></td>
                    <td className="text-right tabular-nums">{r.amount ? (((r.amount - r.cost) / r.amount) * 100).toFixed(1) : 0}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card p-5"><p className="mb-4 font-semibold">Nilai penjualan</p><HBars items={rows.slice(0, 8).map((r) => ({ name: r.name, value: r.amount }))} format="idrShort" color="#EC4899" /></div>
      </div>
    </>
  );
}

async function Aging(ctx: Ctx, side: "sales" | "purchase") {
  const today = todayJakarta();
  const docs = side === "sales"
    ? await ctx.supabase.from("sales_documents").select("id, number, due_date, total, paid_amount, contacts(id, name)").eq("org_id", ctx.org.id).eq("kind", "invoice").in("status", ["open", "partial"])
    : await ctx.supabase.from("purchase_documents").select("id, number, due_date, total, paid_amount, contacts(id, name)").eq("org_id", ctx.org.id).eq("kind", "bill").in("status", ["open", "partial"]);
  const exps = side === "purchase" ? await ctx.supabase.from("expenses").select("id, number, due_date, total, paid_amount, contacts(id, name)").eq("org_id", ctx.org.id).in("status", ["open", "partial"]) : { data: [] };
  type D = { id: string; number: string; due_date: string | null; total: number; paid_amount: number; contacts: { id: string; name: string } | null };
  const all = [...((docs.data ?? []) as unknown as D[]), ...((exps.data ?? []) as unknown as D[])];
  const buckets = ["Belum jatuh tempo", "1-30 hari", "31-60 hari", "61-90 hari", "> 90 hari"];
  const map = new Map<string, { id?: string; name: string; b: number[] }>();
  for (const d of all) {
    const rest = Number(d.total) - Number(d.paid_amount);
    const days = d.due_date ? Math.floor((new Date(today).getTime() - new Date(d.due_date).getTime()) / 86400000) : 0;
    const i = days <= 0 ? 0 : days <= 30 ? 1 : days <= 60 ? 2 : days <= 90 ? 3 : 4;
    const k = d.contacts?.id ?? "-";
    const v = map.get(k) ?? { id: d.contacts?.id, name: d.contacts?.name ?? "Tanpa kontak", b: [0, 0, 0, 0, 0] };
    v.b[i] += rest;
    map.set(k, v);
  }
  const rows = [...map.values()].sort((a, b) => b.b.reduce((x, y) => x + y, 0) - a.b.reduce((x, y) => x + y, 0));
  const totals = buckets.map((_, i) => rows.reduce((a, r) => a + r.b[i], 0));
  return (
    <>
      <div className="mb-4 grid gap-3 sm:grid-cols-5">
        {buckets.map((b, i) => <StatCard key={b} label={b} value={idr(totals[i])} />)}
      </div>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-app">
            <thead><tr><th>{side === "sales" ? "Pelanggan" : "Vendor / penerima"}</th>{buckets.map((b) => <th key={b} className="text-right">{b}</th>)}<th className="text-right">Total</th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.name}>
                  <td>{r.id ? <Link href={href(`/kontak/${r.id}`)} className="font-medium hover:text-accent">{r.name}</Link> : r.name}</td>
                  {r.b.map((v, i) => <td key={i} className={`text-right ${i >= 2 && v ? "text-rose-600 dark:text-rose-400" : ""}`}>{v ? <Money value={v} /> : "-"}</td>)}
                  <td className="text-right font-semibold"><Money value={r.b.reduce((a, b) => a + b, 0)} /></td>
                </tr>
              ))}
              {rows.length === 0 && <tr><td colSpan={7} className="py-8 text-center text-muted">Tidak ada yang belum dibayar.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

async function ExpenseByAccount(ctx: Ctx, sp: SP) {
  const to = sp.sampai ?? todayJakarta();
  const from = sp.dari ?? monthStart(to);
  const b = await balances(ctx, from, to);
  const rows = nonZero(b, ["beban", "beban_lain"]).sort((a, c) => c.value - a.value);
  const total = rows.reduce((a, r) => a + r.value, 0);
  return (
    <>
      <PeriodForm from={from} to={to} />
      <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
        <div className="card overflow-hidden">
          <table className="table-app">
            <thead><tr><th>Akun</th><th className="text-right">Jumlah</th><th className="text-right">Porsi</th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}><td><Link href={href(`/akun/${r.id}?dari=${from}&sampai=${to}`)} className="hover:text-accent"><span className="mono mr-2 text-xs text-muted">{r.code}</span>{r.name}</Link></td><td className="text-right font-semibold"><Money value={r.value} /></td><td className="text-right tabular-nums">{total ? ((r.value / total) * 100).toFixed(1) : 0}%</td></tr>
              ))}
              <tr className="font-semibold"><td>Total</td><td className="text-right"><Money value={total} /></td><td /></tr>
            </tbody>
          </table>
        </div>
        <div className="card p-5"><p className="mb-4 font-semibold">Komposisi biaya</p><HBars items={rows.map((r) => ({ name: r.name, value: r.value }))} format="idrShort" color="#F59E0B" /></div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------- halaman
export default async function ReportPage({ params, searchParams }: { params: { slug: string }; searchParams: SP }) {
  const meta = ALL_REPORTS.find((r) => r.slug === params.slug);
  if (!meta) notFound();
  const ctx = await getAppContext();
  const body = await (async () => {
    switch (params.slug) {
      case "laba-rugi": return ProfitLoss(ctx, searchParams);
      case "neraca": return BalanceSheet(ctx, searchParams);
      case "arus-kas": return CashFlow(ctx, searchParams);
      case "perubahan-modal": return EquityChange(ctx, searchParams);
      case "ringkasan-eksekutif": return Executive(ctx, searchParams);
      case "buku-besar": return GeneralLedger(ctx, searchParams);
      case "jurnal": return Journal(ctx, searchParams);
      case "trial-balance": return TrialBalance(ctx, searchParams);
      case "penjualan-pelanggan": return ByContact(ctx, searchParams, "sales");
      case "pembelian-vendor": return ByContact(ctx, searchParams, "purchase");
      case "penjualan-produk": return ByProduct(ctx, searchParams);
      case "umur-piutang": return Aging(ctx, "sales");
      case "umur-hutang": return Aging(ctx, "purchase");
      case "biaya-akun": return ExpenseByAccount(ctx, searchParams);
      default: notFound();
    }
  })();
  void monthEnd;
  return (
    <div className="mx-auto max-w-[1300px]">
      <PageHeader title={meta.name} icon={meta.icon} tone={meta.tone} description={meta.desc} crumbs={[{ label: "Laporan", href: href("/laporan") }, { label: meta.name }]} actions={<PrintButton />} />
      {body}
    </div>
  );
}
