import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageIntro } from "@/components/ui/page-intro";
import type { LegalDoc } from "@/lib/legal/types";
import { seoAlternates } from "@/lib/seo";
import * as es from "@/lib/legal/es";
import * as ca from "@/lib/legal/ca";

export type LegalKey = "avisoLegal" | "privacidad" | "cookies";

export function getLegalDoc(locale: string, key: LegalKey): LegalDoc {
  return (locale === "ca" ? ca : es)[key];
}

const LEGAL_PATH: Record<LegalKey, string> = { avisoLegal: "/legal/aviso-legal", privacidad: "/legal/privacidad", cookies: "/legal/cookies" };

export async function legalMetadata(locale: string, key: LegalKey): Promise<Metadata> {
  const doc = getLegalDoc(locale, key);
  return { title: doc.title, robots: { index: true, follow: false }, alternates: seoAlternates(locale, LEGAL_PATH[key]) };
}

export async function LegalPage({ locale, docKey }: { locale: string; docKey: LegalKey }) {
  setRequestLocale(locale);
  const t = await getTranslations("legal");
  const doc = getLegalDoc(locale, docKey);

  return (
    <>
      <PageIntro eyebrow={t("eyebrow")} title={doc.title} lead={doc.intro} />
      <article className="container-x pb-32">
        <div className="max-w-3xl">
        <p className="mb-10 text-sm text-fg-faint">{t("updated", { date: doc.updated })}</p>
        {doc.sections.map((s, i) => (
          <section key={i} className="mb-10">
            {s.heading && <h2 className="mb-3 font-display text-2xl md:text-3xl">{s.heading}</h2>}
            {s.paragraphs.map((p, j) => (
              <p key={j} className="mb-3 leading-relaxed text-fg-muted">{p}</p>
            ))}
            {s.list && (
              <ul className="grid gap-2 text-fg-muted">
                {s.list.map((li, k) => (
                  <li key={k} className="flex gap-3">
                    <span className="text-accent">·</span>
                    <span>{li}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
        </div>
      </article>
    </>
  );
}
