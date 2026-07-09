# Notas — Asistente personal (M01/M02 + M03 + Whisper + Módulo de comandos)

## Estado
- Workflow en tu instancia n8n, editado vía MCP oficial de n8n (`create_workflow_from_code` + `update_workflow`).
- **ID**: `dIfAduLqb46yNpQG`
- **URL**: https://habit-tracker.oph.st/workflow/dIfAduLqb46yNpQG
- **Activo**: `true` — **publicado en producción** el 2026-07-09 (`publish_workflow`, `activeVersionId: 4c718c5c-4d7a-4f96-88e0-c5b06d2e3385`), a petición explícita de Erika, después de validar manualmente las 3 acciones por texto. A partir de este punto, cualquier mensaje real al bot de Telegram dispara el workflow solo — ya no hace falta el botón "Execute Workflow" del editor.
- **Nodos**: 26 (ver detalle por sección abajo)

## Qué se construyó
1. **Escuchar Mensajes de Telegram** (`n8n-nodes-base.telegramTrigger` v1.3)
   - `updates: ["message"]` → dispara con cualquier mensaje (texto, voz, foto, etc.).
   - `additionalFields: {}` → **sin** descarga automática de audio (`download` vacío), según lo pedido. El audio se descargará "a mano" con `getFile` en el M03.
   - Credencial: `newCredential('Telegram Bot Personal')` — placeholder. **Debes asignar tu credencial real de Telegram (bot token) en el nodo desde la UI de n8n** antes de poder probarlo o activarlo.

2. **¿Es nota de voz?** (`n8n-nodes-base.if` v2.3)
   - Condición única: `leftValue = {{ $json.message.voice }}`, `operator = { type: "any", operation: "exists" }` — exactamente `exists`, no "is not empty".
   - Rama **TRUE**: originalmente dejada sin conectar a propósito; ahora conectada a "Download audio" (ver sección M03 abajo).
   - Rama **FALSE**: conectada a "Normalizar Mensaje de Texto" (ver sección "Texto entra al mismo pipeline" abajo) — ya NO es un NoOp, se reemplazó.

3. **Sticky Note** — arriba del Trigger y del IF, explica el filtro voz/no-voz y que ambos caminos (voz y texto) convergen en "Interpretar Comando".

## Verificación hecha
- `validate_workflow` (MCP) → válido antes de crear.
- `get_workflow_details` tras la creación confirmó:
  - `active: false`
  - Conexión del IF: salida 0 (TRUE) = `[]` (sin conectar), salida 1 (FALSE) = `Procesar mensaje de texto`.

## Pendiente para ti (antes de probar)
- [x] Asignar la credencial real de Telegram Bot API al nodo "Escuchar Mensajes de Telegram" — hecho, probado manualmente por Erika y funciona.
- [x] Probar manualmente el nodo "¿Es nota de voz?" — funciona.
- [ ] Auditar el JSON (`workflow.json` en esta carpeta) y el diseño completo en la UI de n8n.
- [ ] Cuando esté aprobado, publicarlo tú mismo (no se activó ni se publicó, según instrucción).

## M03 — Download audio (`n8n-nodes-base.telegram`, v1.2)
- Conectado a la rama **TRUE** del IF (antes estaba sin conectar a propósito).
- `resource: file`, `operation: get`.
- `fileId: ={{ $json.message.voice.file_id }}`.
- `download: true` — aquí sí se descarga el binario (a diferencia del Trigger, donde se dejó vacío). Esto es el patrón manual de `getFile` que pediste entender.
- Credencial: reutiliza la credencial ya existente **"Telegram account"** (`5SOSJ5VglOcpGhL4`), la misma que configuraste en el Trigger — no se creó una credencial nueva.
- Output binario en la propiedad **`data`** (nombre por defecto del nodo Telegram al descargar un archivo).

