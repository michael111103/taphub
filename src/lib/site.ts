// Semua data situs di satu tempat. Ganti di sini, otomatis berubah di seluruh website.
export const site = {
  name: "TapHub",
  url: "https://taphub.id",
  /** Domain landing page TapPOS (subdomain) */
  posUrl: "https://pos.taphub.id",
  /** Domain landing page TapWebsite (subdomain) */
  websiteUrl: "https://website.taphub.id",
  tagline: "Software yang saling terhubung untuk bisnis",
  description:
    "TapHub adalah ekosistem software untuk usaha Indonesia: TapPOS, TapBisnis, TapInvoice, TapStock, dan lainnya untuk penjualan, keuangan, operasional, dan gaya hidup.",
  email: "halo@taphub.id",
  // Format internasional tanpa tanda +, dipakai untuk link WhatsApp
  whatsapp: "6281281321903",
  whatsappDisplay: "+62 812-8132-1903",
  company: {
    legalName: "PT Bara Karbon Internasional",
    address: [
      "Treasury Tower, Jl. Jend. Sudirman Kav. 52-53, Lot 29 Level 6",
      "Senayan, Kebayoran Baru, Jakarta Selatan",
      "DKI Jakarta 12190",
    ],
  },
  social: {
    instagram: "https://instagram.com/taphub.id",
  },
} as const;

export function whatsappLink(text?: string) {
  const base = `https://wa.me/${site.whatsapp}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/**
 * Link ke halaman situs utama (taphub.id).
 * Di produksi isi env NEXT_PUBLIC_MAIN_URL=https://taphub.id supaya link dari pos.taphub.id
 * tetap mengarah ke situs utama. Jika kosong, link relatif (berguna untuk preview Vercel).
 */
export function mainHref(path: string) {
  const base = process.env.NEXT_PUBLIC_MAIN_URL ?? "";
  return `${base}${path}`;
}

/**
 * Link ke landing page TapPOS.
 * Di produksi isi env NEXT_PUBLIC_POS_URL=https://pos.taphub.id. Jika kosong memakai /pos.
 */
export function posHref(hash = "") {
  const base = process.env.NEXT_PUBLIC_POS_URL ?? "/pos";
  return `${base}${hash}`;
}

/**
 * Link ke landing page TapWebsite.
 * Di produksi isi env NEXT_PUBLIC_WEBSITE_URL=https://website.taphub.id. Jika kosong memakai /website.
 */
export function websiteHref(hash = "") {
  const base = process.env.NEXT_PUBLIC_WEBSITE_URL ?? "/website";
  return `${base}${hash}`;
}
