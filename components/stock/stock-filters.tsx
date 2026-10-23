"use client";

import { useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { FUELS, GEARBOXES, PRICE_CAPS, SORT_OPTIONS, availabilityParam, formatPrice, type StockFilters } from "@/lib/vehicle-format";

export function StockFiltersBar({ makes, filters, count }: { makes: string[]; filters: StockFilters; count: number }) {
  const t = useTranslations("stock");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  function set(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    const qs = params.toString();
    startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
  }

  function clear() {
    startTransition(() => router.replace(pathname, { scroll: false }));
  }

  const hasFilters = Boolean(filters.make || filters.fuel || filters.gearbox || filters.priceMax || filters.availability);

  return (
    <div className={`flex flex-col gap-4 border-y border-line py-5 transition-opacity ${pending ? "opacity-60" : ""}`} aria-busy={pending}>
      <div className="flex flex-wrap items-center gap-3">
        <Select label={t("filters.make")} value={filters.make ?? ""} onChange={(v) => set("marca", v)}>
          <option value="">{t("filters.anyMake")}</option>
          {makes.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </Select>
        <Select label={t("filters.fuel")} value={filters.fuel ?? ""} onChange={(v) => set("combustible", v)}>
          <option value="">{t("filters.anyFuel")}</option>
          {FUELS.map((f) => (
            <option key={f} value={f}>{t(`fuel.${f}`)}</option>
          ))}
        </Select>
        <Select label={t("filters.gearbox")} value={filters.gearbox ?? ""} onChange={(v) => set("cambio", v)}>
          <option value="">{t("filters.anyGearbox")}</option>
          {GEARBOXES.map((g) => (
            <option key={g} value={g}>{t(`gearbox.${g}`)}</option>
          ))}
        </Select>
        <Select label={t("filters.priceMax")} value={filters.priceMax ? String(filters.priceMax) : ""} onChange={(v) => set("precio", v)}>
          <option value="">{t("filters.anyPrice")}</option>
          {PRICE_CAPS.map((p) => (
            <option key={p} value={p}>{t("filters.upTo", { price: formatPrice(p, locale) })}</option>
          ))}
        </Select>
        <Select label={t("filters.availability")} value={filters.availability ? availabilityParam(filters.availability) : ""} onChange={(v) => set("disponibilidad", v)}>
          <option value="">{t("filters.anyAvailability")}</option>
          <option value="showroom">{t("filters.inStock")}</option>
          <option value="pedido">{t("filters.onDemand")}</option>
        </Select>
        <div className="ms-auto flex items-center gap-3">
          <Select label={t("filters.sort")} value={filters.sort ?? "featured"} onChange={(v) => set("orden", v === "featured" ? "" : v)}>
            {SORT_OPTIONS.map((s) => (
              <option key={s} value={s}>{t(`sort.${s}`)}</option>
            ))}
          </Select>
        </div>
      </div>
      <div className="flex items-center gap-4 text-sm text-fg-muted">
        <span aria-live="polite">{t("filters.count", { count })}</span>
        {hasFilters && (
          <button type="button" onClick={clear} className="underline underline-offset-4 hover:text-fg">
            {t("filters.clear")}
          </button>
        )}
      </div>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="flex items-center gap-2 rounded-full border border-line bg-bg-elev px-4 py-2 text-sm transition-colors focus-within:border-line-strong hover:border-line-strong">
      <span className="text-fg-faint">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="cursor-pointer appearance-none bg-transparent pr-4 text-fg outline-none"
        style={{ backgroundImage: "none" }}
      >
        {children}
      </select>
      <span aria-hidden className="-ml-4 text-fg-faint">▾</span>
    </label>
  );
}
