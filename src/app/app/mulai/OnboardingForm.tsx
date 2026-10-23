"use client";

import { useFormState } from "react-dom";
import Link from "next/link";
import { createOrg } from "../actions";
import SubmitButton from "@/components/app/SubmitButton";

const industries = ["Kafe dan F&B", "Retail dan toko", "Jasa", "Distribusi dan grosir", "Manufaktur", "Teknologi", "Lainnya"];

export default function OnboardingForm({ defaultName, base }: { defaultName: string; base: string }) {
  const [state, action] = useFormState(createOrg, undefined);
  return (
    <form action={action} className="mt-8 space-y-4">
      <div>
        <label className="label" htmlFor="name">Nama usaha</label>
        <input id="name" name="name" required defaultValue={defaultName} className="field h-11" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="industry">Jenis usaha</label>
          <select id="industry" name="industry" className="field h-11" defaultValue="">
            <option value="">Pilih</option>
            {industries.map((i) => <option key={i}>{i}</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="phone">Telepon usaha</label>
          <input id="phone" name="phone" className="field h-11" />
        </div>
      </div>
      <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-line p-4 text-sm">
        <input type="checkbox" name="demo" className="mt-0.5 h-4 w-4 accent-[#1B5BFF]" />
        <span>
          <span className="font-semibold">Isi dengan data contoh</span>
          <span className="mt-0.5 block text-muted">Transaksi 5 bulan terakhir supaya dashboard dan laporan langsung terisi. Cocok untuk mencoba, bukan untuk pembukuan asli.</span>
        </span>
      </label>
      {state?.error && <p role="alert" className="rounded-xl bg-rose-500/10 px-3 py-2 text-sm text-rose-600 dark:text-rose-300">{state.error}</p>}
      <SubmitButton className="btn-primary h-11 w-full" pendingText="Menyiapkan...">Mulai pakai TapHub</SubmitButton>
      <Link href={`${base}/`} className="block text-center text-sm text-muted hover:text-fg">Kembali</Link>
    </form>
  );
}
