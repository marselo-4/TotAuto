"use client";

import { useTransition } from "react";
import { deleteVehicle } from "@/app/admin/actions";

export function DeleteVehicleButton({ id, label }: { id: string; label: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm(`¿Borrar "${label}" y todas sus fotos? No se puede deshacer.`)) start(() => deleteVehicle(id));
      }}
      className="rounded-full border border-red-400/40 px-4 py-2 text-xs text-red-300 hover:border-red-400 disabled:opacity-60"
    >
      {pending ? "Borrando…" : "Borrar coche"}
    </button>
  );
}
