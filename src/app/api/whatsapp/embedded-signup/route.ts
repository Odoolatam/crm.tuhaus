import { NextResponse } from 'next/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { requireRole, toErrorResponse } from '@/lib/auth/account'
import { encrypt, decrypt } from '@/lib/whatsapp/encryption'
import {
  registerPhoneNumber,
  subscribeWabaToApp,
  verifyPhoneNumber,
} from '@/lib/whatsapp/meta-api'
import {
  exchangeCodeForToken,
  generateRegistrationPin,
  getEmbeddedSignupPublicConfig,
  isEsFinishEvent,
  isMetaId,
} from '@/lib/whatsapp/embedded-signup'

export const dynamic = 'force-dynamic'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _adminClient: any = null
function supabaseAdmin() {
  if (!_adminClient) {
    _adminClient = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )
  }
  return _adminClient
}

const bad = (error: string, status = 400) => NextResponse.json({ error }, { status })

/**
 * GET /api/whatsapp/embedded-signup
 * Public ids the browser needs to open Meta's popup. No secrets.
 */
export async function GET() {
  try {
    await requireRole('admin')
    return NextResponse.json(getEmbeddedSignupPublicConfig())
  } catch (err) {
    return toErrorResponse(err)
  }
}

/**
 * POST /api/whatsapp/embedded-signup
 *
 * Two actions:
 *   { action: 'connect', code, event, waba_id, phone_number_id }
 *     Called right after the popup finishes. Exchanges the code,
 *     validates the number, subscribes the WABA to our app, registers
 *     the number (except coexistence numbers, which are already
 *     registered by the WhatsApp Business app) and saves the config.
 *   { action: 'register', pin }
 *     Retries /register with a PIN the customer supplies, using the
 *     stored token. Needed when the number already had a two-step PIN.
 */
