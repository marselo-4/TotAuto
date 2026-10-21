import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Logo } from "@/components/layout/logo";
import { signOut } from "@/app/admin/actions";

export default async function PanelLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: profile } = await supabase.from("profiles").select("full_name, role").eq("id", user.id).maybeSingle();
  const isAdmin = profile?.role === "admin";

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur">
        <div className="container-x flex h-14 items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-3">
              <Logo height={16} />
              <span className="text-[10px] uppercase tracking-widest text-fg-faint">Panel</span>
            </Link>
            <nav className="flex items-center gap-4 text-sm text-fg-muted">
              <Link href="/admin" className="hover:text-fg">Coches</Link>
              {isAdmin && <Link href="/admin/leads" className="hover:text-fg">Leads</Link>}
              {/* Descarga de archivo (route handler), no una página: enlace nativo a propósito */}
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a href="/admin/export" className="hover:text-fg">Exportar CSV</a>
              <a href="/" target="_blank" rel="noopener" className="hover:text-fg">Ver web ↗</a>
            </nav>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="hidden text-fg-muted sm:inline">
              {profile?.full_name || user.email} {isAdmin && <span className="text-fg-faint">· admin</span>}
            </span>
            <form action={signOut}>
              <button type="submit" className="rounded-full border border-line px-3 py-1.5 text-xs hover:border-fg">Salir</button>
            </form>
          </div>
        </div>
      </header>
      <main className="container-x flex-1 py-8">{children}</main>
    </>
  );
}
