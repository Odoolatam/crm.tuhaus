import type { Metadata } from "next";

import { LandingPage } from "@/components/landing/landing-page";
import { BRAND } from "@/config/brand";
import { LANDING } from "@/config/landing";

// Public landing. Signed-in users are redirected to /dashboard by the
// middleware before this renders.
export const metadata: Metadata = {
  title: { absolute: `${BRAND.name} · ${LANDING.hero.title}` },
  description: LANDING.hero.subtitle,
  robots: { index: true, follow: true },
  openGraph: {
    title: BRAND.name,
    description: LANDING.hero.subtitle,
    url: BRAND.siteUrl,
    siteName: BRAND.name,
    locale: "es_CL",
    type: "website",
  },
};

export default function RootPage() {
  return <LandingPage />;
}
