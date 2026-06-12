# Pruebas Manuales — Habit Tracker

**Generado por:** Agente QA
**Basado en:** spec.md (criterios 1–37), docs/adr/, AGENTS.md
**Fecha:** 2026-06-12

---

## Auth

### PT-1 — Signup exitoso con email y contraseña nuevos

**Criterio:** spec.md #1
**Precondición:** El navegador no tiene sesión activa. El email `qa-test-01@habittracker.test` no existe en la base de datos.
**Datos de entrada:**
- Email: `qa-test-01@habittracker.test`
- Contraseña: `Test1234!`

**Pasos:**
1. Abrir `/signup`.
2. Escribir `qa-test-01@habittracker.test` en el campo email.
3. Escribir `Test1234!` en el campo contraseña.
4. Hacer clic en el botón de envío del formulario.

**Resultado esperado:** El usuario queda autenticado, se crea una cuenta nueva en Supabase Auth y el navegador redirige a `/onboarding`.

---

### PT-2 — Signup rechazado con email ya registrado

**Criterio:** spec.md #2
**Precondición:** El email `qa-existente@habittracker.test` ya tiene cuenta registrada. El navegador no tiene sesión activa.
**Datos de entrada:**
- Email: `qa-existente@habittracker.test`
- Contraseña: `CualquierPass1!`

**Pasos:**
1. Abrir `/signup`.
2. Escribir `qa-existente@habittracker.test` en el campo email.
3. Escribir `CualquierPass1!` en el campo contraseña.
4. Hacer clic en el botón de envío del formulario.

**Resultado esperado:** El formulario muestra el mensaje exacto "Ese email ya tiene cuenta". No se crea ninguna cuenta nueva. El usuario permanece en `/signup`.

---

### PT-3 — Login exitoso con credenciales válidas

**Criterio:** spec.md #3
**Precondición:** Existe una cuenta con email `qa-login@habittracker.test` y contraseña `Login5678!`. El navegador no tiene sesión activa.
**Datos de entrada:**
- Email: `qa-login@habittracker.test`
- Contraseña: `Login5678!`

**Pasos:**
1. Abrir `/login`.
2. Escribir `qa-login@habittracker.test` en el campo email.
3. Escribir `Login5678!` en el campo contraseña.
4. Hacer clic en el botón de envío del formulario.

**Resultado esperado:** El usuario queda autenticado y el navegador redirige a `/`.

---

### PT-4 — Recuperación de contraseña por email

**Criterio:** spec.md #4
**Precondición:** Existe una cuenta con email `qa-reset@habittracker.test`. El navegador no tiene sesión activa. Se tiene acceso a la bandeja de entrada de ese email.
**Datos de entrada:**
- Email: `qa-reset@habittracker.test`
- Nueva contraseña: `NuevaClave99!`

**Pasos:**
1. Abrir `/login`.
2. Hacer clic en "¿Olvidaste tu contraseña?".
3. Escribir `qa-reset@habittracker.test` y enviar el formulario.
4. Abrir la bandeja de entrada y esperar el email de reset (máximo 2 minutos).
5. Hacer clic en el link de reset.
6. Verificar que el navegador abre `/reset`.
7. Escribir `NuevaClave99!` como nueva contraseña y confirmarla.
8. Enviar el formulario.
9. Intentar iniciar sesión con `qa-reset@habittracker.test` y `NuevaClave99!`.

**Resultado esperado:** El email de reset llega. La URL en paso 6 corresponde a `/reset`. El login en paso 9 es exitoso y el usuario aterriza en `/`.

---

### PT-5 — Logout cierra sesión y redirige a `/login`

**Criterio:** spec.md #5
**Precondición:** El usuario `qa-login@habittracker.test` tiene sesión activa en `/`.
**Datos de entrada:** Ninguno.

**Pasos:**
1. Localizar el botón "Cerrar sesión" en el header.
2. Hacer clic en "Cerrar sesión".

**Resultado esperado:** La sesión se cierra y el navegador redirige a `/login`. Al intentar acceder a `/` directamente, el usuario es redirigido a `/login`.

---

### PT-6 — Sesión expirada redirige a `/login` con toast

**Criterio:** spec.md #6
**Precondición:** El usuario tiene sesión activa. Se puede simular eliminando el token de sesión de Supabase del `localStorage` o las cookies de sesión desde las herramientas de desarrollador.
**Datos de entrada:** Ninguno.

