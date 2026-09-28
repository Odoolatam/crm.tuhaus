"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Bot, KanbanSquare, MessagesSquare } from "lucide-react";
import { useTranslations } from "next-intl";

import { BrandLogo } from "@/components/brand/brand-logo";
import { BRAND } from "@/config/brand";

/**
 * Layout for the public auth screens (login, signup, forgot password,
 * invite acceptance): brand panel on the left, form on the right.
 * On small screens the panel collapses into a logo above the form.
 */
export function AuthShell({ children }: { children: ReactNode }) {
  const t = useTranslations("AuthShell");
  const features = [
    { icon: MessagesSquare, text: t("feature1") },
    { icon: KanbanSquare, text: t("feature2") },
    { icon: Bot, text: t("feature3") },
  ];

  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      {/* Brand panel (desktop) */}
      <aside
        className="relative hidden overflow-hidden p-12 text-white lg:flex lg:flex-col lg:justify-between"
        style={{ background: BRAND.colors.ink }}
      >
        {/* Warm glow + oversized mark as background texture */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-40 -top-40 h-[32rem] w-[32rem] rounded-full opacity-25 blur-3xl"
          style={{ background: BRAND.colors.orange }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={BRAND.logo.markDark}
          alt=""
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -right-24 h-[26rem] w-[26rem] opacity-[0.06]"
        />

        <Link
          href="/"
          aria-label={`${BRAND.name}: ${t("backHome")}`}
          className="relative w-fit rounded-md transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          <BrandLogo tone="dark" height={40} />
        </Link>

        <div className="relative max-w-md">
          <h2 className="text-3xl font-semibold leading-tight tracking-tight">
            {t("headline")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/70">
            {t("subhead")}
          </p>
          <ul className="mt-8 space-y-4">
            {features.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-white/85">
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                  style={{ background: "rgb(234 166 84 / 0.15)", color: BRAND.colors.orange }}
                >
                  <Icon className="h-4 w-4" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-white/40">
          © {new Date().getFullYear()} {BRAND.shortName}
        </p>
      </aside>

      {/* Form side */}
      <main className="flex flex-col items-center justify-center px-4 py-10 sm:px-8">
        <Link
          href="/"
          aria-label={`${BRAND.name}: ${t("backHome")}`}
          className="mb-8 rounded-md transition-opacity hover:opacity-80 lg:hidden"
        >
          <BrandLogo height={36} />
        </Link>
        <div className="flex w-full justify-center">{children}</div>
        <Link
          href="/"
          className="mt-6 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← {t("backHome")}
        </Link>
      </main>
    </div>
  );
}
