import type { Metadata } from "next";
import Link from "next/link";
import { getAppContext, href } from "@/lib/app/context";
import { idr, tgl, todayJakarta } from "@/lib/app/format";
import { EmptyState, Money, PageHeader, StatCard } from "@/components/app/ui";
import Icon from "@/components/app/Icon";

export const metadata: Metadata = { title: "Aset Tetap" };

function monthsBetween(a: string, b: string) {
  const [ya, ma] = a.split("-").map(Number);
  const [yb, mb] = b.split("-").map(Number);
  return Math.max(0, (yb - ya) * 12 + (mb - ma));
}

export default async function AssetsPage() {
  const { supabase, org } = await getAppContext();
  const today = todayJakarta();
  const { data } = await supabase.from("fixed_assets").select("id, number, name, acquired_on, cost, useful_life_months, salvage_value, status, accounts:asset_account_id(name)").eq("org_id", org.id).order("acquired_on", { ascending: false });
  type A = { id: string; number: string; name: string; acquired_on: string; cost: number; useful_life_months: number; salvage_value: number; status: string; accounts: { name: string } | null };
  const rows = ((data ?? []) as unknown as A[]).map((a) => {
    const m = Math.min(a.useful_life_months, monthsBetween(a.acquired_on, today));
    const monthly = (Number(a.cost) - Number(a.salvage_value)) / a.useful_life_months;
    const dep = monthly * m;
    const yearStart = `${today.slice(0, 4)}-01-01`;
    const mYear = Math.min(m, monthsBetween(a.acquired_on > yearStart ? a.acquired_on : yearStart, today));
    return { ...a, dep, book: Number(a.cost) - dep, depYear: monthly * mYear, monthly };
  });
  return (
    <div className="mx-auto max-w-[1300px]">
      <PageHeader title="Aset tetap" icon="asset" tone="violet" description="Peralatan, kendaraan, dan bangunan beserta perkiraan penyusutan garis lurus." actions={<Link href={href("/aset-tetap/baru")} className="btn-primary"><Icon name="plus" size={16} /> Tambah aset</Link>} />
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <StatCard label="Nilai perolehan" value={idr(rows.reduce((s, r) => s + Number(r.cost), 0))} icon="asset" tone="violet" />
        <StatCard label="Nilai buku" value={idr(rows.reduce((s, r) => s + r.book, 0))} hint="Setelah perkiraan penyusutan" icon="ledger" tone="blue" />
        <StatCard label="Penyusutan tahun ini" value={idr(rows.reduce((s, r) => s + r.depYear, 0))} hint="Metode garis lurus" icon="arrow-down" tone="pink" />
      </div>
      <div className="card overflow-hidden">
        {rows.length === 0 ? (
          <EmptyState icon="asset" title="Belum ada aset tetap" action={<Link href={href("/aset-tetap/baru")} className="btn-primary">Tambah aset</Link>} />
        ) : (
          <div className="overflow-x-auto">
            <table className="table-app">
              <thead><tr><th>Aset</th><th>Akun</th><th>Tanggal perolehan</th><th className="text-right">Umur</th><th className="text-right">Harga perolehan</th><th className="text-right">Akum. penyusutan</th><th className="text-right">Nilai buku</th></tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td><p className="font-semibold">{r.name}</p><p className="mono text-xs text-muted">{r.number}</p></td>
                    <td>{r.accounts?.name}</td>
                    <td>{tgl(r.acquired_on)}</td>
                    <td className="text-right">{Math.round(r.useful_life_months / 12)} th</td>
                    <td className="text-right"><Money value={r.cost} /></td>
                    <td className="text-right text-rose-600 dark:text-rose-400"><Money value={r.dep} /></td>
                    <td className="text-right font-semibold"><Money value={r.book} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <p className="mt-3 text-xs text-muted">Penyusutan di halaman ini adalah perkiraan. Jurnal penyusutan bulanan otomatis akan ditambahkan pada versi berikutnya.</p>
    </div>
  );
}
