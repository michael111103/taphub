import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthShell from "@/components/app/AuthShell";
import { getBase, getSession } from "@/lib/app/context";
import OnboardingForm from "./OnboardingForm";

export const metadata: Metadata = { title: "Mulai" };

export default async function StartPage({ searchParams }: { searchParams: { usaha?: string } }) {
  const base = getBase();
  const { user } = await getSession();
  if (!user) redirect(`${base}/login`);
  const suggested = searchParams.usaha ?? (user.user_metadata?.business_name as string | undefined) ?? "";
  return (
    <AuthShell wide>
      <h1 className="mt-7 text-center text-2xl font-semibold tracking-[-0.01em]">Siapkan usahamu</h1>
      <p className="mt-2 text-center text-sm text-muted">Bagan akun standar langsung dibuat. Kamu bisa mengubahnya kapan saja.</p>
      <OnboardingForm defaultName={suggested} base={base} />
    </AuthShell>
  );
}
