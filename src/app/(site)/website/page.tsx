import type { Metadata } from "next";
import Image from "next/image";
import HeroWebsite from "@/components/HeroWebsite";
import FaqList from "@/components/FaqList";
import CtaCard from "@/components/CtaCard";
import Testimonials from "@/components/Testimonials";
import { websiteFaqs } from "@/lib/faq";
import { websiteTestimonials } from "@/lib/testimonials";
import { site, whatsappLink } from "@/lib/site";

// Landing page TapWebsite. Di produksi tampil di https://website.taphub.id (lihat src/middleware.ts).
const title = "Jasa Pembuatan Website Usaha: Landing Page, Company Profile, Toko Online";
const description =
  "TapWebsite dari TapHub membuatkan website profesional untuk usahamu: landing page, company profile, dan toko online. Sudah termasuk domain, hosting, SSL, desain ramah HP, dan SEO dasar.";

export const metadata: Metadata = {
  metadataBase: new URL(site.websiteUrl),
  title: { absolute: `${title} | TapWebsite` },
  description,
  keywords: [
    "jasa pembuatan website",
    "jasa website usaha",
    "bikin website toko online",
    "jasa landing page",
    "website company profile",
    "jasa website UMKM",
    "TapWebsite",
  ],
  alternates: { canonical: "/" },
  openGraph: { type: "website", url: "/", title: `${title} | TapWebsite`, description, siteName: "TapWebsite by TapHub", locale: "id_ID" },
  twitter: { card: "summary_large_image", title: `${title} | TapWebsite`, description },
};

const heroPoints = [
  "Domain, hosting, dan SSL tahun pertama sudah termasuk",
  "Desain rapi di HP, tablet, dan laptop",
  "Dikerjakan tim TapHub sampai website online",
];

/** Jenis website. Gambar masih sementara, lihat README bagian "Gambar yang perlu diganti". */
const kinds = [
  {
    title: "Landing page",
    body: "Satu halaman yang fokus menjual satu produk atau promo, lengkap dengan tombol pesan langsung ke WhatsApp.",
    fits: ["Promo produk", "Iklan Instagram & TikTok", "Event"],
    img: "/images/tapwebsite1.png",
    alt: "Contoh landing page produk buatan TapWebsite di laptop dan HP",
  },
  {
    title: "Company profile",
    body: "Kenalkan usahamu dengan halaman tentang, layanan, galeri, lokasi, dan blog supaya calon pelanggan makin percaya.",
    fits: ["Perusahaan & CV", "Klinik & jasa", "Kontraktor"],
    img: "/images/tapwebsite2.png",
    alt: "Contoh website company profile perusahaan buatan TapWebsite",
  },
  {
    title: "Toko online",
    body: "Katalog produk, keranjang belanja, ongkos kirim, dan pembayaran online, tanpa potongan komisi marketplace.",
    fits: ["Fashion", "Makanan kemasan", "Kosmetik", "Elektronik"],
    img: "/images/tapwebsite3.png",
    alt: "Contoh toko online dengan katalog produk dan keranjang belanja",
  },
  {
    title: "Menu digital & katalog",
    body: "Menu cafe atau katalog jasa yang bisa dibuka lewat scan QR, gampang diperbarui kapan saja.",
    fits: ["Cafe & restoran", "Barbershop & salon", "Laundry"],
    img: "/images/tapwebsite4.png",
    alt: "Contoh menu digital cafe yang dibuka dari scan QR di meja",
  },
];

const included = [
  { title: "Domain & hosting", body: "Alamat .com atau .id dan server yang cepat untuk tahun pertama.", icon: "M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18z" },
  { title: "SSL (https)", body: "Gembok di browser supaya pengunjung merasa aman.", icon: "M6 11h12v10H6zM9 11V8a3 3 0 0 1 6 0v3" },
  { title: "Ramah HP", body: "Tampilan menyesuaikan layar, karena kebanyakan pembeli membuka dari HP.", icon: "M8 3h8v18H8zM11 18h2" },
  { title: "SEO dasar", body: "Judul, deskripsi, sitemap, dan kecepatan halaman diatur supaya mudah ditemukan Google.", icon: "M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14zM20 20l-4-4" },
  { title: "WhatsApp & Google Maps", body: "Tombol chat langsung dan peta lokasi usahamu.", icon: "M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11zM12 8a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" },
  { title: "Kelola sendiri", body: "Ganti teks, foto, produk, dan artikel tanpa harus bisa coding.", icon: "M4 20h4L19 9l-4-4L4 16zM13 7l4 4" },
];

