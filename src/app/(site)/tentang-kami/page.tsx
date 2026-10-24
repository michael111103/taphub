import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import CtaCard from "@/components/CtaCard";
import ProductIcon from "@/components/ProductIcon";
import { products } from "@/lib/products";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Tentang TapHub",
  description:
    "Kenali TapHub, ekosistem software untuk usaha Indonesia di bawah PT Bara Karbon Internasional: cerita, visi, misi, nilai, dan perjalanan kami.",
  alternates: { canonical: "/tentang-kami" },
  openGraph: { url: "/tentang-kami", title: "Tentang TapHub" },
};

const values = [
  {
    title: "Sederhana",
    body: "Software harus bisa dipakai kasir di hari pertama, tanpa pelatihan panjang.",
    icon: "M4 12h16M12 4v16",
  },
  {
    title: "Terjangkau",
    body: "Harga yang masuk akal untuk usaha kecil, tanpa perlu membeli perangkat mahal.",
    icon: "M12 3v18M17 7H9.5a3 3 0 0 0 0 6h5a3 3 0 0 1 0 6H6",
  },
  {
    title: "Terhubung",
    body: "Setiap produk berbagi data, sehingga pemilik usaha tidak perlu mencatat dua kali.",
    icon: "M8 7a3 3 0 1 0-6 0 3 3 0 0 0 6 0zM22 17a3 3 0 1 0-6 0 3 3 0 0 0 6 0zM8 7h5a3 3 0 0 1 3 3v4",
  },
  {
    title: "Bisa dipercaya",
    body: "Data dijaga dengan serius dan pembayaran diproses lewat mitra berlisensi.",
    icon: "M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6zM9 12l2 2 4-4",
  },
];

const missions = [
  "Membuat software bisnis yang mudah dipakai tanpa pelatihan panjang.",
  "Menjaga harga tetap terjangkau untuk usaha kecil dan menengah.",
  "Menghubungkan penjualan, keuangan, dan operasional dalam satu ekosistem.",
];

