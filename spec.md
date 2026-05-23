# Spec — Habit Tracker

## Objetivo

Una app web (PWA instalable) para personas que quieren sostener hábitos diarios o semanales, registrar hecho/no-hecho del día y ver su racha, con un plan gratuito acotado y un plan premium de pago que desbloquea estadísticas y mayor capacidad. Sin elementos sociales, sin gamificación agresiva, sin ranking.

## Scope

### Sí entra

- **Auth:** signup con email + contraseña, login, logout, recuperación de contraseña por email (todo vía Supabase Auth). Sin OAuth, sin verificación de email obligatoria.
- **Hábitos (CRUD + archivar/desarchivar):** cada hábito tiene `nombre` (1–60 chars, trim, libre), `descripción` (0–280 chars, opcional), `frecuencia` (`diaria` o `semanal`), y si es semanal un `target_per_week` (1–7). Archivar es soft-delete reversible vía `archived_at`. Nombre único por usuario entre hábitos activos.
- **Registro diario:** toggle hecho/no-hecho del día actual por hábito, en la pantalla principal `/`. Estado binario, único por (hábito, día). La fecha se calcula en el cliente con la TZ del navegador y se guarda como `DATE`.
- **Vista de progreso:** racha actual y franja visual de los últimos 14 días (incluyendo hoy) por hábito, en `/habito/[id]`.
- **Estadísticas (premium):** vista `/estadisticas` con % de cumplimiento de los últimos 30 días y mejor racha histórica por hábito (incluye hábitos archivados, etiquetados como tales).
- **Recordatorios por email (premium y free):** cada hábito puede tener una hora opcional de recordatorio. Se envía email a esa hora si el hábito no está marcado "hecho" del día.
- **Planes y pago:** Free hasta 3 hábitos activos sin acceso a `/estadisticas`. Premium hasta 30 hábitos activos con acceso a `/estadisticas`. Suscripción mensual gestionada con Stripe Checkout + webhooks. Página `/cuenta` muestra plan vigente y permite cancelar o reactivar.
- **Gamificación suave:** modal de celebración al cruzar racha de 7 y 30 días por primera vez en un hábito.
- **Compartir:** botón "compartir racha" en `/habito/[id]` que invoca Web Share API con texto plano del logro.
- **Onboarding mínimo:** una sola pantalla `/onboarding` post-signup con CTA "Crear tu primer hábito".
- **PWA:** manifest + service worker. La pantalla del día (`/`) es accesible offline en modo read-only mostrando el último estado sincronizado.
- **Persistencia:** Supabase Postgres con Row Level Security. Migraciones en `supabase/migrations/`. Dev y prod son dos proyectos Supabase distintos.
- **Stack:** Next.js 15 App Router, TypeScript estricto, Tailwind, Client Components + cliente Supabase + SWR.

### No entra

- OAuth (Google/Apple/GitHub) ni verificación de email obligatoria.
- Color, ícono, categorías, notas por día, reordenamiento de hábitos.
- Hard-delete de hábitos.
- Check-in de días pasados o futuros.
- Selector de zona horaria configurable.
- Estados intermedios (parcial, saltado).
- Hábitos compartidos entre usuarios, feed social, ranking, comentarios.
- Badges, niveles, puntos, retos.
- Notificaciones push, SMS, ni mensajes motivacionales programados (solo emails de recordatorio configurados por hábito).
- Importar/exportar datos.
- Modo enfoque, heatmap anual.
- App nativa iOS/Android.
- Modo offline con escritura (solo read-only).
- Tests automatizados, optimización de Core Web Vitals, WCAG AA completo, i18n.

## Criterios de aceptación

### Auth

