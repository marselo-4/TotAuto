"use client";

import { useActionState } from "react";
import { createVehicle, updateVehicle, type ActionState } from "@/app/admin/actions";
import type { Vehicle } from "@/lib/vehicle-format";

const field = "w-full rounded-md border border-line bg-bg px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-fg-faint focus:border-accent";
const labelCls = "mb-1 block text-xs uppercase tracking-wider text-fg-faint";

export function VehicleForm({ vehicle }: { vehicle?: Vehicle }) {
  const action = vehicle ? updateVehicle.bind(null, vehicle.id) : createVehicle;
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, undefined);
  const v = vehicle;

  return (
    <form action={formAction} className="grid gap-6">
      <Section title="Identificación">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Marca" name="make" defaultValue={v?.make} required />
          <Field label="Modelo" name="model" defaultValue={v?.model} required />
          <Field label="Versión" name="version" defaultValue={v?.version ?? ""} placeholder="4.5 V8, 2.5 TFSI quattro…" />
        </div>
        <div className="grid gap-4 sm:grid-cols-4">
          <Field label="Año" name="year" type="number" defaultValue={v?.year ?? new Date().getFullYear()} required />
          <Field label="Kilómetros" name="km" type="number" defaultValue={v?.km ?? 0} required />
          <Field label="Potencia (CV)" name="power_cv" type="number" defaultValue={v?.power_cv ?? ""} />
          <Field label="Color" name="color" defaultValue={v?.color ?? ""} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls} htmlFor="fuel">Combustible</label>
            <select id="fuel" name="fuel" defaultValue={v?.fuel ?? "gasolina"} className={field}>
              <option value="gasolina">Gasolina</option>
              <option value="diesel">Diésel</option>
              <option value="hibrido">Híbrido</option>
              <option value="hibrido_enchufable">Híbrido enchufable</option>
              <option value="electrico">Eléctrico</option>
            </select>
          </div>
          <div>
            <label className={labelCls} htmlFor="gearbox">Cambio</label>
            <select id="gearbox" name="gearbox" defaultValue={v?.gearbox ?? "automatico"} className={field}>
              <option value="automatico">Automático</option>
              <option value="manual">Manual</option>
            </select>
          </div>
        </div>
      </Section>

      <Section title="Precio y estado">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Precio (€)" name="price_eur" type="number" defaultValue={v?.price_eur ?? ""} required />
          <div>
            <label className={labelCls} htmlFor="status">Estado</label>
            <select id="status" name="status" defaultValue={v?.status ?? "draft"} className={field}>
              <option value="draft">Borrador (no se publica)</option>
              <option value="available">Disponible</option>
              <option value="reserved">Reservado</option>
              <option value="sold">Vendido</option>
            </select>
          </div>
          <div className="flex flex-col justify-end gap-2 pb-1">
            <Check label="IVA deducible" name="vat_deductible" defaultChecked={v?.vat_deductible ?? false} />
            <Check label="Destacado en la home" name="featured" defaultChecked={v?.featured ?? false} />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className={labelCls} htmlFor="availability">Disponibilidad</label>
            <select id="availability" name="availability" defaultValue={v?.availability ?? "in_stock"} className={field}>
              <option value="in_stock">En el showroom</option>
              <option value="on_demand">Bajo pedido (se trae de Alemania)</option>
            </select>
          </div>
          {v?.source === "importradar" && (
            <div className="rounded-md border border-line bg-bg p-3 text-xs text-fg-muted sm:col-span-2">
              <p className="mb-1 uppercase tracking-wider text-fg-faint">Origen · ImportRadar</p>
              <p>
                Anunciado en origen a <span className="text-fg">{v.source_price_eur?.toLocaleString("es-ES") ?? "—"} €</span>
                {" · "}venta estimada en España <span className="text-fg">{v.market_price_eur?.toLocaleString("es-ES") ?? "—"} €</span>
                {v.source_synced_at && <> · sincronizado el {new Date(v.source_synced_at).toLocaleString("es-ES")}</>}
              </p>
              <p className="mt-1">
                {v.source_url && (
                  <a href={v.source_url} target="_blank" rel="noopener" className="text-accent hover:underline">Ver el anuncio de origen ↗</a>
                )}
                {" · "}Los kilómetros y la estimación se actualizan solos; el precio público solo mientras esté en borrador.
              </p>
            </div>
          )}
        </div>
      </Section>

      <Section title="Origen y documentación">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="País de origen (ISO, p. ej. DE)" name="origin_country" defaultValue={v?.origin_country ?? "DE"} maxLength={2} />
          <div className="flex flex-col justify-end gap-2 pb-1">
            <Check label="Importado" name="imported" defaultChecked={v?.imported ?? true} />
            <Check label="Matriculado en España" name="registered_es" defaultChecked={v?.registered_es ?? true} />
          </div>
          <Field label="Garantía" name="warranty" defaultValue={v?.warranty ?? ""} placeholder="12 meses, de fábrica hasta 2027…" />
        </div>
        <div>
          <label className={labelCls} htmlFor="service_history">Historial / revisiones</label>
          <textarea id="service_history" name="service_history" rows={2} defaultValue={v?.service_history ?? ""} className={field} />
        </div>
      </Section>

      <Section title="Descripción">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelCls} htmlFor="description_es">Castellano</label>
            <textarea id="description_es" name="description_es" rows={5} defaultValue={v?.description_es ?? ""} className={field} />
          </div>
          <div>
            <label className={labelCls} htmlFor="description_ca">Catalán</label>
            <textarea id="description_ca" name="description_ca" rows={5} defaultValue={v?.description_ca ?? ""} className={field} />
          </div>
        </div>
      </Section>

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={pending} className="rounded-sm bg-accent px-6 py-3.5 btn-label text-accent-ink hover:opacity-90 disabled:opacity-60">
          {pending ? "Guardando…" : vehicle ? "Guardar cambios" : "Crear y pasar a las fotos"}
        </button>
        {state?.error && <p role="alert" className="text-sm text-red-300">{state.error}</p>}
        {state?.ok && <p className="text-sm text-emerald-300">Guardado.</p>}
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="grid gap-4 rounded-card border border-line bg-bg-elev p-5">
      <legend className="px-2 text-xs uppercase tracking-widest text-fg-faint">{title}</legend>
      {children}
    </fieldset>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  required,
  placeholder,
  maxLength,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string | number;
  required?: boolean;
  placeholder?: string;
  maxLength?: number;
}) {
  return (
    <div>
      <label className={labelCls} htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} defaultValue={defaultValue} required={required} placeholder={placeholder} maxLength={maxLength} className={field} />
    </div>
  );
}

function Check({ label, name, defaultChecked }: { label: string; name: string; defaultChecked: boolean }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="accent-accent" />
      {label}
    </label>
  );
}
