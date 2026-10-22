import Link from "next/link";

// Kartu ajakan konsultasi, dipakai di akhir halaman.
export default function CtaCard({
  title = "Siap membawa usahamu ke langkah berikutnya?",
  body = "Kurangi kerja manual, pantau usaha dari mana saja, dan ambil keputusan lebih cepat bersama TapHub.",
  href = "/hubungi-kami",
  cta = "Konsultasi sekarang",
}: {
  title?: string;
  body?: string;
  href?: string;
  cta?: string;
}) {
  return (
    <div className="relative isolate overflow-hidden rounded-[28px] border border-tide-1/30 bg-gradient-to-br from-[#0A2A6B] via-[#0B1B45] to-[#070E22] px-6 pb-20 pt-10 sm:px-12 sm:pb-24 sm:pt-14">
      {/* cahaya */}
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full bg-tide-1/25 blur-[90px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-20 bottom-0 -z-10 h-64 w-64 rounded-full bg-tide-2/30 blur-[90px]" />

      <div className="relative max-w-2xl">
        <h2 className="text-balance text-3xl font-semibold tracking-[-0.02em] text-white sm:text-5xl">{title}</h2>
        <p className="mt-4 max-w-xl text-lg leading-8 text-white/75">{body}</p>
        <Link
          href={href}
          className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-ink shadow-[0_10px_30px_-10px_rgba(56,200,248,0.8)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_40px_-10px_rgba(56,200,248,0.9)]"
        >
          {cta}
        </Link>
      </div>

      {/* gelombang dekoratif di bawah kartu */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16 w-full sm:h-20"
        viewBox="0 0 1200 80"
        preserveAspectRatio="none"
      >
        <path d="M0 62 H460 C520 62 520 40 580 40 H1200 V80 H0 Z" fill="#38C8F8" opacity="0.18" />
        <path d="M0 70 H300 C360 70 360 52 420 52 H760 C820 52 820 30 880 30 H1200 V80 H0 Z" fill="#1B5BFF" opacity="0.55" />
        <path d="M0 74 H560 C610 74 610 60 660 60 H1200 V80 H0 Z" fill="#38C8F8" opacity="0.9" />
      </svg>
    </div>
  );
}
