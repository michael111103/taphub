import type { Metadata } from "next";
import Link from "next/link";
import { getAppContext, href } from "@/lib/app/context";
import { todayJakarta } from "@/lib/app/format";
import { PageHeader } from "@/components/app/ui";
import ActionForm from "@/components/app/ActionForm";
import SubmitButton from "@/components/app/SubmitButton";
import { CATEGORY_LABEL } from "@/lib/app/accounting";
import { saveBankTransaction } from "../../../actions";

export const metadata: Metadata = { title: "Transaksi kas & bank" };

const KINDS = [
  { k: "receive", l: "Terima uang", d: "Uang masuk selain dari tagihan, misalnya setoran modal atau pendapatan lain." },
  { k: "spend", l: "Kirim uang", d: "Uang keluar selain biaya, misalnya prive atau bayar pinjaman." },
  { k: "transfer", l: "Transfer", d: "Pindah dana antar rekening sendiri." },
];

export default async function BankTxPage({ searchParams }: { searchParams: { jenis?: string; akun?: string } }) {
  const { supabase, org } = await getAppContext();
  const kind = KINDS.some((k) => k.k === searchParams.jenis) ? searchParams.jenis! : "receive";
  const [{ data: accounts }, { data: contacts }] = await Promise.all([
    supabase.from("accounts").select("id, code, name, category").eq("org_id", org.id).eq("is_archived", false).order("code"),
    supabase.from("contacts").select("id, name").eq("org_id", org.id).order("name"),
  ]);
  const acc = accounts ?? [];
  const cash = acc.filter((a) => a.category === "kas_bank");
  const counters = kind === "transfer" ? cash : acc.filter((a) => a.category !== "kas_bank");
  const groups = [...new Set(counters.map((a) => a.category))];
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Transaksi kas & bank" icon="transfer" tone="blue" crumbs={[{ label: "Kas & Bank", href: href("/kas-bank") }, { label: "Transaksi" }]} />
      <div className="mb-4 grid gap-2 sm:grid-cols-3">
        {KINDS.map((k) => (
          <Link key={k.k} href={href(`/kas-bank/transaksi?jenis=${k.k}${searchParams.akun ? `&akun=${searchParams.akun}` : ""}`)} className={`rounded-2xl border p-4 text-sm transition ${kind === k.k ? "border-tide-2/50 bg-tide-2/10" : "border-line bg-raised hover:border-tide-2/30"}`}>
            <span className={`block font-semibold ${kind === k.k ? "text-accent" : ""}`}>{k.l}</span>
            <span className="mt-1 block text-xs text-muted">{k.d}</span>
          </Link>
        ))}
      </div>
      <ActionForm action={saveBankTransaction} className="card space-y-4 p-5">
        <input type="hidden" name="kind" value={kind} />
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="acc">{kind === "receive" ? "Setor ke" : "Dari rekening"}</label>
            <select id="acc" name="account_id" defaultValue={searchParams.akun} className="field">{cash.map((a) => <option key={a.id} value={a.id}>{a.code} · {a.name}</option>)}</select>
          </div>
          <div>
            <label className="label" htmlFor="ctr">{kind === "transfer" ? "Ke rekening" : kind === "receive" ? "Sumber dana (akun)" : "Untuk akun"}</label>
            <select id="ctr" name="counter_account_id" className="field" defaultValue={kind === "transfer" ? cash.find((c) => c.id !== (searchParams.akun ?? cash[0]?.id))?.id : undefined}>
              {groups.map((g) => (
                <optgroup key={g} label={CATEGORY_LABEL[g] ?? g}>
                  {counters.filter((a) => a.category === g).map((a) => <option key={a.id} value={a.id}>{a.code} · {a.name}</option>)}
                </optgroup>
              ))}
            </select>
          </div>
          <div><label className="label" htmlFor="amount">Jumlah</label><input id="amount" name="amount" type="number" min={1} step="any" required className="field" /></div>
          <div><label className="label" htmlFor="date">Tanggal</label><input id="date" name="date" type="date" defaultValue={todayJakarta()} className="field" /></div>
          {kind !== "transfer" && (
            <div><label className="label" htmlFor="contact">Kontak</label><select id="contact" name="contact_id" className="field"><option value="">Tanpa kontak</option>{(contacts ?? []).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
          )}
          <div className={kind === "transfer" ? "sm:col-span-2" : ""}><label className="label" htmlFor="desc">Keterangan</label><input id="desc" name="description" className="field" /></div>
        </div>
        <SubmitButton>Simpan transaksi</SubmitButton>
      </ActionForm>
    </div>
  );
}
