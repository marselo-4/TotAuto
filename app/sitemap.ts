import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { localizedUrl } from "@/lib/seo";
import { createClient } from "@/lib/supabase/server";

const STATIC: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }> = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/stock", priority: 0.9, changeFrequency: "daily" },
  { path: "/showroom", priority: 0.7, changeFrequency: "monthly" },
  { path: "/importacion", priority: 0.8, changeFrequency: "monthly" },
  { path: "/vende-tu-coche", priority: 0.8, changeFrequency: "monthly" },
  { path: "/nosotros", priority: 0.5, changeFrequency: "monthly" },
  { path: "/contacto", priority: 0.6, changeFrequency: "monthly" },
  { path: "/legal/aviso-legal", priority: 0.1, changeFrequency: "yearly" },
  { path: "/legal/privacidad", priority: 0.1, changeFrequency: "yearly" },
  { path: "/legal/cookies", priority: 0.1, changeFrequency: "yearly" },
];

function entry(path: string, extra: Partial<MetadataRoute.Sitemap[number]>): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(routing.locales.map((l) => [l, localizedUrl(l, path)]));
  return routing.locales.map((l) => ({ url: localizedUrl(l, path), alternates: { languages }, ...extra }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const out: MetadataRoute.Sitemap = STATIC.flatMap((s) => entry(s.path, { priority: s.priority, changeFrequency: s.changeFrequency }));

  try {
    const supabase = await createClient();
    const { data } = await supabase.from("vehicles").select("slug, updated_at").in("status", ["available", "reserved"]);
    for (const v of data ?? []) {
      out.push(...entry(`/stock/${v.slug}`, { priority: 0.8, changeFrequency: "weekly", lastModified: v.updated_at }));
    }
  } catch {
    // Sin base de datos, el sitemap sale solo con las rutas estáticas
  }
  return out;
}
