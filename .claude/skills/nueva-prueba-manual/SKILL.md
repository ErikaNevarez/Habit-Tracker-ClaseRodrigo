---
name: nueva-prueba-manual
description: Úsalo cuando se quiere agregar una prueba manual al plan de pruebas del proyecto. Garantiza formato estandarizado, ID correlativo y calidad mínima antes de escribir la prueba.
---

Eres un procedimiento, no un rol. No ejecutas pruebas ni decides si pasan. Solo garantizas formato y completitud.

## Paso 1 — Calcular ID correlativo

Lee `docs/pruebas-manuales.md`. El ID de la nueva prueba es el máximo PT-N encontrado + 1. Si el archivo no existe, empieza en PT-1.

## Paso 2 — Recopilar contenido

Pide al humano o al agente que te invocó los siguientes campos. Si ya los proporcionaron, úsalos directamente:

- **Criterio cubierto**: número exacto de spec.md (ej. `spec.md #12`). Exactamente uno.
- **Título descriptivo** (máx. 60 caracteres)
- **Precondición**: estado exacto del sistema y datos necesarios antes de ejecutar.
- **Pasos**: lista numerada de acciones del usuario.
- **Resultado esperado**: qué debe verse o suceder al finalizar los pasos.
- **Estado**: `pendiente` (default), `pasada` o `fallida`.

## Paso 3 — Validar antes de escribir

Rechaza y detente si:
- El criterio referencia más de un número de spec.md — indicar que se deben crear pruebas separadas.
- El resultado esperado no es observable ni verificable (ej. "la app funciona bien", "todo se ve correcto", "funciona como se espera").
- Hay algún paso ambiguo que no describe una acción concreta del usuario (ej. "navega un poco", "interactúa con la pantalla", "hace las cosas necesarias").
- La precondición no especifica el estado exacto del sistema (ej. "el usuario está logueado" sin indicar con qué cuenta ni qué datos previos existen).
- El criterio referenciado no existe en spec.md.

Si hay rechazo, reporta exactamente qué falta. No agregues la prueba.

## Paso 4 — Agregar la prueba

Añade la prueba al final de `docs/pruebas-manuales.md` con este template:

```markdown
### PT-[N] — [Título descriptivo]
**Criterio:** spec.md #[número]
**Estado:** pendiente | pasada | fallida
**Precondición:** [estado exacto del sistema y datos necesarios]
**Datos de entrada:** [valores concretos, o "Ninguno" si no aplica]
**Pasos:**
1. [acción concreta del usuario]
2. [acción concreta del usuario]
**Resultado esperado:** [qué debe verse o suceder, verificable con sí/no]
```

## Paso 5 — Confirmar

Muestra el ID asignado (PT-N) y el criterio que cubre.

---

## Criterios de aceptación del skill

- El ID asignado es el siguiente disponible en `docs/pruebas-manuales.md` (sin saltos ni duplicados).
- Ninguna prueba se escribe sin pasar la validación del Paso 3.
- Cada prueba escrita referencia exactamente 1 criterio de spec.md.

## No-goals

- No ejecuta pruebas ni simula el flujo descrito.
- No decide si una prueba pasó o falló.
- No modifica pruebas existentes.
- No crea criterios de aceptación nuevos en spec.md.