**Pasos:**
1. Con sesión activa, abrir las herramientas de desarrollador del navegador.
2. Eliminar el token de sesión de Supabase del `localStorage` o las cookies de sesión.
3. Sin recargar, intentar hacer toggle en un hábito o navegar a `/estadisticas`.

**Resultado esperado:** La app redirige a `/login` y muestra un toast no-bloqueante con el texto exacto "Tu sesión expiró, ingresa de nuevo".

---

## Onboarding

### PT-7 — Usuario recién registrado ve `/onboarding` con CTA

**Criterio:** spec.md #7
**Precondición:** Se acaba de completar el signup con `qa-onboard@habittracker.test` / `Onboard01!` y el usuario está en `/onboarding`.
**Datos de entrada:** Ninguno.

**Pasos:**
1. Completar signup con email nuevo y ser redirigido a `/onboarding`.
2. Observar el contenido de la pantalla.
3. Contar el número de pantallas o pasos distintos.
4. Hacer clic en "Crear tu primer hábito".

**Resultado esperado:** Se muestra exactamente una pantalla con texto introductorio y el botón "Crear tu primer hábito". Al hacer clic, el navegador navega al formulario de creación de hábitos.

---

### PT-8 — Usuario que ya hizo signup aterriza en `/` al hacer login

**Criterio:** spec.md #8
**Precondición:** Existe cuenta `qa-returning@habittracker.test` que completó signup en una sesión anterior. El navegador no tiene sesión activa.
**Datos de entrada:**
- Email: `qa-returning@habittracker.test`
- Contraseña: `Return77!`

**Pasos:**
1. Abrir `/login`.
2. Escribir `qa-returning@habittracker.test` y `Return77!`.
3. Enviar el formulario.
4. Observar la ruta de redirección.

**Resultado esperado:** El navegador redirige a `/` directamente. No redirige a `/onboarding`.

---

## Hábitos

### PT-9 — Usuario Free con menos de 3 hábitos crea un hábito diario

**Criterio:** spec.md #9
**Precondición:** Usuario `qa-free-a@habittracker.test` autenticado, plan Free, 0 hábitos activos.
**Datos de entrada:**
- Nombre: `Leer`
- Frecuencia: `diaria`

**Pasos:**
1. Estando en `/`, abrir el formulario de creación de hábito.
2. Escribir `Leer` en nombre y seleccionar `diaria` en frecuencia.
3. Enviar el formulario.
4. Sin recargar, observar la lista de hábitos en `/`.

**Resultado esperado:** El hábito "Leer" aparece inmediatamente en la lista de `/` sin recargar la página. No se muestra ningún error.

---

### PT-10 — Usuario Free con 3 hábitos activos no puede crear un cuarto

**Criterio:** spec.md #10
**Precondición:** Usuario `qa-free-b@habittracker.test` autenticado, plan Free, exactamente 3 hábitos activos ("Leer", "Correr", "Meditar").
**Datos de entrada:**
- Nombre: `Escribir`
- Frecuencia: `diaria`

**Pasos:**
1. Abrir el formulario de creación de hábito.
2. Escribir `Escribir` y seleccionar `diaria`.
3. Enviar el formulario.

**Resultado esperado:** Aparece un modal con el texto "Alcanzaste el límite de 3 hábitos. Sube a Premium para crear más" y un CTA que lleva a `/cuenta`. No se crea el hábito. El conteo de hábitos activos sigue siendo 3.

---

### PT-11 — Usuario Premium con menos de 30 hábitos puede crear uno más

**Criterio:** spec.md #11
**Precondición:** Usuario `qa-premium-a@habittracker.test` autenticado, plan Premium, exactamente 29 hábitos activos.
**Datos de entrada:**
- Nombre: `Habito30`
- Frecuencia: `diaria`

**Pasos:**
1. Abrir el formulario de creación de hábito.
2. Escribir `Habito30` y seleccionar `diaria`.
3. Enviar el formulario.

**Resultado esperado:** El hábito "Habito30" se crea y aparece en `/`. No se muestra error ni modal de límite.

---

### PT-12 — Usuario Premium con 30 hábitos activos no puede crear otro

