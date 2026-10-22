import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { products } from "@/lib/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const productPages = products
    .filter((p) => p.href)
    .map((p) => ({ url: `${site.url}${p.href}`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.9 }));

  return [
    { url: `${site.url}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...productPages,
    { url: `${site.url}/hubungi-kami`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}/kebijakan-privasi`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${site.url}/syarat-ketentuan`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
