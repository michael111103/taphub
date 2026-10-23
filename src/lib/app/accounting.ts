export const CATEGORY_LABEL: Record<string, string> = {
  kas_bank: "Kas & Bank",
  piutang: "Piutang",
  persediaan: "Persediaan",
  aset_lancar_lain: "Aset Lancar Lainnya",
  aset_tetap: "Aset Tetap",
  depresiasi: "Akumulasi Penyusutan",
  hutang: "Hutang Usaha",
  kewajiban_lancar_lain: "Kewajiban Lancar Lainnya",
  kewajiban_jangka_panjang: "Kewajiban Jangka Panjang",
  modal: "Ekuitas",
  pendapatan: "Pendapatan",
  hpp: "Harga Pokok Penjualan",
  beban: "Beban",
  pendapatan_lain: "Pendapatan Lainnya",
  beban_lain: "Beban Lainnya",
};

export const CATEGORY_ORDER = Object.keys(CATEGORY_LABEL);

const DEBIT_NORMAL = new Set(["kas_bank", "piutang", "persediaan", "aset_lancar_lain", "aset_tetap", "depresiasi", "hpp", "beban", "beban_lain"]);
export function isDebitNormal(category: string) {
  return DEBIT_NORMAL.has(category);
}

export type Balance = { account_id: string; code: string; name: string; category: string; debit: number; credit: number };

/** Saldo sesuai saldo normal akun */
export function balanceOf(b: Balance) {
  const d = Number(b.debit), c = Number(b.credit);
  return isDebitNormal(b.category) ? d - c : c - d;
}

export const ASSET_CATS = ["kas_bank", "piutang", "persediaan", "aset_lancar_lain", "aset_tetap", "depresiasi"];
export const LIAB_CATS = ["hutang", "kewajiban_lancar_lain", "kewajiban_jangka_panjang"];
export const EQUITY_CATS = ["modal"];
export const INCOME_CATS = ["pendapatan", "pendapatan_lain"];
export const EXPENSE_CATS = ["hpp", "beban", "beban_lain"];
