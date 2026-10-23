"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/app/supabase-browser";
import Icon, { GoogleLogo } from "@/components/app/Icon";

export default function SignupForm({ base }: { base: string }) {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", business: "", email: "", phone: "", password: "" });
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (form.password.length < 8) return setError("Password minimal 8 karakter.");
    setLoading(true);
    const { data, error } = await supabaseBrowser().auth.signUp({
      email: form.email.trim(),
      password: form.password,
      options: {
        data: { full_name: form.name.trim(), business_name: form.business.trim(), phone: form.phone.trim() },
        emailRedirectTo: `${window.location.origin}${base}/auth/callback`,
      },
    });
    setLoading(false);
    if (error) {
      setError(error.message.includes("already registered") ? "Email ini sudah terdaftar. Silakan masuk." : error.message);
      return;
    }
    if (data.session) {
      router.replace(`${base}/mulai?usaha=${encodeURIComponent(form.business)}`);
      router.refresh();
    } else {
      setSent(true);
    }
  }

  if (sent) {
    return (
      <div className="mt-8 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-tide-2/10 text-accent">
          <Icon name="mail" size={28} />
        </span>
        <h2 className="mt-4 text-lg font-semibold">Cek email kamu</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          Kami mengirim link konfirmasi ke <strong className="text-fg">{form.email}</strong>. Klik link itu untuk mengaktifkan akun, lalu masuk.
        </p>
        <Link href={`${base}/login`} className="btn-soft mt-6 w-full">Kembali ke halaman masuk</Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="name">Nama lengkap</label>
          <input id="name" required value={form.name} onChange={set("name")} className="field h-11" autoComplete="name" />
        </div>
        <div>
          <label className="label" htmlFor="business">Nama usaha</label>
          <input id="business" required value={form.business} onChange={set("business")} className="field h-11" autoComplete="organization" />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="email">Email</label>
        <input id="email" type="email" required value={form.email} onChange={set("email")} className="field h-11" autoComplete="email" />
      </div>
      <div>
        <label className="label" htmlFor="phone">Nomor WhatsApp (opsional)</label>
        <input id="phone" type="tel" value={form.phone} onChange={set("phone")} className="field h-11" autoComplete="tel" placeholder="08xx" />
      </div>
      <div>
        <label className="label" htmlFor="password">Password</label>
        <div className="relative">
          <input id="password" type={show ? "text" : "password"} required minLength={8} value={form.password} onChange={set("password")} className="field h-11 pr-11" autoComplete="new-password" placeholder="Minimal 8 karakter" />
          <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Sembunyikan password" : "Tampilkan password"} className="absolute inset-y-0 right-0 grid w-11 place-items-center text-muted hover:text-fg">
            <Icon name={show ? "eye" : "eye-off"} size={18} />
          </button>
        </div>
      </div>
      {error && <p role="alert" className="rounded-xl bg-rose-500/10 px-3 py-2 text-sm text-rose-600 dark:text-rose-300">{error}</p>}
      <button type="submit" disabled={loading} className="btn-primary h-11 w-full">{loading ? "Mendaftarkan..." : "Daftar gratis"}</button>
      <button type="button" disabled className="btn-soft h-11 w-full" title="Segera hadir">
        <GoogleLogo size={18} /> Daftar dengan Google (segera)
      </button>
      <p className="text-center text-xs leading-5 text-muted">
        Dengan mendaftar, kamu menyetujui{" "}
        <a href="https://taphub.id/syarat-ketentuan" className="text-accent hover:underline">Syarat &amp; Ketentuan</a> dan{" "}
        <a href="https://taphub.id/kebijakan-privasi" className="text-accent hover:underline">Kebijakan Privasi</a> TapHub.
      </p>
      <p className="text-center text-sm text-muted">
        Sudah punya akun? <Link href={`${base}/login`} className="font-semibold text-accent hover:underline">Masuk</Link>
      </p>
    </form>
  );
}
