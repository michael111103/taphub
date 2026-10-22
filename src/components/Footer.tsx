import Link from "next/link";
import Logo from "./Logo";
import { products } from "@/lib/products";
import { site, whatsappLink } from "@/lib/site";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line bg-ink">
      <div className="mx-auto grid max-w-page gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="max-w-sm">
          <Logo className="h-7 w-auto" />
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

        <nav aria-label="Produk">
          <h2 className="text-sm font-semibold">Produk</h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-muted lg:grid-cols-1">
            {products.slice(0, 6).map((p) => (
              <li key={p.slug}>
                <Link href={p.href ?? "/#produk"} className="hover:text-fg">
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Perusahaan">
          <h2 className="text-sm font-semibold">TapHub</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            <li><Link href="/#tentang" className="hover:text-fg">Tentang kami</Link></li>
            <li><Link href="/#keunggulan" className="hover:text-fg">Keunggulan</Link></li>
            <li><Link href="/#faq" className="hover:text-fg">FAQ</Link></li>
            <li><Link href="/hubungi-kami" className="hover:text-fg">Hubungi kami</Link></li>
            <li><Link href="/kebijakan-privasi" className="hover:text-fg">Kebijakan Privasi</Link></li>
            <li><Link href="/syarat-ketentuan" className="hover:text-fg">Syarat &amp; Ketentuan</Link></li>
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-semibold">Kontak</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            <li>
              <a href={whatsappLink()} className="hover:text-fg" target="_blank" rel="noopener noreferrer">
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
        </div>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-page px-4 py-6 text-xs text-muted sm:px-6">
          &copy; {year} {site.company.legalName}. Hak cipta dilindungi.
        </p>
      </div>
    </footer>
  );
}
