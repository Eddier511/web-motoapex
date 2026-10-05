# Verificación de módulos públicos — 4 de octubre de 2026

## Referencias revisadas antes de modificar

- Web main: `13e86f7c474e5c2d530ac66125714608663cdb5d`; incluye la integración anterior `7ec1b4682c31fcf44e625c8c8b100f2849d03e6e`. PR #1 de web figura cerrado y merged. Se conservan los cambios posteriores de tarjetas, identidad, overlay y filtros.
- API: [PR #4](https://github.com/Eddier511/api-motoapex/pull/4), rama `codex/accounts-security`, cabeza `fb73f39920e0b7d91fdcca53aa1569968be4338f`; figura abierto y no merged al revisar. Contrato leído en `docs/contract.md`, y serialización comprobada en `src/content.php` y `src/promotions.php` de esa misma rama. API main se encontró en `f8f72eca23ebd1ff1e7db2f9f25eb7d2edb5ffe5`; no se utilizó como sustituto del contrato solicitado.
- Solo se modifica web. No se ejecutan migraciones, escrituras administrativas, publicación de muestras ni despliegue.

## API instalada y CORS reales

Base comprobada: `https://darksalmon-quetzal-730302.hostingersite.com/v1`.

| GET | Resultado real |
| --- | --- |
| `/health` | 200, conexión DB saludable |
| `/public/brands` | 200, 2 marcas |
| `/public/categories` | 200, 11 categorías |
| `/public/motorcycles` | 200, 59 motos |
| `/public/promotions` | 200, lista vacía |
| `/public/banners?placement=home_hero` | 200, lista vacía |
| `/public/pages` | 200, lista vacía |
| `/public/contact` | 200, nombre MotoApex Costa Rica; teléfono, WhatsApp, correo, dirección, logo, favicon y horarios vacíos; coordenadas null |
| `/public/social-links` | 200, lista vacía |
| `/public/settings` | 200, únicamente site_url, timezone y default_currency |
| Detalles de promoción/página con slug no publicado de comprobación | 404, envoltorio de error válido |

Los GET con `Origin: https://wheat-stinkbug-153908.hostingersite.com` devolvieron exactamente ese `Access-Control-Allow-Origin`, con `Access-Control-Expose-Headers: X-Request-ID, Retry-After`. También se verificaron en Edge mediante fetch desde ese origen, sin interceptar las respuestas de API: JSON y X-Request-ID son accesibles al JavaScript. No se enviaron POST ni leads reales.

Una segunda comprobación en Edge sirvió **solo dentro de la prueba** los archivos del nuevo build bajo el origen autorizado, sin modificar Hostinger y sin interceptar la API. Pasaron catálogo real, búsqueda Adventure, apertura de ficha, URL HTTPS de galería, navegación a Ducati, texto blanco del filtro activo y lista vacía de promociones. Se bloquearon imágenes, fuentes y medios opcionales para evitar descargas; por ello esta comprobación real acredita URLs y datos, no la disponibilidad visual de todos los medios externos.

## Verificación aislada del contrato

26 pruebas de navegador, con respuestas únicamente en tests: catálogo, filtros, estados, galerías por color, precio ausente/oculto, permisos, formularios 201/200/422/429/500 y conexión rota; overlay inicial/recarga/navegación/reintento/concurrencia/foco/scroll/móvil; promociones con varias motos y USD/CRC independientes, precios omitidos y allowQuote por relación; campañas generales sin precio; showOnHome/featured; banners en orden recibido, imagen móvil y fallback de escritorio, CTA null; páginas de texto y bloques permitidos, SEO y navegación con caché; contacto, logo, favicon, coordenadas, horarios, redes en orden; vacíos y respuestas inválidas, destinos inseguros, borradores y bloques no permitidos. Capturas de promoción y home móvil revisadas.

`pnpm typecheck` y `pnpm build` pasan. CI ejecuta las pruebas aisladas; las dos pruebas reales de GET son opt-in con `LIVE_PUBLIC_API=1`. El puerto 4175 es exclusivo de la web y no reutiliza servidores de admin/API.

## Pendiente por datos o instalación

La respuesta 200 de los módulos acredita que esas rutas funcionan en el servidor, pero no certifica el contenido de `schema_migrations`: no se consultaron tablas privadas ni se asumió instalación completa de 003/004/005. Si aparecen errores al publicar contenido nuevo, la instalación debe comprobar las migraciones en el chat de API, sin reimportar schema.sql ni publicar muestras.

Faltan promociones, banners, páginas, redes y datos completos de contacto publicados. Hasta que existan, no se puede acreditar con datos reales una promoción de varias motos, detalles publicados, calendario de vigencia/publicación, logo/favicon remoto, horarios/redes reales o imágenes móvil/escritorio de banners. Se cubren con el contrato aislado, sin datos ficticios de respaldo en producción. El admin debe configurar logoUrl/faviconUrl y los datos reales; la web no conserva el logo local como fallback.

No se probaron leads reales, recepción en administración, preflight de POST /public/leads ni límites 429 reales; no se provocó carga masiva para alcanzar los límites. Pruebas de esos comportamientos permanecen aisladas. La nueva versión no está desplegada: recarga de rutas y SEO final deben confirmarse después de revisar el PR y autorizar la instalación. Los metadatos de páginas se aplican en React; el HTML inicial mantiene la metadata general y noindex existente, no hay SSR/prerender.
