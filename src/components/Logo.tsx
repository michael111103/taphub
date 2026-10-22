import Image from "next/image";
import Link from "next/link";

export default function Logo({ className = "h-7 w-auto" }: { className?: string }) {
  return (
    <Link href="/" aria-label="TapHub, ke beranda" className="inline-flex shrink-0 items-center">
      <Image
        src="/taphub-logo.png"
        alt="TapHub"
        width={898}
        height={197}
        priority
        className={className}
        sizes="160px"
      />
    </Link>
  );
}
