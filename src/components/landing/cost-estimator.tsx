"use client";

import { useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";

import { BRAND } from "@/config/brand";

const ORANGE = BRAND.colors.orange;
// Orange dark enough for small text on white (5.6:1), matches landing-page.tsx
const ORANGE_TEXT = "#9a5a14";

/**
 * Reference rates only, not billed by Tuhaus.
 *
 * Meta: WhatsApp Business Platform rate card for Chile, per delivered
 * message, effective July 2026. Meta updates rates up to once a
 * quarter; confirm current values in Meta Business Suite before
 * quoting a client.
 *
 * IA: OpenAI GPT-4o mini token pricing, used only as a low-cost
 * reference. The client connects their own AI provider and account,
 * so the real cost depends on the model and provider they choose.
 */
const META_CHILE_MARKETING_RATE = 0.0889;
const META_CHILE_UTILITY_AUTH_RATE = 0.02;
const AI_REF_INPUT_TOKENS = 500;
const AI_REF_OUTPUT_TOKENS = 200;
const AI_REF_INPUT_RATE = 0.15 / 1_000_000;
const AI_REF_OUTPUT_RATE = 0.6 / 1_000_000;
const AI_REF_COST_PER_MESSAGE =
  AI_REF_INPUT_TOKENS * AI_REF_INPUT_RATE + AI_REF_OUTPUT_TOKENS * AI_REF_OUTPUT_RATE;

const CRM_FIXED_COST = 39;

function usd(n: number) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function NumberField({
  id,
  label,
  hint,
  value,
  onChange,
}: {
  id: string;
  label: string;
  hint: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-neutral-800">
        {label}
      </label>
      <input
        id={id}
        type="number"
        min={0}
        step={10}
        value={value}
        onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
        className="mt-2 w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-neutral-900 outline-none focus-visible:border-transparent focus-visible:ring-2"
        style={{ ["--tw-ring-color" as string]: ORANGE }}
      />
      <p className="mt-1.5 text-xs text-neutral-500">{hint}</p>
    </div>
  );
}

function CostRow({
  label,
  detail,
  value,
  strong,
}: {
  label: string;
  detail?: string;
  value: number;
  strong?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div>
        <p className={strong ? "font-semibold text-neutral-900" : "text-neutral-700"}>{label}</p>
        {detail && <p className="mt-0.5 text-xs text-neutral-500">{detail}</p>}
      </div>
      <p
        className={
          strong
            ? "shrink-0 text-lg font-semibold tabular-nums text-neutral-900"
            : "shrink-0 tabular-nums text-neutral-700"
        }
      >
        {usd(value)}
      </p>
    </div>
  );
}

export function CostEstimator() {
  const [marketing, setMarketing] = useState(0);
  const [utilityAuth, setUtilityAuth] = useState(300);
  const [aiMessages, setAiMessages] = useState(500);

  const metaCost = useMemo(
    () => marketing * META_CHILE_MARKETING_RATE + utilityAuth * META_CHILE_UTILITY_AUTH_RATE,
    [marketing, utilityAuth],
  );
  const aiCost = useMemo(() => aiMessages * AI_REF_COST_PER_MESSAGE, [aiMessages]);
  const total = CRM_FIXED_COST + metaCost + aiCost;

  return (
    <section id="transparencia" className="scroll-mt-20 px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider" style={{ color: ORANGE_TEXT }}>
            Estimador de costos
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
            Transparencia total
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-neutral-600">
            Ajusta tus volúmenes mensuales y mira de qué se compone tu costo. Son valores de
            referencia, no un cobro de Tuhaus.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          {/* Inputs */}
          <div className="rounded-3xl border border-neutral-200 bg-white p-8">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
              Tus volúmenes mensuales
            </h3>
            <div className="mt-6 space-y-6">
              <NumberField
                id="marketing-messages"
                label="Mensajes de marketing"
                hint="Plantillas promocionales o de reactivación."
                value={marketing}
                onChange={setMarketing}
              />
              <NumberField
                id="utility-auth-messages"
                label="Mensajes de utilidad y autenticación"
                hint="Confirmaciones, recordatorios y códigos fuera de la ventana de 24 horas."
                value={utilityAuth}
                onChange={setUtilityAuth}
              />
              <NumberField
                id="ai-messages"
                label="Respuestas de IA"
                hint="Mensajes que responde tu asistente de IA."
                value={aiMessages}
                onChange={setAiMessages}
              />
            </div>
          </div>

          {/* Breakdown */}
          <div className="rounded-3xl border-2 bg-white p-8" style={{ borderColor: ORANGE }}>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
              Tu costo estimado
            </h3>
            <div className="mt-4 divide-y divide-neutral-100">
              <CostRow label="Tuhaus CRM" detail="Costo fijo del plan" value={CRM_FIXED_COST} />
              <CostRow
                label="Meta WhatsApp"
                detail="Tarifas para Chile, cobradas por Meta directo a tu cuenta"
                value={metaCost}
              />
              <CostRow
                label="IA"
                detail="Referencia con OpenAI GPT-4o mini, con tu propia clave"
                value={aiCost}
              />
            </div>
            <div className="mt-2 flex items-baseline justify-between border-t-2 pt-4" style={{ borderColor: ORANGE }}>
              <p className="text-lg font-semibold text-neutral-900">Total estimado</p>
              <p className="text-3xl font-semibold tabular-nums text-neutral-900">
                {usd(total)}
                <span className="ml-1 text-base font-normal text-neutral-500">/mes</span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-500" />
          <div className="text-sm leading-relaxed text-amber-900">
            <p className="font-semibold">Antes de tomar esto como una cotización</p>
            <ul className="mt-1.5 list-disc space-y-1 pl-4">
              <li>
                Las tarifas de Meta son las publicadas para Chile, vigentes desde julio de 2026.
                Meta las actualiza hasta cuatro veces al año; confirma el valor actual en tu
                Meta Business Suite antes de comprometerte con un cliente.
              </li>
              <li>
                El costo de IA es una referencia con OpenAI GPT-4o mini. Tú conectas tu propio
                proveedor de IA, así que el costo real depende del modelo y la cuenta que uses.
              </li>
              <li>Este estimador no genera una factura ni un cobro. Es solo una guía.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
