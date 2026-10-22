import { NextResponse, type NextRequest } from "next/server";

/**
 * Subdomain TapPOS.
 *
 * - pos.taphub.id/            -> menampilkan halaman src/app/pos (URL di browser tetap pos.taphub.id)
 * - pos.taphub.id/sitemap.xml -> sitemap khusus TapPOS
 * - pos.taphub.id/robots.txt  -> robots khusus TapPOS
 * - pos.taphub.id/<halaman lain> -> dialihkan ke taphub.id/<halaman lain>
 * - taphub.id/pos             -> dialihkan permanen ke pos.taphub.id (supaya Google hanya mengindeks satu alamat)
 *
 * Di preview Vercel (*.vercel.app) dan localhost, TapPOS tetap bisa dibuka di /pos.
 * Untuk tes subdomain di komputer sendiri, buka http://pos.localhost:3000
 */
const MAIN_HOSTS = new Set(["taphub.id", "www.taphub.id"]);
const MAIN_URL = "https://taphub.id";
const POS_URL = "https://pos.taphub.id";

function isPosHost(host: string) {
  const name = host.split(":")[0];
  return name === "pos.taphub.id" || name === "pos.localhost";
}

// File yang selalu dilayani apa adanya di semua host
const PASSTHROUGH = /^\/(_next|images|icon|apple-icon|taphub|favicon|opengraph-image|pos\/)/;

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  const { pathname, search } = req.nextUrl;

  if (isPosHost(host)) {
    if (PASSTHROUGH.test(pathname) || pathname === "/pos") return NextResponse.next();

    const url = req.nextUrl.clone();
    if (pathname === "/") {
      url.pathname = "/pos";
      return NextResponse.rewrite(url);
    }
    if (pathname === "/sitemap.xml") {
      url.pathname = "/pos/sitemap.xml";
      return NextResponse.rewrite(url);
    }
    if (pathname === "/robots.txt") {
      url.pathname = "/pos/robots.txt";
      return NextResponse.rewrite(url);
    }
    // Halaman situs utama (hubungi kami, legal, dll.) dibuka di domain utama
    const mainBase = host.startsWith("pos.localhost") ? `http://${host.replace(/^pos\./, "")}` : MAIN_URL;
    return NextResponse.redirect(`${mainBase}${pathname}${search}`, 308);
  }

  if (MAIN_HOSTS.has(host.split(":")[0]) && (pathname === "/pos" || pathname.startsWith("/pos/"))) {
    const rest = pathname.replace(/^\/pos/, "") || "/";
    if (!rest.startsWith("/opengraph-image")) {
      return NextResponse.redirect(`${POS_URL}${rest}${search}`, 308);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
