// Mockup hero TapWebsite: jendela browser berisi contoh website usaha + tampilan HP.
// Murni HTML + CSS (tanpa gambar), jadi tajam dan ringan. "Kopi Senja" adalah contoh usaha fiktif.

const menu = [
  { name: "Es Kopi Susu", price: "Rp24.000", hue: "from-amber-300 to-orange-500" },
  { name: "Matcha Latte", price: "Rp32.000", hue: "from-lime-300 to-emerald-500" },
  { name: "Croissant", price: "Rp22.000", hue: "from-yellow-200 to-amber-400" },
];

export default function HeroWebsite() {
  return (
    <div
      className="relative"
      role="img"
      aria-label="Contoh website usaha buatan TapWebsite: halaman cafe dengan menu, tombol pesan via WhatsApp, dan tampilan versi HP."
    >
      <div aria-hidden="true" className="pointer-events-none absolute -inset-x-10 -top-10 bottom-0 -z-10 rounded-full bg-[radial-gradient(closest-side,rgba(45,212,191,0.32),rgba(27,91,255,0.18)_55%,transparent)] blur-2xl" />

      {/* Browser */}
      <div aria-hidden="true" className="overflow-hidden rounded-[22px] border border-line bg-white shadow-[0_30px_80px_-24px_rgba(15,23,42,0.45)] lg:[transform:perspective(1600px)_rotateY(-7deg)_rotateX(3deg)]">
        <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50 px-4 py-2.5">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </div>
          <div className="flex flex-1 items-center gap-2 rounded-lg bg-white px-3 py-1 text-[11px] text-slate-500 ring-1 ring-slate-200">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.4"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
            kopisenja.com
          </div>
        </div>

        <div className="bg-[#FFF8F0] text-[#2A1A10]">
          <div className="flex items-center justify-between px-6 py-3 text-[11px]">
            <span className="font-display text-sm font-semibold">Kopi Senja</span>
            <span className="hidden gap-4 text-[#7A5A44] sm:flex"><span>Menu</span><span>Lokasi</span><span>Tentang</span></span>
            <span className="rounded-full bg-[#2A1A10] px-3 py-1 text-[10px] font-semibold text-white">Pesan</span>
          </div>
          <div className="grid gap-4 px-6 pb-6 pt-2 sm:grid-cols-[1.1fr_1fr] sm:items-center">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#C2410C]">Kedai kopi · Semarang</p>
              <p className="mt-2 font-display text-[22px] font-semibold leading-tight sm:text-[26px]">Kopi enak untuk sore yang pelan.</p>
              <div className="mt-4 flex gap-2">
                <span className="rounded-full bg-[#C2410C] px-3 py-1.5 text-[10px] font-semibold text-white">Lihat menu</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-[10px] font-semibold ring-1 ring-[#E9D8C8]">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Pesan via WhatsApp
                </span>
              </div>
            </div>
            <div className="relative h-32 overflow-hidden rounded-2xl bg-gradient-to-br from-[#F5C08A] via-[#D9814A] to-[#7A3B1C] sm:h-36">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/25" />
              <div className="absolute bottom-3 left-3 rounded-xl bg-white/85 px-2.5 py-1.5 text-[10px] font-semibold backdrop-blur">Buka 08.00–22.00</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 border-t border-[#F0E2D4] px-6 py-4">
            {menu.map((m) => (
              <div key={m.name} className="rounded-xl bg-white p-2 ring-1 ring-[#F0E2D4]">
                <div className={`h-12 rounded-lg bg-gradient-to-br ${m.hue}`} />
                <p className="mt-1.5 truncate text-[10px] font-semibold">{m.name}</p>
                <p className="text-[10px] text-[#7A5A44]">{m.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HP */}
      <div aria-hidden="true" className="absolute -bottom-10 -left-3 w-[34%] max-w-[170px] rounded-[26px] border-[5px] border-[#0B1222] bg-[#FFF8F0] p-2 shadow-[0_24px_60px_-16px_rgba(15,23,42,0.6)] sm:-left-8">
        <div className="mx-auto mb-2 h-1.5 w-10 rounded-full bg-[#0B1222]/80" />
        <p className="font-display text-[11px] font-semibold text-[#2A1A10]">Kopi Senja</p>
        <div className="mt-1.5 h-16 rounded-xl bg-gradient-to-br from-[#F5C08A] to-[#7A3B1C]" />
        <p className="mt-2 text-[9px] font-semibold leading-tight text-[#2A1A10]">Kopi enak untuk sore yang pelan.</p>
        <div className="mt-2 rounded-full bg-[#C2410C] py-1 text-center text-[8px] font-semibold text-white">Lihat menu</div>
        <div className="mt-1.5 rounded-full bg-emerald-500 py-1 text-center text-[8px] font-semibold text-white">WhatsApp</div>
      </div>

      {/* Lencana */}
      <div aria-hidden="true" className="absolute -right-2 -top-5 flex items-center gap-2 rounded-2xl border border-line bg-panel px-3 py-2 text-xs shadow-lg sm:-right-6">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-500/15 text-emerald-500">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
        </span>
        <span><span className="block font-semibold text-fg">Website online</span><span className="text-muted">Domain + SSL aktif</span></span>
      </div>
      <div aria-hidden="true" className="absolute -bottom-6 right-4 flex items-center gap-2 rounded-2xl border border-line bg-panel px-3 py-2 text-xs shadow-lg">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-tide-2/15 text-accent">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M4 18l5-6 4 3 7-9" /></svg>
        </span>
        <span><span className="block font-semibold text-fg">Pesanan dari website</span><span className="text-muted">Masuk ke WhatsApp</span></span>
      </div>
    </div>
  );
}
