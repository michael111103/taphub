"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import ThemeToggle from "./ThemeToggle";
import { quickActions } from "@/lib/app/nav";
import { initials } from "@/lib/app/format";
import { signOut, switchOrg } from "@/app/app/actions";

type Notice = { label: string; detail: string; href: string; tone: "rose" | "amber" | "blue" };

function useClickOutside(onOut: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onOut();
    };
    const k = (e: KeyboardEvent) => e.key === "Escape" && onOut();
    document.addEventListener("mousedown", h);
    document.addEventListener("keydown", k);
    return () => {
      document.removeEventListener("mousedown", h);
      document.removeEventListener("keydown", k);
    };
  }, [onOut]);
  return ref;
}

function Dropdown({ button, children, align = "right", label }: { button: React.ReactNode; children: React.ReactNode; align?: "left" | "right"; label: string }) {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside(() => setOpen(false));
  return (
    <div ref={ref} className="relative">
      <button type="button" aria-label={label} aria-expanded={open} onClick={() => setOpen((o) => !o)} className="block rounded-xl">
        {button}
      </button>
      {open && (
        <div
          className={`anim-feed absolute top-[calc(100%+8px)] z-50 w-72 overflow-hidden rounded-2xl border border-line bg-raised shadow-[0_24px_60px_-20px_rgba(15,23,42,0.45)] ${align === "right" ? "right-0" : "left-0"}`}
          onClick={(e) => {
            if ((e.target as HTMLElement).closest("a")) setOpen(false);
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

function LiveClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const time = now
    ? new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZone: "Asia/Jakarta" }).format(now)
    : "--.--.--";
  return (
    <span className="mono hidden items-center gap-2 rounded-full border border-line bg-panel px-3 py-1.5 text-xs tabular-nums text-muted xl:inline-flex" title="Waktu Indonesia Barat">
      <span className="live-dot h-2 w-2 rounded-full bg-emerald-500" />
      {time} WIB
    </span>
  );
}

const iconBtn = "grid h-10 w-10 place-items-center rounded-xl border border-line bg-raised text-fg/80 transition hover:border-tide-2/40 hover:text-accent";

export default function Topbar({
  base,
  title,
  orgs,
  orgId,
  userName,
  notices,
  onMenu,
}: {
  base: string;
  title?: string;
  orgs: { id: string; name: string }[];
  orgId: string;
  userName: string;
  notices: Notice[];
  onMenu: () => void;
}) {
  const link = (href: string) => (href === "/" ? base || "/" : `${base}${href}`);
  const current = orgs.find((o) => o.id === orgId);

  return (
    <header className="no-print sticky top-0 z-30 border-b border-line bg-raised/85 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-2 px-3 sm:gap-3 sm:px-6">
        <button type="button" onClick={onMenu} className={`${iconBtn} lg:hidden`} aria-label="Buka menu">
          <Icon name="menu" size={20} />
        </button>

        {/* Aksi cepat */}
        <div className="hidden items-center gap-2 md:flex">
          {quickActions.map((a) => (
            <Link key={a.href} href={link(a.href)} className={iconBtn} title={a.label} aria-label={a.label}>
              <Icon name={a.icon} size={19} />
            </Link>
          ))}
          <Link href={link("/cari")} className={iconBtn} title="Cari transaksi" aria-label="Cari transaksi">
            <Icon name="search" size={19} />
          </Link>
        </div>
        <Dropdown
          label="Buat transaksi"
          align="left"
          button={
            <span className={`${iconBtn} md:hidden`}>
              <Icon name="plus" size={20} />
            </span>
          }
        >
          <div className="p-2 md:hidden">
            {quickActions.map((a) => (
              <Link key={a.href} href={link(a.href)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-fg/[0.04]">
                <Icon name={a.icon} size={18} className="text-accent" />
                {a.label}
              </Link>
            ))}
          </div>
        </Dropdown>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          {/* Pilih usaha */}
          <Dropdown
            label="Pilih usaha"
            button={
              <span className="hidden max-w-[260px] cursor-pointer items-center gap-2 rounded-xl px-2 py-2 text-sm font-semibold uppercase tracking-wide hover:bg-fg/[0.04] sm:flex">
                <span className="truncate">{current?.name}</span>
                <Icon name="chevron-down" size={16} className="shrink-0 text-muted" />
              </span>
            }
          >
            <p className="border-b border-line px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted">Usaha kamu</p>
            <div className="max-h-72 overflow-y-auto p-2">
              {orgs.map((o) => (
                <form key={o.id} action={switchOrg.bind(null, o.id)}>
                  <button type="submit" className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm hover:bg-fg/[0.04] ${o.id === orgId ? "font-semibold text-accent" : ""}`}>
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-tide-2/10 text-xs font-bold text-accent">{initials(o.name)}</span>
                    <span className="flex-1 truncate">{o.name}</span>
                    {o.id === orgId && <Icon name="check" size={16} />}
                  </button>
                </form>
              ))}
            </div>
            <Link href={link("/mulai")} className="flex items-center gap-2 border-t border-line px-4 py-3 text-sm font-semibold text-accent hover:bg-fg/[0.03]">
              <Icon name="plus" size={16} /> Tambah usaha
            </Link>
          </Dropdown>

          <span className="hidden h-10 items-center rounded-xl border border-line bg-panel px-3 text-xs font-bold text-accent sm:inline-flex">ID</span>
          <LiveClock />

          {/* Notifikasi */}
          <Dropdown
            label="Notifikasi"
            button={
              <span className={`${iconBtn} relative cursor-pointer`}>
                <Icon name="bell" size={19} />
                {notices.length > 0 && (
                  <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">{notices.length}</span>
                )}
              </span>
            }
          >
            <p className="border-b border-line px-4 py-3 text-sm font-semibold">Notifikasi</p>
            {notices.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-muted">Semua beres. Tidak ada yang perlu ditindaklanjuti.</p>
            ) : (
              <div className="p-2">
                {notices.map((n) => (
                  <Link key={n.label} href={link(n.href)} className="flex gap-3 rounded-xl px-3 py-2.5 hover:bg-fg/[0.04]">
                    <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.tone === "rose" ? "bg-rose-500" : n.tone === "amber" ? "bg-amber-500" : "bg-tide-2"}`} />
                    <span>
                      <span className="block text-sm font-semibold">{n.label}</span>
                      <span className="block text-xs text-muted">{n.detail}</span>
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </Dropdown>

          <ThemeToggle />

          {/* Profil */}
          <Dropdown
            label="Menu akun"
            button={
              <span className="grid h-10 w-10 cursor-pointer place-items-center rounded-xl bg-gradient-to-br from-tide-1 to-tide-2 text-sm font-semibold text-white">{initials(userName)}</span>
            }
          >
            <div className="border-b border-line px-4 py-3">
              <p className="truncate text-sm font-semibold">{userName}</p>
              <p className="truncate text-xs text-muted">{current?.name}</p>
            </div>
            <div className="p-2">
              {[
                { l: "Profilku", h: "/pengaturan/profil", i: "user" },
                { l: "Pengaturan perusahaan", h: "/pengaturan/perusahaan", i: "building" },
                { l: "Langganan dan billing", h: "/pengaturan/billing", i: "card" },
              ].map((m) => (
                <Link key={m.h} href={link(m.h)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-fg/[0.04]">
                  <Icon name={m.i} size={18} className="text-muted" />
                  {m.l}
                </Link>
              ))}
              <form action={signOut}>
                <button type="submit" className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-rose-600 hover:bg-rose-500/10 dark:text-rose-300">
                  <Icon name="logout" size={18} />
                  Keluar
                </button>
              </form>
            </div>
          </Dropdown>
        </div>
      </div>
      {title && <span className="sr-only">{title}</span>}
    </header>
  );
}
