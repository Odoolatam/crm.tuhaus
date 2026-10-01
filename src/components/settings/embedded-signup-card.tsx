'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { CheckCircle2, KeyRound, Loader2, MessageCircle, Smartphone } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

/**
 * "Connect WhatsApp" button backed by Meta's Embedded Signup.
 *
 * Opens Meta's popup with the platform app's Facebook Login for
 * Business configuration. The popup reports the chosen WABA / phone
 * number via window.postMessage and returns an exchangeable code via
 * the FB.login callback; the two can arrive in either order, so we
 * keep both in refs and POST as soon as both are present (the code
 * expires about 30 seconds after the popup closes).
 */

interface PublicConfig {
  enabled: boolean;
  appId: string | null;
  configId: string | null;
  graphVersion: string;
}

interface SessionInfo {
  event: string;
  waba_id?: string;
  phone_number_id?: string;
}

interface ConnectResult {
  success?: boolean;
  coexistence?: boolean;
  registered?: boolean;
  registration_error?: string | null;
  pin?: string | null;
  phone_info?: { display_phone_number?: string; verified_name?: string };
  error?: string;
}

/* Minimal typing for the bits of the Facebook JS SDK we use. */
interface FbLoginResponse {
  authResponse?: { code?: string } | null;
  status?: string;
}
interface FbSdk {
  init(opts: { appId: string; autoLogAppEvents: boolean; xfbml: boolean; version: string }): void;
  login(cb: (r: FbLoginResponse) => void, opts: Record<string, unknown>): void;
}
declare global {
  interface Window {
    FB?: FbSdk;
    fbAsyncInit?: () => void;
  }
}

const SDK_ID = 'facebook-jssdk';

function loadFacebookSdk(appId: string, version: string): Promise<FbSdk> {
  return new Promise((resolve, reject) => {
    if (window.FB) {
      resolve(window.FB);
      return;
    }
    window.fbAsyncInit = () => {
      window.FB!.init({ appId, autoLogAppEvents: true, xfbml: false, version });
      resolve(window.FB!);
    };
    if (document.getElementById(SDK_ID)) return; // already loading
    const s = document.createElement('script');
    s.id = SDK_ID;
    s.src = 'https://connect.facebook.net/en_US/sdk.js';
    s.async = true;
    s.defer = true;
    s.crossOrigin = 'anonymous';
    s.onerror = () => reject(new Error('Could not load the Facebook SDK'));
    document.body.appendChild(s);
  });
}

