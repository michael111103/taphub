import type { Metadata } from "next";
import { DocList } from "../../_shared/docs";
import { KIND_LABEL, kindFromSlug } from "@/lib/app/docs";

export function generateMetadata({ params }: { params: { jenis: string } }): Metadata {
  const k = kindFromSlug("purchase", params.jenis);
  return { title: k ? KIND_LABEL.purchase[k] : "Pembelian" };
}

export default function Page({ params, searchParams }: { params: { jenis: string }; searchParams: Record<string, string | undefined> }) {
  return <DocList side="purchase" slug={params.jenis} searchParams={searchParams} />;
}
