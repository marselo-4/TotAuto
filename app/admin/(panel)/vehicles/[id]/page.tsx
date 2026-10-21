import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { vehicleTitle, type VehicleWithImages } from "@/lib/vehicle-format";
import { VehicleForm } from "@/components/admin/vehicle-form";
import { PhotoManager } from "@/components/admin/photo-manager";
import { DeleteVehicleButton } from "@/components/admin/delete-vehicle";
import { StatusSelect } from "@/components/admin/status-select";

export default async function EditVehiclePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ nuevo?: string }>;
}) {
  const [{ id }, { nuevo }] = await Promise.all([params, searchParams]);
  const supabase = await createClient();
  const { data, error } = await supabase.from("vehicles").select("*, vehicle_images(*)").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) notFound();
  const v = data as VehicleWithImages;

  return (
    <div className="mx-auto max-w-4xl">
      <nav className="mb-4 flex items-center justify-between text-sm text-fg-muted">
        <Link href="/admin" className="hover:text-fg">← Coches</Link>
        <a href={`/stock/${v.slug}`} target="_blank" rel="noopener" className="hover:text-fg">Ver en la web ↗</a>
      </nav>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-4xl">{vehicleTitle(v)}</h1>
          <p className="mt-1 text-sm text-fg-muted">{v.year} · /stock/{v.slug}</p>
        </div>
        <StatusSelect id={v.id} status={v.status} />
      </div>

      {nuevo && (
        <p className="mb-6 rounded-card border border-accent/40 bg-bg-elev p-4 text-sm">
          Coche creado como borrador. Sube las fotos y, cuando esté listo, cámbialo a <strong>Disponible</strong> para publicarlo.
        </p>
      )}

      <section className="mb-10">
        <h2 className="mb-3 text-xs uppercase tracking-widest text-fg-faint">Fotos · {v.vehicle_images.length}</h2>
        <PhotoManager vehicleId={v.id} ownerId={v.owner_id} images={v.vehicle_images} />
      </section>

      <section>
        <h2 className="mb-3 text-xs uppercase tracking-widest text-fg-faint">Datos</h2>
        <VehicleForm vehicle={v} />
      </section>

      <section className="mt-12 flex items-center justify-between border-t border-line pt-6">
        <p className="text-xs text-fg-faint">Creado el {new Date(v.created_at).toLocaleDateString("es-ES")} · actualizado el {new Date(v.updated_at).toLocaleDateString("es-ES")}</p>
        <DeleteVehicleButton id={v.id} label={vehicleTitle(v)} />
      </section>
    </div>
  );
}
