import type { ReactNode } from "react";

// El layout raíz solo pasa los hijos: <html> y <body> viven en app/[locale]/layout.tsx
// para poder fijar el atributo lang según el idioma.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
