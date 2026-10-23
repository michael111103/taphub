export const REPORTS = [
  {
    group: "Finansial",
    icon: "report",
    tone: "green",
    items: [
      { slug: "neraca", name: "Neraca", desc: "Posisi aset, kewajiban, dan ekuitas pada tanggal tertentu" },
      { slug: "laba-rugi", name: "Laba Rugi", desc: "Pendapatan dikurangi beban dalam satu periode" },
      { slug: "arus-kas", name: "Arus Kas", desc: "Kas masuk dan keluar menurut aktivitasnya" },
      { slug: "perubahan-modal", name: "Perubahan Modal", desc: "Pergerakan ekuitas pemilik" },
      { slug: "ringkasan-eksekutif", name: "Ringkasan Eksekutif", desc: "Angka penting bulan ini dibanding bulan lalu" },
    ],
  },
  {
    group: "Akuntansi",
    icon: "ledger",
    tone: "slate",
    items: [
      { slug: "buku-besar", name: "Buku Besar", desc: "Ringkasan mutasi setiap akun" },
      { slug: "jurnal", name: "Jurnal", desc: "Semua jurnal yang tercatat otomatis" },
      { slug: "trial-balance", name: "Trial Balance", desc: "Neraca saldo untuk memastikan debit sama dengan kredit" },
    ],
  },
  {
    group: "Penjualan",
    icon: "sales",
    tone: "blue",
    items: [
      { slug: "penjualan-pelanggan", name: "Penjualan per Pelanggan", desc: "Siapa pelanggan terbesar" },
      { slug: "penjualan-produk", name: "Penjualan per Produk", desc: "Produk yang paling laku dan marginnya" },
      { slug: "umur-piutang", name: "Umur Piutang", desc: "Tagihan belum dibayar menurut lama tertunggak" },
    ],
  },
  {
    group: "Pembelian dan Biaya",
    icon: "purchase",
    tone: "violet",
    items: [
      { slug: "pembelian-vendor", name: "Pembelian per Vendor", desc: "Nilai pembelian dari setiap vendor" },
      { slug: "umur-hutang", name: "Umur Hutang", desc: "Tagihan pembelian dan biaya yang belum dibayar" },
      { slug: "biaya-akun", name: "Biaya per Akun", desc: "Ke mana uang operasional dipakai" },
    ],
  },
] as const;

export const ALL_REPORTS = REPORTS.flatMap((g) => g.items.map((i) => ({ ...i, group: g.group, icon: g.icon, tone: g.tone })));