1. Dado un visitante sin sesión, cuando llena email y contraseña válidos en `/signup`, entonces queda autenticado, se le crea cuenta y aterriza en `/onboarding`.
2. Dado un visitante intentando `/signup` con un email ya registrado, cuando envía el form, entonces ve el mensaje "Ese email ya tiene cuenta" y la cuenta no se duplica.
3. Dado un visitante sin sesión, cuando ingresa credenciales válidas en `/login`, entonces queda autenticado y aterriza en `/`.
4. Dado un visitante en `/login` que clickea "¿Olvidaste tu contraseña?", cuando ingresa un email y envía, entonces recibe un email con link de reset que al usarse permite definir nueva contraseña en `/reset` y autenticarse.
5. Dado un usuario autenticado en cualquier ruta, cuando clickea "Cerrar sesión" en el header, entonces se cierra la sesión y se le redirige a `/login`.
6. Dado un usuario con sesión expirada, cuando intenta una acción autenticada, entonces se le redirige a `/login` con un toast "Tu sesión expiró, ingresa de nuevo".

### Onboarding

7. Dado un usuario que acaba de hacer signup, cuando aterriza en `/onboarding`, entonces ve una sola pantalla con texto introductorio y CTA "Crear tu primer hábito" que lo lleva al formulario de creación.
8. Dado un usuario que ya completó signup en una sesión previa, cuando hace login, entonces aterriza en `/` directamente, no en `/onboarding`.

### Hábitos

9. Dado un usuario plan Free con 0–2 hábitos activos, cuando crea un hábito con nombre "Leer" y frecuencia "diaria", entonces el hábito aparece en `/` sin recargar.
10. Dado un usuario plan Free con 3 hábitos activos, cuando intenta crear un cuarto, entonces ve un modal "Alcanzaste el límite de 3 hábitos. Sube a Premium para crear más" con CTA a `/cuenta`.
11. Dado un usuario plan Premium con 0–29 hábitos activos, cuando crea uno más, entonces se crea exitosamente.
12. Dado un usuario plan Premium con 30 hábitos activos, cuando intenta crear otro, entonces ve "Alcanzaste el límite de 30 hábitos activos" y no se crea.
13. Dado un usuario con un hábito existente, cuando edita su nombre, descripción, frecuencia o target_per_week dentro de los límites de validación, entonces los cambios se persisten y se reflejan al recargar.
14. Dado un usuario que intenta crear o renombrar un hábito con el mismo nombre que otro hábito activo suyo, cuando envía el form, entonces ve "Ya tienes un hábito activo con ese nombre" y la operación se rechaza.
15. Dado un usuario que archiva un hábito, cuando vuelve a `/`, entonces el hábito ya no aparece en la lista del día; sigue visible en `/archivados`.
16. Dado un hábito archivado en `/archivados`, cuando el usuario clickea "Desarchivar", entonces vuelve a aparecer en `/` y acepta toggles nuevos.
17. Dado un usuario que intenta marcar hecho/no-hecho un hábito archivado vía URL directa o API, cuando lo intenta, entonces la operación se rechaza con error 400 "Hábito archivado".

### Registro diario y racha

18. Dado un hábito activo en `/`, cuando el usuario hace toggle a "hecho", entonces el estado se persiste y se mantiene "hecho" al recargar la página en ≤5 segundos y al iniciar sesión desde otro dispositivo.
19. Dado un hábito diario recién creado sin ningún check-in, entonces la racha mostrada es 0 con la etiqueta "Empieza hoy".
20. Dado un hábito diario con check-in "hecho" en cada uno de los últimos N días consecutivos terminando hoy, entonces la racha mostrada es N. Si existe un día sin "hecho" entre hoy y el último "hecho", la racha es 0.
21. Dado un hábito semanal con `target_per_week = T`, entonces la racha cuenta el número de semanas consecutivas (terminando en la semana actual o anterior) en las que el usuario alcanzó ≥T check-ins "hecho". Una semana sin ≥T rompe la racha.
22. Dado un hábito con historial, cuando el usuario entra a `/habito/[id]`, entonces ve una franja de 14 celdas incluyendo hoy: celda verde = hecho, roja = no-hecho, gris vacía = anterior a `created_at`.
23. Dado un hábito que cruza por primera vez racha de 7 días, cuando el toggle del día 7 se completa, entonces aparece un modal de celebración "¡Racha de 7!" descartable. Lo mismo para racha 30.

### Estadísticas y plan

