"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Icon, { TileIcon } from "./Icon";
import { bottomNav, ecosystemNav, mainNav, type NavItem } from "@/lib/app/nav";
import { initials } from "@/lib/app/format";
import { signOut } from "@/app/app/actions";

type Props = {
  base: string;
  orgName: string;
  planLabel: string;
  trialDays: number | null;
  userName: string;
  userEmail: string;
  open: boolean;
  onClose: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
};

export default function Sidebar({ base, orgName, planLabel, trialDays, userName, userEmail, open, onClose, collapsed, onToggleCollapse }: Props) {
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const path = base && pathname.startsWith(base) ? pathname.slice(base.length) || "/" : pathname;

  const isActive = (href?: string) => {
    if (!href) return false;
    const clean = href.split("?")[0];
    return clean === "/" ? path === "/" : path === clean || path.startsWith(`${clean}/`);
  };

  const groupOf = (item: NavItem) => item.children?.some((c) => isActive(c.href));
  const [expanded, setExpanded] = useState<string | null>(() => mainNav.find(groupOf)?.label ?? null);
  useEffect(() => {
    const g = mainNav.find(groupOf);
    if (g) setExpanded(g.label);
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return mainNav;
    return mainNav
      .map((i) => {
        if (i.label.toLowerCase().includes(q)) return i;
        const kids = i.children?.filter((c) => c.label.toLowerCase().includes(q));
        return kids?.length ? { ...i, children: kids } : null;
      })
      .filter(Boolean) as NavItem[];
  }, [query]);

  const link = (href: string) => (href === "/" ? base || "/" : `${base}${href}`);
  const mini = collapsed;

  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition lg:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <aside
        aria-label="Menu utama"
        className={`no-print fixed inset-y-0 left-0 z-50 flex flex-col border-r border-line bg-raised transition-[transform,width] duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        } ${mini ? "w-[288px] lg:w-[84px]" : "w-[288px]"}`}
      >
        {/* Kartu perusahaan */}
        <div className="flex items-center gap-3 border-b border-line px-4 py-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-line bg-panel">
            <img src="/icon" alt="" className="h-7 w-7 rounded-md" />
          </span>
          <div className={`min-w-0 flex-1 ${mini ? "lg:hidden" : ""}`}>
            <p className="truncate text-sm font-semibold" title={orgName}>{orgName}</p>
            <p className="truncate text-xs text-muted">{planLabel}</p>
          </div>
          <button type="button" onClick={onToggleCollapse} className="hidden h-8 w-8 shrink-0 place-items-center rounded-lg text-muted hover:bg-fg/5 hover:text-fg lg:grid" aria-label={mini ? "Lebarkan menu" : "Ciutkan menu"}>
            <Icon name="sidebar" size={18} />
          </button>
          <button type="button" onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-fg/5 lg:hidden" aria-label="Tutup menu">
            <Icon name="close" size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-3 [scrollbar-width:thin]">
          {!mini && (
            <label className="relative mb-3 block">
              <span className="sr-only">Cari menu</span>
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari menu" className="field h-10 rounded-xl bg-panel pl-3 pr-9" />
              <Icon name="search" size={16} className="pointer-events-none absolute right-3 top-3 text-muted" />
            </label>
          )}

          {trialDays !== null && !mini && (
            <div className="mb-3 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-3 text-xs leading-5 text-amber-800 dark:text-amber-200">
              <span className="font-semibold">Uji coba berakhir {trialDays} hari lagi.</span>{" "}
              <Link href={link("/langganan")} className="font-semibold text-accent underline-offset-2 hover:underline">Upgrade sekarang</Link>
            </div>
          )}

          <nav className="space-y-0.5">
            {filtered.map((item) => {
              const active = isActive(item.href) || groupOf(item);
              if (!item.children) {
                return (
                  <Link
                    key={item.label}
                    href={link(item.href!)}
                    title={mini ? item.label : undefined}
                    className={`group flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-medium transition ${
                      active ? "bg-tide-2/10 text-accent" : "text-fg/80 hover:bg-fg/[0.04] hover:text-fg"
                    } ${mini ? "lg:justify-center" : ""}`}
                  >
                    <TileIcon name={item.icon} tone={item.tone} size={30} />
                    <span className={mini ? "lg:hidden" : ""}>{item.label}</span>
                  </Link>
                );
              }
              const isOpen = expanded === item.label || !!query;
              return (
                <div key={item.label}>
                  <button
                    type="button"
                    onClick={() => setExpanded(isOpen && !query ? null : item.label)}
                    aria-expanded={isOpen}
                    title={mini ? item.label : undefined}
                    className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-medium transition ${
                      active ? "text-accent" : "text-fg/80 hover:bg-fg/[0.04] hover:text-fg"
                    } ${mini ? "lg:justify-center" : ""}`}
                  >
                    <TileIcon name={item.icon} tone={item.tone} size={30} />
                    <span className={`flex-1 text-left ${mini ? "lg:hidden" : ""}`}>{item.label}</span>
                    <Icon name="chevron-down" size={16} className={`text-muted transition ${isOpen ? "rotate-180" : ""} ${mini ? "lg:hidden" : ""}`} />
                  </button>
                  <div className={`grid transition-[grid-template-rows] duration-300 ${isOpen && !mini ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden">
                      <div className="ml-[26px] space-y-0.5 border-l border-line py-1 pl-4">
                        {item.children.map((c) => (
                          <Link
                            key={c.href}
                            href={link(c.href)}
                            className={`block rounded-lg px-2.5 py-1.5 text-sm transition ${
                              isActive(c.href) && (c.href !== "/penjualan" || path === "/penjualan") && (c.href !== "/pembelian" || path === "/pembelian")
                                ? "bg-tide-2/10 font-semibold text-accent"
                                : "text-muted hover:text-fg"
                            }`}
                          >
                            {c.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>

          {!query && (
            <>
              <p className={`mb-1 mt-5 px-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted ${mini ? "lg:hidden" : ""}`}>Ekosistem TapHub</p>
              <nav className="space-y-0.5">
                {ecosystemNav.map((item) => (
                  <Link key={item.label} href={link(item.href!)} title={mini ? item.label : undefined} className={`flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-medium text-fg/80 transition hover:bg-fg/[0.04] hover:text-fg ${mini ? "lg:justify-center" : ""}`}>
                    <TileIcon name={item.icon} tone={item.tone} size={30} />
                    <span className={`flex-1 ${mini ? "lg:hidden" : ""}`}>{item.label}</span>
                    <span className={`rounded-full bg-fg/[0.06] px-2 py-0.5 text-[10px] font-semibold text-muted ${mini ? "lg:hidden" : ""}`}>{item.badge}</span>
                  </Link>
                ))}
              </nav>
              <nav className="mt-4 space-y-0.5 border-t border-line pt-3">
                {bottomNav.map((item) => (
                  <Link key={item.label} href={link(item.href!)} title={mini ? item.label : undefined} className={`flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-medium transition ${isActive(item.href) ? "bg-tide-2/10 text-accent" : "text-fg/80 hover:bg-fg/[0.04] hover:text-fg"} ${mini ? "lg:justify-center" : ""}`}>
                    <TileIcon name={item.icon} tone={item.tone} size={30} />
                    <span className={mini ? "lg:hidden" : ""}>{item.label}</span>
                  </Link>
                ))}
                <a href="https://wa.me/6281281321903?text=Halo%20TapHub%2C%20saya%20butuh%20bantuan%20di%20aplikasi." target="_blank" rel="noopener noreferrer" className={`flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-medium text-fg/80 transition hover:bg-fg/[0.04] hover:text-fg ${mini ? "lg:justify-center" : ""}`}>
                  <TileIcon name="help" tone="green" size={30} />
                  <span className={mini ? "lg:hidden" : ""}>Bantuan</span>
                </a>
              </nav>
            </>
          )}
        </div>

        {/* Pengguna */}
        <div className="flex items-center gap-3 border-t border-line px-4 py-3">
          <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-tide-1 to-tide-2 text-sm font-semibold text-white">
            {initials(userName)}
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-raised bg-emerald-500" />
          </span>
          <div className={`min-w-0 flex-1 ${mini ? "lg:hidden" : ""}`}>
            <p className="truncate text-sm font-semibold">{userName}</p>
            <p className="truncate text-xs text-muted">{userEmail}</p>
          </div>
          <form action={signOut} className={mini ? "lg:hidden" : ""}>
            <button type="submit" className="grid h-9 w-9 place-items-center rounded-lg text-rose-500 transition hover:bg-rose-500/10" aria-label="Keluar">
              <Icon name="logout" size={18} />
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