/** Urutan kerja. Penomoran dipakai karena memang berurutan. */
const steps = [
  { title: "Pilih paket", body: "Pilih paket yang sesuai, lalu selesaikan pembayaran." },
  { title: "Kirim materi", body: "Kirim logo, foto, deskripsi usaha, dan contoh website yang kamu suka." },
  { title: "Desain & revisi", body: "Kami kirim rancangan awal. Kamu cek, minta revisi, sampai cocok." },
  { title: "Website online", body: "Website tayang di domainmu, lengkap dengan akses untuk mengelolanya." },
];

/*
 * HARGA DRAFT: konfirmasi angka dan isi paket sebelum diumumkan.
 * Setelah payment gateway tersambung, ganti `order` dengan link checkout.
 */
const plans = [
  {
    id: "landing",
    name: "Landing Page",
    price: "Rp1.490.000",
    note: "sekali bayar",
    eta: "± 5 hari kerja",
    highlight: false,
    points: ["1 halaman panjang", "Domain .com/.id, hosting & SSL 1 tahun", "Tombol WhatsApp & form kontak", "SEO dasar", "2x revisi"],
  },
  {
    id: "company",
    name: "Company Profile",
    price: "Rp3.490.000",
    note: "sekali bayar",
    eta: "± 10 hari kerja",
    highlight: true,
    points: ["Hingga 6 halaman + blog", "Domain .com/.id, hosting & SSL 1 tahun", "Google Maps & galeri foto", "Email bisnis (nama@usahamu.com)", "SEO dasar", "3x revisi"],
  },
  {
    id: "toko",
    name: "Toko Online",
    price: "Rp6.990.000",
    note: "sekali bayar",
    eta: "± 14 hari kerja",
    highlight: false,
    points: ["Katalog hingga 100 produk", "Keranjang, ongkir & checkout", "Pembayaran online (QRIS, VA, e-wallet)", "Domain, hosting & SSL 1 tahun", "Dashboard pesanan", "3x revisi"],
  },
];

const payMethods = ["QRIS", "Virtual Account", "E-wallet", "Kartu"];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "TapWebsite",
    serviceType: "Jasa pembuatan website",
    description,
    url: site.websiteUrl,
    areaServed: "ID",
    provider: { "@type": "Organization", name: site.name, legalName: site.company.legalName, url: site.url },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "TapHub", item: `${site.url}/` },
      { "@type": "ListItem", position: 2, name: "TapWebsite", item: `${site.websiteUrl}/` },
    ],
  },
];

function Check() {
  return (
    <svg className="mt-1 shrink-0 text-accent" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.5" />
      <path d="M8 12.5l2.5 2.5L16 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .3-3.4-.7-2.9-1.2-4.7-4.1-4.9-4.3-.1-.2-1.2-1.6-1.2-3s.7-2.2 1-2.5c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.4.6-.4.5c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.2.5.1.7-.1l.9-1.1c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.5.3.1.2.1.7-.1 1.2z" /></svg>
  );
}

