import { Link } from "@/i18n/navigation";

export default function NotFound() {
  return (
    <section className="container-x flex min-h-svh flex-col items-start justify-center">
      <p className="eyebrow mb-5">404</p>
      <h1 className="display text-5xl md:text-7xl">Esta página no existe.</h1>
      <Link href="/" className="mt-8 text-accent underline-offset-4 hover:underline">
        Volver al inicio
      </Link>
    </section>
  );
}
