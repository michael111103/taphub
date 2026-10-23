export type Testimonial = {
  quote: string;
  name: string;
  role: string; // contoh: "Pemilik Kopi Senja"
  city: string;
  rating?: 1 | 2 | 3 | 4 | 5;
};

/*
 * TESTIMONI ASLI
 *
 * Carousel testimoni otomatis MUNCUL di website begitu daftar di bawah ini diisi,
 * dan otomatis TERSEMBUNYI selama masih kosong.
 *
 * Isi hanya dengan testimoni asli dari pengguna, dan minta izin mereka sebelum
 * nama dan nama usahanya ditampilkan. Testimoni karangan yang ditampilkan seolah asli
 * bisa menyesatkan konsumen dan berisiko secara hukum.
 *
 * Format:
 * {
 *   quote: "Sejak pakai TapPOS, rekap penjualan harian tidak perlu manual lagi.",
 *   name: "Nama Pengguna",
 *   role: "Pemilik Nama Usaha",
 *   city: "Semarang",
 *   rating: 5,
 * },
 */

/** Testimoni di beranda taphub.id (menggantikan bagian "Tentang TapHub" saat diisi) */
export const companyTestimonials: Testimonial[] = [];

/** Testimoni di halaman TapPOS (pos.taphub.id) */
export const posTestimonials: Testimonial[] = [];

/**
 * CONTOH TESTIMONI, hanya untuk melihat desain di halaman pratinjau /pratinjau/testimoni
 * (tidak diindeks Google dan tidak ditautkan dari halaman mana pun).
 * Jangan dipindahkan ke daftar testimoni asli di atas.
 */
export const sampleTestimonials: Testimonial[] = [
  {
    quote: "Sejak pakai kasir digital, antrean di jam makan siang jauh lebih cepat dan saya tidak perlu rekap penjualan manual tiap malam.",
    name: "Contoh Nama 1",
    role: "Pemilik cafe",
    city: "Semarang",
    rating: 5,
  },
  {
    quote: "Laporan harian bisa saya cek dari HP. Jadi tahu menu mana yang paling laku dan kapan harus belanja bahan lagi.",
    name: "Contoh Nama 2",
    role: "Pemilik restoran",
    city: "Yogyakarta",
    rating: 5,
  },
  {
    quote: "Stok dua cabang sekarang terpantau dari satu dashboard. Selisih barang jauh berkurang dibanding waktu masih pakai buku.",
    name: "Contoh Nama 3",
    role: "Pemilik toko retail",
    city: "Surabaya",
    rating: 5,
  },
  {
    quote: "Pelanggan bisa pesan sendiri lewat scan QR di meja, staf kami jadi lebih fokus menyiapkan pesanan.",
    name: "Contoh Nama 4",
    role: "Pengelola kedai kopi",
    city: "Jakarta",
    rating: 4,
  },
];
