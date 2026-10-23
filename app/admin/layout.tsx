import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Archivo } from "next/font/google";
import "../globals.css";

const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"], axes: ["wdth"] });

export const metadata: Metadata = {
  title: { default: "Panel · Tot Auto", template: "%s · Panel Tot Auto" },
  robots: { index: false, follow: false },
};

/** Layout del panel: castellano, sin cabecera pública, sin scroll suave ni animaciones. */
export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={`${archivo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-bg text-fg">{children}</body>
    </html>
  );
}
