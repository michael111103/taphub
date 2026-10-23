"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/app/supabase-browser";
import Icon, { GoogleLogo } from "@/components/app/Icon";
import { CodeInput, ResendButton, authError } from "@/components/app/CodeInput";

export default function LoginForm({ base, next }: { base: string; next?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // password: login biasa | otp: minta kode lewat email | code: masukkan kode (login OTP atau konfirmasi akun baru)
  const [mode, setMode] = useState<"password" | "otp" | "code">("password");
  const [codeKind, setCodeKind] = useState<"login" | "confirm">("login");
  const [code, setCode] = useState("");

  function done() {
    if (!remember) {
      try {
        sessionStorage.setItem("taphub-session-only", "1");
      } catch {}
    }
    router.replace(next && next.startsWith("/") ? next : base || "/");
    router.refresh();
  }

  async function sendLoginCode() {
    const { error } = await supabaseBrowser().auth.signInWithOtp({ email: email.trim().toLowerCase(), options: { shouldCreateUser: false } });
    if (!error) return null;
    if (error.message.toLowerCase().includes("signups not allowed")) return "Email ini belum terdaftar. Daftar dulu, ya.";
    return authError(error.message);
  }

  async function sendConfirmCode() {
    const { error } = await supabaseBrowser().auth.resend({ type: "signup", email: email.trim().toLowerCase() });
    return error ? authError(error.message) : null;
  }

  async function onRequestOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const err = await sendLoginCode();
    setLoading(false);
    if (err) return setError(err);
    setCodeKind("login");
    setCode("");
    setMode("code");
  }

  async function onVerify(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (code.length < 6) return setError("Masukkan kode dari email.");
    setLoading(true);
    const { data, error } = await supabaseBrowser().auth.verifyOtp({ email: email.trim().toLowerCase(), token: code, type: "email" });
    if (error || !data.session) {
      setLoading(false);
      return setError(authError(error?.message ?? "Kode tidak valid."));
    }
    done();
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabaseBrowser().auth.signInWithPassword({ email: email.trim(), password });
    if (error) {
      if (error.message.includes("Email not confirmed")) {
        // Akun sudah dibuat tapi belum verifikasi: kirim kode baru dan langsung minta kodenya
        const err = await sendConfirmCode();
        setLoading(false);
        if (err) return setError(err);
        setCodeKind("confirm");
        setCode("");
        setMode("code");
        return;
      }
      setLoading(false);
      setError(error.message.includes("Invalid login") ? "Email atau password salah." : authError(error.message));
      return;
    }
    done();
  }

  function soon(name: string) {
    setInfo(`Login dengan ${name} segera hadir. Sementara gunakan email dan password.`);
  }

  const alert = (
    <>
      {error && <p role="alert" className="mt-4 rounded-xl bg-rose-500/10 px-3 py-2 text-sm text-rose-600 dark:text-rose-300">{error}</p>}
      {info && <p role="status" className="mt-4 rounded-xl bg-tide-2/10 px-3 py-2 text-sm text-accent">{info}</p>}
    </>
  );

  const backToPassword = (
    <button
      type="button"
      onClick={() => {
        setMode("password");
        setError(null);
        setInfo(null);
        setCode("");
      }}
      className="mt-5 block w-full text-center text-sm font-medium text-muted hover:text-fg"
    >
      Kembali masuk dengan password
    </button>
  );

  if (mode === "code") {
    return (
      <form onSubmit={onVerify} className="mt-8">
        <div className="text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-tide-2/10 text-accent">
            <Icon name="mail" size={28} />
          </span>
          <h2 className="mt-4 text-lg font-semibold">{codeKind === "confirm" ? "Verifikasi email dulu" : "Masukkan kode masuk"}</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            {codeKind === "confirm" ? "Akunmu belum diverifikasi. " : ""}Kode sudah dikirim ke <strong className="text-fg">{email.trim()}</strong>. Cek juga folder Spam atau Promosi.
          </p>
        </div>
        <div className="mt-5">
          <CodeInput value={code} onChange={setCode} />
        </div>
        {alert}
        <button type="submit" disabled={loading} className="btn-primary mt-5 h-11 w-full">{loading ? "Memeriksa..." : "Verifikasi dan masuk"}</button>
        <div className="mt-4">
          <ResendButton onResend={codeKind === "confirm" ? sendConfirmCode : sendLoginCode} />
        </div>
        {backToPassword}
      </form>
    );
  }

  if (mode === "otp") {
    return (
      <form onSubmit={onRequestOtp} className="mt-8">
        <p className="text-center text-sm leading-6 text-muted">Masuk tanpa password. Kami kirim kode sekali pakai ke email akunmu.</p>
        <div className="mt-5">
          <label htmlFor="email" className="label">Email</label>
          <input id="email" type="email" autoComplete="email" required autoFocus value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nama@usaha.com" className="field h-11" />
        </div>
        {alert}
        <button type="submit" disabled={loading || !email} className="btn-primary mt-6 h-11 w-full">{loading ? "Mengirim..." : "Kirim kode"}</button>
        {backToPassword}
      </form>
    );
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

      {alert}

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
        <button type="button" onClick={() => {
            setMode("otp");
            setError(null);
            setInfo(null);
          }} className="flex flex-col items-center gap-2 rounded-2xl border border-line py-3 text-sm transition hover:border-tide-2/40 hover:bg-fg/[0.03]">
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
