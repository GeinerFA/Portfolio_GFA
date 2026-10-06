# Portafolio personal con panel administrativo

Portafolio de proyectos en español con sitio público animado y panel `/admin` para gestionar el contenido.

**Stack:** Next.js 16 (App Router, Server Components, Server Actions) · TypeScript estricto · Tailwind CSS v4 · Neon (Postgres) + Drizzle ORM · Auth.js v5 (Google, sesiones JWT) · Motion + Lenis · lucide-react · react-icons.

---

## Índice

1. [Requisitos](#requisitos)
2. [Configurar Neon](#1-configurar-neon-base-de-datos)
3. [Crear credenciales OAuth de Google](#2-crear-credenciales-oauth-de-google)
4. [Variables de entorno](#3-variables-de-entorno)
5. [Correr en local](#4-correr-en-local)
6. [Desplegar en Vercel](#5-desplegar-en-vercel)
7. [Usar el panel administrativo](#usar-el-panel-administrativo)
8. [Estructura del proyecto](#estructura-del-proyecto)
9. [Scripts](#scripts)
10. [Preguntas frecuentes](#preguntas-frecuentes)

---

## Requisitos

- Node.js 20.9 o superior (probado con Node 24).
- Una cuenta en [Neon](https://neon.tech) con las tablas ya creadas: `profile`, `social_links`, `technologies`, `projects` y `project_technologies`.
- Una cuenta de Google para el login del panel.

---

## 1. Configurar Neon (base de datos)

La base de datos **ya existe**. Este proyecto no crea ni modifica tablas.

1. En el dashboard de Neon, abre tu proyecto y pulsa **Connect**.
2. Elige **Connection string**, activa **Connection pooling** y copia la URL. Debe empezar con `postgresql://`.
   > ⚠️ No uses la URL de la "Data API" (`https://…/rest/v1`). Esa no es una conexión de Postgres.
3. Pégala en `DATABASE_URL` (ver [variables de entorno](#3-variables-de-entorno)).

### Schema de Drizzle

El schema en [`lib/db/schema.ts`](lib/db/schema.ts) se generó con `drizzle-kit pull` a partir de la base existente y luego se revisó a mano. Se corrigieron un bug de comillas en los defaults y se tiparon `gallery`, `platform` y `category`.

- ✅ `npm run db:pull` vuelve a leer la estructura de la base. El resultado queda en `./drizzle/`, que no se versiona; copia los cambios a `lib/db/schema.ts` después de revisarlos.
- ❌ **Nunca** uses `drizzle-kit push` ni `drizzle-kit migrate`: podrían modificar o borrar datos.

### Sin base de datos

Si `DATABASE_URL` no existe, no es válida o la base no responde, el sitio público **no se rompe**: muestra datos de ejemplo. El panel muestra un aviso y desactiva el guardado.

---

## 2. Crear credenciales OAuth de Google

1. Entra a [Google Cloud Console](https://console.cloud.google.com) y crea un proyecto (por ejemplo, `portfolio`).
2. Ve a **APIs y servicios → Pantalla de consentimiento de OAuth** (o **Google Auth Platform**) y pulsa **Comenzar**:
   - **Nombre de la app:** el que quieras.
   - **Correo de asistencia:** tu Gmail.
   - **Público:** **Externo**.
   - **Correo de contacto:** tu Gmail.
3. En **Público**, haz una de estas dos cosas:
   - Agrega tu correo en **Usuarios de prueba**.
   - Pulsa **Publicar app**. Solo se usan los permisos básicos de email y perfil, así que no requiere verificación.
4. Ve a **Clientes → Crear cliente** y elige el tipo **Aplicación web**.
   - **Orígenes autorizados de JavaScript:**
     ```
     http://localhost:3000
     https://TU-DOMINIO.vercel.app
     ```
   - **URIs de redireccionamiento autorizados:**
     ```
     http://localhost:3000/api/auth/callback/google
     https://TU-DOMINIO.vercel.app/api/auth/callback/google
     ```
5. Copia el **ID de cliente** en `AUTH_GOOGLE_ID` y el **Secreto** en `AUTH_GOOGLE_SECRET`.
   > El secreto solo se muestra al crearlo. Guárdalo o descarga el JSON en ese momento.

---

## 3. Variables de entorno

Copia `.env.example` a `.env.local` y complétalo:

| Variable | Obligatoria | Descripción |
|---|---|---|
| `DATABASE_URL` | Sí* | Connection string de Neon (`postgresql://…`). *Sin ella el sitio muestra datos de ejemplo. |
| `AUTH_SECRET` | Sí | Secreto para firmar las sesiones. Genéralo con `npx auth secret` o `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"` |
| `AUTH_GOOGLE_ID` | Sí | ID de cliente OAuth de Google. |
| `AUTH_GOOGLE_SECRET` | Sí | Secreto del cliente OAuth. |
| `ADMIN_EMAIL` | Sí | **Único** correo que puede entrar a `/admin`. No distingue mayúsculas. |
| `NEXT_PUBLIC_SITE_URL` | No | URL pública del sitio, para SEO, sitemap y Open Graph. En Vercel se detecta sola. |
| `CLOUDINARY_CLOUD_NAME` | No | Cloudinary, para subir imágenes desde el admin. Sin estas tres variables, las imágenes se cargan solo por URL. |
| `CLOUDINARY_API_KEY` | No | API key de Cloudinary. |
| `CLOUDINARY_API_SECRET` | No | API secret de Cloudinary (nunca se expone al navegador). |

> `.env` y `.env.local` están en `.gitignore`. **Nunca** subas tus secretos al repositorio.

---

## 4. Correr en local

```bash
npm install
npm run dev
```

Abre:

- **Sitio público:** http://localhost:3000
- **Panel:** http://localhost:3000/admin

Para probar la versión de producción:

```bash
npm run build
npm run start
```

### Redes corporativas (proxy / inspección TLS)

Si `npm install` o la conexión a Neon fallan con `SELF_SIGNED_CERT_IN_CHAIN` o `fetch failed`, crea un archivo `.npmrc` en la raíz con:

```
node-options=--use-system-ca
```

Con esto Node usa los certificados del sistema operativo. Este archivo no se versiona porque es una configuración de cada máquina. Para comandos que no son de npm, usa `export NODE_OPTIONS=--use-system-ca` (bash) o `$env:NODE_OPTIONS="--use-system-ca"` (PowerShell).

---

## 5. Desplegar en Vercel

1. Sube el proyecto a un repositorio de GitHub (sin archivos `.env`).
2. En [vercel.com/new](https://vercel.com/new), importa el repositorio. Vercel detecta Next.js automáticamente.
3. En **Settings → Environment Variables**, agrega `DATABASE_URL`, `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` y `ADMIN_EMAIL`. Opcionalmente agrega también `NEXT_PUBLIC_SITE_URL` con tu dominio final.
   > También puedes conectar Neon desde **Storage → Neon** en Vercel; esa integración crea `DATABASE_URL` sola.
4. Pulsa **Deploy**.
5. Vuelve a Google Cloud Console y agrega tu dominio de Vercel (o tu dominio propio) a los **orígenes** y **URIs de redireccionamiento** (paso 4 de la [sección 2](#2-crear-credenciales-oauth-de-google)).
   > Los *preview deployments* tienen URLs distintas; el login con Google solo funciona en los dominios que registres.

---

## Usar el panel administrativo

Entra a `/admin` e inicia sesión con Google. Solo el correo de `ADMIN_EMAIL` tiene acceso; cualquier otra cuenta ve **"Acceso denegado"**. La sesión se valida dos veces: en el layout del panel y dentro de **cada** Server Action.

- **Dashboard:** muestra los proyectos publicados, borradores, destacados, tecnologías y los últimos editados.
- **Proyectos:** CRUD completo.
  - El slug se genera solo y se puede editar.
  - Tiene selector múltiple de tecnologías.
  - Puedes publicar o despublicar, destacar y ordenar con ↑/↓.
  - Borrar pide confirmación.
  - Los proyectos nuevos se crean como **borrador** hasta que marques "Publicado".
  - **Vista previa del sitio:** si el proyecto tiene "Sitio en vivo", al pasar el cursor por la lista se muestra una captura automática de su home dentro de un marco de navegador. Si tiene video de preview, se usa el video. Si la portada está vacía (o es la misma URL del sitio), también se usa la captura como portada.
    - Las capturas las genera [Microlink](https://microlink.io), cuyo plan gratuito permite unas 50 por día.
    - Se sirven desde `/api/preview/[slug]` con caché de 1 día, así que casi no consumen ese límite. Solo funcionan para proyectos publicados.
    - Si el sitio cambia, la captura se actualiza en un máximo de 24 h.
- **Tecnologías:** nombre, slug, categoría, ícono, color de marca y orden.
  - **Ícono:** escribe un nombre de [Simple Icons](https://react-icons.github.io/react-icons/icons/si/) (`SiReact` o simplemente `react`) o la URL de una imagen. Si lo dejas vacío, se muestra un badge con el nombre.
- **Perfil:** nombre, rol, titular, bio, correo, ubicación, foto, disponibilidad y **link del CV**.
  - **CV:** puede ser un PDF en `public/` (por ejemplo, `public/cv.pdf` se guarda como `/cv.pdf`) o un link de Google Drive. Compártelo como "Cualquier persona con el enlace" y se convierte solo en descarga directa. Si lo dejas vacío, se ocultan los botones "Descargar CV".
- **Redes sociales:** URL, etiqueta y visibilidad de Instagram, WhatsApp, GitHub y LinkedIn.
  - **WhatsApp:** usa el formato `https://wa.me/50688888888`.

Al guardar cualquier cambio, se revalidan todas las páginas públicas (home, detalles, sitemap y OG). Además, como respaldo, se regeneran cada hora.

### Imágenes con Cloudinary

En **Perfil → Foto de perfil** y en la **portada** de cada proyecto hay un botón **Subir imagen**. También puedes pegar una URL `https://…` o una ruta de `public/`.

**Configurar Cloudinary:**

1. Crea una cuenta gratis en [cloudinary.com](https://cloudinary.com).
2. En **Settings → API Keys**, copia el **Cloud name**, la **API Key** y el **API Secret**.
3. Agrégalos a `.env.local` (y en Vercel) como `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` y `CLOUDINARY_API_SECRET`.
4. Reinicia el servidor.

**Cómo funciona:**

- El archivo se sube **directo desde el navegador a Cloudinary**, con una firma que genera el servidor y que solo el admin puede pedir. Se guarda en las carpetas `portfolio/perfil` o `portfolio/proyectos`.
- Se aceptan JPG, PNG, WebP, AVIF y GIF, de hasta 10 MB.
- **CV en PDF:** en **Perfil → CV** hay un botón **Subir PDF** (hasta 10 MB; se guarda en `portfolio/cv`).
  > ⚠️ Cloudinary bloquea por defecto la descarga pública de PDF. Actívala en **Settings → Security → "Allow delivery of PDF and ZIP files"**. Si no lo haces, el admin te avisa después de subir el archivo.
- Después de subir, pulsa **Guardar**. Las imágenes reemplazadas no se borran de Cloudinary; puedes eliminarlas desde su Media Library.

---

## Estructura del proyecto

```
app/
├─ (site)/                 Sitio público (Lenis, navbar, footer)
│  ├─ page.tsx             Home: Hero, Marquee, Tecnologías, Destacados, Proyectos, Sobre mí, Contacto
│  ├─ template.tsx         Transición entre páginas
│  ├─ proyectos/[slug]/    Detalle del proyecto
│  └─ opengraph-image.tsx  Imagen OG generada
├─ admin/
│  ├─ (auth)/login/        Login con Google y "Acceso denegado"
│  └─ (panel)/             Panel protegido: dashboard, proyectos, tecnologías, perfil, redes
├─ api/auth/[...nextauth]/ Endpoints de Auth.js
├─ sitemap.ts · robots.ts · not-found.tsx · layout.tsx · globals.css
components/
├─ site/                   Secciones del sitio público
├─ admin/                  Formularios y controles del panel
└─ motion/                 Animaciones reutilizables (SplitText, Reveal, Magnetic, ClipReveal…)
lib/
├─ db/                     Cliente Drizzle (Neon HTTP), schema y relaciones (de drizzle-kit pull)
├─ data/                   Tipos de dominio, consultas públicas/admin, mappers y datos por defecto
├─ actions/                Server Actions (todas validan al admin)
├─ auth.ts · auth-guard.ts Auth.js y validación de ADMIN_EMAIL
└─ cloudinary.ts           Firma de subidas a Cloudinary
```

---

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo en http://localhost:3000 |
| `npm run build` | Build de producción |
| `npm run start` | Sirve el build de producción |
| `npm run lint` | ESLint |
| `npm run typecheck` | Verificación de tipos con TypeScript |
| `npm run db:pull` | Introspección de la base (solo lectura) |
| `npm run db:studio` | Drizzle Studio para ver los datos |

---

## Preguntas frecuentes

**No veo mis proyectos en el sitio.**
Los proyectos se crean con `is_published = false`. Publícalos desde **Admin → Proyectos**.

**Entro con mi cuenta y dice "Acceso denegado".**
Revisa que `ADMIN_EMAIL` sea exactamente el correo de esa cuenta de Google y reinicia el servidor después de cambiar el `.env`.

**Error `redirect_uri_mismatch` al iniciar sesión.**
Falta la URI `https://TU-DOMINIO/api/auth/callback/google` en el cliente OAuth de Google.

**Accesibilidad y movimiento.**
Si el sistema tiene activado "reducir movimiento", se desactivan el smooth scroll, las transiciones de página, el parallax y las animaciones de texto.
