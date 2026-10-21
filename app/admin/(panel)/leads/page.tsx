import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const TYPE_LABEL: Record<string, string> = { vehicle: "Coche", import: "Importación", sell: "Vende su coche", contact: "Contacto" };

export default async function LeadsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leads")
    .select("*, vehicles(make, model, version, slug)")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) throw new Error(error.message);
  const leads = data ?? [];

  return (
    <>
      <div className="mb-6">
        <h1 className="display text-4xl">Leads</h1>
        <p className="mt-1 text-sm text-fg-muted">Mensajes recibidos desde la web. Los últimos 200.</p>
      </div>
      {leads.length === 0 ? (
        <p className="text-fg-muted">Todavía no ha llegado ningún mensaje.</p>
      ) : (
        <ul className="grid gap-3">
          {leads.map((l) => {
            const v = l.vehicles as { make: string; model: string; version: string | null; slug: string } | null;
            const extra = l.extra && typeof l.extra === "object" && !Array.isArray(l.extra) ? (l.extra as Record<string, unknown>) : null;
            return (
              <li key={l.id} className="rounded-card border border-line bg-bg-elev p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-medium">
                    <span className="mr-2 rounded-full bg-bg px-2 py-0.5 text-[10px] uppercase tracking-wider text-fg-muted">{TYPE_LABEL[l.type] ?? l.type}</span>
                    {l.name}
                    {v && (
                      <span className="text-fg-muted">
                        {" "}· <Link href={`/stock/${v.slug}`} className="hover:text-accent">{v.make} {v.model}{v.version ? ` ${v.version}` : ""}</Link>
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-fg-faint">
                    {new Date(l.created_at).toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" })} · {l.locale.toUpperCase()}
                    {l.sent_to_hubspot && " · HubSpot"}
                  </p>
                </div>
                <p className="mt-2 text-sm">
                  {l.phone && <a href={`tel:${l.phone}`} className="mr-4 hover:text-accent">{l.phone}</a>}
                  {l.email && <a href={`mailto:${l.email}`} className="hover:text-accent">{l.email}</a>}
                </p>
                {extra && Object.keys(extra).length > 0 && (
                  <dl className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-fg-muted">
                    {Object.entries(extra).map(([k, val]) => (
                      <div key={k}><dt className="inline text-fg-faint">{k}: </dt><dd className="inline">{String(val)}</dd></div>
                    ))}
                  </dl>
                )}
                {l.message && <p className="mt-3 whitespace-pre-line text-sm text-fg-muted">{l.message}</p>}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
