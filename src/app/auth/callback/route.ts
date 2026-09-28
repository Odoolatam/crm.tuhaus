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

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/dashboard'

  // Use NEXT_PUBLIC_SITE_URL for production redirect (not container internal URL)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || requestUrl.origin

  const loginWithError = (reason: string) => {
    const errorUrl = new URL('/login', siteUrl)
    errorUrl.searchParams.set('error', 'oauth_failed')
    errorUrl.searchParams.set('reason', reason)
    return NextResponse.redirect(errorUrl)
  }

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
    const response = NextResponse.redirect(`${siteUrl}${next}`)

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

  return NextResponse.redirect(`${siteUrl}${next}`)
}
