import type { Metadata } from "next";
import { getAppContext, href } from "@/lib/app/context";
import { PageHeader } from "@/components/app/ui";
import ActionForm from "@/components/app/ActionForm";
import SubmitButton from "@/components/app/SubmitButton";
import { updateOrg } from "../../../actions";

export const metadata: Metadata = { title: "Perusahaan" };

export default async function OrgSettings() {
  const { org } = await getAppContext();
  const canEdit = org.role !== "staff";
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Perusahaan" icon="building" tone="blue" crumbs={[{ label: "Pengaturan", href: href("/pengaturan") }, { label: "Perusahaan" }]} description="Data ini tampil di tagihan dan laporan." />
      <ActionForm action={updateOrg} className="card space-y-4 p-5">
        <fieldset disabled={!canEdit} className="grid gap-4 sm:grid-cols-2">
          <div><label className="label" htmlFor="name">Nama usaha</label><input id="name" name="name" defaultValue={org.name} required className="field" /></div>
          <div><label className="label" htmlFor="legal">Nama badan usaha</label><input id="legal" name="legal_name" defaultValue={org.legal_name ?? ""} className="field" /></div>
          <div><label className="label" htmlFor="industry">Jenis usaha</label><input id="industry" name="industry" defaultValue={org.industry ?? ""} className="field" /></div>
          <div><label className="label" htmlFor="npwp">NPWP</label><input id="npwp" name="npwp" defaultValue={org.npwp ?? ""} className="field" /></div>
          <div><label className="label" htmlFor="email">Email</label><input id="email" name="email" type="email" defaultValue={org.email ?? ""} className="field" /></div>
          <div><label className="label" htmlFor="phone">Telepon</label><input id="phone" name="phone" defaultValue={org.phone ?? ""} className="field" /></div>
          <div className="sm:col-span-2"><label className="label" htmlFor="address">Alamat</label><input id="address" name="address" defaultValue={org.address ?? ""} className="field" /></div>
          <div><label className="label" htmlFor="city">Kota</label><input id="city" name="city" defaultValue={org.city ?? ""} className="field" /></div>
        </fieldset>
        {canEdit ? <SubmitButton>Simpan</SubmitButton> : <p className="text-sm text-muted">Hanya pemilik atau admin yang bisa mengubah data perusahaan.</p>}
      </ActionForm>
    </div>
  );
}
