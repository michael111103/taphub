"use client";

import { useEffect, useRef, useState } from "react";
import Logo from "./Logo";
import ProductIcon from "./ProductIcon";
import { products, type Product } from "@/lib/products";
import { mainHref, posHref, websiteHref, whatsappLink } from "@/lib/site";

type MenuItem = { href: string; label: string; desc: string; product?: Product; icon?: string };
type Group = { id: string; label: string; items: MenuItem[] };

const bySlug = (slug: string) => products.find((p) => p.slug === slug);

/** Menu dropdown (desktop) dan akordeon (mobile), ala Mekari */
const groups: Group[] = [
  {
    id: "produk",
    label: "Produk & Layanan",
    items: [
      { href: posHref(), label: "TapPOS", desc: "Aplikasi kasir dan sistem POS untuk F&B, retail, dan jasa", product: bySlug("tappos") },
      { href: websiteHref(), label: "TapWebsite", desc: "Jasa pembuatan website: landing page sampai toko online", product: bySlug("tapwebsite") },
      { href: mainHref("/#produk"), label: "Semua produk", desc: "Lihat seluruh ekosistem TapHub", icon: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" },
    ],
  },
  {
    id: "resources",
    label: "Resources",
    items: [
      { href: mainHref("/blog"), label: "Blog", desc: "Artikel dan panduan untuk pemilik usaha", icon: "M6 3h9l3 3v15H6zM9 9h6M9 13h6M9 17h4" },
      { href: mainHref("/#faq"), label: "FAQ", desc: "Jawaban pertanyaan yang sering ditanyakan", icon: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.5V14M12 17.5h.01" },
    ],
  },
];

const links = [
  { href: mainHref("/#keunggulan"), label: "Keunggulan" },
  { href: mainHref("/tentang-kami"), label: "Tentang" },
];

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 transition-transform duration-300 ${open ? "rotate-180 text-accent" : ""}`}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function ItemIcon({ item }: { item: MenuItem }) {
  if (item.product) return <ProductIcon product={item.product} size={40} />;
  return (
    <span aria-hidden="true" className="grid h-10 w-10 shrink-0 place-items-center rounded-[30%] bg-tide-2/10 text-accent ring-1 ring-tide-1/25">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d={item.icon} />
      </svg>
    </span>
  );
}

function ItemLink({ item, onClick }: { item: MenuItem; onClick?: () => void }) {
  return (
    <a href={item.href} onClick={onClick} className="flex items-start gap-3 rounded-2xl p-3 transition hover:bg-tide-2/[0.08]">
      <ItemIcon item={item} />
      <span className="min-w-0">
        <span className="block font-semibold text-fg">{item.label}</span>
        <span className="mt-0.5 block text-sm leading-5 text-muted">{item.desc}</span>
      </span>
    </a>
  );
}

/** Panel yang membuka ke bawah dengan animasi tinggi (grid 0fr -> 1fr) */
function Collapse({ open, id, children }: { open: boolean; id: string; children: React.ReactNode }) {
  const inner = useRef<HTMLDivElement>(null);
  // Isi yang tertutup tidak bisa difokus atau dibaca pembaca layar
  useEffect(() => {
    if (inner.current) inner.current.inert = !open;
  }, [open]);
  return (
    <div
      id={id}
      className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
    >
      <div ref={inner} className="overflow-hidden">
        {children}
      </div>
    </div>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [desk, setDesk] = useState<string | null>(null);
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) setMobileGroup(null);
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      setDesk(null);
    };
    const onDown = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setDesk(null);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, []);

  const hoverOpen = (id: string) => {
    clearTimeout(closeTimer.current);
    setDesk(id);
  };
  const hoverClose = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setDesk(null), 160);
  };
  const closeAll = () => {
    setOpen(false);
    setDesk(null);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-colors ${
        scrolled || open || desk ? "border-b border-line bg-ink/85 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-page items-center justify-between gap-6 px-4 sm:px-6">
        <Logo className="h-6 w-auto sm:h-7" />

        {/* Desktop */}
        <nav aria-label="Navigasi utama" className="hidden md:block" ref={navRef}>
          <ul className="flex items-center gap-1 text-sm text-muted">
            {groups.map((g) => {
              const isOpen = desk === g.id;
              return (
                <li key={g.id} className="relative" onMouseEnter={() => hoverOpen(g.id)} onMouseLeave={hoverClose}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`menu-${g.id}`}
                    onClick={() => setDesk(isOpen ? null : g.id)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 transition hover:text-fg ${isOpen ? "text-fg" : ""}`}
                  >
                    {g.label}
                    <Chevron open={isOpen} />
                  </button>
                  <div
                    id={`menu-${g.id}`}
                    className={`absolute left-1/2 top-full w-[360px] -translate-x-1/2 pt-3 transition duration-200 ease-out ${
                      isOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
                    }`}
                  >
                    <div className="rounded-3xl border border-line bg-ink p-2 shadow-[0_24px_60px_-20px_rgba(15,23,42,0.35)]">
                      {g.items.map((it) => (
                        <ItemLink key={it.label} item={it} onClick={closeAll} />
                      ))}
                    </div>
                  </div>
                </li>
              );
            })}
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="inline-flex rounded-full px-3 py-2 transition hover:text-fg">
                  {l.label}
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

      {/* Mobile */}
      <div id="menu-mobile" hidden={!open} className={`${open ? "flex" : "hidden"} h-[calc(100dvh-4rem)] flex-col border-t border-line bg-ink md:hidden`}>
        <nav aria-label="Navigasi mobile" className="flex-1 overflow-y-auto px-4">
          <ul className="divide-y divide-line">
            {groups.map((g) => {
              const isOpen = mobileGroup === g.id;
              return (
                <li key={g.id}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`m-${g.id}`}
                    onClick={() => setMobileGroup(isOpen ? null : g.id)}
                    className="flex w-full items-center justify-between py-5 text-left text-lg font-semibold"
                  >
                    {g.label}
                    <Chevron open={isOpen} />
                  </button>
                  <Collapse open={isOpen} id={`m-${g.id}`}>
                    <div className="space-y-1 pb-4">
                      {g.items.map((it) => (
                        <ItemLink key={it.label} item={it} onClick={closeAll} />
                      ))}
                    </div>
                  </Collapse>
                </li>
              );
            })}
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="flex items-center py-5 text-lg font-semibold" onClick={closeAll}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="space-y-3 border-t border-line bg-panel px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5">
          <a href={whatsappLink("Halo TapHub, saya mau bertanya.")} target="_blank" rel="noopener noreferrer" className="btn-ghost w-full justify-center" onClick={closeAll}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .3-3.4-.7-2.9-1.2-4.7-4.1-4.9-4.3-.1-.2-1.2-1.6-1.2-3s.7-2.2 1-2.5c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.4.6-.4.5c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.2.5.1.7-.1l.9-1.1c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.5.3.1.2.1.7-.1 1.2z" /></svg>
            WhatsApp kami
          </a>
          <a href={mainHref("/hubungi-kami")} className="btn-tide w-full justify-center" onClick={closeAll}>
            Hubungi kami
          </a>
        </div>
      </div>
    </header>
  );
}
