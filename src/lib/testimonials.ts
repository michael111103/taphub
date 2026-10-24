export type Testimonial = {
  quote: string;
  name: string;
  role: string; // contoh: "Pemilik Kopi Senja"
  city?: string;
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
export const companyTestimonials: Testimonial[] = [
  {
    quote: "Buat bisnis yang baru banget berdiri, TapHub banyak banget membantu. Fitur-fiturnya yang lengkap dan simpel membuat kami yang bukan dari background akuntansi jadi mudah memahami.",
    name: "Andre Susanto",
    role: "PT Pratama Nusantara Prakarsa",
  },
  {
    quote: "Customer support TapHub menjelaskan dengan sangat jelas dan mudah dimengerti. Ternyata pakai software akuntansi nggak sesulit yang kami kira.",
    name: "Silmi Wildan",
    role: "Pemilik 99 Persen Coffee",
  },
];

/** Testimoni di halaman TapPOS (pos.taphub.id) */
export const posTestimonials: Testimonial[] = [];

/** Testimoni di website.taphub.id (TapWebsite) */
export const websiteTestimonials: Testimonial[] = [];
