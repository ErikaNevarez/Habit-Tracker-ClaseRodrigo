# AGENTS.md

Este documento define el contrato operativo y técnico que deben seguir los agentes y desarrolladores del proyecto Habit Tracker.

## Stack
- Next.js 15 con App Router
- Supabase (Postgres, Auth, Storage)
- Vercel para despliegue
- TypeScript en modo estricto
- Tailwind CSS para estilos
- Evitar librerías de componentes pesadas como Material UI o Chakra

## Convenciones de TypeScript
- `strict` habilitado en `tsconfig.json`
- Prohibido `any` sin justificación explícita en `CONTEXT.md`
- Tipar siempre que sea posible y evitar inferencias inseguras
- Evitar `as` no verificadas y castings arbitrarios
- No deshabilitar reglas de linter/TypeScript sin documentarlo en `CONTEXT.md`

## Estructura de carpetas esperada
- `app/` para rutas y layouts de Next.js
- `components/` para componentes reutilizables
- `lib/` para utilidades, wrappers y adaptadores de Supabase
- `styles/` para estilos globales y configuraciones de Tailwind
- `public/` para activos estáticos
- `insumos/` y `docs/` para documentación interna y prompts

## Política de commits
- Commits atómicos y verificables: una unidad funcional por commit
- No commits genéricos tipo "implement everything"
- Cada cambio debe poder revisarse y describirse claramente
- Todo trabajo se versiona con gitflow y no se deja sin commitear
- Cualquier edición manual de código no generada por un agente debe documentarse con justificación en `CONTEXT.md`

## Flujo git
- `main` es la rama estable
- `develop` es la rama de integración
- Las unidades de trabajo se desarrollan en ramas tipadas:
  - `feat/`
  - `docs/`
  - `chore/`
  - `fix/`
- Al cerrar cada unidad, se mergea la rama tipada en `develop`
- No se trabaja directamente en `main` o `develop`

## Regla de CONTEXT.md
- `CONTEXT.md` documenta decisiones, excepciones y ediciones manuales
- Si una decisión no está clara, se debe actualizar `CONTEXT.md`
- Las justificaciones de cambios manuales siempre deben quedar registradas

## Prohibiciones explícitas
- No usar `any` sin justificación documentada
- No introducir librerías de UI pesadas como Material UI o Chakra
- No desarrollar tests automatizados para este alcance del proyecto
- No escribir código sin un plan aprobado
- No reescribir el historial existente en `main`
