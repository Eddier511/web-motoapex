# MotoApex web — integración pública v1

La web conserva React, Vite, Tailwind y el diseño existente. Marcas, categorías y motocicletas se leen únicamente de la API. No hay catálogo ficticio de respaldo.

## Contrato y API pendiente

La integración se basa en [docs/contract.md de codex/api-foundation](https://github.com/Eddier511/api-motoapex/blob/codex/api-foundation/docs/contract.md) y en las respuestas de `publicMotorcycle` del [PR #1 de API](https://github.com/Eddier511/api-motoapex/pull/1). Ese PR está abierto; no se presupone que la implementación esté en `main` ni instalada.

Base pública actual:

```env
VITE_API_BASE_URL=https://darksalmon-quetzal-730302.hostingersite.com/v1
```

Configurar esta variable en el entorno de compilación de Hostinger, o copiar `.env.example` a `.env.local` para desarrollo. Si no se define, el cliente usa explícitamente la misma base actual. Vite incorpora esta URL pública en el JavaScript al compilar; cambiarla requiere compilar de nuevo. No colocar tokens ni contraseñas en variables `VITE_*`.

## Desarrollo y verificaciones

Node.js 22 (22.12 o posterior), pnpm 10.34.3:

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

Las pruebas Playwright interceptan las respuestas HTTP con fixtures del contrato. Solo existen en `tests/`; no se importan ni se incluyen en la aplicación. Verifican navegación de escritorio/móvil, recarga de marca, categorías generales y de marca por IDs del servidor, búsqueda, año, nuevos, orden de precio, galerías por color e imagen principal, estados de disponibilidad, precios ausentes/ocultos, `allowQuote`, especificaciones y texto HTML escapado. Prueban formularios con 201, 200 inesperado, 422, 500, 429, respuesta inválida y fallo de conexión. En Windows puede usarse `PLAYWRIGHT_CHANNEL=msedge` para un Edge instalado.

El workflow `verify.yml` solo verifica PRs o ejecuciones manuales; no publica ni despliega.

## Comportamiento

- GET `/public/brands`, `/public/categories`, `/public/motorcycles`, envoltorio `{data: ...}`. Los IDs de categorías y motos se conservan como cadenas del servidor. Los enlaces de marca/categoría usan sus slugs; se resuelven a IDs para filtrar.
- El catálogo comienza con todos los años, sin ocultar motos por el año del equipo. Categorías generales aplican a todas las marcas.
- `showPrice=false` descarta `price` y `promoPrice` incluso si aparecen por error en la respuesta. Un precio ausente no se convierte en cero ni se muestra. Se usa la moneda real; las monedas diferentes se agrupan al ordenar y los precios no publicados quedan al final.
- Disponibilidad: `available` = Disponible; `reserved` = Reservado; `coming-soon` = Próximamente; `sold-out` = Agotado. Reservado no es una preorden.
- Galerías: colores e imágenes ordenados, principal primero; cambio de color reinicia la galería. Colores no disponibles siguen siendo consultables visualmente y muestran su estado. Galerías vacías/fallidas muestran un mensaje.
- Solo URLs HTTPS sin credenciales se usan como imágenes del catálogo. Los textos de API se renderizan con React, sin HTML crudo. No se consumen rutas privadas ni se guarda/envía Authorization, tokens o credenciales MySQL.
- Formularios de contacto y de ficha envían POST `/public/leads`: nombre, teléfono, email opcional, mensaje opcional, tipo e ID real de moto si se seleccionó. `allowQuote=false` elimina cotización y su enlace de WhatsApp; quedan consultas de contacto/disponibilidad/prueba. Seleccionar una moto sin cotización transforma una cotización previamente seleccionada en disponibilidad.
- Solo HTTP 201 con `{data:{id}}` válido confirma el envío. Se bloquean envíos simultáneos, se conservan datos ante errores y no se reintenta automáticamente un POST. Ante conexión interrumpida se advierte que no se pudo confirmar y se recomienda verificar con un asesor antes de repetirlo.
- Carga, errores y catálogo vacío son estados explícitos. Los 429 respetan `Retry-After` (segundos o fecha); sin encabezado legible se esperan 60 segundos. La API debe exponer ese encabezado mediante CORS.

## Contenido editorial estático

Hero y promociones permanecen en `src/data/editorial.ts` porque la API v1 todavía no ofrece esos endpoints. Sus textos, enlaces, imágenes y precios de campaña son contenido editorial existente, independiente del catálogo real; no se usan como respaldo cuando la API falla. Sus referencias de marca son slugs, no IDs ficticios de catálogo. Revisar vigencia y contenido antes de publicar campañas. El resto de textos corporativos/contacto mantiene el diseño y contenido existente.

## Hostinger y ZIP compilado

- Elegir Vite/React, Node.js 22.12+ y el directorio raíz del repositorio.
- Instalación: `pnpm install --frozen-lockfile`; compilación: `pnpm build`; salida: `dist`.
- `web-motoapex-hostinger.zip` contiene exclusivamente el contenido de `dist`, con `index.html` en la raíz, assets y `.htaccess`. Es un ZIP de archivos estáticos compilados para extraer en la raíz pública, no un ZIP de fuentes para la opción de Hostinger que compila un proyecto Node.js.
- Si se usa el flujo GitHub que compila, usar el repositorio fuente y los ajustes anteriores. No hace falta ejecutar `vite preview` como servidor de producción.
- Las rutas React (`/motocicletas`, `/:brand`) necesitan fallback a `index.html`. El ZIP incluye `.htaccess` para Apache/LiteSpeed; para un alojamiento que no lo interprete, configurar el equivalente SPA en Hostinger. Verificar recarga directa de una marca en el servidor final.
- El logo se incluye directamente, sin requerir Git LFS.
- Conservar `noindex` existente hasta autorizar la publicación/SEO. Este trabajo no cambia esa decisión.
- Configurar en la API `allowed_origins` con el origen HTTPS exacto de la web y los orígenes de desarrollo autorizados. Los GET sin Origin desde terminal no verifican CORS de navegador.

## Resultado y pruebas pendientes (4 de octubre de 2026)

Compilación y TypeScript pasan. Las verificaciones de navegador usan respuestas aisladas del contrato, no acreditan que el backend esté instalado.

La comprobación inicial devolvió **HTTP 403 con HTML de alojamiento**. En las comprobaciones posteriores, `/v1/health` devolvió HTTP 200 con `{data:{status:"ok"}}` y los tres GET públicos devolvieron JSON de catálogo; se revisaron las tarjetas con las fotografías HTTPS de las dos motos publicadas. No se enviaron leads reales ni se crearon datos de prueba en producción. La revisión visual utiliza una captura de las respuestas públicas para aislar el diseño y no acredita CORS desde el dominio final.

Quedan por verificar: CORS desde el dominio definitivo, filtros y permisos con un catálogo real más amplio, creación de un lead autorizada con 201, su recepción en administración y el 429 del servidor. También queda pendiente la navegación con recarga en el hosting final.

## Cambio futuro de dominio API

Después de instalar TLS, DNS y el backend en `api.motoapexcr.com`, conservar el contrato y cambiar:

```env
VITE_API_BASE_URL=https://api.motoapexcr.com/v1
```

Autorizar el origen de la web en CORS, verificar `/v1/health` y las rutas públicas, compilar nuevamente y generar un ZIP nuevo. Cambiar el valor por defecto en `src/api/client.ts` al realizar esa migración para que instalaciones sin variable también usen el dominio definitivo.

El PR de web se entrega para revisión. No se hizo merge ni despliegue, ni se conectó el repositorio al despliegue automático.
