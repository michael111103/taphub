// Semua data situs di satu tempat. Ganti di sini, otomatis berubah di seluruh website.
export const site = {
  name: "TapHub",
  url: "https://taphub.id",
  tagline: "Software untuk menjalankan usaha di Indonesia",
  description:
    "TapHub membuat software untuk usaha Indonesia. Mulai dari TapOrder: pelanggan scan QR di meja, pesan, dan bayar sendiri, pesanan langsung masuk ke kasir.",
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
