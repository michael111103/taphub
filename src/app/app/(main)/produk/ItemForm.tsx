import ActionForm from "@/components/app/ActionForm";
import SubmitButton from "@/components/app/SubmitButton";
import { saveItem } from "../../actions";

export type ItemRow = { id?: string; sku?: string | null; name?: string; unit?: string; category?: string | null; description?: string | null; buy_price?: number; sell_price?: number; track_stock?: boolean; min_stock?: number };

export default function ItemForm({ i = {}, categories = [] }: { i?: ItemRow; categories?: string[] }) {
  return (
    <ActionForm action={saveItem} className="card space-y-4 p-5">
      {i.id && <input type="hidden" name="id" value={i.id} />}
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="label" htmlFor="name">Nama produk *</label><input id="name" name="name" required defaultValue={i.name} className="field" /></div>
        <div><label className="label" htmlFor="sku">Kode / SKU</label><input id="sku" name="sku" defaultValue={i.sku ?? ""} className="field" /></div>
        <div>
          <label className="label" htmlFor="category">Kategori</label>
          <input id="category" name="category" list="cats" defaultValue={i.category ?? ""} className="field" />
          <datalist id="cats">{categories.map((c) => <option key={c} value={c} />)}</datalist>
        </div>
        <div><label className="label" htmlFor="unit">Satuan</label><input id="unit" name="unit" defaultValue={i.unit ?? "pcs"} className="field" /></div>
        <div><label className="label" htmlFor="buy">Harga beli</label><input id="buy" name="buy_price" type="number" step="any" min={0} defaultValue={i.buy_price ?? 0} className="field" /></div>
        <div><label className="label" htmlFor="sell">Harga jual</label><input id="sell" name="sell_price" type="number" step="any" min={0} defaultValue={i.sell_price ?? 0} className="field" /></div>
        <label className="flex items-center gap-3 rounded-xl border border-line p-3 text-sm sm:col-span-1">
          <input type="checkbox" name="track_stock" defaultChecked={i.track_stock ?? true} className="h-4 w-4 accent-[#1B5BFF]" />
          <span><b>Lacak stok</b><span className="block text-xs text-muted">Matikan untuk jasa atau produk tanpa stok</span></span>
        </label>
        <div><label className="label" htmlFor="min">Stok minimum</label><input id="min" name="min_stock" type="number" step="any" min={0} defaultValue={i.min_stock ?? 0} className="field" /></div>
        <div className="sm:col-span-2"><label className="label" htmlFor="desc">Deskripsi</label><textarea id="desc" name="description" rows={3} defaultValue={i.description ?? ""} className="field" /></div>
      </div>
      <p className="text-xs text-muted">Stok bertambah lewat tagihan pembelian dan berkurang lewat tagihan penjualan, jadi selalu sesuai pembukuan.</p>
      <SubmitButton>{i.id ? "Simpan perubahan" : "Simpan produk"}</SubmitButton>
    </ActionForm>
  );
}
