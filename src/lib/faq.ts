export type Faq = { q: string; a: string };

/** FAQ umum di beranda (company profile TapHub) */
export const companyFaqs: Faq[] = [
  {
    q: "Apa itu TapHub?",
    a: "TapHub adalah perusahaan software berbasis cloud (Software as a Service) asal Indonesia yang membangun ekosistem aplikasi bisnis untuk usaha kecil dan menengah. Produk-produk TapHub membantu pemilik usaha mengelola penjualan, keuangan, dan operasional dalam satu ekosistem yang saling terhubung, sehingga pekerjaan manual berkurang dan keputusan bisa diambil berdasarkan data. TapHub dikembangkan dan dikelola oleh PT Bara Karbon Internasional yang berkedudukan di Jakarta Selatan.",
  },
  {
    q: "Apa saja solusi yang ditawarkan oleh TapHub?",
    a: "TapHub menawarkan solusi di empat bidang. Penjualan: pemesanan lewat scan QR, kasir, serta program poin dan member pelanggan. Keuangan: link pembayaran, invoice, dan pembukuan otomatis. Operasional: pengelolaan stok, absensi dan penggajian karyawan, serta reservasi. Gaya hidup: pencatatan pola makan dan aktivitas harian untuk hidup lebih sehat.",
  },
  {
    q: "Produk apa saja yang dimiliki TapHub?",
    a: "Rangkaian produk TapHub terdiri dari TapOrder (pemesanan scan QR), TapPOS (kasir), TapPay (link pembayaran dan QRIS), TapInvoice (invoice), TapBooks (pembukuan), TapStock (stok), TapStaff (karyawan), TapReserve (reservasi), TapLoyalty (poin dan member), dan TapHealth (pola hidup sehat). TapOrder adalah produk pertama yang sudah bisa didaftarkan, sementara produk lainnya dirilis secara bertahap.",
  },
  {
    q: "Siapa saja yang dapat menggunakan TapHub?",
    a: "TapHub dirancang untuk usaha dari berbagai skala dan sektor: cafe, kedai kopi, restoran, food court, toko retail, hingga usaha jasa. Produk TapHub cocok untuk pemilik usaha yang baru mulai digitalisasi maupun usaha yang sudah memiliki beberapa cabang. Untuk kebutuhan pribadi, TapHealth bisa dipakai oleh siapa saja.",
  },
  {
    q: "Apakah semua produk TapHub saling terintegrasi?",
    a: "Ya. Semua produk TapHub dirancang untuk terhubung dalam satu akun dan berbagi data. Misalnya, penjualan dari TapOrder atau TapPOS dapat langsung mengurangi stok di TapStock dan tercatat sebagai jurnal di TapBooks, tanpa perlu input ulang. Integrasi ini aktif seiring tersedianya setiap produk.",
  },
  {
    q: "Bagaimana TapHub membantu meningkatkan efisiensi bisnis?",
    a: "TapHub mengotomatiskan pekerjaan yang biasanya dilakukan manual: mencatat pesanan, menghitung tagihan, merekap penjualan, memantau stok, hingga menyusun laporan keuangan. Dengan begitu, risiko salah catat berkurang, antrean di kasir lebih pendek, dan pemilik usaha bisa melihat kondisi bisnis secara real time dari HP atau laptop.",
  },
  {
    q: "Bagaimana TapHub menjaga keamanan data dan transaksi?",
    a: "Seluruh koneksi ke layanan TapHub dienkripsi, dan pengelolaan data pribadi mengacu pada Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi. Pembayaran pelanggan diproses oleh payment gateway berlisensi dan masuk ke saldo akun usahamu sendiri, bukan ke rekening TapHub. Kami tidak menjual data pengguna kepada pihak mana pun.",
  },
  {
    q: "Berapa biaya menggunakan TapHub?",
    a: "Setiap produk TapHub memiliki skema harga sendiri, sehingga kamu hanya membayar produk yang dipakai. Sebagai contoh, TapOrder dikenakan Rp599 per transaksi yang berhasil, tanpa biaya pembelian alat. Harga produk lainnya diumumkan saat produk tersebut dirilis.",
  },
  {
    q: "Bagaimana cara mulai menggunakan TapHub?",
    a: "Klik tombol Konsultasi sekarang atau hubungi kami lewat WhatsApp. Tim TapHub akan mempelajari kebutuhan usahamu, merekomendasikan produk yang sesuai, lalu membantu proses pendaftaran, pengaturan awal, dan pengenalan cara pakai sampai usahamu siap berjalan.",
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