export default function TapWebsitePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_70%_20%,rgba(45,212,191,0.18),transparent_70%),radial-gradient(40%_40%_at_10%_0%,rgba(27,91,255,0.14),transparent_70%)]" />
        <div className="mx-auto grid max-w-page items-center gap-16 px-4 pb-24 pt-12 sm:px-6 sm:pt-20 lg:grid-cols-[1fr_1.1fr] lg:gap-10 lg:pb-28">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-tide-1/30 bg-tide-2/10 px-3 py-1.5 text-xs font-medium text-accent sm:text-sm">
              TapWebsite · jasa pembuatan website untuk usaha
            </p>
            <h1 className="mt-6 text-balance text-[2.4rem] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-6xl">
              Website profesional untuk usahamu, siap online dalam hitungan hari.
            </h1>
            <p className="mt-6 max-w-xl text-pretty text-lg leading-8 text-muted">
              Pilih paket, kirim materi, dan tim TapHub yang mengerjakan desain, domain, sampai website tayang. Kamu tinggal fokus melayani pelanggan.
            </p>
            <ul className="mt-7 space-y-3">
              {heroPoints.map((p) => (
                <li key={p} className="flex gap-3 leading-7">
                  <Check />
                  {p}
                </li>
              ))}
            </ul>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href="#paket" className="btn-tide">Lihat paket &amp; harga</a>
              <a href={whatsappLink("Halo TapHub, saya mau konsultasi pembuatan website (TapWebsite).")} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                <WhatsAppIcon />
                Konsultasi gratis
              </a>
            </div>
          </div>
          <HeroWebsite />
        </div>
      </section>

      {/* JENIS WEBSITE */}
      <section id="jenis" aria-labelledby="jenis-judul" className="border-t border-line">
        <div className="mx-auto max-w-page px-4 py-20 sm:px-6 sm:py-28">
          <div className="max-w-2xl">
            <h2 id="jenis-judul" className="text-balance text-3xl font-semibold tracking-[-0.02em] sm:text-5xl">Website sesuai kebutuhan usahamu</h2>
            <p className="mt-5 text-lg leading-8 text-muted">Dari satu halaman promo sampai toko online lengkap, semuanya dibuat khusus untuk usahamu, bukan template asal pakai.</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {kinds.map((k) => (
              <article key={k.title} className="flex flex-col overflow-hidden rounded-[28px] border border-line bg-panel transition hover:border-tide-1/40">
                <div className="px-2 pt-2">
                  <Image src={k.img} alt={k.alt} width={1200} height={900} sizes="(min-width: 768px) 45vw, 100vw" className="aspect-[4/3] w-full rounded-[22px] object-cover" />
                </div>
                <div className="p-7 sm:p-8">
                  <h3 className="text-2xl font-semibold">{k.title}</h3>
                  <p className="mt-3 leading-7 text-muted">{k.body}</p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {k.fits.map((f) => (
                      <li key={f} className="rounded-full bg-tide-2/10 px-3 py-1.5 text-sm text-fg ring-1 ring-tide-1/25">{f}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SUDAH TERMASUK */}
      <section id="termasuk" aria-labelledby="termasuk-judul" className="border-t border-line">
        <div className="mx-auto max-w-page px-4 py-20 sm:px-6 sm:py-28">
          <div className="max-w-2xl">
            <h2 id="termasuk-judul" className="text-balance text-3xl font-semibold tracking-[-0.02em] sm:text-5xl">Semua paket sudah termasuk</h2>
            <p className="mt-5 text-lg leading-8 text-muted">Tidak perlu sewa hosting atau cari programmer sendiri. Yang kamu butuhkan supaya website jalan sudah kami siapkan.</p>
          </div>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {included.map((f) => (
              <li key={f.title} className="rounded-3xl border border-line bg-panel p-6">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-[#2DD4BF] to-[#0F766E] text-white">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={f.icon} /></svg>
                </span>
                <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-muted">{f.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* PROSES */}
      <section id="proses" aria-labelledby="proses-judul" className="border-t border-line">
        <div className="mx-auto max-w-page px-4 py-20 sm:px-6 sm:py-28">
          <h2 id="proses-judul" className="max-w-2xl text-balance text-3xl font-semibold tracking-[-0.02em] sm:text-5xl">Empat langkah sampai website online</h2>
          <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.title} className="relative rounded-3xl border border-line bg-panel p-6">
                <span className="font-display text-sm font-semibold text-accent">Langkah {i + 1}</span>
                <h3 className="mt-3 text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* PAKET */}
      <section id="paket" aria-labelledby="paket-judul" className="relative overflow-hidden border-t border-line">
        <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-24 -z-10 h-[480px] w-[480px] rounded-full bg-tide-2/15 blur-[120px]" />
        <div className="mx-auto max-w-page px-4 py-20 sm:px-6 sm:py-28">
          <div className="max-w-2xl">
            <h2 id="paket-judul" className="text-balance text-3xl font-semibold tracking-[-0.02em] sm:text-5xl">Paket TapWebsite</h2>
            <p className="mt-5 text-lg leading-8 text-muted">Harga sekali bayar untuk pembuatan dan tahun pertama. Butuh fitur khusus? Konsultasikan dulu, gratis.</p>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {plans.map((p) => (
              <article
                key={p.id}
                id={`paket-${p.id}`}
                className={`relative flex flex-col rounded-[28px] border p-7 sm:p-8 ${
                  p.highlight ? "border-tide-1/50 bg-gradient-to-b from-tide-2/[0.14] to-panel shadow-[0_20px_60px_-30px_rgba(27,91,255,0.6)]" : "border-line bg-panel"
                }`}
              >
                {p.highlight && <span className="absolute -top-3 left-7 rounded-full bg-gradient-to-r from-tide-1 to-tide-2 px-3 py-1 text-xs font-semibold text-white">Paling dipilih</span>}
                <h3 className="text-xl font-semibold">{p.name}</h3>
                <p className="mt-4 font-display text-4xl font-semibold tracking-[-0.02em]">{p.price}</p>
                <p className="mt-1 text-sm text-muted">{p.note} · selesai {p.eta}</p>
                <ul className="mt-6 space-y-3">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex gap-3 text-sm leading-6">
                      <Check />
                      {pt}
                    </li>
                  ))}
                </ul>
                <a
                  href={whatsappLink(`Halo TapHub, saya mau pesan paket ${p.name} (TapWebsite).`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-8 ${p.highlight ? "btn-tide" : "btn-ghost"} justify-center`}
                >
                  Pesan paket {p.name}
                </a>
              </article>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-4 rounded-3xl border border-line bg-panel p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold">Bayar online lewat payment gateway</p>
              <p className="mt-1 text-sm leading-6 text-muted">Pembayaran langsung di halaman ini segera hadir. Sementara itu, pemesanan dan pembayaran dibantu tim kami lewat WhatsApp.</p>
            </div>
            <ul className="flex flex-wrap gap-2">
              {payMethods.map((m) => (
                <li key={m} className="rounded-full border border-line px-3 py-1.5 text-sm text-muted">{m}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* TESTIMONI: otomatis tampil setelah websiteTestimonials di src/lib/testimonials.ts diisi testimoni asli */}
      <Testimonials title="Kata pemilik usaha yang websitenya dibuat TapWebsite" items={websiteTestimonials} />

      {/* FAQ */}
      <section id="faq" aria-labelledby="faq-judul" className="border-t border-line">
        <div className="mx-auto grid max-w-page gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <h2 id="faq-judul" className="text-3xl font-semibold tracking-[-0.02em] sm:text-5xl">FAQ seputar TapWebsite</h2>
            <p className="mt-5 leading-7 text-muted">
              Belum terjawab?{" "}
              <a href={whatsappLink("Halo TapHub, saya mau bertanya soal TapWebsite.")} target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-4">
                Tanya lewat WhatsApp
              </a>
              .
            </p>
          </div>
          <FaqList items={websiteFaqs} />
        </div>
      </section>

      {/* AJAKAN */}
      <section aria-label="Konsultasi TapWebsite" className="border-t border-line">
        <div className="mx-auto max-w-page px-4 py-20 sm:px-6 sm:py-28">
          <CtaCard
            title="Siap punya website sendiri untuk usahamu?"
            body="Ceritakan usahamu, kami bantu pilih paket yang pas. Konsultasi gratis, tanpa kewajiban."
            href={whatsappLink("Halo TapHub, saya mau konsultasi pembuatan website (TapWebsite).")}
            cta="Konsultasi via WhatsApp"
          />
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}

