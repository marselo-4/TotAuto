import Link from "next/link";
import { VehicleForm } from "@/components/admin/vehicle-form";

export default function NewVehiclePage() {
  return (
    <div className="mx-auto max-w-4xl">
      <nav className="mb-4 text-sm text-fg-muted">
        <Link href="/admin" className="hover:text-fg">← Coches</Link>
      </nav>
      <h1 className="display mb-2 text-4xl">Nuevo coche</h1>
      <p className="mb-8 text-sm text-fg-muted">Se crea como borrador. Las fotos se añaden en el paso siguiente; publícalo cambiando el estado a Disponible.</p>
      <VehicleForm />
    </div>
  );
}
