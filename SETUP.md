# SETUP.md — Prerequisitos para arrancar Habit Tracker

Sigue estos pasos **antes** de ejecutar cualquier tarea de `plan.md`.  
No necesitas instalar dependencias npm todavía — eso ocurre en T-01.

---

## 1. Herramientas locales

| Herramienta | Versión mínima | Verificar |
|-------------|---------------|-----------|
| Node.js | 20 LTS | `node -v` |
| npm | 10+ (viene con Node 20) | `npm -v` |
| Git | cualquier reciente | `git -v` |
| Supabase CLI | 1.200+ | `supabase -v` |

**Instalar Supabase CLI** (si no está):
```bash
# macOS
brew install supabase/tap/supabase

# Windows (PowerShell, como admin)
winget install Supabase.Cli

# npm (alternativa universal)
npm install -g supabase
```

---

## 2. Cuenta y proyecto Supabase — entorno de desarrollo

1. Crear cuenta en [supabase.com](https://supabase.com) si no tienes una.
2. En el dashboard, hacer clic en **New project**.
3. Elegir nombre (ej. `habit-tracker-dev`), contraseña de base de datos (guárdala), región más cercana.
4. Esperar ~2 minutos a que el proyecto provisione.
5. Ir a **Settings → API**:
   - Copiar **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - Copiar **anon / public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

> El proyecto de **producción** se crea igual pero con nombre distinto (ej. `habit-tracker-prod`). Puedes postergarlo hasta antes del deploy en Vercel.

---

## 3. Configurar variables de entorno locales

```bash
# En la raíz del proyecto
cp .env.example .env.local
```

Abre `.env.local` y pega los valores obtenidos en el paso 2:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<tu-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

Verifica que `.env.local` **no** aparece en `git status`:
```bash
git status   # .env.local no debe aparecer
```

Si aparece, confirma que `.gitignore` tiene la línea `.env.local` (T-01 la añade; si aún no existe el repo Next.js, se añadirá en T-01).

---

## 4. Vincular el proyecto Supabase CLI al proyecto local

```bash
supabase login            # abre el navegador para autenticarse
supabase link --project-ref <ref-del-proyecto-dev>
# El <ref> es el string en la URL: https://<ref>.supabase.co
```

Esto permite usar `supabase db push` para aplicar migraciones (T-04, T-05).

---

## 5. Configuración de email en Supabase (requerido para T-08)

No es una variable de `.env.local` — se configura en el dashboard:

1. En tu proyecto Supabase dev, ir a **Authentication → Email Templates**.
2. Localizar la plantilla **Reset Password**.
3. Cambiar la URL de redirect a `http://localhost:3000/reset`.
4. Si necesitas enviar más de 3 emails/hora en dev, configurar SMTP propio:
   - Ir a **Settings → Auth → SMTP Settings**.
   - Ingresar `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` de tu proveedor (ej. Resend, SendGrid, Gmail).

> Esta configuración se necesita solo en T-08. No bloquea T-01 a T-07.

---

## 6. Stripe — extensión Premium (no bloquea el núcleo T-01 a T-19)

Solo es necesario cuando implementes la extensión de pagos.

1. Crear cuenta en [stripe.com](https://stripe.com).
2. Activar el **modo test** (toggle en el dashboard).
3. Ir a **Developers → API keys**:
   - Copiar **Publishable key** (`pk_test_…`) → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Copiar **Secret key** (`sk_test_…`) → `STRIPE_SECRET_KEY`
4. Para webhooks locales:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
   El CLI imprime el **Signing secret** → `STRIPE_WEBHOOK_SECRET`

Agregar los tres valores a `.env.local` cuando vayas a implementar la extensión.

---

## 7. Vercel (deploy — no bloquea el desarrollo local)

1. Conectar el repositorio en [vercel.com/new](https://vercel.com/new).
2. En **Settings → Environment Variables** del proyecto Vercel, agregar las mismas variables que `.env.local` pero con los valores del proyecto Supabase **producción**.
3. Vercel detecta Next.js automáticamente; no necesitas configuración extra.

---

## Checklist — la tarea T-01 puede ejecutarse

Marca cada casilla antes de iniciar T-01:

- [ ] Node.js 20 LTS instalado (`node -v` muestra `v20.x.x` o superior)
- [ ] npm 10+ disponible (`npm -v`)
- [ ] Supabase CLI instalado (`supabase -v`)
- [ ] Cuenta Supabase creada
- [ ] Proyecto Supabase **dev** creado y provisionado (~2 min)
- [ ] `NEXT_PUBLIC_SUPABASE_URL` copiada del dashboard y disponible
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` copiada del dashboard y disponible
- [ ] `.env.local` creado a partir de `.env.example` con los dos valores anteriores
- [ ] `supabase link` ejecutado apuntando al proyecto dev
- [ ] `git status` no muestra `.env.local`

> Las variables de Stripe y la configuración SMTP de email **no** son necesarias para T-01. Se añaden cuando llegues a T-08 (reset password) y a la extensión Premium.
