import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { articles } from "@/lib/articles";

// Sitemap taphub.id. Landing page TapPOS punya sitemap sendiri di pos.taphub.id/sitemap.xml.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${site.url}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/tentang-kami`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    ...articles.map((a) => ({
      url: `${site.url}/blog/${a.slug}`,
      lastModified: new Date(`${a.updated ?? a.date}T00:00:00+07:00`),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    { url: `${site.url}/hubungi-kami`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}/kebijakan-privasi`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${site.url}/syarat-ketentuan`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
