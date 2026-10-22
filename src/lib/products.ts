import { posHref } from "./site";

export type ProductCategory = "Penjualan" | "Keuangan" | "Operasional" | "Gaya hidup";
export type ProductStatus = "featured" | "soon";
export type ProductGroup = "software" | "platform" | "layanan";

/** Tab di bagian "Produk TapHub" (toggle geser ala Mekari) */
export const groups: { id: ProductGroup; label: string; description: string }[] = [
  { id: "software", label: "Software", description: "Aplikasi bisnis berbasis cloud untuk menjalankan operasional sehari-hari." },
  { id: "platform", label: "Platform", description: "Platform untuk pembayaran, loyalitas pelanggan, dan gaya hidup." },
  { id: "layanan", label: "Layanan", description: "Pendampingan dari tim TapHub supaya usahamu siap berjalan." },
];

export type Product = {
  slug: string;
  name: string;
  /** Link ke landing page produk, jika sudah ada */
  href?: string;
  summary: string;
  category: ProductCategory;
  group: Exclude<ProductGroup, "layanan">;
  status: ProductStatus;
  /** Dua warna gradasi untuk ikon produk */
  hue: [string, string];
  /** Path SVG 24x24 untuk ikon */
  icon: string;
};

export const categories: ProductCategory[] = ["Penjualan", "Keuangan", "Operasional", "Gaya hidup"];

export const products: Product[] = [
  {
    slug: "tappos",
    name: "TapPOS",
    href: posHref(),
    summary: "Aplikasi kasir untuk F&B, retail, dan jasa: pesanan, multicabang, stok, promo, dan laporan dalam satu sistem.",
    category: "Penjualan",
    group: "software",
    status: "featured",
    hue: ["#38C8F8", "#1B5BFF"],
    icon: "M4 5h16v10H4zM8 19h8M12 15v4M7 9h4",
  },
  {
    slug: "tappay",
    name: "TapPay",
    summary: "Link pembayaran dan QRIS untuk tagihan online, diproses lewat payment gateway berlisensi.",
    category: "Keuangan",
    group: "platform",
    status: "soon",
    hue: ["#60A5FA", "#4F46E5"],
    icon: "M3 7h18v10H3zM3 11h18M7 15h3",
  },
  {
    slug: "tapinvoice",
    name: "TapInvoice",
    summary: "Buat dan kirim invoice ke pelanggan, lalu pantau mana yang sudah dibayar.",
    category: "Keuangan",
    group: "software",
    status: "soon",
    hue: ["#A78BFA", "#6D28D9"],
    icon: "M6 3h9l3 3v15H6zM9 9h6M9 13h6M9 17h4",
  },
  {
    slug: "tapbooks",
    name: "TapBooks",
    summary: "Pembukuan dan laporan keuangan otomatis, bisa terhubung ke penjualan marketplace.",
    category: "Keuangan",
    group: "software",
    status: "soon",
    hue: ["#34D399", "#059669"],
    icon: "M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2zM4 5v16M9 8h6M9 12h6",
  },
  {
    slug: "tapstock",
    name: "TapStock",
    summary: "Catat stok bahan dan barang, dapat peringatan saat hampir habis.",
    category: "Operasional",
    group: "software",
    status: "soon",
    hue: ["#FBBF24", "#D97706"],
    icon: "M12 3l8 4.5v9L12 21l-8-4.5v-9zM12 12l8-4.5M12 12v9M12 12L4 7.5",
  },
  {
    slug: "tapstaff",
    name: "TapStaff",
    summary: "Absensi, jadwal shift, dan penggajian karyawan dalam satu tempat.",
    category: "Operasional",
    group: "software",
    status: "soon",
    hue: ["#F472B6", "#BE185D"],
    icon: "M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20a6 6 0 0 1 12 0M17 11a2.5 2.5 0 1 0 0-5M21 20a5 5 0 0 0-3-4.6",
  },
  {
    slug: "tapreserve",
    name: "TapReserve",
    summary: "Reservasi meja dan booking jadwal, pelanggan memilih waktunya sendiri.",
    category: "Operasional",
    group: "software",
    status: "soon",
    hue: ["#2DD4BF", "#0F766E"],
    icon: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4M8 14h3",
  },
  {
    slug: "taployalty",
    name: "TapLoyalty",
    summary: "Poin dan member untuk pelanggan yang sering kembali.",
    category: "Penjualan",
    group: "platform",
    status: "soon",
    hue: ["#FB923C", "#EA580C"],
    icon: "M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.9z",
  },
  {
    slug: "taphealth",
    name: "TapHealth",
    summary: "Catat makanan dan aktivitas harian untuk pola hidup yang lebih sehat.",
    category: "Gaya hidup",
    group: "platform",
    status: "soon",
    hue: ["#4ADE80", "#16A34A"],
    icon: "M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10zM8 11h2l1-2 2 4 1-2h2",
  },
];

export type Service = { slug: string; name: string; summary: string; icon: string };

/** Layanan pendampingan TapHub (tab "Layanan") */
export const services: Service[] = [
  {
    slug: "implementasi",
    name: "Implementasi dan setup",
    summary: "Tim kami membantu pendaftaran, mengatur outlet, meja, printer, dan metode pembayaran sampai siap dipakai.",
    icon: "M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z",
  },
  {
    slug: "migrasi",
    name: "Migrasi data",
    summary: "Pindahkan daftar menu, produk, stok, dan data pelanggan dari sistem atau catatan lama ke TapHub.",
    icon: "M4 7h11l-3-3M20 17H9l3 3",
  },
  {
    slug: "pelatihan",
    name: "Pelatihan tim",
    summary: "Pengenalan cara pakai untuk pemilik, kasir, dan staf dapur, supaya semua bisa langsung bekerja.",
    icon: "M3 7l9-4 9 4-9 4zM7 9v5c0 1.7 2.2 3 5 3s5-1.3 5-3V9",
  },
  {
    slug: "dukungan",
    name: "Dukungan pelanggan",
    summary: "Tanya kendala atau minta bantuan lewat WhatsApp dan email langsung ke tim TapHub.",
    icon: "M4 14v-3a8 8 0 0 1 16 0v3M4 14a2 2 0 0 0 2 2h1v-5H6a2 2 0 0 0-2 2zM20 14a2 2 0 0 1-2 2h-1v-5h1a2 2 0 0 1 2 2zM17 16c0 2-2 3-5 3",
  },
];
