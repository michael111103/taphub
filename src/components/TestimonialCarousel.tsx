"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Testimonial } from "@/lib/testimonials";

const INTERVAL = 5500; // ms per slide

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter((w) => /[A-Za-z]/.test(w[0] ?? ""))
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

/**
 * Carousel testimoni: berganti otomatis dengan efek fade (mulai jalan saat ada 2 testimoni atau lebih),
 * berhenti sebentar saat disentuh/di-hover, bisa digeser (swipe) di HP, dan punya titik navigasi.
 * Jika pengunjung mengaktifkan "kurangi gerakan", carousel tidak berjalan otomatis.
 */
export default function TestimonialCarousel({
  id = "testimoni",
  title,
  description,
  items,
  isSample = false,
}: {
  id?: string;
  title: string;
  description?: string;
  items: Testimonial[];
  isSample?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const touchX = useRef<number | null>(null);
  const count = items.length;

  const go = useCallback((i: number) => setIndex(((i % count) + count) % count), [count]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const autoplay = count > 1 && !paused && !reduced;
  useEffect(() => {
    if (!autoplay) return;
    const t = window.setTimeout(() => go(index + 1), INTERVAL);
    return () => window.clearTimeout(t);
  }, [autoplay, index, go]);

  if (count === 0) return null;

  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
    setPaused(true);
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current !== null) {
      const dx = e.changedTouches[0].clientX - touchX.current;
      if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
    }
    touchX.current = null;
    setPaused(false);
  };

  return (
    <section id={id} aria-labelledby={`${id}-judul`} className="relative overflow-hidden border-t border-line">
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-10 -z-10 h-[460px] w-[460px] rounded-full bg-tide-2/10 blur-[120px]" />
      <div className="mx-auto grid max-w-page items-center gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <div>
          {isSample && (
            <p className="mb-5 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
              Pratinjau desain: semua testimoni di bawah adalah contoh
            </p>
          )}
          <h2 id={`${id}-judul`} className="text-balance text-3xl font-semibold tracking-[-0.02em] sm:text-5xl">{title}</h2>
          {description && <p className="mt-5 max-w-md text-lg leading-8 text-muted">{description}</p>}

        </div>

        <div
          role="region"
          aria-roledescription="carousel"
          aria-label={title}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Semua slide ditumpuk di sel grid yang sama, jadi tinggi kartu mengikuti testimoni terpanjang */}
          <div className="grid" aria-live={autoplay ? "off" : "polite"}>
            {items.map((t, i) => {
              const active = i === index;
              return (
                <figure
                  key={t.name + i}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} dari ${count}`}
                  aria-hidden={!active}
                  className={`relative flex flex-col rounded-[28px] border border-line bg-raised p-7 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.35)] transition-all duration-700 ease-out [grid-area:1/1] sm:p-10 ${
                    active ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-3 scale-[0.98] opacity-0"
                  }`}
                >
                  <svg aria-hidden="true" className="absolute right-7 top-6 text-tide-2/10 sm:right-10 sm:top-8" width="72" height="72" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10 7H6a3 3 0 0 0-3 3v4h5v-4H5.5A1.5 1.5 0 0 1 7 8.5h3zm10 0h-4a3 3 0 0 0-3 3v4h5v-4h-2.5A1.5 1.5 0 0 1 17 8.5h3z" />
                  </svg>
                  {isSample && (
                    <span className="mb-4 self-start rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">Contoh</span>
                  )}
                  {t.rating ? (
                    <p className="text-lg tracking-widest text-amber-400" aria-label={`Rating ${t.rating} dari 5`}>
                      {"★".repeat(t.rating)}
                      <span className="text-fg/15">{"★".repeat(5 - t.rating)}</span>
                    </p>
                  ) : null}
                  <blockquote className="mt-5 flex-1 text-balance text-xl font-medium leading-relaxed tracking-[-0.01em] sm:text-2xl">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-8 flex items-center gap-4">
                    <span aria-hidden="true" className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-tide-1 to-tide-2 text-sm font-semibold text-white">
                      {initials(t.name) || "?"}
                    </span>
                    <span>
                      <span className="block font-semibold">{t.name}</span>
                      <span className="block text-sm text-muted">{[t.role, t.city].filter(Boolean).join(", ")}</span>
                    </span>
                  </figcaption>
                </figure>
              );
            })}
          </div>

          {count > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2" role="tablist" aria-label="Pilih testimoni">
              {items.map((t, i) => {
                const active = i === index;
                return (
                  <button
                    key={t.name + i}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    aria-label={`Testimoni ${i + 1}`}
                    onClick={() => go(i)}
                    className={`relative h-2 overflow-hidden rounded-full transition-all duration-300 ${active ? "w-10 bg-tide-2/20" : "w-2 bg-fg/15 hover:bg-fg/30"}`}
                  >
                    {active && (
                      <span
                        key={`${index}-${autoplay}`}
                        className="absolute inset-y-0 left-0 rounded-full bg-tide-2"
                        style={autoplay ? { animation: `carousel-progress ${INTERVAL}ms linear forwards` } : { width: "100%" }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
