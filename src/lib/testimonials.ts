export type Testimonial = {
  quote: string;
  name: string;
  role: string; // contoh: "Pemilik Kopi Senja"
  city: string;
  rating?: 1 | 2 | 3 | 4 | 5;
};

/**
 * Testimoni pengguna TapPOS.
 *
 * Bagian testimoni di halaman TapPOS otomatis TERSEMBUNYI selama daftar ini kosong,
 * dan otomatis MUNCUL begitu diisi.
 *
 * Isi hanya dengan testimoni asli dari pengguna, dan minta izin mereka sebelum
 * nama dan nama usahanya ditampilkan. Testimoni karangan yang ditampilkan seolah asli
 * bisa menyesatkan konsumen dan berisiko secara hukum.
 *
 * Contoh format (hapus tanda komentar dan ganti dengan data asli):
 * {
 *   quote: "Sejak pakai TapPOS, rekap penjualan harian tidak perlu manual lagi.",
 *   name: "Nama Pengguna",
 *   role: "Pemilik Nama Usaha",
 *   city: "Semarang",
 *   rating: 5,
 * },
 */
export const posTestimonials: Testimonial[] = [];
