"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/app/supabase-browser";
import Icon, { GoogleLogo } from "@/components/app/Icon";

export default function LoginForm({ base, next }: { base: string; next?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabaseBrowser().auth.signInWithPassword({ email: email.trim(), password });
    if (error) {
      setLoading(false);
      setError(
        error.message.includes("Invalid login")
          ? "Email atau password salah."
          : error.message.includes("Email not confirmed")
            ? "Email belum dikonfirmasi. Cek kotak masuk email kamu."
            : error.message,
      );
      return;
    }
    if (!remember) {
      try {
        sessionStorage.setItem("taphub-session-only", "1");
      } catch {}
    }
    router.replace(next && next.startsWith("/") ? next : base || "/");
    router.refresh();
  }

  function soon(name: string) {
    setInfo(`Login dengan ${name} segera hadir. Sementara gunakan email dan password.`);
  }

  return (
    <form onSubmit={onSubmit} className="mt-8" noValidate>
      <div>
        <label htmlFor="email" className="label">Email</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="nama@usaha.com"
          className="field h-11"
        />
      </div>
      <div className="mt-4">
        <label htmlFor="password" className="label">Password</label>
        <div className="relative">
          <input
            id="password"
            type={show ? "text" : "password"}
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Silakan masukkan password Anda"
            className="field h-11 pr-11"
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Sembunyikan password" : "Tampilkan password"}
            className="absolute inset-y-0 right-0 grid w-11 place-items-center text-muted hover:text-fg"
          >
            <Icon name={show ? "eye" : "eye-off"} size={18} />
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <label className="inline-flex cursor-pointer items-center gap-2">
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4 rounded accent-[#1B5BFF]" />
          Ingat saya
        </label>
        <Link href={`${base}/lupa-password`} className="font-medium text-accent underline-offset-4 hover:underline">
          Lupa password?
        </Link>
      </div>

      {error && <p role="alert" className="mt-4 rounded-xl bg-rose-500/10 px-3 py-2 text-sm text-rose-600 dark:text-rose-300">{error}</p>}
      {info && <p role="status" className="mt-4 rounded-xl bg-tide-2/10 px-3 py-2 text-sm text-accent">{info}</p>}

      <button type="submit" disabled={loading || !email || !password} className="btn-primary mt-6 h-11 w-full">
        {loading ? "Memproses..." : "Masuk"}
      </button>

      <div className="my-6 flex items-center gap-4 text-sm text-muted">
        <span className="h-px flex-1 bg-line" />
        Atau login dengan
        <span className="h-px flex-1 bg-line" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <button type="button" onClick={() => soon("Google")} className="flex flex-col items-center gap-2 rounded-2xl border border-line py-3 text-sm transition hover:border-tide-2/40 hover:bg-fg/[0.03]">
          <GoogleLogo size={26} />
          Google
        </button>
        <button type="button" onClick={() => soon("SSO")} className="flex flex-col items-center gap-2 rounded-2xl border border-line py-3 text-sm transition hover:border-tide-2/40 hover:bg-fg/[0.03]">
          <Icon name="building" size={26} className="text-fg/80" />
          SSO
        </button>
        <button type="button" onClick={() => soon("OTP")} className="flex flex-col items-center gap-2 rounded-2xl border border-line py-3 text-sm transition hover:border-tide-2/40 hover:bg-fg/[0.03]">
          <Icon name="lock" size={26} className="text-fg/80" />
          OTP
        </button>
      </div>

      <p className="mt-7 text-center text-sm text-muted">
        Belum punya akun?{" "}
        <Link href={`${base}/daftar`} className="font-semibold text-accent underline-offset-4 hover:underline">
          Daftar gratis 14 hari
        </Link>
      </p>
    </form>
  );
}
