import type { Metadata } from "next";
import Link from "next/link";
import { getAppContext, href } from "@/lib/app/context";
import { todayJakarta } from "@/lib/app/format";
import { Money, PageHeader, SearchBox } from "@/components/app/ui";
import Icon from "@/components/app/Icon";
import { CATEGORY_LABEL, CATEGORY_ORDER, balanceOf, type Balance } from "@/lib/app/accounting";

export const metadata: Metadata = { title: "Akun" };

export default async function AccountsPage({ searchParams }: { searchParams: { q?: string } }) {
  const { supabase, org } = await getAppContext();
  const { data } = await supabase.rpc("account_balances", { p_org: org.id, p_from: null, p_to: todayJakarta() });
  const q = searchParams.q?.toLowerCase().trim();
  const rows = ((data ?? []) as Balance[]).filter((r) => !q || r.name.toLowerCase().includes(q) || r.code.includes(q));
  return (
    <div className="mx-auto max-w-[1200px]">
      <PageHeader title="Daftar akun" icon="ledger" tone="slate" description="Bagan akun (chart of accounts) beserta saldo terkini." actions={<Link href={href("/akun/baru")} className="btn-primary"><Icon name="plus" size={16} /> Tambah akun</Link>} />
      <div className="card overflow-hidden">
        <div className="flex justify-end border-b border-line p-4"><SearchBox q={searchParams.q} placeholder="Cari kode atau nama akun" /></div>
        <div className="overflow-x-auto">
          <table className="table-app">
            <thead><tr><th className="w-32">Kode</th><th>Nama akun</th><th className="text-right">Saldo</th></tr></thead>
            {CATEGORY_ORDER.filter((c) => rows.some((r) => r.category === c)).map((cat) => (
              <tbody key={cat}>
                <tr className="bg-panel/80 hover:bg-panel/80"><td colSpan={3} className="text-xs font-semibold uppercase tracking-wide text-muted">{CATEGORY_LABEL[cat]}</td></tr>
                {rows.filter((r) => r.category === cat).map((r) => (
                  <tr key={r.account_id}>
                    <td className="mono text-xs">{r.code}</td>
                    <td><Link href={href(`/akun/${r.account_id}`)} className="font-medium hover:text-accent">{r.name}</Link></td>
                    <td className="text-right font-medium"><Money value={balanceOf(r)} /></td>
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>
      </div>
    </div>
  );
}
