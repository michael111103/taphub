import { site } from "@/lib/site";

// robots.txt khusus pos.taphub.id (dilayani di pos.taphub.id/robots.txt lewat middleware)
export const dynamic = "force-static";

export function GET() {
  const body = `User-Agent: *\nAllow: /\n\nHost: ${site.posUrl}\nSitemap: ${site.posUrl}/sitemap.xml\n`;
  return new Response(body, { headers: { "Content-Type": "text/plain" } });
}
