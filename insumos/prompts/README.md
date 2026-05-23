# Guía de construcción — Habit Tracker

Prompts para construir, paso a paso, el equipo de agentes, los skills y los artefactos de proceso del proyecto Habit Tracker con Claude Code.

Cada prompt vive en su propio archivo y sigue el formato canónico **CONTEXTO / OBJETIVO / RESTRICCIONES / CRITERIO DE ÉXITO**. Cópialo tal cual al chat de Claude Code, valida el resultado contra el criterio de éxito y, solo si cumple, pasa al siguiente.

> ¿Primera vez? Empieza por la **[Guía didáctica](GUIA-DIDACTICA.md)**: te acompaña bloque por bloque con preguntas para pensar antes y después de cada prompt. Este README es el índice/referencia rápida.
>
> Skills opcionales que ayudan en varios bloques: ver **[SKILLS-RECOMENDADAS.md](SKILLS-RECOMENDADAS.md)**.
>
> ¿Aún no escribes tu spec? Esta guía asume que ya la tienes. Para la preparación individual previa, ve a **[pre-clase/](pre-clase/README.md)**.

## Cómo usar esta guía

1. Ejecuta los prompts en el orden del índice. Cada uno asume que el anterior quedó bien.
2. Después de cada prompt, valida el CRITERIO DE ÉXITO. Si no se cumple, vuelve a promptear antes de seguir.
3. Cuando un paso pida edición manual, hazla y regístrala en `CONTEXT.md`.
4. Todo el trabajo se versiona con gitflow (ver abajo). Nada se queda sin commitear.

## Flujo de trabajo (gitflow)

- `main`: rama estable. No se commitea directo (salvo el commit inicial del Bloque 0).
- `develop`: rama de integración. Todo el trabajo termina aquí.
- Ramas tipadas, una por unidad de trabajo, salen de `develop` y vuelven a `develop`:
  - `feat/*` — agentes, skills y features de la app.
  - `docs/*` — spec, ADRs, diseño, pruebas, plan.
  - `chore/*` — estructura, configuración, AGENTS.md.
  - `fix/*` — correcciones.
- `release/*` y `hotfix/*`: reservadas para la fase de build y deploy.
- Una rama = una unidad de trabajo = commits atómicos → merge a `develop` al cerrar.
- Los pasos de **solo lectura** (críticas, inventarios, compuertas, smoke-tests) no crean rama ni commit: solo producen un reporte.

### Convención de ramas por bloque

| Bloque                       | Rama                             |
| ---------------------------- | -------------------------------- |
| 2 AGENTS.md                  | `chore/agents-md`                |
| 3 agente arquitecto          | `feat/agente-arquitecto`         |
| 4 ADRs                       | `docs/adrs-iniciales`            |
| 5 agente diseñador           | `feat/agente-disenador`          |
| 6 agente qa                  | `feat/agente-qa`                 |
| 7 agente reviewer            | `feat/agente-reviewer`           |
| 8 agente implementer         | `feat/agente-implementer`        |
| 9 skill nuevo-adr            | `feat/skill-nuevo-adr`           |
| 10 skill nueva-prueba-manual | `feat/skill-nueva-prueba-manual` |
| 11 plan.md                   | `docs/plan-inicial`              |
| 11.4 readiness de entorno    | `chore/setup-readiness`          |
| 13 cierre build-ready        | `docs/build-ready`               |

## Preparación

Antes de empezar:
- Un directorio vacío `habit-tracker-demo/`.
- Dentro, el brief del producto en `brief.md` (referencia: [insumos/brief.md](../brief.md)).
- Claude Code abierto en ese directorio.
- Nada más; el resto se genera con los prompts.

## Índice

### Bloque 0 — Génesis del proyecto
- [0.1 — Inicializar la estructura](bloque-00-genesis/00.1-inicializar-estructura.md)
- [0.2 — Borrador rápido de spec](bloque-00-genesis/00.2-borrador-spec.md)
- [0.3 — Guardar la spec como borrador](bloque-00-genesis/00.3-guardar-borrador.md)
- [0.4 — Verificar el estado del repo](bloque-00-genesis/00.4-verificar-repo.md)

### Bloque 1 — Crítica de la spec inicial
- [1.1 — Inventario de la spec](bloque-01-critica-spec/01.1-inventario-spec.md)
- [1.2 — Crítica desde 3 perspectivas](bloque-01-critica-spec/01.2-critica-3-perspectivas.md)
- [1.3 — Bloqueadores para el arquitecto](bloque-01-critica-spec/01.3-bloqueadores-arquitecto.md)

### Bloque 2 — Gitflow y AGENTS.md
- [2.0 — Establecer gitflow](bloque-02-gitflow-agents/02.0-establecer-gitflow.md)
- [2.1 — Generar AGENTS.md base](bloque-02-gitflow-agents/02.1-agents-md-base.md)
- [2.2 — Validar AGENTS.md](bloque-02-gitflow-agents/02.2-validar-agents-md.md)

