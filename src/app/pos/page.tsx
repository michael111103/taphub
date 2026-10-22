import type { Metadata } from "next";
import Image from "next/image";
import HeroDashboard from "@/components/HeroDashboard";
import FaqList from "@/components/FaqList";
import CtaCard from "@/components/CtaCard";
import Testimonials from "@/components/Testimonials";
import { posFaqs } from "@/lib/faq";
import { posTestimonials } from "@/lib/testimonials";
import { mainHref, site, whatsappLink } from "@/lib/site";

// Landing page TapPOS. Di produksi tampil di https://pos.taphub.id (lihat src/middleware.ts).
const title = "Aplikasi Kasir & Sistem POS untuk F&B, Retail, dan Jasa";
const description =
  "TapPOS adalah aplikasi kasir dan sistem POS berbasis cloud untuk restoran, cafe, toko, dan usaha jasa. Kelola pesanan, multicabang, stok, promo, dan laporan penjualan dalam satu sistem.";

export const metadata: Metadata = {
  metadataBase: new URL(site.posUrl),
  title: { absolute: `${title} | TapPOS` },
  description,
  keywords: [
    "aplikasi kasir",
    "aplikasi POS",
    "sistem POS",
    "software kasir",
    "aplikasi kasir restoran",
    "aplikasi kasir cafe",
    "aplikasi kasir toko",
    "POS multicabang",
    "TapPOS",
  ],
  alternates: { canonical: "/" },
  openGraph: { type: "website", url: "/", title: `${title} | TapPOS`, description, siteName: "TapPOS by TapHub", locale: "id_ID" },
  twitter: { card: "summary_large_image", title: `${title} | TapPOS`, description },
};

const heroPoints = [
  "Kelola semua outlet dari satu dashboard",
  "Penjualan, stok, dan keuangan dalam satu alur",
  "Bisa diatur sesuai kebutuhan F&B, retail, dan jasa",
];

const modules = [
  {
    id: "kasir",
    title: "Kasir dan manajemen pesanan",
    img: "/images/taphubpos1.png",
    alt: "Kasir memproses pesanan pelanggan dengan aplikasi TapPOS di tablet",
    points: [
      "Proses transaksi lebih cepat dan akurat di setiap outlet.",
      "Kelola pesanan dine-in, take away, delivery, dan pesan lewat scan QR di meja dalam satu sistem.",
      "Dukung split bill, refund, serta pembayaran tunai, QRIS, e-wallet, dan kartu.",
      "Pesanan diteruskan rapi dari kasir ke dapur untuk mengurangi kesalahan.",
    ],
  },
  {
    id: "multicabang",
    title: "Pusat kendali multicabang",
    img: "/images/taphubpos2.png",
    alt: "Dashboard TapPOS menampilkan status sinkronisasi beberapa outlet",
    points: [
      "Pantau penjualan semua outlet secara real time dari satu dashboard.",
      "Bandingkan performa antarcabang dalam hitungan detik.",
      "Atur hak akses dan pantau aktivitas setiap karyawan.",
      "Samakan menu, harga, dan aturan operasional dari pusat ke seluruh outlet.",
    ],
  },
  {
    id: "laporan",
    title: "Laporan dan analisis bisnis",
    img: "/images/taphubpos3.png",
    alt: "Grafik laporan penjualan dan kinerja staf di TapPOS",
    points: [
      "Laporan penjualan dan performa outlet yang selalu terbaru.",
      "Temukan produk terlaris dan tren penjualan dengan cepat.",
      "Evaluasi kinerja staf berdasarkan data yang terukur.",
      "Ambil keputusan stok, harga, dan promo berdasarkan data.",
    ],
  },
  {
    id: "promo",
    title: "Promo dan loyalitas pelanggan",
    img: "/images/taphubpos4.png",
    alt: "Pelanggan mengumpulkan poin member melalui program loyalitas TapPOS",
    points: [
      "Atur diskon per produk atau per pesanan dengan fleksibel.",
      "Kelola member, poin, dan tingkatan loyalitas pelanggan.",
      "Dorong pelanggan kembali dan naikkan nilai transaksi rata-rata.",
      "Jadwalkan promo otomatis tanpa perlu diatur manual setiap hari.",
    ],
  },
  {
    id: "stok",
    title: "Produk dan stok",
    img: "/images/taphubpos5.png",
    alt: "Ringkasan stok barang dan peringatan stok hampir habis di TapPOS",
    points: [
      "Kelola produk, varian, dan kategori secara terpusat.",
      "Pantau stok bahan baku dan barang jadi di setiap outlet secara real time.",
      "Pindahkan stok antarcabang dengan cepat dan tercatat.",
      "Kurangi risiko kehabisan atau kelebihan stok lewat peringatan otomatis.",
    ],
  },
];

