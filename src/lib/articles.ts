/**
 * Artikel blog TapHub.
 *
 * Menambah artikel baru: salin salah satu objek di daftar `articles`, ganti isinya,
 * lalu taruh gambar sampulnya di public/images/. Halaman, sitemap, dan data SEO
 * dibuat otomatis.
 *
 * Jenis blok isi artikel:
 *   { type: "p", text }            paragraf
 *   { type: "h2", text }           subjudul (otomatis masuk daftar isi)
 *   { type: "h3", text }           sub-subjudul
 *   { type: "ul", items }          daftar berpoin
 *   { type: "ol", items }          daftar bernomor
 *   { type: "callout", text }      kotak sorotan
 */
export type Block =
  | { type: "p" | "h2" | "h3" | "callout"; text: string }
  | { type: "ul" | "ol"; items: string[] };

export type Article = {
  slug: string;
  title: string;
  description: string;
  category: string;
  /** Tanggal terbit, format YYYY-MM-DD */
  date: string;
  /** Tanggal diperbarui, format YYYY-MM-DD (opsional) */
  updated?: string;
  author: string;
  readingMinutes: number;
  image: { src: string; alt: string };
  keywords: string[];
  body: Block[];
};

export const articles: Article[] = [
  {
    slug: "cara-memilih-aplikasi-kasir-cafe-restoran",
    title: "Cara Memilih Aplikasi Kasir untuk Cafe dan Restoran: 8 Hal yang Wajib Dicek",
    description:
      "Panduan memilih aplikasi kasir (POS) untuk cafe dan restoran: alur pesanan, perangkat, metode pembayaran, stok, laporan, karyawan, multicabang, hingga biaya.",
    category: "Tips Bisnis",
    date: "2026-10-23",
    author: "Tim TapHub",
    readingMinutes: 7,
    image: {
      src: "/images/artikel1.png",
      alt: "Kasir cafe melayani pelanggan memakai aplikasi kasir di tablet",
    },
    keywords: ["aplikasi kasir cafe", "aplikasi kasir restoran", "cara memilih aplikasi kasir", "aplikasi POS cafe", "software kasir"],
    body: [
      {
        type: "p",
        text: "Aplikasi kasir bukan lagi sekadar alat untuk mencetak struk. Untuk cafe dan restoran, aplikasi kasir atau sistem POS (point of sale) menjadi pusat operasional: dari mencatat pesanan, meneruskannya ke dapur, menerima pembayaran, sampai menyusun laporan penjualan harian. Karena perannya sebesar itu, salah memilih aplikasi kasir bisa membuat antrean makin panjang, stok berantakan, dan laporan sulit dipercaya.",
      },
      {
        type: "p",
        text: "Supaya tidak salah pilih, berikut delapan hal yang sebaiknya kamu cek sebelum memutuskan aplikasi kasir untuk usaha F&B.",
      },
      { type: "h2", text: "1. Alur pesanan sesuai jenis usahamu" },
      {
        type: "p",
        text: "Setiap usaha F&B punya alur pesanan yang berbeda. Cafe dengan konsep pesan di kasir butuh proses yang cepat di meja kasir, sedangkan restoran dengan layanan di meja butuh pencatatan per nomor meja. Pastikan aplikasi kasir yang kamu pilih bisa menangani semua jenis pesanan yang kamu layani.",
      },
      {
        type: "ul",
        items: [
          "Dine-in dengan nomor meja",
          "Take away dan pesanan bungkus",
          "Delivery, baik kurir sendiri maupun aplikasi pesan antar",
          "Pesan sendiri lewat scan QR di meja, supaya pelanggan tidak perlu antre",
        ],
      },
      {
        type: "p",
        text: "Perhatikan juga apakah pesanan bisa langsung diteruskan ke dapur atau bar. Alur dari kasir ke dapur yang rapi mengurangi salah catat dan pesanan yang terlewat saat jam ramai.",
      },
      { type: "h2", text: "2. Perangkat yang dibutuhkan" },
      {
        type: "p",
        text: "Dulu, sistem kasir identik dengan mesin khusus yang mahal. Sekarang, banyak aplikasi kasir berbasis cloud yang cukup dijalankan di tablet, HP, atau laptop. Cek perangkat apa saja yang didukung, dan apakah kamu bisa memakai perangkat yang sudah ada.",
      },
      {
        type: "p",
        text: "Tanyakan juga perangkat tambahan yang kompatibel, seperti printer struk, printer dapur, laci uang, dan pemindai barcode. Semakin fleksibel, semakin kecil biaya awal yang perlu kamu keluarkan.",
      },
      { type: "h2", text: "3. Metode pembayaran yang lengkap" },
      {
        type: "p",
        text: "Pelanggan cafe dan restoran membayar dengan cara yang beragam. Aplikasi kasir yang baik mendukung pembayaran tunai, QRIS, e-wallet, kartu debit dan kredit, serta mencatat semuanya dalam satu laporan.",
      },
      {
        type: "p",
        text: "Fitur seperti split bill (satu tagihan dibayar beberapa orang) dan refund juga penting untuk usaha F&B. Untuk pembayaran nontunai, pastikan prosesnya lewat payment gateway berlisensi dan dana masuk ke rekening atau saldo usahamu sendiri.",
      },
      { type: "h2", text: "4. Manajemen stok dan bahan baku" },
      {
        type: "p",
        text: "Untuk usaha F&B, stok bukan hanya barang jadi, tapi juga bahan baku seperti kopi, susu, dan gula. Aplikasi kasir yang terhubung dengan stok bisa mengurangi bahan baku otomatis setiap kali menu terjual, sehingga kamu tahu kapan harus belanja lagi.",
      },
      {
        type: "callout",
        text: "Tips: pilih aplikasi kasir yang bisa memberi peringatan saat stok hampir habis. Menu yang tiba-tiba kosong di jam ramai berarti penjualan yang hilang.",
      },
      { type: "h2", text: "5. Laporan penjualan yang mudah dibaca" },
      {
        type: "p",
        text: "Laporan adalah alasan utama banyak pemilik usaha beralih dari pencatatan manual. Cek apakah aplikasi kasir menyediakan laporan penjualan harian, menu terlaris, jam paling ramai, dan perbandingan antarperiode. Laporan yang bisa dibuka dari HP memudahkan kamu memantau usaha tanpa harus selalu berada di outlet.",
      },
      { type: "h2", text: "6. Pengelolaan karyawan dan hak akses" },
      {
        type: "p",
        text: "Saat usaha berkembang, kamu akan punya beberapa kasir dan staf. Pastikan aplikasi kasir bisa membuat akun terpisah untuk setiap karyawan, mengatur hak akses (misalnya kasir tidak bisa menghapus transaksi), dan mencatat siapa yang memproses setiap transaksi. Ini membantu mencegah selisih kas dan memudahkan evaluasi kinerja.",
      },
      { type: "h2", text: "7. Siap untuk banyak cabang" },
      {
        type: "p",
        text: "Meskipun sekarang baru punya satu outlet, pilih aplikasi kasir yang siap untuk multicabang. Dengan sistem terpusat, kamu bisa memantau penjualan semua outlet dari satu dashboard, menyamakan menu dan harga, serta membandingkan performa antarcabang. Pindah sistem di tengah jalan biasanya jauh lebih repot daripada memilih yang tepat sejak awal.",
      },
      { type: "h2", text: "8. Biaya, dukungan, dan pendampingan" },
      {
        type: "p",
        text: "Bandingkan skema biaya dengan teliti: apakah berlangganan bulanan, per transaksi, atau per outlet, dan apakah ada biaya tambahan untuk fitur tertentu. Jangan lupa cek dukungan setelah pembelian. Bantuan saat pemasangan, migrasi menu, dan pelatihan kasir akan sangat menentukan seberapa cepat aplikasi bisa dipakai dengan lancar.",
      },
      { type: "h2", text: "Checklist singkat sebelum memilih" },
      {
        type: "ol",
        items: [
          "Mendukung semua jenis pesanan yang kamu layani",
          "Bisa jalan di perangkat yang sudah kamu punya",
          "Mendukung tunai, QRIS, e-wallet, dan kartu",
          "Stok bahan baku berkurang otomatis setiap ada penjualan",
          "Laporan harian bisa dibuka dari HP",
          "Akun dan hak akses terpisah untuk setiap karyawan",
          "Siap dipakai untuk lebih dari satu cabang",
          "Biaya jelas dan ada pendampingan saat mulai",
        ],
      },
      { type: "h2", text: "Kesimpulan" },
      {
        type: "p",
        text: "Aplikasi kasir yang tepat membuat operasional cafe dan restoran lebih cepat, rapi, dan mudah dipantau. Mulailah dari kebutuhan usahamu sekarang, tapi pastikan sistemnya siap mengikuti pertumbuhan usaha ke depan.",
      },
      {
        type: "p",
        text: "TapPOS dari TapHub dirancang untuk kebutuhan tersebut: kasir dan manajemen pesanan, pesan lewat scan QR, stok, promo, multicabang, dan laporan dalam satu sistem. Jika ingin melihat apakah TapPOS cocok untuk usahamu, tim kami siap membantu lewat konsultasi.",
      },
    ],
  },
  {
    slug: "apa-itu-sistem-pos",
    title: "Apa Itu Sistem POS? Pengertian, Cara Kerja, dan Manfaatnya untuk UMKM",
    description:
      "Penjelasan lengkap sistem POS (point of sale): pengertian, komponen, cara kerja, perbedaan POS tradisional dan berbasis cloud, serta manfaatnya untuk UMKM.",
    category: "Panduan",
    date: "2026-10-23",
    author: "Tim TapHub",
    readingMinutes: 6,
    image: {
      src: "/images/artikel2.png",
      alt: "Pemilik toko memeriksa laporan penjualan dari sistem POS di laptop",
    },
    keywords: ["sistem POS", "apa itu POS", "pengertian point of sale", "sistem POS adalah", "POS untuk UMKM"],
    body: [
      {
        type: "p",
        text: "Istilah POS sering terdengar saat membicarakan aplikasi kasir, tapi belum semua pemilik usaha memahami apa sebenarnya sistem POS dan apa bedanya dengan mesin kasir biasa. Artikel ini membahas pengertian sistem POS, komponennya, cara kerjanya, dan manfaatnya untuk UMKM di Indonesia.",
      },
      { type: "h2", text: "Pengertian sistem POS" },
      {
        type: "p",
        text: "POS adalah singkatan dari point of sale, yaitu titik ketika transaksi penjualan terjadi antara penjual dan pembeli. Sistem POS adalah gabungan perangkat lunak dan perangkat keras yang dipakai untuk mencatat transaksi tersebut, menerima pembayaran, dan menyimpan datanya untuk keperluan laporan.",
      },
      {
        type: "p",
        text: "Berbeda dengan mesin kasir konvensional yang hanya menghitung total belanja, sistem POS modern juga mengelola stok, data pelanggan, karyawan, promo, hingga laporan penjualan secara otomatis.",
      },
      { type: "h2", text: "Komponen sistem POS" },
      { type: "h3", text: "Perangkat lunak" },
      {
        type: "p",
        text: "Inilah inti dari sistem POS: aplikasi tempat kasir memasukkan pesanan dan pemilik usaha melihat laporan. Aplikasi POS modern umumnya berbasis cloud, sehingga data tersimpan di server dan bisa diakses dari mana saja.",
      },
      { type: "h3", text: "Perangkat keras" },
      {
        type: "p",
        text: "Perangkat untuk menjalankan aplikasi, seperti tablet, HP, atau komputer, ditambah perangkat pendukung seperti printer struk, laci uang, dan pemindai barcode.",
      },
      { type: "h3", text: "Metode pembayaran" },
      {
        type: "p",
        text: "Sistem POS terhubung dengan berbagai cara bayar: tunai, QRIS, e-wallet, kartu debit, dan kartu kredit. Pembayaran nontunai biasanya diproses melalui payment gateway atau mesin EDC.",
      },
      { type: "h2", text: "Cara kerja sistem POS" },
      {
        type: "ol",
        items: [
          "Kasir memilih produk atau menu yang dibeli pelanggan di aplikasi POS.",
          "Sistem menghitung total, termasuk diskon, pajak, atau biaya layanan.",
          "Pelanggan membayar dengan metode yang dipilih, lalu struk dicetak atau dikirim secara digital.",
          "Stok produk atau bahan baku berkurang otomatis sesuai barang yang terjual.",
          "Data transaksi tersimpan dan langsung masuk ke laporan penjualan.",
        ],
      },
      { type: "h2", text: "POS tradisional dan POS berbasis cloud" },
      {
        type: "p",
        text: "POS tradisional menyimpan data di komputer lokal di outlet. Sistem ini biasanya membutuhkan perangkat khusus dan pemeliharaan sendiri, serta data hanya bisa dilihat di lokasi.",
      },
      {
        type: "p",
        text: "POS berbasis cloud menyimpan data di server online. Pemilik usaha bisa memantau penjualan dari HP kapan saja, pembaruan aplikasi berjalan otomatis, dan sistem lebih mudah dikembangkan saat membuka cabang baru. Karena itu, POS berbasis cloud kini menjadi pilihan utama banyak UMKM.",
      },
      { type: "h2", text: "Manfaat sistem POS untuk UMKM" },
      {
        type: "ul",
        items: [
          "Transaksi lebih cepat sehingga antrean di kasir berkurang.",
          "Pencatatan lebih akurat dan risiko salah hitung lebih kecil.",
          "Stok terpantau otomatis, sehingga kamu tahu kapan harus belanja lagi.",
          "Laporan penjualan siap kapan saja tanpa rekap manual.",
          "Aktivitas karyawan tercatat, membantu mencegah selisih kas.",
          "Data pelanggan bisa dipakai untuk promo dan program loyalitas.",
        ],
      },
      { type: "h2", text: "Siapa yang membutuhkan sistem POS?" },
      {
        type: "p",
        text: "Hampir semua usaha yang melayani transaksi langsung bisa merasakan manfaat sistem POS: cafe, restoran, food court, toko kelontong, minimarket, toko fashion, apotek, hingga usaha jasa seperti barbershop dan salon. Semakin banyak transaksi dan produk yang kamu kelola, semakin besar manfaatnya.",
      },
      {
        type: "callout",
        text: "Mulai dari kebutuhan paling mendesak, misalnya mempercepat transaksi di kasir. Fitur lain seperti stok dan promo bisa dimanfaatkan bertahap.",
      },
      { type: "h2", text: "Kesimpulan" },
      {
        type: "p",
        text: "Sistem POS adalah fondasi digital bagi usaha yang ingin bekerja lebih rapi dan mengambil keputusan berdasarkan data. Dengan POS berbasis cloud, UMKM bisa menikmati manfaat yang sama seperti bisnis besar tanpa investasi perangkat yang mahal.",
      },
      {
        type: "p",
        text: "TapPOS dari TapHub adalah aplikasi kasir dan sistem POS berbasis cloud untuk usaha F&B, retail, dan jasa. Konsultasikan kebutuhan usahamu dengan tim kami untuk mengetahui apakah TapPOS cocok untukmu.",
      },
    ],
  },
];

export const articleCategories = Array.from(new Set(articles.map((a) => a.category)));

export function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug);
}

/** Artikel diurutkan dari yang terbaru */
export function sortedArticles() {
  return [...articles].sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta" }).format(
    new Date(`${iso}T00:00:00+07:00`),
  );
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}
