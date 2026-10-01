/**
 * WhatsApp Embedded Signup (Tech Provider) helpers.
 *
 * With Embedded Signup every customer connects their number to ONE
 * platform app (ours) through Meta's popup, instead of creating their
 * own Meta app and pasting tokens. The popup returns a short-lived
 * code (TTL ~30 s) that we exchange server-side for a business token
 * scoped to the customer's WhatsApp Business account.
 *
 * Runtime configuration (no rebuild needed, read on each request):
 *   META_APP_ID               platform app id (public)
 *   META_APP_SECRET           platform app secret (also used for webhook HMAC)
 *   META_ES_CONFIG_ID         Facebook Login for Business configuration id (public)
 *   META_WEBHOOK_VERIFY_TOKEN app-level webhook verify token
 *   META_ES_GRAPH_VERSION     optional, defaults to DEFAULT_GRAPH_VERSION
 */

import { randomInt, timingSafeEqual } from 'node:crypto'

export const DEFAULT_GRAPH_VERSION = 'v23.0'

/** Events Meta posts to the opener window when the popup finishes. */
export const ES_FINISH_EVENTS = [
  'FINISH',
  'FINISH_ONLY_WABA',
  'FINISH_WHATSAPP_BUSINESS_APP_ONBOARDING',
] as const
export type EsFinishEvent = (typeof ES_FINISH_EVENTS)[number]

export function isEsFinishEvent(value: unknown): value is EsFinishEvent {
  return (
    typeof value === 'string' &&
    (ES_FINISH_EVENTS as readonly string[]).includes(value)
  )
}

export interface EmbeddedSignupPublicConfig {
  enabled: boolean
  appId: string | null
  configId: string | null
  graphVersion: string
}

/** Values the browser needs to open the popup. Never includes secrets. */
export function getEmbeddedSignupPublicConfig(
  env: NodeJS.ProcessEnv = process.env,
): EmbeddedSignupPublicConfig {
  const appId = env.META_APP_ID?.trim() || null
  const configId = env.META_ES_CONFIG_ID?.trim() || null
  const hasSecret = Boolean(env.META_APP_SECRET?.trim())
  return {
    enabled: Boolean(appId && configId && hasSecret),
    appId,
    configId,
    graphVersion: env.META_ES_GRAPH_VERSION?.trim() || DEFAULT_GRAPH_VERSION,
  }
}

/** Meta ids are numeric strings. Rejects anything else before it reaches a URL. */
export function isMetaId(value: unknown): value is string {
  return typeof value === 'string' && /^\d{5,25}$/.test(value)
}

/**
 * Exchange the popup's code for a business integration system user
 * token. Must run within ~30 s of the popup finishing.
 */
export async function exchangeCodeForToken(
  code: string,
  env: NodeJS.ProcessEnv = process.env,
  fetchImpl: typeof fetch = fetch,
): Promise<string> {
  const { appId, graphVersion } = getEmbeddedSignupPublicConfig(env)
  const secret = env.META_APP_SECRET?.trim()
  if (!appId || !secret) {
    throw new Error('Embedded Signup is not configured on the server')
  }
  const url = new URL(`https://graph.facebook.com/${graphVersion}/oauth/access_token`)
  url.searchParams.set('client_id', appId)
  url.searchParams.set('client_secret', secret)
  url.searchParams.set('code', code)

  const response = await fetchImpl(url.toString())
  let data: { access_token?: string; error?: { message?: string } } = {}
  try {
    data = await response.json()
  } catch {
    /* keep empty */
  }
  if (!response.ok || !data.access_token) {
    throw new Error(data.error?.message || `Meta token exchange failed (${response.status})`)
  }
  return data.access_token
}

/** Random 6-digit two-step verification PIN for /register. */
export function generateRegistrationPin(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, '0')
}

/**
 * Constant-time check of the app-level webhook verify token. Returns
 * false when the env var is unset so an empty token never matches.
 */
export function matchesAppVerifyToken(
  candidate: string,
  env: NodeJS.ProcessEnv = process.env,
): boolean {
  const expected = env.META_WEBHOOK_VERIFY_TOKEN?.trim()
  if (!expected || !candidate) return false
  const a = Buffer.from(candidate)
  const b = Buffer.from(expected)
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}
