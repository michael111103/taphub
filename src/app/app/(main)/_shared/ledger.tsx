import Link from "next/link";
import { notFound } from "next/navigation";
import { getAppContext, href } from "@/lib/app/context";
import { addDays, idr, tgl, todayJakarta } from "@/lib/app/format";
import { Money, PageHeader, StatCard } from "@/components/app/ui";
import Icon from "@/components/app/Icon";
import { CATEGORY_LABEL, isDebitNormal } from "@/lib/app/accounting";

const SOURCE_HREF: Record<string, string> = { sales: "/penjualan/dokumen/", purchase: "/pembelian/dokumen/", expense: "/biaya/" };

/** Buku besar satu akun dengan saldo berjalan */
export async function AccountLedger({ id, from, to, section }: { id: string; from?: string; to?: string; section: "kas-bank" | "akun" }) {
  const { supabase, org } = await getAppContext();
  const { data: acc } = await supabase.from("accounts").select("*").eq("id", id).eq("org_id", org.id).single();
  if (!acc) notFound();
  const end = to ?? todayJakarta();
  const start = from ?? `${end.slice(0, 7)}-01`;
  const debitNormal = isDebitNormal(acc.category);

  const [{ data: before }, { data: lines }] = await Promise.all([
    supabase.rpc("account_balances", { p_org: org.id, p_from: null, p_to: addDays(start, -1) }),
    supabase.from("journal_lines").select("id, debit, credit, description, journal_entries!inner(id, number, date, memo, source_type, source_id)").eq("account_id", id).gte("journal_entries.date", start).lte("journal_entries.date", end),
  ]);
  const sign = (d: number, c: number) => (debitNormal ? d - c : c - d);
  const ob = ((before ?? []) as { account_id: string; debit: number; credit: number }[]).find((b) => b.account_id === id);
  const opening = ob ? sign(Number(ob.debit), Number(ob.credit)) : 0;
  type L = { id: string; debit: number; credit: number; description: string | null; journal_entries: { id: string; number: string; date: string; memo: string | null; source_type: string | null; source_id: string | null } };
  const rows = ((lines ?? []) as unknown as L[]).sort((a, b) => a.journal_entries.date.localeCompare(b.journal_entries.date) || a.journal_entries.number.localeCompare(b.journal_entries.number));
  let run = opening;
  const withBal = rows.map((r) => ({ ...r, bal: (run += sign(Number(r.debit), Number(r.credit))) }));
  const totalD = rows.reduce((a, r) => a + Number(r.debit), 0);
  const totalC = rows.reduce((a, r) => a + Number(r.credit), 0);

  return (
    <div className="mx-auto max-w-[1300px]">
      <PageHeader
        title={acc.name}
        icon={section === "kas-bank" ? "bank" : "ledger"}
        tone={section === "kas-bank" ? "blue" : "slate"}
        description={`${acc.code} · ${CATEGORY_LABEL[acc.category] ?? acc.category}`}
        crumbs={[{ label: section === "kas-bank" ? "Kas & Bank" : "Akun", href: href(`/${section}`) }, { label: acc.name }]}
        actions={
          section === "kas-bank" ? (
            <>
              <Link href={href(`/kas-bank/transaksi?jenis=receive&akun=${acc.id}`)} className="btn-soft"><Icon name="arrow-down" size={16} /> Terima uang</Link>
              <Link href={href(`/kas-bank/transaksi?jenis=spend&akun=${acc.id}`)} className="btn-soft"><Icon name="arrow-up" size={16} /> Kirim uang</Link>
              <Link href={href(`/kas-bank/transaksi?jenis=transfer&akun=${acc.id}`)} className="btn-primary"><Icon name="transfer" size={16} /> Transfer</Link>
            </>
          ) : undefined
        }
      />
      <form className="no-print card mb-4 flex flex-wrap items-end gap-3 p-4">
        <div><label className="label" htmlFor="from">Dari</label><input id="from" type="date" name="dari" defaultValue={start} className="field" /></div>
        <div><label className="label" htmlFor="to">Sampai</label><input id="to" type="date" name="sampai" defaultValue={end} className="field" /></div>
        <button className="btn-soft" type="submit"><Icon name="filter" size={16} /> Terapkan</button>
      </form>
      <div className="mb-4 grid gap-3 sm:grid-cols-4">
        <StatCard label="Saldo awal" value={idr(opening)} />
        <StatCard label="Debit" value={idr(totalD)} />
        <StatCard label="Kredit" value={idr(totalC)} />
        <StatCard label="Saldo akhir" value={idr(run)} tone="green" icon="wallet" />
      </div>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-app">
            <thead><tr><th>Tanggal</th><th>Nomor jurnal</th><th>Keterangan</th><th className="text-right">Debit</th><th className="text-right">Kredit</th><th className="text-right">Saldo</th></tr></thead>
            <tbody>
              <tr><td colSpan={5} className="font-medium text-muted">Saldo awal per {tgl(start)}</td><td className="text-right font-semibold"><Money value={opening} /></td></tr>
              {withBal.map((r) => {
                const src = r.journal_entries.source_type && SOURCE_HREF[r.journal_entries.source_type];
                return (
                  <tr key={r.id}>
                    <td className="whitespace-nowrap">{tgl(r.journal_entries.date)}</td>
                    <td className="mono text-xs">{r.journal_entries.number}</td>
                    <td>{src ? <Link href={href(`${src}${r.journal_entries.source_id}`)} className="text-accent hover:underline">{r.description ?? r.journal_entries.memo}</Link> : r.description ?? r.journal_entries.memo}</td>
                    <td className="text-right">{Number(r.debit) ? <Money value={r.debit} /> : ""}</td>
                    <td className="text-right">{Number(r.credit) ? <Money value={r.credit} /> : ""}</td>
                    <td className="text-right font-medium"><Money value={r.bal} /></td>
                  </tr>
                );
              })}
              {withBal.length === 0 && <tr><td colSpan={6} className="py-8 text-center text-muted">Tidak ada transaksi di periode ini.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
