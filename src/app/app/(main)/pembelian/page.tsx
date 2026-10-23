import type { Metadata } from "next";
import { DocOverview } from "../_shared/docs";

export const metadata: Metadata = { title: "Overview Pembelian" };

export default function Page() {
  return <DocOverview side="purchase" />;
}