**Criterio:** spec.md #12
**Precondición:** Usuario `qa-premium-b@habittracker.test` autenticado, plan Premium, exactamente 30 hábitos activos.
**Datos de entrada:**
- Nombre: `HabitoExtra`
- Frecuencia: `diaria`

**Pasos:**
1. Abrir el formulario de creación de hábito.
2. Escribir `HabitoExtra` y seleccionar `diaria`.
3. Enviar el formulario.

**Resultado esperado:** El sistema muestra "Alcanzaste el límite de 30 hábitos activos". No se crea el hábito. El conteo permanece en 30.

---

### PT-13 — Edición de nombre, descripción, frecuencia y target_per_week dentro de límites

**Criterio:** spec.md #13
**Precondición:** Usuario `qa-edit@habittracker.test` autenticado. Existe hábito activo "Correr" con frecuencia `diaria` y sin descripción.
**Datos de entrada:**
- Nuevo nombre: `Correr rápido`
- Nueva descripción: `30 minutos mínimo`
- Nueva frecuencia: `semanal`
- Nuevo target_per_week: `3`

**Pasos:**
1. Abrir el formulario de edición del hábito "Correr".
2. Cambiar nombre a `Correr rápido`, descripción a `30 minutos mínimo`, frecuencia a `semanal`, target_per_week a `3`.
3. Guardar.
4. Recargar la página y navegar al hábito.

**Resultado esperado:** Tras recargar, el hábito muestra nombre "Correr rápido", descripción "30 minutos mínimo", frecuencia "semanal", target_per_week 3.

---

### PT-14 — No se permite crear o renombrar un hábito con nombre duplicado

**Criterio:** spec.md #14
**Precondición:** Usuario `qa-dup@habittracker.test` autenticado. Existe hábito activo "Meditar" y un segundo hábito "Yoga".
**Datos de entrada:** Nombre duplicado: `Meditar`

**Pasos (crear):**
1. Abrir formulario de creación. Escribir `Meditar` y seleccionar `diaria`. Enviar.

**Resultado esperado (crear):** Aparece "Ya tienes un hábito activo con ese nombre". No se crea el hábito.

**Pasos (renombrar):**
1. Abrir formulario de edición de "Yoga". Cambiar nombre a `Meditar`. Guardar.

**Resultado esperado (renombrar):** Aparece "Ya tienes un hábito activo con ese nombre". El nombre permanece como "Yoga".

---

### PT-15 — Archivar un hábito lo quita de `/` y aparece en `/archivados`

**Criterio:** spec.md #15
**Precondición:** Usuario `qa-archive@habittracker.test` autenticado. Existe hábito activo "Escribir".
**Datos de entrada:** Ninguno.

**Pasos:**
1. En `/`, ejecutar la acción archivar sobre "Escribir".
2. Observar la lista de hábitos en `/`.
3. Navegar a `/archivados`.

**Resultado esperado:** "Escribir" desaparece de `/`. Aparece en `/archivados`.

---

### PT-16 — Desarchivar devuelve el hábito a `/` y acepta toggles

**Criterio:** spec.md #16
**Precondición:** Usuario `qa-archive@habittracker.test` autenticado. El hábito "Escribir" está archivado en `/archivados`.
**Datos de entrada:** Ninguno.

**Pasos:**
1. Navegar a `/archivados`. Hacer clic en "Desarchivar" en "Escribir".
2. Navegar a `/`.
3. Intentar toggle del hábito "Escribir" a "hecho".

**Resultado esperado:** "Escribir" aparece en `/`. El toggle funciona y el estado persiste al recargar.

---

### PT-17 — Toggle de hábito archivado vía URL directa es rechazado con error 400

**Criterio:** spec.md #17
**Precondición:** Usuario `qa-archive@habittracker.test` autenticado. El hábito con `HABITO_ARCHIVADO_ID` está archivado (anotar su ID antes de archivar).
**Datos de entrada:** `HABITO_ARCHIVADO_ID`: ID real del hábito archivado.

**Pasos:**
1. Abrir las herramientas de desarrollador (pestaña Red).
2. Construir manualmente una petición PATCH al endpoint de toggle con `habit_id = HABITO_ARCHIVADO_ID` y `date = hoy`.
3. Enviar la petición.