## Whisper — Transcripción (`@n8n/n8n-nodes-langchain.openAi`, v2.3)
- Conectado después de "Download audio".
- `resource: audio`, `operation: transcribe`.
- `binaryPropertyName: "data"` — coincide con el binario que dejó "Download audio".
- `options.language: "es"` — forzado como pediste (el parámetro de idioma en esta versión del nodo vive dentro de `options`, no en el nivel superior).
- **Credencial de OpenAI: NO asignada** — no existía ninguna credencial `openAi` en la instancia (`list_credentials` devolvió 0 resultados), así que el nodo quedó sin credencial. **Debes crearla y asignarla tú en la UI** antes de poder probar este nodo.
- Sticky Note propio arriba del nodo con: input (`data`), output (`text`), la nota sobre `language: es` forzado, el aviso de costo (Whisper cobra por duración de audio, tarifa por minuto — revisar precio vigente en OpenAI) y un recordatorio visual de que falta la credencial.

## Pendiente para ti ahora
- [ ] Crear/asignar credencial de OpenAI (`openAiApi`) en el nodo "Whisper".
- [ ] Probar manualmente "Download audio" y "Whisper" con una nota de voz real.
- [ ] Auditar el JSON completo (`workflow.json`) y el layout en la UI.
- [ ] Publicar tú mismo cuando esté aprobado (sigue sin activar/publicar).

## Módulo de comandos (interpretar `$json.text` y actuar en Habit Tracker)

**Decisión de arquitectura**: Habit Tracker no tiene ninguna API propia (todo el CRUD se hace desde el cliente con Supabase + RLS, confirmado explorando `src/` y `supabase/migrations/`). Se decidió que n8n hable **directo con Supabase usando la `service_role` key**, sin construir endpoints nuevos en el repo. `user_id` fijo (única usuaria): `4b7341d3-468e-4418-a49b-7bee585933cd`.

Plan completo guardado en `C:\Users\ekine\.claude\plans\unified-sniffing-thompson.md` (histórico de la sesión).

### Interpretar Comando (`@n8n/n8n-nodes-langchain.agent` v3.1) + subnodos
- **Modelo de Interpretación** (`lmChatOpenAi` v1.3, `gpt-5.4-mini`, `reasoningEffort: 'low'`) — conectado vía `ai_languageModel`.
- **Parser de Comando** (`outputParserStructured` v1.3, schema manual) — conectado vía `ai_outputParser`. Fuerza el JSON: `{ action, habit_name, frequency, target_per_week }` con `action` restringido por enum a `crear_habito | marcar_hecho | listar_habitos | no_entendido`.
- El prompt del sistema define reglas de default: `frequency: 'daily'` si no se especifica, `target_per_week: 7` para daily o el número mencionado (1-7) para weekly.
- **Credenciales**: ya asignadas (OpenAI + Supabase creadas por Erika).

#### Bug encontrado y corregido: "Bad request - please check your parameters"
Al probar con un mensaje de texto, "Interpretar Comando" fallaba con ese error. Causa: el modelo original (`gpt-5-mini`) es de la familia de razonamiento `gpt-5.*`, y esos modelos de OpenAI **rechazan `temperature` distinto al valor por defecto** — el nodo tenía `options.temperature: 0.1` configurado desde el diseño inicial, y OpenAI devolvía 400 al recibirlo.
**Fix**: se quitó `temperature` y se reemplazó por `reasoningEffort: 'low'` (el parámetro correcto para modelos de razonamiento — favorece velocidad/costo sobre profundidad, apropiado para una clasificación simple). De paso se actualizó el modelo a `gpt-5.4-mini` (la generación vigente recomendada; `gpt-5-mini` seguía siendo válido pero no la más reciente). Verificado que ambos (modelo y ausencia de conflicto de parámetros) quedaron correctos con `get_workflow_details` — 0 warnings.

### Enrutar Acción (`switch` v3.4, modo rules)
- 3 reglas por `$json.output.action` (case-insensitive) + fallback `'extra'` renombrado `no_entendido` → índice 3.
- Salidas: 0=crear_habito, 1=marcar_hecho, 2=listar_habitos, 3=fallback.

### Rama crear_habito
- **Crear Hábito en Supabase** (`supabase` v1, `row.create`, tabla `habits`): inserta `user_id` fijo, `name` del comando, `frequency`/`target_per_week` con los defaults del prompt.
- **Confirmar Hábito Creado** (Telegram sendMessage) confirma con nombre/frecuencia/meta.
- ⚠️ Si ya existe un hábito activo con ese nombre, el insert falla por el índice único `(user_id, name) WHERE archived_at IS NULL` — no hay manejo especial de ese error en este pase, se verá como fallo de ejecución en n8n.

