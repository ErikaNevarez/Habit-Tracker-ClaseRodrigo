# CONTEXT.md

Registro de decisiones manuales, excepciones y acciones ejecutadas fuera de agentes.

---

## 2026-06-12 — Merge de ADRs iniciales

**Acción manual:** rama `docs/adrs-iniciales` creada desde `develop`, commit `docs: tres ADRs iniciales del proyecto`, mergeada a `develop`.

---

## 2026-06-12 — Ajustes manuales a plan.md tras crítica del Prompt 11.2

**Acción manual:** edición de `plan.md` en rama `docs/plan-inicial` para corregir dos problemas detectados en la revisión crítica.

**Cambio 1 — Separar T-02 en dos tareas independientes.**
- T-02 quedó como infraestructura pura: instalación de `@supabase/supabase-js` + `@supabase/ssr`, creación de `src/lib/supabase/client.ts` y `src/lib/supabase/server.ts`, variables de entorno.
- T-03 (nueva): configuración del layout global — fuente Inter vía `next/font/google` y tokens de color Tailwind según `docs/diseño.md`. Depende solo de T-01, corre en paralelo con T-02.
- Justificación: configurar el cliente Supabase es infraestructura de datos; configurar la fuente y los tokens es fundación de UI. Son superficies de fallo independientes y deben poder completarse y verificarse por separado.

**Cambio 2 — Separar T-13 (edición + archivado mezclados) en T-14 y T-15.**
- T-14: edición de hábitos únicamente (UPDATE con validaciones, pre-llenado de HabitForm).
- T-15: archivado, desarchivado y página `/archivados`.
- Justificación: la tarea original cubría 4 pruebas manuales distintas (PT-13, PT-15, PT-16, PT-17) y claramente excedía 1 hora. Son flujos de usuario independientes con lógica y rutas distintas.

**Cascada 1:** todas las tareas desde la antigua T-03 se renumeraron +1 (T-04 a T-15). Las referencias de dependencias se actualizaron en consecuencia.

---

## 2026-06-12 — Segunda ronda de ajustes manuales a plan.md

**Cambio — Separar T-07 (antiguo) en T-07 y T-08.**
- T-07: página `/login` únicamente (formulario, signIn, enlace a /reset).
- T-08: página `/reset` con sus dos estados — (a) solicitud de link y (b) actualización de contraseña con token en URL.
- Justificación: `/reset` tiene lógica propia con dos sub-flujos condicionales; mezclarlo con `/login` hacía T-07 la tarea más compleja del plan y difícil de verificar atómicamente. Cada página tiene ahora su propia prueba manual referenciada (PT-3 y PT-4 respectivamente).

**Cascada 2:** todas las tareas desde la antigua T-08 se renumeraron +1 (nueva numeración: T-09 a T-16). El plan queda con 16 tareas en el núcleo. Las referencias de dependencias se actualizaron en consecuencia.

---

## 2026-06-12 — Prerequisito externo agregado a T-08

**Cambio:** se agregó sección `Prerequisito externo` a T-08 (`/reset`).
**Contenido:** configurar el servicio de email de Supabase (plantilla `Reset Password` apuntando a `localhost:3000/reset` y, opcionalmente, SMTP propio para evitar el límite de 3 emails/hora del SMTP de Supabase dev) antes de ejecutar la tarea.
**Justificación:** el criterio de hecho de T-08 requiere que el email de recuperación se envíe; sin el servicio de email activo la tarea no puede verificarse completamente. Dependencia listada explícitamente para que el implementer no quede bloqueado sin contexto.

---

## 2026-06-12 — Tercera ronda de ajustes manuales: split de T-09 en tres tareas

