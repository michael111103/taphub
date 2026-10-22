import Link from "next/link";
import Ecosystem from "@/components/Ecosystem";
import ProductGrid from "@/components/ProductGrid";
import FoundationGrid from "@/components/FoundationGrid";
import ContactForm from "@/components/ContactForm";
import FaqList from "@/components/FaqList";
import { companyFaqs } from "@/lib/faq";
import { site, whatsappLink } from "@/lib/site";

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

      {/* FONDASI / KEUNGGULAN */}
      <section id="keunggulan" aria-labelledby="keunggulan-judul" className="relative overflow-hidden border-t border-line">
        <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-10 -z-10 h-[460px] w-[460px] rounded-full bg-tide-2/15 blur-[120px]" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-40 bottom-0 -z-10 h-[420px] w-[420px] rounded-full bg-tide-1/10 blur-[120px]" />
        <div className="mx-auto max-w-page px-4 py-20 sm:px-6 sm:py-28">
          <div className="max-w-2xl">
            <h2 id="keunggulan-judul" className="text-balance text-3xl font-semibold tracking-[-0.02em] sm:text-5xl">
              Fondasi yang kuat untuk usaha yang terus tumbuh
            </h2>
            <p className="mt-5 text-lg leading-8 text-muted">
              Semua produk TapHub dibangun di atas prinsip yang sama, supaya usahamu bisa berkembang tanpa ganti sistem.
            </p>
          </div>
          <div className="mt-12">
            <FoundationGrid />
          </div>
        </div>
      </section>

      {/* TENTANG */}
      <section id="tentang" aria-labelledby="tentang-judul" className="border-t border-line">
        <div className="mx-auto grid max-w-page gap-14 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-2">
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
          </div>
          <div className="space-y-10 lg:pt-20">
            <div>
              <h3 className="text-lg font-semibold">Visi</h3>
              <p className="mt-2 text-lg leading-8 text-muted">Menjadi ekosistem software pilihan usaha kecil dan menengah di Indonesia.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Misi</h3>
              <ul className="mt-3 space-y-3 text-lg leading-8 text-muted">
                {missions.map((m) => (
                  <li key={m} className="flex gap-3">
                    <span aria-hidden="true" className="mt-3.5 h-1.5 w-1.5 shrink-0 rounded-full bg-tide-1" />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          </div>
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
