import Image from "next/image";
import Link from "next/link";
import { formatDate, type Article } from "@/lib/articles";

export default function ArticleCard({ article, headingLevel = "h2" }: { article: Article; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-panel transition hover:-translate-y-1 hover:border-tide-1/40 hover:shadow-[0_20px_50px_-25px_rgba(27,91,255,0.45)]">
      <div className="overflow-hidden">
        <Image
          src={article.image.src}
          alt={article.image.alt}
          width={1200}
          height={630}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="aspect-[1200/630] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="text-xs text-muted">
          <span className="font-medium text-accent">{article.category}</span>
          <span aria-hidden="true"> · </span>
          <time dateTime={article.date}>{formatDate(article.date)}</time>
        </p>
        <Heading className="mt-3 text-lg font-semibold leading-snug">
          <Link href={`/blog/${article.slug}`} className="after:absolute after:inset-0">
            {article.title}
          </Link>
        </Heading>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted">{article.description}</p>
        <p className="mt-auto pt-5 text-sm font-semibold text-accent">Baca artikel</p>
      </div>
    </article>
  );
}
