const rupiah = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });
const number = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 2 });

export function idr(value: number | string | null | undefined) {
  return rupiah.format(Number(value ?? 0)).replace(/\s/g, " ");
}

export function num(value: number | string | null | undefined) {
  return number.format(Number(value ?? 0));
}

/** Rp 12,4 jt / Rp 1,2 M */
export function idrShort(value: number | string | null | undefined) {
  const n = Number(value ?? 0);
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  if (abs >= 1e12) return `${sign}Rp ${(abs / 1e12).toLocaleString("id-ID", { maximumFractionDigits: 1 })} T`;
  if (abs >= 1e9) return `${sign}Rp ${(abs / 1e9).toLocaleString("id-ID", { maximumFractionDigits: 1 })} M`;
  if (abs >= 1e6) return `${sign}Rp ${(abs / 1e6).toLocaleString("id-ID", { maximumFractionDigits: 1 })} jt`;
  if (abs >= 1e3) return `${sign}Rp ${(abs / 1e3).toLocaleString("id-ID", { maximumFractionDigits: 0 })} rb`;
  return `${sign}Rp ${abs.toLocaleString("id-ID")}`;
}

export function compact(value: number) {
  const abs = Math.abs(value);
  if (abs >= 1e9) return `${(value / 1e9).toLocaleString("id-ID", { maximumFractionDigits: 1 })}M`;
  if (abs >= 1e6) return `${(value / 1e6).toLocaleString("id-ID", { maximumFractionDigits: 1 })}jt`;
  if (abs >= 1e3) return `${(value / 1e3).toLocaleString("id-ID", { maximumFractionDigits: 0 })}rb`;
  return value.toLocaleString("id-ID");
}

const dateFmt = new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric", timeZone: "Asia/Jakarta" });
const shortFmt = new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", timeZone: "Asia/Jakarta" });

export function tgl(value: string | Date | null | undefined) {
  if (!value) return "-";
  const d = typeof value === "string" && value.length === 10 ? new Date(`${value}T00:00:00+07:00`) : new Date(value);
  return dateFmt.format(d);
}

export function tglShort(value: string | Date) {
  const d = typeof value === "string" && value.length === 10 ? new Date(`${value}T00:00:00+07:00`) : new Date(value);
  return shortFmt.format(d);
}

export function todayJakarta() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(new Date());
}

export function addDays(iso: string, days: number) {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function pctChange(now: number, prev: number) {
  if (!prev) return now ? 100 : 0;
  return ((now - prev) / Math.abs(prev)) * 100;
}

export function initials(name?: string | null) {
  return (name ?? "?")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}
