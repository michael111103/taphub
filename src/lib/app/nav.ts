export type NavItem = {
  label: string;
  href?: string;
  icon: string;
  tone: string;
  children?: { label: string; href: string }[];
  badge?: string;
};

export const mainNav: NavItem[] = [
  { label: "Beranda", href: "/", icon: "home", tone: "blue" },
  {
    label: "Penjualan",
    icon: "sales",
    tone: "blue",
    children: [
      { label: "Overview", href: "/penjualan" },
      { label: "Tagihan", href: "/penjualan/tagihan" },
      { label: "Pemesanan", href: "/penjualan/pemesanan" },
      { label: "Penawaran", href: "/penjualan/penawaran" },
    ],
  },
  {
    label: "Pembelian",
    icon: "purchase",
    tone: "violet",
    children: [
      { label: "Overview", href: "/pembelian" },
      { label: "Tagihan Pembelian", href: "/pembelian/tagihan" },
      { label: "Pesanan Pembelian", href: "/pembelian/pesanan" },
      { label: "Penawaran Pembelian", href: "/pembelian/penawaran" },
    ],
  },
  { label: "Biaya", href: "/biaya", icon: "expense", tone: "pink" },
  { label: "Produk", href: "/produk", icon: "box", tone: "amber" },
  { label: "Inventori", href: "/inventori", icon: "inventory", tone: "teal" },
  { label: "Laporan", href: "/laporan", icon: "report", tone: "green" },
  { label: "Kas & Bank", href: "/kas-bank", icon: "bank", tone: "blue" },
  { label: "Akun", href: "/akun", icon: "ledger", tone: "slate" },
  { label: "Aset Tetap", href: "/aset-tetap", icon: "asset", tone: "violet" },
  { label: "Kontak", href: "/kontak", icon: "contacts", tone: "pink" },
];

export const ecosystemNav: NavItem[] = [
  { label: "TapPOS", href: "/langganan?produk=pos", icon: "pos", tone: "teal", badge: "Kasir" },
  { label: "TapInvoice", href: "/langganan?produk=invoice", icon: "invoice", tone: "amber", badge: "Tagih" },
  { label: "TapStock", href: "/langganan?produk=stock", icon: "inventory", tone: "green", badge: "Segera" },
  { label: "TapStaff", href: "/langganan?produk=staff", icon: "staff", tone: "violet", badge: "Segera" },
];

export const bottomNav: NavItem[] = [
  { label: "Langganan", href: "/langganan", icon: "rocket", tone: "amber" },
  { label: "Pengaturan", href: "/pengaturan", icon: "settings", tone: "slate" },
];

export const quickActions = [
  { label: "Tagihan penjualan baru", href: "/penjualan/baru?jenis=invoice", icon: "sales" },
  { label: "Tagihan pembelian baru", href: "/pembelian/baru?jenis=bill", icon: "purchase" },
  { label: "Catat biaya", href: "/biaya/baru", icon: "expense" },
  { label: "Transaksi kas & bank", href: "/kas-bank/transaksi", icon: "transfer" },
];