24. Dado un usuario Free que entra a `/estadisticas`, entonces ve una pantalla "Estadísticas es premium" con CTA a `/cuenta` para suscribirse.
25. Dado un usuario Premium en `/estadisticas`, entonces ve, por cada hábito activo y archivado: nombre, % cumplimiento últimos 30 días (definido abajo), mejor racha histórica.
26. Para un hábito diario, el % cumplimiento = `días_hechos_en_ventana / días_activos_en_ventana`. "Días activos en ventana" = días entre `MAX(created_at, hoy − 29)` y `MIN(archived_at − 1 día, hoy)`, ambos inclusive.
27. Para un hábito semanal con target T, el % cumplimiento = `semanas_con_≥T_hechos / semanas_activas_en_ventana`, con la misma regla de acotación por `created_at` y `archived_at`.
28. Para un hábito archivado en `/estadisticas`, se muestra la etiqueta "Archivado" junto al nombre y el % se calcula solo sobre su período activo dentro de la ventana.
29. Dado un usuario Free en `/cuenta` que clickea "Activar Premium", cuando completa el flujo de Stripe Checkout con tarjeta válida, entonces tras el redirect vuelve a `/cuenta` y ve plan = Premium en ≤10 segundos (tras webhook).
30. Dado un usuario Premium en `/cuenta` que cancela, cuando confirma, entonces el plan se marca "Premium hasta DD/MM/YYYY" y al expirar el periodo se convierte en Free; si tenía >3 hábitos activos, el exceso queda en read-only (visible pero sin poder toggle) hasta que archive o reduzca a 3 o reactive el plan.

### Recordatorios

31. Dado un usuario que edita un hábito y le pone hora de recordatorio "08:00", cuando llega esa hora local y el hábito no está marcado "hecho" del día, entonces recibe un email con asunto "Recordatorio: [nombre del hábito]" y link a la app. Si ya está "hecho", no se envía email.
32. Dado un hábito sin hora de recordatorio configurada, entonces nunca se envían emails para ese hábito.

### Aislamiento entre usuarios (UI)

33. Dado un usuario A y un usuario B con hábitos creados, cuando A inicia sesión y abre `/`, `/estadisticas`, `/archivados` o cualquier `/habito/[id]`, entonces solo ve hábitos creados por A; intentar abrir `/habito/[id]` con un id de B muestra 404.

### Compartir y PWA

34. Dado un usuario en `/habito/[id]` con racha ≥1, cuando clickea "Compartir racha", entonces se invoca Web Share API con texto "Llevo N días con [nombre del hábito]" (si el navegador no soporta Web Share, el botón no aparece).
35. Dado un usuario que visitó `/` al menos una vez con sesión activa, cuando pierde conexión y entra a `/`, entonces ve la lista de hábitos del día y su último estado sincronizado en modo read-only, con banner "Sin conexión".
36. Dado un usuario en navegador compatible, cuando entra a la app por primera vez, entonces puede instalarla como PWA usando el prompt nativo del navegador.

### Errores

37. Dado un toggle, creación o edición que falla por red o servidor, cuando el usuario lo intenta, entonces aparece un toast no-bloqueante "No se pudo guardar, intenta de nuevo" y la UI no queda en estado inconsistente.

## No-goals

- OAuth, verificación de email obligatoria, recuperación por SMS.
- Hard-delete, color, ícono, descripción >280 chars, reordenamiento.
- Check-in de días pasados o futuros, estados intermedios, TZ configurable.
- Más de 30 hábitos activos por usuario.
- Hábitos compartidos entre usuarios, feed social, ranking, comentarios, perfiles públicos.
- Badges, niveles, puntos, retos, recompensas materiales.
- Notificaciones push, SMS, mensajes motivacionales programados.
- Importar/exportar datos en CSV/JSON.
- Modo enfoque, heatmap anual, categorías, filtros, etiquetas, notas por día.
- App nativa iOS/Android.
- Modo offline con escritura.
- Multi-idioma (la app es solo en español).
- Tests automatizados (unit, integración, e2e).
- Optimización avanzada de Core Web Vitals, SSR/ISR estratégico.
- Accesibilidad WCAG AA completa, navegación por teclado avanzada.
- Más de un plan de pago (solo Free y Premium mensual; no anual, no equipos, no familia).

## Pruebas técnicas fuera de QA manual

Estas pruebas requieren acceso a la base de datos o a herramientas de desarrollo; no las realiza el QA de UI:

