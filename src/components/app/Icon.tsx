import type { SVGProps } from "react";

/**
 * Set ikon custom TapHub: gaya duotone (garis + bidang transparan), sudut membulat,
 * dibuat khusus untuk aplikasi. Warna mengikuti currentColor.
 */
const paths: Record<string, JSX.Element> = {
  home: (
    <>
      <path d="M4 10.5 12 4l8 6.5V19a1.5 1.5 0 0 1-1.5 1.5H5.5A1.5 1.5 0 0 1 4 19v-8.5Z" fill="currentColor" fillOpacity=".16" />
      <path d="M4 10.5 12 4l8 6.5V19a1.5 1.5 0 0 1-1.5 1.5H5.5A1.5 1.5 0 0 1 4 19v-8.5Z" />
      <path d="M9.5 20.5v-5a2.5 2.5 0 0 1 5 0v5" />
    </>
  ),
  sales: (
    <>
      <rect x="4" y="3.5" width="16" height="17" rx="3" fill="currentColor" fillOpacity=".16" />
      <rect x="4" y="3.5" width="16" height="17" rx="3" />
      <path d="M8 8.5h8M8 12h5" />
      <path d="m13.5 16.5 1.6 1.5 3-3.2" />
    </>
  ),
  purchase: (
    <>
      <path d="M5 7h14l-1.3 11.1a2 2 0 0 1-2 1.9H8.3a2 2 0 0 1-2-1.9L5 7Z" fill="currentColor" fillOpacity=".16" />
      <path d="M5 7h14l-1.3 11.1a2 2 0 0 1-2 1.9H8.3a2 2 0 0 1-2-1.9L5 7Z" />
      <path d="M9 10V6.5a3 3 0 0 1 6 0V10" />
    </>
  ),
  expense: (
    <>
      <path d="M5 4.5h14v15l-2.3-1.6-2.4 1.6-2.3-1.6-2.4 1.6L7.3 18 5 19.5v-15Z" fill="currentColor" fillOpacity=".16" />
      <path d="M5 4.5h14v15l-2.3-1.6-2.4 1.6-2.3-1.6-2.4 1.6L7.3 18 5 19.5v-15Z" />
      <path d="M9 9h6M9 12.5h4" />
    </>
  ),
  box: (
    <>
      <path d="m12 3 8 4.2v9.6L12 21l-8-4.2V7.2L12 3Z" fill="currentColor" fillOpacity=".16" />
      <path d="m12 3 8 4.2v9.6L12 21l-8-4.2V7.2L12 3Z" />
      <path d="m4 7.2 8 4.3 8-4.3M12 11.5V21" />
    </>
  ),
  inventory: (
    <>
      <rect x="3.5" y="13" width="7" height="7" rx="1.6" fill="currentColor" fillOpacity=".16" />
      <rect x="3.5" y="13" width="7" height="7" rx="1.6" />
      <rect x="13.5" y="13" width="7" height="7" rx="1.6" />
      <rect x="8.5" y="4" width="7" height="7" rx="1.6" fill="currentColor" fillOpacity=".16" />
      <rect x="8.5" y="4" width="7" height="7" rx="1.6" />
    </>
  ),
  report: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="3.5" fill="currentColor" fillOpacity=".16" />
      <rect x="3.5" y="3.5" width="17" height="17" rx="3.5" />
      <path d="M8 16v-3M12 16V8M16 16v-5" />
    </>
  ),
  bank: (
    <>
      <path d="M4 9.5 12 5l8 4.5H4Z" fill="currentColor" fillOpacity=".16" />
      <path d="M4 9.5 12 5l8 4.5H4ZM5.5 9.5v7M10 9.5v7M14 9.5v7M18.5 9.5v7M3.5 19.5h17" />
    </>
  ),
  ledger: (
    <>
      <path d="M6 3.5h11a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a1.5 1.5 0 0 1-1.5-1.5v-14A1.5 1.5 0 0 1 6 3.5Z" fill="currentColor" fillOpacity=".16" />
      <path d="M6 3.5h11a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a1.5 1.5 0 0 1-1.5-1.5v-14A1.5 1.5 0 0 1 6 3.5Z" />
      <path d="M8.5 8h6M8.5 11.5h6M8.5 15h3.5" />
    </>
  ),
  asset: (
    <>
      <rect x="3.5" y="6.5" width="17" height="11" rx="2.5" fill="currentColor" fillOpacity=".16" />
      <rect x="3.5" y="6.5" width="17" height="11" rx="2.5" />
      <path d="M7.5 20.5h9M12 17.5v3" />
      <path d="m8 14 2.5-2.5 2 2L16 10" />
    </>
  ),
  contacts: (
    <>
      <circle cx="9" cy="8.5" r="3.5" fill="currentColor" fillOpacity=".16" />
      <circle cx="9" cy="8.5" r="3.5" />
      <path d="M3 19.5c.6-3.2 3-5 6-5s5.4 1.8 6 5" />
      <path d="M16 5.5a3 3 0 0 1 0 6M18 14.8c1.6.7 2.6 2.3 3 4.7" />
    </>
  ),
  pos: (
    <>
      <rect x="4" y="3.5" width="16" height="11" rx="2.5" fill="currentColor" fillOpacity=".16" />
      <rect x="4" y="3.5" width="16" height="11" rx="2.5" />
      <path d="M8 18h8l1.5 2.5h-11L8 18ZM12 14.5V18M8 8h4" />
    </>
  ),
  invoice: (
    <>
      <path d="M6 3.5h8.5L19 8v11a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19V5a1.5 1.5 0 0 1 1-1.5Z" fill="currentColor" fillOpacity=".16" />
      <path d="M6.5 3.5h8L19 8v11a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19V5a1.5 1.5 0 0 1 1.5-1.5Z" />
      <path d="M14.5 3.5V8H19M12 11v6M14 12.2c-.4-.6-1.1-.9-2-.9-1.2 0-2 .6-2 1.4 0 1.9 4 .9 4 2.8 0 .8-.9 1.5-2 1.5-.9 0-1.7-.4-2.1-1" />
    </>
  ),
  staff: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="4" fill="currentColor" fillOpacity=".16" />
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <circle cx="12" cy="10" r="2.5" />
      <path d="M8 16.5c.7-1.7 2.2-2.5 4-2.5s3.3.8 4 2.5" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity=".16" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3.5v2.2M12 18.3v2.2M20.5 12h-2.2M5.7 12H3.5M18 6l-1.6 1.6M7.6 16.4 6 18M18 18l-1.6-1.6M7.6 7.6 6 6" />
    </>
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="8.5" fill="currentColor" fillOpacity=".16" />
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9.8 9.5a2.3 2.3 0 0 1 4.4.9c0 1.5-2.2 1.9-2.2 3.3M12 16.8v.2" />
    </>
  ),
  rocket: (
    <>
      <path d="M14.5 4.5c2.5-.8 4.6-.8 5 0 .8.4.8 2.5 0 5L13 16l-5-5 6.5-6.5Z" fill="currentColor" fillOpacity=".16" />
      <path d="M14.5 4.5c2.5-.8 4.6-.8 5 0 .8.4.8 2.5 0 5L13 16l-5-5 6.5-6.5ZM8 11l-3.5.5L3 14l4 1M13 16l-.5 3.5L10 21l-1-4" />
      <circle cx="15.5" cy="8.5" r="1.3" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" fill="currentColor" fillOpacity=".12" />
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </>
  ),
  bell: (
    <>
      <path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15l1.5-2Z" fill="currentColor" fillOpacity=".16" />
      <path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15l1.5-2ZM10 21h4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" fill="currentColor" fillOpacity=".14" />
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  check: <path d="m5 12.5 4.2 4L19 7" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  "chevron-down": <path d="m6 9 6 6 6-6" />,
  "chevron-right": <path d="m9 6 6 6-6 6" />,
  "chevron-left": <path d="m15 6-6 6 6 6" />,
  "arrow-up": <path d="M12 19V5M6 11l6-6 6 6" />,
  "arrow-down": <path d="M12 5v14M6 13l6 6 6-6" />,
  "arrow-right": <path d="M5 12h14M13 6l6 6-6 6" />,
  logout: (
    <>
      <path d="M14 4.5H7A2.5 2.5 0 0 0 4.5 7v10A2.5 2.5 0 0 0 7 19.5h7" />
      <path d="M10 12h10M16.5 8.5 20 12l-3.5 3.5" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" fill="currentColor" fillOpacity=".2" />
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
    </>
  ),
  moon: (
    <>
      <path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10Z" fill="currentColor" fillOpacity=".2" />
      <path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10Z" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h10" />,
  sidebar: (
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="3" />
      <path d="M9.5 4.5v15" />
      <rect x="3.5" y="4.5" width="6" height="15" rx="3" fill="currentColor" fillOpacity=".16" stroke="none" />
    </>
  ),
  filter: <path d="M4 5.5h16l-6 7.5v5.5l-4 1.5v-7L4 5.5Z" />,
  print: (
    <>
      <path d="M7 8V3.5h10V8" />
      <rect x="3.5" y="8" width="17" height="9" rx="2" fill="currentColor" fillOpacity=".14" />
      <rect x="3.5" y="8" width="17" height="9" rx="2" />
      <path d="M7 14h10v6.5H7z" />
    </>
  ),
  download: <path d="M12 4v11M7 10.5l5 5 5-5M5 20h14" />,
  upload: <path d="M12 20V9M7 13.5l5-5 5 5M5 4h14" />,
  refresh: <path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3M19.5 4.5v4h-4" />,
  pause: <path d="M9 6v12M15 6v12" />,
  play: <path d="M8 5.5v13l10-6.5-10-6.5Z" />,
  fullscreen: <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />,
  card: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" fill="currentColor" fillOpacity=".14" />
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
      <path d="M3 10h18M7 15h3" />
    </>
  ),
  qris: (
    <>
      <rect x="4" y="4" width="6" height="6" rx="1.2" fill="currentColor" fillOpacity=".2" />
      <rect x="4" y="4" width="6" height="6" rx="1.2" />
      <rect x="14" y="4" width="6" height="6" rx="1.2" />
      <rect x="4" y="14" width="6" height="6" rx="1.2" />
      <path d="M14 14h2.5v2.5H14zM18 18h2v2h-2zM18 14h2M14 19.5h2" />
    </>
  ),
  wallet: (
    <>
      <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H17v3H6.5A2.5 2.5 0 0 1 4 7.5Z" />
      <rect x="4" y="7.5" width="16" height="12" rx="2.5" fill="currentColor" fillOpacity=".14" />
      <rect x="4" y="7.5" width="16" height="12" rx="2.5" />
      <path d="M15.5 13.5h2" />
    </>
  ),
  building: (
    <>
      <rect x="5" y="3.5" width="14" height="17" rx="2" fill="currentColor" fillOpacity=".14" />
      <rect x="5" y="3.5" width="14" height="17" rx="2" />
      <path d="M9 7.5h2M13 7.5h2M9 11h2M13 11h2M10 20.5v-4h4v4" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8.5" r="3.8" fill="currentColor" fillOpacity=".16" />
      <circle cx="12" cy="8.5" r="3.8" />
      <path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="10.5" width="14" height="10" rx="2.5" fill="currentColor" fillOpacity=".16" />
      <rect x="5" y="10.5" width="14" height="10" rx="2.5" />
      <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5M12 14.5v2" />
    </>
  ),
  mail: (
    <>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" fill="currentColor" fillOpacity=".14" />
      <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" />
      <path d="m4.5 7 7.5 6 7.5-6" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.8" fill="currentColor" fillOpacity=".2" />
    </>
  ),
  "eye-off": <path d="M4 4l16 16M10 6c.6-.3 1.3-.5 2-.5 6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-2.6 3.4M6.6 7.7A17 17 0 0 0 2.5 12S6 18.5 12 18.5c1.6 0 3-.4 4.2-1M9.9 10a2.8 2.8 0 0 0 4 4" />,
  transfer: <path d="M5 8.5h13.5M15 5l3.5 3.5L15 12M19 15.5H5.5M9 12l-3.5 3.5L9 19" />,
  tag: (
    <>
      <path d="M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1 1 0 0 1 0 1.4l-7.1 7.1a1 1 0 0 1-1.4 0L3.5 12.2Z" fill="currentColor" fillOpacity=".16" />
      <path d="M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1 1 0 0 1 0 1.4l-7.1 7.1a1 1 0 0 1-1.4 0L3.5 12.2Z" />
      <circle cx="8" cy="8" r="1.4" />
    </>
  ),
  spark: <path d="M12 3.5 13.8 9l5.7 1.5-5.7 1.7L12 18l-1.8-5.8-5.7-1.7L10.2 9 12 3.5Z" />,
  trash: <path d="M5 7h14M10 7V4.5h4V7M6.5 7l1 12.5h9l1-12.5M10 11v5M14 11v5" />,
  edit: <path d="M4.5 19.5h4l10-10a2.8 2.8 0 0 0-4-4l-10 10v4ZM13 7l4 4" />,
  copy: (
    <>
      <rect x="8" y="8" width="12" height="12" rx="2.5" fill="currentColor" fillOpacity=".14" />
      <rect x="8" y="8" width="12" height="12" rx="2.5" />
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
    </>
  ),
  whatsapp: (
    <path d="M12 3.5a8.5 8.5 0 0 0-7.3 12.9L3.5 20.5l4.2-1.1A8.5 8.5 0 1 0 12 3.5Zm-3 5c.3 0 .5 0 .7.5l.8 1.8c.1.2 0 .4-.1.6l-.5.6c.6 1.2 1.6 2.1 2.8 2.7l.6-.6c.2-.2.4-.2.6-.1l1.8.8c.4.2.5.4.4.7-.2 1-1.1 1.6-2 1.6-2.6-.3-5.6-3.2-5.9-5.8 0-1 .5-1.9 1.3-2.2h-.5Z" />
  ),
};

