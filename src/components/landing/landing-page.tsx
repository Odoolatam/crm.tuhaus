import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Check,
  ChevronDown,
  Clock,
  Inbox,
  KanbanSquare,
  Megaphone,
  MessageCircle,
  Shuffle,
  TrendingDown,
  Users,
  Workflow,
  type LucideIcon,
} from "lucide-react";

import { BrandLogo } from "@/components/brand/brand-logo";
import { BRAND } from "@/config/brand";
import { LANDING, whatsappLink } from "@/config/landing";

/**
 * Public landing for crm.tuhaus.com ("/"). Signed-in users never see
 * it: the middleware sends them straight to /dashboard.
 *
 * Always rendered in light colors regardless of the user's saved
 * mode, so the brand looks the same for every visitor. Copy lives in
 * src/config/landing.ts.
 */

const INK = BRAND.colors.ink;
const ORANGE = BRAND.colors.orange;
// Orange dark enough for small text on white (5.6:1)
const ORANGE_TEXT = "#9a5a14";

const FEATURE_ICONS: Record<string, LucideIcon> = {
  inbox: Inbox,
  pipeline: KanbanSquare,
  contacts: Users,
  broadcast: Megaphone,
  automation: Workflow,
  ai: Bot,
};

const PROBLEM_ICONS: LucideIcon[] = [Clock, Shuffle, TrendingDown];

function PrimaryButton({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl px-6 text-[15px] font-semibold shadow-sm transition hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-2 ${className}`}
      style={{ background: ORANGE, color: INK, outlineColor: ORANGE }}
    >
      {children}
    </Link>
  );
}

function SecondaryButton({
  href,
  children,
  external,
  dark,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  dark?: boolean;
}) {
  const cls = dark
    ? "border-white/25 text-white hover:bg-white/10"
    : "border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-50";
  const props = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
  return (
    <a
      href={href}
      {...props}
      className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl border px-6 text-[15px] font-semibold transition ${cls}`}
    >
      {children}
    </a>
  );
}

function SectionTitle({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      {eyebrow && (
        <p
          className="mb-3 text-sm font-semibold uppercase tracking-wider"
          style={{ color: ORANGE_TEXT }}
        >
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg leading-relaxed text-neutral-600">{subtitle}</p>
      )}
    </div>
  );
}

/* ---------- Product mockup (pure markup, no screenshots) ---------- */

