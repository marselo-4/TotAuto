export type LegalSection = { heading?: string; paragraphs: string[]; list?: string[] };
export type LegalDoc = { title: string; updated: string; intro?: string; sections: LegalSection[] };

/** Datos del responsable. Los marcadores entre corchetes se sustituyen cuando Carlos pase los datos de GUIXAGILS SL. */
export const RESPONSIBLE = {
  name: "GUIXAGILS SL",
  cif: "[CIF pendiente]",
  address: "[Domicilio social pendiente]",
  registry: "[Datos registrales pendientes]",
  email: "info@totauto.net",
  phone: "610 43 88 77",
  site: "totauto.net",
  brand: "Tot Auto",
  showroom: "Av. Raval del Carme 79, 25300 Tàrrega (Lleida)",
};