**Cambio — Separar T-09 (antiguo "Middleware + Toast + Header") en T-09, T-10 y T-11.**
- T-09: Middleware de sesión y guards de rutas (depends T-08).
- T-10: Componente `Toast` reutilizable — UI pura, depends T-03 (solo necesita tokens Tailwind).
- T-11: Header con botón de logout (depends T-09 + T-10).
**Justificación:** los tres artefactos pueden fallar de forma independiente y tienen superficies de prueba distintas. `Toast` es un componente UI sin dependencia de Supabase. El Header consume tanto el middleware (para signOut) como el Toast (para notificaciones), por lo que es natural que cierre la cadena.
**Cascada 3:** todas las tareas desde la antigua T-10 se renumeraron +2 (nueva numeración: T-12 a T-18). El plan queda con 18 tareas en el núcleo. El archivo se reescribió completo para corregir numeración duplicada generada por edits incrementales previos.

---

## 2026-06-12 — Ajuste a T-09: quitar prescripción de manejo de sesión en SWR

**Cambio:** reescritura del campo `Descripción` de T-09 (Middleware de sesión con `@supabase/ssr`).
**Problema anterior:** la descripción prescribía capturar `AuthSessionMissingError` en la capa SWR y redirigir a `/login` desde el cliente. Esto contradice el patrón de `@supabase/ssr`, que maneja el refresh de sesión server-side en el middleware y redirige automáticamente — intervenir en SWR es redundante y puede generar conflictos.
**Cambio aplicado:** la descripción ahora remite al patrón oficial de `@supabase/ssr` (docs), instruye usar `supabase.auth.getUser()` en el middleware para decidir la redirección, pasar `?expired=1` en la URL de redirección para que `/login` muestre el toast, y prohíbe explícitamente implementar lógica de sesión fuera del middleware.
**Sin cascada:** no hay afectaciones en otras tareas. T-11 (Header) y T-10 (Toast) ya dependen de T-09 correctamente. ⚠️ Afectación detectada post-fix: T-11 seguía referenciando "AuthSessionMissingError en la capa SWR (configurado en T-09)" — corregida en el fix del Problema 6.

---

## 2026-06-12 — Problema 6: quitar ambigüedad de redirect a /onboarding

**Problema:** T-12 prescribía lógica de redirect en T-07 ("en el redirect de T-07 tras `signInWithPassword` exitoso, consultar si el usuario ya tiene hábitos...") — un backwards dependency que obliga al implementer de T-12 a volver a modificar código de T-07 ya entregado. Además T-07 tenía el paréntesis ambiguo "(la lógica de onboarding vs `/` se implementa en T-12)".

**Cambios aplicados:**
- **T-07 (login):** siempre redirige a `/` tras login exitoso. Agrega: si URL tiene `?expired=1`, mostrar Toast "Tu sesión expiró" (emitido por el middleware de T-09).
- **T-11 (Header):** elimina la referencia stale a `AuthSessionMissingError en SWR`. El Header maneja solo el signOut explícito; la sesión expirada la gestiona el middleware.
- **T-12 (onboarding):** página solo renderiza contenido estático. Elimina la consulta prescrita a `habits`. La decisión de redirect es responsabilidad de T-14.
- **T-14 (home):** si `useSWR` retorna 0 hábitos activos, redirigir a `/onboarding`. Este es el punto correcto: el home ya tiene el array de hábitos disponible y puede decidir sin query adicional.

**Sin cascada de numeración.** PT-7 y PT-8 siguen cubriendo T-12 (la prueba verifica que el usuario con 0 hábitos ve /onboarding — ahora el flujo pasa por T-14 → redirect → T-12).

---

## 2026-06-12 — Última ronda de ajustes manuales a plan.md (problemas 7/8, 9, 10 de la crítica)

### Problema 7/8 — T-13 HabitForm criterio incompleto

**Cambio:** ampliación del criterio de hecho de T-13.
**Problema:** el criterio solo cubría la ruta `daily`; no verificaba que un hábito `weekly` con `target_per_week` se insertara correctamente, pese a que la descripción prescribe ese campo.
**Corrección:** el criterio ahora exige crear un hábito "Ejercicio" `weekly` con `target_per_week = 3` y verificar que la fila refleje `frequency = 'weekly'` y `target_per_week = 3` en el panel Supabase.

