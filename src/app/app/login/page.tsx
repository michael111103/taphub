import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthShell from "@/components/app/AuthShell";
import { getBase, getSession } from "@/lib/app/context";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Masuk" };

export default async function LoginPage({ searchParams }: { searchParams: { next?: string } }) {
  const base = getBase();
  const { user } = await getSession();
  if (user) redirect(base || "/");

  return (
    <AuthShell>
      <h1 className="mt-7 text-center text-2xl font-semibold tracking-[-0.01em]">Selamat datang di TapHub</h1>
      <p className="mt-2 text-center text-sm text-muted">Masuk untuk mengelola penjualan, keuangan, dan stok usahamu.</p>
      <LoginForm base={base} next={searchParams.next} />
    </AuthShell>
  );
}
