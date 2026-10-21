import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Next 16 llama "proxy" a lo que antes era middleware. Resuelve el idioma y redirige.
export default createMiddleware(routing);

export const config = {
  // Todo menos API, panel, assets de Next y archivos estáticos
  matcher: ["/((?!api|admin|_next|_vercel|.*\\..*).*)"],
};
