export type PayChannel = { id: string; label: string; short?: string; color: string };
export type PayMethod = { id: string; label: string; desc: string; icon: string; channels: PayChannel[] };

/** Metode pembayaran yang akan disambungkan ke payment gateway (Xendit) */
export const PAYMENT_METHODS: PayMethod[] = [
  { id: "qris", label: "QRIS", desc: "Scan dari aplikasi bank atau e-wallet apa pun", icon: "qris", channels: [{ id: "qris", label: "QRIS", color: "#E11D48" }] },
  {
    id: "va",
    label: "Virtual Account",
    desc: "Transfer bank, terverifikasi otomatis",
    icon: "bank",
    channels: [
      { id: "bca", label: "BCA", color: "#0060AF" },
      { id: "mandiri", label: "Mandiri", color: "#003D79" },
      { id: "bni", label: "BNI", color: "#F15A22" },
      { id: "bri", label: "BRI", color: "#00529C" },
      { id: "permata", label: "Permata", color: "#1E8E3E" },
    ],
  },
  {
    id: "ewallet",
    label: "E-wallet",
    desc: "Bayar langsung dari aplikasi e-wallet",
    icon: "wallet",
    channels: [
      { id: "ovo", label: "OVO", color: "#4C2A86" },
      { id: "dana", label: "DANA", color: "#118EEA" },
      { id: "shopeepay", label: "ShopeePay", color: "#EE4D2D" },
      { id: "gopay", label: "GoPay", color: "#00AED6" },
    ],
  },
  { id: "card", label: "Kartu kredit / debit", desc: "Visa, Mastercard, JCB", icon: "card", channels: [{ id: "card", label: "Kartu", color: "#111827" }] },
];

export function methodLabel(method?: string | null, channel?: string | null) {
  const m = PAYMENT_METHODS.find((x) => x.id === method);
  if (!m) return method ?? "-";
  const c = m.channels.find((x) => x.id === channel);
  return m.channels.length > 1 && c ? `${m.label} ${c.label}` : m.label;
}
