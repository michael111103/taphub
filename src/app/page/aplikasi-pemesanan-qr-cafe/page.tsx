import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import HeroDashboard from "@/components/HeroDashboard";
import PhoneMenu from "@/components/PhoneMenu";
import ContactForm from "@/components/ContactForm";
import FaqList from "@/components/FaqList";
import { taporderFaqs } from "@/lib/faq";
import { TAPORDER_PATH } from "@/lib/products";
import { site, whatsappLink } from "@/lib/site";

const title = "TapOrder: Aplikasi Pemesanan Scan QR untuk Cafe dan Restoran";
const description =
  "Pelanggan scan QR di meja, pesan, dan bayar sendiri lewat HP. Pesanan langsung masuk ke kasir dan dapur lengkap dengan nomor meja. Tanpa mesin kasir khusus, Rp599 per transaksi.";

export const metadata: Metadata = {
  title: { absolute: `${title} | TapHub` },
  description,
  keywords: [
    "aplikasi pemesanan QR",
    "QR order cafe",
    "aplikasi order meja restoran",
    "self order cafe",
    "menu digital QR",
    "aplikasi kasir cafe",
    "TapOrder",
  ],
  alternates: { canonical: TAPORDER_PATH },
  openGraph: { type: "website", url: TAPORDER_PATH, title, description, siteName: site.name, locale: "id_ID" },
  twitter: { card: "summary_large_image", title, description },
};

const steps = [
  { title: "Pelanggan scan QR di meja", body: "Setiap meja punya QR sendiri, jadi nomor meja tercatat otomatis." },
  { title: "Pilih menu dari HP", body: "Menu terbuka di browser. Tidak perlu install aplikasi atau daftar akun." },
  { title: "Bayar langsung", body: "QRIS, e-wallet, atau virtual account. Pesanan baru diteruskan setelah lunas." },
  { title: "Pesanan masuk ke kasir dan dapur", body: "Dashboard berbunyi saat ada pesanan baru, lengkap dengan nomor meja." },
];

const features = [
  { title: "QR unik per meja", body: "Nomor meja ikut tercatat di setiap pesanan, tidak perlu ditanya ulang." },
  { title: "Bayar dulu, baru diproses", body: "Pesanan hanya diteruskan ke dapur setelah pembayaran berhasil, jadi tidak ada pesanan iseng." },
  { title: "Dashboard real time", body: "Pesanan baru muncul otomatis dengan bunyi notifikasi, tanpa perlu refresh." },
  { title: "Take away juga bisa", body: "Pasang QR di meja kasir untuk pelanggan yang ingin bawa pulang." },
  { title: "Atur menu sendiri", body: "Ubah harga, tambah menu, atau tandai menu habis kapan saja dari dashboard." },
  { title: "Laporan penjualan harian", body: "Lihat total penjualan, jumlah pesanan, dan menu terlaris setiap hari." },
];

const pricingPoints = [
  "Tidak perlu mesin kasir khusus, cukup tablet atau HP",
  "Uang masuk ke saldo usahamu sendiri lewat payment gateway berlisensi",
  "QR per meja dan dashboard pesanan real time",
  "Laporan penjualan harian",
];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "TapOrder",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description,
    url: `${site.url}${TAPORDER_PATH}`,
    publisher: { "@type": "Organization", name: site.name, legalName: site.company.legalName },
    offers: { "@type": "Offer", price: "599", priceCurrency: "IDR", description: "Per transaksi yang berhasil dibayar" },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Beranda", item: `${site.url}/` },
      { "@type": "ListItem", position: 2, name: "TapOrder", item: `${site.url}${TAPORDER_PATH}` },
    ],
  },
];