### Problema 9 — T-14 criterio requería segunda cuenta

**Cambio:** reescritura del criterio de hecho de T-14.
**Problema:** "lista exactamente los hábitos del usuario autenticado" solo es verificable sin ambigüedad si existe una segunda cuenta para confirmar aislamiento — una precondición que convierte el criterio en una prueba de integración de RLS, no de la página.
**Corrección:** el criterio ahora es autocontenido: "con un usuario que tiene 3 hábitos en la tabla, la página muestra 3 tarjetas; crear uno nuevo actualiza a 4 sin recargar". El aislamiento por RLS ya fue verificado en T-04 (migración).

### Problema 10 — T-16 excede 1 hora → split en T-16 + T-17 (nueva)

**Cambio:** T-16 se dividió en dos tareas. T-17 (antigua edición) pasa a T-18; T-18 (antiguo archivado) pasa a T-19. El plan queda con 19 tareas (T-01 a T-19).

- **T-16 (nueva):** scaffold de `/habito/[id]` — fetch con SWR, `StreakStrip` visual (14 celdas coloreadas por checkins), nombre + frecuencia del hábito, 404 guard. Sin cálculo numérico de racha.
- **T-17 (nueva):** función pura `calcStreak` en `src/lib/streak.ts` para `daily` (días consecutivos) y `weekly` (semanas ISO con ≥ target_per_week). Integración en la página de T-16.

**Justificación:** el cálculo de racha weekly e ISO-week es el componente más propenso a bugs del proyecto; separarlo en su propia tarea permite que la UI de la página (T-16) se verifique con PT-22/PT-33 antes de agregar la lógica compleja.

**Cascada 4:** T-17 (edición) → T-18; T-18 (archivado) → T-19. Dependencias actualizadas en consecuencia.

### Problema 11 — T-18 tarea más grande

**Estado:** ya resuelta en rondas anteriores (split de edición/archivado en T-17/T-18 → ahora T-18/T-19). No requirió acción adicional.

---

## 2026-06-12 — Compuerta de trazabilidad (Prompt 11.3): correcciones post-análisis

### Hallazgo 1 — CONTRADICCIÓN T-09 vs ADR 0001

**Acción:** creado `docs/adr/0002-middleware-session-refresh-y-guards-de-rutas.md`.
El ADR 0001 descartó middleware como mecanismo de *validación de autorizaciones de negocio*; ADR 0002 formaliza middleware como capa de *session refresh y route guard de UX* — responsabilidades distintas. T-09 actualiza su referencia de ADR: 0001 → 0002.

### Hallazgo 2 — BRECHA best_streak nunca se actualiza

**Acción:** T-17 ampliada para persistir `best_streak`:
- Descripción añade: tras calcular la racha, `UPDATE habits SET best_streak = GREATEST(best_streak, racha_calculada)`.
- Criterio de hecho añade: verificar `best_streak` en panel Supabase tras navegar al hábito.
- ADR referenciado: 0001 + 0002.

### Hallazgo 3 — T-07 depende de T-10 sin declararlo

**Acción:** `T-07 Dependencias: T-06` → `T-06, T-10`. Eliminada la nota "cuando T-10 esté implementado" (ya no es una dependencia implícita).

### Hallazgo 4 — PT-8 asignado a T-12; lógica en T-14

**Acción:** PT-8 movido de T-12 a T-14. T-12 (página estática) queda con PT-7 únicamente. T-14 (home con redirect 0 hábitos) pasa de sin prueba a PT-8.

### Hallazgo 5 — PT-33 en T-16 cubre solo el paso 3

**Acción:** anotación añadida en T-16 aclarando que PT-33 se ejecuta parcialmente (solo paso 3: 404 guard) y se completa tras T-19 (`/archivados` implementado).

### Hallazgo 6 — criterio de T-19 presupone API route

**Estado:** no se corrige en esta iteración. El usuario no aprobó acción sobre este hallazgo. Queda como deuda conocida para el implementer.


