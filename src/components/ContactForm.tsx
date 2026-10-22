"use client";

import { useState } from "react";
import { whatsappLink } from "@/lib/site";
import { products } from "@/lib/products";

type Fields = { name: string; business: string; type: string; product: string; phone: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;

const businessTypes = ["Cafe", "Restoran / rumah makan", "Toko / retail", "Jasa", "Lainnya"];

function validate(f: Fields, needProduct: boolean): Errors {
  const e: Errors = {};
  if (f.name.trim().length < 2) e.name = "Isi nama kamu, minimal 2 huruf.";
  if (f.business.trim().length < 2) e.business = "Isi nama usahamu.";
  if (!f.type) e.type = "Pilih jenis usaha.";
  if (needProduct && !f.product) e.product = "Pilih produk yang kamu minati.";
  const digits = f.phone.replace(/\D/g, "");
  if (!/^(0|62)8\d{7,11}$/.test(digits)) e.phone = "Isi nomor WhatsApp yang valid, contoh 0812 3456 7890.";
  if (f.message.length > 500) e.message = "Pesan maksimal 500 karakter.";
  return e;
}

/**
 * Formulir kontak yang membuka WhatsApp dengan pesan terisi.
 * - Tanpa prop `product`: pengunjung memilih produk (dipakai di beranda).
 * - Dengan prop `product`: produk sudah ditentukan (dipakai di landing page produk).
 */
export default function ContactForm({ product }: { product?: string }) {
  const empty: Fields = { name: "", business: "", type: "", product: product ?? "", phone: "", message: "" };
  const needProduct = !product;
  const [fields, setFields] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFields((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(fields, needProduct);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      document.getElementById(`f-${first}`)?.focus();
      return;
    }
    const interest = fields.product === "Belum tahu" ? "produk TapHub" : fields.product;
    const text = [
      `Halo TapHub, saya tertarik dengan ${interest}.`,
      `Nama: ${fields.name.trim()}`,
      `Usaha: ${fields.business.trim()} (${fields.type})`,
      `WhatsApp: ${fields.phone.trim()}`,
      fields.message.trim() ? `Pesan: ${fields.message.trim()}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    window.open(whatsappLink(text), "_blank", "noopener,noreferrer");
    setSent(true);
  };

  if (sent) {
    return (
      <div role="status" className="rounded-3xl border border-tide-1/30 bg-tide-2/10 p-6">
        <p className="text-lg font-semibold">WhatsApp sudah terbuka dengan pesanmu.</p>
        <p className="mt-2 text-sm leading-6 text-muted">
          Tekan kirim di WhatsApp, lalu kami balas di sana. Kalau WhatsApp tidak terbuka, cek pemblokir pop-up di browsermu.
        </p>
        <button type="button" className="btn-ghost mt-5" onClick={() => { setFields(empty); setSent(false); }}>
          Isi formulir lagi
        </button>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2" aria-label="Formulir kontak">
      <Field id="name" label="Nama" error={errors.name}>
        <input id="f-name" name="name" autoComplete="name" value={fields.name} onChange={set("name")} className={inputCls(errors.name)} aria-invalid={!!errors.name} aria-describedby={errors.name ? "e-name" : undefined} />
      </Field>
      <Field id="business" label="Nama usaha" error={errors.business}>
        <input id="f-business" name="business" autoComplete="organization" value={fields.business} onChange={set("business")} className={inputCls(errors.business)} aria-invalid={!!errors.business} aria-describedby={errors.business ? "e-business" : undefined} />
      </Field>
      <Field id="type" label="Jenis usaha" error={errors.type}>
        <select id="f-type" name="type" value={fields.type} onChange={set("type")} className={inputCls(errors.type)} aria-invalid={!!errors.type} aria-describedby={errors.type ? "e-type" : undefined}>
          <option value="">Pilih jenis usaha</option>
          {businessTypes.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </Field>
      {needProduct ? (
        <Field id="product" label="Produk yang diminati" error={errors.product}>
          <select id="f-product" name="product" value={fields.product} onChange={set("product")} className={inputCls(errors.product)} aria-invalid={!!errors.product} aria-describedby={errors.product ? "e-product" : undefined}>
            <option value="">Pilih produk</option>
            {products.map((p) => <option key={p.slug} value={p.name}>{p.name}</option>)}
            <option value="Belum tahu">Belum tahu, minta saran</option>
          </select>
        </Field>
      ) : null}
      <div className={needProduct ? "sm:col-span-2" : ""}>
        <Field id="phone" label="Nomor WhatsApp" error={errors.phone}>
          <input id="f-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="0812 3456 7890" value={fields.phone} onChange={set("phone")} className={inputCls(errors.phone)} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "e-phone" : undefined} />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field id="message" label="Pesan (opsional)" error={errors.message}>
          <textarea id="f-message" name="message" rows={4} maxLength={600} value={fields.message} onChange={set("message")} className={inputCls(errors.message)} aria-invalid={!!errors.message} aria-describedby={errors.message ? "e-message" : undefined} placeholder="Ceritakan sedikit tentang usahamu." />
        </Field>
      </div>
      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-5 text-muted">Formulir ini membuka WhatsApp dengan pesan yang sudah terisi.</p>
        <button type="submit" className="btn-tide shrink-0 whitespace-nowrap">Kirim lewat WhatsApp</button>
      </div>
    </form>
  );
}

function inputCls(err?: string) {
  return `w-full rounded-xl border bg-ink px-4 py-3 text-base text-fg placeholder:text-muted/60 transition focus:border-tide-1 ${
    err ? "border-rose-400/70" : "border-line"
  }`;
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={`f-${id}`} className="mb-2 block text-sm font-medium">{label}</label>
      {children}
      {error && <p id={`e-${id}`} className="mt-2 text-sm text-rose-300">{error}</p>}
    </div>
  );
}
