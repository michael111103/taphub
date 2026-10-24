import { site } from "@/lib/site";

// robots.txt khusus website.taphub.id (dilayani di website.taphub.id/robots.txt lewat middleware)
export const dynamic = "force-static";

export function GET() {
  const body = `User-Agent: *\nAllow: /\n\nHost: ${site.websiteUrl}\nSitemap: ${site.websiteUrl}/sitemap.xml\n`;
  return new Response(body, { headers: { "Content-Type": "text/plain" } });
}
