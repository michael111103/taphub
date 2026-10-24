import AppShell from "@/components/app/AppShell";
import { getAppContext, trialDaysLeft } from "@/lib/app/context";
import { idr, num } from "@/lib/app/format";

export const dynamic = "force-dynamic";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const { supabase, user, profile, org, orgs, subscriptions, base } = await getAppContext();
  const today = new Date().toISOString().slice(0, 10);

  const [overdue, lowStock, pendingBills, payables] = await Promise.all([
    supabase.from("sales_documents").select("total, paid_amount").eq("org_id", org.id).eq("kind", "invoice").in("status", ["open", "partial"]).lt("due_date", today),
    supabase.from("items").select("id, stock_qty, min_stock").eq("org_id", org.id).eq("track_stock", true).eq("is_archived", false),
    supabase.from("billing_invoices").select("id, number").eq("org_id", org.id).eq("status", "pending").gt("expires_at", new Date().toISOString()),
    supabase.from("purchase_documents").select("total, paid_amount").eq("org_id", org.id).eq("kind", "bill").in("status", ["open", "partial"]).lt("due_date", today),
  ]);

  const notices: { label: string; detail: string; href: string; tone: "rose" | "amber" | "blue" }[] = [];
  const od = overdue.data ?? [];
  if (od.length) notices.push({ label: `${od.length} tagihan penjualan jatuh tempo`, detail: `Sisa ${idr(od.reduce((a, r) => a + Number(r.total) - Number(r.paid_amount), 0))} belum dibayar`, href: "/penjualan/tagihan?status=jatuh-tempo", tone: "rose" });
  const pb = payables.data ?? [];
  if (pb.length) notices.push({ label: `${pb.length} tagihan pembelian jatuh tempo`, detail: `Sisa ${idr(pb.reduce((a, r) => a + Number(r.total) - Number(r.paid_amount), 0))} perlu dibayar`, href: "/pembelian/tagihan?status=jatuh-tempo", tone: "amber" });
  const ls = (lowStock.data ?? []).filter((i) => Number(i.stock_qty) <= Number(i.min_stock));
  if (ls.length) notices.push({ label: `${num(ls.length)} produk stoknya menipis`, detail: "Cek inventori dan buat pesanan pembelian", href: "/inventori?filter=menipis", tone: "amber" });
  for (const b of pendingBills.data ?? []) notices.push({ label: `Tagihan langganan ${b.number} menunggu pembayaran`, detail: "Selesaikan pembayaran agar paket aktif", href: `/checkout/${b.id}`, tone: "blue" });

  const books = subscriptions.find((s) => s.product_code === "books");
  const trialDays = trialDaysLeft(subscriptions);
  const planLabel = "TapBisnis";

  return (
    <AppShell
      base={base}
      orgName={org.name}
      orgId={org.id}
      orgs={orgs.map((o) => ({ id: o.id, name: o.name }))}
      planLabel={planLabel}
      trialDays={books?.status === "trial" ? trialDays : null}
      userName={profile.full_name ?? user.email ?? "Pengguna"}
      userEmail={user.email ?? ""}
      notices={notices}
    >
      {children}
    </AppShell>
  );
}
