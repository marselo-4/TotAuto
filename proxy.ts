import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { updateSession } from "./lib/supabase/middleware";

// Next 16 llama "proxy" a lo que antes era middleware.
const intl = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Panel: refresca la sesión y protege las rutas (todo menos el login)
  if (pathname.startsWith("/admin")) {
    const { response, user } = await updateSession(request);
    const isLogin = pathname === "/admin/login";
    if (!user && !isLogin) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    if (user && isLogin) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      url.search = "";
      return NextResponse.redirect(url);
    }
    return response;
  }

  // Web pública: idioma
  return intl(request);
}

export const config = {
  // Todo menos API, assets de Next y archivos estáticos
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
