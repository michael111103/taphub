import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// Sitemap khusus website.taphub.id (dilayani di website.taphub.id/sitemap.xml lewat middleware)
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${site.websiteUrl}/`, lastModified: new Date(), changeFrequency: "weekly", priority: 1 }];
}
