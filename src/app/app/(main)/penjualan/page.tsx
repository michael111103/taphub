import type { Metadata } from "next";
import { DocOverview } from "../_shared/docs";

export const metadata: Metadata = { title: "Overview Penjualan" };

export default function Page() {
  return <DocOverview side="sales" />;
}
