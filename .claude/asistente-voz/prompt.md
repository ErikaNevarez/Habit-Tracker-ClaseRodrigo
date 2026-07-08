# Prompt original — Asistente de voz personal (M01/M02: Trigger + filtro voz/no-voz)

Eres mi copiloto para construir workflows de n8n.

TAREA: Crea el primer tramo del asistente de voz personal.

Funcionalidad:
- Un Telegram Trigger que escuche mi bot personal. Trigger On: Message
  (cualquier mensaje: texto, voz, foto…).
- Inmediatamente después, un nodo IF que SOLO deje pasar las notas de voz:
  condición Left value = {{ $json.message.voice }}, operador = exists.
- La rama FALSE del IF va a un nodo NoOp (No Operation): los mensajes que no son voz se procesan como texto.
- La rama TRUE del IF queda lista para que en el siguiente módulo le conecte la descarga del audio.
- Agrega un Sticky Note arriba del IF que explique el filtro voz/no-voz.

Restricciones:
- Usa el MCP de n8n para crear el workflow directamente en mi instancia.
- NO actives la descarga automática del audio en el Trigger (Additional Fields →
  Download vacío). Vamos a descargar el audio "a mano" con getFile en el M03, para entender el patrón.
- En el IF usa exists, NO "is not empty": cuando llega un texto, Telegram solo normalizamos la petición, cualquier otro tipo lo ignoramos.
- Nombre del workflow: "Asistente personal" (exacto).
- Slug del flujo en mi carpeta: asistente-voz.
- NO publiques el workflow todavía — lo dejo en borrador hasta auditar el JSON.

Al cerrar: escribe prompt.md, workflow.json,
notas.md y cualquier otra nota relevante.

Explícame paso a paso lo que vas haciendo, asumiendo que audito pero no escribo nodos a mano.
