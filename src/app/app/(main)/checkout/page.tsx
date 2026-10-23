import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAppContext, href } from "@/lib/app/context";
import { PageHeader } from "@/components/app/ui";
import CheckoutForm from "./CheckoutForm";

export const metadata: Metadata = { title: "Checkout" };

export default async function CheckoutPage({ searchParams }: { searchParams: { paket?: string; siklus?: string } }) {
  const { supabase, org } = await getAppContext();
  const { data: plan } = await supabase.from("plans").select("code, name, description, price_monthly, price_yearly, features, tap_products(name)").eq("code", searchParams.paket ?? "").single();
  if (!plan) notFound();
  const p = plan as unknown as { code: string; name: string; description: string; price_monthly: number; price_yearly: number; features: string[]; tap_products: { name: string } };
  return (
    <div className="mx-auto max-w-[1100px]">
      <PageHeader title="Checkout" icon="card" tone="amber" crumbs={[{ label: "Langganan", href: href("/langganan") }, { label: "Checkout" }]} />
      {org.role === "staff" ? (
        <p className="card p-6 text-sm">Hanya pemilik atau admin yang bisa berlangganan. <Link href={href("/langganan")} className="text-accent">Kembali</Link></p>
      ) : (
        <CheckoutForm plan={{ code: p.code, name: p.name, product: p.tap_products.name, description: p.description, monthly: Number(p.price_monthly), yearly: Number(p.price_yearly), features: p.features }} initialCycle={searchParams.siklus === "tahunan" ? "yearly" : "monthly"} orgName={org.name} />
      )}
    </div>
  );
}
