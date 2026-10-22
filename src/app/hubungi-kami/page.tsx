import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import { site, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Hubungi Kami",
  description:
    "Konsultasikan kebutuhan usahamu dengan tim TapHub. Kami bantu pilih produk yang paling sesuai, lalu dampingi pendaftaran dan pengaturan awal.",
  alternates: { canonical: "/hubungi-kami" },
  openGraph: { url: "/hubungi-kami", title: "Hubungi Kami | TapHub" },
};

const steps = [
  { title: "Ceritakan usahamu", body: "Isi formulir atau chat kami. Jelaskan jenis usaha dan kendala yang ingin diselesaikan." },
  { title: "Dapatkan rekomendasi", body: "Tim TapHub menyarankan produk yang paling sesuai dengan kebutuhan dan skala usahamu." },
  { title: "Mulai berjalan", body: "Kami bantu pendaftaran, pengaturan awal, dan pengenalan cara pakai." },
];

const contactJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Hubungi TapHub",
  url: `${site.url}/hubungi-kami`,
  mainEntity: {
    "@type": "Organization",
    name: site.name,
    legalName: site.company.legalName,
    email: site.email,
    contactPoint: { "@type": "ContactPoint", contactType: "customer support", availableLanguage: ["Indonesian"], email: site.email },
  },
};

export default function ContactPage() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(55%_45%_at_20%_0%,rgba(27,91,255,0.25),transparent_70%)]" />
      <div className="mx-auto max-w-page px-4 pt-6 sm:px-6">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-muted">
            <li><Link href="/" className="hover:text-fg">Beranda</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-fg">Hubungi kami</li>
          </ol>
        </nav>
      </div>

      <div className="mx-auto grid max-w-page gap-12 px-4 pb-24 pt-10 sm:px-6 sm:pt-16 lg:grid-cols-[1fr_1.25fr] lg:gap-16">
        <div>
          <h1 className="text-balance text-[2.5rem] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-6xl">
            Konsultasikan kebutuhan usahamu.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-8 text-muted">
            Tim TapHub siap membantu memilih produk yang tepat dan mendampingimu sampai usaha siap berjalan.
          </p>

          <ol className="mt-10 space-y-6">
            {steps.map((s, i) => (
              <li key={s.title} className="grid grid-cols-[2.5rem_1fr] gap-4">
                <span className="grid h-10 w-10 place-items-center rounded-full border border-tide-1/40 bg-tide-2/10 text-sm font-semibold text-tide-1">
                  {i + 1}
                </span>
                <div>
                  <h2 className="font-semibold">{s.title}</h2>
                  <p className="mt-1 leading-7 text-muted">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <dl className="mt-12 grid gap-6 border-t border-line pt-8 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted">WhatsApp</dt>
              <dd className="mt-1">
                <a href={whatsappLink("Halo TapHub, saya mau konsultasi.")} target="_blank" rel="noopener noreferrer" className="font-medium underline underline-offset-4">
                  {site.whatsappDisplay}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-muted">Email</dt>
              <dd className="mt-1">
                <a href={`mailto:${site.email}`} className="font-medium underline underline-offset-4">{site.email}</a>
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-muted">Kantor</dt>
              <dd className="mt-1 leading-6">
                <span className="block font-medium">{site.company.legalName}</span>
                {site.company.address.join(", ")}
              </dd>
            </div>
          </dl>
        </div>

        <div className="self-start rounded-[28px] border border-line bg-panel/80 p-6 backdrop-blur sm:p-8">
          <h2 className="text-xl font-semibold">Kirim pesan</h2>
          <p className="mt-2 text-sm leading-6 text-muted">Kami balas lewat WhatsApp.</p>
          <div className="mt-6">
            <ContactForm />
          </div>
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }} />
    </section>
  );
}