**Resultado esperado:** El servidor responde HTTP 400 con mensaje que incluye "Hábito archivado". El estado del checkin no cambia.

---

## Registro diario y racha

### PT-18 — Toggle "hecho" persiste y se ve en otro dispositivo en ≤5 segundos

**Criterio:** spec.md #18
**Precondición:** Usuario `qa-toggle@habittracker.test` autenticado. Hábito "Yoga" sin check-in hoy. Dos navegadores o dispositivos con la sesión activa.
**Datos de entrada:** Ninguno.

**Pasos:**
1. En dispositivo A, hacer toggle de "Yoga" a "hecho".
2. Recargar en dispositivo A y verificar que sigue "hecho".
3. En dispositivo B, navegar a `/` y esperar hasta 5 segundos.

**Resultado esperado:** En dispositivo A, persiste "hecho" tras recargar. En dispositivo B, dentro de 5 segundos de recargar la página, "Yoga" también muestra "hecho".

---

### PT-19 — Hábito diario recién creado muestra racha 0 con etiqueta "Empieza hoy"

**Criterio:** spec.md #19
**Precondición:** Usuario `qa-racha@habittracker.test` autenticado. Hábito "Nadar" recién creado, sin ningún check-in.
**Datos de entrada:** Ninguno.

**Pasos:**
1. Navegar a `/habito/[id]` del hábito "Nadar".
2. Observar el valor de racha y la etiqueta junto a él.

**Resultado esperado:** La racha mostrada es `0` con la etiqueta "Empieza hoy".

---

### PT-20 — Racha diaria refleja días consecutivos; se rompe con un día sin "hecho"

**Criterio:** spec.md #20
**Precondición:** Usuario `qa-racha@habittracker.test` autenticado. Hábito "Nadar" con check-ins "hecho" para hoy, ayer y antes de ayer (3 días). Sin check-in "hecho" para el cuarto día. Precondición insertada en base de datos de dev.
**Datos de entrada:** Ninguno.

**Pasos:**
1. Navegar a `/habito/[id]` de "Nadar". Observar racha.
2. Eliminar el check-in "hecho" de ayer en base de datos. Recargar.
3. Observar la nueva racha.

**Resultado esperado:** Paso 1: racha = `3`. Paso 3: al existir un día sin "hecho" entre hoy y el último "hecho", racha = `0`.

---

### PT-21 — Racha semanal cuenta semanas consecutivas con ≥ T check-ins

**Criterio:** spec.md #21
**Precondición:** Usuario `qa-racha@habittracker.test` autenticado. Hábito "Pilates" semanal con `target_per_week = 3`. Semana actual: 3 check-ins (cumple). Semana anterior: 3 check-ins (cumple). Hace 2 semanas: 2 check-ins (no cumple). Precondición en base de datos de dev.
**Datos de entrada:** Ninguno.

**Pasos:**
1. Navegar a `/habito/[id]` de "Pilates". Observar racha.
2. Agregar un check-in a la semana de hace 2 semanas para que llegue a 3. Recargar.
3. Observar la nueva racha.

**Resultado esperado:** Paso 1: racha = `2`. Paso 3: racha = `3`.

---

### PT-22 — Franja de 14 días muestra verde, rojo y gris correctamente

**Criterio:** spec.md #22
**Precondición:** Usuario `qa-racha@habittracker.test` autenticado. Hábito "Nadar" creado hace exactamente 5 días. Check-ins: hace 4 días = hecho, hace 3 días = no-hecho, hace 2 días = hecho, ayer = no-hecho, hoy = hecho. Los 9 días anteriores a la creación no tienen datos.
**Datos de entrada:** Ninguno.

**Pasos:**
1. Navegar a `/habito/[id]` de "Nadar".
2. Contar el total de celdas en la franja visual.
3. Identificar el color de cada celda de derecha (hoy) a izquierda.

**Resultado esperado:** 14 celdas en total. Las 9 primeras celdas (anteriores a `created_at`) son grises/vacías. Las 5 restantes: hace 4 días = verde, hace 3 días = rojo, hace 2 días = verde, ayer = rojo, hoy = verde.

---

### PT-23 — Modal de celebración al cruzar racha de 7 y de 30 días

