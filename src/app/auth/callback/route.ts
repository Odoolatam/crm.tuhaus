import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * OAuth / email-link callback.
 *
 * Exchanges the `code` Supabase sends back for a session. When anything
 * fails (Supabase returned an error, or the exchange itself failed) the
 * visitor is sent back to /login with `error=oauth_failed` plus a short
 * machine-readable `reason`, so the login page can show a useful message
 * instead of silently reloading.
 *
 * All redirects use RELATIVE locations ("/dashboard", "/login?..."), so
 * the browser stays on the public domain it came from (crm.tuhaus.com or
 * crm.smarterbot.store). Session and PKCE cookies are per-domain, so an
 * absolute redirect to a different domain would break the login. It also
 * avoids the container's internal URL leaking into redirects.
 */

// Map raw Supabase error text to a short reason code for the login page.
function toReason(message: string | null | undefined): string {
  const m = (message || '').toLowerCase()
  if (m.includes('signup') && (m.includes('not allowed') || m.includes('disabled'))) {
    return 'signup_disabled'
  }
  if (m.includes('database error saving new user')) return 'new_user_failed'
  if (m.includes('code verifier') || m.includes('flow state')) return 'expired'
  if (m.includes('access_denied') || m.includes('cancel')) return 'cancelled'
  return 'unknown'
}

// Only allow same-site paths as the post-login destination.
function safeNext(raw: string | null): string {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//') || raw.startsWith('/\\')) {
    return '/dashboard'
  }
  return raw
}

function redirectTo(location: string): NextResponse {
  return new NextResponse(null, { status: 307, headers: { Location: location } })
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = safeNext(requestUrl.searchParams.get('next'))

  const loginWithError = (reason: string) =>
    redirectTo(`/login?error=oauth_failed&reason=${encodeURIComponent(reason)}`)

  // Supabase can redirect here with an error instead of a code, e.g.
  // when new sign-ups are disabled or the user cancelled on Google.
  const providerError =
    requestUrl.searchParams.get('error_description') ||
    requestUrl.searchParams.get('error')
  if (providerError) {
    console.error('OAuth provider error:', providerError)
    return loginWithError(toReason(providerError))
  }

  if (code) {
    const response = redirectTo(next)

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('OAuth exchange error:', error.message)
      return loginWithError(toReason(error.message))
    }

    return response
  }

  return redirectTo(next)
}
