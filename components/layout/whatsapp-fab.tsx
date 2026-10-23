"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { whatsappLink } from "@/lib/site";

/**
 * Botón flotante de WhatsApp en todas las páginas públicas. En la ficha de coche ya hay una
 * barra fija en móvil con WhatsApp y teléfono, así que ahí solo se muestra en escritorio.
 */
export function WhatsappFab() {
  const t = useTranslations("common");
  const pathname = usePathname();
  const onVehicle = /^\/stock\/[^/]+/.test(pathname);

  return (
    <a
      href={whatsappLink(t("whatsappMessage"))}
      target="_blank"
      rel="noopener"
      aria-label={t("whatsappLabel")}
      title={t("whatsappLabel")}
      className={`group fixed bottom-5 right-5 z-40 items-center gap-3 rounded-full border border-line bg-bg-elev/90 py-2.5 pl-3 pr-4 shadow-xl backdrop-blur transition-colors hover:border-accent md:bottom-6 md:right-6 ${
        onVehicle ? "hidden md:flex" : "flex"
      }`}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25d366] text-bg">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden>
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2m0 18.15a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 4.54 0 8.24 3.7 8.24 8.24s-3.7 8.24-8.24 8.24m4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07s.89 2.4 1.01 2.56c.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28"/>
        </svg>
      </span>
      <span className="hidden text-sm font-medium sm:inline">{t("whatsapp")}</span>
    </a>
  );
}