**Criterio:** spec.md #23
**Precondición:** Usuario `qa-celebracion@habittracker.test` autenticado. Hábito "Meditar" con 6 días consecutivos de check-in "hecho" (hoy sin check-in). El modal de racha de 7 nunca se mostró antes para este hábito.
**Datos de entrada:** Ninguno.

**Pasos (racha 7):**
1. En `/`, hacer toggle de "Meditar" a "hecho" hoy.
2. Observar si aparece un modal.
3. Descartarlo y verificar que la app regresa al estado normal.

**Resultado esperado:** Aparece modal de celebración que menciona "¡Racha de 7!" (o 7 días). Es descartable. No vuelve a aparecer para el mismo hábito.

**Verificación análoga para racha de 30:** repetir con un hábito de 29 días consecutivos. El modal debe mencionar 30 días.

---

## Estadísticas y plan

### PT-24 — Usuario Free ve pantalla de bloqueo en `/estadisticas`

**Criterio:** spec.md #24
**Precondición:** Usuario `qa-free-c@habittracker.test` autenticado, plan Free.
**Datos de entrada:** Ninguno.

**Pasos:**
1. Navegar a `/estadisticas`.
2. Observar el contenido de la pantalla.

**Resultado esperado:** Se muestra "Estadísticas es premium" (o equivalente) y un CTA que lleva a `/cuenta`. No se muestran estadísticas reales.

---

### PT-25 — Usuario Premium ve estadísticas de todos sus hábitos

**Criterio:** spec.md #25
**Precondición:** Usuario `qa-premium-c@habittracker.test` autenticado, plan Premium. Tiene ≥2 hábitos activos y ≥1 archivado, todos con al menos un check-in en los últimos 30 días.
**Datos de entrada:** Ninguno.

**Pasos:**
1. Navegar a `/estadisticas`.
2. Verificar la lista de hábitos y los datos por hábito.

**Resultado esperado:** Aparece una entrada por cada hábito activo y archivado. Cada entrada muestra nombre, % cumplimiento 30 días y mejor racha histórica. Los hábitos archivados muestran etiqueta "Archivado".

---

### PT-26 — % de cumplimiento de hábito diario se calcula correctamente

**Criterio:** spec.md #26
**Precondición:** Usuario `qa-premium-c@habittracker.test` autenticado, plan Premium. Hábito diario "Yoga-stats" creado hace 10 días (10 días activos en ventana), con 7 check-ins "hecho" en esos 10 días y sin `archived_at`. Precondición en base de datos de dev.
**Datos de entrada:** Ninguno.

**Pasos:**
1. Navegar a `/estadisticas`.
2. Localizar "Yoga-stats" y leer el % de cumplimiento.

**Resultado esperado:** El % mostrado es `70 %` (7 hechos / 10 días activos en ventana).

---

### PT-27 — % de cumplimiento de hábito semanal se calcula correctamente

**Criterio:** spec.md #27
**Precondición:** Usuario `qa-premium-c@habittracker.test` autenticado, plan Premium. Hábito semanal "Pilates-stats" con `target_per_week = 3`, creado hace 14 días (2 semanas activas). Semana reciente: 3 check-ins (cumple). Semana anterior: 2 check-ins (no cumple). Precondición en base de datos de dev.
**Datos de entrada:** Ninguno.

**Pasos:**
1. Navegar a `/estadisticas`.
2. Localizar "Pilates-stats" y leer el % de cumplimiento.

**Resultado esperado:** El % mostrado es `50 %` (1 semana cumplida / 2 semanas activas).

---

### PT-28 — Hábito archivado en `/estadisticas` muestra etiqueta y % acotado a su período activo

**Criterio:** spec.md #28
**Precondición:** Usuario `qa-premium-c@habittracker.test` autenticado, plan Premium. Hábito diario "Nadar-old" archivado hace 5 días. Tuvo 20 días activos en la ventana de 30 días, con 15 check-ins "hecho". Precondición en base de datos de dev.
**Datos de entrada:** Ninguno.

**Pasos:**
1. Navegar a `/estadisticas`.
2. Localizar "Nadar-old", verificar etiqueta y % mostrado.

**Resultado esperado:** Aparece etiqueta "Archivado" junto al nombre. El % es `75 %` (15 hechos / 20 días activos, calculado hasta `archived_at − 1 día`).

---

### PT-29 — Usuario Free activa Premium con Stripe Checkout y ve plan actualizado en ≤10 segundos

