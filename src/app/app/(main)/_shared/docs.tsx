import Link from "next/link";
import { notFound } from "next/navigation";
import { getAppContext, href } from "@/lib/app/context";
import { addDays, idr, idrShort, num, tgl, todayJakarta } from "@/lib/app/format";
import { KIND_LABEL, KIND_SLUG, SIDE_LINES, SIDE_PATH, SIDE_TABLE, kindFromSlug, nextKind, type Side } from "@/lib/app/docs";
import { EmptyState, Money, PageHeader, Pagination, SearchBox, StatCard, StatusBadge, Tabs } from "@/components/app/ui";
import Icon, { TileIcon } from "@/components/app/Icon";
import ActionForm from "@/components/app/ActionForm";
import SubmitButton from "@/components/app/SubmitButton";
import DocumentForm, { type DocDefaults } from "@/components/app/DocumentForm";
import PrintButton from "@/components/app/PrintButton";
import { Columns, HBars } from "@/components/app/charts";
import { recordPayment, voidDocument } from "../../actions";

const PAGE = 25;
const SIDE_NAME: Record<Side, string> = { sales: "Penjualan", purchase: "Pembelian" };
const SIDE_ICON: Record<Side, { icon: string; tone: string }> = { sales: { icon: "sales", tone: "blue" }, purchase: { icon: "purchase", tone: "violet" } };
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

type DocRow = {
  id: string;
  kind: string;
  number: string;
  date: string;
  due_date: string | null;
  reference: string | null;
  status: string;
  total: number;
  paid_amount: number;
  contacts: { name: string } | null;
};

