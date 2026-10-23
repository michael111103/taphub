import type { Metadata } from "next";
import { href } from "@/lib/app/context";
import { PageHeader } from "@/components/app/ui";
import ActionForm from "@/components/app/ActionForm";
import SubmitButton from "@/components/app/SubmitButton";
import { CATEGORY_LABEL } from "@/lib/app/accounting";
import { saveAccount } from "../../../actions";

export const metadata: Metadata = { title: "Akun baru" };

export default function NewAccountPage({ searchParams }: { searchParams: { kategori?: string } }) {
  const cat = searchParams.kategori ?? "beban";
  const prefix: Record<string, string> = { kas_bank: "1-1000", piutang: "1-101", persediaan: "1-102", aset_lancar_lain: "1-103", aset_tetap: "1-107", hutang: "2-201", kewajiban_lancar_lain: "2-205", modal: "3-30", pendapatan: "4-40", hpp: "5-50", beban: "6-6", pendapatan_lain: "7-70", beban_lain: "8-80" };
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title={cat === "kas_bank" ? "Tambah rekening" : "Akun baru"} icon="ledger" tone="slate" crumbs={[{ label: cat === "kas_bank" ? "Kas & Bank" : "Akun", href: href(cat === "kas_bank" ? "/kas-bank" : "/akun") }, { label: "Baru" }]} />
      <ActionForm action={saveAccount} className="card space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="cat">Kategori</label>
            <select id="cat" name="category" defaultValue={cat} className="field">
              {Object.entries(CATEGORY_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div><label className="label" htmlFor="code">Kode akun</label><input id="code" name="code" required placeholder={`${prefix[cat] ?? ""}...`} className="field mono" /></div>
          <div className="sm:col-span-2"><label className="label" htmlFor="name">Nama akun</label><input id="name" name="name" required placeholder={cat === "kas_bank" ? "Contoh: Bank BCA 1234567890" : ""} className="field" /></div>
          <div className="sm:col-span-2"><label className="label" htmlFor="desc">Deskripsi</label><input id="desc" name="description" className="field" /></div>
        </div>
        <SubmitButton>Simpan akun</SubmitButton>
      </ActionForm>
    </div>
  );
}
