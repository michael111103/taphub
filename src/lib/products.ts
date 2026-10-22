export type ProductCategory = "Penjualan" | "Keuangan" | "Operasional" | "Gaya hidup";
export type ProductStatus = "pilot" | "soon";

export type Product = {
  slug: string;
  name: string;
  summary: string;
  category: ProductCategory;
  status: ProductStatus;
  /** Dua warna gradasi untuk ikon produk */
  hue: [string, string];
  /** Path SVG 24x24 untuk ikon */
  icon: string;
};

export const categories: ProductCategory[] = ["Penjualan", "Keuangan", "Operasional", "Gaya hidup"];

export const products: Product[] = [
  {
    slug: "taporder",
    name: "TapOrder",
    summary: "Pelanggan scan QR di meja, pesan, dan bayar sendiri. Pesanan langsung masuk ke kasir dan dapur.",
    category: "Penjualan",
    status: "pilot",
    hue: ["#38C8F8", "#1B5BFF"],
    icon: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2z",
  },
  {
    slug: "tappos",
    name: "TapPOS",
    summary: "Kasir untuk mencatat penjualan di counter, lengkap dengan struk dan laporan harian.",
    category: "Penjualan",
    status: "soon",
    hue: ["#22D3EE", "#0891B2"],
    icon: "M4 5h16v10H4zM8 19h8M12 15v4M7 9h4",
  },
  {
    slug: "tappay",
    name: "TapPay",
    summary: "Link pembayaran dan QRIS untuk tagihan online, diproses lewat payment gateway berlisensi.",
    category: "Keuangan",
    status: "soon",
    hue: ["#60A5FA", "#4F46E5"],
    icon: "M3 7h18v10H3zM3 11h18M7 15h3",
  },
  {
    slug: "tapinvoice",
    name: "TapInvoice",
    summary: "Buat dan kirim invoice ke pelanggan, lalu pantau mana yang sudah dibayar.",
    category: "Keuangan",
    status: "soon",
    hue: ["#A78BFA", "#6D28D9"],
    icon: "M6 3h9l3 3v15H6zM9 9h6M9 13h6M9 17h4",
  },
  {
    slug: "tapbooks",
    name: "TapBooks",
    summary: "Pembukuan dan laporan keuangan otomatis, bisa terhubung ke penjualan marketplace.",
    category: "Keuangan",
    status: "soon",
    hue: ["#34D399", "#059669"],
    icon: "M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2zM4 5v16M9 8h6M9 12h6",
  },
  {
    slug: "tapstock",
    name: "TapStock",
    summary: "Catat stok bahan dan barang, dapat peringatan saat hampir habis.",
    category: "Operasional",
    status: "soon",
    hue: ["#FBBF24", "#D97706"],
    icon: "M12 3l8 4.5v9L12 21l-8-4.5v-9zM12 12l8-4.5M12 12v9M12 12L4 7.5",
  },
  {
    slug: "tapstaff",
    name: "TapStaff",
    summary: "Absensi, jadwal shift, dan penggajian karyawan dalam satu tempat.",
    category: "Operasional",
    status: "soon",
    hue: ["#F472B6", "#BE185D"],
    icon: "M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20a6 6 0 0 1 12 0M17 11a2.5 2.5 0 1 0 0-5M21 20a5 5 0 0 0-3-4.6",
  },
  {
    slug: "tapreserve",
    name: "TapReserve",
    summary: "Reservasi meja dan booking jadwal, pelanggan memilih waktunya sendiri.",
    category: "Operasional",
    status: "soon",
    hue: ["#2DD4BF", "#0F766E"],
    icon: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4M8 14h3",
  },
  {
    slug: "taployalty",
    name: "TapLoyalty",
    summary: "Poin dan member untuk pelanggan yang sering kembali.",
    category: "Penjualan",
    status: "soon",
    hue: ["#FB923C", "#EA580C"],
    icon: "M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.9z",
  },
  {
    slug: "taphealth",
    name: "TapHealth",
    summary: "Catat makanan dan aktivitas harian untuk pola hidup yang lebih sehat.",
    category: "Gaya hidup",
    status: "soon",
    hue: ["#4ADE80", "#16A34A"],
    icon: "M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10zM8 11h2l1-2 2 4 1-2h2",
  },
];
