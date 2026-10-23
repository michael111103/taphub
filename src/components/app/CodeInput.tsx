"use client";

import { useEffect, useState } from "react";

/** Kolom kode OTP dari email: hanya angka, huruf besar, bisa tempel langsung dari email */
export function CodeInput({ value, onChange, autoFocus = true }: { value: string; onChange: (v: string) => void; autoFocus?: boolean }) {
  return (
    <input
      id="code"
      value={value}
      onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 10))}
      inputMode="numeric"
      autoComplete="one-time-code"
      autoFocus={autoFocus}
      required
      placeholder="••••••"
      aria-label="Kode verifikasi"
      className="field mono h-14 text-center text-2xl font-semibold tracking-[0.45em] placeholder:tracking-[0.45em]"
    />
  );
}

/** Tombol kirim ulang kode dengan hitung mundur */
export function ResendButton({ onResend, seconds = 60 }: { onResend: () => Promise<string | null>; seconds?: number }) {
  const [left, setLeft] = useState(seconds);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);

  async function click() {
    setBusy(true);
    setNote(null);
    const err = await onResend();
    setBusy(false);
    if (err) setNote(err);
    else {
      setNote("Kode baru sudah dikirim.");
      setLeft(seconds);
    }
  }

  return (
    <p className="text-center text-sm text-muted">
      Belum menerima email?{" "}
      {left > 0 ? (
        <span className="mono">Kirim ulang dalam {left} detik</span>
      ) : (
        <button type="button" onClick={click} disabled={busy} className="font-semibold text-accent hover:underline disabled:opacity-60">
          {busy ? "Mengirim..." : "Kirim ulang kode"}
        </button>
      )}
      {note && <span className="mt-1 block text-xs">{note}</span>}
    </p>
  );
}

/** Pesan error Supabase Auth ke bahasa Indonesia */
export function authError(message: string) {
  const m = message.toLowerCase();
  if (m.includes("expired") || m.includes("invalid") && m.includes("token")) return "Kode salah atau sudah kedaluwarsa. Coba lagi atau kirim ulang kode.";
  if (m.includes("rate limit") || m.includes("security purposes") || m.includes("too many")) return "Terlalu sering meminta kode. Tunggu sebentar lalu coba lagi.";
  if (m.includes("already registered")) return "Email ini sudah terdaftar. Silakan masuk.";
  if (m.includes("not authorized")) return "Email belum bisa dikirim ke alamat ini. Server email sedang disiapkan, coba lagi nanti.";
  if (m.includes("password") && m.includes("6")) return "Password terlalu pendek.";
  if (m.includes("same password") || m.includes("different from the old")) return "Password baru harus berbeda dari password lama.";
  return message;
}
