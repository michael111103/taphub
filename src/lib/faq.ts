export type Faq = { q: string; a: string };

/** FAQ umum di beranda (company profile TapHub) */
export const companyFaqs: Faq[] = [
  {
    q: "Apa itu TapHub?",
    a: "TapHub adalah ekosistem software untuk menjalankan usaha di Indonesia: penjualan, keuangan, operasional, dan gaya hidup. Setiap produk Tap bisa dipakai sendiri atau digabung sesuai kebutuhan usahamu.",
  },
  {
    q: "Siapa perusahaan di balik TapHub?",
    a: "TapHub dikembangkan dan dikelola oleh PT Bara Karbon Internasional, perseroan yang berkedudukan di Jakarta Selatan.",
  },
  {
    q: "Produk apa yang sudah bisa dipakai?",
    a: "TapOrder, aplikasi pemesanan dan pembayaran lewat scan QR untuk cafe dan restoran, sedang membuka program pilot. Produk lain seperti TapPOS, TapBooks, dan TapInvoice sedang kami siapkan dan dirilis bertahap.",
  },
  {
    q: "Apakah harus memakai semua produk Tap?",
    a: "Tidak. Kamu bisa mulai dari satu produk saja. Produk lain bisa ditambahkan saat usahamu membutuhkannya.",
  },
  {
    q: "Bagaimana TapHub menangani pembayaran?",
    a: "Pembayaran diproses oleh payment gateway berlisensi dan masuk ke saldo akun usahamu sendiri, bukan ke rekening TapHub.",
  },
  {
    q: "Bagaimana cara menghubungi TapHub?",
    a: "Lewat WhatsApp atau email yang tercantum di bagian kontak. Tim kami akan membantu memilih produk yang sesuai untuk usahamu.",
  },
];

/** FAQ khusus landing page TapOrder */
export const taporderFaqs: Faq[] = [
  {
    q: "Apa itu TapOrder?",
    a: "TapOrder adalah aplikasi pemesanan lewat scan QR untuk cafe dan restoran. Pelanggan scan QR di meja, memilih menu, dan membayar dari HP. Pesanan langsung masuk ke dashboard kasir dan dapur lengkap dengan nomor meja.",
  },
  {
    q: "Apakah pelanggan perlu install aplikasi?",
    a: "Tidak. Pelanggan cukup scan QR di meja dengan kamera HP. Menu terbuka di browser, lalu mereka memesan dan membayar dari sana.",
  },
  {
    q: "Perangkat apa yang dibutuhkan usaha saya?",
    a: "Cukup satu tablet, HP, atau laptop dengan internet untuk membuka dashboard kasir. Tidak perlu membeli mesin kasir khusus. Printer struk bisa ditambahkan nanti jika diperlukan.",
  },
  {
    q: "Uang dari pelanggan masuk ke mana?",
    a: "Pembayaran diproses oleh payment gateway berlisensi dan masuk ke saldo akun usahamu sendiri, bukan ke rekening TapHub. Dari sana dana bisa dicairkan ke rekening bank usahamu.",
  },
  {
    q: "Berapa biaya TapOrder?",
    a: "Rp599 per transaksi yang berhasil dibayar. Biaya metode pembayaran (misalnya QRIS) mengikuti tarif payment gateway dan ditampilkan terpisah. Hubungi kami untuk detail program pilot.",
  },
  {
    q: "Bagaimana kalau pelanggan mau bawa pulang?",
    a: "Pasang QR di meja kasir untuk pesanan take away. Pesanan tetap masuk ke dashboard, ditandai sebagai take away.",
  },
];
