# Guía didáctica — Construye dirigiendo agentes (Habit Tracker)

Esta guía no te da las respuestas: te hace las preguntas.

Cada bloque te plantea **qué pensar antes** de ejecutar un prompt, te manda a ejecutarlo (los prompts viven en archivos aparte, uno por uno), y luego te invita a **evaluar lo que salió**. El objetivo no es "terminar el proyecto": es entender por qué cada paso existe. Si solo copias y pegas sin responder las preguntas, vas a terminar con artefactos bonitos que no sabes defender.

## Cómo trabajar con esta guía

1. Lee **Qué vas a lograr** en el bloque.
2. Responde —mentalmente o por escrito en `CONTEXT.md`— las preguntas de **Antes de ejecutar**.
3. Abre el archivo del prompt indicado, cópialo a Claude Code y ejecútalo.
4. Evalúa el resultado con las preguntas de **Después**.
5. Anota la **lección** y avanza.

El índice completo, la preparación y las reglas de gitflow están en [README.md](README.md). Los prompts están en las carpetas `bloque-XX/`.

## El método en dos frases

- **Los agentes proponen, tú decides.** Nunca al revés.
- **Una spec floja produce agentes que entregan basura — limpiamente formateada.** La calidad la pones tú; el agente la amplifica, no la inventa.

---

## Bloque 0 — Génesis del proyecto

**Qué vas a lograr:** un repo con estructura y un primer borrador de spec hecho, a propósito, con prisa.

**Antes de ejecutar, pregúntate:**
- ¿Por qué crear la estructura de carpetas *antes* que el código? ¿Qué problema evita eso?
- En el Prompt 0.2 le vas a decir a Claude "no me hagas preguntas, toma la interpretación más simple, no necesita ser perfecta". ¿Qué crees que va a salir mal con esas tres instrucciones?

**Ejecuta:** [0.1](bloque-00-genesis/00.1-inicializar-estructura.md) → [0.2](bloque-00-genesis/00.2-borrador-spec.md) → [0.3](bloque-00-genesis/00.3-guardar-borrador.md) → [0.4](bloque-00-genesis/00.4-verificar-repo.md)

**Después, reflexiona:**
- Lee la spec que salió. ¿La defenderías frente a un cliente? Señala 3 cosas que le faltan.
- ¿Por qué guardamos ese borrador como insumo en vez de tirarlo?

**Lección:** promptear con prisa produce algo que *existe* pero no *sirve*. Lo conservamos para contrastarlo después con lo que sale bien.

---

## Bloque 1 — Crítica de la spec inicial

**Qué vas a lograr:** descubrir los huecos de tu spec con evidencia, no con opiniones.

**Antes de ejecutar, pregúntate:**
- Claude, por defecto, opina y "mejora". En el inventario le vas a prohibir opinar. ¿Por qué te conviene esa fricción?
- Si un arquitecto, un QA y un developer leyeran tu spec, ¿cada uno encontraría problemas distintos? ¿Por qué?

**Ejecuta:** [1.1](bloque-01-critica-spec/01.1-inventario-spec.md) → [1.2](bloque-01-critica-spec/01.2-critica-3-perspectivas.md) → [1.3](bloque-01-critica-spec/01.3-bloqueadores-arquitecto.md)

**Después, reflexiona:**
- De los bloqueadores que salieron, ¿cuáles son decisiones de producto que solo *tú* puedes tomar, y cuáles puede asumir un agente?
- Cierra los bloqueadores a mano en `spec.md`. ¿Por qué a mano y no pidiéndole a Claude que los cierre?

**Lección:** los agentes amplifican calidad, no la inventan. Si tu spec no cierra huecos, tus agentes te entregarán basura bien formateada.

---

## Bloque 2 — Gitflow y AGENTS.md

**Qué vas a lograr:** montar el flujo de ramas y escribir el contrato que todos los agentes obedecen.

**Antes de ejecutar, pregúntate:**
- Si un agente propone TypeScript estricto y otro propone JavaScript, ¿quién gana? ¿Qué archivo evita esa contradicción?
- ¿Por qué conviene que *cada* unidad de trabajo viva en su propia rama en vez de commitear todo en `main`?

**Ejecuta:** [2.0](bloque-02-gitflow-agents/02.0-establecer-gitflow.md) → [2.1](bloque-02-gitflow-agents/02.1-agents-md-base.md) → [2.2](bloque-02-gitflow-agents/02.2-validar-agents-md.md)

