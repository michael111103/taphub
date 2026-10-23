"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAppContext, getSession, href } from "@/lib/app/context";

export type ActionState = { error?: string; ok?: string } | undefined;

const s = (fd: FormData, k: string) => {
  const v = fd.get(k);
  return typeof v === "string" ? v.trim() : "";
};
const n = (fd: FormData, k: string) => {
  let v = s(fd, k).replace(/\s/g, "");
  // "1.250.000,50" (format Indonesia) -> 1250000.50; "1250000.5" (input number) tetap
  if (v.includes(",")) v = v.replace(/\./g, "").replace(",", ".");
  const num = Number(v);
  return Number.isFinite(num) ? num : 0;
};
const nul = (v: string) => (v === "" ? null : v);

function friendly(msg: string) {
  if (msg.includes("duplicate key") && msg.includes("sku")) return "Kode produk (SKU) sudah dipakai produk lain.";
  if (msg.includes("duplicate key") && msg.includes("code")) return "Kode akun sudah dipakai.";
  if (msg.includes("violates row-level security")) return "Kamu tidak punya akses untuk tindakan ini.";
  return msg;
}

// ================= AKUN & ORGANISASI =================
export async function signOut() {
  const { supabase } = await getSession();
  await supabase.auth.signOut();
  redirect(href("/login"));
}

export async function switchOrg(orgId: string) {
  const { supabase, user, orgs } = await getAppContext();
  if (!orgs.some((o) => o.id === orgId)) return;
  await supabase.from("profiles").update({ current_org_id: orgId }).eq("id", user.id);
  revalidatePath("/", "layout");
  redirect(href("/"));
}

export async function createOrg(_: ActionState, fd: FormData): Promise<ActionState> {
  const { supabase, user } = await getSession();
  if (!user) redirect(href("/login"));
  const name = s(fd, "name");
  if (!name) return { error: "Nama usaha wajib diisi." };
  const { data: orgId, error } = await supabase.rpc("create_organization", {
    p_name: name,
    p_industry: nul(s(fd, "industry")),
    p_phone: nul(s(fd, "phone")),
  });
  if (error) return { error: friendly(error.message) };
  if (fd.get("demo") === "on") {
    const { error: e2 } = await supabase.rpc("seed_demo", { p_org: orgId });
    if (e2) return { error: friendly(e2.message) };
  }
  revalidatePath("/", "layout");
  redirect(href("/"));
}

export async function seedDemo(): Promise<ActionState> {
  const { supabase, org } = await getAppContext();
  const { error } = await supabase.rpc("seed_demo", { p_org: org.id });
  if (error) return { error: friendly(error.message) };
  revalidatePath("/", "layout");
  return { ok: "Data contoh berhasil diisi." };
}

export async function updateOrg(_: ActionState, fd: FormData): Promise<ActionState> {
  const { supabase, org } = await getAppContext();
  const { error } = await supabase
    .from("organizations")
    .update({
      name: s(fd, "name") || org.name,
      legal_name: nul(s(fd, "legal_name")),
      industry: nul(s(fd, "industry")),
      email: nul(s(fd, "email")),
      phone: nul(s(fd, "phone")),
      address: nul(s(fd, "address")),
      city: nul(s(fd, "city")),
      npwp: nul(s(fd, "npwp")),
    })
    .eq("id", org.id);
  if (error) return { error: friendly(error.message) };
  revalidatePath("/", "layout");
  return { ok: "Data perusahaan tersimpan." };
}

export async function updateProfile(_: ActionState, fd: FormData): Promise<ActionState> {
  const { supabase, user } = await getAppContext();
  const { error } = await supabase.from("profiles").update({ full_name: s(fd, "full_name"), phone: nul(s(fd, "phone")) }).eq("id", user.id);
  if (error) return { error: friendly(error.message) };
  const password = s(fd, "password");
  if (password) {
    if (password.length < 8) return { error: "Password baru minimal 8 karakter." };
    if (password !== s(fd, "password2")) return { error: "Ulangi password baru tidak sama." };
    const { error: pe } = await supabase.auth.updateUser({ password });
    if (pe) return { error: pe.message };
  }
  revalidatePath("/", "layout");
  return { ok: password ? "Profil dan password tersimpan." : "Profil tersimpan." };
}

