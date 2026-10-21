import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["es", "ca"],
  defaultLocale: "es",
  // "/" es castellano; el catalán va con prefijo "/ca"
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
