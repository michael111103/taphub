"use client";

import { useState } from "react";
import Link from "next/link";
import ProductIcon from "./ProductIcon";
import { categories, products, type ProductCategory } from "@/lib/products";

type Filter = "Semua" | ProductCategory;
const filters: Filter[] = ["Semua", ...categories];

export default function ProductGrid() {
  const [active, setActive] = useState<Filter>("Semua");
  const list = active === "Semua" ? products : products.filter((p) => p.category === active);

  return (
    <div>
      <div
        role="tablist"
        aria-label="Kategori produk"
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0"
      >
        {filters.map((f) => {
          const selected = f === active;
          return (
            <button
              key={f}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls="daftar-produk"
              onClick={() => setActive(f)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                selected ? "bg-fg text-ink" : "border border-line text-muted hover:text-fg"
              }`}
            >
              {f}
            </button>
          );
        })}
      </div>

      <ul id="daftar-produk" role="tabpanel" className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => {
          const pilot = p.status === "pilot";
          const body = (
            <>
              <div className="flex items-start justify-between gap-3">
                <ProductIcon product={p} />
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    pilot ? "bg-tide-2/15 text-tide-1 ring-1 ring-tide-1/30" : "bg-white/5 text-muted"
                  }`}
                >
                  {pilot ? "Program pilot" : "Segera hadir"}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-semibold sm:mt-5">{p.name}</h3>
              <p className="mt-1.5 text-sm leading-6 text-muted sm:mt-2">{p.summary}</p>
              <p className="mt-4 hidden text-xs text-muted/80 sm:block">{p.category}</p>
            </>
          );
          return (
            <li key={p.slug}>
              {p.href ? (
                <Link
                  href={p.href}
                  className="group block h-full rounded-3xl border border-tide-1/30 bg-gradient-to-b from-tide-2/[0.12] to-panel p-5 transition hover:border-tide-1/60"
                >
                  {body}
                  <span className="mt-4 inline-block text-sm font-semibold text-tide-1">Pelajari {p.name}</span>
                </Link>
              ) : (
                <div className="h-full rounded-3xl border border-line bg-panel p-5">{body}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