// =====================================================================
// DAFTAR DOKUMEN
// =====================================================================
export async function DocList({ side, slug, searchParams }: { side: Side; slug: string; searchParams: Record<string, string | undefined> }) {
  const kind = kindFromSlug(side, slug);
  if (!kind) notFound();
  const { supabase, org } = await getAppContext();
  const label = KIND_LABEL[side][kind];
  const today = todayJakarta();
  const status = searchParams.status ?? "semua";
  const q = searchParams.q?.trim().replace(/[,()%]/g, " ");
  const page = Math.max(1, Number(searchParams.page) || 1);
  const isMoney = kind === "invoice" || kind === "bill";

  let query = supabase
    .from(SIDE_TABLE[side])
    .select("id, kind, number, date, due_date, reference, status, total, paid_amount, contacts(name)", { count: "exact" })
    .eq("org_id", org.id)
    .eq("kind", kind);
  if (status === "belum-dibayar") query = query.eq("status", "open");
  if (status === "sebagian") query = query.eq("status", "partial");
  if (status === "lunas") query = query.eq("status", "paid");
  if (status === "jatuh-tempo") query = query.in("status", ["open", "partial"]).lt("due_date", today);
  if (status === "terbuka") query = query.eq("status", "open");
  if (status === "selesai") query = query.eq("status", "done");
  if (status === "dibatalkan") query = query.eq("status", "void");
  if (q) query = query.or(`number.ilike.%${q}%,reference.ilike.%${q}%`);
  const { data, count } = await query.order("date", { ascending: false }).order("number", { ascending: false }).range((page - 1) * PAGE, page * PAGE - 1);
  const rows = (data ?? []) as unknown as DocRow[];

  // ringkasan
  const { data: open } = await supabase.from(SIDE_TABLE[side]).select("total, paid_amount, due_date, date, status").eq("org_id", org.id).eq("kind", kind).neq("status", "void");
  const all = open ?? [];
  const month = today.slice(0, 7);
  const unpaid = all.filter((r) => r.status === "open" || r.status === "partial");
  const overdue = unpaid.filter((r) => r.due_date && r.due_date < today);
  const thisMonth = all.filter((r) => r.date.startsWith(month));

  const base = SIDE_PATH[side];
  const tabs = isMoney
    ? [
        { key: "semua", label: "Semua" },
        { key: "belum-dibayar", label: "Belum dibayar" },
        { key: "sebagian", label: "Dibayar sebagian" },
        { key: "lunas", label: "Lunas" },
        { key: "jatuh-tempo", label: "Jatuh tempo" },
        { key: "dibatalkan", label: "Dibatalkan" },
      ]
    : [
        { key: "semua", label: "Semua" },
        { key: "terbuka", label: "Terbuka" },
        { key: "selesai", label: "Selesai" },
      ];
  const qs = (p: Record<string, string | number | undefined>) => {
    const u = new URLSearchParams();
    for (const [k, v] of Object.entries({ status, q, ...p })) if (v !== undefined && v !== "" && !(k === "status" && v === "semua")) u.set(k, String(v));
    const str = u.toString();
    return href(`${base}/${slug}${str ? `?${str}` : ""}`);
  };

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        title={label}
        icon={SIDE_ICON[side].icon}
        tone={SIDE_ICON[side].tone}
        crumbs={[{ label: "Beranda", href: href("/") }, { label: SIDE_NAME[side], href: href(base) }, { label }]}
        actions={
          <>
            <PrintButton />
            <Link href={href(`${base}/baru?jenis=${kind}`)} className="btn-primary"><Icon name="plus" size={16} /> Tambah</Link>
          </>
        }
      />

      {isMoney && (
        <div className="mb-4 grid gap-3 sm:grid-cols-3">
          <StatCard label="Bulan ini" value={idr(thisMonth.reduce((a, r) => a + Number(r.total), 0))} hint={`${thisMonth.length} transaksi`} icon={SIDE_ICON[side].icon} tone={SIDE_ICON[side].tone} />
          <StatCard label="Belum dibayar" value={idr(unpaid.reduce((a, r) => a + Number(r.total) - Number(r.paid_amount), 0))} hint={`${unpaid.length} transaksi`} icon="clock" tone="amber" />
          <StatCard label="Jatuh tempo" value={idr(overdue.reduce((a, r) => a + Number(r.total) - Number(r.paid_amount), 0))} hint={`${overdue.length} transaksi`} icon="bell" tone="pink" />
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:items-center sm:justify-between">
          <Tabs active={status} tabs={tabs.map((t) => ({ ...t, href: qs({ status: t.key, page: undefined }) }))} />
          <SearchBox q={q} placeholder="Cari nomor atau referensi" hidden={{ status: status === "semua" ? undefined : status }} />
        </div>
        {rows.length === 0 ? (
          <EmptyState icon={SIDE_ICON[side].icon} title={`Belum ada ${label.toLowerCase()} di sini`} description="Data yang kamu buat akan muncul di daftar ini." action={<Link href={href(`${base}/baru?jenis=${kind}`)} className="btn-primary"><Icon name="plus" size={16} /> Buat {label.toLowerCase()}</Link>} />
        ) : (
          <div className="overflow-x-auto">
            <table className="table-app">
              <thead>
                <tr>
                  <th>Nomor</th>
                  <th>{side === "sales" ? "Pelanggan" : "Vendor"}</th>
                  <th>Tanggal</th>
                  <th>{kind === "quote" ? "Berlaku sampai" : "Jatuh tempo"}</th>
                  <th>Status</th>
                  {isMoney && <th className="text-right">Sisa tagihan</th>}
                  <th className="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <Link href={href(`${base}/dokumen/${r.id}`)} className="mono font-semibold text-accent hover:underline">{r.number}</Link>
                      {r.reference && <p className="text-xs text-muted">{r.reference}</p>}
                    </td>
                    <td className="max-w-[220px] truncate">{r.contacts?.name ?? "-"}</td>
                    <td className="whitespace-nowrap">{tgl(r.date)}</td>
                    <td className="whitespace-nowrap">{tgl(r.due_date)}</td>
                    <td><StatusBadge status={r.status} kind={r.kind} dueDate={r.due_date} /></td>
                    {isMoney && <td className="text-right"><Money value={r.status === "void" ? 0 : Number(r.total) - Number(r.paid_amount)} /></td>}
                    <td className="text-right font-semibold"><Money value={r.total} /></td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={isMoney ? 5 : 5} className="px-4 py-3 text-sm font-semibold">Total halaman ini</td>
                  {isMoney && <td className="px-4 py-3 text-right font-semibold"><Money value={rows.filter((r) => r.status !== "void").reduce((a, r) => a + Number(r.total) - Number(r.paid_amount), 0)} /></td>}
                  <td className="px-4 py-3 text-right font-semibold"><Money value={rows.filter((r) => r.status !== "void").reduce((a, r) => a + Number(r.total), 0)} /></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
        <Pagination page={page} pages={Math.ceil((count ?? 0) / PAGE)} makeHref={(p) => qs({ page: p })} />
      </div>
    </div>
  );
}

// =====================================================================
// FORM DOKUMEN BARU
// =====================================================================
export async function DocNew({ side, searchParams }: { side: Side; searchParams: Record<string, string | undefined> }) {
  const { supabase, org } = await getAppContext();
  const kinds = Object.keys(KIND_SLUG[side]);
  const kind = kinds.includes(searchParams.jenis ?? "") ? searchParams.jenis! : kinds[0];
  const label = KIND_LABEL[side][kind];
  const contactKind = side === "sales" ? "customer" : "vendor";

  const [{ data: contacts }, { data: items }] = await Promise.all([
    supabase.from("contacts").select("id, name, kind").eq("org_id", org.id).order("name"),
    supabase.from("items").select("id, name, sku, unit, sell_price, buy_price, stock_qty, track_stock").eq("org_id", org.id).eq("is_archived", false).order("name"),
  ]);

  let defaults: DocDefaults | undefined;
  if (searchParams.dari) {
    const { data: src } = await supabase.from(SIDE_TABLE[side]).select(`id, contact_id, reference, notes, discount, ${SIDE_LINES[side]}(item_id, description, qty, unit, price, discount_pct, tax_rate, sort)`).eq("id", searchParams.dari).eq("org_id", org.id).single();
    if (src) {
      const s = src as unknown as { id: string; contact_id: string; reference: string; notes: string; discount: number } & Record<string, { item_id: string | null; description: string | null; qty: number; unit: string | null; price: number; discount_pct: number; tax_rate: number; sort: number }[]>;
      defaults = {
        source_id: s.id,
        contact_id: s.contact_id ?? "",
        reference: s.reference ?? "",
        notes: s.notes ?? "",
        discount: Number(s.discount),
        lines: (s[SIDE_LINES[side]] ?? [])
          .sort((a, b) => a.sort - b.sort)
          .map((l) => ({ item_id: l.item_id ?? "", description: l.description ?? "", qty: Number(l.qty), unit: l.unit ?? "pcs", price: Number(l.price), discount_pct: Number(l.discount_pct), tax_rate: Number(l.tax_rate) })),
      };
    }
  }
  if (searchParams.kontak) defaults = { ...(defaults ?? {}), contact_id: searchParams.kontak };

  const today = todayJakarta();
  const base = SIDE_PATH[side];
  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        title={`${label} baru`}
        icon={SIDE_ICON[side].icon}
        tone={SIDE_ICON[side].tone}
        crumbs={[{ label: SIDE_NAME[side], href: href(base) }, { label, href: href(`${base}/${(KIND_SLUG[side] as Record<string, string>)[kind]}`) }, { label: "Baru" }]}
        description={kind === "invoice" ? "Tagihan langsung tercatat di jurnal: piutang, pendapatan, PPN, dan stok berkurang otomatis." : kind === "bill" ? "Tagihan pembelian menambah stok dan hutang usaha secara otomatis." : undefined}
      />
      <DocumentForm
        side={side}
        kind={kind}
        kindLabel={label}
        contacts={((contacts ?? []) as { id: string; name: string; kind: string[] }[]).filter((c) => c.kind.includes(contactKind) || c.kind.length === 0).concat(((contacts ?? []) as { id: string; name: string; kind: string[] }[]).filter((c) => !c.kind.includes(contactKind)))}
        items={(items ?? []) as never}
        today={today}
        dueDefault={addDays(today, kind === "quote" ? 14 : 30)}
        defaults={defaults}
        cancelHref={href(searchParams.dari ? `${base}/dokumen/${searchParams.dari}` : `${base}/${(KIND_SLUG[side] as Record<string, string>)[kind]}`)}
        newContactHref={href(`/kontak/baru?jenis=${contactKind}`)}
      />
    </div>
  );
}

// =====================================================================
// DETAIL DOKUMEN
// =====================================================================
export async function DocDetail({ side, id }: { side: Side; id: string }) {
  const { supabase, org } = await getAppContext();
  const { data } = await supabase
    .from(SIDE_TABLE[side])
    .select(`*, contacts(id, name, company, email, phone, address, city), ${SIDE_LINES[side]}(id, description, qty, unit, price, discount_pct, tax_rate, amount, sort, items(name, sku))`)
    .eq("id", id)
    .eq("org_id", org.id)
    .single();
  if (!data) notFound();
  type L = { id: string; description: string | null; qty: number; unit: string | null; price: number; discount_pct: number; tax_rate: number; amount: number; sort: number; items: { name: string; sku: string | null } | null };
  const d = data as unknown as DocRow & { subtotal: number; discount: number; tax: number; notes: string | null; source_id: string | null; contacts: { id: string; name: string; company: string | null; email: string | null; phone: string | null; address: string | null; city: string | null } | null } & Record<string, L[]>;
  const lines = (d[SIDE_LINES[side]] ?? []).sort((a, b) => a.sort - b.sort);
  const label = KIND_LABEL[side][d.kind];
  const base = SIDE_PATH[side];
  const isMoney = d.kind === "invoice" || d.kind === "bill";
  const remaining = Number(d.total) - Number(d.paid_amount);

  const [{ data: payments }, { data: cashAccounts }, { data: children }, { data: source }] = await Promise.all([
    supabase.from("payments").select("id, date, amount, notes, accounts(name)").eq("source_id", id).order("date"),
    supabase.from("accounts").select("id, name, code").eq("org_id", org.id).eq("category", "kas_bank").eq("is_archived", false).order("code"),
    supabase.from(SIDE_TABLE[side]).select("id, number, kind").eq("source_id", id),
    d.source_id ? supabase.from(SIDE_TABLE[side]).select("id, number, kind").eq("id", d.source_id).single() : Promise.resolve({ data: null }),
  ]);
  const next = nextKind(side, d.kind);
  const waText = encodeURIComponent(
    `Halo ${d.contacts?.name ?? ""}, berikut ${label.toLowerCase()} ${d.number} dari ${org.name} sebesar ${idr(d.total)}${d.due_date ? `, jatuh tempo ${tgl(d.due_date)}` : ""}. Terima kasih.`,
  );
  const phone = d.contacts?.phone?.replace(/\D/g, "").replace(/^0/, "62");

  return (
    <div className="mx-auto max-w-[1200px]">
      <PageHeader
        title={`${label} ${d.number}`}
        icon={SIDE_ICON[side].icon}
        tone={SIDE_ICON[side].tone}
        crumbs={[{ label: SIDE_NAME[side], href: href(base) }, { label, href: href(`${base}/${(KIND_SLUG[side] as Record<string, string>)[d.kind]}`) }, { label: d.number }]}
        actions={
          <>
            {side === "sales" && phone && (
              <a href={`https://wa.me/${phone}?text=${waText}`} target="_blank" rel="noopener noreferrer" className="btn-soft"><Icon name="whatsapp" size={16} strokeWidth={0} fill="currentColor" /> Kirim WhatsApp</a>
            )}
            <PrintButton />
            {next && d.status !== "void" && d.status !== "done" && (
              <Link href={href(`${base}/baru?jenis=${next}&dari=${d.id}`)} className="btn-primary">
                <Icon name="arrow-right" size={16} /> Buat {KIND_LABEL[side][next].toLowerCase()}
              </Link>
            )}
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <div className="card overflow-hidden">
          <div className="flex flex-col gap-6 border-b border-line p-5 sm:flex-row sm:justify-between sm:p-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">{side === "sales" ? "Ditagihkan kepada" : "Dari vendor"}</p>
              {d.contacts ? (
                <Link href={href(`/kontak/${d.contacts.id}`)} className="mt-1 block text-lg font-semibold hover:text-accent">{d.contacts.name}</Link>
              ) : (
                <p className="mt-1 text-lg font-semibold">-</p>
              )}
              <p className="text-sm text-muted">{[d.contacts?.company, d.contacts?.address, d.contacts?.city].filter(Boolean).join(", ")}</p>
              <p className="text-sm text-muted">{[d.contacts?.phone, d.contacts?.email].filter(Boolean).join(" · ")}</p>
            </div>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:text-right">
              <dt className="text-muted">Status</dt><dd><StatusBadge status={d.status} kind={d.kind} dueDate={d.due_date} /></dd>
              <dt className="text-muted">Tanggal</dt><dd>{tgl(d.date)}</dd>
              <dt className="text-muted">{d.kind === "quote" ? "Berlaku sampai" : "Jatuh tempo"}</dt><dd>{tgl(d.due_date)}</dd>
              {d.reference && <><dt className="text-muted">Referensi</dt><dd>{d.reference}</dd></>}
            </dl>
          </div>
          <div className="overflow-x-auto">
            <table className="table-app">
              <thead><tr><th>Produk</th><th className="text-right">Qty</th><th className="text-right">Harga</th><th className="text-right">Disk</th><th className="text-right">Pajak</th><th className="text-right">Jumlah</th></tr></thead>
              <tbody>
                {lines.map((l) => (
                  <tr key={l.id}>
                    <td>
                      <p className="font-medium">{l.items?.name ?? l.description}</p>
                      {l.items && l.description && l.description !== l.items.name && <p className="text-xs text-muted">{l.description}</p>}
                    </td>
                    <td className="text-right tabular-nums">{num(l.qty)} {l.unit}</td>
                    <td className="text-right"><Money value={l.price} /></td>
                    <td className="text-right tabular-nums">{Number(l.discount_pct) ? `${num(l.discount_pct)}%` : "-"}</td>
                    <td className="text-right">{Number(l.tax_rate) ? `PPN ${num(l.tax_rate)}%` : "-"}</td>
                    <td className="text-right font-medium"><Money value={l.amount} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col gap-6 p-5 sm:flex-row sm:justify-between sm:p-6">
            <div className="max-w-sm text-sm text-muted">{d.notes && <><p className="font-semibold text-fg">Catatan</p><p className="mt-1 whitespace-pre-line">{d.notes}</p></>}</div>
            <dl className="w-full max-w-xs space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd><Money value={d.subtotal} /></dd></div>
              {Number(d.discount) > 0 && <div className="flex justify-between"><dt className="text-muted">Diskon</dt><dd>-<Money value={d.discount} /></dd></div>}
              <div className="flex justify-between"><dt className="text-muted">PPN</dt><dd><Money value={d.tax} /></dd></div>
              <div className="flex justify-between border-t border-line pt-2 text-base font-semibold"><dt>Total</dt><dd>{idr(d.total)}</dd></div>
              {isMoney && Number(d.paid_amount) > 0 && <div className="flex justify-between text-emerald-600 dark:text-emerald-400"><dt>Sudah dibayar</dt><dd>{idr(d.paid_amount)}</dd></div>}
              {isMoney && d.status !== "void" && <div className="flex justify-between font-semibold"><dt>Sisa tagihan</dt><dd>{idr(remaining)}</dd></div>}
            </dl>
          </div>
        </div>

        <div className="no-print space-y-4">
          {isMoney && d.status !== "void" && remaining > 0.009 && (
            <div className="card p-5">
              <h2 className="flex items-center gap-2 font-semibold"><TileIcon name="wallet" tone="green" size={28} /> {side === "sales" ? "Terima pembayaran" : "Bayar tagihan"}</h2>
              <ActionForm action={recordPayment} className="mt-4 space-y-3" resetOnSuccess>
                <input type="hidden" name="source_type" value={side} />
                <input type="hidden" name="source_id" value={d.id} />
                <div>
                  <label className="label" htmlFor="amount">Jumlah</label>
                  <input id="amount" name="amount" type="number" step="any" min={1} max={remaining} defaultValue={remaining} className="field" />
                </div>
                <div>
                  <label className="label" htmlFor="account_id">{side === "sales" ? "Setor ke" : "Bayar dari"}</label>
                  <select id="account_id" name="account_id" className="field">
                    {(cashAccounts ?? []).map((a) => <option key={a.id} value={a.id}>{a.code} · {a.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label" htmlFor="pdate">Tanggal</label>
                  <input id="pdate" name="date" type="date" defaultValue={todayJakarta()} className="field" />
                </div>
                <SubmitButton className="btn-primary w-full">Catat pembayaran</SubmitButton>
              </ActionForm>
            </div>
          )}

          {isMoney && (
            <div className="card p-5">
              <h2 className="font-semibold">Riwayat pembayaran</h2>
              {(payments ?? []).length === 0 ? (
                <p className="mt-2 text-sm text-muted">Belum ada pembayaran.</p>
              ) : (
                <ul className="mt-3 space-y-2 text-sm">
                  {((payments ?? []) as unknown as { id: string; date: string; amount: number; accounts: { name: string } | null }[]).map((p) => (
                    <li key={p.id} className="flex items-center justify-between gap-3 rounded-xl bg-panel px-3 py-2">
                      <span><span className="block">{tgl(p.date)}</span><span className="text-xs text-muted">{p.accounts?.name}</span></span>
                      <span className={`font-semibold tabular-nums ${Number(p.amount) < 0 ? "text-rose-500" : ""}`}>{idr(p.amount)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {(source || (children ?? []).length > 0) && (
            <div className="card p-5 text-sm">
              <h2 className="font-semibold">Alur dokumen</h2>
              <ul className="mt-3 space-y-2">
                {source && (
                  <li>Dibuat dari <Link href={href(`${base}/dokumen/${source.id}`)} className="mono font-semibold text-accent hover:underline">{source.number}</Link></li>
                )}
                {(children ?? []).map((c) => (
                  <li key={c.id}>Dilanjutkan ke <Link href={href(`${base}/dokumen/${c.id}`)} className="mono font-semibold text-accent hover:underline">{c.number}</Link></li>
                ))}
              </ul>
            </div>
          )}

          {d.status !== "void" && Number(d.paid_amount) === 0 && (
            <div className="card p-5">
              <h2 className="font-semibold">Batalkan dokumen</h2>
              <p className="mt-1 text-sm text-muted">Jurnal dibalik otomatis dan stok dikembalikan. Riwayat tetap tersimpan.</p>
              <ActionForm action={voidDocument} className="mt-3" confirm={`Batalkan ${d.number}? Tindakan ini tidak bisa diurungkan.`}>
                <input type="hidden" name="source_type" value={side} />
                <input type="hidden" name="id" value={d.id} />
                <SubmitButton className="btn-danger w-full" pendingText="Membatalkan...">Batalkan {label.toLowerCase()}</SubmitButton>
              </ActionForm>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// OVERVIEW PENJUALAN / PEMBELIAN
// =====================================================================
export async function DocOverview({ side }: { side: Side }) {
  const { supabase, org } = await getAppContext();
  const today = todayJakarta();
  const moneyKind = side === "sales" ? "invoice" : "bill";
  const from = `${addDays(today, -180).slice(0, 7)}-01`;
  const [{ data: docs }, { data: payments }, { data: flows }] = await Promise.all([
    supabase.from(SIDE_TABLE[side]).select("id, number, date, due_date, status, total, paid_amount, contacts(name)").eq("org_id", org.id).eq("kind", moneyKind).neq("status", "void").gte("date", from).order("date", { ascending: false }),
    supabase.from("payments").select("amount, date").eq("org_id", org.id).eq("direction", side === "sales" ? "in" : "out").gte("date", `${today.slice(0, 7)}-01`),
    supabase.from(SIDE_TABLE[side]).select("kind, status").eq("org_id", org.id).in("kind", ["quote", "order"]).eq("status", "open"),
  ]);
  const rows = (docs ?? []) as unknown as DocRow[];
  const paidThisMonth = (payments ?? []).reduce((a, p) => a + Number(p.amount), 0);
  const unpaid = rows.filter((r) => r.status === "open" || r.status === "partial");
  const overdue = unpaid.filter((r) => r.due_date && r.due_date < today);

  const months: { label: string; value: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(`${today.slice(0, 7)}-01T00:00:00Z`);
    d.setUTCMonth(d.getUTCMonth() - i);
    const key = d.toISOString().slice(0, 7);
    months.push({ label: MONTHS[d.getUTCMonth()], value: rows.filter((r) => r.date.startsWith(key)).reduce((a, r) => a + Number(r.total), 0) });
  }
  const byContact = new Map<string, number>();
  for (const r of rows.filter((r) => r.date.startsWith(today.slice(0, 7)))) byContact.set(r.contacts?.name ?? "Tanpa kontak", (byContact.get(r.contacts?.name ?? "Tanpa kontak") ?? 0) + Number(r.total));
  const top = [...byContact.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, value]) => ({ name, value }));
  const openQuotes = (flows ?? []).filter((f) => f.kind === "quote").length;
  const openOrders = (flows ?? []).filter((f) => f.kind === "order").length;
  const base = SIDE_PATH[side];
  const slugs = KIND_SLUG[side] as Record<string, string>;

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        title={`Overview ${SIDE_NAME[side]}`}
        icon={SIDE_ICON[side].icon}
        tone={SIDE_ICON[side].tone}
        description={`Statistik dan performa ${SIDE_NAME[side].toLowerCase()} usahamu.`}
        actions={<Link href={href(`${base}/baru?jenis=${moneyKind}`)} className="btn-primary"><Icon name="plus" size={16} /> {KIND_LABEL[side][moneyKind]} baru</Link>}
      />
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label={side === "sales" ? "Pembayaran diterima" : "Pembayaran dikirim"} value={idr(paidThisMonth)} hint="Bulan ini" icon="wallet" tone="green" />
        <StatCard label="Menunggu pembayaran" value={idr(unpaid.reduce((a, r) => a + Number(r.total) - Number(r.paid_amount), 0))} hint={`${unpaid.length} tagihan`} icon="clock" tone="amber" />
        <StatCard label="Jatuh tempo" value={idr(overdue.reduce((a, r) => a + Number(r.total) - Number(r.paid_amount), 0))} hint={`${overdue.length} tagihan`} icon="bell" tone="pink" />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <section className="card p-5">
          <h2 className="font-semibold">{KIND_LABEL[side][moneyKind]} 6 bulan terakhir</h2>
          <p className="mono text-[11px] text-muted">Total nilai per bulan</p>
          <div className="mt-4"><Columns data={months} format="idrShort" color={side === "sales" ? "#22D3EE" : "#8B5CF6"} highlight="#1B5BFF" trend height={200} /></div>
        </section>
        <section className="card p-5">
          <h2 className="font-semibold">{side === "sales" ? "Penjualan per pelanggan" : "Pembelian per vendor"} bulan ini</h2>
          <div className="mt-4">{top.length ? <HBars items={top} format="idrShort" color={side === "sales" ? "#EC4899" : "#8B5CF6"} /> : <p className="py-10 text-center text-sm text-muted">Belum ada transaksi bulan ini.</p>}</div>
        </section>
      </div>

      <section className="card mt-4 p-5">
        <h2 className="font-semibold">Alur {SIDE_NAME[side].toLowerCase()}</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {[
            { k: "quote", n: openQuotes, d: "terbuka" },
            { k: "order", n: openOrders, d: "belum ditagihkan" },
            { k: moneyKind, n: unpaid.length, d: "belum lunas" },
          ].map((s, i) => (
            <Link key={s.k} href={href(`${base}/${slugs[s.k]}`)} className="group relative flex items-center gap-3 rounded-2xl border border-line p-4 transition hover:border-tide-2/40">
              <span className="mono grid h-9 w-9 place-items-center rounded-full bg-tide-2/10 text-sm font-bold text-accent">{i + 1}</span>
              <span className="flex-1">
                <span className="block font-semibold">{KIND_LABEL[side][s.k]}</span>
                <span className="text-sm text-muted">{s.n} {s.d}</span>
              </span>
              <Icon name="chevron-right" size={18} className="text-muted transition group-hover:translate-x-0.5 group-hover:text-accent" />
            </Link>
          ))}
        </div>
      </section>

      <section className="card mt-4 overflow-hidden">
        <div className="flex items-center justify-between p-5 pb-3">
          <h2 className="font-semibold">Transaksi terbaru</h2>
          <Link href={href(`${base}/${slugs[moneyKind]}`)} className="text-sm font-medium text-accent hover:underline">Lihat semua</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="table-app">
            <thead><tr><th>Nomor</th><th>{side === "sales" ? "Pelanggan" : "Vendor"}</th><th>Tanggal</th><th>Status</th><th className="text-right">Total</th></tr></thead>
            <tbody>
              {rows.slice(0, 8).map((r) => (
                <tr key={r.id}>
                  <td><Link href={href(`${base}/dokumen/${r.id}`)} className="mono font-semibold text-accent hover:underline">{r.number}</Link></td>
                  <td>{r.contacts?.name ?? "-"}</td>
                  <td>{tgl(r.date)}</td>
                  <td><StatusBadge status={r.status} dueDate={r.due_date} /></td>
                  <td className="text-right font-semibold"><Money value={r.total} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && <EmptyState icon={SIDE_ICON[side].icon} title="Belum ada transaksi" />}
        </div>
      </section>
    </div>
  );
}
