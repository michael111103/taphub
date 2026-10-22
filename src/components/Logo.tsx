import Image from "next/image";
import { mainHref } from "@/lib/site";

export default function Logo({ className = "h-7 w-auto" }: { className?: string }) {
  return (
    <a href={mainHref("/")} aria-label="TapHub, ke beranda" className="inline-flex shrink-0 items-center">
      <Image
        src="/taphub-logo.png"
        alt="TapHub"
        width={898}
        height={197}
        priority
        className={className}
        sizes="160px"
      />
    </a>
  );
}