const timeline = [
  { when: "Oktober 2026", title: "TapHub lahir", body: "TapHub didirikan di bawah PT Bara Karbon Internasional dengan kantor di Jakarta Selatan." },
  { when: "2026", title: "TapPOS sebagai produk unggulan", body: "Aplikasi kasir dan sistem POS untuk F&B, retail, dan jasa menjadi produk pertama yang kami kembangkan." },
  { when: "Berikutnya", title: "Ekosistem bertambah", body: "TapBisnis, TapInvoice, TapStock, dan produk lainnya dirilis bertahap dan saling terhubung dalam satu akun." },
];

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "Tentang TapHub",
    url: `${site.url}/tentang-kami`,
    mainEntity: {
      "@type": "Organization",
      name: site.name,
      legalName: site.company.legalName,
      url: site.url,
      foundingDate: "2026-10",
      address: { "@type": "PostalAddress", streetAddress: site.company.address[0], addressLocality: "Jakarta Selatan", addressRegion: "DKI Jakarta", postalCode: "12190", addressCountry: "ID" },
    },
  };
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.company.address.join(", "))}`;

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(55%_60%_at_50%_0%,rgba(27,91,255,0.16),transparent_70%)]" />
        <div className="mx-auto max-w-page px-4 pt-6 sm:px-6">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm text-muted">
              <li><Link href="/" className="hover:text-fg">Beranda</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-fg">Tentang TapHub</li>
            </ol>
          </nav>
          <div className="mx-auto max-w-3xl pt-12 text-center sm:pt-16">
            <p className="text-sm font-semibold text-accent">Tentang TapHub</p>
            <h1 className="mt-4 text-balance text-[2.4rem] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-6xl">
              Membantu usaha Indonesia bekerja lebih rapi dengan software yang saling terhubung.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted">
              TapHub adalah ekosistem software berbasis cloud untuk penjualan, keuangan, operasional, dan gaya hidup, dibuat khusus untuk usaha kecil dan menengah di Indonesia.
            </p>
          </div>
          <div className="mx-auto mt-12 max-w-5xl overflow-hidden rounded-[28px] border border-line sm:mt-16">
            <Image src="/images/tentang1.png" alt="Tim TapHub bekerja bersama di kantor" width={1600} height={900} priority sizes="(min-width: 1024px) 64rem, 100vw" className="aspect-[16/9] w-full object-cover" />
          </div>
        </div>
      </section>

      {/* CERITA */}
      <section aria-labelledby="cerita-judul" className="mt-20 border-t border-line sm:mt-28">
        <div className="mx-auto grid max-w-page gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-2 lg:gap-16">
          <h2 id="cerita-judul" className="text-balance text-3xl font-semibold tracking-[-0.02em] sm:text-5xl">Cerita kami</h2>
          <div className="space-y-5 text-lg leading-8 text-muted">
            <p>
              Banyak usaha di Indonesia masih mencatat pesanan di kertas, menghitung stok dengan perkiraan, dan merekap keuangan di akhir bulan. Software yang ada sering terlalu rumit untuk dipakai sehari-hari, atau terlalu mahal untuk usaha kecil.
            </p>
            <p>
              TapHub lahir untuk menjembatani celah itu. Kami membangun rangkaian aplikasi yang sederhana, terjangkau, dan saling terhubung, dimulai dari TapPOS untuk kasir. Tujuannya satu: pemilik usaha menghabiskan lebih sedikit waktu untuk administrasi dan lebih banyak waktu untuk melayani pelanggan.
            </p>
          </div>
        </div>
      </section>

      {/* VISI MISI */}
      <section aria-labelledby="visi-judul" className="bg-panel">
        <div className="mx-auto grid max-w-page gap-6 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-2">
          <div className="rounded-[28px] border border-line bg-raised p-8 sm:p-10">
            <h2 id="visi-judul" className="text-sm font-semibold text-accent">Visi</h2>
            <p className="mt-4 text-balance text-2xl font-semibold leading-snug tracking-[-0.01em] sm:text-3xl">
              Menjadi ekosistem software pilihan usaha kecil dan menengah di Indonesia.
            </p>
          </div>
          <div className="rounded-[28px] border border-line bg-raised p-8 sm:p-10">
            <h2 className="text-sm font-semibold text-accent">Misi</h2>
            <ul className="mt-4 space-y-4">
              {missions.map((m) => (
                <li key={m} className="flex gap-3 text-lg leading-8">
                  <span aria-hidden="true" className="mt-3.5 h-1.5 w-1.5 shrink-0 rounded-full bg-tide-2" />
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* NILAI */}
      <section aria-labelledby="nilai-judul" className="border-t border-line">
        <div className="mx-auto max-w-page px-4 py-20 sm:px-6 sm:py-28">
          <h2 id="nilai-judul" className="max-w-2xl text-balance text-3xl font-semibold tracking-[-0.02em] sm:text-5xl">Nilai yang kami pegang</h2>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <li key={v.title} className="rounded-3xl border border-line bg-panel p-6 transition hover:-translate-y-1 hover:border-tide-1/40">
                <span aria-hidden="true" className="grid h-11 w-11 place-items-center rounded-2xl border border-tide-1/30 bg-tide-2/10 text-accent">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={v.icon} /></svg>
                </span>
                <h3 className="mt-5 text-lg font-semibold">{v.title}</h3>
                <p className="mt-2 leading-7 text-muted">{v.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* PERJALANAN */}
      <section aria-labelledby="perjalanan-judul" className="border-t border-line">
        <div className="mx-auto grid max-w-page gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1fr_1.4fr]">
          <h2 id="perjalanan-judul" className="text-balance text-3xl font-semibold tracking-[-0.02em] sm:text-5xl">Perjalanan kami</h2>
          <ol className="relative space-y-10 border-l border-line pl-8">
            {timeline.map((t) => (
              <li key={t.title} className="relative">
                <span aria-hidden="true" className="absolute -left-[2.4rem] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-ink bg-gradient-to-br from-tide-1 to-tide-2 ring-4 ring-tide-2/15" />
                <p className="text-sm font-semibold text-accent">{t.when}</p>
                <h3 className="mt-1 text-xl font-semibold">{t.title}</h3>
                <p className="mt-2 leading-7 text-muted">{t.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* EKOSISTEM */}
      <section aria-labelledby="ekosistem-judul" className="border-t border-line">
        <div className="mx-auto max-w-page px-4 py-20 sm:px-6 sm:py-28">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <h2 id="ekosistem-judul" className="text-balance text-3xl font-semibold tracking-[-0.02em] sm:text-5xl">Ekosistem produk TapHub</h2>
              <p className="mt-5 text-lg leading-8 text-muted">Mulai dari satu produk, tambah yang lain saat usahamu berkembang.</p>
            </div>
            <Link href="/#produk" className="btn-ghost self-start sm:self-auto">Lihat semua produk</Link>
          </div>
          <ul className="mt-10 grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-9">
            {products.map((p) => (
              <li key={p.slug} className="flex flex-col items-center gap-2 rounded-2xl border border-line bg-panel px-2 py-4 text-center">
                <ProductIcon product={p} size={40} />
                <span className="text-xs font-medium sm:text-sm">{p.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* KANTOR */}
      <section aria-labelledby="kantor-judul" className="border-t border-line">
        <div className="mx-auto grid max-w-page items-center gap-10 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-2 lg:gap-16">
          <div className="overflow-hidden rounded-[28px] border border-line">
            <Image src="/images/tentang2.png" alt="Gedung kantor TapHub di Jakarta Selatan" width={1200} height={900} sizes="(min-width: 1024px) 45vw, 100vw" className="aspect-[4/3] w-full object-cover" />
          </div>
          <div>
            <h2 id="kantor-judul" className="text-balance text-3xl font-semibold tracking-[-0.02em] sm:text-5xl">Kantor kami</h2>
            <address className="mt-6 not-italic text-lg leading-8 text-muted">
              <span className="block font-semibold text-fg">{site.company.legalName}</span>
              {site.company.address.map((line) => <span key={line} className="block">{line}</span>)}
            </address>
            <dl className="mt-8 space-y-3">
              <div className="flex gap-3">
                <dt className="w-24 shrink-0 text-muted">Email</dt>
                <dd><a href={`mailto:${site.email}`} className="font-medium underline underline-offset-4">{site.email}</a></dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-24 shrink-0 text-muted">WhatsApp</dt>
                <dd>{site.whatsappDisplay}</dd>
              </div>
            </dl>
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost mt-8">Buka di Google Maps</a>
          </div>
        </div>
      </section>

      <section aria-label="Konsultasi" className="border-t border-line">
        <div className="mx-auto max-w-page px-4 py-20 sm:px-6 sm:py-28">
          <CtaCard />
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
