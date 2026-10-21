"use client";

import { useActionState } from "react";
import { signIn, type ActionState } from "@/app/admin/actions";

const field = "w-full rounded-md border border-line bg-bg-elev px-4 py-3 text-sm outline-none transition-colors placeholder:text-fg-faint focus:border-accent";

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(signIn, undefined);

  return (
    <form action={action} className="grid gap-3">
      <input type="hidden" name="next" value={next ?? "/admin"} />
      <input name="email" type="email" required autoComplete="email" placeholder="Email" aria-label="Email" className={field} />
      <input name="password" type="password" required autoComplete="current-password" placeholder="Contraseña" aria-label="Contraseña" className={field} />
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-ink transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Entrando…" : "Entrar"}
      </button>
      {state?.error && (
        <p role="alert" className="text-sm text-red-300">
          {state.error}
        </p>
      )}
    </form>
  );
}
