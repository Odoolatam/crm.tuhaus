-- ============================================================
-- 900_tuhaus_billing.sql
--
-- Tuhaus CRM: estado de suscripción por cuenta (prueba de 14 días).
--
-- Numerada en 900 para no chocar con las migraciones futuras del
-- proyecto original (wacrm). Idempotente: se puede ejecutar más de
-- una vez sin romper nada.
--
-- Estados:
--   trial      -> en prueba hasta trial_ends_at
--   active     -> pagando. paid_until NULL = sin vencimiento
--   suspended  -> bloqueada a mano
--
-- Los miembros de la cuenta solo pueden LEER su fila. Nadie puede
-- escribirla desde la app: se cambia en el panel de Supabase (Table
-- Editor) o, más adelante, desde el webhook de pagos con service_role.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.account_billing (
  account_id     UUID PRIMARY KEY REFERENCES public.accounts(id) ON DELETE CASCADE,
  status         TEXT NOT NULL DEFAULT 'trial'
                   CHECK (status IN ('trial', 'active', 'suspended')),
  trial_ends_at  TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '14 days'),
  paid_until     TIMESTAMPTZ,
  notes          TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.account_billing ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS account_billing_select ON public.account_billing;
CREATE POLICY account_billing_select ON public.account_billing
  FOR SELECT USING (public.is_account_member(account_id, 'viewer'));
-- Sin políticas de INSERT/UPDATE/DELETE: solo service_role (y el
-- panel de Supabase) pueden escribir.

-- updated_at automático
CREATE OR REPLACE FUNCTION public.account_billing_touch()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS account_billing_touch ON public.account_billing;
CREATE TRIGGER account_billing_touch
  BEFORE UPDATE ON public.account_billing
  FOR EACH ROW EXECUTE FUNCTION public.account_billing_touch();

-- Cada cuenta nueva parte en prueba de 14 días
CREATE OR REPLACE FUNCTION public.create_account_billing()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.account_billing (account_id)
  VALUES (NEW.id)
  ON CONFLICT (account_id) DO NOTHING;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Nunca bloquear el registro de un usuario por esto
  RAISE WARNING 'create_account_billing failed for account %: %', NEW.id, SQLERRM;
  RETURN NEW;
END $$;

ALTER FUNCTION public.create_account_billing() OWNER TO postgres;

DROP TRIGGER IF EXISTS on_account_created_billing ON public.accounts;
CREATE TRIGGER on_account_created_billing
  AFTER INSERT ON public.accounts
  FOR EACH ROW EXECUTE FUNCTION public.create_account_billing();

-- Cuentas que ya existían: quedan activas y sin vencimiento
INSERT INTO public.account_billing (account_id, status, notes)
SELECT a.id, 'active', 'Cuenta existente antes de la prueba de 14 días'
FROM public.accounts a
ON CONFLICT (account_id) DO NOTHING;