**Criterio:** spec.md #29
**Precondición:** Usuario `qa-free-d@habittracker.test` autenticado, plan Free. El webhook de Stripe está configurado y activo.
**Datos de entrada:**
- Número de tarjeta: `4242 4242 4242 4242`
- Fecha de expiración: `12/30`
- CVC: `123`
- Nombre: `QA Test`

**Pasos:**
1. Navegar a `/cuenta`. Hacer clic en "Activar Premium".
2. Completar el flujo de Stripe Checkout con la tarjeta de prueba.
3. Esperar el redirect de Stripe de vuelta a `/cuenta`.
4. Observar el plan mostrado, esperando hasta 10 segundos.

**Resultado esperado:** Dentro de 10 segundos tras el redirect, `/cuenta` muestra plan = `Premium`.

---

### PT-30 — Usuario Premium cancela y al expirar el período el exceso de hábitos queda en read-only

**Criterio:** spec.md #30
**Precondición:** Usuario `qa-premium-d@habittracker.test` autenticado, plan Premium, 5 hábitos activos. Se puede simular expiración disparando el webhook `customer.subscription.deleted` en staging.
**Datos de entrada:** Ninguno.

**Pasos:**
1. En `/cuenta`, hacer clic en cancelar y confirmar.
2. Verificar que muestra "Premium hasta DD/MM/YYYY".
3. Simular expiración del período (webhook `customer.subscription.deleted`).
4. Navegar a `/`. Intentar toggle en uno de los 2 hábitos que exceden el límite de 3.

**Resultado esperado:** Paso 2: muestra fecha de fin del período pagado. Paso 4: los 2 hábitos en exceso aparecen visibles pero sin admitir toggle (read-only). Los primeros 3 hábitos siguen funcionando normalmente.

---

## Recordatorios

### PT-31 — Email de recordatorio se envía si el hábito no está "hecho" a la hora configurada

**Criterio:** spec.md #31
**Precondición:** Usuario `qa-reminder@habittracker.test` autenticado. Hábito "Leer-reminder" con recordatorio a `08:00` hora local. Sin check-in "hecho" hoy. Acceso a la bandeja de entrada. Job de recordatorios activo.
**Datos de entrada:** Ninguno.

**Pasos (sin check-in):**
1. Verificar que "Leer-reminder" no tiene check-in "hecho" hoy.
2. Esperar las `08:00` hora local o simular el disparo del job en staging.
3. Revisar la bandeja de `qa-reminder@habittracker.test`.

**Resultado esperado:** Se recibe un email con asunto "Recordatorio: Leer-reminder" con link a la app.

**Pasos (con check-in previo):**
1. Marcar "Leer-reminder" como "hecho" antes de las `08:00`.
2. Esperar las `08:00` o simular el job.
3. Revisar la bandeja.

**Resultado esperado:** No se recibe ningún email de recordatorio para ese hábito ese día.

---

### PT-32 — Hábito sin hora de recordatorio nunca envía emails

**Criterio:** spec.md #32
**Precondición:** Usuario `qa-reminder@habittracker.test` autenticado. El hábito "Correr-noreminder" no tiene hora de recordatorio. Acceso a la bandeja de `qa-reminder@habittracker.test`.
**Datos de entrada:** Ninguno.

**Pasos:**
1. Verificar en edición de "Correr-noreminder" que el campo de recordatorio está vacío.
2. Ejecutar el job de recordatorios manualmente en staging varias veces.
3. Revisar la bandeja de entrada.

**Resultado esperado:** No se recibe ningún email de recordatorio para "Correr-noreminder".

---

## Aislamiento entre usuarios (UI)

### PT-33 — Usuario A solo ve sus hábitos; `/habito/[id]` de usuario B muestra 404

**Criterio:** spec.md #33
**Precondición:** Existen usuario A (`qa-aislamiento-a@habittracker.test`, `ID_A` = ID de uno de sus hábitos) y usuario B (`qa-aislamiento-b@habittracker.test`, `ID_B` = ID de uno de sus hábitos, anotado previamente). Usuario A autenticado.
**Datos de entrada:**
- `ID_A`: ID de un hábito del usuario A.
- `ID_B`: ID de un hábito del usuario B.