### Rama marcar_hecho (emula upsert — el nodo Supabase de n8n no lo trae nativo)
1. **Buscar Hábito por Nombre** (`getAll habits`, filtro `user_id` + `name ilike` + `archived_at is null`, `alwaysOutputData: true` para poder avisar si no hay match).
2. **Habito Encontrado** (IF, `exists` sobre `$json.id`) → TRUE sigue, FALSE → **Avisar Hábito No Encontrado**.
3. **Buscar Checkin de Hoy** (`getAll checkins`, filtro `habit_id` + `date = $today.toISODate()`, también `alwaysOutputData: true`).
4. **Checkin Ya Existe** (IF, `exists` sobre `$json.id`) → TRUE: **Actualizar Checkin a Hecho** (`update`, `done={{ true }}`). FALSE: **Crear Checkin de Hoy** (`create`, con `habit_id` referenciado explícitamente desde `$('Buscar Habito por Nombre').item.json.id` porque el checkin no lo trae).
5. Ambos caminos confluyen en **Confirmar Marcado**, que toma el nombre real del hábito de `$('Buscar Habito por Nombre')` (no de `$json`, porque la tabla `checkins` no tiene columna `name`).

### Rama listar_habitos
- **Listar Habitos Activos** (`getAll habits`, `returnAll: true`, filtro `user_id` + `archived_at is null`).
- **Responder Lista de Habitos** (Telegram, `executeOnce: true`): arma el mensaje con `$input.all()` — funciona igual con 0, 1 o N hábitos (mensaje "No tienes hábitos activos todavía" si la lista viene vacía).

### Fallback no_entendido
- **Pedir Repetir Comando** (Telegram): pide repetir con ejemplos de frases válidas.

### Sticky Notes nuevas
- "Nota Interpretar Comando" — explica el schema de salida y las 4 acciones.
- "Nota Marcar Hecho" — explica el patrón get-then-create/update (upsert emulado).

### Verificación en vivo de tablas/columnas (vía `explore_node_resources`)
Con la credencial "Supabase account" (`wjwymMFUWXchfk1l`) ya creada, se consultó el esquema real del proyecto (no solo las migraciones SQL):
- **Tablas reconocidas**: `checkins`, `habits` ✓ — coinciden exactamente con lo usado en los 6 nodos.
- **Columnas `habits`**: `id, user_id, name, description, frequency, target_per_week (integer), best_streak (integer), archived_at, created_at` ✓.
- **Columnas `checkins`**: `id, habit_id, date, done (boolean)` ✓ — confirma que `done` es booleano real, por eso `fieldValue: "={{ true }}"` (expresión, no el string `"true"`) es la forma correcta en "Actualizar Checkin a Hecho" y "Crear Checkin de Hoy".

No se encontró ningún desajuste — no fue necesario tocar ningún nodo.

## Texto entra al mismo pipeline de comandos

Antes, la rama FALSE del filtro voz/no-voz terminaba en un NoOp ("Procesar mensaje de texto") sin ninguna acción después — un callejón sin salida. Se reemplazó por:

- **Normalizar Mensaje de Texto** (`n8n-nodes-base.set` v3.4, modo manual): toma `message.text` del mensaje de Telegram y produce `{ text: ... }` (con `|| ''` de respaldo si no hay texto, ej. una foto sin caption), exactamente la misma forma que ya produce "Whisper" para las notas de voz.
- Se conecta directo a **Interpretar Comando** (main), igual que "Whisper". Ahora ese nodo tiene **dos entradas** (fan-in): una desde voz transcrita, otra desde texto normalizado — es un patrón válido en n8n, cada ejecución es independiente, no se duplica lógica de interpretación.
- Se actualizó el Sticky Note del filtro para reflejar esto (ya no menciona el NoOp).

Con esto, escribir "crea el hábito de leer" como texto en Telegram funciona igual que decirlo por voz — mismo AI Agent, mismo Switch, mismas acciones.

**Pendiente/no cubierto**: si el mensaje de texto no tiene `message.text` (ej. un sticker o una foto sin caption), "Interpretar Comando" recibe `text: ''` y debería clasificarlo como `no_entendido` por las reglas del prompt — no se probó ese caso todavía.