- **RLS aislamiento:** autenticarse como usuario A vía el cliente Supabase y ejecutar `select * from habits` y `select * from checkins`; debe devolver solo filas de A. Repetir con `service_role` desde un script para verificar que las policies existen y son `using (auth.uid() = user_id)`.
- **Webhook de Stripe:** simular eventos `checkout.session.completed`, `customer.subscription.deleted`, `customer.subscription.updated` con la CLI de Stripe contra el endpoint local y verificar que la tabla `subscriptions` se actualiza correctamente.
- **Unicidad y constraints:** intentar insertar dos checkins para `(habit_id, date)` y dos hábitos activos con el mismo `(user_id, name)`; ambos deben fallar con error de constraint.
- **Job de recordatorios:** verificar que el cron (Supabase Edge Function o equivalente) que dispara emails se ejecuta a la cadencia esperada y que respeta la hora local del usuario.

## Decisiones tomadas en entrevista

### Ronda 1 — Datos
- Frecuencia semanal = N veces por semana; columna `habits.target_per_week INT` (1–7).
- Check-in = `checkins(habit_id, date DATE, done BOOL)`, UNIQUE(habit_id, date); toggle = UPSERT.
- Archivado = `habits.archived_at TIMESTAMPTZ NULL`; reversible.
- Unicidad: `UNIQUE(user_id, name) WHERE archived_at IS NULL` + `UNIQUE(habit_id, date)`.
- Mejor racha persistida en `habits.best_streak INT`, actualizada por la action de toggle.
- Checkins de hábitos archivados se conservan; no se aceptan toggles nuevos; archivado es reversible.
- Fecha = `DATE` calculada en el cliente con la TZ del navegador.

### Ronda 2 — QA
- Sincronía multi-dispositivo: ≤5s al recargar, sin caching agresivo.
- Racha inicial = 0 con etiqueta UI "Empieza hoy" para hábitos sin checkins.
- Franja: 14 celdas incluyendo hoy; días previos a `created_at` = gris vacío.
- % cumplimiento 30d definido por hábito diario (días hechos / días activos en ventana) y semanal (semanas con ≥target / semanas activas en ventana), acotado por `created_at` y `archived_at`.
- Archivados en stats: siempre visibles, etiquetados, denominador acotado por `archived_at`.
- Aislamiento de usuarios reformulado como criterio de UI observable; RLS profunda va a "Pruebas técnicas fuera de QA manual".
- Signup, logout y reset password con criterios explícitos.

### Ronda 3 — Developer
- Client Components + cliente Supabase + SWR (no RSC + Server Actions).
- Rutas: `/`, `/login`, `/signup`, `/reset`, `/onboarding`, `/estadisticas`, `/habito/[id]`, `/archivados`, `/cuenta`.
- Errores: toast no-bloqueante + reintento manual; sesión expirada redirige a `/login` con toast.
- Validación: nombre 1–60 (trim, libre), descripción 0–280, target 1–7, máx 30 hábitos activos; cliente y servidor.
- Init: `create-next-app@latest --ts --tailwind --app --src-dir` + Supabase CLI; migraciones en `supabase/migrations/`; dev y prod = dos proyectos Supabase.
- Env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (más las claves de Stripe necesarias para Checkout y webhooks); sin seeds.

### Ronda 4 — Scope vs brief (brief modificado)
- PWA mínima (instalable + offline read-only) — agregada al brief.
- Stripe + plan premium — agregado al brief.
- Paywall: estadísticas premium + límite 3 hábitos free / 30 premium — agregado al brief.
- Gamificación suave (celebración rachas 7 y 30) — agregada al brief.
- Recordatorios por email como segunda extensión — agregada al brief (regla "máx 1 extensión" levantada).
- Compartir nativo (Web Share API + OG tags) — agregada al brief.
- Onboarding mínimo (1 pantalla) — declarado permitido en el brief.
- Animaciones — restricción levantada en el brief.
- Se mantienen como no-goals: app nativa, push, hábitos compartidos, ranking social, categorías, notas, modo enfoque, exportar, offline con escritura, i18n, WCAG AA, tests automatizados.
