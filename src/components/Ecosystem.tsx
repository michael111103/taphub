import Image from "next/image";
import ProductIcon from "./ProductIcon";
import { products } from "@/lib/products";

// Diagram: TapHub di tengah atas, garis bercahaya mengalir ke beberapa produk.
const picks = ["tappos", "tappay", "tapbooks", "tapstock", "tapstaff"];
const nodes = picks.map((slug) => products.find((p) => p.slug === slug)!);
const xs = [10, 30, 50, 70, 90]; // posisi horizontal (persen)

export default function Ecosystem() {
  return (
    <figure className="relative mx-auto w-full max-w-4xl">
      <div className="relative aspect-[800/360] w-full">
        <svg viewBox="0 0 800 360" className="absolute inset-0 h-full w-full" aria-hidden="true" preserveAspectRatio="none">
          <defs>
            <linearGradient id="eco-line" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38C8F8" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#1B5BFF" stopOpacity="0.15" />
            </linearGradient>
          </defs>
          {xs.map((x, i) => {
            const px = (x / 100) * 800;
            const d = `M400 92 C400 180, ${px} 160, ${px} 268`;
            return (
              <g key={i}>
                <path d={d} fill="none" stroke="rgba(100,116,139,0.28)" strokeWidth="1.5" />
                <path
                  d={d}
                  fill="none"
                  stroke="url(#eco-line)"
                  strokeWidth="2"
                  strokeDasharray="28 172"
                  className="animate-flow"
                  style={{ animationDelay: `${i * 0.45}s` }}
                />
              </g>
            );
          })}
        </svg>

        <div className="absolute left-1/2 top-[3%] -translate-x-1/2">
          <div className="rounded-2xl border border-tide-1/30 bg-raised px-5 py-3 shadow-[0_10px_50px_-12px_rgba(27,91,255,0.55)] sm:px-7 sm:py-4">
            <Image src="/taphub-logo-dark.png" alt="TapHub" width={907} height={209} className="h-5 w-auto sm:h-7" sizes="140px" />
          </div>
        </div>

        {nodes.map((p, i) => (
          <div
            key={p.slug}
            className="absolute flex -translate-x-1/2 flex-col items-center gap-2"
            style={{ left: `${xs[i]}%`, top: "71%" }}
          >
            <span className="rounded-2xl border border-line bg-raised p-1.5 sm:p-2">
              <span className="hidden sm:block"><ProductIcon product={p} size={44} /></span>
              <span className="sm:hidden"><ProductIcon product={p} size={30} /></span>
            </span>
            <span className="text-[10px] font-medium text-muted sm:text-xs">{p.name}</span>
          </div>
        ))}
      </div>
      <figcaption className="sr-only">
        Diagram ekosistem: TapHub menghubungkan TapPOS, TapPay, TapBooks, TapStock, dan TapStaff dalam satu akun.
      </figcaption>
    </figure>
  );
}
