export type LegalSection = { heading?: string; paragraphs: string[]; list?: string[] };
export type LegalDoc = { title: string; updated: string; intro?: string; sections: LegalSection[] };

/** Datos del responsable. Los marcadores entre corchetes se sustituyen cuando Carlos pase los datos registrales de GUIXASGILS SL. */
export const RESPONSIBLE = {
  name: "GUIXASGILS SL",
  cif: "B25697186",
  address: "Av. Raval del Carme 79, 25300 Tàrrega (Lleida)",
  registry: "[Datos registrales pendientes]",
  email: "info@totauto.net",
  phone: "+34 690 609 107",
  contact: { name: "Carlos Martínez Guixà", email: "carlos@totauto.net", phone: "+34 690 609 107" },
  site: "totauto.net",
  brand: "Tot Auto",
  showroom: "Av. Raval del Carme 79, 25300 Tàrrega (Lleida)",
};
