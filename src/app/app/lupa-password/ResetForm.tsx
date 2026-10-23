"use client";

import { useState } from "react";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/app/supabase-browser";

export default function ResetForm({ base }: { base: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    const { error } = await supabaseBrowser().auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}${base}/auth/callback?next=/pengaturan/profil`,
    });
    if (error) {
      setState("error");
      setMsg(error.message);
    } else setState("sent");
  }

  if (state === "sent") {
    return (
      <div className="mt-8 text-center text-sm leading-6 text-muted">
        Jika email <strong className="text-fg">{email}</strong> terdaftar, link atur ulang password sudah dikirim. Setelah masuk lewat link itu, buat password baru di menu Profil.
        <Link href={`${base}/login`} className="btn-soft mt-6 w-full">Kembali ke halaman masuk</Link>
      </div>
    );
  }
  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      <div>
        <label className="label" htmlFor="email">Email</label>
        <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="field h-11" />
      </div>
      {state === "error" && <p role="alert" className="rounded-xl bg-rose-500/10 px-3 py-2 text-sm text-rose-600 dark:text-rose-300">{msg}</p>}
      <button type="submit" disabled={state === "loading"} className="btn-primary h-11 w-full">{state === "loading" ? "Mengirim..." : "Kirim link"}</button>
      <Link href={`${base}/login`} className="block text-center text-sm font-medium text-accent hover:underline">Kembali ke halaman masuk</Link>
    </form>
  );
}
