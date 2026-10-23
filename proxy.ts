import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";

// Next 16 llama "proxy" a lo que antes era middleware.
const intl = createMiddleware(routing);

/** Landing de "próximamente": solo existe la portada en cada idioma. Todo lo demás vuelve a ella. */
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isRoot = pathname === "/" || pathname === "/ca" || pathname === "/ca/";
  if (!isRoot) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.startsWith("/ca/") ? "/ca" : "/";
    url.search = "";
    return NextResponse.redirect(url, 307);
  }
  return intl(request);
}

export const config = {
  // Todo menos assets de Next y archivos estáticos
  matcher: ["/((?!_next|_vercel|.*\\..*).*)"],
};
