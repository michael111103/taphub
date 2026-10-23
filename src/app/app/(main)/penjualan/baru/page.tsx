import type { Metadata } from "next";
import { DocNew } from "../../_shared/docs";

export const metadata: Metadata = { title: "Transaksi baru" };

export default function Page({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  return <DocNew side="sales" searchParams={searchParams} />;
}
