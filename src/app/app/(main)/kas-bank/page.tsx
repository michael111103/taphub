import type { Metadata } from "next";
import Link from "next/link";
import { getAppContext, href } from "@/lib/app/context";
import { idr, tgl, todayJakarta, addDays } from "@/lib/app/format";
import { Money, PageHeader, StatCard } from "@/components/app/ui";
import Icon, { TileIcon } from "@/components/app/Icon";
import { Sparkline } from "@/components/app/charts";

export const metadata: Metadata = { title: "Kas & Bank" };

export default async function CashPage() {
  const { supabase, org } = await getAppContext();
  const today = todayJakarta();
  const from = addDays(today, -29);
  const { data: accounts } = await supabase.from("accounts").select("id, code, name").eq("org_id", org.id).eq("category", "kas_bank").eq("is_archived", false).order("code");
  const ids = (accounts ?? []).map((a) => a.id);
  const [{ data: lines }, { data: opening }] = await Promise.all([
    ids.length
      ? supabase.from("journal_lines").select("account_id, debit, credit, journal_entries!inner(date)").in("account_id", ids).gte("journal_entries.date", from).limit(5000)
      : Promise.resolve({ data: [] }),
    supabase.rpc("account_balances", { p_org: org.id, p_from: null, p_to: addDays(from, -1) }),
  ]);
  const openMap = new Map(((opening ?? []) as { account_id: string; debit: number; credit: number }[]).map((b) => [b.account_id, Number(b.debit) - Number(b.credit)]));
  const { data: txs } = await supabase.from("bank_transactions").select("id, number, kind, date, amount, description, account_id, counter_account_id").eq("org_id", org.id).order("date", { ascending: false }).limit(12);
  type Ln = { account_id: string; debit: number; credit: number; journal_entries: { date: string } };
  const ls = (lines ?? []) as unknown as Ln[];
  const cards = (accounts ?? []).map((a) => {
    const mine = ls.filter((l) => l.account_id === a.id);
    const series: number[] = [];
    let run = openMap.get(a.id) ?? 0;
    for (let i = 0; i < 30; i++) {
      const d = addDays(from, i);
      run += mine.filter((l) => l.journal_entries.date === d).reduce((s, l) => s + Number(l.debit) - Number(l.credit), 0);
      series.push(run);
    }
    const balance = run;
    const monthIn = mine.filter((l) => l.journal_entries.date >= `${today.slice(0, 7)}-01`).reduce((s, l) => s + Number(l.debit), 0);
    const monthOut = mine.filter((l) => l.journal_entries.date >= `${today.slice(0, 7)}-01`).reduce((s, l) => s + Number(l.credit), 0);
    return { ...a, balance, series, monthIn, monthOut };
  });
  const names = new Map((accounts ?? []).map((a) => [a.id, a.name]));
  const total = cards.reduce((s, c) => s + c.balance, 0);
  const KIND: Record<string, string> = { receive: "Terima uang", spend: "Kirim uang", transfer: "Transfer" };

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        title="Kas & Bank"
        icon="bank"
        tone="blue"
        description="Saldo setiap rekening dihitung dari jurnal, jadi selalu sama dengan laporan keuangan."
        actions={
          <>
            <Link href={href("/akun/baru?kategori=kas_bank")} className="btn-soft"><Icon name="plus" size={16} /> Tambah rekening</Link>
            <Link href={href("/kas-bank/transaksi")} className="btn-primary"><Icon name="transfer" size={16} /> Transaksi</Link>
          </>
        }
      />
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <StatCard label="Total saldo" value={idr(total)} icon="wallet" tone="green" />
        <StatCard label="Masuk bulan ini" value={idr(cards.reduce((s, c) => s + c.monthIn, 0))} icon="arrow-down" tone="blue" />
        <StatCard label="Keluar bulan ini" value={idr(cards.reduce((s, c) => s + c.monthOut, 0))} icon="arrow-up" tone="pink" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((c, i) => (
          <Link key={c.id} href={href(`/kas-bank/${c.id}`)} className="card anim-feed group p-5 transition hover:border-tide-2/40" style={{ animationDelay: `${i * 80}ms` }}>
            <div className="flex items-center gap-3">
              <TileIcon name={c.name.toLowerCase().includes("kas") ? "wallet" : "bank"} tone={["blue", "green", "violet", "amber"][i % 4]} size={36} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold group-hover:text-accent">{c.name}</p>
                <p className="mono text-xs text-muted">{c.code}</p>
              </div>
              <Icon name="chevron-right" size={18} className="text-muted" />
            </div>
            <p className="mt-4 text-xs text-muted">Saldo di TapHub</p>
            <p className="text-2xl font-semibold tabular-nums">{idr(c.balance)}</p>
            <div className="mt-3"><Sparkline values={c.series} color={["#22D3EE", "#10B981", "#8B5CF6", "#F59E0B"][i % 4]} height={48} /></div>
            <div className="mt-3 flex justify-between text-xs text-muted">
              <span>Masuk bulan ini <b className="text-emerald-600 dark:text-emerald-400"><Money value={c.monthIn} /></b></span>
              <span>Keluar <b className="text-rose-600 dark:text-rose-400"><Money value={c.monthOut} /></b></span>
            </div>
          </Link>
        ))}
      </div>
      <div className="card mt-4 overflow-hidden">
        <p className="p-5 pb-2 font-semibold">Transaksi kas & bank terakhir</p>
        <div className="overflow-x-auto">
          <table className="table-app">
            <thead><tr><th>Tanggal</th><th>Nomor</th><th>Jenis</th><th>Rekening</th><th>Keterangan</th><th className="text-right">Jumlah</th></tr></thead>
            <tbody>
              {(txs ?? []).map((t) => (
                <tr key={t.id}>
                  <td>{tgl(t.date)}</td>
                  <td className="mono text-xs">{t.number}</td>
                  <td>{KIND[t.kind]}</td>
                  <td>{names.get(t.account_id)}{t.kind === "transfer" && <> → {names.get(t.counter_account_id)}</>}</td>
                  <td className="max-w-[260px] truncate text-muted">{t.description ?? "-"}</td>
                  <td className={`text-right font-semibold ${t.kind === "receive" ? "text-emerald-600 dark:text-emerald-400" : ""}`}><Money value={t.amount} /></td>
                </tr>
              ))}
              {(txs ?? []).length === 0 && <tr><td colSpan={6} className="py-8 text-center text-muted">Belum ada transaksi.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
