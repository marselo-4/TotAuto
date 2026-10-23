"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { joinWaitlist, type WaitlistState } from "./actions";

const initial: WaitlistState = { status: "idle" };

const field =
  "w-full border-b border-line-strong bg-transparent px-0 py-3 text-base text-fg placeholder:text-fg-faint transition-colors focus:border-accent focus:outline-none";

export function WaitlistForm() {
  const t = useTranslations("waitlist");
  const [state, action, pending] = useActionState(joinWaitlist, initial);

  if (state.status === "ok") {
    return (
      <div role="status" aria-live="polite" className="max-w-xl">
        <p className="display text-3xl text-accent md:text-4xl">{t("okTitle")}</p>
        <p className="mt-3 text-fg-muted">{state.message ?? t("okText")}</p>
      </div>
    );
  }

  return (
    <form action={action} noValidate className="max-w-3xl">
      {/* Honeypot: invisible para personas, tentador para bots */}
      <div aria-hidden className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
        <label>
          Website <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-x-8 gap-y-5 md:grid-cols-3">
        <label className="block">
          <span className="eyebrow text-[0.65rem]">{t("name")}</span>
          <input className={field} type="text" name="name" required minLength={2} maxLength={120} autoComplete="name" />
        </label>
        <label className="block">
          <span className="eyebrow text-[0.65rem]">{t("email")}</span>
          <input className={field} type="email" name="email" required maxLength={200} autoComplete="email" inputMode="email" />
        </label>
        <label className="block">
          <span className="eyebrow text-[0.65rem]">
            {t("phone")} <span className="normal-case tracking-normal text-fg-faint">· {t("optional")}</span>
          </span>
          <input className={field} type="tel" name="phone" maxLength={40} autoComplete="tel" inputMode="tel" />
        </label>
      </div>

      <label className="mt-6 flex max-w-xl cursor-pointer items-start gap-3 text-sm text-fg-muted">
        <input type="checkbox" name="consent" required className="mt-1 size-4 shrink-0 accent-accent" />
        <span>
          {t.rich("consent", {
            privacy: (chunks) => (
              <Link href="/legal/privacidad" className="underline decoration-line-strong underline-offset-4 hover:text-fg">
                {chunks}
              </Link>
            ),
          })}
        </span>
      </label>

      <div className="mt-7 flex flex-wrap items-center gap-5">
        <button
          type="submit"
          disabled={pending}
          className="display inline-flex h-12 items-center rounded-full bg-accent px-7 text-sm tracking-wide text-accent-ink transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {pending ? t("sending") : t("submit")}
        </button>
        {state.status === "error" && (
          <p role="alert" className="text-sm text-fg-muted">
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}
