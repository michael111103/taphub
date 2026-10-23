import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// Sitemap khusus pos.taphub.id (dilayani di pos.taphub.id/sitemap.xml lewat middleware)
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${site.posUrl}/`, lastModified: new Date(), changeFrequency: "weekly", priority: 1 }];
}
