"use client";

import { useRef, useState } from "react";
import ProductIcon from "./ProductIcon";
import { groups, products, services, type ProductGroup } from "@/lib/products";
import { mainHref } from "@/lib/site";

// Toggle 3 tab (Software / Platform / Layanan) dengan sorotan yang bergeser.
// Bisa diklik, digeser (swipe) di HP, atau pakai tombol panah keyboard.
export default function ProductGrid() {
  const [index, setIndex] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const touchX = useRef<number | null>(null);
  const active: ProductGroup = groups[index].id;

  const go = (i: number, focus = false) => {
    const next = (i + groups.length) % groups.length;
    setIndex(next);
    if (focus) tabRefs.current[next]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); go(index + 1, true); }
    if (e.key === "ArrowLeft") { e.preventDefault(); go(index - 1, true); }
  };

  const onTouchStart = (e: React.TouchEvent) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) < 60) return;
    const next = index + (dx < 0 ? 1 : -1);
    if (next >= 0 && next < groups.length) go(next);
  };

  const list = products.filter((p) => p.group === active);

  return (
    <div>
      {/* Toggle */}
      <div
        role="tablist"
        aria-label="Jenis produk TapHub"
        onKeyDown={onKeyDown}
        className="relative grid w-full max-w-md grid-cols-3 rounded-full border border-line bg-panel p-1.5 sm:w-[30rem]"
      >
        <span
          aria-hidden="true"
          className="absolute bottom-1.5 left-1.5 top-1.5 rounded-full bg-raised shadow-[0_2px_10px_rgba(15,23,42,0.12)] ring-1 ring-line transition-transform duration-300 ease-[cubic-bezier(.2,.8,.2,1)]"
          style={{ width: "calc((100% - 0.75rem) / 3)", transform: `translateX(${index * 100}%)` }}
        />
        {groups.map((g, i) => {
          const selected = i === index;
          return (
            <button
              key={g.id}
              ref={(el) => { tabRefs.current[i] = el; }}
              id={`tab-${g.id}`}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls="panel-produk"
              tabIndex={selected ? 0 : -1}
              onClick={() => go(i)}
              className={`relative z-10 rounded-full px-3 py-2.5 text-sm font-semibold transition-colors sm:text-base ${
                selected ? "text-fg" : "text-muted hover:text-fg"
              }`}
            >
              {g.label}
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-sm text-muted sm:text-base">{groups[index].description}</p>

      {/* Isi tab */}
      <div
        id="panel-produk"
        role="tabpanel"
        aria-labelledby={`tab-${active}`}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="mt-8"
      >
        <ul key={active} className="grid animate-fade-in gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {active === "layanan"
            ? services.map((s) => (
                <li key={s.slug} className="h-full rounded-3xl border border-line bg-panel p-5">
                  <span aria-hidden="true" className="grid h-11 w-11 place-items-center rounded-[30%] border border-tide-1/30 bg-tide-2/10 text-accent">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <path d={s.icon} />
                    </svg>
                  </span>
                  <h3 className="mt-4 text-lg font-semibold sm:mt-5">{s.name}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-muted sm:mt-2">{s.summary}</p>
                  <a href={mainHref("/hubungi-kami")} className="mt-4 inline-block text-sm font-semibold text-accent">
                    Konsultasi sekarang
                  </a>
                </li>
              ))
            : list.map((p) => {
                const featured = p.status === "featured";
                const body = (
                  <>
                    <div className="flex items-start justify-between gap-3">
                      <ProductIcon product={p} />
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          featured ? "bg-tide-2/15 text-accent ring-1 ring-tide-1/30" : "bg-fg/5 text-muted"
                        }`}
                      >
                        {featured ? "Produk unggulan" : "Segera hadir"}
                      </span>
                    </div>
                    <h3 className="mt-4 text-lg font-semibold sm:mt-5">{p.name}</h3>
                    <p className="mt-1.5 text-sm leading-6 text-muted sm:mt-2">{p.summary}</p>
                  </>
                );
                return (
                  <li key={p.slug}>
                    {p.href ? (
                      <a
                        href={p.href}
                        className="group block h-full rounded-3xl border border-tide-1/30 bg-gradient-to-b from-tide-2/[0.12] to-panel p-5 transition hover:border-tide-1/60"
                      >
                        {body}
                        <span className="mt-4 inline-block text-sm font-semibold text-accent">Pelajari {p.name}</span>
                      </a>
                    ) : (
                      <div className="h-full rounded-3xl border border-line bg-panel p-5">{body}</div>
                    )}
                  </li>
                );
              })}
        </ul>
      </div>
    </div>
  );
}
