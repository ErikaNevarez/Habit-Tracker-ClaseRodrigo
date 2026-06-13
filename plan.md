# Plan de implementación — Habit Tracker

**Alcance:** núcleo del proyecto (sin extensiones: sin Stripe, sin recordatorios, sin PWA, sin estadísticas premium).
**Agente:** `implementer` ejecuta una tarea a la vez.
**Formato de estado:** `[ ]` pendiente · `[x]` hecho · `[!]` bloqueado

---

## T-01 — Inicializar proyecto Next.js

**Estado:** `[ ]`
**Descripción:** Crear el proyecto base con el comando oficial y la configuración exacta del stack.
**Comando:**
```
npx create-next-app@latest habit-tracker --typescript --tailwind --app --src-dir --no-eslint
```
**Dependencias:** ninguna
**ADR:** 0001 (stack acordado: Next.js 15, TypeScript estricto, Tailwind)
**Criterio de hecho:** `npm run dev` levanta en `localhost:3000` y `tsc --noEmit` no reporta errores. El `tsconfig.json` tiene `"strict": true`.
**Prueba manual:** —

---

## T-02 — Configurar cliente Supabase y variables de entorno

**Estado:** `[ ]`
**Descripción:** Instalar `@supabase/supabase-js` y `@supabase/ssr`. Crear `src/lib/supabase/client.ts` (cliente para Client Components) y `src/lib/supabase/server.ts` (cliente para middleware y Server Components). Registrar `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` en `.env.local` y agregar `.env.local` a `.gitignore`.
**Dependencias:** T-01
**ADR:** 0001 (Client Components + cliente Supabase)
**Criterio de hecho:** `import { createClient } from '@/lib/supabase/client'` no da error de TypeScript. `.env.local` existe en disco y no aparece en `git status`.
**Prueba manual:** —

---

## T-03 — Configurar layout global: fuente Inter y tokens de color Tailwind

**Estado:** `[ ]`
**Descripción:** En `src/app/layout.tsx`, cargar la fuente Inter vía `next/font/google` y aplicarla al `<body>`. En `tailwind.config.ts`, extender la paleta con los colores de `docs/diseño.md`: primario (`violet-600`), fondo (`gray-50`), texto (`gray-900`), error (`red-500`), éxito (`emerald-500`). No tocar ningún otro archivo.
**Dependencias:** T-01
**ADR:** — (define el sistema visual de `docs/diseño.md`)
**Criterio de hecho:** `tsc --noEmit` pasa. El `<html>` en el DOM muestra la clase de fuente Inter aplicada al body. Los tokens de color están disponibles como clases Tailwind (verificable en `tailwind.config.ts`).
**Prueba manual:** —

---

## T-04 — Migración: tabla `habits` con RLS

**Estado:** `[ ]`
**Descripción:** Crear `supabase/migrations/[timestamp]_create_habits.sql` con la tabla `habits`: columnas `id uuid PK`, `user_id uuid (auth.users)`, `name varchar(60)`, `description varchar(280)`, `frequency enum('daily','weekly')`, `target_per_week int (1–7, nullable)`, `best_streak int default 0`, `archived_at timestamptz nullable`, `created_at timestamptz default now()`. Constraints: `UNIQUE(user_id, name) WHERE archived_at IS NULL`. Policy RLS SELECT/INSERT/UPDATE/DELETE: `auth.uid() = user_id`.
**Dependencias:** T-02
**ADR:** 0001 (modelo de datos normalizado, RLS con `auth.uid() = user_id`)
**Criterio de hecho:** `supabase db push` aplica la migración sin errores. Intentar insertar dos hábitos con el mismo nombre activo para el mismo `user_id` falla con error de constraint. La tabla aparece en el panel de Supabase dev con las policies listadas.
**Prueba manual:** —

---

## T-05 — Migración: tabla `checkins` con RLS

