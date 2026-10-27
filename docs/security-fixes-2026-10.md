# Correcciones de seguridad y compatibilidad de la web — 27/10/2026

## Alcance

Solo Eddier511/web-motoapex. No se modifican diseño, rutas, contenido editorial fijo, API ni configuración de Hostinger. No se despliega manualmente ni se envían leads reales.

## Cambios

- Node 24.22.1 y pnpm 10.34.3 declarados y comprobados antes de instalar, compilar y probar. El runtime de validación es portátil, con SHA-256 contrastado con SHASUMS256.txt oficial; no reemplaza el Node global del equipo ni el de Hostinger.
- Vite 8.3.5; React/React DOM 19.2.9 dentro de la misma rama menor, compatibles con React Router 8.4.0. PostCSS 8.5.32, nanoid 3.3.20 bajo PostCSS y source-map-js 1.2.2 fijados mediante overrides de seguridad. Lockfile generado con pnpm 10.34.3. Sin audit fix.
- dev/preview limitados a localhost por defecto. dist sigue siendo la salida estática; no se introduce un servidor Node para producción.
- CI se ejecuta en PR, push a main y manualmente: instalación congelada, audit, pruebas HTTP, typecheck, build y Playwright.
- La caché compartida caduca a los 60 segundos, comprueba recursos activos cada 15 segundos en pestaña visible y revalida al volver al foco si el dato tiene más de 5 segundos. Conserva una sola petición por ruta. Las actualizaciones correctas no abren overlays adicionales.
- Tras un fallo de revalidación se descartan los datos anteriores y se muestra error/reintento con X-Request-ID. No hay reintentos automáticos de errores ni POST; 429 mantiene Retry-After.
- Una moto retirada cierra su ficha. Una ficha abierta incorpora especificaciones, precios y permisos nuevos. Las promociones retiradas dejan de aparecer al revalidar, manteniendo las reglas showPrice/allowQuote, moneda por relación y vigencia.
- Cancelación externa combinada con timeout de 15 segundos. Una señal ya cancelada no ejecuta fetch; al desmontar el último consumidor se cancela la solicitud compartida pendiente.
- VITE_API_BASE_URL sigue configurable y ahora rechaza credenciales, query y fragmento en la base.

## Verificación

Instalación con --frozen-lockfile, auditoría completa sin avisos conocidos, cuatro pruebas HTTP, typecheck, build y suite de navegador. Incluye retirada de campañas/motos, actualización de permisos en una ficha abierta, revalidación deduplicada al foco, errores y 429. Las pruebas reales son GET desde el origen exacto de la web, sin POST ni leads de producción.

Se mantienen independientes las verificaciones de fechas internas de marcas/categorías en la API y los encabezados/runtime efectivos de Hostinger; no se asume que sigan pendientes después de correcciones realizadas en esos sistemas.
