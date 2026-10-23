"use client";

import { useEffect, useState } from "react";
import Icon from "./Icon";

export function setTheme(dark: boolean) {
  const el = document.getElementById("app-root");
  el?.classList.toggle("theme-dark", dark);
  try {
    localStorage.setItem("taphub-theme", dark ? "dark" : "light");
  } catch {}
  window.dispatchEvent(new CustomEvent("taphub-theme", { detail: dark }));
}

export function useIsDark() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const el = document.getElementById("app-root");
    setDark(!!el?.classList.contains("theme-dark"));
    const on = (e: Event) => setDark((e as CustomEvent<boolean>).detail);
    window.addEventListener("taphub-theme", on);
    return () => window.removeEventListener("taphub-theme", on);
  }, []);
  return dark;
}

/** Saklar terang/gelap seperti di header Kledo */
export default function ThemeToggle() {
  const dark = useIsDark();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label={dark ? "Ganti ke mode terang" : "Ganti ke mode gelap"}
      onClick={() => setTheme(!dark)}
      className="relative inline-flex h-8 w-[60px] shrink-0 items-center rounded-full border border-line bg-panel p-1 transition"
    >
      <span className={`absolute left-2 text-amber-500 transition ${dark ? "opacity-40" : "opacity-0"}`}>
        <Icon name="sun" size={14} />
      </span>
      <span className={`absolute right-2 text-sky-300 transition ${dark ? "opacity-0" : "opacity-50"}`}>
        <Icon name="moon" size={14} />
      </span>
      <span
        className={`relative z-10 grid h-6 w-6 place-items-center rounded-full shadow-sm transition-transform duration-300 ${
          dark ? "translate-x-[28px] bg-[#1B2740] text-sky-300" : "translate-x-0 bg-white text-amber-500"
        }`}
      >
        <Icon name={dark ? "moon" : "sun"} size={14} />
      </span>
    </button>
  );
}
