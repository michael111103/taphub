import type { Metadata } from "next";
import Link from "next/link";
import BlogBrowser from "@/components/BlogBrowser";
import { articleCategories, sortedArticles } from "@/lib/articles";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog: Tips dan Panduan Bisnis untuk UMKM",
  description:
    "Artikel TapHub seputar aplikasi kasir, sistem POS, pengelolaan stok, keuangan, dan tips menjalankan usaha F&B, retail, dan jasa di Indonesia.",
  alternates: { canonical: "/blog" },
  openGraph: { type: "website", url: "/blog", title: "Blog TapHub", description: "Tips dan panduan bisnis untuk UMKM Indonesia." },
};

export default function BlogPage() {
  const articles = sortedArticles();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Blog TapHub",
    url: `${site.url}/blog`,
    publisher: { "@type": "Organization", name: site.name, logo: { "@type": "ImageObject", url: `${site.url}/taphub-logo-dark.png` } },
    blogPost: articles.map((a) => ({
      "@type": "BlogPosting",
      headline: a.title,
      url: `${site.url}/blog/${a.slug}`,
      datePublished: a.date,
      image: `${site.url}${a.image.src}`,
    })),
  };

  return (
    <section className="relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(55%_60%_at_20%_0%,rgba(27,91,255,0.14),transparent_70%)]" />
      <div className="mx-auto max-w-page px-4 pb-24 pt-6 sm:px-6">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-muted">
            <li><Link href="/" className="hover:text-fg">Beranda</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-fg">Blog</li>
          </ol>
        </nav>
        <div className="max-w-2xl pt-10 sm:pt-14">
          <h1 className="text-balance text-[2.5rem] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-6xl">Blog TapHub</h1>
          <p className="mt-5 text-lg leading-8 text-muted">
            Tips dan panduan praktis seputar kasir, stok, keuangan, dan cara menjalankan usaha dengan lebih rapi.
          </p>
        </div>
        <div className="mt-10">
          <BlogBrowser articles={articles} categories={articleCategories} />
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </section>
  );
}
