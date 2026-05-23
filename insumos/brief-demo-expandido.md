# Brief — Habit Tracker (versión expandida del demo)

> Nota: este es el brief **expandido** del demo de referencia (núcleo + dos extensiones + PWA + Stripe/premium + gamificación + compartir + onboarding), conservado para consulta. El brief **canónico** de la asignación —simple, con máximo una extensión— es [brief.md](brief.md).

## 1. El problema

Muchas personas quieren construir hábitos diarios (ejercicio, lectura, meditar,
estudiar) pero pierden continuidad porque no tienen un registro simple y a la
mano. Las apps existentes resuelven esto, pero o son demasiado pesadas
(gamificación agresiva, suscripciones, social), o son demasiado genéricas
(notas, hojas de cálculo) y no dan retroalimentación visual del progreso.

Falta una herramienta enfocada: registrar si hiciste tus hábitos hoy, ver tu
racha, y nada más. Sin fricción, sin onboarding largo, sin features que
distraigan del único trabajo importante: marcar hecho/no hecho cada día.

## 2. Núcleo obligatorio

1. **Autenticación de usuarios.** Cada persona tiene su cuenta y sus hábitos
   son privados. Login con email/contraseña vía Supabase Auth.
   *Decisiones abiertas:* ¿se permite OAuth (Google/GitHub) o solo email?
   ¿hay verificación por email obligatoria o login directo?

2. **Gestión de hábitos.** El usuario puede crear, editar, archivar y borrar
   hábitos. Cada hábito tiene al menos un nombre.
   *Decisiones abiertas:* ¿qué otros campos tiene un hábito (descripción,
   color, ícono, frecuencia objetivo)? ¿se pueden reordenar? ¿borrar es
   soft-delete o duro?

3. **Registro diario.** Para cada hábito, el usuario marca "hecho" o "no hecho"
   en un día específico. La vista principal muestra los hábitos activos del
   día actual con un toggle claro.
   *Decisiones abiertas:* ¿se puede marcar días pasados o solo el día actual?
   ¿qué zona horaria define "hoy"? ¿hay estado intermedio (saltado/parcial)?

4. **Visualización de progreso.** El usuario ve la racha actual de cada hábito
   y el historial reciente (últimos N días) de forma visual.
   *Decisiones abiertas:* ¿cómo se calcula la racha si un día no se registra
   nada (cuenta como fallado o como ignorado)? ¿qué ventana muestra el
   historial — 7, 14, 30 días?

5. **Persistencia y sincronía.** Los datos viven en Supabase Postgres y se
   sincronizan entre dispositivos del mismo usuario al iniciar sesión.

## 3. Extensiones incluidas

Originalmente el brief pedía elegir máximo 1. Tras la entrevista de spec se
amplió a dos extensiones porque la propuesta de producto requiere ambas:

- **Estadísticas.** Vista con métricas agregadas: % de cumplimiento de los
  últimos 30 días y mejor racha histórica por hábito (sin heatmap anual).
- **Recordatorios.** Notificaciones por email a una hora configurable del día
  para hábitos pendientes.

## 4. Funcionalidad adicional (más allá del núcleo)

Decisiones tomadas en la entrevista de spec que extienden el brief original:

- **PWA mínima.** La app es instalable como PWA y tiene modo offline read-only
  para la pantalla del día (último estado sincronizado).
- **Plan premium con Stripe.** Existen dos planes:
  - *Free:* hasta 3 hábitos activos. Sin acceso a la vista de estadísticas.
  - *Premium (pago vía Stripe):* hasta 30 hábitos activos. Acceso a la vista
    de estadísticas.
- **Gamificación suave.** Modal de celebración al completar racha de 7 y 30
  días. No hay badges, niveles, puntos, ni ranking.
- **Compartir nativo.** Web Share API para compartir racha desde la vista de
  detalle del hábito; meta tags Open Graph en la página pública (landing).
- **Onboarding mínimo.** Una sola pantalla post-signup explicando la app y
  llevando a "Crear tu primer hábito".

## 5. Restricciones técnicas

- Next.js 15 con App Router.
- Supabase para Postgres y Auth (incluido Row Level Security).
- Stripe para suscripciones (checkout + webhooks).
- Deploy en Vercel.
- TypeScript con modo estricto.
- Tailwind CSS para estilos.

## 6. Lo que NO se evalúa / no entra

- Identidad de marca premium (logo, sistema de diseño completo): basta con
  que sea limpio, legible y consistente. Las animaciones puntuales SÍ están
  permitidas (gamificación suave, micro-interacciones).
- Performance avanzada: no hay metas de Core Web Vitals, ni optimización de
  bundles, ni SSR/ISR estratégico más allá de los defaults razonables.
- Tests automatizados: no se requiere cobertura unitaria, integración ni e2e.
- Responsive perfecto: usable en móvil y desktop; no se evalúan breakpoints
  intermedios ni gestos táctiles avanzados.
- Accesibilidad exhaustiva: contraste básico y semántica HTML mínima bastan;
  no se evalúa WCAG AA completo ni navegación por teclado avanzada.
- App nativa (iOS/Android): solo PWA web.
- Notificaciones push (solo emails de recordatorio).
- Hábitos compartidos entre usuarios, ranking social, feed de actividad.
- Categorías/filtros, notas por día, modo enfoque, importar/exportar datos.
- Modo offline pleno (escritura offline): solo lectura del último estado.
- Internacionalización: la app es solo en español.
