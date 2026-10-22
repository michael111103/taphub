import Image from "next/image";
import Link from "next/link";
import HeroDashboard from "@/components/HeroDashboard";
import Ecosystem from "@/components/Ecosystem";
import ProductGrid from "@/components/ProductGrid";
import PhoneMenu from "@/components/PhoneMenu";
import ContactForm from "@/components/ContactForm";
import { faqs } from "@/lib/faq";
import { site, whatsappLink } from "@/lib/site";

const steps = [
  { title: "Pelanggan scan QR di meja", body: "Setiap meja punya QR sendiri, jadi nomor meja tercatat otomatis." },
  { title: "Pilih menu dari HP", body: "Menu terbuka di browser. Tidak perlu install aplikasi atau daftar akun." },
  { title: "Bayar langsung", body: "QRIS, e-wallet, atau virtual account. Pesanan baru diteruskan setelah lunas." },
  { title: "Pesanan masuk ke kasir dan dapur", body: "Dashboard berbunyi saat ada pesanan baru, lengkap dengan nomor meja." },
];

const audiences = [
  { img: "/images/usaha-cafe.jpg", alt: "Suasana cafe dengan pelanggan duduk di meja", title: "Cafe", body: "Antrean kasir berkurang saat jam ramai, pelanggan bisa pesan lagi tanpa memanggil pelayan." },
  { img: "/images/usaha-restoran.jpg", alt: "Rumah makan dengan beberapa meja makan", title: "Restoran", body: "Pesanan per meja langsung tercatat, mengurangi salah catat dari dapur ke meja." },
  { img: "/images/usaha-toko.jpg", alt: "Etalase toko kecil dengan pemilik di balik meja kasir", title: "Toko dan UMKM", body: "Mulai dari satu tablet. Produk Tap lain menyusul untuk kasir, stok, dan pembukuan." },
];

const pricingPoints = [
  "Tidak perlu mesin kasir khusus, cukup tablet atau HP",
  "Uang masuk ke saldo usahamu sendiri lewat payment gateway berlisensi",
  "QR per meja dan dashboard pesanan real time",
  "Laporan penjualan harian",
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_70%_20%,rgba(27,91,255,0.22),transparent_70%),radial-gradient(40%_40%_at_10%_0%,rgba(56,200,248,0.12),transparent_70%)]" />
        <div className="mx-auto grid max-w-page items-center gap-14 px-4 pb-20 pt-12 sm:px-6 sm:pt-20 lg:grid-cols-[1fr_1.15fr] lg:gap-10 lg:pb-28">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-panel px-3 py-1.5 text-xs text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-tide-1" />
              TapOrder sedang membuka program pilot
            </p>
            <h1 className="mt-6 text-balance text-[2.5rem] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-6xl">
              Pesanan masuk sendiri. Kamu fokus melayani.
            </h1>
            <p className="mt-6 max-w-xl text-pretty text-lg leading-8 text-muted">
              TapHub membuat software untuk usaha Indonesia. Dimulai dari TapOrder: pelanggan scan QR di meja, pesan, dan bayar dari HP. Pesanan langsung muncul di kasir.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/#kontak" className="btn-tide">Daftar program pilot</Link>
              <Link href="/#produk" className="btn-ghost">Lihat semua produk</Link>
            </div>
          </div>
          <HeroDashboard />
        </div>
      </section>

      {/* PRODUK */}
      <section id="produk" aria-labelledby="produk-judul" className="border-t border-line">
        <div className="mx-auto max-w-page px-4 py-20 sm:px-6 sm:py-28">
          <div className="max-w-2xl">
            <h2 id="produk-judul" className="text-balance text-3xl font-semibold tracking-[-0.02em] sm:text-5xl">
              Satu akun, banyak alat untuk usahamu.
            </h2>
            <p className="mt-5 text-lg leading-8 text-muted">
              Setiap produk Tap bisa dipakai sendiri, dan saling terhubung saat dipakai bersama. Data penjualan dari TapOrder nantinya otomatis mengalir ke pembukuan dan stok.
            </p>
          </div>
          <div className="mt-14">
            <Ecosystem />
          </div>
          <div className="mt-16">
            <ProductGrid />
          </div>
        </div>
      </section>

      {/* TAPORDER */}
      <section id="taporder" aria-labelledby="taporder-judul" className="relative overflow-hidden border-t border-line">
        <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-20 -z-10 h-[520px] w-[520px] rounded-full bg-tide-2/20 blur-[120px]" />
        <div className="mx-auto grid max-w-page gap-16 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 id="taporder-judul" className="text-balance text-3xl font-semibold tracking-[-0.02em] sm:text-5xl">
              TapOrder: dari meja ke dapur tanpa antre di kasir.
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

      {/* UNTUK SIAPA */}
      <section aria-labelledby="siapa-judul" className="border-t border-line">
        <div className="mx-auto max-w-page px-4 py-20 sm:px-6 sm:py-28">
          <h2 id="siapa-judul" className="max-w-2xl text-balance text-3xl font-semibold tracking-[-0.02em] sm:text-5xl">
            Dibuat untuk usaha yang sibuk melayani.
          </h2>
          <ul className="mt-12 grid gap-6 md:grid-cols-3">
            {audiences.map((a) => (
              <li key={a.title} className="overflow-hidden rounded-3xl border border-line bg-panel">
                <Image src={a.img} alt={a.alt} width={1200} height={900} sizes="(min-width: 768px) 33vw, 100vw" className="aspect-[4/3] w-full object-cover" />
                <div className="p-6">
                  <h3 className="text-lg font-semibold">{a.title}</h3>
                  <p className="mt-2 leading-7 text-muted">{a.body}</p>
                </div>
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
            <Link href="/#kontak" className="btn-tide mt-8 w-full">Daftar program pilot</Link>
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
          <div className="divide-y divide-line border-y border-line">
            {faqs.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left font-medium [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span aria-hidden="true" className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-line text-muted transition group-open:rotate-45 group-open:border-tide-1/50 group-open:text-tide-1">+</span>
                </summary>
                <p className="mt-3 max-w-prose leading-7 text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      </section>

      {/* KONTAK */}
      <section id="kontak" aria-labelledby="kontak-judul" className="relative overflow-hidden border-t border-line">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[420px] bg-[radial-gradient(50%_70%_at_50%_100%,rgba(27,91,255,0.28),transparent_70%)]" />
        <div className="mx-auto grid max-w-page gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <h2 id="kontak-judul" className="text-balance text-3xl font-semibold tracking-[-0.02em] sm:text-5xl">
              Coba TapOrder di usahamu.
            </h2>
            <p className="mt-5 max-w-md text-lg leading-8 text-muted">
              Isi formulir, lalu kami hubungi lewat WhatsApp untuk mengatur pemasangan dan QR meja.
            </p>
            <p className="mt-8 text-sm text-muted">
              Atau email ke{" "}
              <a href={`mailto:${site.email}`} className="text-fg underline underline-offset-4">{site.email}</a>
            </p>
          </div>
          <div className="rounded-[28px] border border-line bg-panel/80 p-6 backdrop-blur sm:p-8">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
