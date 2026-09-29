import type { Metadata } from "next";
import Link from "next/link";

import { CompanyBlock, LegalPage, List, Mail, Section } from "@/components/legal/legal-page";
import { BRAND } from "@/config/brand";
import { LEGAL } from "@/config/legal";

export const metadata: Metadata = {
  title: { absolute: `Política de privacidad · ${BRAND.name}` },
  description: `Cómo ${LEGAL.companyName} trata los datos personales en ${BRAND.name}.`,
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Política de privacidad"
      intro={
        <p>
          Esta política explica qué datos personales trata {BRAND.name}, para qué los usa, con
          quién los comparte y cómo puedes ejercer tus derechos. {BRAND.name} es un servicio de{" "}
          {LEGAL.companyName} disponible en {BRAND.siteUrl.replace("https://", "")}.
        </p>
      }
    >
      <Section title="1. Responsable">
        <CompanyBlock />
      </Section>

      <Section title="2. Nuestro rol">
        <p>
          Respecto de los datos de los usuarios que crean y usan una cuenta en {BRAND.name},{" "}
          {LEGAL.companyName} actúa como <strong>responsable</strong> del tratamiento.
        </p>
        <p>
          Respecto de los datos de los contactos con quienes nuestros clientes conversan por
          WhatsApp (sus propios clientes), {LEGAL.companyName} actúa como{" "}
          <strong>encargado</strong>: los trata solo por cuenta y según las instrucciones del cliente
          que usa la plataforma. Ese cliente es el responsable de contar con la base legal y los
          consentimientos necesarios para contactar a esas personas.
        </p>
      </Section>

      <Section title="3. Datos que tratamos">
        <List
          items={[
            <>
              <strong>Datos de cuenta:</strong> nombre, correo, foto de perfil si usas el inicio de
              sesión con Google, empresa, rol dentro de la cuenta y preferencias.
            </>,
            <>
              <strong>Datos de conexión con WhatsApp:</strong> identificadores de la cuenta de
              WhatsApp Business y del número de teléfono, y los tokens de acceso que Meta entrega al
              conectar el número. Los tokens se guardan cifrados.
            </>,
            <>
              <strong>Datos de conversaciones:</strong> números de teléfono y nombres de perfil de
              los contactos, mensajes, archivos adjuntos, plantillas, etiquetas, notas y etapas del
              embudo de ventas que el cliente registra.
            </>,
            <>
              <strong>Datos de uso y técnicos:</strong> registros del servidor, dirección IP, tipo de
              navegador y eventos necesarios para operar y proteger el servicio.
            </>,
            <>
              <strong>Datos comerciales:</strong> plan contratado, estado de la prueba gratuita y
              estado de pago.
            </>,
          ]}
        />
      </Section>

      <Section title="4. Para qué usamos los datos">
        <List
          items={[
            "Crear y administrar tu cuenta y autenticarte.",
            "Enviar y recibir mensajes de WhatsApp a través de la API oficial de WhatsApp Business de Meta, por instrucción del cliente.",
            "Mostrar conversaciones, contactos, embudos, difusiones y automatizaciones dentro del CRM.",
            "Ejecutar funciones de inteligencia artificial cuando el cliente las activa.",
            "Gestionar la prueba gratuita, la suscripción y el soporte.",
            "Mantener la seguridad del servicio, prevenir abusos y cumplir obligaciones legales.",
          ]}
        />
        <p>
          No vendemos datos personales ni los usamos para publicidad. Los mensajes de los contactos
          de nuestros clientes no se usan para fines propios de {LEGAL.companyName}.
        </p>
      </Section>

      <Section title="5. Datos que recibimos de Meta">
        <p>
          Cuando un cliente conecta su número mediante el registro de WhatsApp de Meta (Facebook
          Login for Business), Meta nos entrega un código que canjeamos por un token para operar su
          cuenta de WhatsApp Business. Usamos los permisos whatsapp_business_messaging y
          whatsapp_business_management solo para enviar y recibir mensajes, administrar plantillas y
          el número conectado, y mostrar esa información al cliente dentro del CRM.
        </p>
        <p>
          El uso de datos recibidos de Meta cumple con las Condiciones de la Plataforma de Meta y
          las políticas de WhatsApp Business. El cliente puede revocar el acceso en cualquier
          momento desde la configuración de su portafolio comercial en Meta o escribiéndonos.
        </p>
      </Section>

      <Section title="6. Con quién compartimos datos">
        <p>Compartimos datos solo con proveedores necesarios para prestar el servicio:</p>
        <List
          items={[
            "Meta Platforms (WhatsApp Business Platform), para enviar y recibir mensajes.",
            "Supabase, para la base de datos, el almacenamiento de archivos y la autenticación.",
            "Hostinger, para el servidor donde corre la aplicación.",
            "Google, si eliges iniciar sesión con tu cuenta de Google.",
            "OpenAI o Anthropic, solo si el cliente activa funciones de inteligencia artificial con su propia clave; en ese caso se envía el contenido necesario para generar la respuesta.",
          ]}
        />
        <p>
          También podemos entregar datos cuando lo exija la ley o una autoridad competente.
        </p>
      </Section>

      <Section title="7. Transferencias internacionales">
        <p>
          Algunos de estos proveedores almacenan o procesan datos en servidores ubicados fuera del
          país del usuario, por ejemplo en Estados Unidos o la Unión Europea. Elegimos proveedores
          que aplican medidas de seguridad reconocidas en la industria.
        </p>
      </Section>

      <Section title="8. Cuánto tiempo guardamos los datos">
        <p>
          Guardamos los datos mientras la cuenta esté activa. Al terminar el servicio o cuando se
          solicita la eliminación, los borramos dentro de 30 días, salvo los que debamos conservar
          por obligaciones legales o tributarias. Las copias de respaldo se eliminan en su ciclo
          normal de rotación.
        </p>
      </Section>

      <Section title="9. Seguridad">
        <List
          items={[
            "Conexiones cifradas con HTTPS.",
            "Tokens de acceso y claves de API cifrados en la base de datos.",
            "Separación de datos por cuenta: cada usuario accede solo a la información de su propia empresa.",
            "Acceso administrativo restringido al equipo que opera el servicio.",
          ]}
        />
      </Section>

      <Section title="10. Cookies">
        <p>
          Usamos solo cookies necesarias para mantener la sesión iniciada y recordar preferencias
          como el idioma o el tema. No usamos cookies de publicidad.
        </p>
      </Section>

      <Section title="11. Tus derechos">
        <p>
          Puedes solicitar acceso, rectificación, eliminación u oposición al tratamiento de tus
          datos, y los demás derechos que te reconozca la ley de tu país, escribiendo a <Mail />.
          Respondemos dentro de 15 días hábiles. Para borrar tus datos sigue las instrucciones de
          nuestra página de{" "}
          <Link href="/eliminacion-datos" className="underline underline-offset-2">
            eliminación de datos
          </Link>
          .
        </p>
        <p>
          Si eres contacto de uno de nuestros clientes, te recomendamos dirigirte primero a esa
          empresa, que es la responsable de tus datos. Si nos escribes, trasladaremos tu solicitud.
        </p>
        <p>
          Tratamos los datos conforme a la Ley 19.628 de Chile y a las normas de protección de
          datos aplicables en los países donde ofrecemos el servicio: {LEGAL.countries.join(", ")}.
        </p>
      </Section>

      <Section title="12. Menores de edad">
        <p>
          {BRAND.name} es un servicio para empresas y no está dirigido a menores de 18 años.
        </p>
      </Section>

      <Section title="13. Cambios a esta política">
        <p>
          Podemos actualizar esta política. Publicaremos la nueva versión en esta página con su
          fecha y, si el cambio es relevante, avisaremos a los administradores de cada cuenta.
        </p>
      </Section>
    </LegalPage>
  );
}
