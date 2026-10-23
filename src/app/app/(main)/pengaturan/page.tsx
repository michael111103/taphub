import type { Metadata } from "next";
import Link from "next/link";
import { getAppContext, href } from "@/lib/app/context";
import { PageHeader } from "@/components/app/ui";
import Icon, { TileIcon } from "@/components/app/Icon";

export const metadata: Metadata = { title: "Pengaturan" };

const GROUPS = [
  { title: "Profil & langganan", items: [
    { h: "/pengaturan/perusahaan", t: "Perusahaan", d: "Data dan identitas usaha", i: "building", tone: "blue" },
    { h: "/pengaturan/billing", t: "Billing", d: "Tagihan dan riwayat pembayaran langganan", i: "card", tone: "amber" },
    { h: "/langganan", t: "Paket langganan", d: "Upgrade atau perpanjang paket TapHub", i: "rocket", tone: "pink" },
  ] },
  { title: "Akun & pengguna", items: [
    { h: "/pengaturan/profil", t: "Profilku", d: "Nama, telepon, dan password", i: "user", tone: "violet" },
    { h: "/pengaturan/pengguna", t: "Pengguna", d: "Anggota tim dan hak akses", i: "contacts", tone: "green" },
  ] },
  { title: "Data master", items: [
    { h: "/akun", t: "Daftar akun", d: "Bagan akun dan saldo", i: "ledger", tone: "slate" },
    { h: "/produk", t: "Produk", d: "Barang, jasa, dan harga", i: "box", tone: "amber" },
    { h: "/kontak", t: "Kontak", d: "Pelanggan dan vendor", i: "contacts", tone: "pink" },
  ] },
  { title: "Integrasi", items: [
    { h: "/langganan?produk=pos", t: "TapPOS", d: "Penjualan kasir masuk otomatis ke pembukuan", i: "pos", tone: "teal" },
    { h: "/pengaturan", t: "Payment gateway", d: "Link pembayaran di tagihan (segera)", i: "wallet", tone: "blue" },
  ] },
];

export default async function SettingsPage() {
  const { org } = await getAppContext();
  return (
    <div className="mx-auto max-w-[1200px]">
      <PageHeader title="Pengaturan" icon="settings" tone="slate" description={`Kelola data ${org.name} dan langganan TapHub.`} />
      <div className="grid gap-4 md:grid-cols-2">
        {GROUPS.map((g) => (
          <section key={g.title} className="card p-5">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">{g.title}</h2>
            <div className="mt-3 grid gap-2">
              {g.items.map((x) => (
                <Link key={x.t} href={href(x.h)} className="group flex items-center gap-3 rounded-xl p-2 transition hover:bg-fg/[0.04]">
                  <TileIcon name={x.i} tone={x.tone} size={36} />
                  <span className="flex-1"><span className="block font-medium group-hover:text-accent">{x.t}</span><span className="text-sm text-muted">{x.d}</span></span>
                  <Icon name="chevron-right" size={18} className="text-muted" />
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
