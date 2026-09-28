import { describe, expect, it } from "vitest";
import { billingState } from "./state";

const now = new Date("2026-10-01T12:00:00Z");

describe("billingState", () => {
  it("allows when there is no row", () => {
    expect(billingState(null, now)).toEqual({ allowed: true, kind: "unknown", daysLeft: null });
  });
  it("counts trial days left, rounded up", () => {
    const s = billingState(
      { status: "trial", trial_ends_at: "2026-10-03T13:00:00Z", paid_until: null },
      now,
    );
    expect(s).toEqual({ allowed: true, kind: "trial", daysLeft: 3 });
  });
  it("blocks an expired trial", () => {
    const s = billingState(
      { status: "trial", trial_ends_at: "2026-09-30T00:00:00Z", paid_until: null },
      now,
    );
    expect(s.allowed).toBe(false);
    expect(s.kind).toBe("expired");
  });
  it("allows active without end date", () => {
    expect(
      billingState({ status: "active", trial_ends_at: "2026-01-01T00:00:00Z", paid_until: null }, now).allowed,
    ).toBe(true);
  });
  it("blocks active with a past paid_until", () => {
    const s = billingState(
      { status: "active", trial_ends_at: "2026-01-01T00:00:00Z", paid_until: "2026-09-01T00:00:00Z" },
      now,
    );
    expect(s).toEqual({ allowed: false, kind: "expired", daysLeft: 0 });
  });
  it("blocks suspended", () => {
    expect(
      billingState({ status: "suspended", trial_ends_at: "2026-12-01T00:00:00Z", paid_until: null }, now).allowed,
    ).toBe(false);
  });
});
