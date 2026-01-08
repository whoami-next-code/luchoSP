# Realtime Admin Integration

## Gateways
- `/ws/admin`: acceso autenticado con JWT (roles `ADMIN`, `VENDEDOR`).
- `/ws/public`: acceso lectura sin autenticación para sincronización del catálogo.

## Seguridad
- Admin Gateway valida `query.token` con JWT y restringe por rol.
- Public Gateway solo emite eventos de lectura (`productos.updated`, `pedidos.updated`).

## Eventos
- Servidor → Cliente: `status` (solo admin), `productos.updated`, `pedidos.updated`.
- Cliente → Servidor: `ping` (solo admin).

## Backend
- `realtime/admin.gateway.ts`: namespace `/ws/admin`.
- `realtime/public.gateway.ts`: namespace `/ws/public`.
- `realtime/events.service.ts`: emite a ambos gateways.
- Emisiones desde: `productos.controller.ts` y `pedidos.controller.ts` tras `create|update|delete`.

## Frontend Admin
- `AdminSocketProvider`: contexto con `status` y `lastEvent`.
- Integrado en layout del admin para mostrar estado de conexión.

## Frontend Catálogo
- `PublicSocketProvider`: contexto con `status` y `lastEvent`.
- Integrado globalmente en `src/app/layout.tsx`.
- `src/app/catalogo/page.tsx`: re-fetch automático al recibir `productos.updated`.

## Diseño y Navegación
- Navbar unificado mediante `Home2Header` en el layout del App Router.
- Plantilla base del catálogo extraída en `frontend/public/catalogo-template`.

## Rendimiento
- Imágenes optimizadas con `OptimizedImage` (lazy, formatos modernos, srcset).
- Caché de `next/image` y patrones remotos configurados en `next.config.ts`.

## Pruebas
- E2E de carga sugerida en backend para `/api/productos` con múltiples solicitudes concurrentes.
- Lighthouse para frontend (archivo `lighthouse.config.js`).
