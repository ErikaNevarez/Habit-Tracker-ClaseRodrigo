# BUILD-READY.md — Criterio de listo para el build

Marca cada casilla. Si todas están en **sí**, arranca el build.  
Si alguna está en **no**, esa línea te dice qué cerrar primero.

---

## 1. Especificación (`spec.md`)

- [ ] `spec.md` existe en la raíz del repositorio.
- [ ] Todos los criterios de aceptación están numerados (#1–#37).
- [ ] Ningún criterio del núcleo (auth, hábitos, checkins, racha) está marcado como bloqueante sin resolución.
- [ ] El alcance del núcleo está delimitado explícitamente (sin Stripe, sin recordatorios, sin PWA en el build inicial).

---

## 2. Decisiones arquitectónicas (`docs/adr/`)

- [ ] `docs/adr/0001-ADRs01.md` existe con estado `aceptado` — cubre modelo de datos, autenticación y frontera cliente/servidor.
- [ ] `docs/adr/0002-middleware-session-refresh-y-guards-de-rutas.md` existe con estado `aceptado` — justifica el uso de middleware Next.js.
- [ ] Ningún ADR contradice a otro ADR (0001 usa RLS para datos; 0002 usa middleware para rutas — responsabilidades distintas).
- [ ] Ninguna tarea de `plan.md` contradice un ADR (compuerta de trazabilidad Prompt 11.3 pasada con 0 contradicciones).

---

## 3. Sistema de diseño (`docs/diseño.md`)

- [ ] `docs/diseño.md` existe con paleta de colores, tipografía, espaciado, componentes y páginas.
- [ ] Los componentes definidos en `diseño.md` cubren todos los mencionados en `plan.md` (`Button`, `Input`, `HabitCard`, `ToggleCheck`, `StreakStrip`, `Modal`, `Toast`, `Badge`, `FormField`, `Header`).
- [ ] Los tokens de color son clases Tailwind (`violet-600`, `gray-50`, etc.), coherentes con la elección de Tailwind en ADR 0001.
- [ ] `docs/diseño.md` no prescribe librerías de componentes externas no presentes en `AGENTS.md`.

---

## 4. Plan de pruebas (`docs/pruebas-manuales.md`)

- [ ] `docs/pruebas-manuales.md` existe con PT-1 a PT-37.
- [ ] Cada criterio numerado de `spec.md` (#1–#37) tiene exactamente un PT correspondiente.
- [ ] Ningún PT está marcado como `INVERIFICABLE`.
- [ ] Cada PT tiene precondición concreta, pasos numerados y resultado esperado verificable con sí/no.

---

## 5. Plan de implementación (`plan.md`)

- [ ] `plan.md` existe con 19 tareas (T-01 a T-19), todas en estado `[ ]`.
- [ ] Cada tarea tiene criterio de hecho verificable (no "funciona bien" ni "parece correcto").
- [ ] Cada tarea tiene ≤ 2 dependencias explícitas.
- [ ] Cada tarea referencia el ADR que la justifica, o "—" si es UI puro sin decisión arquitectónica.
- [ ] La trazabilidad tarea → ADR → PT fue verificada en la compuerta Prompt 11.3 (0 contradicciones, 0 criterios inverificables).
- [ ] Ninguna tarea mezcla más de una responsabilidad (verificado en las rondas de crítica del Prompt 11.2).

---

## 6. Entorno y variables (`SETUP.md` / `.env.example`)

- [ ] `.env.example` existe en la raíz y lista `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, variables de Stripe y comentarios sobre SMTP.
- [ ] `SETUP.md` existe con pasos para crear proyectos Supabase dev y prod, instalar Supabase CLI y vincular el proyecto local.
- [ ] `SETUP.md` incluye el checklist de 10 ítems "la tarea T-01 puede ejecutarse".
- [ ] `.gitignore` tiene `.env*` y la excepción `!.env.example` (para que el template sea commitable pero `.env.local` permanezca ignorado).
- [ ] El checklist de SETUP.md fue completado localmente (`.env.local` con valores reales, `supabase link` ejecutado).

---

## 7. Agentes y skills (`.claude/`)

- [ ] `.claude/agents/diseñador.md` existe con instrucciones, no-goals y criterios de aceptación.
- [ ] `.claude/agents/qa.md` existe — genera `docs/pruebas-manuales.md`, marca `INVERIFICABLE` cuando aplica.
- [ ] `.claude/agents/reviewer.md` existe — revisa en 4 ejes (AGENTS.md, atomicidad, spec/ADRs, deuda técnica).
- [ ] `.claude/agents/implementer.md` existe — confirma antes de codificar, propone commit sin ejecutarlo.
- [ ] `.claude/skills/nuevo-adr/SKILL.md` existe — auto-numera, valida y crea ADRs con el template correcto.
- [ ] `.claude/skills/nueva-prueba-manual/SKILL.md` existe — auto-numera, valida y agrega PTs al plan de pruebas.
- [ ] El agente `implementer` pasó el smoke-test (Prompt 13.1): detuvo antes de escribir código, listó archivos, escaló las dos ambigüedades de ubicación y rama sin ejecutar nada.

---

## 8. Repositorio y gitflow

- [ ] La rama `develop` existe y está al día con `origin/develop`.
- [ ] `AGENTS.md` existe con convenciones de commits (`feat/`, `docs/`, `chore/`, `fix/`), estructura de carpetas y librerías permitidas/prohibidas.
- [ ] Los commits del repositorio siguen el formato `<tipo>(<scope>): <descripción>` definido en `AGENTS.md`.
- [ ] No hay ramas de trabajo sin mergear que bloqueen el inicio del build.
- [ ] `git status` en `develop` está limpio (sin cambios sin commitear).

---

## Resultado

| Sección | Ítems | Todos en sí |
|---------|-------|-------------|
| 1. Spec | 4 | `[ ]` |
| 2. ADRs | 4 | `[ ]` |
| 3. Diseño | 4 | `[ ]` |
| 4. Pruebas | 4 | `[ ]` |
| 5. Plan | 6 | `[ ]` |
| 6. Entorno | 5 | `[ ]` |
| 7. Agentes y skills | 7 | `[ ]` |
| 8. Gitflow | 5 | `[ ]` |
| **Total** | **39 ítems** | |

> **Si los 39 ítems están marcados: el build puede arrancar con `feat/t-01-init-nextjs` desde `develop`.**  
> Si alguno está en no: resolver ese ítem antes de crear la rama de build.
