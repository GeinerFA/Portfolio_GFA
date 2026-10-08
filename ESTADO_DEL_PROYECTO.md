# Estado del proyecto — Portfolio GFA

_Actualizado: 8 de octubre de 2026_

Portfolio personal en español con panel administrativo. Las 7 fases del plan original están terminadas. Después se hicieron varios ajustes de diseño y funciones nuevas: subida de archivos a Cloudinary, previsualización de sitios y formulario de contacto.

**Resumen rápido:** el sitio y el admin funcionan. `build`, `lint` y `typecheck` pasan. Falta configurar producción (Vercel), hacer commit de los últimos cambios y algunos ajustes opcionales.

---

## 1. Stack

| Área | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router, Server Components, Server Actions), React 19, TypeScript estricto |
| Estilos | Tailwind CSS v4 |
| Base de datos | Neon (Postgres) + Drizzle ORM (`@neondatabase/serverless`, HTTP) |
| Autenticación | Auth.js v5 (Google, sesiones JWT) |
| Animaciones | Motion + Lenis (scroll suave) |
| Iconos | lucide-react, react-icons (fa6, si) |
| Validación | Zod 4 |
| Archivos | Cloudinary (subida firmada desde el navegador, sin SDK) |
| Correo | Resend (API REST) |

---

## 2. Sitio público

Ruta `/` (una sola página con secciones) y `/proyectos/[slug]`.

| Sección | Estado | Notas |
|---|---|---|
| Navbar | ✅ | Logo en imagen, fija y siempre visible (fondo con blur al hacer scroll). En móvil, menú hamburguesa con el CV y "Panel admin". |
| Hero | ✅ | Nombre grande y foto de perfil (se cambia desde el admin). |
| Marquee de tecnologías | ✅ | Desplazamiento infinito, sin separadores. |
| Proyectos destacados | ✅ | Tarjetas horizontales (16:10) con la insignia "Destacado". |
| Lista de proyectos | ✅ | Escritorio: filas con vista previa que sigue al cursor sin tapar los botones. Móvil: lista compacta con miniatura. |
| Tecnologías | ✅ | Agrupadas por categoría, con filtros. |
| Sobre mí | ✅ | Biografía en párrafos y foto fija al hacer scroll. |
| Contacto | ✅ | "Hablemos", WhatsApp, correo, **formulario de contacto** y grilla de redes. |
| Footer y "volver arriba" | ✅ | Botón flotante. |
| Detalle de proyecto | ✅ | Año, stack, enlaces, portada, descripción, galería y "siguiente proyecto". |
| SEO | ✅ | Metadata, Open Graph (imagen generada), `sitemap.xml`, `robots.txt`, favicon (fondo blanco). |

**Previsualización de sitios:** si un proyecto no tiene portada (o la portada es la misma URL del sitio en vivo), se usa una captura automática con Microlink a través de `/api/preview/[slug]`. Microlink permite unas 50 capturas al día en el plan gratis; las capturas se guardan en caché.

**Sin base de datos:** si falta `DATABASE_URL`, el sitio muestra datos de ejemplo.

---

## 3. Panel administrativo (`/admin`)

- Inicio de sesión con Google. **Solo** entra el correo de `ADMIN_EMAIL`; cualquier otro ve "Acceso denegado".
- La sesión se valida en el layout del admin **y** dentro de cada Server Action.

| Página | Funciones |
|---|---|
| Dashboard | Estadísticas generales. |
| Proyectos | Crear, editar, eliminar, publicar u ocultar, destacar y reordenar. Portada, video, galería, color y tecnologías. |
| Tecnologías | Crear, editar y eliminar, con categoría, icono y color. |
| Perfil | Nombre, rol, biografía, correo, **foto de perfil** y **CV en PDF** (con subida a Cloudinary). |
| Redes | Enlaces a redes sociales por plataforma. |

Los cambios se reflejan en el sitio al instante (se invalida la caché con `updateTag` y `revalidatePath`).

