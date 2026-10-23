import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { localizedUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(routing.locales.map((l) => [l, localizedUrl(l, "/")]));
  return routing.locales.map((l) => ({
    url: localizedUrl(l, "/"),
    alternates: { languages },
    lastModified: new Date(),
    priority: 1,
    changeFrequency: "weekly",
  }));
}
