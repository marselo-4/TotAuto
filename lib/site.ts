/** Datos fijos del negocio. Lo que falte se rellena cuando Carlos lo pase. */
export const site = {
  name: "Tot Auto",
  legalEntity: "GUIXAGILS SL", // CIF B25697186, domicilio fiscal en el propio local
  phone: "+34 690 609 107",
  // Número de WhatsApp del showroom (formato internacional sin "+")
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "34690609107",
  email: "info@totauto.net",
  address: {
    street: "Av. Raval del Carme, 79",
    postalCode: "25300",
    city: "Tàrrega",
    region: "Lleida",
    country: "ES",
    lat: 41.651,
    lng: 1.143882,
  },
  gaId: "G-NPE0S5B82H",
  // Perfiles públicos del negocio (JSON-LD sameAs)
  sameAs: ["https://www.facebook.com/p/Tot-Auto-100057603603578/"],
} as const;

export function whatsappLink(message: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}
