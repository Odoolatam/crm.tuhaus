/**
 * Tuhaus CRM: subscription state for an account.
 *
 * Mirrors the `account_billing` table (migration 900_tuhaus_billing.sql).
 * Shared by the middleware (to block access) and the UI (trial banner and
 * /suscripcion page), so the rule lives in one place.
 */

export type BillingStatus = "trial" | "active" | "suspended";

export interface BillingRow {
  status: BillingStatus;
  trial_ends_at: string;
  paid_until: string | null;
}

export type BillingKind = "trial" | "active" | "expired" | "suspended" | "unknown";

export interface BillingState {
  /** Whether the account may use the CRM right now. */
  allowed: boolean;
  kind: BillingKind;
  /** Whole days left in the trial (trial only), rounded up. */
  daysLeft: number | null;
}

const DAY_MS = 24 * 60 * 60 * 1000;

export function billingState(
  row: BillingRow | null | undefined,
  now: Date = new Date(),
): BillingState {
  // No row (table missing, query error, legacy account): never lock
  // anyone out because of an infrastructure problem.
  if (!row) return { allowed: true, kind: "unknown", daysLeft: null };

  if (row.status === "suspended") {
    return { allowed: false, kind: "suspended", daysLeft: null };
  }

  if (row.status === "active") {
    const until = row.paid_until ? new Date(row.paid_until) : null;
    if (!until || until.getTime() > now.getTime()) {
      return { allowed: true, kind: "active", daysLeft: null };
    }
    return { allowed: false, kind: "expired", daysLeft: 0 };
  }

  // trial
  const ends = new Date(row.trial_ends_at).getTime();
  const msLeft = ends - now.getTime();
  if (msLeft > 0) {
    return { allowed: true, kind: "trial", daysLeft: Math.ceil(msLeft / DAY_MS) };
  }
  return { allowed: false, kind: "expired", daysLeft: 0 };
}

/** Paths that require an active trial or subscription. */
export const BILLING_GATED_PATHS = [
  "/dashboard",
  "/inbox",
  "/contacts",
  "/pipelines",
  "/broadcasts",
  "/automations",
  "/flows",
  "/agents",
  "/notifications",
  "/settings",
];

/** Where blocked accounts are sent. Not gated itself. */
export const BILLING_BLOCKED_PATH = "/suscripcion";
