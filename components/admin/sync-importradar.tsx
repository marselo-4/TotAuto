"use client";

import { useState, useTransition } from "react";
import { syncImportRadar, type SyncState } from "@/app/admin/actions";

/** Botón del panel que trae los coches en seguimiento de ImportRadar como borradores "bajo pedido". */
export function SyncImportRadarButton() {
  const [pending, start] = useTransition();
  const [state, setState] = useState<SyncState>(undefined);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        disabled={pending}
        onClick={() => start(async () => setState(await syncImportRadar()))}
        className="rounded-sm border border-line-strong px-5 py-2.5 btn-label hover:border-fg disabled:opacity-60"
        title="Trae las oportunidades en seguimiento de ImportRadar como borradores bajo pedido"
      >
        {pending ? "Sincronizando…" : "Traer de ImportRadar"}
      </button>
      {state?.error && <p role="alert" className="text-sm text-red-300">{state.error}</p>}
      {state?.result && (
        <p className="text-sm text-fg-muted">
          {state.result.fetched} en seguimiento · {state.result.created} nuevos · {state.result.updated} actualizados
          {state.result.unpublished > 0 && ` · ${state.result.unpublished} despublicados`}
          {state.result.stale > 0 && ` · ${state.result.stale} retirados en origen`}
        </p>
      )}
    </div>
  );
}
