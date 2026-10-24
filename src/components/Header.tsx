"use client";

import { useEffect, useState } from "react";
import Logo from "./Logo";
import { mainHref, posHref, websiteHref } from "@/lib/site";

const nav = [
  { href: mainHref("/#produk"), label: "Produk" },
  { href: posHref(), label: "TapPOS" },
  { href: websiteHref(), label: "TapWebsite" },
  { href: mainHref("/#keunggulan"), label: "Keunggulan" },
  { href: mainHref("/blog"), label: "Blog" },
  { href: mainHref("/tentang-kami"), label: "Tentang" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors ${
        scrolled || open ? "border-b border-line bg-ink/80 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-page items-center justify-between gap-6 px-4 sm:px-6">
        <Logo className="h-6 w-auto sm:h-7" />

        <nav aria-label="Navigasi utama" className="hidden md:block">
          <ul className="flex items-center gap-8 text-sm text-muted">
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="transition hover:text-fg">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a href={mainHref("/hubungi-kami")} className="btn-tide hidden !py-2.5 sm:inline-flex">
            Hubungi kami
          </a>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line md:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h10" />}
            </svg>
          </button>
        </div>
      </div>

      <div
        id="menu-mobile"
        hidden={!open}
        className="h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line bg-ink px-4 pb-10 pt-4 md:hidden"
      >
        <nav aria-label="Navigasi mobile">
          <ul className="divide-y divide-line">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="flex items-center justify-between py-4 text-lg font-medium"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a href={mainHref("/hubungi-kami")} className="btn-tide mt-6 w-full" onClick={() => setOpen(false)}>
          Hubungi kami
        </a>
      </div>
    </header>
  );
}