export default function TapOrderPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_70%_20%,rgba(27,91,255,0.22),transparent_70%),radial-gradient(40%_40%_at_10%_0%,rgba(56,200,248,0.12),transparent_70%)]" />
        <div className="mx-auto max-w-page px-4 pt-6 sm:px-6">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm text-muted">
              <li><Link href="/" className="hover:text-fg">Beranda</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-fg">TapOrder</li>
            </ol>
          </nav>
        </div>
        <div className="mx-auto grid max-w-page items-center gap-14 px-4 pb-20 pt-10 sm:px-6 sm:pt-16 lg:grid-cols-[1fr_1.15fr] lg:gap-10 lg:pb-28">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-panel px-3 py-1.5 text-xs text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-tide-1" />
              TapOrder sedang membuka program pilot
            </p>
            <h1 className="mt-6 text-balance text-[2.5rem] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-6xl">
              Aplikasi pemesanan scan QR untuk cafe dan restoran.
            </h1>
            <p className="mt-6 max-w-xl text-pretty text-lg leading-8 text-muted">
              Pelanggan scan QR di meja, pesan, dan bayar dari HP. Pesanan langsung muncul di kasir dan dapur, kamu fokus melayani.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={`${TAPORDER_PATH}#daftar`} className="btn-tide">Daftar program pilot</Link>
              <Link href={`${TAPORDER_PATH}#cara-kerja`} className="btn-ghost">Lihat cara kerjanya</Link>
            </div>
          </div>
          <HeroDashboard />
        </div>
      </section>

      {/* CARA KERJA */}
      <section id="cara-kerja" aria-labelledby="cara-kerja-judul" className="relative overflow-hidden border-t border-line">
        <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-20 -z-10 h-[520px] w-[520px] rounded-full bg-tide-2/20 blur-[120px]" />
        <div className="mx-auto grid max-w-page gap-16 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 id="cara-kerja-judul" className="text-balance text-3xl font-semibold tracking-[-0.02em] sm:text-5xl">
              Dari meja ke dapur tanpa antre di kasir.
            </h2>
            <ol className="mt-10 space-y-6">
              {steps.map((s, i) => (
                <li key={s.title} className="grid grid-cols-[2.5rem_1fr] gap-4">
                  <span className="grid h-10 w-10 place-items-center rounded-full border border-tide-1/40 bg-tide-2/10 text-sm font-semibold text-tide-1">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold">{s.title}</h3>
                    <p className="mt-1 leading-7 text-muted">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="relative pb-10">
            <div className="w-[72%] overflow-hidden rounded-[28px] border border-line sm:w-[62%]">
              <Image
                src="/images/taporder-scan.jpg"
                alt="Pelanggan memindai kode QR di meja cafe dengan HP"
                width={1000}
                height={1250}
                sizes="(min-width: 1024px) 30vw, 72vw"
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 right-0 origin-bottom-right scale-[0.78] sm:scale-100">
              <PhoneMenu />
            </div>
          </div>
        </div>
      </section>

      {/* FITUR */}
      <section id="fitur" aria-labelledby="fitur-judul" className="border-t border-line">
        <div className="mx-auto max-w-page px-4 py-20 sm:px-6 sm:py-28">
          <h2 id="fitur-judul" className="max-w-2xl text-balance text-3xl font-semibold tracking-[-0.02em] sm:text-5xl">
            Fitur TapOrder
          </h2>
          <ul className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <li key={f.title} className="border-t border-line pt-6">
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 leading-7 text-muted">{f.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* HARGA */}
      <section id="harga" aria-labelledby="harga-judul" className="border-t border-line">
        <div className="mx-auto grid max-w-page gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 id="harga-judul" className="text-balance text-3xl font-semibold tracking-[-0.02em] sm:text-5xl">
              Bayar hanya saat ada transaksi.
            </h2>
            <p className="mt-5 max-w-lg text-lg leading-8 text-muted">
              Tanpa biaya pembelian alat. Kamu membayar per transaksi yang berhasil, jadi saat sepi biayanya ikut kecil.
            </p>
          </div>
          <div className="relative rounded-[28px] border border-tide-1/30 bg-gradient-to-b from-tide-2/[0.14] via-panel to-panel p-7 shadow-[0_0_80px_-30px_rgba(27,91,255,0.8)] sm:p-9">
            <p className="font-semibold">TapOrder</p>
            <p className="mt-4 flex items-baseline gap-2">
              <span className="text-tide text-6xl font-semibold tracking-[-0.03em] tabular-nums">Rp599</span>
              <span className="text-muted">per transaksi</span>
            </p>
            <ul className="mt-8 space-y-3">
              {pricingPoints.map((p) => (
                <li key={p} className="flex gap-3 leading-7">
                  <svg className="mt-1.5 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#38C8F8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12l5 5L20 7" /></svg>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-6 text-muted">
              Biaya metode pembayaran (misalnya QRIS) mengikuti tarif payment gateway dan ditampilkan terpisah.
            </p>
            <Link href={`${TAPORDER_PATH}#daftar`} className="btn-tide mt-8 w-full">Daftar program pilot</Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" aria-labelledby="faq-judul" className="border-t border-line">
        <div className="mx-auto grid max-w-page gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <h2 id="faq-judul" className="text-3xl font-semibold tracking-[-0.02em] sm:text-5xl">Pertanyaan seputar TapOrder</h2>
            <p className="mt-5 leading-7 text-muted">
              Belum terjawab?{" "}
              <a href={whatsappLink("Halo TapHub, saya mau bertanya soal TapOrder.")} target="_blank" rel="noopener noreferrer" className="text-tide-1 underline underline-offset-4">
                Tanya lewat WhatsApp
              </a>
              .
            </p>
          </div>
          <FaqList items={taporderFaqs} />
        </div>
      </section>

      {/* DAFTAR */}
      <section id="daftar" aria-labelledby="daftar-judul" className="relative overflow-hidden border-t border-line">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[420px] bg-[radial-gradient(50%_70%_at_50%_100%,rgba(27,91,255,0.28),transparent_70%)]" />
        <div className="mx-auto grid max-w-page gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <h2 id="daftar-judul" className="text-balance text-3xl font-semibold tracking-[-0.02em] sm:text-5xl">
              Coba TapOrder di usahamu.
            </h2>
            <p className="mt-5 max-w-md text-lg leading-8 text-muted">
              Isi formulir, lalu kami hubungi lewat WhatsApp untuk mengatur pemasangan dan QR meja.
            </p>
            <p className="mt-8 text-sm text-muted">
              TapOrder adalah produk dari <Link href="/" className="text-fg underline underline-offset-4">TapHub</Link>.
            </p>
          </div>
          <div className="rounded-[28px] border border-line bg-panel/80 p-6 backdrop-blur sm:p-8">
            <ContactForm product="TapOrder" />
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