const industries = [
  {
    title: "Food & Beverage",
    body: "Sederhanakan operasional area makan dan dapur: manajemen meja, pesanan langsung ke dapur, serta pengaturan menu dan bahan baku.",
    fits: ["Restoran", "Cafe & kedai kopi", "Food court", "Quick service restaurant", "Cloud kitchen"],
    img: "/images/taphubpos6.png",
    alt: "Pemilik cafe memakai TapPOS di meja kasir",
    ask: "Halo TapHub, saya mau konsultasi TapPOS untuk usaha F&B.",
  },
  {
    title: "Retail & Jasa",
    body: "Kelola ribuan produk dan varian, pantau stok seluruh cabang secara real time, dan percepat transaksi dengan scan barcode.",
    fits: ["Fashion & pakaian", "Toko kelontong & minimarket", "Toko spesialis", "Barbershop & salon", "Apotek & klinik", "Elektronik"],
    img: "/images/taphubpos7.png",
    alt: "Pemilik toko retail memeriksa stok dengan TapPOS di laptop",
    ask: "Halo TapHub, saya mau konsultasi TapPOS untuk usaha retail atau jasa.",
  },
];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "TapPOS",
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Point of Sale",
    operatingSystem: "Web",
    description,
    url: site.posUrl,
    publisher: { "@type": "Organization", name: site.name, legalName: site.company.legalName, url: site.url },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "TapHub", item: `${site.url}/` },
      { "@type": "ListItem", position: 2, name: "TapPOS", item: `${site.posUrl}/` },
    ],
  },
];

function Check() {
  return (
    <svg className="mt-1 shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="#38C8F8" strokeOpacity="0.6" strokeWidth="1.5" />
      <path d="M8 12.5l2.5 2.5L16 9.5" stroke="#38C8F8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .3-3.4-.7-2.9-1.2-4.7-4.1-4.9-4.3-.1-.2-1.2-1.6-1.2-3s.7-2.2 1-2.5c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.4.6-.4.5c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.2.5.1.7-.1l.9-1.1c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.5.3.1.2.1.7-.1 1.2z" /></svg>
  );
}

function CtaButtons({ message }: { message: string }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <a href={whatsappLink(message)} target="_blank" rel="noopener noreferrer" className="btn-tide">
        <WhatsAppIcon />
        WhatsApp sales
      </a>
      <a href={mainHref("/hubungi-kami")} className="btn-ghost">Jadwalkan demo</a>
    </div>
  );
}