---

## 4. Formulario de contacto (lo último que se agregó)

- Campos: nombre, correo, asunto (opcional) y mensaje.
- Cada mensaje llega al correo de `CONTACT_TO_EMAIL` (o, si no está definido, al de `ADMIN_EMAIL`). Al darle a "Responder" en el correo, la respuesta va directo a quien escribió.
- Anti-spam: campo oculto (honeypot), bloqueo de envíos hechos en menos de 3 segundos y un límite de 5 mensajes cada 10 minutos por IP.
- **Probado en local:** el correo de prueba llegó.
- Archivos: `components/site/ContactForm.tsx`, `lib/actions/contact.ts`, `lib/mail.ts`.

---

## 5. Base de datos

- La base **ya existía**. El schema se obtuvo con `drizzle-kit pull` y se limpió a mano (`lib/db/schema.ts`).
- **No** se usa `drizzle-kit push` ni se borran datos.
- Tablas: perfil, proyectos, tecnologías, relación proyecto↔tecnología y redes sociales.

---

## 6. Variables de entorno

| Variable | Estado en local | Uso |
|---|---|---|
| `DATABASE_URL` | ✅ | Neon (`postgresql://…`) |
| `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` | ✅ | Login con Google |
| `ADMIN_EMAIL` | ✅ | Único correo con acceso al admin |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | ✅ | Subida de imágenes y del PDF |
| `RESEND_API_KEY` | ✅ | Formulario de contacto |
| `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` | Vacías (opcional) | Destino y remitente del correo |
| `NEXT_PUBLIC_SITE_URL` | Opcional | URL pública para SEO (en Vercel se detecta sola) |

---

## 7. Git

- Rama: `master`. Último commit: `cff039f text and favicon change`.
- **Cambios sin commit:**
  - Navbar fija y siempre visible (`Navbar.tsx`)
  - Marquee sin separadores (`TechMarquee.tsx`)
  - Formulario de contacto (`Contact.tsx`, `ContactForm.tsx`, `lib/actions/contact.ts`, `lib/mail.ts`)
  - Documentación (`README.md`, `.env.example`, este archivo)

---

## 8. Pendientes

### Necesarios para producción
- [ ] Hacer commit y push de los cambios pendientes.
- [ ] En Vercel, cargar **todas** las variables de entorno (incluida `RESEND_API_KEY`) y volver a desplegar.
- [ ] En Google Cloud Console, agregar los URIs de producción en **https**:
  - origen: `https://tu-dominio`
  - redirección: `https://tu-dominio/api/auth/callback/google`
- [ ] En Cloudinary, activar **Settings → Security → "Allow delivery of PDF and ZIP files"** para que el CV se pueda descargar.
- [ ] Revisar que los correos del formulario no caigan en Spam. Si caen, marcarlos como "No es spam".

### Verificación pendiente
- [ ] Probar el login con Google y guardar cambios desde el admin en producción.
  - En local funciona entrando por `http://localhost:3000`; Google no acepta IPs privadas.

### Mejoras opcionales (propuestas, sin hacer)
- [ ] Flechas de la grilla de redes en escritorio: hoy apuntan ↑; se pueden dejar en ↗ como en móvil.
- [ ] Filtros de tecnologías en móvil en una sola fila con scroll horizontal.
- [ ] Que los enlaces "Ver en el sitio" del admin abran en la misma pestaña.
- [ ] Dominio propio verificado en Resend, para usar un remitente como `contacto@tudominio.com` y recibir en cualquier correo.

---

## 9. Cómo correrlo

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de producción
npm run lint       # ESLint
npm run typecheck  # TypeScript
```

> En la red corporativa, npm y Node necesitan `NODE_OPTIONS=--use-system-ca` por la inspección TLS. El `.npmrc` local ya lo incluye y está fuera de git.

Las guías completas (Neon, Google OAuth, Vercel, Cloudinary y Resend) están en el `README.md`.
