"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ArticleCard from "./ArticleCard";
import type { Article } from "@/lib/articles";

type Sort = "terbaru" | "terlama";

// Kolom pencarian + tombol filter (kategori dan urutan) + daftar kartu artikel.
export default function BlogBrowser({ articles, categories }: { articles: Article[]; categories: string[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [sort, setSort] = useState<Sort>("terbaru");
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Tutup panel filter saat klik di luar atau tekan Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!panelRef.current?.contains(t) && !buttonRef.current?.contains(t)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = articles.filter((a) => {
      if (category && a.category !== category) return false;
      if (!q) return true;
      const haystack = [a.title, a.description, a.category, ...a.keywords].join(" ").toLowerCase();
      return q.split(/\s+/).every((word) => haystack.includes(word));
    });
    return list.sort((a, b) => (sort === "terbaru" ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)));
  }, [articles, query, category, sort]);

  const activeFilters = (category ? 1 : 0) + (sort !== "terbaru" ? 1 : 0);
  const reset = () => {
    setQuery("");
    setCategory(null);
    setSort("terbaru");
  };

  return (
    <div>
      <div className="relative flex gap-2 sm:gap-3">
        <label htmlFor="cari-artikel" className="sr-only">Cari artikel</label>
        <div className="relative flex-1">
          <svg aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
          <input
            id="cari-artikel"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari artikel, misalnya aplikasi kasir"
            className="w-full rounded-full border border-line bg-raised py-3 pl-11 pr-4 text-base text-fg shadow-sm placeholder:text-muted/70 focus:border-tide-1"
          />
        </div>
        <button
          ref={buttonRef}
          type="button"
          aria-expanded={open}
          aria-controls="panel-filter"
          onClick={() => setOpen((v) => !v)}
          className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition sm:px-5 ${
            open || activeFilters ? "border-tide-1/60 bg-tide-2/10 text-accent" : "border-line bg-raised text-fg hover:border-tide-1/50"
          }`}
        >
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 6h16M7 12h10M10 18h4" />
          </svg>
          <span className="hidden sm:inline">Filter</span>
          {activeFilters ? (
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-tide-2 px-1.5 text-xs text-white">{activeFilters}</span>
          ) : null}
          <span className="sr-only sm:hidden">Filter</span>
        </button>

        {open && (
          <div
            ref={panelRef}
            id="panel-filter"
            role="dialog"
            aria-label="Filter artikel"
            className="absolute right-0 top-full z-20 mt-2 w-full max-w-sm animate-fade-in rounded-3xl border border-line bg-raised p-5 shadow-[0_24px_60px_-20px_rgba(15,23,42,0.35)]"
          >
            <fieldset>
              <legend className="text-sm font-semibold">Kategori</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {[null, ...categories].map((c) => {
                  const selected = category === c;
                  return (
                    <button
                      key={c ?? "semua"}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setCategory(c)}
                      className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                        selected ? "bg-fg text-ink" : "border border-line text-muted hover:text-fg"
                      }`}
                    >
                      {c ?? "Semua kategori"}
                    </button>
                  );
                })}
              </div>
            </fieldset>
            <fieldset className="mt-5">
              <legend className="text-sm font-semibold">Urutkan</legend>
              <div className="mt-3 flex gap-2">
                {(["terbaru", "terlama"] as Sort[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={sort === s}
                    onClick={() => setSort(s)}
                    className={`rounded-full px-3.5 py-1.5 text-sm font-medium capitalize transition ${
                      sort === s ? "bg-fg text-ink" : "border border-line text-muted hover:text-fg"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </fieldset>
            <div className="mt-6 flex items-center justify-between gap-3 border-t border-line pt-4">
              <button type="button" onClick={reset} className="text-sm font-semibold text-muted hover:text-fg">
                Atur ulang
              </button>
              <button type="button" onClick={() => setOpen(false)} className="btn-tide !px-5 !py-2">
                Tampilkan {results.length} artikel
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="mt-6 text-sm text-muted" aria-live="polite">
        {query || category ? `${results.length} artikel ditemukan` : `${results.length} artikel`}
        {category ? ` di kategori ${category}` : ""}
      </p>

      {results.length > 0 ? (
        <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((a) => (
            <li key={a.slug}>
              <ArticleCard article={a} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-6 rounded-3xl border border-dashed border-line bg-panel p-10 text-center">
          <p className="text-lg font-semibold">Belum ada artikel yang cocok.</p>
          <p className="mt-2 text-muted">Coba kata kunci lain atau hapus filter kategori.</p>
          <button type="button" onClick={reset} className="btn-ghost mt-6">Hapus pencarian dan filter</button>
        </div>
      )}
    </div>
  );
}
