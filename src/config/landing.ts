/**
 * Tuhaus CRM landing page content.
 *
 * All copy, prices and contact data for the public landing at "/"
 * live here, so they can be edited without touching the layout in
 * `src/components/landing/landing-page.tsx`.
 */

/** Sales WhatsApp number, digits only with country code (e.g. "56912345678"). */
export const SALES_WHATSAPP = "56976094103";

export const whatsappLink = (text: string) =>
  `https://wa.me/${SALES_WHATSAPP}?text=${encodeURIComponent(text)}`;

export const LANDING = {
  trialDays: 14,

  hero: {
    eyebrow: "CRM para WhatsApp Business",
    title: "Vende más por WhatsApp sin contratar más personal",
    subtitle:
      "Las conversaciones de todo tu equipo, tus contactos y tu embudo de ventas en un solo lugar, conectado a la API oficial de WhatsApp.",
    primaryCta: "Probar 14 días gratis",
    secondaryCta: "Hablar con ventas",
    note: "Sin tarjeta de crédito. Creas tu cuenta en 1 minuto.",
  },

  problems: {
    title: "¿Te suena alguno de estos problemas?",
    items: [
      {
        title: "Mensajes sin respuesta",
        text: "Los clientes escriben de noche o el fin de semana y, cuando alguien responde, ya compraron en otro lado.",
      },
      {
        title: "Conversaciones repartidas",
        text: "Cada vendedor atiende desde su propio teléfono. Nadie sabe qué se le dijo a quién ni quién tiene que hacer el seguimiento.",
      },
      {
        title: "Ventas sin seguimiento",
        text: "No hay forma de saber en qué etapa está cada cliente, así que las oportunidades se enfrían y se pierden.",
      },
    ],
  },

  features: {
    title: "Todo tu proceso comercial en un solo sistema",
    subtitle:
      "Tuhaus CRM ordena lo que hoy pasa desordenado en WhatsApp, para que tu equipo responda rápido y no pierda ninguna venta.",
    items: [
      {
        icon: "inbox",
        title: "Bandeja compartida",
        text: "Todo tu equipo atiende el mismo número de WhatsApp desde el computador. Asigna conversaciones y ve quién está respondiendo.",
      },
      {
        icon: "pipeline",
        title: "Embudo de ventas",
        text: "Mueve cada oportunidad por etapas en un tablero visual y sabe siempre cuánto tienes en juego.",
      },
      {
        icon: "contacts",
        title: "Contactos ordenados",
        text: "Cada cliente con su historial, etiquetas y notas. Se crean solos cuando alguien te escribe.",
      },
      {
        icon: "broadcast",
        title: "Difusiones",
        text: "Envía campañas y recordatorios a listas de contactos con plantillas aprobadas por Meta.",
      },
      {
        icon: "automation",
        title: "Automatizaciones",
        text: "Respuestas fuera de horario, menús de bienvenida y seguimientos automáticos, sin programar.",
      },
      {
        icon: "ai",
        title: "Respuestas con IA",
        text: "La IA redacta respuestas y atiende preguntas frecuentes usando la información de tu negocio.",
      },
    ],
  },

  steps: {
    title: "Cómo funciona",
    items: [
      {
        title: "Crea tu cuenta",
        text: "Te registras con tu correo y entras al CRM en un minuto.",
      },
      {
        title: "Conecta tu WhatsApp",
        text: "Vinculas tu número de WhatsApp Business por la API oficial de Meta. Si prefieres, lo hacemos contigo.",
      },
      {
        title: "Invita a tu equipo",
        text: "Suma a tus vendedores con el rol que corresponda: administrador, agente u observador.",
      },
      {
        title: "Responde y vende",
        text: "Atiende, clasifica y haz seguimiento a cada cliente desde un solo lugar.",
      },
    ],
  },

  control: {
    title: "Tú mantienes el control",
    items: [
      {
        title: "Tu cuenta de Meta",
        text: "El número y la cuenta de WhatsApp Business son tuyos. Meta te cobra los mensajes directamente, sin recargos nuestros.",
      },
      {
        title: "Tu propia IA",
        text: "Conectas tu clave de OpenAI o Anthropic y pagas solo lo que usas, sin cobros por usuario.",
      },
      {
        title: "Tus datos",
        text: "Cada cuenta está separada del resto. Solo tu equipo ve tus conversaciones y contactos.",
      },
    ],
  },

  pricing: {
    title: "Un precio simple",
    subtitle: "Prueba todo el CRM gratis por 14 días. Después eliges si continúas.",
    plan: {
      name: "Tuhaus CRM",
      price: "USD 39",
      period: "al mes",
      features: [
        "Bandeja compartida de WhatsApp",
        "Embudo de ventas y contactos",
        "Difusiones con plantillas de Meta",
        "Automatizaciones y flujos",
        "Respuestas con IA (con tu propia clave)",
        "Hasta 3 usuarios, con roles y permisos",
      ],
      cta: "Probar 14 días gratis",
    },
    addon: {
      name: "Conexión asistida",
      price: "USD 150",
      period: "pago único",
      text: "Te acompañamos a crear o verificar tu cuenta de Meta, conectar tu número y dejar el CRM listo para usar.",
      cta: "Solicitar conexión asistida",
      whatsappText:
        "Hola, me interesa la conexión asistida de Tuhaus CRM para conectar mi WhatsApp.",
    },
    footnote:
      "Los mensajes de WhatsApp los cobra Meta directamente a tu cuenta, según sus tarifas por país y tipo de mensaje.",
  },

  faq: {
    title: "Preguntas frecuentes",
    items: [
      {
        q: "¿Qué necesito para conectar WhatsApp?",
        a: "Una cuenta de Meta Business y un número para WhatsApp Business. Tuhaus CRM se conecta por la API oficial de Meta, así que tu número no corre riesgo de bloqueo por usar herramientas no autorizadas.",
      },
      {
        q: "¿Puedo usar mi número actual?",
        a: "Depende de cómo lo uses hoy. Si ya está en la aplicación de WhatsApp, puede requerir pasos adicionales en Meta. Lo revisamos contigo antes de conectarlo.",
      },
      {
        q: "¿Cuánto cuesta cada mensaje?",
        a: "Meta cobra según el país y el tipo de mensaje (marketing, utilidad o autenticación). Ese cobro va directo a tu cuenta de Meta; nosotros no le agregamos recargo.",
      },
      {
        q: "¿Cuánto tarda en estar funcionando?",
        a: "La cuenta del CRM está lista al instante. La conexión con WhatsApp depende de la verificación de Meta, que puede tardar desde algunas horas hasta varios días.",
      },
      {
        q: "¿Qué pasa cuando termina la prueba gratis?",
        a: "Te avisamos antes de que termine para que decidas si continúas con el plan mensual. No necesitas tarjeta para probar.",
      },
      {
        q: "¿Cuántas personas de mi equipo pueden usarlo?",
        a: "El plan incluye hasta 3 usuarios. Cada persona tiene su propio acceso y un rol: administrador, agente u observador.",
      },
    ],
  },

  finalCta: {
    title: "Empieza a vender más por WhatsApp hoy",
    subtitle: "14 días gratis, sin tarjeta de crédito.",
  },
} as const;
