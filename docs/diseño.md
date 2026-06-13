# Sistema Visual — Habit Tracker

## 1. Paleta de colores

| Nombre funcional | Valor | Justificación |
|---|---|---|
| primario | `bg-violet-600` / `#7C3AED` | Acción principal; distinguible, sin connotación de alarma |
| fondo | `bg-gray-50` / `#F9FAFB` | Fondo neutro, reduce fatiga en uso diario |
| texto | `text-gray-900` / `#111827` | Máximo contraste sobre fondo claro |
| error | `bg-red-500` / `#EF4444` | Convención universal para fallos y alertas |
| éxito | `bg-emerald-500` / `#10B981` | Celda "hecho" y rachas; verde sin saturación agresiva |

Color de apoyo implícito: `bg-gray-300` / `#D1D5DB` para celdas grises (días anteriores a `created_at`) — deriva de la escala de fondo.

---

## 2. Stack tipográfico

**Una familia: Inter (Google Fonts)**

| Propiedad | Valor |
|---|---|
| Familia | `Inter`, sans-serif |
| Cuándo se usa | Todo el texto de la app: encabezados, etiquetas, cuerpo, botones, toasts |
| Tamaños de encabezado | `text-2xl font-bold` (título de página), `text-lg font-semibold` (nombre de hábito) |
| Tamaño de cuerpo | `text-base font-normal` (descripción, párrafos) |
| Tamaño auxiliar | `text-sm font-normal` (etiquetas, metadatos, % cumplimiento) |
| Tamaño mínimo | `text-xs font-normal` (labels de celda, badge "Archivado") |

Inter se elige porque es la fuente de referencia del ecosistema Tailwind/shadcn, tiene excelente legibilidad a `text-sm` (crítico para la franja de 14 celdas) y carga eficientemente vía `next/font/google`.

---

## 3. Escala de espaciado

| Nombre semántico | Clase Tailwind | Valor real | Cuándo se aplica |
|---|---|---|---|
| xs | `gap-2` / `p-2` | 8 px | Separación interna de celdas de franja, iconos junto a texto |
| sm | `gap-4` / `p-4` | 16 px | Padding interno de tarjetas, separación entre elementos de un ítem |
| md | `gap-8` / `p-8` | 32 px | Separación entre secciones dentro de una página, padding de modales |
| lg | `gap-16` / `px-16` | 64 px | Márgenes laterales del contenedor principal en pantallas anchas |

El contenedor de página usa `max-w-lg mx-auto px-4` en móvil y `px-8` en `sm:` — la app es fundamentalmente de uso móvil (PWA instalable).

---

## 4. Inventario de componentes UI

| Nombre | Variantes mínimas | Ejemplo de clases Tailwind |
|---|---|---|
| `Button` | `primary`, `secondary`, `destructive`, `ghost` | `inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50` |
| `Input` | `default`, `error` | `block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500` |
| `HabitCard` | `active`, `read-only` | `flex items-center justify-between rounded-xl bg-white p-4 shadow-sm` |
| `ToggleCheck` | `done`, `undone`, `disabled` | `h-6 w-6 rounded-full border-2 border-emerald-500 bg-emerald-500` / `border-gray-300 bg-white` |
| `StreakStrip` | — (14 celdas fijas) | `grid grid-cols-14 gap-1` con celdas `h-6 w-6 rounded-sm bg-emerald-500` / `bg-red-400` / `bg-gray-200` |
| `Modal` | `celebration`, `limit`, `confirm` | `fixed inset-0 flex items-center justify-center bg-black/50` con inner `rounded-2xl bg-white p-8 max-w-sm w-full` |
| `Toast` | `error`, `info` | `fixed bottom-4 left-1/2 -translate-x-1/2 rounded-lg bg-gray-900 text-white text-sm px-4 py-2 shadow-lg` |
| `Badge` | `archived` | `inline-block rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-600` |
| `PlanBanner` | `premium-upsell`, `expiring` | `rounded-lg bg-violet-50 border border-violet-200 p-4 text-sm` |
| `OfflineBanner` | — | `w-full bg-amber-100 text-amber-800 text-center text-sm py-2` |
| `FormField` | `text`, `textarea`, `select`, `time` | `flex flex-col gap-1` con `<label>` en `text-sm font-medium text-gray-700` |
| `Header` | — | `w-full bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between` con botón logout en `text-sm text-gray-500 hover:text-gray-900` |
| `StatRow` | — | `flex items-center justify-between py-3 border-b border-gray-100` |

---

## 5. Estructura de páginas

### `/login`
Autenticación de usuarios existentes.
Componentes: `Input` (email, contraseña), `Button` (primary "Iniciar sesión", ghost "¿Olvidaste tu contraseña?"), `Toast`, `FormField`.

### `/signup`
Registro de cuenta nueva con email y contraseña.
Componentes: `Input` (email, contraseña), `Button` (primary "Crear cuenta"), `Toast`, `FormField`.

### `/reset`
Definir nueva contraseña tras link de recuperación por email.
Componentes: `Input` (contraseña nueva, confirmación), `Button` (primary "Guardar contraseña"), `FormField`, `Toast`.

### `/onboarding`
Primera pantalla post-signup; orientar al usuario y lanzar creación de hábito.
Componentes: `Button` (primary "Crear tu primer hábito"), texto estático `text-lg`.

### `/`
Lista de hábitos activos del día con toggle hecho/no-hecho; accesible offline en read-only.
Componentes: `HabitCard` (`active` o `read-only`), `ToggleCheck`, `Button` (ghost "Nuevo hábito"), `Modal` (tope plan Free), `Toast`, `OfflineBanner`, header con logout.

### `/habito/[id]`
Detalle de hábito: racha actual, franja de 14 días, edición y compartir.
Componentes: `StreakStrip`, `Badge`, `Button` (primary "Compartir racha", secondary "Editar"), `Modal` (celebración racha 7/30), `FormField`, `Input`, `Toast`.

### `/archivados`
Lista de hábitos archivados con acción de desarchivar.
Componentes: `HabitCard` (`read-only`), `Badge` ("Archivado"), `Button` (secondary "Desarchivar"), `Toast`.

### `/estadisticas`
% cumplimiento 30 días y mejor racha por hábito (premium). Paywall para plan Free.
Componentes: `StatRow`, `Badge` ("Archivado"), `PlanBanner` (`premium-upsell` para Free), `Button` (primary "Activar Premium").

### `/cuenta`
Plan vigente y gestión de suscripción Stripe (activar, cancelar, reactivar).
Componentes: `PlanBanner` (`expiring`), `Button` (primary "Activar Premium" / "Reactivar", destructive "Cancelar"), `Modal` (confirmación cancelación), `Toast`.