**Después, reflexiona:**
- En 2.2 le pides a Claude que verifique su propio AGENTS.md. ¿Confiarías en su "sí, todo cumple" sin revisar tú? ¿Por qué?
- Abre `git branch`: ¿qué representa `main` y qué representa `develop`?

**Lección:** AGENTS.md es el contrato del proyecto y gitflow es la disciplina que lo mantiene legible cuando cinco agentes tocan archivos. Sin contrato, el proyecto se contradice consigo mismo.

---

## Bloque 3 — Agente arquitecto

**Qué vas a lograr:** construir tu primer agente... empezando por escribirle una spec.

**Antes de ejecutar, pregúntate:**
- ¿Por qué un agente también necesita los 4 elementos (objetivo, scope, criterios, no-goals)? ¿Notas que el método se aplica a sí mismo?
- ¿Cómo sabrás si el output del arquitecto "cumple"? Escribe el criterio antes de construirlo.

**Ejecuta:** [3.1](bloque-03-arquitecto/03.1-spec-arquitecto.md) → [3.2](bloque-03-arquitecto/03.2-critica-spec-arquitecto.md) → [3.3](bloque-03-arquitecto/03.3-construir-arquitecto.md) → [3.4](bloque-03-arquitecto/03.4-probar-arquitecto.md)

**Después, reflexiona:**
- Cuando probaste el arquitecto (3.4), ¿propuso alternativas con trade-offs o tomó la decisión por ti? Si decidió, ¿qué hay que corregir en su system prompt?

**Lección:** para dirigir bien a un agente, primero hay que especificarlo bien. Lo que aprendiste sobre specs aplica recursivamente.

---

## Bloque 4 — Generar ADRs

**Qué vas a lograr:** usar el arquitecto para tomar (tú) las decisiones arquitectónicas y dejarlas firmadas.

**Antes de ejecutar, pregúntate:**
- "Usamos Supabase." ¿Eso es una *decisión* o una *restricción* del proyecto?
- Entonces, ¿sobre qué trata realmente un ADR: sobre *qué* herramienta o sobre *cómo* la usas (RLS vs middleware, auth en server vs client)?

**Ejecuta:** [4.1](bloque-04-adrs/04.1-invocar-arquitecto.md) → [4.2](bloque-04-adrs/04.2-cerrar-adr.md) (repite por decisión) → [4.3](bloque-04-adrs/04.3-compuerta-adrs.md)

**Después, reflexiona:**
- Cada ADR, ¿tiene al menos una consecuencia *negativa* asumida? Si no, ¿de verdad decidiste algo o solo justificaste lo cómodo?
- La compuerta 4.3, ¿encontró alguna contradicción entre un ADR y tu spec? ¿Qué pasaría si la ignoraras hasta el build?

**Lección:** un ADR defendible explica qué elegiste *y qué sacrificaste*. Una contradicción ADR-vs-spec es una bomba de tiempo: explota en el build.

> Skill recomendada: **`supabase/agent-skills`** para decidir bien tus ADRs de modelo de datos, RLS y auth. Ver [SKILLS-RECOMENDADAS.md](SKILLS-RECOMENDADAS.md).

---

## Bloque 5 — Agente diseñador

**Qué vas a lograr:** un sistema visual mínimo coherente, decidido por el agente.

**Antes de ejecutar, pregúntate:**
- El arquitecto propone 2-3 opciones y *tú* decides. El diseñador propone *una sola* y decide él. ¿Por qué la diferencia? ¿Qué tipo de decisión justifica cada estilo?

**Ejecuta:** [5.1](bloque-05-disenador/05.1-spec-disenador.md) → [5.2](bloque-05-disenador/05.2-construir-disenador.md) → [5.3](bloque-05-disenador/05.3-invocar-disenador.md)

**Después, reflexiona:**
- ¿El sistema visual que salió es suficiente para no atorarte decidiendo "¿botón azul o gris?" durante el build? ¿O todavía deja decisiones abiertas?

**Lección:** no toda decisión merece deliberación. Para lo que no es arquitectónico, la fricción de elegir entre 3 paletas cuesta más de lo que aporta.

> Skill recomendada: **`frontend-design`** para que el build de la UI con Tailwind salga pulido. Ver [SKILLS-RECOMENDADAS.md](SKILLS-RECOMENDADAS.md).

---

## Bloque 6 — Agente qa

**Qué vas a lograr:** un plan de pruebas manuales, una por cada criterio de aceptación.

