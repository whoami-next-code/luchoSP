# Configuración de Resend y Entregabilidad

## Credenciales y Dominio
- `RESEND_API_KEY`: clave de producción de Resend.
- `RESEND_FROM_EMAIL`: debe usar un dominio verificado (ej. `notificaciones@tudominio.com`).
- Verifica el dominio en Resend (DNS: SPF, DKIM, DMARC). Sin verificación, usa `onboarding@resend.dev` solo para pruebas.

## Variables de Entorno Clave
- `ADMIN_ALERT_EMAIL`: correo que recibirá alertas de entregabilidad.
- `EMAIL_FORCE_TO_ENABLE=true` y `EMAIL_FORCE_TO=<tu_correo>` para pruebas forzadas.
- `EMAIL_PRIMARY_MODE=true`: habilita textos/subjects “primarios”.

## Endpoints de Diagnóstico
- `GET /api/mail/verify-config` (ADMIN): valida API Key, dominio “from” y prueba de envío.
- `GET /api/mail/logs` (ADMIN): últimos 50 logs.
- `GET /api/mail/metrics` (ADMIN): métricas básicas.
- `POST /api/mail/test` (ADMIN): envío simple de prueba.
- `POST /api/mail/test-multi` (ADMIN): envíos de prueba a múltiples destinatarios.

## Errores Comunes y Soluciones
- `domain not verified` / `from is not allowed`: verifica dominio y usa `RESEND_FROM_EMAIL` con ese dominio.
- `invalid_email`: valida formato y existencia de MX (el sistema lo revisa).
- Alto `fail_rate` en `metrics`: revisa reputación, contenido, enlazado y fila de DNS.

## Buenas Prácticas de Contenido
- Evita palabras “spammy” en subject/body.
- Proporciona texto alternativo (plain text) y enlaces válidos (el sistema verifica con HEAD).
- Usa una firma consistente y dirección de respuesta (`reply_to`).