## Pendiente para ti (módulo de comandos)
- [x] **Crear credencial Supabase** en n8n — hecho ("Supabase account"), y asignada en los 6 nodos.
- [x] Verificar que los nombres de tabla/columna de Supabase son correctos — verificado en vivo contra el esquema real (ver arriba), sin discrepancias.
- [x] **Asignar credencial OpenAI** — hecho ("OpenAI account"), ya probada con un mensaje de texto real (encontró y corrigió el bug de `temperature`, ver arriba).
- [x] Probar "crea el hábito de X" de punta a punta — **funcionó**: mensaje de texto "Crea el habito de correr" → Telegram respondió `Habito "correr" creado (daily)`. Confirma todo el camino: Normalizar Mensaje de Texto → Interpretar Comando → Enrutar Acción → Crear Habito en Supabase → Confirmar Habito Creado.
- [x] Probar "marca X como hecho" / "hice X hoy" — **funcionó**: con "correr" ya creado, Telegram respondió `"correr" marcado como hecho hoy`. Confirma: Buscar Habito por Nombre → Habito Encontrado (TRUE) → Buscar Checkin de Hoy → Checkin Ya Existe (FALSE, primera vez) → Crear Checkin de Hoy → Confirmar Marcado.
- [x] Probar "qué hábitos tengo" — **funcionó**, y con una frase distinta a los ejemplos del prompt ("habitos de hoy" en vez de "qué hábitos tengo"): Telegram respondió `Tus habitos activos: -correr(daily) -leer 40 min (daily)`. Confirma Listar Habitos Activos → Responder Lista de Habitos, y que el AI Agent generaliza bien más allá de los ejemplos literales del system message.
- [x] Probar marcar el mismo hábito **dos veces el mismo día** — **funcionó**: verificado con `get_execution` (ejecución #26) que sí tomó la rama "Checkin Ya Existe = TRUE" → "Actualizar Checkin a Hecho" (no "Crear Checkin de Hoy"), sin error de duplicado. Ambas ramas (crear/actualizar checkin) confluyen en el mismo nodo "Confirmar Marcado" con el mismo texto — **decisión confirmada: se deja el mensaje único**, no se diferencia "ya estaba marcado" vs "marcado ahora".
- [ ] Probar también con una nota de **voz** real (Download audio → Whisper → mismo pipeline) — hasta ahora solo se probó la rama de texto. **Bloqueado**: pendiente hasta que Erika genere el pago/billing de OpenAI (la cuenta tiene la credencial creada, pero sin método de pago activo Whisper no puede facturarse/ejecutarse).
- [ ] Decidir qué hacer con duplicados al crear hábito (por ahora falla visible, sin mensaje amigable).
- [x] **Publicar el workflow** — hecho: activado a petición explícita de Erika (`publish_workflow`) después de validar las 3 acciones por texto. Ver nota de "Estado" arriba.

## Incidencia de sesión (contexto, no bloquea nada ahora)
Antes de poder crear el workflow, hubo que resolver una cadena de problemas de conexión del MCP de n8n:
1. El servidor MCP registrado en claude.ai (`claude.ai n8n`) apuntaba a `erikanevarez.app.n8n.cloud`, que ya no existe ahí (404 "No workspace here" de n8n Cloud).
2. Confirmaste que tu instancia real está en OpenHosst: `https://habit-tracker.oph.st`.
3. Se registró un servidor MCP local nuevo (`n8n-oph`) apuntando a `https://habit-tracker.oph.st/mcp-server/http` con tu token Bearer.
4. El primer intento de reload no cargó las tools porque la configuración se había guardado bajo una entrada de proyecto con **`C:` mayúscula**, mientras esta sesión usa **`c:` minúscula** como working directory — dos entradas distintas en `~/.claude.json`. Se copió la config del servidor a la entrada correcta.
5. Tras cerrar y reabrir VSCode, las herramientas del MCP (`mcp__n8n-oph__*`) quedaron disponibles y se pudo construir el workflow con el SDK oficial de n8n (no el paquete comunitario `n8n-mcp` que documentan las skills instaladas — son dos servidores MCP distintos).

Si en una sesión futura el MCP vuelve a fallar, revisar primero `claude mcp list` / `claude mcp get n8n-oph` y la casing de la ruta del proyecto en `~/.claude.json`.
