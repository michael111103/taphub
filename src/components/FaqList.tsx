import type { Faq } from "@/lib/faq";

// Daftar FAQ (buka-tutup) + data terstruktur FAQPage untuk Google.
// Pertanyaan yang sedang dibuka tampil sebagai kartu tersorot.
export default function FaqList({ items }: { items: Faq[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="space-y-2">
      {items.map((f, i) => (
        <details
          key={f.q}
          open={i === 0}
          className="group rounded-2xl border border-transparent border-b-line transition-colors open:border-tide-1/30 open:bg-tide-2/[0.08] open:shadow-[0_0_40px_-20px_rgba(27,91,255,0.8)]"
        >
          <summary className="flex cursor-pointer list-none items-start gap-4 px-2 py-5 text-left font-medium sm:px-5 [&::-webkit-details-marker]:hidden">
            <svg
              aria-hidden="true"
              className="mt-1 shrink-0 text-muted transition-transform duration-300 group-open:rotate-90 group-open:text-tide-1"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M8 4l10 8-10 8z" />
            </svg>
            <span className="text-base sm:text-lg">{f.q}</span>
          </summary>
          <p className="max-w-prose px-2 pb-6 pl-[2.375rem] leading-7 text-muted sm:pl-[3.125rem] sm:pr-5">{f.a}</p>
        </details>
      ))}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
