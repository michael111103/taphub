import Logo from "./Logo";
import { products } from "@/lib/products";
import { mainHref, site, whatsappLink } from "@/lib/site";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="theme-dark border-t border-line bg-ink">
      <div className="mx-auto grid max-w-page gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="max-w-sm">
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

        <nav aria-label="Produk">
          <h2 className="text-sm font-semibold">Produk</h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-muted lg:grid-cols-1">
            {products.slice(0, 6).map((p) => (
              <li key={p.slug}>
                <a href={p.href ?? mainHref("/#produk")} className="hover:text-fg">
                  {p.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Perusahaan">
          <h2 className="text-sm font-semibold">TapHub</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            <li><a href={mainHref("/#tentang")} className="hover:text-fg">Tentang kami</a></li>
            <li><a href={mainHref("/#keunggulan")} className="hover:text-fg">Keunggulan</a></li>
            <li><a href={mainHref("/#faq")} className="hover:text-fg">FAQ</a></li>
            <li><a href={mainHref("/hubungi-kami")} className="hover:text-fg">Hubungi kami</a></li>
            <li><a href={mainHref("/kebijakan-privasi")} className="hover:text-fg">Kebijakan Privasi</a></li>
            <li><a href={mainHref("/syarat-ketentuan")} className="hover:text-fg">Syarat &amp; Ketentuan</a></li>
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