**Pasos:**
1. Con sesión de A, navegar a `/`, `/estadisticas` y `/archivados`. Verificar que solo aparecen hábitos de A.
2. Navegar a `/habito/ID_A`. Verificar que carga correctamente.
3. Navegar a `/habito/ID_B`.

**Resultado esperado:** En los pasos 1 y 2, ningún hábito de B es visible. En el paso 3, la pantalla muestra error 404.

---

## Compartir y PWA

### PT-34 — Botón "Compartir racha" invoca Web Share API con texto correcto

**Criterio:** spec.md #34
**Precondición:** Usuario `qa-share@habittracker.test` autenticado. Hábito "Yoga-share" con racha actual de 5 días. Escenario A: navegador compatible con Web Share API. Escenario B: navegador sin soporte.
**Datos de entrada:** Ninguno.

**Pasos (compatible):**
1. Navegar a `/habito/[id]` de "Yoga-share" en navegador compatible.
2. Hacer clic en "Compartir racha".
3. Verificar el texto propuesto en el diálogo nativo.

**Resultado esperado:** Se abre el diálogo de compartir nativo con el texto exacto "Llevo 5 días con Yoga-share".

**Pasos (sin soporte):**
1. Navegar a `/habito/[id]` de "Yoga-share" en navegador sin soporte Web Share.
2. Buscar el botón "Compartir racha".

**Resultado esperado:** El botón no aparece en la pantalla.

---

### PT-35 — Acceso offline a `/` muestra último estado sincronizado con banner "Sin conexión"

**Criterio:** spec.md #35
**Precondición:** Usuario `qa-pwa@habittracker.test` autenticado. Ha visitado `/` al menos una vez con conexión. El service worker está instalado.
**Datos de entrada:** Ninguno.

**Pasos:**
1. Con conexión activa, navegar a `/` y anotar los estados de los hábitos.
2. En las herramientas de desarrollador, activar modo "Offline" (Network > Offline).
3. Recargar o navegar a `/`.
4. Intentar toggle en algún hábito.

**Resultado esperado:** La lista de hábitos se muestra con el último estado sincronizado. Aparece banner con texto "Sin conexión". El toggle no ejecuta escritura (modo read-only).

---

### PT-36 — La app puede instalarse como PWA desde el navegador

**Criterio:** spec.md #36
**Precondición:** La app está desplegada en HTTPS. Navegador compatible con PWA (Chrome, Edge en escritorio; Chrome o Safari en móvil). La app no está instalada previamente en ese dispositivo.
**Datos de entrada:** Ninguno.

**Pasos:**
1. Abrir la app en el navegador compatible.
2. Esperar o localizar el prompt nativo de instalación de PWA.
3. Aceptar la instalación.
4. Verificar que la app se instala.

**Resultado esperado:** El navegador muestra el prompt nativo de instalación. Al aceptarlo, la app se instala con ícono propio y puede abrirse sin barra de URL del navegador.

---

## Errores

### PT-37 — Toast de error no-bloqueante al fallar toggle, creación o edición

**Criterio:** spec.md #37
**Precondición:** Usuario `qa-error@habittracker.test` autenticado con al menos un hábito activo.
**Datos de entrada:** Ninguno.

**Pasos (toggle):**
1. En herramientas de desarrollador, bloquear la URL del endpoint de checkins de Supabase (Network > Block request URL).
2. Hacer toggle en un hábito.
3. Observar el mensaje mostrado y el estado del toggle.
4. Verificar que el resto de la UI sigue funcionando.

**Resultado esperado:** Aparece toast no-bloqueante con el texto "No se pudo guardar, intenta de nuevo". El toggle revierte al estado anterior. El resto de la UI no se bloquea.

**Pasos (creación):**
1. Bloquear el endpoint de creación de hábitos.
2. Intentar crear un hábito nuevo y enviar el formulario.

**Resultado esperado:** Aparece el mismo toast. El formulario no se cierra ni resetea.

**Pasos (edición):**
1. Bloquear el endpoint de actualización de hábitos.
2. Intentar editar un hábito y guardar.

**Resultado esperado:** Aparece el mismo toast. El hábito no muestra los cambios como guardados.

---

*Fin del documento. Total: 37 pruebas PT-1 a PT-37, una por cada criterio numerado de spec.md. Ningún criterio requirió la marca INVERIFICABLE.*