function ProductMock() {
  const chats = [
    { name: "María González", msg: "¿Tienen disponibilidad para el sábado?", time: "09:41", unread: 2, active: true },
    { name: "Carlos Rojas", msg: "Perfecto, quedo atento a la cotización", time: "09:12" },
    { name: "Hotel Andino", msg: "Gracias por la información", time: "Ayer" },
    { name: "Lucía Paredes", msg: "¿Cuál es el precio para 4 personas?", time: "Ayer", unread: 1 },
  ];
  return (
    <div className="relative mx-auto w-full max-w-5xl">
      <div
        aria-hidden
        className="absolute -inset-x-10 -top-10 bottom-0 -z-10 rounded-[3rem] opacity-30 blur-3xl"
        style={{ background: `radial-gradient(60% 60% at 50% 30%, ${ORANGE}, transparent)` }}
      />
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl shadow-neutral-900/10">
        {/* window bar */}
        <div className="flex items-center gap-2 border-b border-neutral-200 bg-neutral-50 px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-neutral-300" />
          <span className="h-3 w-3 rounded-full bg-neutral-300" />
          <span className="h-3 w-3 rounded-full bg-neutral-300" />
          <span className="ml-3 rounded-md bg-white px-3 py-1 text-xs text-neutral-500 ring-1 ring-neutral-200">
            crm.tuhaus.com/inbox
          </span>
        </div>
        <div className="grid min-h-[340px] grid-cols-1 sm:grid-cols-[220px_1fr] md:grid-cols-[64px_260px_1fr]">
          {/* rail */}
          <div className="hidden flex-col items-center gap-4 border-r border-neutral-200 py-4 md:flex" style={{ background: "#faf9f7" }}>
            <BrandLogo variant="mark" tone="light" height={28} />
            {[Inbox, Users, KanbanSquare, Megaphone, Workflow].map((I, i) => (
              <span
                key={i}
                className="flex h-9 w-9 items-center justify-center rounded-lg"
                style={i === 0 ? { background: "rgb(234 166 84 / 0.18)", color: ORANGE_TEXT } : { color: "#8a8a8a" }}
              >
                <I className="h-4 w-4" />
              </span>
            ))}
          </div>
          {/* chat list */}
          <div className="hidden border-r border-neutral-200 sm:block">
            <div className="border-b border-neutral-200 px-4 py-3 text-sm font-semibold text-neutral-900">
              Conversaciones
            </div>
            {chats.map((c) => (
              <div
                key={c.name}
                className="flex items-start gap-3 border-b border-neutral-100 px-4 py-3"
                style={c.active ? { background: "rgb(234 166 84 / 0.1)" } : undefined}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-xs font-semibold text-neutral-700">
                  {c.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium text-neutral-900">{c.name}</span>
                    <span className="shrink-0 text-[11px] text-neutral-400">{c.time}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-xs text-neutral-500">{c.msg}</span>
                    {c.unread && (
                      <span
                        className="flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold"
                        style={{ background: ORANGE, color: INK }}
                      >
                        {c.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* thread */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-3">
              <div>
                <div className="text-sm font-semibold text-neutral-900">María González</div>
                <div className="text-xs text-neutral-500">Etapa: Cotización enviada</div>
              </div>
              <span
                className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                style={{ background: "rgb(234 166 84 / 0.18)", color: ORANGE_TEXT }}
              >
                Asignada a ti
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-3 px-5 py-5" style={{ background: "#fbfaf8" }}>
              <div className="max-w-[80%] self-start rounded-2xl rounded-tl-sm bg-white px-4 py-2.5 text-sm text-neutral-800 shadow-sm ring-1 ring-neutral-200">
                Hola, ¿tienen disponibilidad para el sábado? Somos 4 personas.
              </div>
              <div
                className="max-w-[80%] self-end rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm shadow-sm"
                style={{ background: "#fdf1e2", color: INK }}
              >
                ¡Hola María! Sí, tenemos disponibilidad. Te envío las opciones y precios.
              </div>
              <div className="flex max-w-[80%] items-center gap-2 self-end rounded-xl border border-dashed px-3 py-2 text-xs"
                style={{ borderColor: ORANGE, color: ORANGE_TEXT }}>
                <Bot className="h-3.5 w-3.5" /> Respuesta sugerida por IA
              </div>
            </div>
            <div className="border-t border-neutral-200 px-5 py-3">
              <div className="rounded-lg bg-neutral-100 px-3 py-2 text-xs text-neutral-400">
                Escribe un mensaje...
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PipelineMock() {
  const cols = [
    { name: "Nuevo", cards: ["Lucía Paredes", "Tomás Vera"] },
    { name: "Contactado", cards: ["Carlos Rojas"] },
    { name: "Cotización", cards: ["María González", "Hotel Andino"] },
    { name: "Ganado", cards: ["Viña del Valle"] },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-xl shadow-neutral-900/5 sm:grid-cols-4">
      {cols.map((c, i) => (
        <div key={c.name} className="rounded-xl bg-neutral-50 p-2.5">
          <div className="mb-2 flex items-center gap-2 px-1 text-xs font-semibold text-neutral-700">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: i === cols.length - 1 ? "#16a34a" : ORANGE }}
            />
            {c.name}
          </div>
          <div className="flex flex-col gap-2">
            {c.cards.map((n) => (
              <div key={n} className="rounded-lg bg-white px-2.5 py-2 text-xs text-neutral-800 shadow-sm ring-1 ring-neutral-200">
                {n}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------- Page ------------------------------- */

export function LandingPage() {
  const L = LANDING;
  const salesLink = whatsappLink("Hola, quiero saber más sobre Tuhaus CRM.");
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-white text-neutral-900" style={{ colorScheme: "light" }}>
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-neutral-200/70 bg-white/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" aria-label={BRAND.name} className="flex items-center gap-2">
            <BrandLogo tone="light" height={30} />
            <span
              className="hidden rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider min-[400px]:inline"
              style={{ background: "rgb(234 166 84 / 0.18)", color: ORANGE_TEXT }}
            >
              CRM
            </span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium text-neutral-600 md:flex">
            <a href="#funciones" className="hover:text-neutral-900">Funciones</a>
            <a href="#como-funciona" className="hover:text-neutral-900">Cómo funciona</a>
            <a href="#precios" className="hover:text-neutral-900">Precios</a>
            <a href="#preguntas" className="hover:text-neutral-900">Preguntas</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="inline-flex h-10 items-center rounded-lg px-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-100 sm:px-4"
            >
              <span className="sm:hidden">Entrar</span>
              <span className="hidden sm:inline">Iniciar sesión</span>
            </Link>
            <Link
              href="/signup"
              className="inline-flex h-10 items-center rounded-lg px-4 text-sm font-semibold"
              style={{ background: ORANGE, color: INK }}
            >
              Probar gratis
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="overflow-hidden px-4 pb-20 pt-16 sm:px-6 sm:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <p
            className="mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium"
            style={{ borderColor: "rgb(234 166 84 / 0.5)", color: ORANGE_TEXT, background: "rgb(234 166 84 / 0.08)" }}
          >
            <MessageCircle className="h-4 w-4" />
            {L.hero.eyebrow}
          </p>
          <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-neutral-900 sm:text-6xl">
            {L.hero.title}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-neutral-600 sm:text-xl">
            {L.hero.subtitle}
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <PrimaryButton href="/signup">
              {L.hero.primaryCta} <ArrowRight className="h-4 w-4" />
            </PrimaryButton>
            <SecondaryButton href={salesLink} external>
              <MessageCircle className="h-4 w-4" /> {L.hero.secondaryCta}
            </SecondaryButton>
          </div>
          <p className="mt-4 text-sm text-neutral-500">{L.hero.note}</p>
        </div>
        <div className="mt-16">
          <ProductMock />
        </div>
      </section>

      {/* Problems */}
      <section className="bg-neutral-50 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <SectionTitle title={L.problems.title} />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {L.problems.items.map((p, i) => {
              const Icon = PROBLEM_ICONS[i] ?? Clock;
              return (
                <div key={p.title} className="rounded-2xl border border-neutral-200 bg-white p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-neutral-900">{p.title}</h3>
                  <p className="mt-2 leading-relaxed text-neutral-600">{p.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="funciones" className="scroll-mt-20 px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <SectionTitle eyebrow="Funciones" title={L.features.title} subtitle={L.features.subtitle} />
          <div className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {L.features.items.map((f) => {
              const Icon = FEATURE_ICONS[f.icon] ?? Inbox;
              return (
                <div key={f.title}>
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-xl"
                    style={{ background: "rgb(234 166 84 / 0.16)", color: ORANGE_TEXT }}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-neutral-900">{f.title}</h3>
                  <p className="mt-2 leading-relaxed text-neutral-600">{f.text}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-16">
            <PipelineMock />
          </div>
        </div>
      </section>

      {/* Steps */}
      <section
        id="como-funciona"
        className="scroll-mt-20 px-4 py-24 text-white sm:px-6"
        style={{ background: INK }}
      >
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider" style={{ color: ORANGE }}>
              Paso a paso
            </p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{L.steps.title}</h2>
          </div>
          <ol className="mt-14 grid gap-6 md:grid-cols-4">
            {L.steps.items.map((s, i) => (
              <li key={s.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold"
                  style={{ background: ORANGE, color: INK }}
                >
                  {i + 1}
                </span>
                <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-white/70">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Control */}
      <section className="px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <SectionTitle title={L.control.title} />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {L.control.items.map((c) => (
              <div key={c.title} className="rounded-2xl border border-neutral-200 p-6">
                <Check className="h-5 w-5" style={{ color: ORANGE_TEXT }} />
                <h3 className="mt-4 text-lg font-semibold text-neutral-900">{c.title}</h3>
                <p className="mt-2 leading-relaxed text-neutral-600">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="precios" className="scroll-mt-20 bg-neutral-50 px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <SectionTitle eyebrow="Precios" title={L.pricing.title} subtitle={L.pricing.subtitle} />
          <div className="mt-14 grid gap-6 md:grid-cols-[1.25fr_1fr]">
            {/* Plan */}
            <div
              className="relative rounded-3xl border-2 bg-white p-8 shadow-xl shadow-neutral-900/5"
              style={{ borderColor: ORANGE }}
            >
              <span
                className="absolute -top-3 left-8 rounded-full px-3 py-1 text-xs font-semibold"
                style={{ background: ORANGE, color: INK }}
              >
                {L.trialDays} días gratis
              </span>
              <h3 className="text-lg font-semibold text-neutral-900">{L.pricing.plan.name}</h3>
              <p className="mt-4 flex items-baseline gap-2">
                <span className="text-5xl font-semibold tracking-tight text-neutral-900">
                  {L.pricing.plan.price}
                </span>
                <span className="text-neutral-500">{L.pricing.plan.period}</span>
              </p>
              <ul className="mt-8 space-y-3">
                {L.pricing.plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-neutral-700">
                    <Check className="mt-0.5 h-5 w-5 shrink-0" style={{ color: ORANGE_TEXT }} />
                    {f}
                  </li>
                ))}
              </ul>
              <PrimaryButton href="/signup" className="mt-8 w-full">
                {L.pricing.plan.cta} <ArrowRight className="h-4 w-4" />
              </PrimaryButton>
            </div>
            {/* Add-on */}
            <div className="flex flex-col rounded-3xl border border-neutral-200 bg-white p-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Opcional</p>
              <h3 className="mt-2 text-lg font-semibold text-neutral-900">{L.pricing.addon.name}</h3>
              <p className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl font-semibold tracking-tight text-neutral-900">
                  {L.pricing.addon.price}
                </span>
                <span className="text-neutral-500">{L.pricing.addon.period}</span>
              </p>
              <p className="mt-6 flex-1 leading-relaxed text-neutral-600">{L.pricing.addon.text}</p>
              <div className="mt-8 [&>a]:w-full">
                <SecondaryButton href={whatsappLink(L.pricing.addon.whatsappText)} external>
                  <MessageCircle className="h-4 w-4" /> {L.pricing.addon.cta}
                </SecondaryButton>
              </div>
            </div>
          </div>
          <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-neutral-500">
            {L.pricing.footnote}
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="preguntas" className="scroll-mt-20 px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <SectionTitle title={L.faq.title} />
          <div className="mt-12 divide-y divide-neutral-200 border-y border-neutral-200">
            {L.faq.items.map((item) => (
              <details key={item.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-semibold text-neutral-900">
                  {item.q}
                  <ChevronDown className="h-5 w-5 shrink-0 text-neutral-400 transition group-open:rotate-180" />
                </summary>
                <p className="mt-3 leading-relaxed text-neutral-600">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 pb-24 sm:px-6">
        <div
          className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl px-6 py-16 text-center text-white sm:px-12"
          style={{ background: INK }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full opacity-30 blur-3xl"
            style={{ background: ORANGE }}
          />
          <h2 className="relative text-3xl font-semibold tracking-tight sm:text-4xl">{L.finalCta.title}</h2>
          <p className="relative mt-4 text-lg text-white/70">{L.finalCta.subtitle}</p>
          <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <PrimaryButton href="/signup">
              {L.hero.primaryCta} <ArrowRight className="h-4 w-4" />
            </PrimaryButton>
            <SecondaryButton href={salesLink} external dark>
              <MessageCircle className="h-4 w-4" /> {L.hero.secondaryCta}
            </SecondaryButton>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 px-4 py-10 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <BrandLogo tone="light" height={26} />
            <p className="text-sm text-neutral-500">
              © {year} {BRAND.shortName}. {BRAND.description}
            </p>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-neutral-600">
            <Link href="/login" className="hover:text-neutral-900">Iniciar sesión</Link>
            <Link href="/signup" className="hover:text-neutral-900">Crear cuenta</Link>
            <a href={salesLink} target="_blank" rel="noopener noreferrer" className="hover:text-neutral-900">
              WhatsApp
            </a>
            <a href="https://tuhaus.com" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-900">
              tuhaus.com
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
