import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleCard from "@/components/ArticleCard";
import CtaCard from "@/components/CtaCard";
import { articles, formatDate, getArticle, slugify, sortedArticles, type Block } from "@/lib/articles";
import { site } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const a = getArticle(params.slug);
  if (!a) return {};
  const url = `/blog/${a.slug}`;
  return {
    title: a.title,
    description: a.description,
    keywords: a.keywords,
    authors: [{ name: a.author }],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: a.title,
      description: a.description,
      publishedTime: a.date,
      modifiedTime: a.updated ?? a.date,
      authors: [a.author],
      section: a.category,
      images: [{ url: a.image.src, width: 1200, height: 630, alt: a.image.alt }],
    },
    twitter: { card: "summary_large_image", title: a.title, description: a.description, images: [a.image.src] },
  };
}

function renderBlock(b: Block, i: number) {
  switch (b.type) {
    case "h2":
      return <h2 key={i} id={slugify(b.text)} className="mt-12 scroll-mt-24 text-2xl font-semibold tracking-[-0.01em] sm:text-3xl">{b.text}</h2>;
    case "h3":
      return <h3 key={i} className="mt-8 text-xl font-semibold">{b.text}</h3>;
    case "p":
      return <p key={i} className="mt-5 text-[1.0625rem] leading-8 text-fg/85">{b.text}</p>;
    case "callout":
      return (
        <aside key={i} className="mt-8 rounded-2xl border border-tide-1/30 bg-tide-2/[0.07] p-5 leading-7 text-fg/90">
          {b.text}
        </aside>
      );
    case "ul":
      return (
        <ul key={i} className="mt-5 space-y-2.5 pl-1">
          {b.items.map((it) => (
            <li key={it} className="flex gap-3 text-[1.0625rem] leading-8 text-fg/85">
              <span aria-hidden="true" className="mt-3.5 h-1.5 w-1.5 shrink-0 rounded-full bg-tide-2" />
              {it}
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol key={i} className="mt-5 space-y-2.5">
          {b.items.map((it, n) => (
            <li key={it} className="flex gap-3 text-[1.0625rem] leading-8 text-fg/85">
              <span aria-hidden="true" className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-tide-2/10 text-xs font-semibold text-accent">
                {n + 1}
              </span>
              {it}
            </li>
          ))}
        </ol>
      );
  }
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const a = getArticle(params.slug);
  if (!a) notFound();

  const toc = a.body.filter((b): b is { type: "h2"; text: string } => b.type === "h2");
  const related = sortedArticles().filter((x) => x.slug !== a.slug).slice(0, 3);
  const url = `${site.url}/blog/${a.slug}`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: a.title,
      description: a.description,
      image: [`${site.url}${a.image.src}`],
      datePublished: a.date,
      dateModified: a.updated ?? a.date,
      author: { "@type": "Organization", name: a.author, url: site.url },
      publisher: { "@type": "Organization", name: site.name, logo: { "@type": "ImageObject", url: `${site.url}/taphub-logo-dark.png` } },
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      keywords: a.keywords.join(", "),
      articleSection: a.category,
      inLanguage: "id-ID",
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Beranda", item: `${site.url}/` },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${site.url}/blog` },
        { "@type": "ListItem", position: 3, name: a.title, item: url },
      ],
    },
  ];

  return (
    <>
      <article className="mx-auto max-w-page px-4 pb-16 pt-6 sm:px-6">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted">
            <li><Link href="/" className="hover:text-fg">Beranda</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/blog" className="hover:text-fg">Blog</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="line-clamp-1 text-fg">{a.title}</li>
          </ol>
        </nav>

        <header className="mx-auto max-w-3xl pt-10 sm:pt-14">
          <p className="text-sm font-medium text-accent">{a.category}</p>
          <h1 className="mt-3 text-balance text-[2.1rem] font-semibold leading-[1.1] tracking-[-0.025em] sm:text-5xl">{a.title}</h1>
          <p className="mt-5 text-lg leading-8 text-muted">{a.description}</p>
          <p className="mt-6 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
            <span>Oleh <span className="font-medium text-fg">{a.author}</span></span>
            <time dateTime={a.date}>{formatDate(a.date)}</time>
            <span>{a.readingMinutes} menit baca</span>
          </p>
        </header>

        <div className="mx-auto mt-10 max-w-5xl overflow-hidden rounded-[28px] border border-line">
          <Image
            src={a.image.src}
            alt={a.image.alt}
            width={1200}
            height={630}
            priority
            sizes="(min-width: 1024px) 64rem, 100vw"
            className="aspect-[1200/630] w-full object-cover"
          />
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-12 lg:grid-cols-[14rem_1fr]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <nav aria-label="Daftar isi" className="rounded-2xl border border-line bg-panel p-5">
              <p className="text-sm font-semibold">Daftar isi</p>
              <ol className="mt-3 space-y-2 text-sm">
                {toc.map((h) => (
                  <li key={h.text}>
                    <a href={`#${slugify(h.text)}`} className="text-muted hover:text-fg">{h.text}</a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>
          <div className="max-w-[68ch]">{a.body.map(renderBlock)}</div>
        </div>
      </article>

      {related.length > 0 && (
        <section aria-labelledby="terkait-judul" className="border-t border-line">
          <div className="mx-auto max-w-page px-4 py-16 sm:px-6 sm:py-20">
            <div className="flex items-end justify-between gap-4">
              <h2 id="terkait-judul" className="text-2xl font-semibold tracking-[-0.01em] sm:text-3xl">Artikel lainnya</h2>
              <Link href="/blog" className="text-sm font-semibold text-accent">Lihat semua artikel</Link>
            </div>
            <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <li key={r.slug}><ArticleCard article={r} headingLevel="h3" /></li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section aria-label="Konsultasi" className="border-t border-line">
        <div className="mx-auto max-w-page px-4 py-16 sm:px-6 sm:py-20">
          <CtaCard
            title="Siap merapikan kasir dan laporan usahamu?"
            body="Konsultasikan kebutuhan usahamu dengan tim TapHub dan lihat bagaimana TapPOS bisa membantu."
          />
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