**Estado:** `[ ]`
**Descripción:** Crear `supabase/migrations/[timestamp]_create_checkins.sql` con la tabla `checkins`: columnas `id uuid PK`, `habit_id uuid (FK → habits.id ON DELETE CASCADE)`, `date date`, `done boolean default false`. Constraint: `UNIQUE(habit_id, date)`. Policy RLS: el usuario puede acceder a checkins cuyos hábitos le pertenecen (`habit_id IN (SELECT id FROM habits WHERE user_id = auth.uid())`).
**Dependencias:** T-04
**ADR:** 0001 (checkins(habit_id, date, done), UNIQUE(habit_id, date), toggle = UPSERT)
**Criterio de hecho:** `supabase db push` aplica la migración sin errores. Intentar insertar dos checkins para el mismo `(habit_id, date)` falla con error de constraint único.
**Prueba manual:** —

---

## T-06 — Página `/signup`

**Estado:** `[ ]`
**Descripción:** Crear `src/app/signup/page.tsx` como Client Component. Formulario con campos email y contraseña. Al enviar, llamar a `supabase.auth.signUp()`. Si el email ya existe, mostrar "Ese email ya tiene cuenta". Si tiene éxito, redirigir a `/onboarding`. Usar clases de `docs/diseño.md` (`Button`, `Input`, `FormField`).
**Dependencias:** T-04, T-03
**ADR:** 0001 (Supabase Auth email/password)
**Criterio de hecho:** Signup con email nuevo redirige a `/onboarding`. Signup con email existente muestra "Ese email ya tiene cuenta" y no crea duplicado en Supabase Auth. `tsc --noEmit` pasa.
**Prueba manual:** PT-1, PT-2

---

## T-07 — Página `/login`

**Estado:** `[ ]`
**Descripción:** Crear `src/app/login/page.tsx` como Client Component. Formulario con campos email y contraseña. Al enviar, llamar a `supabase.auth.signInWithPassword()`. Si las credenciales son inválidas, mostrar mensaje de error genérico. Si tiene éxito, redirigir a `/`. Si la URL contiene `?expired=1`, mostrar `Toast` con "Tu sesión expiró, ingresa de nuevo". Incluir enlace "¿Olvidaste tu contraseña?" que navega a `/reset`. Usar clases de `docs/diseño.md` (`Button`, `Input`, `FormField`).
**Dependencias:** T-06, T-10
**ADR:** 0001 (Supabase Auth email/password)
**Criterio de hecho:** Login con credenciales válidas redirige a `/`. Login con credenciales inválidas muestra mensaje de error y no redirige. El enlace "¿Olvidaste tu contraseña?" lleva a `/reset`. `tsc --noEmit` pasa.
**Prueba manual:** PT-3

---

## T-08 — Página `/reset` — recuperación de contraseña

**Estado:** `[ ]`
**Descripción:** Crear `src/app/reset/page.tsx` con dos estados controlados por la presencia del token de Supabase en la URL: (a) si no hay token — formulario para ingresar email, llamar a `supabase.auth.resetPasswordForEmail()`, mostrar confirmación "Revisa tu bandeja de entrada"; (b) si hay token (Supabase lo inyecta en el hash de la URL al regresar del email) — formulario para ingresar nueva contraseña, llamar a `supabase.auth.updateUser({ password })`, redirigir a `/login` al completar.
**Dependencias:** T-07
**Prerequisito externo:** el servicio de email de Supabase debe estar configurado antes de verificar el estado (a). En el proyecto Supabase dev: ir a *Authentication → Email Templates* y confirmar que la plantilla `Reset Password` apunta a `http://localhost:3000/reset`. Si se usa SMTP propio, configurar `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` en el dashboard antes de ejecutar esta tarea.
**ADR:** 0001 (Supabase Auth)
**Criterio de hecho:** Estado (a): el formulario acepta un email y muestra "Revisa tu bandeja de entrada"; el evento `password_recovery` aparece en *Authentication → Logs* del dashboard de Supabase dev. Estado (b): al ingresar nueva contraseña y confirmar, el login posterior con esa contraseña funciona. `tsc --noEmit` pasa.
**Prueba manual:** PT-4

