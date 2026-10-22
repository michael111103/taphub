import type { Product } from "@/lib/products";

export default function ProductIcon({ product, size = 44 }: { product: Product; size?: number }) {
  const [a, b] = product.hue;
  return (
    <span
      aria-hidden="true"
      className="relative grid shrink-0 place-items-center rounded-[30%] ring-1 ring-white/15"
      style={{
        width: size,
        height: size,
        backgroundImage: `linear-gradient(145deg, ${a}, ${b})`,
        boxShadow: `0 8px 24px -8px ${b}`,
      }}
    >
      <svg
        width={size * 0.5}
        height={size * 0.5}
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={product.icon} />
      </svg>
    </span>
  );
}
