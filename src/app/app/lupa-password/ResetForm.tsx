"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/app/supabase-browser";
import Icon from "@/components/app/Icon";
import { CodeInput, ResendButton, authError } from "@/components/app/CodeInput";

export default function ResetForm({ base }: { base: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clean = email.trim().toLowerCase();

  async function sendCode() {
    const { error } = await supabaseBrowser().auth.resetPasswordForEmail(clean, {
      redirectTo: `${window.location.origin}${base}/auth/callback?next=/pengaturan/profil`,
    });
    return error ? authError(error.message) : null;
  }

  async function onSend(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const err = await sendCode();
    setLoading(false);
    if (err) return setError(err);
    setStep("code");
  }

  async function onReset(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (code.length < 6) return setError("Masukkan kode dari email.");
    if (password.length < 8) return setError("Password baru minimal 8 karakter.");
    setLoading(true);
    const supabase = supabaseBrowser();
    const { data, error } = await supabase.auth.verifyOtp({ email: clean, token: code, type: "recovery" });
    if (error || !data.session) {
      setLoading(false);
      return setError(authError(error?.message ?? "Kode tidak valid."));
    }
    const { error: updErr } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (updErr) return setError(authError(updErr.message));
    router.replace(base || "/");
    router.refresh();
  }

  if (step === "code") {
    return (
      <form onSubmit={onReset} className="mt-8 space-y-4">
        <div className="text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-tide-2/10 text-accent">
            <Icon name="lock" size={28} />
          </span>
          <p className="mt-4 text-sm leading-6 text-muted">
            Jika <strong className="text-fg">{clean}</strong> terdaftar, kode sudah dikirim ke email itu. Cek juga folder Spam atau Promosi.
          </p>
        </div>
        <div>
          <label className="label" htmlFor="code">Kode dari email</label>
          <CodeInput value={code} onChange={setCode} />
        </div>
        <div>
          <label className="label" htmlFor="new-password">Password baru</label>
          <div className="relative">
            <input id="new-password" type={show ? "text" : "password"} required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="field h-11 pr-11" autoComplete="new-password" placeholder="Minimal 8 karakter" />
            <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Sembunyikan password" : "Tampilkan password"} className="absolute inset-y-0 right-0 grid w-11 place-items-center text-muted hover:text-fg">
              <Icon name={show ? "eye" : "eye-off"} size={18} />
            </button>
          </div>
        </div>
        {error && <p role="alert" className="rounded-xl bg-rose-500/10 px-3 py-2 text-sm text-rose-600 dark:text-rose-300">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary h-11 w-full">{loading ? "Menyimpan..." : "Simpan password baru"}</button>
        <ResendButton onResend={sendCode} />
        <Link href={`${base}/login`} className="block text-center text-sm font-medium text-muted hover:text-fg">Kembali ke halaman masuk</Link>
      </form>
    );
  }

  return (
    <form onSubmit={onSend} className="mt-8 space-y-4">
      <div>
        <label className="label" htmlFor="email">Email</label>
        <input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="field h-11" placeholder="nama@usaha.com" />
      </div>
      {error && <p role="alert" className="rounded-xl bg-rose-500/10 px-3 py-2 text-sm text-rose-600 dark:text-rose-300">{error}</p>}
      <button type="submit" disabled={loading || !email} className="btn-primary h-11 w-full">{loading ? "Mengirim..." : "Kirim kode"}</button>
      <Link href={`${base}/login`} className="block text-center text-sm font-medium text-accent hover:underline">Kembali ke halaman masuk</Link>
    </form>
  );
}
