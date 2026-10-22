// Mockup dashboard kasir TapPOS. Murni HTML + CSS (tanpa gambar), jadi tajam dan ringan.
// Animasi: pesanan baru dari "Meja 7" masuk berulang, grafik naik saat halaman dibuka.

const bars = [38, 52, 44, 70, 58, 86, 64];
const days = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

const orders = [
  { table: "Meja 3", items: "2 Es Kopi Susu, 1 Croissant", total: "Rp74.000", status: "Diproses", tone: "amber" },
  { table: "Meja 12", items: "1 Matcha Latte", total: "Rp32.000", status: "Selesai", tone: "green" },
  { table: "Take away", items: "3 Americano", total: "Rp81.000", status: "Selesai", tone: "green" },
];

const tone: Record<string, string> = {
  amber: "bg-amber-400/10 text-amber-300 ring-amber-400/25",
  green: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/25",
  blue: "bg-sky-400/10 text-sky-300 ring-sky-400/30",
};

export default function HeroDashboard() {
  return (
    <div
      className="theme-dark relative"
      role="img"
      aria-label="Contoh tampilan dashboard kasir TapPOS: pesanan masuk dari meja, total penjualan hari ini, dan grafik penjualan mingguan."
    >
      {/* cahaya biru di belakang */}
      <div aria-hidden="true" className="pointer-events-none absolute -inset-x-10 -top-10 bottom-0 -z-10 rounded-full bg-[radial-gradient(closest-side,rgba(27,91,255,0.45),transparent)] blur-2xl" />

      <div aria-hidden="true" className="overflow-hidden rounded-[22px] border border-line bg-panel/90 shadow-[0_30px_80px_-24px_rgba(15,23,42,0.45)] [transform:perspective(1600px)_rotateX(6deg)] lg:[transform:perspective(1600px)_rotateY(-8deg)_rotateX(4deg)]">
        {/* top bar */}
        <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
          <div className="flex items-center gap-2 text-xs text-muted">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="font-medium text-fg">Kopi Senja</span>
            <span className="hidden sm:inline">/ Pesanan hari ini</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden rounded-lg border border-line px-2 py-1 text-[10px] text-muted sm:inline">Cari menu</span>
            <span className="relative grid h-7 w-7 place-items-center rounded-lg border border-line">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8E98AA" strokeWidth="2"><path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21h4" /></svg>
              <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-tide-1" />
            </span>
            <span className="rounded-full bg-gradient-to-br from-tide-1 to-tide-2 px-3 py-1.5 text-[10px] font-semibold text-white shadow-[0_6px_20px_-6px_rgba(27,91,255,0.9)]">
              + Tambah menu
            </span>
          </div>
        </div>

        <div className="grid gap-3 p-3 sm:grid-cols-[1.1fr_1fr] sm:p-4">
          {/* kiri: statistik + grafik */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-line bg-raised p-3">
                <p className="text-[10px] text-muted">Penjualan hari ini</p>
                <p className="mt-1 text-lg font-semibold tabular-nums">Rp2,84 jt</p>
                <span className="mt-1 inline-flex rounded-full bg-emerald-400/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-300">+12%</span>
              </div>
              <div className="rounded-2xl border border-line bg-raised p-3">
                <p className="text-[10px] text-muted">Pesanan</p>
                <p className="mt-1 text-lg font-semibold tabular-nums">68</p>
                <span className="mt-1 inline-flex rounded-full bg-sky-400/10 px-1.5 py-0.5 text-[10px] font-medium text-sky-300">9 aktif</span>
              </div>
            </div>
            <div className="rounded-2xl border border-line bg-raised p-3">
              <p className="text-[10px] text-muted">Penjualan 7 hari</p>
              <div className="mt-3 flex h-28 items-end gap-2">
                {bars.map((h, i) => (
                  <div key={i} className="flex h-full flex-1 flex-col items-center gap-1.5">
                    <div className="flex w-full flex-1 items-end">
                      <div
                        className="w-full origin-bottom animate-bar-grow rounded-md bg-gradient-to-t from-tide-2 to-tide-1 shadow-[0_0_18px_-2px_rgba(56,200,248,0.7)]"
                        style={{ height: `${h}%`, animationDelay: `${300 + i * 90}ms`, opacity: i === 5 ? 1 : 0.55 }}
                      />
                    </div>
                    <span className="text-[9px] text-muted">{days[i]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* kanan: daftar pesanan */}
          <div className="rounded-2xl border border-line bg-raised p-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-muted">Pesanan masuk</p>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-tide-1" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-tide-1" />
              </span>
            </div>
            <ul className="mt-3 space-y-2">
              <li className="animate-order-in rounded-xl border border-tide-1/40 bg-tide-2/10 p-2.5 shadow-[0_0_24px_-8px_rgba(56,200,248,0.8)]">
                <OrderRow table="Meja 7" items="2 Kopi Susu Aren, 1 Roti Bakar" total="Rp68.000" status="Baru, sudah dibayar" toneClass={tone.blue} />
              </li>
              {orders.map((o) => (
                <li key={o.table} className="rounded-xl border border-line bg-panel p-2.5">
                  <OrderRow table={o.table} items={o.items} total={o.total} status={o.status} toneClass={tone[o.tone]} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderRow({ table, items, total, status, toneClass }: { table: string; items: string; total: string; status: string; toneClass: string }) {
  return (
    <div className="flex items-start justify-between gap-2">
      <div className="min-w-0">
        <p className="text-xs font-semibold">{table}</p>
        <p className="truncate text-[10px] text-muted">{items}</p>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-[11px] font-semibold tabular-nums">{total}</p>
        <span className={`mt-0.5 inline-flex rounded-full px-1.5 py-0.5 text-[9px] font-medium ring-1 ${toneClass}`}>{status}</span>
      </div>
    </div>
  );
}
