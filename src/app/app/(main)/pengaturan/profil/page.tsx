import type { Metadata } from "next";
import { getAppContext, href } from "@/lib/app/context";
import { PageHeader } from "@/components/app/ui";
import ActionForm from "@/components/app/ActionForm";
import SubmitButton from "@/components/app/SubmitButton";
import { updateProfile } from "../../../actions";

export const metadata: Metadata = { title: "Profilku" };

export default async function ProfilePage() {
  const { profile, user } = await getAppContext();
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Profilku" icon="user" tone="violet" crumbs={[{ label: "Pengaturan", href: href("/pengaturan") }, { label: "Profilku" }]} />
      <ActionForm action={updateProfile} className="space-y-4">
        <section className="card space-y-4 p-5">
          <h2 className="font-semibold">Data diri</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="label">Email</label><input value={user.email ?? ""} disabled className="field opacity-70" /></div>
            <div><label className="label" htmlFor="fn">Nama lengkap</label><input id="fn" name="full_name" defaultValue={profile.full_name ?? ""} className="field" /></div>
            <div><label className="label" htmlFor="ph">Nomor telepon</label><input id="ph" name="phone" defaultValue={profile.phone ?? ""} className="field" /></div>
          </div>
        </section>
        <section className="card space-y-4 p-5">
          <h2 className="font-semibold">Ganti password</h2>
          <p className="text-sm text-muted">Kosongkan jika tidak ingin mengganti password.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="label" htmlFor="pw">Password baru</label><input id="pw" name="password" type="password" minLength={8} autoComplete="new-password" className="field" /></div>
            <div><label className="label" htmlFor="pw2">Ulangi password baru</label><input id="pw2" name="password2" type="password" autoComplete="new-password" className="field" /></div>
          </div>
        </section>
        <SubmitButton>Simpan</SubmitButton>
      </ActionForm>
    </div>
  );
}
