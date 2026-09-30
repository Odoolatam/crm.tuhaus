import type { Metadata } from "next";
import Link from "next/link";

import { LegalPage, List, Mail, Section } from "@/components/legal/legal-page";
import { BRAND } from "@/config/brand";
import { LEGAL } from "@/config/legal";

export const metadata: Metadata = {
  title: { absolute: `Eliminación de datos · ${BRAND.name}` },
  description: `Cómo solicitar la eliminación de tus datos en ${BRAND.name}.`,
  robots: { index: true, follow: true },
};

export default function DataDeletionPage() {
  return (
    <LegalPage
      title="Eliminación de datos"
      intro={
        <p>
          Puedes pedir que eliminemos tus datos de {BRAND.name} en cualquier momento. Esta página
          explica cómo hacerlo y qué ocurre después.
        </p>
      }
    >
      <Section title="Si tienes una cuenta en el CRM">
        <List
          items={[
            <>
              Escribe a <Mail /> desde el correo con el que te registraste, con el asunto{" "}
              &quot;Eliminación de datos&quot;.
            </>,
            "Indica si quieres eliminar solo tu usuario o toda la cuenta de tu empresa. Para eliminar la cuenta completa, la solicitud debe venir del administrador de la cuenta.",
            "Confirmaremos la recepción y podemos pedirte una verificación de identidad.",
          ]}
        />
      </Section>

      <Section title="Si conectaste WhatsApp con Facebook">
        <p>
          Además de escribirnos, puedes quitar el acceso de {BRAND.name} desde Meta: en la
          configuración de tu portafolio comercial, sección de integraciones o socios, elimina la
          app {BRAND.name}. Desde ese momento dejamos de poder enviar o recibir mensajes con tu
          número. Para borrar también los datos que ya guardamos, envía la solicitud por correo.
        </p>
      </Section>

      <Section title="Si eres contacto de una empresa que usa el CRM">
        <p>
          Tus conversaciones pertenecen a la empresa con la que hablaste por WhatsApp. Pídele a esa
          empresa que elimine tus datos. Si nos escribes a <Mail />, trasladaremos tu solicitud.
        </p>
      </Section>

      <Section title="Qué eliminamos y en qué plazo">
        <List
          items={[
            "Datos de usuario y de cuenta, conversaciones, contactos, archivos y tokens de conexión con WhatsApp.",
            "Plazo: dentro de 30 días desde que confirmamos la solicitud.",
            "Solo conservamos lo que la ley nos obligue a guardar, como registros tributarios de facturación.",
            "Las copias de respaldo se eliminan en su ciclo normal de rotación.",
          ]}
        />
        <p>
          Los mensajes ya entregados en WhatsApp siguen en los teléfonos de quienes los recibieron;
          no podemos borrarlos de ahí.
        </p>
      </Section>

      <Section title="Contacto">
        <p>
          {LEGAL.companyName}, RUT {LEGAL.rut}. Correo <Mail />, teléfono {LEGAL.phone}. Más
          información en nuestra{" "}
          <Link href="/privacidad" className="underline underline-offset-2">
            política de privacidad
          </Link>
          .
        </p>
      </Section>
    </LegalPage>
  );
}
