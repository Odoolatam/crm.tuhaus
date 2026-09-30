import type { ReactNode } from "react";
import Link from "next/link";

import { BrandLogo } from "@/components/brand/brand-logo";
import { BRAND } from "@/config/brand";
import { LEGAL, LEGAL_LINKS } from "@/config/legal";

/**
 * Shell for the public legal pages. Always light, like the landing,
 * so the pages look the same for every visitor (and for Meta's
 * reviewers).
 */
export function LegalPage({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: ReactNode;
  children: ReactNode;
}) {
  const year = new Date().getFullYear();
  return (
    <div className="min-h-screen bg-white text-neutral-900" style={{ colorScheme: "light" }}>
      <header className="border-b border-neutral-200/70">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4 sm:px-6">
          <Link href="/" aria-label={BRAND.name}>
            <BrandLogo tone="light" height={28} />
          </Link>
          <Link href="/" className="text-sm text-neutral-600 hover:text-neutral-900">
            ← Volver al inicio
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-neutral-500">
          Última actualización: {LEGAL.lastUpdated}
        </p>
        {intro && <div className="mt-6 space-y-4 leading-relaxed text-neutral-700">{intro}</div>}
        <div className="mt-8 space-y-8">{children}</div>
      </main>

      <footer className="border-t border-neutral-200 px-4 py-8 sm:px-6">
        <div className="mx-auto flex max-w-3xl flex-col gap-3 text-sm text-neutral-500">
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {LEGAL_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-neutral-900">
                {l.label}
              </Link>
            ))}
          </nav>
          <p>
            © {year} {LEGAL.companyName}, RUT {LEGAL.rut}. {BRAND.name} es un servicio de{" "}
            {LEGAL.companyName}.
          </p>
        </div>
      </footer>
    </div>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <div className="mt-3 space-y-3 leading-relaxed text-neutral-700">{children}</div>
    </section>
  );
}

export function List({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc space-y-1.5 pl-5">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

export function Mail() {
  return (
    <a href={`mailto:${LEGAL.email}`} className="font-medium text-[#9a5a14] underline underline-offset-2">
      {LEGAL.email}
    </a>
  );
}

export function CompanyBlock() {
  return (
    <List
      items={[
        <>Razón social: {LEGAL.companyName}</>,
        <>RUT: {LEGAL.rut}</>,
        <>Domicilio: {LEGAL.address}</>,
        <>
          Correo: <Mail />
        </>,
        <>Teléfono: {LEGAL.phone}</>,
      ]}
    />
  );
}
