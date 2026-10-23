import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { coverOf, formatKm, formatPrice, imageUrl, type VehicleWithImages } from "@/lib/vehicle-format";
import { StatusSelect } from "@/components/admin/status-select";
import { SyncImportRadarButton } from "@/components/admin/sync-importradar";
import { importRadarConfigured } from "@/lib/importradar";

const STATUS_LABEL = { draft: "Borrador", available: "Disponible", reserved: "Reservado", sold: "Vendido" } as const;
type Status = keyof typeof STATUS_LABEL;

export default async function AdminVehiclesPage({ searchParams }: { searchParams: Promise<{ estado?: string }> }) {
  const { estado } = await searchParams;
  const filter = estado && estado in STATUS_LABEL ? (estado as Status) : undefined;
  const supabase = await createClient();
  let q = supabase.from("vehicles").select("*, vehicle_images(*)").order("updated_at", { ascending: false });
  if (filter) q = q.eq("status", filter);
  const [{ data, error }, { data: all }, { data: { user } }] = await Promise.all([q, supabase.from("vehicles").select("status"), supabase.auth.getUser()]);
  const { data: profile } = user ? await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle() : { data: null };
  const isAdmin = profile?.role === "admin";
  if (error) throw new Error(error.message);
  const vehicles = (data ?? []) as VehicleWithImages[];
  const counts = (all ?? []).reduce<Record<string, number>>((acc, v) => ((acc[v.status] = (acc[v.status] ?? 0) + 1), acc), {});

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-4xl">Coches</h1>
          <p className="mt-1 text-sm text-fg-muted">Ves tus coches; el admin los ve todos. Solo se publican los que no están en borrador.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {isAdmin && importRadarConfigured() && <SyncImportRadarButton />}
          <Link href="/admin/vehicles/new" className="rounded-sm bg-accent px-5 py-2.5 btn-label text-accent-ink hover:opacity-90">
            + Nuevo coche
          </Link>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2 text-sm">
        <Tab href="/admin" active={!filter} label={`Todos · ${all?.length ?? 0}`} />
        {(Object.keys(STATUS_LABEL) as Status[]).map((k) => (
          <Tab key={k} href={`/admin?estado=${k}`} active={filter === k} label={`${STATUS_LABEL[k]} · ${counts[k] ?? 0}`} />
        ))}
      </div>

      {vehicles.length === 0 ? (
        <p className="text-fg-muted">No hay coches en esta vista.</p>
      ) : (
        <ul className="grid gap-3">
          {vehicles.map((v) => {
            const cover = coverOf(v);
            return (
              <li key={v.id} className="grid items-center gap-4 rounded-card border border-line bg-bg-elev p-3 sm:grid-cols-[96px_1fr_auto]">
                <Link href={`/admin/vehicles/${v.id}`} className="relative aspect-[4/3] overflow-hidden rounded-md bg-bg-elev-2">
                  {cover ? (
                    <Image src={imageUrl(cover.path)} alt="" fill sizes="96px" className="object-cover" />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center text-xs text-fg-faint">Sin foto</span>
                  )}
                </Link>
                <div className="min-w-0">
                  <Link href={`/admin/vehicles/${v.id}`} className="font-medium hover:text-accent">
                    {v.make} {v.model} {v.version && <span className="text-fg-muted">· {v.version}</span>}
                  </Link>
                  <p className="mt-0.5 text-sm text-fg-muted">
                    {v.year} · {formatKm(v.km, "es")} · {formatPrice(v.price_eur, "es")}
                    {v.featured && <span className="ml-2 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] uppercase tracking-wider text-accent">Destacado</span>}
                    {v.availability === "on_demand" && (
                      <span className="ml-2 rounded-full border border-line px-2 py-0.5 text-[10px] uppercase tracking-wider text-fg-muted">
                        Bajo pedido · {v.origin_country ?? "DE"}
                      </span>
                    )}
                    {v.source_url && (
                      <a href={v.source_url} target="_blank" rel="noopener" className="ml-2 text-xs text-fg-faint hover:text-fg">anuncio ↗</a>
                    )}
                    <span className="ml-2 text-fg-faint">{v.vehicle_images.length} fotos</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusSelect id={v.id} status={v.status} />
                  <a href={`/stock/${v.slug}`} target="_blank" rel="noopener" className="rounded-full border border-line px-3 py-1.5 text-xs hover:border-fg" title="Ver en la web">
                    Ver ↗
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

function Tab({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link href={href} className={`rounded-full border px-3 py-1.5 ${active ? "border-accent text-accent" : "border-line text-fg-muted hover:text-fg"}`}>
      {label}
    </Link>
  );
}