// ================= DOKUMEN (penjualan / pembelian / biaya) =================
type DocPayload = Record<string, unknown> & { lines: Record<string, unknown>[] };

export async function saveSalesDocument(payload: DocPayload): Promise<ActionState> {
  const { supabase, org } = await getAppContext();
  const { data, error } = await supabase.rpc("create_sales_document", { p_org: org.id, p_doc: payload });
  if (error) return { error: friendly(error.message) };
  revalidatePath("/", "layout");
  redirect(href(`/penjualan/dokumen/${data}`));
}

export async function savePurchaseDocument(payload: DocPayload): Promise<ActionState> {
  const { supabase, org } = await getAppContext();
  const { data, error } = await supabase.rpc("create_purchase_document", { p_org: org.id, p_doc: payload });
  if (error) return { error: friendly(error.message) };
  revalidatePath("/", "layout");
  redirect(href(`/pembelian/dokumen/${data}`));
}

export async function saveExpense(payload: DocPayload): Promise<ActionState> {
  const { supabase, org } = await getAppContext();
  const { data, error } = await supabase.rpc("create_expense", { p_org: org.id, p_doc: payload });
  if (error) return { error: friendly(error.message) };
  revalidatePath("/", "layout");
  redirect(href(`/biaya/${data}`));
}

export async function recordPayment(_: ActionState, fd: FormData): Promise<ActionState> {
  const { supabase, org } = await getAppContext();
  const amount = n(fd, "amount");
  if (amount <= 0) return { error: "Isi jumlah pembayaran." };
  const { error } = await supabase.rpc("record_payment", {
    p_org: org.id,
    p_source_type: s(fd, "source_type"),
    p_source_id: s(fd, "source_id"),
    p_account_id: s(fd, "account_id"),
    p_amount: amount,
    p_date: s(fd, "date") || null,
    p_notes: nul(s(fd, "notes")),
  });
  if (error) return { error: friendly(error.message) };
  revalidatePath("/", "layout");
  return { ok: "Pembayaran tercatat." };
}

export async function voidDocument(_: ActionState, fd: FormData): Promise<ActionState> {
  const { supabase, org } = await getAppContext();
  const { error } = await supabase.rpc("void_document", { p_org: org.id, p_source_type: s(fd, "source_type"), p_id: s(fd, "id") });
  if (error) return { error: friendly(error.message) };
  revalidatePath("/", "layout");
  return { ok: "Dokumen dibatalkan dan jurnal baliknya sudah dibuat." };
}

// ================= DATA MASTER =================
export async function saveContact(_: ActionState, fd: FormData): Promise<ActionState> {
  const { supabase, org } = await getAppContext();
  const kind = fd.getAll("kind").map(String);
  const row = {
    org_id: org.id,
    kind: kind.length ? kind : ["customer"],
    name: s(fd, "name"),
    company: nul(s(fd, "company")),
    email: nul(s(fd, "email")),
    phone: nul(s(fd, "phone")),
    address: nul(s(fd, "address")),
    city: nul(s(fd, "city")),
    npwp: nul(s(fd, "npwp")),
    notes: nul(s(fd, "notes")),
  };
  if (!row.name) return { error: "Nama kontak wajib diisi." };
  const id = s(fd, "id");
  const { data, error } = id
    ? await supabase.from("contacts").update(row).eq("id", id).select("id").single()
    : await supabase.from("contacts").insert(row).select("id").single();
  if (error) return { error: friendly(error.message) };
  revalidatePath("/", "layout");
  redirect(href(`/kontak/${data.id}`));
}

export async function saveItem(_: ActionState, fd: FormData): Promise<ActionState> {
  const { supabase, org } = await getAppContext();
  const row = {
    org_id: org.id,
    sku: nul(s(fd, "sku")),
    name: s(fd, "name"),
    unit: s(fd, "unit") || "pcs",
    category: nul(s(fd, "category")),
    description: nul(s(fd, "description")),
    buy_price: n(fd, "buy_price"),
    sell_price: n(fd, "sell_price"),
    track_stock: fd.get("track_stock") === "on",
    min_stock: n(fd, "min_stock"),
  };
  if (!row.name) return { error: "Nama produk wajib diisi." };
  const id = s(fd, "id");
  const { data, error } = id
    ? await supabase.from("items").update(row).eq("id", id).select("id").single()
    : await supabase.from("items").insert(row).select("id").single();
  if (error) return { error: friendly(error.message) };
  revalidatePath("/", "layout");
  redirect(href(`/produk/${data.id}`));
}

