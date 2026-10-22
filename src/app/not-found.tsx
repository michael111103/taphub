import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Halaman tidak ditemukan",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(50%_50%_at_50%_30%,rgba(27,91,255,0.22),transparent_70%)]" />
      <div className="mx-auto flex min-h-[70vh] max-w-page flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
        <p className="text-tide text-8xl font-semibold tracking-[-0.04em] tabular-nums sm:text-9xl">404</p>
        <h1 className="mt-6 text-2xl font-semibold sm:text-3xl">Halaman ini tidak ada.</h1>
        <p className="mt-3 max-w-md leading-7 text-muted">
          Link yang kamu buka mungkin salah ketik atau halamannya sudah dipindahkan.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="btn-tide">Kembali ke beranda</Link>
          <Link href="/#kontak" className="btn-ghost">Hubungi kami</Link>
        </div>
      </div>
    </section>
  );
}