export function EmbeddedSignupCard({
  hasConfig,
  isRegistered,
  onConnected,
  onAvailability,
}: {
  hasConfig: boolean;
  isRegistered: boolean;
  onConnected: () => void | Promise<void>;
  /** Called once the server says whether Embedded Signup is available. */
  onAvailability?: (enabled: boolean) => void;
}) {
  const t = useTranslations('Settings.embeddedSignup');
  const [config, setConfig] = useState<PublicConfig | null>(null);
  const [busy, setBusy] = useState(false);
  const [shownPin, setShownPin] = useState<string | null>(null);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [retryPin, setRetryPin] = useState('');
  const [retrying, setRetrying] = useState(false);

  const sessionRef = useRef<SessionInfo | null>(null);
  const codeRef = useRef<string | null>(null);
  const sentRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/whatsapp/embedded-signup')
      .then((r) => (r.ok ? r.json() : null))
      .then((c: PublicConfig | null) => {
        if (cancelled) return;
        setConfig(c);
        onAvailability?.(Boolean(c?.enabled));
      })
      .catch(() => {
        if (cancelled) return;
        setConfig(null);
        onAvailability?.(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fetch once on mount
  }, []);

  const finish = useCallback(async () => {
    const session = sessionRef.current;
    const code = codeRef.current;
    if (!session || !code || sentRef.current) return;
    sentRef.current = true;
    try {
      const res = await fetch('/api/whatsapp/embedded-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'connect',
          code,
          event: session.event,
          waba_id: session.waba_id,
          phone_number_id: session.phone_number_id,
        }),
      });
      const data = (await res.json()) as ConnectResult;
      if (!res.ok) {
        toast.error(data.error || t('connectFailed'), { duration: 10000 });
        return;
      }
      const name = data.phone_info?.verified_name || data.phone_info?.display_phone_number || '';
      if (data.registration_error) {
        setRegistrationError(data.registration_error);
        toast.warning(t('connectedNotRegistered'), { duration: 10000 });
      } else {
        setRegistrationError(null);
        toast.success(t('connectedOk', { name }));
      }
      if (data.pin) setShownPin(data.pin);
      await onConnected();
    } catch {
      toast.error(t('connectFailed'));
    } finally {
      setBusy(false);
    }
  }, [onConnected, t]);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (typeof event.origin !== 'string' || !event.origin.endsWith('facebook.com')) return;
      let data: { type?: string; event?: string; data?: Record<string, string> };
      try {
        data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
      } catch {
        return;
      }
      if (data?.type !== 'WA_EMBEDDED_SIGNUP') return;
      if (data.event === 'CANCEL' || data.event === 'ERROR') {
        setBusy(false);
        if (data.event === 'ERROR') toast.error(t('popupError'));
        return;
      }
      sessionRef.current = {
        event: data.event ?? '',
        waba_id: data.data?.waba_id,
        phone_number_id: data.data?.phone_number_id,
      };
      void finish();
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [finish, t]);

  async function launch(coexistence: boolean) {
    if (!config?.enabled || !config.appId || !config.configId) return;
    setBusy(true);
    setShownPin(null);
    sessionRef.current = null;
    codeRef.current = null;
    sentRef.current = false;
    try {
      const FB = await loadFacebookSdk(config.appId, config.graphVersion);
      const extras: Record<string, unknown> = { setup: {} };
      if (coexistence) extras.featureType = 'whatsapp_business_app_onboarding';
      FB.login(
        (response) => {
          const code = response.authResponse?.code;
          if (!code) {
            setBusy(false);
            return;
          }
          codeRef.current = code;
          void finish();
        },
        {
          config_id: config.configId,
          response_type: 'code',
          override_default_response_type: true,
          extras,
        },
      );
    } catch {
      setBusy(false);
      toast.error(t('sdkFailed'));
    }
  }

  async function retryRegister() {
    if (!/^\d{6}$/.test(retryPin)) {
      toast.error(t('pinInvalid'));
      return;
    }
    setRetrying(true);
    try {
      const res = await fetch('/api/whatsapp/embedded-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'register', pin: retryPin }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || t('registerFailed'));
        return;
      }
      setRegistrationError(null);
      setRetryPin('');
      toast.success(t('registerOk'));
      await onConnected();
    } finally {
      setRetrying(false);
    }
  }

  if (!config?.enabled) return null;

  const needsPin = Boolean(registrationError) || (hasConfig && !isRegistered);

  return (
    <Card className="border-primary/40">
      <CardHeader>
        <CardTitle className="text-foreground">{t('title')}</CardTitle>
        <CardDescription className="text-muted-foreground">
          {hasConfig ? t('descConnected') : t('desc')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <Button onClick={() => launch(false)} disabled={busy} className="h-auto py-3">
            {busy ? <Loader2 className="size-4 animate-spin" /> : <MessageCircle className="size-4" />}
            <span className="flex flex-col items-start text-left">
              <span>{t('newNumber')}</span>
              <span className="text-xs font-normal opacity-80">{t('newNumberHint')}</span>
            </span>
          </Button>
          <Button
            variant="outline"
            onClick={() => launch(true)}
            disabled={busy}
            className="h-auto py-3"
          >
            {busy ? <Loader2 className="size-4 animate-spin" /> : <Smartphone className="size-4" />}
            <span className="flex flex-col items-start text-left">
              <span>{t('appNumber')}</span>
              <span className="text-xs font-normal opacity-80">{t('appNumberHint')}</span>
            </span>
          </Button>
        </div>

        {shownPin && (
          <Alert className="border-primary/40">
            <CheckCircle2 className="size-4 text-primary" />
            <AlertTitle>{t('pinTitle')}</AlertTitle>
            <AlertDescription>
              {t('pinText')}{' '}
              <span className="font-mono text-base font-semibold text-foreground">{shownPin}</span>
            </AlertDescription>
          </Alert>
        )}

        {needsPin && (
          <div className="space-y-2 rounded-lg border border-border p-3">
            <p className="flex items-center gap-2 text-sm font-medium text-foreground">
              <KeyRound className="size-4" />
              {t('retryTitle')}
            </p>
            {registrationError && (
              <p className="text-xs text-muted-foreground">&quot;{registrationError}&quot;</p>
            )}
            <p className="text-xs text-muted-foreground">{t('retryText')}</p>
            <div className="flex gap-2">
              <Input
                inputMode="numeric"
                maxLength={6}
                value={retryPin}
                onChange={(e) => setRetryPin(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="max-w-[140px] font-mono"
              />
              <Button onClick={retryRegister} disabled={retrying} variant="secondary">
                {retrying && <Loader2 className="size-4 animate-spin" />}
                {t('retryButton')}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
