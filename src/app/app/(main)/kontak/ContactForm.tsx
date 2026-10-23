import ActionForm from "@/components/app/ActionForm";
import SubmitButton from "@/components/app/SubmitButton";
import { saveContact } from "../../actions";

export type ContactRow = { id?: string; kind?: string[]; name?: string; company?: string | null; email?: string | null; phone?: string | null; address?: string | null; city?: string | null; npwp?: string | null; notes?: string | null };

export default function ContactForm({ c = {}, defaultKind = "customer" }: { c?: ContactRow; defaultKind?: string }) {
  const kinds = c.kind ?? [defaultKind];
  return (
    <ActionForm action={saveContact} className="card space-y-4 p-5">
      {c.id && <input type="hidden" name="id" value={c.id} />}
      <fieldset>
        <legend className="label">Jenis kontak</legend>
        <div className="flex flex-wrap gap-2">
          {[["customer", "Pelanggan"], ["vendor", "Vendor"], ["employee", "Karyawan"], ["other", "Lainnya"]].map(([v, l]) => (
            <label key={v} className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-line px-3 py-2 text-sm has-[:checked]:border-tide-2/50 has-[:checked]:bg-tide-2/10 has-[:checked]:text-accent">
              <input type="checkbox" name="kind" value={v} defaultChecked={kinds.includes(v)} className="accent-[#1B5BFF]" /> {l}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="label" htmlFor="name">Nama *</label><input id="name" name="name" required defaultValue={c.name} className="field" /></div>
        <div><label className="label" htmlFor="company">Perusahaan</label><input id="company" name="company" defaultValue={c.company ?? ""} className="field" /></div>
        <div><label className="label" htmlFor="phone">Telepon / WhatsApp</label><input id="phone" name="phone" defaultValue={c.phone ?? ""} className="field" /></div>
        <div><label className="label" htmlFor="email">Email</label><input id="email" name="email" type="email" defaultValue={c.email ?? ""} className="field" /></div>
        <div className="sm:col-span-2"><label className="label" htmlFor="address">Alamat</label><input id="address" name="address" defaultValue={c.address ?? ""} className="field" /></div>
        <div><label className="label" htmlFor="city">Kota</label><input id="city" name="city" defaultValue={c.city ?? ""} className="field" /></div>
        <div><label className="label" htmlFor="npwp">NPWP</label><input id="npwp" name="npwp" defaultValue={c.npwp ?? ""} className="field" /></div>
        <div className="sm:col-span-2"><label className="label" htmlFor="notes">Catatan</label><textarea id="notes" name="notes" rows={3} defaultValue={c.notes ?? ""} className="field" /></div>
      </div>
      <SubmitButton>{c.id ? "Simpan perubahan" : "Simpan kontak"}</SubmitButton>
    </ActionForm>
  );
}