export default function TapPosPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_70%_20%,rgba(27,91,255,0.24),transparent_70%),radial-gradient(40%_40%_at_10%_0%,rgba(56,200,248,0.12),transparent_70%)]" />
        <div className="mx-auto grid max-w-page items-center gap-14 px-4 pb-20 pt-12 sm:px-6 sm:pt-20 lg:grid-cols-[1fr_1.1fr] lg:gap-10 lg:pb-28">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-tide-1/30 bg-tide-2/10 px-3 py-1.5 text-xs font-medium text-tide-1 sm:text-sm">
              Aplikasi point of sale (POS) untuk F&amp;B, retail, dan jasa
            </p>
            <h1 className="mt-6 text-balance text-[2.4rem] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-6xl">
              Aplikasi kasir dan sistem POS terpusat untuk usaha yang terus tumbuh.
            </h1>
            <p className="mt-6 max-w-xl text-pretty text-lg leading-8 text-muted">
              TapPOS menyatukan kasir di semua outlet, dari transaksi, pesanan, dan stok hingga laporan penjualan. Pantau seluruh usahamu dari satu dashboard, kapan saja dan di mana saja.
            </p>
            <ul className="mt-7 space-y-3">
              {heroPoints.map((p) => (
                <li key={p} className="flex gap-3 leading-7">
                  <Check />
                  {p}
                </li>
              ))}
            </ul>
            <div className="mt-9">
              <CtaButtons message="Halo TapHub, saya tertarik dengan TapPOS." />
            </div>
          </div>
          <HeroDashboard />
        </div>
      </section>

      {/* FITUR */}
      <section id="fitur" aria-labelledby="fitur-judul" className="border-t border-line">
        <div className="mx-auto max-w-page px-4 py-20 sm:px-6 sm:py-28">
          <div className="max-w-2xl">
            <h2 id="fitur-judul" className="text-balance text-3xl font-semibold tracking-[-0.02em] sm:text-5xl">
              Semua yang dibutuhkan kasir dan pemilik usaha
            </h2>
            <p className="mt-5 text-lg leading-8 text-muted">
              Dari meja kasir sampai laporan akhir bulan, TapPOS menangani seluruh alur penjualan dalam satu sistem.
            </p>
          </div>

          <nav aria-label="Fitur TapPOS" className="-mx-4 mt-10 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0">
            <ul className="flex gap-2 sm:flex-wrap">
              {modules.map((m) => (
                <li key={m.id} className="shrink-0">
                  <a href={`#${m.id}`} className="inline-flex rounded-full border border-line px-4 py-2 text-sm text-muted transition hover:border-tide-1/50 hover:text-fg">
                    {m.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-16 space-y-24 sm:space-y-32">
            {modules.map((m, i) => (
              <article id={m.id} key={m.id} aria-labelledby={`${m.id}-judul`} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                  <h3 id={`${m.id}-judul`} className="text-balance text-2xl font-semibold tracking-[-0.01em] sm:text-4xl">{m.title}</h3>
                  <ul className="mt-7 space-y-4">
                    {m.points.map((p) => (
                      <li key={p} className="flex gap-3 leading-7 text-fg/90">
                        <Check />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <CtaButtons message={`Halo TapHub, saya mau tanya fitur ${m.title.toLowerCase()} di TapPOS.`} />
                  </div>
                </div>
                <div className={`relative ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                  <div aria-hidden="true" className="pointer-events-none absolute -inset-6 -z-10 rounded-full bg-tide-2/15 blur-3xl" />
                  <div className="overflow-hidden rounded-[28px] border border-line bg-panel p-2">
                    <Image
                      src={m.img}
                      alt={m.alt}
                      width={1200}
                      height={900}
                      sizes="(min-width: 1024px) 45vw, 100vw"
                      className="aspect-[4/3] w-full rounded-[22px] object-cover"
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* INDUSTRI */}
      <section id="industri" aria-labelledby="industri-judul" className="relative overflow-hidden border-t border-line">
        <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-20 -z-10 h-[480px] w-[480px] rounded-full bg-tide-2/15 blur-[120px]" />
        <div className="mx-auto max-w-page px-4 py-20 sm:px-6 sm:py-28">
          <div className="max-w-2xl">
            <h2 id="industri-judul" className="text-balance text-3xl font-semibold tracking-[-0.02em] sm:text-5xl">
              Sistem POS yang dirancang untuk F&amp;B dan retail
            </h2>
            <p className="mt-5 text-lg leading-8 text-muted">
              TapPOS dibangun mengikuti alur kerja nyata di industrimu, bukan sekadar mesin kasir.
            </p>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {industries.map((ind) => (
              <article key={ind.title} className="flex flex-col overflow-hidden rounded-[28px] border border-line bg-panel transition hover:border-tide-1/40">
                <div className="p-7 sm:p-9">
                  <h3 className="text-2xl font-semibold sm:text-3xl">{ind.title}</h3>
                  <p className="mt-3 leading-7 text-muted">{ind.body}</p>
                  <p className="mt-7 text-sm text-muted">Cocok untuk</p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {ind.fits.map((f) => (
                      <li key={f} className="rounded-full bg-tide-2/10 px-3 py-1.5 text-sm text-fg ring-1 ring-tide-1/25">{f}</li>
                    ))}
                  </ul>
                  <a href={whatsappLink(ind.ask)} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex text-sm font-semibold text-tide-1 underline underline-offset-4">
                    Konsultasikan untuk usaha {ind.title}
                  </a>
                </div>
                <div className="mt-auto px-2 pb-2">
                  <Image src={ind.img} alt={ind.alt} width={1200} height={800} sizes="(min-width: 1024px) 45vw, 100vw" className="aspect-[3/2] w-full rounded-[22px] object-cover" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONI: otomatis tampil setelah src/lib/testimonials.ts diisi testimoni asli */}
      <Testimonials title="Kata pemilik usaha yang memakai TapPOS" items={posTestimonials} />

      {/* FAQ */}
      <section id="faq" aria-labelledby="faq-judul" className="border-t border-line">
        <div className="mx-auto grid max-w-page gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <h2 id="faq-judul" className="text-3xl font-semibold tracking-[-0.02em] sm:text-5xl">FAQ seputar TapPOS</h2>
            <p className="mt-5 leading-7 text-muted">
              Belum terjawab?{" "}
              <a href={whatsappLink("Halo TapHub, saya mau bertanya soal TapPOS.")} target="_blank" rel="noopener noreferrer" className="text-tide-1 underline underline-offset-4">
                Tanya lewat WhatsApp
              </a>
              .
            </p>
          </div>
          <FaqList items={posFaqs} />
        </div>
      </section>

      {/* AJAKAN KONSULTASI */}
      <section aria-label="Konsultasi TapPOS" className="border-t border-line">
        <div className="mx-auto max-w-page px-4 py-20 sm:px-6 sm:py-28">
          <CtaCard
            title="Siap merapikan kasir di semua outletmu?"
            body="Konsultasikan kebutuhan usahamu dan jadwalkan demo TapPOS bersama tim kami."
          />
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
