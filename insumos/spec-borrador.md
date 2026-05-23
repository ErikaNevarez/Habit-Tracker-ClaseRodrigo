# Spec — Habit Tracker

## Objetivo

Una app web para personas que quieren sostener hábitos diarios y necesitan registrar hecho/no-hecho del día y ver su racha sin gamificación, sin elementos sociales y sin onboarding largo.

## Scope

### Sí entra

- Registro y login con email + contraseña vía Supabase Auth.
- Crear, editar y archivar hábitos. Cada hábito tiene `nombre` y `frecuencia` (diaria o semanal).
- Pantalla principal con los hábitos activos del día actual y un toggle hecho/no-hecho por hábito.
- Cálculo de racha actual por hábito y vista del historial de los últimos 14 días.
- Vista de estadísticas: porcentaje de cumplimiento de los últimos 30 días y mejor racha histórica por hábito.
- Persistencia en Supabase Postgres con Row Level Security: cada usuario solo ve sus propios datos.

### No entra

- OAuth (Google, Apple, GitHub) ni verificación de email obligatoria.
- Edición de campos visuales del hábito (color, ícono, descripción) ni reordenar hábitos.
- Hard-delete de hábitos: archivar es soft-delete que oculta pero preserva historial.
- Check-in de días pasados o futuros: solo se marca el día actual.
- Selector de zona horaria: "hoy" es la fecha local del navegador.
- Estado intermedio (saltado, parcial): el registro es binario.
- Recordatorios, hábitos compartidos, categorías, exportar datos, modo enfoque, notas por día.

## Criterios de aceptación

1. Dado un visitante sin sesión, cuando ingresa email y contraseña válidos en `/login`, entonces queda autenticado y es redirigido a `/`, donde ve solo sus propios hábitos.
2. Dado un usuario autenticado, cuando crea un hábito con nombre "Leer" y frecuencia "diaria" desde el formulario de "Nuevo hábito", entonces el hábito aparece en la lista del día sin recargar la página.
3. Dado un hábito activo en la pantalla del día, cuando el usuario hace toggle a "hecho", entonces el estado se persiste y se mantiene "hecho" al recargar la página o entrar desde otro dispositivo con la misma cuenta.
4. Dado un hábito diario con check-in "hecho" en cada uno de los últimos N días consecutivos terminando hoy, entonces la racha mostrada es N. Si existe un día sin check-in "hecho" entre hoy y el último "hecho", la racha es 0.
5. Dado un hábito con historial, cuando el usuario entra a su vista de detalle, entonces ve una franja con los últimos 14 días marcando hecho / no-hecho por día.
6. Dado un usuario con al menos un hábito archivado, cuando entra a la pantalla principal, entonces los hábitos archivados no aparecen, pero su historial sigue disponible en estadísticas.
7. Dado un usuario en la vista de estadísticas, cuando la abre, entonces ve por cada hábito el porcentaje de días "hecho" sobre los últimos 30 días y su mejor racha histórica.
8. Dado un usuario A y un usuario B autenticados, cuando A consulta cualquier endpoint o tabla, entonces nunca obtiene filas de B (RLS verificada).

## No-goals

- Diseño visual premium, animaciones e identidad de marca.
- Optimización de Core Web Vitals, SSR/ISR estratégico, optimización de bundles.
- Tests automatizados (unitarios, integración o e2e).
- Responsive avanzado más allá de "usable en móvil".
- Accesibilidad WCAG AA completa y navegación por teclado avanzada.
- Modo offline o sincronización con resolución de conflictos.
- Internacionalización: la app es solo en español.
