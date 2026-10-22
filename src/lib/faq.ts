export type Faq = { q: string; a: string };

/** FAQ umum di beranda (company profile TapHub) */
export const companyFaqs: Faq[] = [
  {
    q: "Apa itu TapHub?",
    a: "TapHub adalah perusahaan software berbasis cloud (Software as a Service) asal Indonesia yang membangun ekosistem aplikasi bisnis untuk usaha kecil dan menengah. Produk-produk TapHub membantu pemilik usaha mengelola penjualan, keuangan, dan operasional dalam satu ekosistem yang saling terhubung, sehingga pekerjaan manual berkurang dan keputusan bisa diambil berdasarkan data. TapHub dikembangkan dan dikelola oleh PT Bara Karbon Internasional yang berkedudukan di Jakarta Selatan.",
  },
  {
    q: "Apa saja solusi yang ditawarkan oleh TapHub?",
    a: "TapHub menawarkan solusi di empat bidang. Penjualan: aplikasi kasir dan manajemen pesanan, termasuk pesan lewat scan QR di meja, serta program poin dan member pelanggan. Keuangan: link pembayaran, invoice, dan pembukuan otomatis. Operasional: pengelolaan stok, absensi dan penggajian karyawan, serta reservasi. Gaya hidup: pencatatan pola makan dan aktivitas harian untuk hidup lebih sehat.",
  },
  {
    q: "Produk apa saja yang dimiliki TapHub?",
    a: "Rangkaian produk TapHub terdiri dari TapPOS (aplikasi kasir dan sistem POS), TapPay (link pembayaran dan QRIS), TapInvoice (invoice), TapBooks (pembukuan), TapStock (stok), TapStaff (karyawan), TapReserve (reservasi), TapLoyalty (poin dan member), dan TapHealth (pola hidup sehat). TapPOS adalah produk unggulan pertama kami, sementara produk lainnya dirilis secara bertahap.",
  },
  {
    q: "Siapa saja yang dapat menggunakan TapHub?",
    a: "TapHub dirancang untuk usaha dari berbagai skala dan sektor: cafe, kedai kopi, restoran, food court, toko retail, hingga usaha jasa. Produk TapHub cocok untuk pemilik usaha yang baru mulai digitalisasi maupun usaha yang sudah memiliki beberapa cabang. Untuk kebutuhan pribadi, TapHealth bisa dipakai oleh siapa saja.",
  },
  {
    q: "Apakah semua produk TapHub saling terintegrasi?",
    a: "Ya. Semua produk TapHub dirancang untuk terhubung dalam satu akun dan berbagi data. Misalnya, penjualan dari TapPOS dapat langsung mengurangi stok di TapStock dan tercatat sebagai jurnal di TapBooks, tanpa perlu input ulang. Integrasi ini aktif seiring tersedianya setiap produk.",
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
    a: "Setiap produk TapHub memiliki skema harga sendiri, sehingga kamu hanya membayar produk yang dipakai. Untuk TapPOS, harga disesuaikan dengan jumlah outlet dan fitur yang dibutuhkan, jadi hubungi tim kami untuk mendapatkan penawaran. Harga produk lainnya diumumkan saat produk tersebut dirilis.",
  },
  {
    q: "Bagaimana cara mulai menggunakan TapHub?",
    a: "Klik tombol Konsultasi sekarang atau hubungi kami lewat WhatsApp. Tim TapHub akan mempelajari kebutuhan usahamu, merekomendasikan produk yang sesuai, lalu membantu proses pendaftaran, pengaturan awal, dan pengenalan cara pakai sampai usahamu siap berjalan.",
  },
];

/** FAQ khusus landing page TapPOS */
export const posFaqs: Faq[] = [
  {
    q: "Apa itu TapPOS?",
    a: "TapPOS adalah aplikasi kasir dan sistem point of sale (POS) berbasis cloud untuk usaha F&B, retail, dan jasa. TapPOS menyatukan transaksi kasir, pesanan, stok, promo, dan laporan penjualan dari semua outlet dalam satu sistem yang bisa dipantau dari HP, tablet, atau laptop.",
  },
  {
    q: "Usaha apa saja yang cocok memakai TapPOS?",
    a: "TapPOS dirancang untuk restoran, cafe dan kedai kopi, food court, quick service restaurant, cloud kitchen, toko fashion, toko kelontong dan minimarket, toko spesialis, barbershop dan salon, apotek, hingga toko elektronik. Fiturnya bisa diatur sesuai alur kerja tiap jenis usaha.",
  },
  {
    q: "Perangkat apa yang dibutuhkan untuk memakai TapPOS?",
    a: "TapPOS berjalan di browser, jadi cukup memakai tablet, HP, atau laptop yang terhubung ke internet. Tidak perlu membeli mesin kasir khusus. Printer struk dan laci uang bisa ditambahkan sesuai kebutuhan outlet.",
  },
  {
    q: "Apakah TapPOS bisa dipakai untuk banyak cabang?",
    a: "Bisa. Dari satu dashboard pusat, pemilik usaha dapat memantau penjualan setiap outlet secara real time, membandingkan performa antarcabang, mengatur hak akses karyawan, serta menyamakan menu, harga, dan promo ke semua outlet sekaligus.",
  },
  {
    q: "Metode pembayaran apa saja yang didukung?",
    a: "TapPOS mendukung pembayaran tunai, QRIS, e-wallet, kartu debit dan kredit, serta virtual account. Pembayaran nontunai diproses oleh payment gateway berlisensi dan masuk ke saldo usahamu sendiri. TapPOS juga mendukung split bill dan refund.",
  },
  {
    q: "Apakah pelanggan bisa memesan sendiri lewat scan QR?",
    a: "Bisa. Setiap meja dapat memiliki kode QR sendiri. Pelanggan scan QR, memilih menu, dan membayar dari HP, lalu pesanan langsung masuk ke kasir dan dapur lengkap dengan nomor meja. Pesanan dine-in, take away, dan delivery dikelola dalam satu sistem.",
  },
  {
    q: "Apakah TapPOS bisa membantu mengelola stok?",
    a: "Bisa. TapPOS mencatat stok bahan baku dan barang jadi di setiap outlet, mengurangi stok otomatis setiap ada penjualan, mendukung transfer stok antarcabang, dan memberi peringatan saat stok hampir habis.",
  },
  {
    q: "Apakah data penjualan TapPOS terhubung ke pembukuan?",
    a: "TapPOS dirancang terhubung dengan produk TapHub lain. Penjualan dari TapPOS dapat tercatat otomatis di TapBooks untuk pembukuan dan mengurangi stok di TapStock, sehingga tidak perlu rekap manual. Integrasi ini aktif seiring tersedianya setiap produk.",
  },
  {
    q: "Berapa biaya berlangganan TapPOS?",
    a: "Harga TapPOS disesuaikan dengan jumlah outlet dan fitur yang dibutuhkan usahamu. Klik Konsultasi sekarang atau hubungi tim kami lewat WhatsApp untuk mendapatkan penawaran.",
  },
  {
    q: "Bagaimana cara mulai memakai TapPOS?",
    a: "Hubungi tim TapHub lewat tombol Konsultasi sekarang atau WhatsApp. Kami akan mempelajari kebutuhan usahamu, menjadwalkan demo, lalu membantu pendaftaran, input menu atau produk, dan pengenalan cara pakai untuk tim kasirmu.",
  },
];
