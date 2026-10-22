"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readConsent, writeConsent } from "@/lib/consent";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(readConsent() === null);
  }, []);

  if (!show) return null;

  const choose = (v: "accepted" | "rejected") => {
    writeConsent(v);
    setShow(false);
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Persetujuan cookie"
      className="fixed inset-x-3 bottom-3 z-[60] mx-auto flex max-w-2xl flex-col gap-3 rounded-2xl border border-line bg-panel/95 p-3.5 shadow-2xl backdrop-blur-xl sm:inset-x-6 sm:bottom-6 sm:flex-row sm:items-center sm:gap-5 sm:p-4"
    >
      <p className="text-xs leading-5 text-muted sm:text-sm sm:leading-6">
        Kami memakai cookie analitik hanya jika kamu setuju.{" "}
        <Link href="/kebijakan-privasi" className="text-fg underline underline-offset-4">Kebijakan Privasi</Link>
      </p>
      <div className="flex shrink-0 gap-2">
        <button type="button" className="btn-tide flex-1 !px-4 !py-2 sm:flex-none" onClick={() => choose("accepted")}>Setuju</button>
        <button type="button" className="btn-ghost flex-1 !px-4 !py-2 sm:flex-none" onClick={() => choose("rejected")}>Tolak</button>
      </div>
    </div>
  );
}
