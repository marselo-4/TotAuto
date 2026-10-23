import Link from "next/link";
import "./globals.css";

/**
 * 404 de raíz: solo se llega aquí con un idioma inválido en la URL (p. ej. /xx/...),
 * porque dentro de un idioma válido manda app/[locale]/not-found.tsx.
 * El layout raíz no pinta <html>, así que este archivo lo aporta.
 */
export default function RootNotFound() {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="flex min-h-full flex-col items-start justify-center bg-bg px-6 text-fg">
        <p className="eyebrow mb-5">404</p>
        <h1 className="display text-4xl md:text-6xl">Esta página no existe.</h1>
        <p className="mt-5 max-w-md text-fg-muted">Aquesta pàgina no existeix.</p>
        <Link href="/" className="mt-8 rounded-sm bg-accent px-6 py-3.5 btn-label text-accent-ink hover:opacity-90">
          Volver al inicio · Tornar a l&apos;inici
        </Link>
      </body>
    </html>
  );
}
