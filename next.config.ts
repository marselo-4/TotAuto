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
  async redirects() {
    // URLs de la web antigua (sitemap 2024): mientras dure la landing, todas a la portada
    return [
      { source: "/index.html", destination: "/", permanent: false },
      { source: "/:path*.html", destination: "/", permanent: false },
      { source: "/catalogo/:path*", destination: "/", permanent: false },
    ];
  },
};

export default withNextIntl(nextConfig);
