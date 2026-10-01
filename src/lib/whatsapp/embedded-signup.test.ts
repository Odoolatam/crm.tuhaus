import { describe, expect, it, vi } from "vitest";
import {
  exchangeCodeForToken,
  generateRegistrationPin,
  getEmbeddedSignupPublicConfig,
  isEsFinishEvent,
  isMetaId,
  matchesAppVerifyToken,
} from "./embedded-signup";

const env = (vars: Record<string, string>) => vars as unknown as NodeJS.ProcessEnv;

describe("getEmbeddedSignupPublicConfig", () => {
  it("is disabled until app id, config id and secret are all set", () => {
    expect(getEmbeddedSignupPublicConfig(env({})).enabled).toBe(false);
    expect(
      getEmbeddedSignupPublicConfig(env({ META_APP_ID: "1", META_ES_CONFIG_ID: "2" })).enabled,
    ).toBe(false);
    const cfg = getEmbeddedSignupPublicConfig(
      env({ META_APP_ID: "1", META_ES_CONFIG_ID: "2", META_APP_SECRET: "s" }),
    );
    expect(cfg).toEqual({ enabled: true, appId: "1", configId: "2", graphVersion: "v23.0" });
  });

  it("never exposes the secret", () => {
    const cfg = getEmbeddedSignupPublicConfig(
      env({ META_APP_ID: "1", META_ES_CONFIG_ID: "2", META_APP_SECRET: "topsecret" }),
    );
    expect(JSON.stringify(cfg)).not.toContain("topsecret");
  });
});

describe("validators", () => {
  it("accepts only numeric Meta ids", () => {
    expect(isMetaId("1080086264754535")).toBe(true);
    expect(isMetaId("12/../me")).toBe(false);
    expect(isMetaId(123)).toBe(false);
  });

  it("recognizes finish events", () => {
    expect(isEsFinishEvent("FINISH")).toBe(true);
    expect(isEsFinishEvent("FINISH_WHATSAPP_BUSINESS_APP_ONBOARDING")).toBe(true);
    expect(isEsFinishEvent("CANCEL")).toBe(false);
  });

  it("generates 6-digit PINs", () => {
    for (let i = 0; i < 50; i++) expect(generateRegistrationPin()).toMatch(/^\d{6}$/);
  });
});

describe("matchesAppVerifyToken", () => {
  it("matches only the configured token", () => {
    const e = env({ META_WEBHOOK_VERIFY_TOKEN: "abc123" });
    expect(matchesAppVerifyToken("abc123", e)).toBe(true);
    expect(matchesAppVerifyToken("abc124", e)).toBe(false);
    expect(matchesAppVerifyToken("abc", e)).toBe(false);
  });

  it("never matches when unset", () => {
    expect(matchesAppVerifyToken("", env({}))).toBe(false);
    expect(matchesAppVerifyToken("x", env({}))).toBe(false);
  });
});

describe("exchangeCodeForToken", () => {
  const e = env({ META_APP_ID: "111", META_ES_CONFIG_ID: "2", META_APP_SECRET: "sec" });

  it("calls the oauth endpoint and returns the token", async () => {
    const fetchImpl = vi.fn(async () =>
      new Response(JSON.stringify({ access_token: "TOKEN" }), { status: 200 }),
    );
    await expect(exchangeCodeForToken("CODE", e, fetchImpl as unknown as typeof fetch)).resolves.toBe("TOKEN");
    const url = new URL((fetchImpl.mock.calls[0] as unknown as [string])[0]);
    expect(url.pathname).toBe("/v23.0/oauth/access_token");
    expect(url.searchParams.get("client_id")).toBe("111");
    expect(url.searchParams.get("code")).toBe("CODE");
  });

  it("surfaces Meta's error message", async () => {
    const fetchImpl = vi.fn(async () =>
      new Response(JSON.stringify({ error: { message: "Code expired" } }), { status: 400 }),
    );
    await expect(exchangeCodeForToken("CODE", e, fetchImpl as unknown as typeof fetch)).rejects.toThrow(
      "Code expired",
    );
  });
});
