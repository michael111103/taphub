"use client";

import { useRef } from "react";
import ProductIcon from "./ProductIcon";
import { products } from "@/lib/products";

type Item = { title: string; body: string; icon: string; className?: string; feature?: boolean };

const items: Item[] = [
  {
    title: "Ekosistem terintegrasi",
    body: "Data penjualan, stok, dan keuangan mengalir antarproduk Tap. Satu kali catat, langsung terpakai di mana-mana tanpa input ulang.",
    icon: "M8 7a3 3 0 1 0-6 0 3 3 0 0 0 6 0zM22 17a3 3 0 1 0-6 0 3 3 0 0 0 6 0zM8 7h5a3 3 0 0 1 3 3v4",
    className: "md:col-span-2 lg:row-span-2",
    feature: true,
  },
  {
    title: "Keamanan dan kepatuhan",
    body: "Koneksi terenkripsi dan pengelolaan data yang mengacu pada UU Pelindungan Data Pribadi. Pembayaran diproses mitra berlisensi.",
    icon: "M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6zM9 12l2 2 4-4",
  },
  {
    title: "Operasional efisien",
    body: "Pesanan, kasir, dan stok tercatat otomatis, mengurangi kerja manual dan salah catat.",
    icon: "M13 2L4 14h7l-1 8 9-12h-7z",
  },
  {
    title: "Insight berbasis data",
    body: "Laporan penjualan dan menu terlaris membantu memutuskan stok, harga, dan promo.",
    icon: "M4 20V10M10 20V4M16 20v-7M22 20H2",
  },
  {
    title: "Tumbuh bersama usahamu",
    body: "Mulai dari satu outlet dan satu produk. Tambah cabang atau produk tanpa pindah sistem.",
    icon: "M3 17l6-6 4 4 8-8M15 7h6v6",
  },
  {
    title: "Dibuat untuk Indonesia",
    body: "Berbahasa Indonesia, memakai Rupiah, dan mendukung QRIS, e-wallet, serta virtual account bank lokal.",
    icon: "M4 21V4M4 4h12l-2 4 2 4H4",
    className: "lg:col-span-2",
  },
  {
    title: "Transformasi digital",
    body: "Langkah awal digitalisasi untuk usaha yang masih mencatat di kertas, tanpa perlu tim IT.",
    icon: "M4 5h16v11H4zM8 20h8M12 16v4M8 10l2 2-2 2M13 14h3",
    className: "lg:col-span-2",
  },
];

const showcase = ["taporder", "tappos", "tapstock", "tapbooks", "tapinvoice"].map(
  (slug) => products.find((p) => p.slug === slug)!,
);

export default function FoundationGrid() {
  return (
    <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <Card key={item.title} item={item} />
      ))}
    </ul>
  );
}

function Card({ item }: { item: Item }) {
  const ref = useRef<HTMLLIElement>(null);

  // Cahaya mengikuti posisi kursor di dalam kartu
  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - r.left}px`);
    el.style.setProperty("--y", `${e.clientY - r.top}px`);
  };

  return (
    <li
      ref={ref}
      onPointerMove={onMove}
      className={`group relative isolate flex flex-col overflow-hidden rounded-3xl border border-line bg-panel p-6 transition duration-300 hover:-translate-y-1 hover:border-tide-1/40 sm:p-7 ${item.className ?? ""}`}
    >
      {/* sorotan cahaya saat hover */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(420px circle at var(--x, 50%) var(--y, 0%), rgba(56,200,248,0.2), transparent 45%)",
        }}
      />
      {/* garis cahaya di tepi atas */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-tide-1/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      <span
        aria-hidden="true"
        className="grid h-11 w-11 place-items-center rounded-2xl border border-tide-1/30 bg-tide-2/10 transition duration-300 group-hover:scale-110 group-hover:border-tide-1/60 group-hover:shadow-[0_0_24px_-4px_rgba(56,200,248,0.7)]"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38C8F8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d={item.icon} />
        </svg>
      </span>

      <h3 className={`mt-6 font-semibold ${item.feature ? "text-2xl tracking-[-0.01em]" : "text-lg"}`}>{item.title}</h3>
      <p className={`mt-2 leading-7 text-muted ${item.feature ? "max-w-md text-lg" : ""}`}>{item.body}</p>

      {item.feature && (
        <div
          aria-hidden="true"
          className="relative mt-10 flex min-h-[200px] flex-1 flex-col justify-center overflow-hidden rounded-2xl border border-line bg-ink/60 px-4 py-8 sm:px-6"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_50%_50%,rgba(27,91,255,0.18),transparent_70%)]" />
          <div className="absolute inset-x-8 top-[calc(50%-10px)] h-px bg-gradient-to-r from-tide-2/0 via-tide-1/60 to-tide-2/0" />
          {/* titik data yang mengalir di sepanjang garis */}
          <span className="absolute top-[calc(50%-12px)] h-[5px] w-10 animate-[slide_3.2s_linear_infinite] rounded-full bg-gradient-to-r from-transparent via-tide-1 to-transparent" />
          <ul className="relative flex items-center justify-between gap-2">
            {showcase.map((p, i) => (
              <li
                key={p.slug}
                className="flex flex-col items-center gap-2 transition duration-500 group-hover:-translate-y-1.5"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <span className="rounded-2xl border border-line bg-raised p-1.5 sm:p-2">
                  <span className="hidden sm:block"><ProductIcon product={p} size={44} /></span>
                  <span className="sm:hidden"><ProductIcon product={p} size={32} /></span>
                </span>
                <span className="text-[10px] text-muted sm:text-xs">{p.name}</span>
              </li>
            ))}
          </ul>
          <p className="relative mt-8 text-center text-xs text-muted sm:text-sm">Satu kali catat, data dipakai bersama oleh semua produk</p>
        </div>
      )}
    </li>
  );
}
