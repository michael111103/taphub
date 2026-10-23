import type { Metadata } from "next";
import { getAppContext, href } from "@/lib/app/context";
import { todayJakarta } from "@/lib/app/format";
import { PageHeader } from "@/components/app/ui";
import ExpenseForm from "@/components/app/ExpenseForm";

export const metadata: Metadata = { title: "Catat biaya" };

export default async function NewExpensePage() {
  const { supabase, org } = await getAppContext();
  const [{ data: accounts }, { data: contacts }] = await Promise.all([
    supabase.from("accounts").select("id, code, name, category").eq("org_id", org.id).eq("is_archived", false).order("code"),
    supabase.from("contacts").select("id, name").eq("org_id", org.id).order("name"),
  ]);
  const acc = accounts ?? [];
  return (
    <div className="mx-auto max-w-[1200px]">
      <PageHeader title="Catat biaya" icon="expense" tone="pink" crumbs={[{ label: "Biaya", href: href("/biaya") }, { label: "Baru" }]} description="Biaya langsung masuk ke jurnal: akun beban bertambah, kas berkurang (atau hutang bertambah jika dibayar nanti)." />
      <ExpenseForm
        expenseAccounts={acc.filter((a) => ["beban", "beban_lain", "hpp"].includes(a.category))}
        cashAccounts={acc.filter((a) => a.category === "kas_bank")}
        contacts={contacts ?? []}
        today={todayJakarta()}
        cancelHref={href("/biaya")}
      />
    </div>
  );
}
