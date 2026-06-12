---
name: nuevo-adr
description: Úsalo cuando se quiere registrar una nueva decisión arquitectónica del proyecto. Garantiza formato estandarizado, auto-numeración y calidad mínima antes de escribir el archivo.
---

Eres un procedimiento, no un rol. No propones decisiones ni juzgas si son correctas. Solo garantizas formato y completitud.

## Paso 1 — Auto-numerar

Lee los archivos en `docs/adr/`. El número del nuevo ADR es el máximo encontrado + 1, con cero-padding a 4 dígitos (ej. `0004`). Si no hay archivos, empieza en `0001`.

## Paso 2 — Recopilar contenido

Pide al humano los siguientes campos. Si ya te los proporcionaron en el mensaje, úsalos directamente:

- **Título** (máx. 60 caracteres, descriptivo)
- **Estado**: `propuesto`, `aceptado` o `deprecado`
- **Contexto**: qué problema o necesidad motiva esta decisión (específico del proyecto)
- **Decisión**: qué se resolvió y razonamiento breve
- **Alternativas consideradas**: mínimo 1 alternativa real con sus trade-offs
- **Consecuencias**: beneficios esperados y mínimo 1 consecuencia negativa o trade-off aceptado

## Paso 3 — Validar antes de escribir

Rechaza y detente si:
- No hay ninguna alternativa, o la única es "no hacer nada" / "mantener el status quo" sin trade-offs reales.
- No hay ninguna consecuencia negativa ni trade-off aceptado explícito.
- El contexto es genérico (frases como "necesitamos decidir X" sin describir el problema concreto del proyecto).
- El título supera 60 caracteres o está vacío.
- El estado no es `propuesto`, `aceptado` ni `deprecado`.

Si hay rechazo, reporta exactamente qué falta. No crees el archivo.

## Paso 4 — Crear el archivo

Ruta: `docs/adr/[NÚMERO]-[titulo-en-kebab-case].md`

Usa este template exacto con los placeholders reemplazados:

```markdown
# ADR [NÚMERO] — [Título]

Fecha: [YYYY-MM-DD]
Estado: [propuesto | aceptado | deprecado]

## Contexto
[Descripción específica del problema o necesidad que motiva esta decisión en el contexto de Habit Tracker.]

## Decisión
[Qué se decidió y razonamiento resumido.]

## Alternativas consideradas

### [Nombre de la alternativa]
- Trade-offs: [qué requiere y qué entrega]

### [Nombre de la alternativa 2, si aplica]
- Trade-offs: [qué requiere y qué entrega]

## Consecuencias esperadas

Beneficios:
- [beneficio 1]

Negativas / trade-offs aceptados:
- [consecuencia negativa o trade-off aceptado]
```

## Paso 5 — Confirmar

Muestra la ruta del archivo creado y el número asignado.

---

## No-goals

- No propone la decisión ni las alternativas.
- No juzga si la decisión es buena o coherente con la spec.
- No edita ni depreca ADRs existentes.
- No agrega secciones fuera del template (Plan de Mitigación, Notas) a menos que el humano las provea.
