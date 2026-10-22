import Image from "next/image";
import { mainHref } from "@/lib/site";

// variant "onLight": tulisan "Tap" hitam, untuk latar terang (header).
// variant "onDark":  tulisan "Tap" putih, untuk latar gelap (footer).
const files = {
  onLight: { src: "/taphub-logo-dark.png", width: 907, height: 209 },
  onDark: { src: "/taphub-logo.png", width: 898, height: 197 },
} as const;

export default function Logo({
  className = "h-7 w-auto",
  variant = "onLight",
}: {
  className?: string;
  variant?: keyof typeof files;
}) {
  const f = files[variant];
  return (
    <a href={mainHref("/")} aria-label="TapHub, ke beranda" className="inline-flex shrink-0 items-center">
      <Image src={f.src} alt="TapHub" width={f.width} height={f.height} priority className={className} sizes="160px" />
    </a>
  );
}