**Antes de ejecutar, pregúntate:**
- ¿QA es "agregar tests al final" o "definir antes de construir cómo vas a probar cada criterio"?
- Si un criterio resulta *inverificable*, ¿de quién es la culpa: del QA o de la spec?

**Ejecuta:** [6.1](bloque-06-qa/06.1-spec-qa.md) → [6.2](bloque-06-qa/06.2-construir-qa.md) → [6.3](bloque-06-qa/06.3-invocar-qa.md) → [6.4](bloque-06-qa/06.4-compuerta-cobertura.md)

**Después, reflexiona:**
- La compuerta 6.4, ¿dejó criterios "huérfanos" (sin prueba)? ¿Qué te dice eso sobre tu spec?
- ¿Avanzarías al build con criterios sin cubrir? ¿Por qué no?

**Lección:** un criterio sin prueba es un hueco de spec disfrazado. Es un feedback loop: spec → qa → spec corregida.

> Skill recomendada: **`webapp-testing`** para verificar la app en el navegador durante el build. Ver [SKILLS-RECOMENDADAS.md](SKILLS-RECOMENDADAS.md).

---

## Bloque 7 — Agente reviewer

**Qué vas a lograr:** construir el revisor de código y confirmar que funciona, aunque todavía no construyas la app.

**Antes de ejecutar, pregúntate:**
- ¿Por qué un reviewer debe *reportar* y no *arreglar*? ¿Qué se pierde si arregla por su cuenta?
- ¿Por qué construirlo *hoy*, antes de necesitarlo en el build?

**Ejecuta:** [7.1](bloque-07-reviewer/07.1-spec-reviewer.md) → [7.2](bloque-07-reviewer/07.2-construir-reviewer.md) → [7.3](bloque-07-reviewer/07.3-smoke-test-reviewer.md)

**Después, reflexiona:**
- En el smoke-test (7.3), ¿el reviewer reportó en sus 4 ejes con prioridades, o divagó? Un agente que no pasa su propio smoke-test no está listo.

**Lección:** un agente sin probar es una promesa, no una herramienta. El smoke-test confirma que hace lo que su spec promete.

---

## Bloque 8 — Agente implementer

**Qué vas a lograr:** construir el agente que hará el grueso del build, dirigido tarea por tarea.

**Antes de ejecutar, pregúntate:**
- ¿Qué riesgo hay en un agente que implementa varias tareas seguidas sin parar? ¿Por qué "una tarea a la vez" y "esperar aprobación antes de tocar código"?

**Ejecuta:** [8.1](bloque-08-implementer/08.1-spec-implementer.md) → [8.2](bloque-08-implementer/08.2-construir-implementer.md)

**Después, reflexiona:**
- Si el implementer se atora dos veces en la misma tarea, ¿qué debería hacer? ¿Por qué documentar la edición manual en `CONTEXT.md`?

**Lección:** el agente más poderoso del equipo es también el que más disciplina necesita. Tú lo diriges; él no se desboca.

---

## Bloque 9 — Skill nuevo-adr

**Qué vas a lograr:** un skill que estandariza el formato y la calidad mínima de cada ADR.

**Antes de ejecutar, pregúntate:**
- ¿Cuál es la diferencia entre un *agente* y un *skill*? (Pista: rol y criterio vs. procedimiento repetible.)
- ¿Por qué un skill debería *rechazar* un ADR sin alternativa real o sin consecuencia negativa?

**Ejecuta:** [9.1](bloque-09-skill-nuevo-adr/09.1-spec-skill-nuevo-adr.md) → [9.2](bloque-09-skill-nuevo-adr/09.2-construir-skill-nuevo-adr.md)

**Después, reflexiona:**
- Invoca el skill: ¿genera un ADR con número correlativo correcto y bloquea los incompletos?

**Lección:** un agente piensa; un skill garantiza. Encapsular el procedimiento hace que todos los ADRs tengan la misma calidad mínima sin volver a pensarla.

> Skill recomendada: **`skill-creator`** (oficial de Anthropic) para crear y afinar este skill y el del Bloque 10. Ver [SKILLS-RECOMENDADAS.md](SKILLS-RECOMENDADAS.md).

---

## Bloque 10 — Skill nueva-prueba-manual

**Qué vas a lograr:** un skill que estandariza el formato de una prueba manual.

**Antes de ejecutar, pregúntate:**
- Si cada prueba sale con un formato distinto, ¿con qué va a pelear el reviewer: con el formato o con la sustancia?
- ¿Por qué "la app funciona bien" no es un resultado esperado válido?

