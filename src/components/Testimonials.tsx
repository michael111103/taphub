import type { Testimonial } from "@/lib/testimonials";

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

// Daftar testimoni. Tidak menampilkan apa pun jika data kosong.
export default function Testimonials({ title, items }: { title: string; items: Testimonial[] }) {
  if (items.length === 0) return null;

  return (
    <section id="testimoni" aria-labelledby="testimoni-judul" className="border-t border-line">
      <div className="mx-auto max-w-page px-4 py-20 sm:px-6 sm:py-28">
        <h2 id="testimoni-judul" className="max-w-2xl text-balance text-3xl font-semibold tracking-[-0.02em] sm:text-5xl">
          {title}
        </h2>
        <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((t) => (
            <li key={t.name + t.quote} className="flex flex-col rounded-3xl border border-line bg-panel p-6 transition hover:border-tide-1/40 sm:p-7">
              {t.rating ? (
                <p className="text-accent" aria-label={`Rating ${t.rating} dari 5`}>
                  {"★".repeat(t.rating)}
                  <span className="text-fg/15">{"★".repeat(5 - t.rating)}</span>
                </p>
              ) : null}
              <blockquote className="mt-4 flex-1 leading-7 text-fg/90">&ldquo;{t.quote}&rdquo;</blockquote>
              <div className="mt-6 flex items-center gap-3">
                <span aria-hidden="true" className="grid h-11 w-11 place-items-center rounded-full bg-tide-2/15 text-sm font-semibold text-accent ring-1 ring-tide-1/30">
                  {initials(t.name)}
                </span>
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-sm text-muted">{t.role}, {t.city}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