---

## T-09 — Middleware de sesión y guards de rutas

**Estado:** `[ ]`
**Descripción:** Crear `src/middleware.ts` siguiendo el patrón oficial de `@supabase/ssr` (ver [docs](https://supabase.com/docs/guides/auth/server-side/nextjs)). El middleware refresca el token en cada request y llama a `supabase.auth.getUser()` para verificar la sesión. Rutas protegidas (`/`, `/habito/:path*`, `/archivados`, `/onboarding`, `/estadisticas`, `/cuenta`): si `getUser()` devuelve `null`, redirigir a `/login`. Para la sesión expirada irrecuperable, el middleware ya redirige a `/login`; pasar `?expired=1` en la URL de redirección para que la página `/login` pueda mostrar el toast (implementado en T-11). No implementar lógica de sesión fuera del middleware — `@supabase/ssr` gestiona el refresh automáticamente.
**Dependencias:** T-08
**ADR:** 0002 (middleware para session refresh y guards de rutas)
**Criterio de hecho:** Acceder a `/` sin sesión redirige a `/login`. Acceder con sesión activa carga la página normalmente. `tsc --noEmit` pasa.
**Prueba manual:** PT-5, PT-6

---

## T-10 — Componente `Toast`

**Estado:** `[ ]`
**Descripción:** Crear `src/components/Toast.tsx` como Client Component reutilizable. Props: `message: string`, `type: 'error' | 'info'`, `onClose: () => void`. Usar clases exactas de `docs/diseño.md`: `fixed bottom-4 left-1/2 -translate-x-1/2 rounded-lg bg-gray-900 text-white text-sm px-4 py-2 shadow-lg`. El componente no gestiona estado propio — lo controla el padre. No usar librerías externas de toasts.
**Dependencias:** T-03
**ADR:** —
**Criterio de hecho:** Renderizar `<Toast message="No se pudo guardar, intenta de nuevo" type="error" onClose={() => {}} />` muestra el toast en la posición correcta con las clases de `docs/diseño.md`. `tsc --noEmit` pasa.
**Prueba manual:** —

---

## T-11 — Header con botón de logout

**Estado:** `[ ]`
**Descripción:** Crear `src/components/Header.tsx` como Client Component. Incluye botón "Cerrar sesión" que llama a `supabase.auth.signOut()` y redirige a `/login`. La sesión expirada es gestionada por el middleware (T-09), que redirige a `/login?expired=1`; el Header no necesita detectarla. Si `signOut()` lanza un error inesperado, mostrar `Toast` con el mensaje de error.
**Dependencias:** T-09, T-10
**ADR:** 0001 (Client Components + Supabase client)
**Criterio de hecho:** El botón "Cerrar sesión" cierra la sesión y redirige a `/login`. El componente `Toast` se muestra correctamente dentro del Header cuando se inyecta el mensaje. `tsc --noEmit` pasa.
**Prueba manual:** PT-5, PT-6

---

## T-12 — Página `/onboarding`

**Estado:** `[ ]`
**Descripción:** Crear `src/app/onboarding/page.tsx`. Una sola pantalla con texto introductorio y botón "Crear tu primer hábito" que navega a `/`. Esta página solo renderiza contenido estático; la decisión de cuándo redirigir al usuario aquí es responsabilidad de T-14 (home page detecta 0 hábitos activos y redirige).
**Dependencias:** T-11
**ADR:** —
**Criterio de hecho:** La página `/onboarding` carga con el texto introductorio y el botón "Crear tu primer hábito". El botón navega a `/`. `tsc --noEmit` pasa.
**Prueba manual:** PT-7

---

## T-13 — Formulario de creación de hábito (`HabitForm`)

**Estado:** `[ ]`
**Descripción:** Crear `src/components/HabitForm.tsx` como Client Component (modal). Campos: `nombre` (1–60 chars, trim, required), `descripción` (0–280 chars, opcional), `frecuencia` (radio `diaria`/`semanal`), `target_per_week` (número 1–7, visible solo si frecuencia = `semanal`). Validación en cliente antes de enviar. Al confirmar, `INSERT INTO habits` con `user_id = auth.uid()`. Si nombre duplicado, mostrar "Ya tienes un hábito activo con ese nombre". Invalidar caché SWR de hábitos tras inserción exitosa.
**Dependencias:** T-12, T-04
**ADR:** 0001 (modelo de datos: habits)
**Criterio de hecho:** Crear hábito "Leer" diario inserta la fila con `frequency = 'daily'` en la tabla `habits` (verificable en panel Supabase) y el formulario se cierra sin recargar. Crear hábito "Ejercicio" semanal con `target_per_week = 3` inserta con `frequency = 'weekly'` y `target_per_week = 3`. Intentar crear con nombre duplicado muestra el mensaje y no inserta. `tsc --noEmit` pasa.
**Prueba manual:** PT-9, PT-14

---

## T-14 — Página `/` — lista de hábitos del día

**Estado:** `[ ]`
**Descripción:** Crear `src/app/page.tsx` como Client Component. Usar `useSWR` para obtener hábitos activos del usuario (`SELECT * FROM habits WHERE archived_at IS NULL ORDER BY created_at`). Si la respuesta es un array vacío (0 hábitos activos), redirigir a `/onboarding` (cubre el caso de login de usuario sin hábitos). Si hay hábitos, renderizar un `HabitCard` por hábito (de `docs/diseño.md`). Incluir botón "Nuevo hábito" que abre `HabitForm`. Incluir `Header` con logout.
**Dependencias:** T-13
**ADR:** 0001 (Client Components + SWR)
**Criterio de hecho:** Con un usuario que tiene 3 hábitos activos en la tabla `habits`, la página muestra exactamente 3 tarjetas. Crear un nuevo hábito vía `HabitForm` actualiza la lista a 4 tarjetas sin recargar. `tsc --noEmit` pasa.
**Prueba manual:** PT-8

---

## T-15 — Toggle check-in en `/`

**Estado:** `[ ]`
**Descripción:** Agregar componente `ToggleCheck` (de `docs/diseño.md`) a cada `HabitCard` en `/`. Al hacer toggle: UPSERT en `checkins(habit_id, date, done)` donde `date = new Date().toLocaleDateString('sv')` (formato YYYY-MM-DD en TZ del navegador). Aplicar actualización optimista con SWR `mutate`. Si el UPSERT falla, mostrar `Toast` "No se pudo guardar, intenta de nuevo" y revertir el estado optimista.
**Dependencias:** T-14, T-05
**ADR:** 0001 (toggle = UPSERT, date en TZ del navegador)
**Criterio de hecho:** El toggle persiste al recargar la página (la fila existe en la tabla `checkins` en Supabase). Al bloquear el endpoint de Supabase en devtools (Network > Block request URL), el toggle revierte y aparece el toast. `tsc --noEmit` pasa.
**Prueba manual:** PT-18, PT-37

---

## T-16 — Página `/habito/[id]` — estructura y franja de 14 días

**Estado:** `[ ]`
**Descripción:** Crear `src/app/habito/[id]/page.tsx`. Obtener el hábito y sus checkins de los últimos 14 días con SWR. Renderizar `StreakStrip` (14 celdas, de `docs/diseño.md`) coloreando cada celda según si existe checkin con `done = true` para esa fecha. Mostrar el campo `nombre` y `frecuencia` del hábito. Si el hábito no pertenece al usuario autenticado, devolver 404 (`notFound()` de Next.js). El cálculo numérico de racha se implementa en T-17.
**Dependencias:** T-15
**ADR:** 0001 (lógica de racha, best_streak en habits)
**Criterio de hecho:** La página carga el nombre del hábito y `StreakStrip` con exactamente 14 celdas. Acceder con ID de hábito de otro usuario muestra página 404. `tsc --noEmit` pasa.
**Prueba manual:** PT-22, PT-33 (parcial — solo el paso 3: acceso con ID ajeno devuelve 404; los pasos 1-2 de PT-33 requieren T-19 completada)

---

## T-17 — Cálculo de racha en `/habito/[id]`

**Estado:** `[ ]`
**Descripción:** Crear función pura `calcStreak(checkins: Checkin[], frequency: 'daily' | 'weekly', targetPerWeek: number): number` en `src/lib/streak.ts`. Para `daily`: contar días consecutivos con `done = true` terminando en hoy. Para `weekly`: contar semanas ISO consecutivas con ≥ `target_per_week` checkins completos. Integrar en `/habito/[id]` (T-16): mostrar racha numérica con etiqueta "Empieza hoy" si racha = 0. Tras calcular la racha, persistir el máximo histórico: `UPDATE habits SET best_streak = GREATEST(best_streak, racha_calculada) WHERE id = habit_id AND user_id = auth.uid()` usando `src/lib/supabase/client.ts`.
**Dependencias:** T-16
**ADR:** 0001 (lógica de racha, best_streak persistido en habits), 0002
**Criterio de hecho:** Hábito `daily` con checkins en los últimos 3 días consecutivos muestra racha = 3. Hábito `daily` sin checkins muestra racha = 0 y "Empieza hoy". Hábito `weekly` con 2 semanas completas consecutivas muestra racha = 2. La columna `best_streak` en `habits` refleja el máximo histórico (verificable en panel Supabase). `tsc --noEmit` pasa.
**Prueba manual:** PT-19, PT-20

---

## T-18 — Edición de hábitos

**Estado:** `[ ]`
**Descripción:** Agregar botón "Editar" en `/habito/[id]` que abre `HabitForm` pre-llenado con los datos actuales. Al guardar, `UPDATE habits SET name=..., description=..., frequency=..., target_per_week=... WHERE id=... AND user_id=auth.uid()`. Validar los mismos constraints que en creación (nombre único entre activos, longitudes). Invalidar caché SWR al guardar.
**Dependencias:** T-17
**ADR:** 0001 (modelo de datos: habits)
**Criterio de hecho:** Editar nombre y frecuencia de un hábito persiste al recargar (verificable en tabla `habits`). Renombrar a un nombre de otro hábito activo muestra el mensaje de error y no actualiza. `tsc --noEmit` pasa.
**Prueba manual:** PT-13

---

## T-19 — Archivado, desarchivado y página `/archivados`

**Estado:** `[ ]`
**Descripción:** Agregar botón "Archivar" en `/habito/[id]` que hace `UPDATE habits SET archived_at = now()`. Crear `src/app/archivados/page.tsx` listando hábitos con `archived_at IS NOT NULL`, con botón "Desarchivar" que hace `UPDATE habits SET archived_at = null`. En la lógica de toggle (T-15), agregar validación: si el hábito tiene `archived_at IS NOT NULL`, rechazar con error 400.
**Dependencias:** T-18
**ADR:** 0001 (archived_at = soft-delete reversible)
**Criterio de hecho:** Archivar quita el hábito de `/` y lo muestra en `/archivados`. Desarchivar lo devuelve a `/` y acepta toggles. Intentar toggle en hábito archivado vía petición directa al endpoint devuelve 400. `tsc --noEmit` pasa.
**Prueba manual:** PT-15, PT-16, PT-17

---

*Siguiente bloque:* plan de extensiones (Stripe, estadísticas premium, recordatorios por email, PWA, compartir).

---
*Total tareas: T-01 a T-19 (19 tareas)*
