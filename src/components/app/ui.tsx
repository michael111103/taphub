import Link from "next/link";
import Icon, { TileIcon } from "./Icon";

export function PageHeader({
  title,
  description,
  crumbs,
  actions,
  icon,
  tone,
}: {
  title: string;
  description?: string;
  crumbs?: { label: string; href?: string }[];
  actions?: React.ReactNode;
  icon?: string;
  tone?: string;
}) {
  return (
    <div className="mb-5 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {crumbs && (
          <nav aria-label="Breadcrumb" className="no-print mb-1.5 flex flex-wrap items-center gap-1 text-xs text-muted">
            {crumbs.map((c, i) => (
              <span key={i} className="inline-flex items-center gap-1">
                {i > 0 && <Icon name="chevron-right" size={12} />}
                {c.href ? <Link href={c.href} className="hover:text-fg">{c.label}</Link> : <span>{c.label}</span>}
              </span>
            ))}
          </nav>
        )}
        <div className="flex items-center gap-3">
          {icon && <TileIcon name={icon} tone={tone} size={36} />}
          <h1 className="truncate text-xl font-semibold tracking-[-0.01em] sm:text-2xl">{title}</h1>
        </div>
        {description && <p className="mt-1.5 max-w-2xl text-sm text-muted">{description}</p>}
      </div>
      {actions && <div className="no-print flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

const statusMap: Record<string, { label: string; cls: string }> = {
  draft: { label: "Draft", cls: "bg-slate-500/10 text-slate-600 dark:text-slate-300" },
  open: { label: "Belum dibayar", cls: "bg-amber-500/12 text-amber-700 dark:text-amber-300" },
  partial: { label: "Dibayar sebagian", cls: "bg-sky-500/12 text-sky-700 dark:text-sky-300" },
  paid: { label: "Lunas", cls: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300" },
  void: { label: "Dibatalkan", cls: "bg-rose-500/10 text-rose-600 dark:text-rose-300" },
  accepted: { label: "Disetujui", cls: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300" },
  rejected: { label: "Ditolak", cls: "bg-rose-500/10 text-rose-600 dark:text-rose-300" },
  done: { label: "Selesai", cls: "bg-tide-2/10 text-accent" },
  overdue: { label: "Jatuh tempo", cls: "bg-rose-500/10 text-rose-600 dark:text-rose-300" },
  pending: { label: "Menunggu pembayaran", cls: "bg-amber-500/12 text-amber-700 dark:text-amber-300" },
  expired: { label: "Kedaluwarsa", cls: "bg-slate-500/10 text-slate-600 dark:text-slate-300" },
  canceled: { label: "Dibatalkan", cls: "bg-rose-500/10 text-rose-600 dark:text-rose-300" },
  trial: { label: "Uji coba", cls: "bg-tide-2/10 text-accent" },
  active: { label: "Aktif", cls: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300" },
};

export function StatusBadge({ status, kind, dueDate }: { status: string; kind?: string; dueDate?: string | null }) {
  let key = status;
  if ((kind === "quote" || kind === "order") && status === "open") key = "open_doc";
  if ((status === "open" || status === "partial") && dueDate && dueDate < new Date().toISOString().slice(0, 10) && kind !== "quote" && kind !== "order") key = "overdue";
  const s = key === "open_doc" ? { label: "Terbuka", cls: "bg-amber-500/12 text-amber-700 dark:text-amber-300" } : statusMap[key] ?? { label: status, cls: "bg-fg/5 text-muted" };
  return <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${s.cls}`}>{s.label}</span>;
}

export function Tabs({ tabs, active }: { tabs: { key: string; label: string; href: string; count?: number }[]; active: string }) {
  return (
    <div className="no-print -mx-1 mb-4 flex gap-1 overflow-x-auto px-1 pb-1 [scrollbar-width:none]">
      {tabs.map((t) => (
        <Link
          key={t.key}
          href={t.href}
          className={`inline-flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition ${
            t.key === active ? "bg-tide-2 text-white shadow-[0_6px_16px_-8px_rgba(27,91,255,0.9)]" : "text-muted hover:bg-fg/[0.05] hover:text-fg"
          }`}
        >
          {t.label}
          {t.count !== undefined && <span className={`rounded-full px-1.5 text-[11px] ${t.key === active ? "bg-white/20" : "bg-fg/[0.07]"}`}>{t.count}</span>}
        </Link>
      ))}
    </div>
  );
}

export function SearchBox({ q, placeholder = "Cari", hidden = {} }: { q?: string; placeholder?: string; hidden?: Record<string, string | undefined> }) {
  return (
    <form className="relative w-full sm:w-72" role="search">
      {Object.entries(hidden).map(([k, v]) => (v ? <input key={k} type="hidden" name={k} value={v} /> : null))}
      <input name="q" defaultValue={q} placeholder={placeholder} className="field pl-9" aria-label={placeholder} />
      <Icon name="search" size={16} className="pointer-events-none absolute left-3 top-3 text-muted" />
    </form>
  );
}

export function StatCard({ label, value, hint, tone = "blue", icon }: { label: string; value: string; hint?: string; tone?: string; icon?: string }) {
  return (
    <div className="card p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
        {icon && <TileIcon name={icon} tone={tone} size={30} />}
      </div>
      <p className="mt-3 text-xl font-semibold tabular-nums tracking-[-0.01em] sm:text-2xl">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

export function EmptyState({ icon = "spark", title, description, action }: { icon?: string; title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-2xl bg-tide-2/10 text-accent">
        <Icon name={icon} size={30} />
      </span>
      <p className="mt-4 font-semibold">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Pagination({ page, pages, makeHref }: { page: number; pages: number; makeHref: (p: number) => string }) {
  if (pages <= 1) return null;
  return (
    <div className="no-print flex items-center justify-between gap-3 border-t border-line px-4 py-3 text-sm">
      <span className="text-muted">Halaman {page} dari {pages}</span>
      <div className="flex gap-2">
        {page > 1 ? <Link href={makeHref(page - 1)} className="btn-soft h-9">Sebelumnya</Link> : <span className="btn-soft h-9 opacity-40">Sebelumnya</span>}
        {page < pages ? <Link href={makeHref(page + 1)} className="btn-soft h-9">Berikutnya</Link> : <span className="btn-soft h-9 opacity-40">Berikutnya</span>}
      </div>
    </div>
  );
}

export function Money({ value, className = "" }: { value: number | string; className?: string }) {
  const n = Number(value ?? 0);
  return <span className={`tabular-nums ${n < 0 ? "text-rose-600 dark:text-rose-300" : ""} ${className}`}>{new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(n)}</span>;
}