export type IconName = keyof typeof paths;

export default function Icon({
  name,
  size = 20,
  className,
  strokeWidth = 1.7,
  ...rest
}: { name: IconName | string; size?: number; strokeWidth?: number } & Omit<SVGProps<SVGSVGElement>, "name">) {
  const p = paths[name] ?? paths.spark;
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...rest}
    >
      {p}
    </svg>
  );
}

/** Ikon di dalam kotak berwarna (seperti menu Kledo), warna per modul */
const tones: Record<string, string> = {
  blue: "from-[#38C8F8] to-[#1B5BFF]",
  violet: "from-[#A78BFA] to-[#6D28D9]",
  pink: "from-[#F472B6] to-[#DB2777]",
  amber: "from-[#FBBF24] to-[#EA580C]",
  green: "from-[#4ADE80] to-[#059669]",
  teal: "from-[#2DD4BF] to-[#0E7490]",
  slate: "from-[#94A3B8] to-[#475569]",
};

export function TileIcon({ name, tone = "blue", size = 32 }: { name: string; tone?: keyof typeof tones | string; size?: number }) {
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-[10px] bg-gradient-to-br text-white shadow-[0_6px_14px_-6px_rgba(27,91,255,0.55)] ${tones[tone] ?? tones.blue}`}
      style={{ width: size, height: size }}
    >
      <Icon name={name} size={Math.round(size * 0.58)} strokeWidth={1.9} />
    </span>
  );
}

/** Logo Google berwarna untuk tombol login */
export function GoogleLogo({ size = 20 }: { size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5Z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7Z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44Z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5Z" />
    </svg>
  );
}
