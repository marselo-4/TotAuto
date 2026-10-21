import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { imageUrl, sortedImages, type VehicleWithImages } from "@/lib/vehicle-format";

const FUEL: Record<string, string> = { gasolina: "Gasolina", diesel: "Diésel", hibrido: "Híbrido", hibrido_enchufable: "Híbrido enchufable", electrico: "Eléctrico" };
const GEARBOX: Record<string, string> = { manual: "Manual", automatico: "Automático" };
const STATUS: Record<string, string> = { draft: "Borrador", available: "Disponible", reserved: "Reservado", sold: "Vendido" };

function csvCell(v: unknown) {
  const s = v === null || v === undefined ? "" : String(v);
  return /[";\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** CSV (separador ;) con los coches visibles del usuario y las URLs de sus fotos, para subir a portales. */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { data, error } = await supabase.from("vehicles").select("*, vehicle_images(*)").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const vehicles = (data ?? []) as VehicleWithImages[];

  const header = [
    "Referencia", "Estado", "Marca", "Modelo", "Versión", "Año", "Kilómetros", "Combustible", "Cambio", "Potencia CV", "Color",
    "Precio EUR", "IVA deducible", "País origen", "Importado", "Matriculado ES", "Garantía", "Historial", "Descripción ES", "Descripción CA",
    "URL web", "Fotos (URLs separadas por |)",
  ];
  const rows = vehicles.map((v) => [
    v.slug, STATUS[v.status] ?? v.status, v.make, v.model, v.version, v.year, v.km, FUEL[v.fuel] ?? v.fuel, GEARBOX[v.gearbox] ?? v.gearbox, v.power_cv, v.color,
    v.price_eur, v.vat_deductible ? "Sí" : "No", v.origin_country, v.imported ? "Sí" : "No", v.registered_es ? "Sí" : "No", v.warranty, v.service_history, v.description_es, v.description_ca,
    `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/stock/${v.slug}`, sortedImages(v).map((i) => imageUrl(i.path)).join("|"),
  ]);

  const csv = "﻿" + [header, ...rows].map((r) => r.map(csvCell).join(";")).join("\r\n");
  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="totauto-stock-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
