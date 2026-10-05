# Promociones, Usados y secciones fijas

- Usados en escritorio y móvil usa un `a` normal a https://motoapex.odoo.com/usados en la misma pestaña. Cierra el menú móvil y no consulta páginas de la API.
- Las promociones siguen usando exclusivamente GET /public/promotions y su detalle. El botón usa buttonLabel; buttonHref no determina la apertura de la ficha. No necesita configuración nueva en admin.
- Se relaciona por motorcycleId con el catálogo público. Solo las motos presentes y con moneda coincidente ofrecen ficha y precios. No hay precios inventados ni imágenes de ejemplo.
- La imagen corresponde a la moto seleccionada; varias motos permiten selección. Precios originales tachados y promocionales rojos, con moneda, showPrice de ambas respuestas y campos omitidos respetados.
- La ficha conserva colores, galería, especificaciones y formulario. allowQuote combina los permisos del catálogo y de la relación. No se modifica ningún precio del catálogo; los precios de campaña viajan como contexto aparte al popup.
- Hasta el DD/MM/AAAA usa endsAt y America/Costa_Rica. La vigencia respeta ambos extremos, actualiza al vencer y al volver a la pestaña; una oferta vencida desaparece y cierra su popup.
- Por solicitud expresa, vuelven las cifras fijas 15+ años, 4 marcas oficiales, 2000+ motos vendidas y 98% satisfacción bajo el banner, y los tres bloques originales de distribuidores oficiales, taller especializado y financiamiento antes del footer. Estos textos son contenido editorial fijo, no estadísticas de la API.

## Verificación 05/10/2026

Typecheck y build. Pruebas aisladas en Edge de escritorio 1280px y móvil 390px: navegación externa, sin consulta pages/usados, selección entre motos USD/CRC, apertura/cierre/Escape, cambio de color, especificaciones, formulario sin enviar, precios ocultos/omitidos, catálogo sin precio de campaña, moto no publicada, expiración con popup abierto, contenido fijo, errores y Retry-After. Ningún lead real enviado.

API instalada: GET promociones devuelve HTTP 200 con data vacío. CORS confirma el origen exacto https://wheat-stinkbug-153908.hostingersite.com y X-Request-ID disponible. Queda pendiente validar visualmente una campaña real publicada con sus imágenes/precios en esa API; las pruebas de casos de campaña usan respuestas aisladas, nunca sustituyen el contenido de producción.

Base actual: https://darksalmon-quetzal-730302.hostingersite.com/v1. Para migrar a https://api.motoapexcr.com/v1 cambiar VITE_API_BASE_URL y recompilar, coordinando CORS con la API. No se despliega manualmente.