**Ejecuta:** [10.1](bloque-10-skill-nueva-prueba/10.1-spec-skill-nueva-prueba.md) → [10.2](bloque-10-skill-nueva-prueba/10.2-construir-skill-nueva-prueba.md)

**Después, reflexiona:**
- ¿El skill obliga a que cada prueba apunte a exactamente un criterio de la spec? ¿Por qué importa esa trazabilidad uno-a-uno?

**Lección:** estandarizar el formato libera la atención para lo que de verdad importa: que la prueba sea observable y verifique algo real.

---

## Bloque 11 — Plan.md y readiness de entorno

**Qué vas a lograr:** convertir spec + ADRs + diseño + pruebas en tareas atómicas, y dejar el terreno listo para construir.

**Antes de ejecutar, pregúntate:**
- "Una tarea = un commit." ¿Qué hace que una tarea sea suficientemente *atómica*?
- ¿Cómo sabrías que terminaste una tarea? (Si no tienes criterio de hecho, no la terminaste: la abandonaste.)

**Ejecuta:** [11.1](bloque-11-plan-readiness/11.1-generar-plan.md) → [11.2](bloque-11-plan-readiness/11.2-criticar-plan.md) → [11.3](bloque-11-plan-readiness/11.3-compuerta-trazabilidad.md) → [11.4](bloque-11-plan-readiness/11.4-readiness-entorno.md)

**Después, reflexiona:**
- La compuerta 11.3, ¿encontró alguna tarea que *contradiga* un ADR (p. ej. un ADR eligió cliente+SWR y una tarea asume Server Actions)?
- La tarea 1 dice "inicializa Supabase". ¿Tienes ya el proyecto Supabase y las llaves, o lo ibas a descubrir a mitad del build?

**Lección:** el plan es el puente al build. Una contradicción tarea-vs-ADR o una credencial faltante se arregla *ahora*, barato; en el build, caro.

> Skill recomendada: **`supabase/agent-skills`** para el setup de Supabase (proyectos, RLS, Auth) que arranca en la tarea 1 del build. Ver [SKILLS-RECOMENDADAS.md](SKILLS-RECOMENDADAS.md).

---

## Bloque 12 — Vuelta de demostración

**Qué vas a lograr:** ver el pipeline completo encajar y un resumen del estado.

**Antes de ejecutar, pregúntate:**
- ¿Puedes describir, de memoria, el flujo completo? (spec → arquitecto → ADRs → diseñador → qa → plan → implementer → reviewer.)

**Ejecuta:** [12.1](bloque-12-demo/12.1-resumen-estado.md)

**Después, reflexiona:**
- Si otra persona leyera solo este resumen, ¿sabría cómo arrancar el build? Si no, ¿qué le falta?

**Lección:** lo que harías en una empresa en 2 semanas con 4 personas, aquí lo armaste dirigiendo agentes — pero solo funciona si la spec es sólida y si decides tú.

---

## Bloque 13 — Cierre: Build-Ready y cómo continuar

**Qué vas a lograr:** certificar que de verdad estás listo para construir y dejar escrito el mapa para empezar.

**Antes de ejecutar, pregúntate:**
- "Estoy listo para construir." ¿Eso es una sensación o algo que puedes *verificar* con una casilla?
- Si cierras el laptop hoy y vuelves en una semana, ¿sabrías cuál es el primer comando del build?

**Ejecuta:** [13.1](bloque-13-build-ready/13.1-smoke-test-implementer.md) → [13.2](bloque-13-build-ready/13.2-build-ready-md.md) → [13.3](bloque-13-build-ready/13.3-continuar-md.md)

**Después, reflexiona:**
- En el dry-run del implementer (13.1), ¿se detuvo a pedir aprobación antes de escribir código? Si escribió código, todavía no confías en él.
- Abre tu `BUILD-READY.md`: ¿todas las casillas en "sí"? Si alguna está en "no", esa es tu siguiente tarea, no el build.

**Lección:** estar listo para construir no es tener ganas: es tener el checklist en verde y el mapa escrito. La próxima vez que abras el repo, abres `CONTINUAR.md` y arrancas.

---

## Entregable

Cuando termines, tu repo debe tener todo lo de la lista de **Entregable final** en el [README.md](README.md). Pero el verdadero entregable es otro: poder explicar, de cada artefacto, *por qué existe y qué decisión tuya representa*.
