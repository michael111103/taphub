import type { Metadata } from "next";
import AuthShell from "@/components/app/AuthShell";
import { getBase } from "@/lib/app/context";
import ResetForm from "./ResetForm";

export const metadata: Metadata = { title: "Lupa password" };

export default function ForgotPage() {
  const base = getBase();
  return (
    <AuthShell>
      <h1 className="mt-7 text-center text-2xl font-semibold tracking-[-0.01em]">Atur ulang password</h1>
      <p className="mt-2 text-center text-sm text-muted">Masukkan email akunmu. Kami kirim link untuk membuat password baru.</p>
      <ResetForm base={base} />
    </AuthShell>
  );
}
