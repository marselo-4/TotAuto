import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    remotePatterns: [
      // Fotos de coches en Supabase Storage (se concreta el host al crear el proyecto)
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
  },
  async redirects() {
    // URLs de la web antigua (sitemap 2024) → rutas nuevas, para no perder lo indexado
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/contacto.html", destination: "/contacto", permanent: true },
      { source: "/catalogo.html", destination: "/stock", permanent: true },
      { source: "/catalogo/:path*", destination: "/stock", permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
