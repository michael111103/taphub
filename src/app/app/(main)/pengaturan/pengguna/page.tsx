import type { Metadata } from "next";
import { getAppContext, href } from "@/lib/app/context";
import { initials, tgl } from "@/lib/app/format";
import { PageHeader } from "@/components/app/ui";

export const metadata: Metadata = { title: "Pengguna" };
const ROLE: Record<string, string> = { owner: "Pemilik", admin: "Admin", staff: "Staf" };

export default async function UsersPage() {
  const { supabase, org } = await getAppContext();
  const { data } = await supabase.from("org_members").select("user_id, role, created_at").eq("org_id", org.id);
  const ids = (data ?? []).map((m) => m.user_id);
  const { data: profiles } = ids.length ? await supabase.from("profiles").select("id, full_name, phone").in("id", ids) : { data: [] };
  const pm = new Map((profiles ?? []).map((p) => [p.id, p]));
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Pengguna" icon="contacts" tone="green" crumbs={[{ label: "Pengaturan", href: href("/pengaturan") }, { label: "Pengguna" }]} description="Anggota tim yang punya akses ke usaha ini." />
      <div className="card divide-y divide-line">
        {(data ?? []).map((m) => {
          const p = pm.get(m.user_id);
          return (
            <div key={m.user_id} className="flex items-center gap-3 p-4">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-tide-1 to-tide-2 text-sm font-semibold text-white">{initials(p?.full_name)}</span>
              <div className="flex-1"><p className="font-semibold">{p?.full_name ?? "Pengguna"}</p><p className="text-xs text-muted">Bergabung {tgl(m.created_at)}</p></div>
              <span className="rounded-full bg-tide-2/10 px-3 py-1 text-xs font-semibold text-accent">{ROLE[m.role]}</span>
            </div>
          );
        })}
      </div>
      <div className="card mt-4 p-5 text-sm text-muted">
        <p className="font-semibold text-fg">Undang anggota tim</p>
        <p className="mt-1">Fitur undangan pengguna dan pengaturan peran sedang disiapkan. Paket Pro mendukung hingga 5 pengguna.</p>
      </div>
    </div>
  );
}
