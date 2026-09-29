import type { Metadata } from "next";
import Link from "next/link";

import { CompanyBlock, LegalPage, List, Mail, Section } from "@/components/legal/legal-page";
import { BRAND } from "@/config/brand";
import { LEGAL } from "@/config/legal";

export const metadata: Metadata = {
  title: { absolute: `Términos de servicio · ${BRAND.name}` },
  description: `Condiciones de uso de ${BRAND.name}.`,
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Términos de servicio"
      intro={
        <p>
          Estos términos regulan el uso de {BRAND.name}, un servicio de {LEGAL.companyName}. Al
          crear una cuenta o usar el servicio aceptas estos términos en nombre propio y de la
          empresa que representas.
        </p>
      }
    >
      <Section title="1. Quiénes somos">
        <CompanyBlock />
      </Section>

      <Section title="2. El servicio">
        <p>
          {BRAND.name} es un software en la nube para gestionar conversaciones de WhatsApp,
          contactos, embudos de venta, difusiones y automatizaciones. Funciona sobre la API oficial
          de WhatsApp Business de Meta. Lo ofrecemos a empresas en {LEGAL.countries.join(", ")}.
        </p>
      </Section>

      <Section title="3. Cuenta">
        <List
          items={[
            "Debes entregar datos verdaderos y mantenerlos actualizados.",
            "Eres responsable de la seguridad de tus credenciales y de lo que hagan los usuarios que invites a tu cuenta.",
            "El servicio es para uso empresarial y para mayores de 18 años.",
          ]}
        />
      </Section>

      <Section title="4. Prueba gratuita">
        <p>
          Las cuentas nuevas tienen una prueba gratuita de 14 días. Al terminar, el acceso al CRM
          se bloquea hasta activar un plan pagado. Los datos se conservan durante un tiempo
          razonable para que puedas continuar, salvo que pidas su eliminación.
        </p>
      </Section>

      <Section title="5. Planes y pagos">
        <List
          items={[
            <>
              Los precios vigentes están publicados en{" "}
              <Link href="/" className="underline underline-offset-2">
                nuestra página de inicio
              </Link>{" "}
              o en la cotización que te enviemos.
            </>,
            "La suscripción se paga por adelantado. Si un pago no se realiza, podemos suspender el acceso hasta regularizarlo.",
            "Los cargos de Meta por conversaciones o mensajes de WhatsApp no están incluidos en nuestro precio. Meta los cobra directamente al medio de pago registrado en tu cuenta de WhatsApp Business.",
            "Podemos cambiar los precios avisando con al menos 30 días de anticipación.",
          ]}
        />
      </Section>

      <Section title="6. Uso de WhatsApp">
        <p>Al usar {BRAND.name} con WhatsApp te comprometes a:</p>
        <List
          items={[
            "Cumplir las Condiciones de WhatsApp Business, la Política de WhatsApp Business y la Política comercial de WhatsApp.",
            "Contar con el consentimiento de las personas a quienes escribes y respetar sus solicitudes de no recibir más mensajes.",
            "No enviar spam, contenido ilegal, engañoso u ofensivo.",
          ]}
        />
        <p>
          Meta puede limitar, suspender o bloquear números o cuentas por incumplir sus políticas.
          Esas decisiones son de Meta y no dependen de {LEGAL.companyName}.
        </p>
      </Section>

      <Section title="7. Tus datos">
        <p>
          Los datos que cargas y las conversaciones con tus clientes son tuyos. Los tratamos según
          nuestra{" "}
          <Link href="/privacidad" className="underline underline-offset-2">
            política de privacidad
          </Link>{" "}
          y solo para prestarte el servicio. Eres responsable de tener la base legal para tratar los
          datos de tus contactos.
        </p>
      </Section>

      <Section title="8. Uso aceptable">
        <List
          items={[
            "No intentar acceder a cuentas o datos de otros clientes.",
            "No interferir con la seguridad o el funcionamiento del servicio.",
            "No revender el servicio sin un acuerdo por escrito con nosotros.",
          ]}
        />
      </Section>

      <Section title="9. Disponibilidad">
        <p>
          Trabajamos para que el servicio esté disponible de forma continua, pero puede haber
          interrupciones por mantenimiento, fallas o causas externas, incluidas las de Meta y otros
          proveedores. No garantizamos un nivel de disponibilidad específico salvo acuerdo por
          escrito.
        </p>
      </Section>

      <Section title="10. Responsabilidad">
        <p>
          En la medida que la ley lo permita, {LEGAL.companyName} no responde por daños indirectos,
          lucro cesante o pérdida de datos causada por terceros. Nuestra responsabilidad total
          frente a un cliente se limita al monto pagado por ese cliente en los 3 meses anteriores al
          hecho que la origina.
        </p>
      </Section>

      <Section title="11. Término">
        <p>
          Puedes dejar de usar el servicio en cualquier momento avisando a <Mail />. Podemos
          suspender o terminar una cuenta por falta de pago o por incumplir estos términos o las
          políticas de Meta. Al terminar, puedes pedir la eliminación de tus datos según nuestra
          página de{" "}
          <Link href="/eliminacion-datos" className="underline underline-offset-2">
            eliminación de datos
          </Link>
          .
        </p>
      </Section>

      <Section title="12. Cambios">
        <p>
          Podemos modificar estos términos. Publicaremos la nueva versión en esta página y, si el
          cambio es relevante, avisaremos a los administradores de cada cuenta. Seguir usando el
          servicio implica aceptar la nueva versión.
        </p>
      </Section>

      <Section title="13. Ley aplicable">
        <p>
          Estos términos se rigen por las leyes de la República de Chile. Cualquier controversia se
          someterá a los tribunales ordinarios de justicia de Chile, sin perjuicio de los derechos
          que la ley de tu país te reconozca.
        </p>
      </Section>
    </LegalPage>
  );
}
