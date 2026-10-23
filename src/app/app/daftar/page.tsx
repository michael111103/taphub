import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthShell from "@/components/app/AuthShell";
import { getBase, getSession } from "@/lib/app/context";
import SignupForm from "./SignupForm";

export const metadata: Metadata = { title: "Daftar" };

export default async function SignupPage() {
  const base = getBase();
  const { user } = await getSession();
  if (user) redirect(base || "/");
  return (
    <AuthShell wide>
      <h1 className="mt-7 text-center text-2xl font-semibold tracking-[-0.01em]">Coba TapHub gratis 14 hari</h1>
      <p className="mt-2 text-center text-sm text-muted">Tanpa kartu kredit. Semua fitur bisa dicoba.</p>
      <SignupForm base={base} />
    </AuthShell>
  );
}
