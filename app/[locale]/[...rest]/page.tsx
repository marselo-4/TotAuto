import { notFound } from "next/navigation";

/** Cualquier ruta no definida dentro de un idioma válido → 404 traducido del segmento [locale]. */
export default function CatchAllPage() {
  notFound();
}
