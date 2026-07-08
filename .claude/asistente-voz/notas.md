# Notas — Asistente personal (M01/M02 + M03 + Whisper + Módulo de comandos)

## Estado
- Workflow en tu instancia n8n, editado vía MCP oficial de n8n (`create_workflow_from_code` + `update_workflow`).
- **ID**: `dIfAduLqb46yNpQG`
- **URL**: https://habit-tracker.oph.st/workflow/dIfAduLqb46yNpQG
- **Activo**: `false` (borrador, tal como pediste — no se publicó)
- **Nodos**: 26 (ver detalle por sección abajo)

## Qué se construyó
1. **Escuchar Mensajes de Telegram** (`n8n-nodes-base.telegramTrigger` v1.3)
   - `updates: ["message"]` → dispara con cualquier mensaje (texto, voz, foto, etc.).
   - `additionalFields: {}` → **sin** descarga automática de audio (`download` vacío), según lo pedido. El audio se descargará "a mano" con `getFile` en el M03.
   - Credencial: `newCredential('Telegram Bot Personal')` — placeholder. **Debes asignar tu credencial real de Telegram (bot token) en el nodo desde la UI de n8n** antes de poder probarlo o activarlo.

2. **¿Es nota de voz?** (`n8n-nodes-base.if` v2.3)
   - Condición única: `leftValue = {{ $json.message.voice }}`, `operator = { type: "any", operation: "exists" }` — exactamente `exists`, no "is not empty".
   - Rama **TRUE**: originalmente dejada sin conectar a propósito; ahora conectada a "Download audio" (ver sección M03 abajo).
   - Rama **FALSE**: conectada a "Procesar mensaje de texto".

3. **Procesar mensaje de texto** (`n8n-nodes-base.noOp`)
   - Nodo No Operation. Representa "se procesa como texto" — sin lógica todavía, listo para expandir cuando toque ese flujo.

4. **Sticky Note** — arriba del Trigger y del IF, explica el filtro voz/no-voz, qué hace cada rama y por qué la rama TRUE queda abierta.

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
- **Modelo de Interpretación** (`lmChatOpenAi` v1.3, `gpt-5-mini`, `temperature: 0.1`) — conectado vía `ai_languageModel`.
- **Parser de Comando** (`outputParserStructured` v1.3, schema manual) — conectado vía `ai_outputParser`. Fuerza el JSON: `{ action, habit_name, frequency, target_per_week }` con `action` restringido por enum a `crear_habito | marcar_hecho | listar_habitos | no_entendido`.
- El prompt del sistema define reglas de default: `frequency: 'daily'` si no se especifica, `target_per_week: 7` para daily o el número mencionado (1-7) para weekly.
- **Credencial OpenAI: sigue sin asignar** en este nodo (comparte la misma pendiente de "Whisper" — asígnala en los dos lugares).

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

## Pendiente para ti (módulo de comandos)
- [x] **Crear credencial Supabase** en n8n — hecho ("Supabase account"), y asignada en los 6 nodos.
- [x] Verificar que los nombres de tabla/columna de Supabase son correctos — verificado en vivo contra el esquema real (ver arriba), sin discrepancias.
- [ ] **Asignar credencial OpenAI** en "Modelo de Interpretación" y en "Whisper" — **pausado a propósito**: por ahora no vas a tener la credencial de OpenAI, se retoma más adelante.
- [ ] Probar las 3 frases ("crea el hábito de X", "hice X hoy" / "marca X como hecho", "qué hábitos tengo") — depende de lo anterior, también pausado.
- [ ] Decidir qué hacer con duplicados al crear hábito (por ahora falla visible, sin mensaje amigable).
- [ ] Publicar tú mismo cuando esté aprobado (sigue sin activar/publicar).

## Incidencia de sesión (contexto, no bloquea nada ahora)
Antes de poder crear el workflow, hubo que resolver una cadena de problemas de conexión del MCP de n8n:
1. El servidor MCP registrado en claude.ai (`claude.ai n8n`) apuntaba a `erikanevarez.app.n8n.cloud`, que ya no existe ahí (404 "No workspace here" de n8n Cloud).
2. Confirmaste que tu instancia real está en OpenHosst: `https://habit-tracker.oph.st`.
3. Se registró un servidor MCP local nuevo (`n8n-oph`) apuntando a `https://habit-tracker.oph.st/mcp-server/http` con tu token Bearer.
4. El primer intento de reload no cargó las tools porque la configuración se había guardado bajo una entrada de proyecto con **`C:` mayúscula**, mientras esta sesión usa **`c:` minúscula** como working directory — dos entradas distintas en `~/.claude.json`. Se copió la config del servidor a la entrada correcta.
5. Tras cerrar y reabrir VSCode, las herramientas del MCP (`mcp__n8n-oph__*`) quedaron disponibles y se pudo construir el workflow con el SDK oficial de n8n (no el paquete comunitario `n8n-mcp` que documentan las skills instaladas — son dos servidores MCP distintos).

Si en una sesión futura el MCP vuelve a fallar, revisar primero `claude mcp list` / `claude mcp get n8n-oph` y la casing de la ruta del proyecto en `~/.claude.json`.
