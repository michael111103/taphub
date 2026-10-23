import type { Metadata } from "next";
import { DocDetail } from "../../../_shared/docs";

export const metadata: Metadata = { title: "Detail transaksi" };

export default function Page({ params }: { params: { id: string } }) {
  return <DocDetail side="purchase" id={params.id} />;
}
