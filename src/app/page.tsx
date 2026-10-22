import Image from "next/image";
import Link from "next/link";
import Ecosystem from "@/components/Ecosystem";
import ProductGrid from "@/components/ProductGrid";
import ProductIcon from "@/components/ProductIcon";
import ContactForm from "@/components/ContactForm";
import FaqList from "@/components/FaqList";
import { companyFaqs } from "@/lib/faq";
import { products } from "@/lib/products";
import { site, whatsappLink } from "@/lib/site";

const bySlug = (slug: string) => products.find((p) => p.slug === slug)!;

const pillars = [
  {
    title: "Saling terhubung",
    body: "Produk Tap dirancang berbagi data. Penjualan dari TapOrder bisa mengalir ke stok dan pembukuan tanpa input ulang.",
    icon: "M8 7a3 3 0 1 0-6 0 3 3 0 0 0 6 0zM22 17a3 3 0 1 0-6 0 3 3 0 0 0 6 0zM8 7h5a3 3 0 0 1 3 3v4",
  },
  {
    title: "Mulai dari satu produk",
    body: "Pakai yang kamu butuhkan sekarang. Tambah produk lain saat usahamu berkembang, tanpa pindah sistem.",
    icon: "M12 5v14M5 12h14",
  },
  {
    title: "Dibuat untuk Indonesia",
    body: "Berbahasa Indonesia, memakai Rupiah, dan mendukung QRIS, e-wallet, serta virtual account bank lokal.",
    icon: "M4 21V4M4 4h12l-2 4 2 4H4",
  },
  {
    title: "Pembayaran lewat mitra berlisensi",
    body: "Uang pelanggan diproses payment gateway berlisensi dan masuk ke saldo usahamu sendiri, bukan ke rekening kami.",
    icon: "M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6zM9 12l2 2 4-4",
  },
];

const industries = [
  { img: "/images/usaha-cafe.jpg", alt: "Suasana cafe dengan pelanggan duduk di meja", title: "Cafe dan kedai kopi", body: "Pesanan dari meja, kasir, dan stok bahan dalam satu alur.", picks: ["taporder", "tappos", "tapstock"] },
  { img: "/images/usaha-restoran.jpg", alt: "Rumah makan dengan beberapa meja makan", title: "Restoran", body: "Pesanan per meja, reservasi, dan jadwal karyawan tetap rapi saat ramai.", picks: ["taporder", "tapreserve", "tapstaff"] },
  { img: "/images/usaha-toko.jpg", alt: "Etalase toko kecil dengan pemilik di balik meja kasir", title: "Toko dan UMKM", body: "Kasir, stok barang, dan pembukuan untuk usaha yang dikelola sendiri.", picks: ["tappos", "tapstock", "tapbooks"] },
];

