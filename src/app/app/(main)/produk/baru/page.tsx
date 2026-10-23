import type { Metadata } from "next";
import { getAppContext, href } from "@/lib/app/context";
import { PageHeader } from "@/components/app/ui";
import ItemForm from "../ItemForm";

export const metadata: Metadata = { title: "Produk baru" };

export default async function NewItemPage() {
  const { supabase, org } = await getAppContext();
  const { data } = await supabase.from("items").select("category").eq("org_id", org.id);
  const cats = [...new Set((data ?? []).map((d) => d.category).filter(Boolean))] as string[];
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Produk baru" icon="box" tone="amber" crumbs={[{ label: "Produk", href: href("/produk") }, { label: "Baru" }]} />
      <ItemForm categories={cats} />
    </div>
  );
}
