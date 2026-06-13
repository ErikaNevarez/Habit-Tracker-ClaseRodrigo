# ADR 0002 — Middleware Next.js: session refresh y guards de rutas

Fecha: 2026-06-12
Estado: aceptado

## Contexto

ADR 0001 seleccionó "Supabase Auth + RLS" (Alternativa A) para proteger datos y descartó explícitamente "Supabase Auth + middleware de Next.js" (Alternativa B). Sin embargo, RLS opera en la capa de base de datos: protege filas, no rutas HTTP. Sin middleware, un usuario sin sesión válida puede llegar a `/` o `/habito/[id]`, y el redirect ocurre en el cliente tras el primer render, produciendo un flash de contenido no autorizado.

`@supabase/ssr` es la librería oficial de Supabase para Next.js App Router. Implementa el patrón de middleware que refresca el token de sesión en cada request (cookie rotation) y expone `supabase.auth.getUser()` server-side. Sin este middleware, los tokens de sesión expiran silenciosamente y el cliente queda con credenciales obsoletas.

ADR 0001 descartó middleware como mecanismo de *validación de autorizaciones de negocio* (que sigue siendo responsabilidad de RLS). Esta ADR formaliza el uso de middleware para dos responsabilidades distintas y complementarias: session refresh y protección de rutas (UX guard).

## Decisión

Crear `src/middleware.ts` con `@supabase/ssr` para:

1. **Session refresh**: refrescar el token de Supabase en cada request usando el cliente del middleware (`createServerClient` de `@supabase/ssr`).
2. **Route guard**: llamar a `supabase.auth.getUser()` y redirigir a `/login?expired=1` si no hay sesión válida en rutas protegidas (`/`, `/habito/:path*`, `/archivados`, `/onboarding`, `/estadisticas`, `/cuenta`).

El middleware NO valida permisos de negocio (límites de plan, propiedad de recursos). Esa responsabilidad sigue en RLS, tal como decidió ADR 0001.

## Alternativas consideradas

### Alternativa A — Protección puramente cliente (redirect en cada `page.tsx`)
- Trade-offs: sin complejidad de middleware ni Edge runtime; pero produce flash de UI no autorizada en cada ruta protegida y no resuelve el problema de cookie rotation para el token refresh.

### Alternativa B — Middleware `@supabase/ssr` (elegida)
- Trade-offs: elimina flashes de UI y garantiza tokens siempre frescos; requiere configurar correctamente el matcher de rutas y es sensible a la compatibilidad del Edge runtime con las dependencias del proyecto.

### Alternativa C — API Route server-side en cada request
- Trade-offs: centraliza la lógica; introduce latencia adicional por round-trip extra y duplica la responsabilidad de getUser() que ya hace el middleware.

## Consecuencias esperadas

Beneficios:
- Experiencia de usuario sin flashes de contenido no autorizado.
- Token de sesión siempre renovado antes de que expire, sin intervención del cliente.
- Patrón oficial recomendado por Supabase para Next.js App Router.

Negativas / trade-offs aceptados:
- Añade una capa de runtime en el Edge que puede complicar el debugging local.
- Posible duplicación superficial con las RLS policies (ambas rechazan acceso sin sesión), aunque operan en capas distintas (HTTP vs SQL).
- Si el matcher de rutas está mal configurado, rutas protegidas pueden quedar expuestas sin error evidente.
