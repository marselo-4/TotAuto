# Panel de administración (`/admin`)

_F2, 22/10/2026. Solo en castellano. Acceso con usuario y contraseña de Supabase Auth._

## Qué hace
- **Coches** (`/admin`): lista con filtros por estado (borrador, disponible, reservado, vendido), cambio de estado en línea, enlace a la ficha pública. Un `seller` ve solo sus coches; el `admin` los ve todos (lo decide RLS, no el código).
- **Nuevo coche** (`/admin/vehicles/new`): se crea como borrador y pasa a la pantalla de fotos. El slug se genera solo (`marca-modelo-año`, con sufijo si repite).
- **Editar** (`/admin/vehicles/[id]`): fotos (subida múltiple, se convierten a WebP de 2000 px en el navegador, orden con flechas, portada, borrar) y todos los datos. Borrar coche elimina también sus fotos del bucket.
- **Leads** (`/admin/leads`, solo admin): mensajes de la web con tipo, coche, campos extra y si llegaron a HubSpot.
- **Exportar CSV** (`/admin/export`): descarga con todos los campos y las URLs de las fotos separadas por `|`, separador `;` y BOM para que Excel lo abra bien. Base para subir a coches.net / AutoScout24 / Wallapop.

## Cómo funciona
- Sesión: `proxy.ts` refresca las cookies de Supabase en cada petición a `/admin` y redirige al login si no hay usuario (y al panel si ya lo hay). `app/admin/(panel)/layout.tsx` vuelve a comprobarlo en el servidor.
- Escrituras: server actions en `app/admin/actions.ts` con el cliente de servidor (respeta RLS). La subida de archivos va directa del navegador a Storage con el cliente de navegador y la sesión del usuario; la política del bucket solo deja escribir en la carpeta `{owner_id}/…`.
- Al guardar se revalida la web pública (`revalidatePath("/", "layout")`), así el stock y la home reflejan el cambio.

## Usuarios
- Carlos: admin (creado el 21/10/2026). Cambiar la contraseña temporal en Supabase → Authentication → Users.
- Miquel: pendiente. Crear el usuario en Supabase Auth (Add user, con contraseña o invitación por email); el trigger crea su perfil como `seller`. Opcional: poner `company` en `profiles`.

## Pendiente / ideas
- Arrastrar y soltar para reordenar fotos (hoy, flechas).
- Edición de perfil (nombre, empresa) desde el panel.
- Marcar leads como atendidos.
