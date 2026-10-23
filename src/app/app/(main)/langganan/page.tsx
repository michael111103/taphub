import type { Metadata } from "next";
import Link from "next/link";
import { getAppContext, href } from "@/lib/app/context";
import { idr, tgl } from "@/lib/app/format";
import { PageHeader, StatusBadge } from "@/components/app/ui";
import Icon, { TileIcon } from "@/components/app/Icon";

export const metadata: Metadata = { title: "Langganan" };

const META: Record<string, { icon: string; tone: string }> = { books: { icon: "ledger", tone: "blue" }, pos: { icon: "pos", tone: "teal" }, invoice: { icon: "invoice", tone: "amber" }, stock: { icon: "inventory", tone: "green" }, staff: { icon: "staff", tone: "violet" } };

export default async function PlansPage({ searchParams }: { searchParams: { produk?: string; siklus?: string } }) {
  const { supabase, subscriptions } = await getAppContext();
  const [{ data: products }, { data: plans }] = await Promise.all([
    supabase.from("tap_products").select("code, name, tagline, is_available").order("sort"),
    supabase.from("plans").select("code, product_code, name, description, price_monthly, price_yearly, features, highlighted").eq("is_active", true).order("sort"),
  ]);
  const product = searchParams.produk ?? "books";
  const yearly = searchParams.siklus === "tahunan";
  const p = (products ?? []).find((x) => x.code === product);
  const list = (plans ?? []).filter((x) => x.product_code === product);
  const sub = subscriptions.find((s) => s.product_code === product);
  const qs = (o: Record<string, string>) => href(`/langganan?${new URLSearchParams({ produk: product, siklus: yearly ? "tahunan" : "bulanan", ...o })}`);

  return (
    <div className="mx-auto max-w-[1200px]">
      <PageHeader title="Paket langganan" icon="rocket" tone="amber" description="Setiap produk TapHub punya paket dan harga sendiri. Semua bisa dipakai dengan satu akun." />

      <div className="-mx-1 mb-6 flex gap-2 overflow-x-auto px-1 pb-1">
        {(products ?? []).map((x) => (
          <Link key={x.code} href={qs({ produk: x.code })} className={`flex shrink-0 items-center gap-3 rounded-2xl border px-4 py-3 transition ${x.code === product ? "border-tide-2/50 bg-tide-2/10" : "border-line bg-raised hover:border-tide-2/30"}`}>
            <TileIcon name={META[x.code]?.icon ?? "spark"} tone={META[x.code]?.tone} size={32} />
            <span><span className={`block text-sm font-semibold ${x.code === product ? "text-accent" : ""}`}>{x.name}</span><span className="text-xs text-muted">{x.is_available ? x.tagline : "Segera hadir"}</span></span>
          </Link>
        ))}
      </div>

      {sub && (
        <div className="card mb-6 flex flex-wrap items-center gap-3 p-4 text-sm">
          <StatusBadge status={sub.status} />
          <span>{p?.name} {sub.plan ? `paket ${sub.plan.name}` : ""}</span>
          <span className="text-muted">{sub.status === "trial" ? `Uji coba sampai ${tgl(sub.trial_ends_at)}` : sub.current_period_end ? `Aktif sampai ${tgl(sub.current_period_end)}` : ""}</span>
        </div>
      )}

      {!p?.is_available ? (
        <div className="card p-10 text-center">
          <p className="text-lg font-semibold">{p?.name} segera hadir</p>
          <p className="mt-2 text-sm text-muted">Kami kabari lewat email begitu {p?.name} bisa dipakai.</p>
        </div>
      ) : (
        <>
          <div className="mb-6 flex justify-center">
            <div className="inline-flex rounded-full border border-line bg-raised p-1 text-sm font-semibold">
              <Link href={qs({ siklus: "bulanan" })} className={`rounded-full px-5 py-2 ${!yearly ? "bg-tide-2 text-white" : "text-muted"}`}>Bulanan</Link>
              <Link href={qs({ siklus: "tahunan" })} className={`rounded-full px-5 py-2 ${yearly ? "bg-tide-2 text-white" : "text-muted"}`}>Tahunan <span className="ml-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] text-emerald-600 dark:text-emerald-400">Hemat 2 bulan</span></Link>
            </div>
          </div>
          <div className={`grid gap-4 ${list.length >= 3 ? "lg:grid-cols-3" : "md:grid-cols-2"} ${list.length === 1 ? "mx-auto max-w-md md:grid-cols-1" : ""}`}>
            {list.map((pl, i) => {
              const price = yearly ? pl.price_yearly : pl.price_monthly;
              const current = sub?.plan?.code === pl.code && sub?.status === "active";
              return (
                <div key={pl.code} className={`card anim-feed relative flex flex-col p-6 ${pl.highlighted ? "border-tide-2/50 ring-2 ring-tide-2/20" : ""}`} style={{ animationDelay: `${i * 90}ms` }}>
                  {pl.highlighted && <span className="absolute -top-3 left-6 rounded-full bg-gradient-to-r from-tide-1 to-tide-2 px-3 py-1 text-xs font-semibold text-white">Paling populer</span>}
                  <p className="text-lg font-semibold">{pl.name}</p>
                  <p className="mt-1 text-sm text-muted">{pl.description}</p>
                  <p className="mt-5"><span className="text-3xl font-semibold tracking-[-0.02em]">{idr(price)}</span><span className="text-sm text-muted"> /{yearly ? "tahun" : "bulan"}</span></p>
                  {yearly && <p className="text-xs text-muted">Setara {idr(Math.round(pl.price_yearly / 12))} per bulan</p>}
                  <p className="text-xs text-muted">Belum termasuk PPN 11%</p>
                  <ul className="mt-5 flex-1 space-y-2.5 text-sm">
                    {pl.features.map((f: string) => (
                      <li key={f} className="flex gap-2"><Icon name="check" size={18} className="shrink-0 text-emerald-500" strokeWidth={2.2} />{f}</li>
                    ))}
                  </ul>
                  {current ? (
                    <span className="btn-soft mt-6 w-full">Paket aktif</span>
                  ) : (
                    <Link href={href(`/checkout?paket=${pl.code}&siklus=${yearly ? "tahunan" : "bulanan"}`)} className={`${pl.highlighted ? "btn-primary" : "btn-soft"} mt-6 w-full`}>Pilih {pl.name}</Link>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
      <p className="mt-6 text-center text-xs text-muted">Harga dapat berubah. Butuh paket khusus untuk banyak cabang? <a href="https://wa.me/6281281321903" className="text-accent hover:underline">Hubungi tim TapHub</a>.</p>
    </div>
  );
}
