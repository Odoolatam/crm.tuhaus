/**
 * Legal entity behind Tuhaus CRM. Used by the public legal pages
 * (/privacidad, /terminos, /eliminacion-datos) that Meta requires for
 * the WhatsApp app, and by the landing footer.
 *
 * Keep these values identical to the documents used for Meta business
 * verification: Meta compares them.
 */
export const LEGAL = {
  companyName: "TH Consulting Ltda",
  rut: "78.253.574-9",
  address: "La Rotunda LT17-K-2, Casablanca, Región de Valparaíso, Chile",
  email: "contacto@tuhaus.com",
  phone: "+56 9 7609 4103",
  countries: ["Chile", "Argentina", "Perú", "Bolivia", "Colombia", "Ecuador"],
  lastUpdated: "29 de septiembre de 2026",
} as const;

export const LEGAL_LINKS = [
  { href: "/privacidad", label: "Política de privacidad" },
  { href: "/terminos", label: "Términos de servicio" },
  { href: "/eliminacion-datos", label: "Eliminación de datos" },
] as const;
