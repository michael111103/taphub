import type { Metadata } from "next";
import { getAppContext, href } from "@/lib/app/context";
import { todayJakarta } from "@/lib/app/format";
import { PageHeader } from "@/components/app/ui";
import ActionForm from "@/components/app/ActionForm";
import SubmitButton from "@/components/app/SubmitButton";
import { saveFixedAsset } from "../../../actions";

export const metadata: Metadata = { title: "Aset baru" };

export default async function NewAssetPage() {
  const { supabase, org } = await getAppContext();
  const { data } = await supabase.from("accounts").select("id, code, name, category").eq("org_id", org.id).in("category", ["aset_tetap", "kas_bank"]).order("code");
  const acc = data ?? [];
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Tambah aset tetap" icon="asset" tone="violet" crumbs={[{ label: "Aset tetap", href: href("/aset-tetap") }, { label: "Baru" }]} />
      <ActionForm action={saveFixedAsset} className="card space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2"><label className="label" htmlFor="name">Nama aset</label><input id="name" name="name" required className="field" placeholder="Contoh: Laptop kasir" /></div>
          <div><label className="label" htmlFor="asset">Akun aset</label><select id="asset" name="asset_account_id" className="field">{acc.filter((a) => a.category === "aset_tetap").map((a) => <option key={a.id} value={a.id}>{a.code} · {a.name}</option>)}</select></div>
          <div><label className="label" htmlFor="paid">Dibayar dari</label><select id="paid" name="paid_from_account_id" className="field">{acc.filter((a) => a.category === "kas_bank").map((a) => <option key={a.id} value={a.id}>{a.code} · {a.name}</option>)}<option value="">Belum dibayar (hutang)</option></select></div>
          <div><label className="label" htmlFor="date">Tanggal perolehan</label><input id="date" name="acquired_on" type="date" defaultValue={todayJakarta()} className="field" /></div>
          <div><label className="label" htmlFor="cost">Harga perolehan</label><input id="cost" name="cost" type="number" min={1} step="any" required className="field" /></div>
          <div><label className="label" htmlFor="life">Masa manfaat (tahun)</label><input id="life" name="useful_life_years" type="number" min={1} step="any" defaultValue={4} className="field" /></div>
          <div><label className="label" htmlFor="salvage">Nilai sisa</label><input id="salvage" name="salvage_value" type="number" min={0} step="any" defaultValue={0} className="field" /></div>
          <div className="sm:col-span-2"><label className="label" htmlFor="notes">Catatan</label><input id="notes" name="notes" className="field" /></div>
        </div>
        <SubmitButton>Simpan aset</SubmitButton>
      </ActionForm>
    </div>
  );
}
