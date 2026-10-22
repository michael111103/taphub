// Mockup layar HP pelanggan setelah scan QR (HTML + CSS).
const menu = [
  { name: "Kopi Susu Aren", price: "Rp24.000", qty: 2 },
  { name: "Matcha Latte", price: "Rp32.000", qty: 0 },
  { name: "Roti Bakar Cokelat", price: "Rp20.000", qty: 1 },
  { name: "Americano", price: "Rp27.000", qty: 0 },
];

export default function PhoneMenu() {
  return (
    <div
      role="img"
      aria-label="Contoh layar HP pelanggan: menu Kopi Senja untuk Meja 7, dengan tombol bayar Rp68.000."
      className="relative mx-auto w-[248px] rounded-[38px] border border-white/15 bg-black p-2.5 shadow-[0_30px_80px_-20px_rgba(27,91,255,0.55)]"
    >
      <div aria-hidden="true" className="overflow-hidden rounded-[30px] bg-panel">
        <div className="flex justify-center pt-2"><span className="h-1.5 w-16 rounded-full bg-white/15" /></div>
        <div className="px-4 pb-4 pt-3">
          <p className="text-[10px] text-muted">Kopi Senja</p>
          <p className="text-sm font-semibold">Meja 7</p>
          <div className="mt-3 flex gap-1.5 text-[10px]">
            <span className="rounded-full bg-fg px-2.5 py-1 font-medium text-ink">Kopi</span>
            <span className="rounded-full border border-line px-2.5 py-1 text-muted">Non kopi</span>
            <span className="rounded-full border border-line px-2.5 py-1 text-muted">Makanan</span>
          </div>
          <ul className="mt-3 space-y-2">
            {menu.map((m) => (
              <li key={m.name} className="flex items-center justify-between rounded-xl border border-line bg-raised px-2.5 py-2">
                <div>
                  <p className="text-[11px] font-medium">{m.name}</p>
                  <p className="text-[10px] tabular-nums text-muted">{m.price}</p>
                </div>
                {m.qty > 0 ? (
                  <span className="rounded-full bg-tide-2/20 px-2 py-0.5 text-[10px] font-semibold text-tide-1 ring-1 ring-tide-1/40">{m.qty}x</span>
                ) : (
                  <span className="grid h-5 w-5 place-items-center rounded-full border border-line text-[11px] text-muted">+</span>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between rounded-2xl bg-gradient-to-br from-tide-1 to-tide-2 px-3 py-2.5 shadow-[0_10px_30px_-10px_rgba(27,91,255,0.9)]">
            <span className="text-[11px] font-semibold text-white">Bayar dengan QRIS</span>
            <span className="text-[11px] font-semibold tabular-nums text-white">Rp68.000</span>
          </div>
        </div>
      </div>
    </div>
  );
}
