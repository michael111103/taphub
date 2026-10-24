import Logo from "./Logo";
import { products } from "@/lib/products";
import { mainHref, site, whatsappLink } from "@/lib/site";

const resources = [
  { label: "Blog artikel", href: "/blog" },
];

const company = [
  { label: "Tentang TapHub", href: "/tentang-kami" },
  { label: "Hubungi kami", href: "/hubungi-kami" },
  { label: "FAQ", href: "/#faq" },
  { label: "Kebijakan Privasi", href: "/kebijakan-privasi" },
  { label: "Syarat & Ketentuan", href: "/syarat-ketentuan" },
];

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <nav aria-label={title}>
      <h2 className="text-sm font-semibold">{title}</h2>
      {children}
    </nav>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="theme-dark border-t border-line bg-ink">
      <div className="mx-auto grid max-w-page gap-x-8 gap-y-12 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr]">
        <div className="max-w-sm sm:col-span-2 lg:col-span-1">
          <Logo className="h-7 w-auto" variant="onDark" />
          <p className="mt-4 text-sm leading-6 text-muted">{site.tagline}.</p>
          <address className="mt-6 text-sm not-italic leading-6 text-muted">
            <span className="block font-medium text-fg">{site.company.legalName}</span>
            {site.company.address.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
        </div>

        <Column title="Produk">
          <ul className="mt-4 space-y-3 text-sm text-muted">
            {[...products].sort((a, b) => Number(!!b.href) - Number(!!a.href)).slice(0, 6).map((p) => (
              <li key={p.slug}>
                <a href={p.href ?? mainHref("/#produk")} className="hover:text-fg">
                  {p.name}
                </a>
              </li>
            ))}
          </ul>
        </Column>

        <Column title="Resources">
          <ul className="mt-4 space-y-3 text-sm text-muted">
            {resources.map((r) => (
              <li key={r.href}><a href={mainHref(r.href)} className="hover:text-fg">{r.label}</a></li>
            ))}
          </ul>
        </Column>

        <Column title="Perusahaan">
          <ul className="mt-4 space-y-3 text-sm text-muted">
            {company.map((c) => (
              <li key={c.href}><a href={mainHref(c.href)} className="hover:text-fg">{c.label}</a></li>
            ))}
          </ul>
        </Column>

        <Column title="Kontak">
          <ul className="mt-4 space-y-3 text-sm text-muted">
            <li>
              <a href={whatsappLink()} className="whitespace-nowrap hover:text-fg" target="_blank" rel="noopener noreferrer">
                WhatsApp {site.whatsappDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="hover:text-fg">{site.email}</a>
            </li>
            <li>
              <a href={site.social.instagram} className="hover:text-fg" target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            </li>
          </ul>
        </Column>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-page px-4 py-6 text-xs text-muted sm:px-6">
          &copy; {year} {site.company.legalName}. Hak cipta dilindungi.
        </p>
      </div>
    </footer>
  );
}
