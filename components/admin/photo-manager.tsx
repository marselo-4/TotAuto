"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { addVehicleImage, deleteVehicleImage, reorderVehicleImages, setCoverImage } from "@/app/admin/actions";
import { imageUrl, type VehicleImage } from "@/lib/vehicle-format";

const MAX_SIDE = 2000;

/** Redimensiona en el navegador a WebP (máx. 2000 px de lado) antes de subir. */
async function toWebp(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas no disponible");
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("No se pudo convertir la imagen"))), "image/webp", 0.86),
  );
}

export function PhotoManager({ vehicleId, ownerId, images }: { vehicleId: string; ownerId: string; images: VehicleImage[] }) {
  const input = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const sorted = [...images].sort((a, b) => a.position - b.position);

  async function onFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    const supabase = createClient();
    let i = 0;
    for (const file of Array.from(files)) {
      i++;
      setUploading(`Subiendo ${i} de ${files.length}…`);
      try {
        const blob = await toWebp(file);
        const path = `${ownerId}/${vehicleId}/${crypto.randomUUID()}.webp`;
        const { error: upErr } = await supabase.storage.from("vehicles").upload(path, blob, { contentType: "image/webp", cacheControl: "31536000" });
        if (upErr) throw upErr;
        await addVehicleImage(vehicleId, path);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        break;
      }
    }
    setUploading(null);
    if (input.current) input.current.value = "";
  }

  function move(index: number, dir: -1 | 1) {
    const next = [...sorted];
    const j = index + dir;
    if (j < 0 || j >= next.length) return;
    [next[index], next[j]] = [next[j], next[index]];
    start(() => reorderVehicleImages(vehicleId, next.map((im) => im.id)));
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <label className="cursor-pointer rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-ink hover:opacity-90">
          {uploading ?? "+ Añadir fotos"}
          <input ref={input} type="file" accept="image/*" multiple className="hidden" disabled={!!uploading} onChange={(e) => onFiles(e.target.files)} />
        </label>
        <p className="text-xs text-fg-faint">JPG, PNG o HEIC exportado. Se convierten a WebP de 2000 px. La primera es la portada; puedes cambiarla.</p>
      </div>
      {error && <p role="alert" className="text-sm text-red-300">{error}</p>}

      {sorted.length === 0 ? (
        <p className="rounded-card border border-dashed border-line p-8 text-center text-sm text-fg-muted">Todavía no hay fotos. Sin portada, la tarjeta del coche muestra solo la marca.</p>
      ) : (
        <ul className={`grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 ${pending ? "opacity-60" : ""}`}>
          {sorted.map((img, index) => (
            <li key={img.id} className={`overflow-hidden rounded-card border ${img.is_cover ? "border-accent" : "border-line"} bg-bg-elev`}>
              <div className="relative aspect-[4/3]">
                <Image src={imageUrl(img.path)} alt="" fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
                {img.is_cover && <span className="absolute left-2 top-2 rounded-full bg-accent px-2 py-0.5 text-[10px] uppercase tracking-wider text-accent-ink">Portada</span>}
              </div>
              <div className="flex items-center justify-between gap-1 p-2 text-xs">
                <div className="flex gap-1">
                  <button type="button" onClick={() => move(index, -1)} disabled={index === 0 || pending} className="rounded border border-line px-2 py-1 hover:border-fg disabled:opacity-30" aria-label="Mover antes">←</button>
                  <button type="button" onClick={() => move(index, 1)} disabled={index === sorted.length - 1 || pending} className="rounded border border-line px-2 py-1 hover:border-fg disabled:opacity-30" aria-label="Mover después">→</button>
                </div>
                <div className="flex gap-1">
                  {!img.is_cover && (
                    <button type="button" onClick={() => start(() => setCoverImage(vehicleId, img.id))} disabled={pending} className="rounded border border-line px-2 py-1 hover:border-accent">
                      Portada
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("¿Borrar esta foto?")) start(() => deleteVehicleImage(vehicleId, img.id));
                    }}
                    disabled={pending}
                    className="rounded border border-line px-2 py-1 text-red-300 hover:border-red-400"
                  >
                    Borrar
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