const missions = [
  "Membuat software bisnis yang mudah dipakai tanpa pelatihan panjang.",
  "Menjaga harga tetap terjangkau untuk usaha kecil dan menengah.",
  "Menghubungkan penjualan, keuangan, dan operasional dalam satu ekosistem.",
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(55%_45%_at_50%_0%,rgba(27,91,255,0.28),transparent_70%),radial-gradient(30%_30%_at_15%_60%,rgba(56,200,248,0.10),transparent_70%)]" />
        <div className="mx-auto max-w-page px-4 pb-16 pt-14 text-center sm:px-6 sm:pt-24">
          <h1 className="mx-auto max-w-4xl text-balance text-[2.5rem] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-6xl lg:text-7xl">
            Software yang saling terhubung untuk usaha Indonesia.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-8 text-muted">
            TapHub menyediakan rangkaian aplikasi untuk penjualan, keuangan, operasional, dan gaya hidup. Mulai dari satu produk, tambah yang lain saat usahamu berkembang.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <a href={whatsappLink("Halo TapHub, saya mau tanya soal produk TapHub.")} target="_blank" rel="noopener noreferrer" className="btn-tide">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .3-3.4-.7-2.9-1.2-4.7-4.1-4.9-4.3-.1-.2-1.2-1.6-1.2-3s.7-2.2 1-2.5c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.4.6-.4.5c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.2.5.1.7-.1l.9-1.1c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.5.3.1.2.1.7-.1 1.2z" /></svg>
              Chat lewat WhatsApp
            </a>
            <Link href="/#produk" className="btn-ghost">Lihat produk TapHub</Link>
          </div>
          <div className="mt-16 sm:mt-20">
            <Ecosystem />
          </div>
        </div>
      </section>

      {/* PRODUK */}
      <section id="produk" aria-labelledby="produk-judul" className="border-t border-line">
        <div className="mx-auto max-w-page px-4 py-20 sm:px-6 sm:py-28">
          <div className="max-w-2xl">
            <h2 id="produk-judul" className="text-balance text-3xl font-semibold tracking-[-0.02em] sm:text-5xl">
              Produk TapHub
            </h2>
            <p className="mt-5 text-lg leading-8 text-muted">
              Setiap produk menangani satu pekerjaan dengan baik. Kami merilisnya bertahap, dimulai dari TapOrder.
            </p>
          </div>
          <div className="mt-12">
            <ProductGrid />
          </div>
        </div>
      </section>

      {/* KEUNGGULAN */}
      <section id="keunggulan" aria-labelledby="keunggulan-judul" className="relative overflow-hidden border-t border-line">
        <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-10 -z-10 h-[460px] w-[460px] rounded-full bg-tide-2/15 blur-[120px]" />
        <div className="mx-auto grid max-w-page gap-14 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1fr_1.4fr]">
          <h2 id="keunggulan-judul" className="text-balance text-3xl font-semibold tracking-[-0.02em] sm:text-5xl">
            Kenapa usaha memilih TapHub
          </h2>
          <ul className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
            {pillars.map((p) => (
              <li key={p.title} className="border-t border-line pt-6">
                <span aria-hidden="true" className="grid h-10 w-10 place-items-center rounded-xl border border-tide-1/30 bg-tide-2/10">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38C8F8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={p.icon} /></svg>
                </span>
                <h3 className="mt-5 text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 leading-7 text-muted">{p.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* INDUSTRI */}
      <section id="industri" aria-labelledby="industri-judul" className="border-t border-line">
        <div className="mx-auto max-w-page px-4 py-20 sm:px-6 sm:py-28">
          <h2 id="industri-judul" className="max-w-2xl text-balance text-3xl font-semibold tracking-[-0.02em] sm:text-5xl">
            Solusi untuk setiap jenis usaha
          </h2>
          <ul className="mt-12 grid gap-6 md:grid-cols-3">
            {industries.map((ind) => (
              <li key={ind.title} className="overflow-hidden rounded-3xl border border-line bg-panel">
                <Image src={ind.img} alt={ind.alt} width={1200} height={900} sizes="(min-width: 768px) 33vw, 100vw" className="aspect-[4/3] w-full object-cover" />
                <div className="p-6">
                  <h3 className="text-lg font-semibold">{ind.title}</h3>
                  <p className="mt-2 leading-7 text-muted">{ind.body}</p>
                  <ul className="mt-5 flex flex-wrap gap-2" aria-label={`Produk untuk ${ind.title}`}>
                    {ind.picks.map((slug) => {
                      const p = bySlug(slug);
                      const chip = (
                        <>
                          <ProductIcon product={p} size={20} />
                          {p.name}
                        </>
                      );
                      return (
                        <li key={slug}>
                          {p.href ? (
                            <Link href={p.href} className="inline-flex items-center gap-2 rounded-full border border-tide-1/30 py-1 pl-1 pr-3 text-xs font-medium text-fg hover:border-tide-1/60">{chip}</Link>
                          ) : (
                            <span className="inline-flex items-center gap-2 rounded-full border border-line py-1 pl-1 pr-3 text-xs text-muted">{chip}</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* TENTANG */}
      <section id="tentang" aria-labelledby="tentang-judul" className="border-t border-line">
        <div className="mx-auto grid max-w-page gap-14 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <h2 id="tentang-judul" className="text-balance text-3xl font-semibold tracking-[-0.02em] sm:text-5xl">
              Tentang TapHub
            </h2>
            <div className="mt-6 max-w-2xl space-y-5 text-lg leading-8 text-muted">
              <p>
                Banyak usaha di Indonesia masih mencatat pesanan di kertas, menghitung stok dengan perkiraan, dan merekap keuangan di akhir bulan. Software yang ada sering terlalu rumit atau terlalu mahal untuk usaha kecil.
              </p>
              <p>
                TapHub hadir untuk mengubah itu: rangkaian aplikasi yang sederhana, terjangkau, dan saling terhubung, sehingga pemilik usaha bisa fokus melayani pelanggan.
              </p>
            </div>
            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              <div>
                <h3 className="font-semibold">Visi</h3>
                <p className="mt-2 leading-7 text-muted">Menjadi ekosistem software pilihan usaha kecil dan menengah di Indonesia.</p>
              </div>
              <div>
                <h3 className="font-semibold">Misi</h3>
                <ul className="mt-2 space-y-2 leading-7 text-muted">
                  {missions.map((m) => (
                    <li key={m} className="flex gap-3">
                      <span aria-hidden="true" className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-tide-1" />
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <dl className="self-start rounded-[28px] border border-line bg-panel p-7 sm:p-8">
            {[
              ["Perusahaan", site.company.legalName],
              ["Berdiri", "2026"],
              ["Kantor", "Jakarta Selatan, DKI Jakarta"],
              ["Fokus", "Software untuk usaha kecil dan menengah"],
              ["Produk pertama", "TapOrder (program pilot)"],
            ].map(([k, v], i) => (
              <div key={k} className={`flex flex-col gap-1 py-4 sm:flex-row sm:justify-between sm:gap-6 ${i > 0 ? "border-t border-line" : "pt-0"}`}>
                <dt className="text-sm text-muted">{k}</dt>
                <dd className="font-medium sm:text-right">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" aria-labelledby="faq-judul" className="border-t border-line">
        <div className="mx-auto grid max-w-page gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <h2 id="faq-judul" className="text-3xl font-semibold tracking-[-0.02em] sm:text-5xl">Pertanyaan yang sering ditanyakan</h2>
            <p className="mt-5 leading-7 text-muted">
              Belum terjawab?{" "}
              <a href={whatsappLink("Halo TapHub, saya mau bertanya.")} target="_blank" rel="noopener noreferrer" className="text-tide-1 underline underline-offset-4">
                Tanya lewat WhatsApp
              </a>
              .
            </p>
          </div>
          <FaqList items={companyFaqs} />
        </div>
      </section>

      {/* KONTAK */}
      <section id="kontak" aria-labelledby="kontak-judul" className="relative overflow-hidden border-t border-line">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[420px] bg-[radial-gradient(50%_70%_at_50%_100%,rgba(27,91,255,0.28),transparent_70%)]" />
        <div className="mx-auto grid max-w-page gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <h2 id="kontak-judul" className="text-balance text-3xl font-semibold tracking-[-0.02em] sm:text-5xl">
              Ceritakan usahamu ke kami.
            </h2>
            <p className="mt-5 max-w-md text-lg leading-8 text-muted">
              Kami bantu pilih produk TapHub yang paling sesuai. Isi formulir, lalu kami balas lewat WhatsApp.
            </p>
            <dl className="mt-10 space-y-4 text-sm">
              <div>
                <dt className="text-muted">Email</dt>
                <dd className="mt-1"><a href={`mailto:${site.email}`} className="underline underline-offset-4">{site.email}</a></dd>
              </div>
              <div>
                <dt className="text-muted">Kantor</dt>
                <dd className="mt-1 leading-6">{site.company.address.join(", ")}</dd>
              </div>
            </dl>
          </div>
          <div className="rounded-[28px] border border-line bg-panel/80 p-6 backdrop-blur sm:p-8">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
