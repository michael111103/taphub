import type { Metadata } from "next";
import { href } from "@/lib/app/context";
import { PageHeader } from "@/components/app/ui";
import ContactForm from "../ContactForm";

export const metadata: Metadata = { title: "Kontak baru" };

export default function NewContactPage({ searchParams }: { searchParams: { jenis?: string } }) {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Kontak baru" icon="contacts" tone="pink" crumbs={[{ label: "Kontak", href: href("/kontak") }, { label: "Baru" }]} />
      <ContactForm defaultKind={searchParams.jenis ?? "customer"} />
    </div>
  );
}
