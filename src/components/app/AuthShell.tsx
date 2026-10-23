import Image from "next/image";
import ThemeToggle from "./ThemeToggle";

/** Latar halaman login/daftar: kartu di tengah, garis tipis dan watermark "Rp" seperti referensi */
export default function AuthShell({ children, wide = false }: { children: React.ReactNode; wide?: boolean }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(56,200,248,0.16),transparent_70%),radial-gradient(40%_40%_at_100%_100%,rgba(27,91,255,0.14),transparent_70%)]" />
        <svg className="absolute inset-0 h-full w-full text-tide-2/[0.08]" preserveAspectRatio="none" viewBox="0 0 100 100">
          <path d="M60 0 L100 45" stroke="currentColor" strokeWidth="0.15" fill="none" />
          <path d="M70 100 L100 70" stroke="currentColor" strokeWidth="0.15" fill="none" />
          <path d="M0 80 L30 100" stroke="currentColor" strokeWidth="0.15" fill="none" />
        </svg>
        <span className="font-display absolute bottom-[8%] left-1/2 -translate-x-1/2 select-none text-[22vw] font-bold leading-none text-tide-2/[0.05] sm:text-[180px]">
          Rp
        </span>
      </div>

      <div className="absolute right-4 top-4 z-10">
        <ThemeToggle />
      </div>

      <div className={`card relative w-full ${wide ? "max-w-lg" : "max-w-[440px]"} rounded-[28px] border-tide-2/20 p-7 sm:p-10`}>
        <div className="flex justify-center">
          <Image src="/taphub-logo-dark.png" alt="TapHub" width={907} height={209} priority className="logo-light h-9 w-auto" />
          <Image src="/taphub-logo.png" alt="TapHub" width={898} height={197} priority className="logo-dark h-9 w-auto" />
        </div>
        {children}
      </div>
    </div>
  );
}