export async function POST(request: Request) {
  try {
    const ctx = await requireRole('admin')
    const config = getEmbeddedSignupPublicConfig()
    if (!config.enabled) return bad('Embedded Signup is not configured on the server', 503)

    let body: Record<string, unknown>
    try {
      body = await request.json()
    } catch {
      return bad('Invalid JSON')
    }

    if (body.action === 'register') return handleRegister(ctx, body)
    if (body.action !== 'connect') return bad('Unknown action')

    const { code, event, waba_id: wabaId, phone_number_id: phoneNumberId } = body
    if (typeof code !== 'string' || !code) return bad('Missing code')
    if (!isEsFinishEvent(event)) return bad('Unexpected signup event')
    if (!isMetaId(wabaId)) return bad('Missing WhatsApp Business account id')
    if (event === 'FINISH_ONLY_WABA' || !isMetaId(phoneNumberId)) {
      return bad(
        'The WhatsApp account was created without a phone number. Add a number in the popup and try again.',
        422,
      )
    }

    // 1. Exchange the code first: it expires ~30 s after the popup closes.
    let accessToken: string
    try {
      accessToken = await exchangeCodeForToken(code)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Token exchange failed'
      console.error('[embedded-signup] token exchange failed:', message)
      return bad(`Meta did not accept the connection: ${message}`, 502)
    }

    // 2. One number per account across the instance (see config route, issue #136).
    const { data: claimed, error: claimedError } = await supabaseAdmin()
      .from('whatsapp_config')
      .select('account_id')
      .eq('phone_number_id', phoneNumberId)
      .neq('account_id', ctx.accountId)
      .maybeSingle()
    if (claimedError) {
      console.error('[embedded-signup] ownership check failed:', claimedError)
      return bad('Failed to validate configuration', 500)
    }
    if (claimed) {
      return bad('This WhatsApp number is already linked to another Tuhaus CRM account.', 409)
    }

    // 3. Validate the number with the new token.
    let phoneInfo
    try {
      phoneInfo = await verifyPhoneNumber({ phoneNumberId, accessToken })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown Meta API error'
      return bad(`Meta API error: ${message}`, 502)
    }

    // 4. Route the WABA's webhooks to our app. Required for inbound messages.
    let subscribedAppsAt: string | null = null
    try {
      await subscribeWabaToApp({ wabaId, accessToken })
      subscribedAppsAt = new Date().toISOString()
    } catch (err) {
      console.warn('[embedded-signup] subscribed_apps failed:', err instanceof Error ? err.message : err)
    }

    // 5. Register for Cloud API. Coexistence numbers are already
    //    registered through the WhatsApp Business app: skip.
    const coexistence = event === 'FINISH_WHATSAPP_BUSINESS_APP_ONBOARDING'
    let registeredAt: string | null = null
    let registrationError: string | null = null
    let pin: string | null = null
    if (coexistence) {
      registeredAt = new Date().toISOString()
    } else {
      pin = generateRegistrationPin()
      try {
        await registerPhoneNumber({ phoneNumberId, accessToken, pin })
        registeredAt = new Date().toISOString()
      } catch (err) {
        registrationError = err instanceof Error ? err.message : 'Unknown Meta API error'
        pin = null
        console.error('[embedded-signup] /register failed:', registrationError)
      }
    }

    // 6. Save (one row per account).
    const now = new Date().toISOString()
    const row = {
      phone_number_id: phoneNumberId,
      waba_id: wabaId,
      access_token: encrypt(accessToken),
      verify_token: null,
      status: registrationError ? 'disconnected' : 'connected',
      connected_at: registrationError ? null : now,
      registered_at: registeredAt,
      subscribed_apps_at: subscribedAppsAt,
      last_registration_error: registrationError,
      updated_at: now,
    }
    const { data: existing } = await ctx.supabase
      .from('whatsapp_config')
      .select('id')
      .eq('account_id', ctx.accountId)
      .maybeSingle()
    const { error: saveError } = existing
      ? await ctx.supabase.from('whatsapp_config').update(row).eq('account_id', ctx.accountId)
      : await ctx.supabase
          .from('whatsapp_config')
          .insert({ account_id: ctx.accountId, user_id: ctx.userId, ...row })
    if (saveError) {
      console.error('[embedded-signup] save failed:', saveError)
      return bad('Failed to save configuration', 500)
    }

    return NextResponse.json({
      success: !registrationError,
      coexistence,
      registered: registeredAt != null,
      registration_error: registrationError,
      // Shown once so the customer can keep it: it is now the number's
      // two-step verification PIN. Not stored.
      pin,
      phone_info: phoneInfo,
    })
  } catch (err) {
    return toErrorResponse(err)
  }
}

async function handleRegister(
  ctx: Awaited<ReturnType<typeof requireRole>>,
  body: Record<string, unknown>,
) {
  const { pin } = body
  if (typeof pin !== 'string' || !/^\d{6}$/.test(pin)) return bad('PIN must be exactly 6 digits.')

  const { data: cfg, error } = await ctx.supabase
    .from('whatsapp_config')
    .select('phone_number_id, access_token')
    .eq('account_id', ctx.accountId)
    .maybeSingle()
  if (error || !cfg) return bad('Connect WhatsApp first', 404)

  let accessToken: string
  try {
    accessToken = decrypt(cfg.access_token)
  } catch {
    return bad('Stored token cannot be decrypted. Connect WhatsApp again.', 409)
  }

  const now = new Date().toISOString()
  try {
    await registerPhoneNumber({ phoneNumberId: cfg.phone_number_id, accessToken, pin })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown Meta API error'
    await ctx.supabase
      .from('whatsapp_config')
      .update({ last_registration_error: message, updated_at: now })
      .eq('account_id', ctx.accountId)
    return bad(message, 502)
  }

  await ctx.supabase
    .from('whatsapp_config')
    .update({
      status: 'connected',
      connected_at: now,
      registered_at: now,
      last_registration_error: null,
      updated_at: now,
    })
    .eq('account_id', ctx.accountId)
  return NextResponse.json({ success: true, registered: true })
}
