export default function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <h1 className="text-balance text-4xl font-semibold tracking-[-0.02em] sm:text-5xl">{title}</h1>
      <p className="mt-4 text-sm text-muted">Terakhir diperbarui {updated}</p>
      <div className="prose-legal mt-10 border-t border-line pt-2">{children}</div>
    </article>
  );
}
