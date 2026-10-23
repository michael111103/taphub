import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { supabaseServer } from "./supabase";

/** Prefix link aplikasi: "" di app.taphub.id, "/app" di preview Vercel dan localhost */
export function getBase() {
  return headers().get("x-app-base") ?? "/app";
}

export function href(path: string) {
  const base = getBase();
  if (path === "/") return base || "/";
  return `${base}${path}`;
}

export type Org = {
  id: string;
  name: string;
  legal_name: string | null;
  industry: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  npwp: string | null;
  logo_url: string | null;
  role: "owner" | "admin" | "staff";
};

export type Subscription = {
  product_code: string;
  status: "trial" | "active" | "past_due" | "canceled" | "expired";
  trial_ends_at: string | null;
  current_period_end: string | null;
  plan: { code: string; name: string } | null;
};

export const getSession = cache(async () => {
  const supabase = supabaseServer();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error && error.name !== "AuthSessionMissingError") console.warn("[auth] getUser gagal:", error.message);
  return { supabase, user };
});

/** Data dasar untuk semua halaman aplikasi yang butuh login */
export const getAppContext = cache(async () => {
  const { supabase, user } = await getSession();
  if (!user) redirect(href("/login"));

  const [{ data: profile }, { data: memberships }] = await Promise.all([
    supabase.from("profiles").select("id, full_name, phone, current_org_id").eq("id", user.id).single(),
    supabase
      .from("org_members")
      .select("role, organizations!inner(id, name, legal_name, industry, email, phone, address, city, npwp, logo_url, is_archived)")
      .eq("user_id", user.id)
      .eq("organizations.is_archived", false),
  ]);

  type Row = { role: Org["role"]; organizations: Omit<Org, "role"> & { is_archived: boolean } };
  const orgs: Org[] = ((memberships ?? []) as unknown as Row[]).map((m) => ({ ...m.organizations, role: m.role }));
  if (orgs.length === 0) redirect(href("/mulai"));

  const org = orgs.find((o) => o.id === profile?.current_org_id) ?? orgs[0];

  const { data: subs } = await supabase
    .from("subscriptions")
    .select("product_code, status, trial_ends_at, current_period_end, plans(code, name)")
    .eq("org_id", org.id);

  const subscriptions: Subscription[] = ((subs ?? []) as unknown as (Subscription & { plans: Subscription["plan"] })[]).map((s) => ({
    ...s,
    plan: s.plans,
  }));

  return {
    supabase,
    user,
    profile: profile ?? { id: user.id, full_name: user.email, phone: null, current_org_id: org.id },
    orgs,
    org,
    subscriptions,
    base: getBase(),
  };
});

export function trialDaysLeft(subs: Subscription[]) {
  const trial = subs.find((s) => s.product_code === "books" && s.status === "trial");
  if (!trial?.trial_ends_at) return null;
  return Math.max(0, Math.ceil((new Date(trial.trial_ends_at).getTime() - Date.now()) / 86400000));
}
