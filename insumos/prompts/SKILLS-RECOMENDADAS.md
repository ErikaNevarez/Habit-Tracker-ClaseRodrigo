# Skills recomendadas — Habit Tracker

Skills del marketplace de Anthropic y de Supabase que ayudan en este proyecto. **No son obligatorias**: el proyecto se puede construir sin ellas. Instálalas a nivel **proyecto** (`.claude/skills/`) para que al clonar el repo todo el equipo las tenga.

## Recomendadas

| Skill | Para qué sirve aquí | Dónde aplica | Instalar |
|-------|---------------------|--------------|----------|
| `supabase/agent-skills` | Postgres, RLS, Auth, Edge Functions e integración SSR con Next.js, con guía de **seguridad** | ADRs de datos/auth (Bloque 4) y todo el build | `npx skills add supabase/agent-skills -a claude-code --skill supabase` |
| `skill-creator` | Crear y afinar tus propios skills | Bloques 9–10 (`nuevo-adr`, `nueva-prueba-manual`) | `/plugin install skill-creator@anthropics` |
| `frontend-design` | Interfaces pulidas con Tailwind | Agente diseñador (Bloque 5) y build de UI | `/plugin install frontend-design@anthropics` |
| `webapp-testing` | Manejar un navegador para verificar la app | Agente qa (Bloque 6) y verificación en el build | `/plugin install webapp-testing@anthropics` |

## Opcionales

- `docx`, `pdf` — solo si exportas ADRs o reportes fuera de Markdown.

## No las agregues (no aplican a este proyecto)

- `claude-api`, `mcp-builder` — útiles solo si la *app* llama a la API de Claude o construye un MCP propio; el habit tracker no hace ninguna de las dos.
- `algorithmic-art`, `slack-gif-creator`, `internal-comms`, `canvas-design`, `theme-factory`, `brand-guidelines` — fuera de alcance para una app code-first.

## Cómo agregar una skill (Claude Code)

- **UI:** `/plugin` → pestaña *Discover* → elige la skill → scope **Project**.
- **CLI Anthropic:** `/plugin install <nombre>@anthropics`
- **CLI Supabase / repos externos:** `npx skills add <repo> -a claude-code --skill <nombre>`
- **Manual:** coloca `SKILL.md` en `.claude/skills/<nombre>/` (proyecto, se comparte por git) o en `~/.claude/skills/<nombre>/` (solo tu usuario).

> Cuidado: `npx skills add` por defecto escribe en `~/.agents/skills/`, pero Claude Code lee de `.claude/skills/`. Usa el flag `-a claude-code` o copia el archivo a mano. Los cambios en `.claude/skills/` toman efecto sin reiniciar.

Fuentes verificadas: [anthropics/skills](https://github.com/anthropics/skills), docs de Agent Skills de Anthropic, y [supabase/agent-skills](https://github.com/supabase/agent-skills).
