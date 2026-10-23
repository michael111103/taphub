import type { Metadata } from "next";
import Link from "next/link";
import { href } from "@/lib/app/context";
import { PageHeader } from "@/components/app/ui";
import Icon, { TileIcon } from "@/components/app/Icon";
import { REPORTS } from "./reports";

export const metadata: Metadata = { title: "Laporan" };

export default function ReportsPage() {
  return (
    <div className="mx-auto max-w-[1300px]">
      <PageHeader title="Laporan" icon="report" tone="green" description="Semua laporan dihitung langsung dari jurnal, jadi selalu terbaru setiap ada transaksi." />
      <div className="grid gap-4 lg:grid-cols-2">
        {REPORTS.map((g, gi) => (
          <section key={g.group} className="card anim-feed p-5" style={{ animationDelay: `${gi * 80}ms` }}>
            <h2 className="flex items-center gap-3 font-semibold"><TileIcon name={g.icon} tone={g.tone} size={32} /> {g.group}</h2>
            <ul className="mt-4 divide-y divide-line">
              {g.items.map((r) => (
                <li key={r.slug}>
                  <Link href={href(`/laporan/${r.slug}`)} className="group flex items-center gap-3 py-3">
                    <span className="flex-1">
                      <span className="block font-medium group-hover:text-accent">{r.name}</span>
                      <span className="block text-sm text-muted">{r.desc}</span>
                    </span>
                    <Icon name="chevron-right" size={18} className="text-muted transition group-hover:translate-x-0.5 group-hover:text-accent" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
