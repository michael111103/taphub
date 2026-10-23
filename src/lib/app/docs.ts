export type Side = "sales" | "purchase";

export const KIND_SLUG = {
  sales: { invoice: "tagihan", order: "pemesanan", quote: "penawaran" },
  purchase: { bill: "tagihan", order: "pesanan", quote: "penawaran" },
} as const;

export const KIND_LABEL: Record<Side, Record<string, string>> = {
  sales: { invoice: "Tagihan", order: "Pemesanan", quote: "Penawaran" },
  purchase: { bill: "Tagihan Pembelian", order: "Pesanan Pembelian", quote: "Penawaran Pembelian" },
};

export function kindFromSlug(side: Side, slug: string) {
  const map = KIND_SLUG[side] as Record<string, string>;
  return Object.keys(map).find((k) => map[k] === slug) ?? null;
}

export const SIDE_PATH: Record<Side, string> = { sales: "/penjualan", purchase: "/pembelian" };
export const SIDE_TABLE: Record<Side, string> = { sales: "sales_documents", purchase: "purchase_documents" };
export const SIDE_LINES: Record<Side, string> = { sales: "sales_document_lines", purchase: "purchase_document_lines" };

/** Jenis dokumen berikutnya dalam alur (penawaran -> pemesanan -> tagihan) */
export function nextKind(side: Side, kind: string) {
  if (kind === "quote") return "order";
  if (kind === "order") return side === "sales" ? "invoice" : "bill";
  return null;
}
