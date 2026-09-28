"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { LogOut, MessageCircle, PauseCircle, TimerOff } from "lucide-react";

import { AuthShell } from "@/components/brand/auth-shell";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LANDING, whatsappLink } from "@/config/landing";
import { billingState, type BillingRow } from "@/lib/billing/state";
import { createClient } from "@/lib/supabase/client";

/**
 * Shown when the account's trial or subscription is over. The middleware
 * sends every app route here while the account is blocked, and sends the
 * visitor back to /dashboard as soon as the account is active again.
 */
export default function SubscriptionPage() {
  const t = useTranslations("Billing");
  const [email, setEmail] = useState<string>("");
  const [kind, setKind] = useState<"expired" | "suspended" | null>(null);

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      setEmail(auth.user?.email ?? "");
      const { data } = await supabase
        .from("account_billing")
        .select("status, trial_ends_at, paid_until")
        .maybeSingle();
      const state = billingState(data as BillingRow | null);
      setKind(state.kind === "suspended" ? "suspended" : "expired");
    })();
  }, []);

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const suspended = kind === "suspended";
  const Icon = suspended ? PauseCircle : TimerOff;
  const plan = LANDING.pricing.plan;

  return (
    <AuthShell>
      <Card className="w-full max-w-md border-border bg-card">
        <CardHeader className="items-center text-center">
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-xl text-foreground">
            {kind === null
              ? t("loading")
              : suspended
                ? t("suspendedTitle")
                : t("expiredTitle")}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {kind === null ? "" : suspended ? t("suspendedText") : t("expiredText")}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {!suspended && (
            <p className="text-center text-sm font-medium text-foreground">
              {t("planLine", { price: plan.price, period: plan.period })}
            </p>
          )}
          {/* Anchor styled as a button: the Base UI Button has no asChild. */}
          <a
            href={whatsappLink(t("whatsappActivate", { email: email || "-" }))}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants(), "h-10 w-full")}
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            {t("activateCta")}
          </a>
          <Button
            type="button"
            variant="ghost"
            onClick={signOut}
            className="h-10 w-full text-muted-foreground"
          >
            <LogOut className="mr-2 h-4 w-4" />
            {t("signOut")}
          </Button>
          {email && (
            <p className="text-center text-xs text-muted-foreground">{email}</p>
          )}
        </CardContent>
      </Card>
    </AuthShell>
  );
}
