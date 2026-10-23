import type { Metadata } from "next";
import { AccountLedger } from "../../_shared/ledger";

export const metadata: Metadata = { title: "Buku besar akun" };

export default function Page({ params, searchParams }: { params: { id: string }; searchParams: { dari?: string; sampai?: string } }) {
  return <AccountLedger id={params.id} from={searchParams.dari} to={searchParams.sampai} section="akun" />;
}