### Bloque 3 — Agente arquitecto
- [3.1 — Spec del agente arquitecto](bloque-03-arquitecto/03.1-spec-arquitecto.md)
- [3.2 — Crítica de la spec del arquitecto](bloque-03-arquitecto/03.2-critica-spec-arquitecto.md)
- [3.3 — Construir el archivo del agente](bloque-03-arquitecto/03.3-construir-arquitecto.md)
- [3.4 — Probar el arquitecto](bloque-03-arquitecto/03.4-probar-arquitecto.md)

### Bloque 4 — Generar ADRs
- [4.1 — Invocar al arquitecto](bloque-04-adrs/04.1-invocar-arquitecto.md)
- [4.2 — Cerrar un ADR concreto](bloque-04-adrs/04.2-cerrar-adr.md)
- [4.3 — Compuerta: ADRs vs spec y AGENTS.md](bloque-04-adrs/04.3-compuerta-adrs.md)

### Bloque 5 — Agente diseñador
- [5.1 — Spec del agente diseñador](bloque-05-disenador/05.1-spec-disenador.md)
- [5.2 — Construir el agente diseñador](bloque-05-disenador/05.2-construir-disenador.md)
- [5.3 — Invocar al diseñador](bloque-05-disenador/05.3-invocar-disenador.md)

### Bloque 6 — Agente qa
- [6.1 — Spec del agente qa](bloque-06-qa/06.1-spec-qa.md)
- [6.2 — Construir el agente qa](bloque-06-qa/06.2-construir-qa.md)
- [6.3 — Invocar al qa](bloque-06-qa/06.3-invocar-qa.md)
- [6.4 — Compuerta de cobertura criterio↔prueba](bloque-06-qa/06.4-compuerta-cobertura.md)

### Bloque 7 — Agente reviewer
- [7.1 — Spec del agente reviewer](bloque-07-reviewer/07.1-spec-reviewer.md)
- [7.2 — Construir el agente reviewer](bloque-07-reviewer/07.2-construir-reviewer.md)
- [7.3 — Smoke-test del reviewer](bloque-07-reviewer/07.3-smoke-test-reviewer.md)

### Bloque 8 — Agente implementer
- [8.1 — Spec del agente implementer](bloque-08-implementer/08.1-spec-implementer.md)
- [8.2 — Construir el agente implementer](bloque-08-implementer/08.2-construir-implementer.md)

### Bloque 9 — Skill nuevo-adr
- [9.1 — Spec del skill nuevo-adr](bloque-09-skill-nuevo-adr/09.1-spec-skill-nuevo-adr.md)
- [9.2 — Construir el skill nuevo-adr](bloque-09-skill-nuevo-adr/09.2-construir-skill-nuevo-adr.md)

### Bloque 10 — Skill nueva-prueba-manual
- [10.1 — Spec del skill nueva-prueba-manual](bloque-10-skill-nueva-prueba/10.1-spec-skill-nueva-prueba.md)
- [10.2 — Construir el skill nueva-prueba-manual](bloque-10-skill-nueva-prueba/10.2-construir-skill-nueva-prueba.md)

### Bloque 11 — Plan.md y readiness de entorno
- [11.1 — Generar plan.md inicial](bloque-11-plan-readiness/11.1-generar-plan.md)
- [11.2 — Criticar el plan.md](bloque-11-plan-readiness/11.2-criticar-plan.md)
- [11.3 — Compuerta de trazabilidad plan↔ADR/prueba](bloque-11-plan-readiness/11.3-compuerta-trazabilidad.md)
- [11.4 — Readiness de entorno](bloque-11-plan-readiness/11.4-readiness-entorno.md)

### Bloque 12 — Vuelta de demostración
- [12.1 — Resumen del estado del proyecto](bloque-12-demo/12.1-resumen-estado.md)

### Bloque 13 — Cierre: Build-Ready y cómo continuar
- [13.1 — Smoke-test del implementer (dry-run)](bloque-13-build-ready/13.1-smoke-test-implementer.md)
- [13.2 — Generar BUILD-READY.md](bloque-13-build-ready/13.2-build-ready-md.md)
- [13.3 — Generar CONTINUAR.md](bloque-13-build-ready/13.3-continuar-md.md)

## Entregable final

Tu repo debe terminar con:

1. `AGENTS.md` adaptado a tu spec y tu extensión, incluyendo las reglas de trabajo con gitflow.
2. Los 5 agentes en `.claude/agents/` (arquitecto, diseñador, qa, reviewer, implementer).
3. Los 2 skills en `.claude/skills/` (nuevo-adr, nueva-prueba-manual).
4. Mínimo 3 ADRs firmados en `docs/adr/`.
5. `docs/diseño.md` generado por el agente diseñador.
6. `docs/pruebas-manuales.md` generado por el agente qa.
7. `plan.md` con mínimo 10 tareas atómicas.
8. `CONTEXT.md` con la bitácora de tus ediciones manuales.
9. `.env.example` y `SETUP.md` con el readiness de entorno del proyecto.
10. `BUILD-READY.md` (checklist de listo para construir) y `CONTINUAR.md` (mapa del build).
11. Repo organizado con gitflow: ramas `main` y `develop`, y trabajo en ramas tipadas (evidencia en `git log --graph --oneline --all`).
12. Mínimo 5 commits con mensajes descriptivos.
