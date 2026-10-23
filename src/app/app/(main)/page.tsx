import type { Metadata } from "next";
import { getAppContext } from "@/lib/app/context";
import Dashboard, { type Summary } from "./Dashboard";

export const metadata: Metadata = { title: "Beranda" };

const RANGES = [7, 30, 90];

export default async function HomePage({ searchParams }: { searchParams: { r?: string } }) {
  const { supabase, org, profile, base } = await getAppContext();
  const days = RANGES.includes(Number(searchParams.r)) ? Number(searchParams.r) : 30;
  const { data, error } = await supabase.rpc("dashboard_summary", { p_org: org.id, p_days: days });
  if (error) throw new Error(error.message);

  return <Dashboard summary={data as Summary} days={days} base={base} orgName={org.name} userName={profile.full_name ?? ""} />;
}
