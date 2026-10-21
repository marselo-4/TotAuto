"use client";

import { useTransition } from "react";
import { setVehicleStatus } from "@/app/admin/actions";
import type { Enums } from "@/lib/supabase/database.types";

type Status = Enums<"vehicle_status">;
const OPTIONS: Array<[Status, string]> = [
  ["draft", "Borrador"],
  ["available", "Disponible"],
  ["reserved", "Reservado"],
  ["sold", "Vendido"],
];

const TONE: Record<Status, string> = {
  available: "border-emerald-500/50 text-emerald-300",
  reserved: "border-accent/60 text-accent",
  sold: "border-line text-fg-faint",
  draft: "border-line text-fg-muted",
};

export function StatusSelect({ id, status }: { id: string; status: Status }) {
  const [pending, start] = useTransition();
  return (
    <select
      value={status}
      disabled={pending}
      onChange={(e) => start(() => setVehicleStatus(id, e.target.value as Status))}
      className={`rounded-full border bg-bg px-3 py-1.5 text-xs outline-none disabled:opacity-60 ${TONE[status]}`}
      aria-label="Estado"
    >
      {OPTIONS.map(([v, l]) => (
        <option key={v} value={v}>{l}</option>
      ))}
    </select>
  );
}
