"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Clock } from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { whatsappLink } from "@/config/landing";
import { billingState, type BillingRow } from "@/lib/billing/state";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

/**
 * Thin bar above the app header while the account is in its free
 * trial: "X días de prueba gratis" + a WhatsApp link to activate.
 * Renders nothing for active accounts or if the row can't be read.
 */
export function TrialBanner() {
  const t = useTranslations("Billing");
  const { user } = useAuth();
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    supabase
      .from("account_billing")
      .select("status, trial_ends_at, paid_until")
      .maybeSingle()
      .then(({ data }) => {
        const state = billingState(data as BillingRow | null);
        setDaysLeft(state.kind === "trial" ? state.daysLeft : null);
      });
  }, [user]);

  if (daysLeft === null) return null;
  const urgent = daysLeft <= 3;

  return (
    <div
      className={cn(
        "flex shrink-0 flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-2 text-center text-sm",
        urgent
          ? "bg-primary text-primary-foreground"
          : "bg-primary/10 text-foreground",
      )}
    >
      <span className="inline-flex items-center gap-1.5">
        <Clock className="h-4 w-4" />
        {t("bannerTrial", { days: daysLeft })}
      </span>
      <a
        href={whatsappLink(
          t("whatsappActivate", { email: user?.email ?? "-" }),
        )}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold underline underline-offset-2"
      >
        {t("bannerCta")}
      </a>
    </div>
  );
}
