import { Logo } from "@/components/layout/logo";
import { LoginForm } from "@/components/admin/login-form";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-3">
          <Logo height={18} />
          <span className="text-xs uppercase tracking-widest text-fg-faint">Panel</span>
        </div>
        <h1 className="display text-3xl">Entrar</h1>
        <p className="mt-2 text-sm text-fg-muted">Acceso para el equipo de Tot Auto.</p>
        <div className="mt-6">
          <LoginForm next={next} />
        </div>
      </div>
    </main>
  );
}