export async function saveAccount(_: ActionState, fd: FormData): Promise<ActionState> {
  const { supabase, org } = await getAppContext();
  const row = {
    org_id: org.id,
    code: s(fd, "code"),
    name: s(fd, "name"),
    category: s(fd, "category"),
    description: nul(s(fd, "description")),
  };
  if (!row.code || !row.name) return { error: "Kode dan nama akun wajib diisi." };
  const id = s(fd, "id");
  const { error } = id
    ? await supabase.from("accounts").update({ name: row.name, description: row.description }).eq("id", id)
    : await supabase.from("accounts").insert(row);
  if (error) return { error: friendly(error.message) };
  revalidatePath("/", "layout");
  redirect(href(row.category === "kas_bank" ? "/kas-bank" : "/akun"));
}

export async function saveBankTransaction(_: ActionState, fd: FormData): Promise<ActionState> {
  const { supabase, org } = await getAppContext();
  const payload = {
    kind: s(fd, "kind"),
    account_id: s(fd, "account_id"),
    counter_account_id: s(fd, "counter_account_id"),
    contact_id: s(fd, "contact_id"),
    amount: n(fd, "amount"),
    date: s(fd, "date"),
    description: nul(s(fd, "description")),
  };
  if (!payload.account_id || !payload.counter_account_id) return { error: "Pilih akun asal dan tujuan." };
  if (payload.amount <= 0) return { error: "Isi jumlah transaksi." };
  const { error } = await supabase.rpc("create_bank_transaction", { p_org: org.id, p_doc: payload });
  if (error) return { error: friendly(error.message) };
  revalidatePath("/", "layout");
  redirect(href(`/kas-bank/${payload.account_id}`));
}

export async function saveFixedAsset(_: ActionState, fd: FormData): Promise<ActionState> {
  const { supabase, org } = await getAppContext();
  const payload = {
    name: s(fd, "name"),
    acquired_on: s(fd, "acquired_on"),
    cost: n(fd, "cost"),
    asset_account_id: s(fd, "asset_account_id"),
    paid_from_account_id: s(fd, "paid_from_account_id"),
    useful_life_months: Math.max(1, Math.round(n(fd, "useful_life_years") * 12)),
    salvage_value: n(fd, "salvage_value"),
    notes: nul(s(fd, "notes")),
  };
  if (!payload.name || payload.cost <= 0) return { error: "Isi nama dan harga perolehan aset." };
  const { error } = await supabase.rpc("create_fixed_asset", { p_org: org.id, p_doc: payload });
  if (error) return { error: friendly(error.message) };
  revalidatePath("/", "layout");
  redirect(href("/aset-tetap"));
}

// ================= LANGGANAN =================
export async function createCheckout(_: ActionState, fd: FormData): Promise<ActionState> {
  const { supabase, org } = await getAppContext();
  const method = s(fd, "method");
  if (!method) return { error: "Pilih metode pembayaran." };
  const { data, error } = await supabase.rpc("create_billing_invoice", {
    p_org: org.id,
    p_plan_code: s(fd, "plan"),
    p_cycle: s(fd, "cycle") === "yearly" ? "yearly" : "monthly",
    p_method: method.split(":")[0],
    p_channel: method.split(":")[1] ?? null,
  });
  if (error) return { error: friendly(error.message) };
  revalidatePath("/", "layout");
  redirect(href(`/checkout/${data}`));
}

export async function cancelCheckout(_: ActionState, fd: FormData): Promise<ActionState> {
  const { supabase, org } = await getAppContext();
  const { error } = await supabase.rpc("cancel_billing_invoice", { p_org: org.id, p_id: s(fd, "id") });
  if (error) return { error: friendly(error.message) };
  revalidatePath("/", "layout");
  return { ok: "Tagihan dibatalkan." };
}
