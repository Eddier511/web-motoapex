# MotoApex web — módulos públicos v1

React, Vite y Tailwind conservan el diseño existente. La aplicación consume únicamente rutas públicas y nunca sustituye errores por contenido ficticio.

## Contrato y configuración

Contrato revisado en [API codex/accounts-security, docs/contract.md](https://github.com/Eddier511/api-motoapex/blob/codex/accounts-security/docs/contract.md), [PR #4](https://github.com/Eddier511/api-motoapex/pull/4), commit `fb73f39920e0b7d91fdcca53aa1569968be4338f`. Ese PR estaba abierto al revisar. Se conserva la integración anterior de web `7ec1b4682c31fcf44e625c8c8b100f2849d03e6e`, ya incluida en main. No se presupone que el contrato esté en API main ni que sus migraciones estén instaladas.

```env
VITE_API_BASE_URL=https://darksalmon-quetzal-730302.hostingersite.com/v1
```

Definirla en el entorno de compilación o `.env.local`; `.env.example` contiene la misma URL. Vite incorpora la URL pública al build. Nunca introducir tokens, MySQL u otras credenciales en `VITE_*`.

## Recursos y comportamiento

- Catálogo: GET `/public/brands`, `/public/categories`, `/public/motorcycles`. IDs del servidor como cadenas, categorías generales y de marca, filtros, búsqueda, años, orden, especificaciones y galerías por color/principal. Se conservan available, reserved, coming-soon y sold-out; reserved sigue siendo Reservado. `showPrice=false` descarta precios aunque aparezcan en una respuesta defectuosa; campos ausentes no se convierten en cero. Las monedas no se convierten ni se comparan como equivalentes. `allowQuote` controla la cotización por modelo.
- Promociones: GET `/public/promotions` y `/public/promotions/{id-o-slug}`. Home usa únicamente showOnHome; `/promociones` muestra el listado y `/promociones/:slug` el detalle. Orden recibido, brand con name/slug/primaryColor, featured, descripción, imagen, vigencia, buttonLabel/buttonHref y precios/moneda separados por cada moto. No se fabrica un precio global. Las motos respetan showPrice y allowQuote. Vigencia y publicación se filtran en el servidor, sin reactivar campañas desde datos locales.
- Banners: GET `/public/banners?placement=home_hero`. Carrusel con orden recibido, title/subtitle/alt, brandSlug/accentColor, CTA label/href o null. `<picture>` usa mobileImageUrl hasta 639 px y imageUrl como fallback. Una lista vacía no genera banners.
- Páginas: GET `/public/pages` y `/public/pages/{id-o-slug}`. Enlaces de páginas publicadas en el footer; `/paginas/:slug` evita colisiones con marcas, y `/:slug` resuelve una página cuando no es marca. Renderizado de texto o bloques heading/paragraph/image/link sin HTML crudo. Título, descripción, Open Graph y canonical públicos; no se altera noindex. Los metadatos cambian en React, sin SSR. No se consumen revisiones o autores privados.
- Contacto: GET `/public/contact` controla businessName, teléfono, WhatsApp, email, dirección, coordenadas, horarios, logoUrl y faviconUrl. No hay teléfonos, correo, dirección, horarios ni logo ficticios de respaldo. Si logoUrl falta, se muestra el nombre recibido; si faviconUrl falta, no se instala un icono local. Los enlaces WhatsApp no crean leads.
- Redes: GET `/public/social-links`, solo la respuesta pública activa y en el orden recibido. No hay enlaces `#` de ejemplo.
- Ajustes: GET `/public/settings`, exclusivamente site_url, timezone y default_currency de la lista pública. site_url define canonical, timezone presenta vigencia; la moneda explícita de cada moto siempre prevalece. Contacto y redes no se duplican aquí.
- Leads: POST `/public/leads` solo tras enviar explícitamente el formulario. name, phone, email?, type, message?, motorcycleId?; solo HTTP 201 con `{data:{id}}` válido confirma éxito. Se bloquean envíos simultáneos, se conservan entradas ante errores y nunca se reintenta POST automáticamente. El enlace de consulta de una promoción preselecciona el ID real del catálogo.
- Imágenes: se usan sus enlaces HTTPS directamente; no se descargan ni suben medios. Destinos internos empiezan con `/`; externos HTTPS sin credenciales. Se rechazan `//`, backslash, controles y esquemas ejecutables. Textos con etiquetas se muestran como texto.
- Errores: `{data:...}`/`{error:...}`, estados explícitos de carga/vacío/error y reintento. 429 respeta Retry-After en segundos o fecha. X-Request-ID se conserva en un mapa de diagnóstico en memoria (estado HTTP e ID, sin cuerpos o datos personales) y en mensajes de error cuando está disponible.

Se eliminó `src/data/editorial.ts` y se retiraron ofertas, carrusel, cifras y afirmaciones de muestra. Nada de ese contenido se publica automáticamente en la API.

## Carga y navegación

`CatalogProvider` mantiene un único overlay para las tres lecturas necesarias del catálogo. Banners, imágenes y solicitudes opcionales no bloquean ese overlay. Los recursos públicos comparten caché por ruta y deduplican solicitudes simultáneas. Los detalles y el listado de promociones muestran el overlay si necesitan una carga; si los datos están en caché, no lo muestran. Errores cierran el overlay y permiten reintentar, respetando 429.

`LoadingOverlay` usa React Portal, dialog/aria-modal, anuncio accesible y progressbar indeterminado. Bloquea el fondo con inert, conserva estilos, foco y scroll, y respeta movimiento reducido. Se conservan las rutas de catálogo/marca y el fallback SPA.

## Desarrollo y pruebas

Node.js 22.12+ y pnpm 10.34.3:

```sh
corepack enable
corepack prepare pnpm@10.34.3 --activate
pnpm install --frozen-lockfile
pnpm dev
pnpm typecheck
pnpm build
pnpm exec playwright install chromium
pnpm test
```

En Windows: `PLAYWRIGHT_CHANNEL=msedge`. Las respuestas de prueba viven exclusivamente en tests, fuera del bundle. Hay 26 pruebas aisladas y dos pruebas reales opt-in de GET, sin leads: ejecutar `LIVE_PUBLIC_API=1 pnpm test tests/live-public-api.spec.ts` (en PowerShell configurar `$env:LIVE_PUBLIC_API='1'`). La web utiliza el puerto exclusivo 4175 en Playwright. CI verifica PRs; no despliega.

Resultados reales, CORS, datos faltantes y límites de verificación están en [docs/public-content-verification.md](docs/public-content-verification.md).

## Build y ZIP para Hostinger

- Configuración fuente: raíz del repositorio, Node.js 22.12+, instalación `pnpm install --frozen-lockfile`, build `pnpm build`, salida `dist`.
- El ZIP entregado contiene el contenido de dist, con index.html en raíz, assets, robots.txt y .htaccess. Se extrae en la raíz pública; no es un ZIP de fuentes para que Hostinger compile Node.js.
- Conservar fallback SPA a index.html para catálogo, marcas, páginas y detalles de promociones. Apache/LiteSpeed puede usar .htaccess; otros servidores necesitan una regla equivalente.
- No cambiar noindex hasta autorizar SEO público. No se hace merge ni despliegue manual o automático en este cambio.

## Cambio al dominio definitivo

Después de configurar DNS, TLS y backend:

```env
VITE_API_BASE_URL=https://api.motoapexcr.com/v1
```

Actualizar también el valor por defecto en src/api/client.ts y recompilar. La URL de settings es informativa y no sustituye el entorno del cliente. Configurar allowed_origins con el origen HTTPS exacto de web/admin y exponer X-Request-ID/Retry-After. Comprobar health, GET públicos y preflight de leads, regenerar ZIP y verificar navegación con recarga. Revisar site_url y datos públicos de contacto en administración; no ejecutar migraciones ni publicar muestras desde la web.
