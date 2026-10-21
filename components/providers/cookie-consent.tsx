"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Script from "next/script";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const COOKIE = "ta_consent";
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

type Consent = "granted" | "denied" | null;

function readConsent(): Consent {
  const m = document.cookie.match(new RegExp(`(?:^|; )${COOKIE}=(granted|denied)`));
  return m ? (m[1] as Consent) : null;
}
function writeConsent(v: Exclude<Consent, null>) {
  document.cookie = `${COOKIE}=${v}; Max-Age=31536000; Path=/; SameSite=Lax`;
}

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
    openCookieSettings?: () => void;
  }
}

function gtag(...args: unknown[]) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(args);
}

// Estado compartido para que el enlace "Cookies" del pie pueda reabrir el banner.
const listeners = new Set<() => void>();
let openRequested = false;
const subscribe = (cb: () => void) => (listeners.add(cb), () => listeners.delete(cb));
const getOpen = () => openRequested;
const getServerOpen = () => false;
export function openCookieSettings() {
  openRequested = true;
  listeners.forEach((cb) => cb());
}

/**
 * Banner de cookies + Google Analytics 4 con Consent Mode v2:
 * GA se carga siempre con el consentimiento denegado por defecto (sin cookies, sin identificar)
 * y pasa a "granted" solo si el usuario acepta. La decisión se guarda un año.
 */
export function CookieConsent() {
  const t = useTranslations("cookies");
  const [consent, setConsent] = useState<Consent | "unknown">("unknown");
  const requested = useSyncExternalStore(subscribe, getOpen, getServerOpen);

  useEffect(() => {
    // Lectura de cookie en el cliente, tras la hidratación
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setConsent(readConsent());
  }, []);

  useEffect(() => {
    if (consent === "granted") gtag("consent", "update", { analytics_storage: "granted" });
  }, [consent]);

  function decide(v: "granted" | "denied") {
    writeConsent(v);
    setConsent(v);
    openRequested = false;
    listeners.forEach((cb) => cb());
  }

  const show = consent === null || requested;

  return (
    <>
      {GA_ID && (
        <>
          <Script id="ga-consent-default" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});
gtag('js',new Date());gtag('config','${GA_ID}',{anonymize_ip:true});`}
          </Script>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        </>
      )}

      {show && (
        <div
          role="dialog"
          aria-labelledby="cookie-title"
          className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-xl rounded-card border border-line bg-bg-elev/95 p-5 shadow-2xl backdrop-blur md:inset-x-auto md:left-6 md:bottom-6"
        >
          <p id="cookie-title" className="eyebrow mb-2">{t("title")}</p>
          <p className="text-sm text-fg-muted">
            {t("text")}{" "}
            <Link href="/legal/cookies" className="text-fg underline underline-offset-4">{t("more")}</Link>
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={() => decide("granted")} className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-accent-ink hover:opacity-90">
              {t("accept")}
            </button>
            <button type="button" onClick={() => decide("denied")} className="rounded-full border border-line-strong px-5 py-2 text-sm hover:border-fg">
              {t("reject")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/** Enlace del pie que reabre el banner. */
export function CookieSettingsLink({ className = "" }: { className?: string }) {
  const t = useTranslations("cookies");
  return (
    <button type="button" onClick={openCookieSettings} className={className}>
      {t("manage")}
    </button>
  );
}
