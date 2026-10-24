import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Subdomain:
 *
 * pos.taphub.id (landing TapPOS)
 * - pos.taphub.id/            -> halaman src/app/(site)/pos
 * - pos.taphub.id/sitemap.xml -> sitemap khusus TapPOS
 * - pos.taphub.id/robots.txt  -> robots khusus TapPOS
 * - pos.taphub.id/<lainnya>   -> dialihkan ke taphub.id/<lainnya>
 * - taphub.id/pos             -> dialihkan permanen ke pos.taphub.id
 *
 * website.taphub.id (landing TapWebsite), aturannya sama seperti pos.taphub.id:
 * - website.taphub.id/            -> halaman src/app/(site)/website
 * - website.taphub.id/sitemap.xml -> sitemap khusus TapWebsite
 * - taphub.id/website             -> dialihkan permanen ke website.taphub.id
 *
 * app.taphub.id (aplikasi TapHub)
 * - app.taphub.id/<path>      -> halaman src/app/app/<path> (URL di browser tetap app.taphub.id/<path>)
 * - taphub.id/app/<path>      -> dialihkan ke app.taphub.id/<path>
 *
 * Di preview Vercel (*.vercel.app) dan localhost, keduanya tetap bisa dibuka di /pos dan /app.
 * Tes subdomain di komputer sendiri: http://pos.localhost:3000, http://website.localhost:3000 dan http://app.localhost:3000
 */
const MAIN_HOSTS = new Set(["taphub.id", "www.taphub.id"]);
const MAIN_URL = "https://taphub.id";
const POS_URL = "https://pos.taphub.id";
const APP_URL = "https://app.taphub.id";
const WEBSITE_URL = "https://website.taphub.id";

function hostName(host: string) {
  return host.split(":")[0];
}
function isPosHost(host: string) {
  const name = hostName(host);
  return name === "pos.taphub.id" || name === "pos.localhost";
}
function isWebsiteHost(host: string) {
  const name = hostName(host);
  return name === "website.taphub.id" || name === "website.localhost";
}
function isAppHost(host: string) {
  const name = hostName(host);
  return name === "app.taphub.id" || name === "app.localhost";
}

// File yang selalu dilayani apa adanya di semua host
const PASSTHROUGH = /^\/(_next|images|email|icon|apple-icon|taphub|whitelogo|favicon|opengraph-image|pos\/|website\/)/;
const APP_PASSTHROUGH = /^\/(_next|images|email|icon|apple-icon|taphub|whitelogo|favicon|app\/)|\.(png|jpe?g|svg|webp|ico)$/;

/**
 * Menyegarkan sesi login Supabase. Cookie hasil penyegaran ditulis ke request (supaya halaman /
 * server action di request yang sama memakai token baru) dan ke response (supaya browser menyimpannya).
 */
async function refreshSession(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const updated: { name: string; value: string; options?: Record<string, unknown> }[] = [];
  if (!url || !key) return updated;
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return req.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach((c) => {
          req.cookies.set(c.name, c.value);
          updated.push(c);
        });
      },
    },
  });
  await supabase.auth.getUser();
  return updated;
}

/** Response aplikasi: rewrite/next dengan header x-app-base + cookie sesi terbaru */
async function appResponse(req: NextRequest, base: string, rewriteTo?: URL) {
  const updated = await refreshSession(req);
  const headers = new Headers(req.headers);
  headers.set("x-app-base", base);
  headers.set("cookie", req.cookies.toString());
  const res = rewriteTo ? NextResponse.rewrite(rewriteTo, { request: { headers } }) : NextResponse.next({ request: { headers } });
  updated.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
  return res;
}

export async function middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  const { pathname, search } = req.nextUrl;

  // ---------- app.taphub.id ----------
  if (isAppHost(host)) {
    if (APP_PASSTHROUGH.test(pathname) && !pathname.startsWith("/app/")) return NextResponse.next();
    const url = req.nextUrl.clone();
    if (pathname === "/robots.txt") {
      return new NextResponse("User-agent: *\nDisallow: /\n", { headers: { "content-type": "text/plain" } });
    }
    url.pathname = pathname.startsWith("/app/") || pathname === "/app" ? pathname : `/app${pathname === "/" ? "" : pathname}`;
    return appResponse(req, "", url);
  }

  // ---------- pos.taphub.id ----------
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
    const mainBase = host.startsWith("pos.localhost") ? `http://${host.replace(/^pos\./, "")}` : MAIN_URL;
    return NextResponse.redirect(`${mainBase}${pathname}${search}`, 308);
  }

  // ---------- website.taphub.id ----------
  if (isWebsiteHost(host)) {
    if (PASSTHROUGH.test(pathname) || pathname === "/website") return NextResponse.next();
    const url = req.nextUrl.clone();
    if (pathname === "/" || pathname === "/sitemap.xml" || pathname === "/robots.txt") {
      url.pathname = pathname === "/" ? "/website" : `/website${pathname}`;
      return NextResponse.rewrite(url);
    }
    const mainBase = host.startsWith("website.localhost") ? `http://${host.replace(/^website\./, "")}` : MAIN_URL;
    return NextResponse.redirect(`${mainBase}${pathname}${search}`, 308);
  }

  // ---------- taphub.id ----------
  if (MAIN_HOSTS.has(hostName(host))) {
    if (pathname === "/pos" || pathname.startsWith("/pos/")) {
      const rest = pathname.replace(/^\/pos/, "") || "/";
      if (!rest.startsWith("/opengraph-image")) {
        return NextResponse.redirect(`${POS_URL}${rest}${search}`, 308);
      }
    }
    if (pathname === "/website" || pathname.startsWith("/website/")) {
      const rest = pathname.replace(/^\/website/, "") || "/";
      if (!rest.startsWith("/opengraph-image")) {
        return NextResponse.redirect(`${WEBSITE_URL}${rest}${search}`, 308);
      }
    }
    if (pathname === "/app" || pathname.startsWith("/app/")) {
      const rest = pathname.replace(/^\/app/, "") || "/";
      return NextResponse.redirect(`${APP_URL}${rest}${search}`, 307);
    }
  }

  // Preview Vercel / localhost: aplikasi dibuka di /app
  if (pathname === "/app" || pathname.startsWith("/app/")) {
    return appResponse(req, "/app");
  }

  return NextResponse.next();
}

/* Header x-app-base memberi tahu halaman aplikasi prefix link yang dipakai ("" di app.taphub.id, "/app" di tempat lain) */

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
