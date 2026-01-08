# Sistema de Envío de Correos Electrónicos - IndustriaSP

Implementación completa del sistema de envío de correos electrónicos utilizando Resend.

## 📋 Tabla de Contenidos

1. [Características](#características)
2. [Configuración](#configuración)
3. [Tipos de Correos](#tipos-de-correos)
4. [Uso](#uso)
5. [Monitoreo y Logs](#monitoreo-y-logs)
6. [Testing](#testing)
7. [Troubleshooting](#troubleshooting)

## ✨ Características

- ✅ Envío asíncrono de correos (no bloquea la respuesta al usuario)
- ✅ Reintentos automáticos con backoff exponencial (hasta 3 intentos)
- ✅ Fallback a `onboarding@resend.dev` si el dominio no está verificado
- ✅ Validación automática de enlaces antes del envío
- ✅ Detección heurística de contenido spam
- ✅ Logging completo en base de datos con tracking de eventos
- ✅ Webhooks para seguimiento de aperturas y clics
- ✅ Plantillas HTML responsive con diseño profesional
- ✅ Conversión automática HTML → texto plano
- ✅ Manejo robusto de errores sin afectar el flujo principal

## ⚙️ Configuración

### 1. Variables de Entorno

Agregar las siguientes variables al archivo `.env`:

```env
# API Key de Resend (OBLIGATORIO)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx

# Email remitente (debe estar verificado en Resend)
RESEND_FROM_EMAIL=IndustriaSP@whoamicode.com

# URL base de la aplicación web
WEB_URL=https://industriasp.com
```

### 2. Obtener API Key de Resend

1. Crear cuenta en [Resend](https://resend.com)
2. Ir a [API Keys](https://resend.com/api-keys)
3. Crear nueva API key
4. Copiar y pegar en `.env`

### 3. Verificar Dominio

Para usar un dominio personalizado en `RESEND_FROM_EMAIL`:

1. Ir a [Domains](https://resend.com/domains)
2. Agregar dominio
3. Configurar registros DNS (SPF, DKIM, DMARC)
4. Esperar verificación

**Nota:** Si el dominio no está verificado, el sistema usará automáticamente `onboarding@resend.dev` como fallback.

### 4. Verificar Configuración

Ejecutar el script de verificación:

```bash
npm run verify:email
```

O manualmente:

```bash
ts-node scripts/verify-email-config.ts
```

Este script:
- ✓ Verifica las variables de entorno
- ✓ Envía un email de prueba
- ✓ Muestra los logs recientes
- ✓ Reporta el estado del sistema

## 📧 Tipos de Correos

### 1. Correo de Bienvenida (Account Creation)

**Trigger:** Cuando un usuario crea una cuenta nueva

**Contenido:**
- Saludo personalizado
- Datos de acceso (email)
- Link para iniciar sesión
- Link de verificación de cuenta

**Implementación:**
```typescript
// Se envía automáticamente en AuthService.register()
await mailService.sendAccountCreation({
  to: 'usuario@example.com',
  fullName: 'Nombre del Usuario',
  verificationToken: 'abc123...',
});
```

### 2. Recuperación de Contraseña

**Trigger:** Cuando un usuario solicita restablecer su contraseña

**Contenido:**
- Saludo personalizado
- Link único de restablecimiento
- Tiempo de expiración (24 horas)
- Aviso de seguridad

**Implementación:**
```typescript
// Se envía automáticamente en AuthService.forgotPassword()
await mailService.sendPasswordReset({
  to: 'usuario@example.com',
  fullName: 'Nombre del Usuario',
  token: 'reset123...',
  expireHours: 24,
});
```

### 3. Confirmación de Pedido

**Trigger:** Cuando se registra una nueva orden

**Contenido:**
- Número de orden y tracking
- Tabla detallada con productos, cantidades y precios
- Total de la compra
- Link para ver detalles del pedido

**Implementación:**
```typescript
await mailService.sendOrderRegistered({
  to: 'cliente@example.com',
  fullName: 'Nombre del Cliente',
  orderNumber: 'ORD-001',
  trackingNumber: 'TRACK-123',
  items: [
    { name: 'Producto 1', qty: 2, price: 100.00 },
    { name: 'Producto 2', qty: 1, price: 50.00 },
  ],
  total: 250.00,
});
```

### 4. Correos Promocionales

**Trigger:** Campañas manuales desde el panel de administración

**Contenido:**
- Título personalizable
- Cuerpo HTML personalizable
- Call-to-Action configurable

**Implementación:**
```typescript
await mailService.sendPromotional({
  to: 'cliente@example.com',
  title: '¡Oferta especial!',
  bodyHtml: '<p>Contenido de la promoción...</p>',
  ctaUrl: 'https://industriasp.com/ofertas',
  ctaText: 'Ver ofertas',
});
```

## 🔧 Uso

### En el Código

El servicio `MailService` está disponible por inyección de dependencias:

```typescript
import { MailService } from '../mail/mail.service';

@Injectable()
export class MiServicio {
  constructor(private mail: MailService) {}

  async miMetodo() {
    // Envío asíncrono (recomendado)
    this.mail.sendAccountCreation({ ... })
      .then(result => {
        if (result.ok) {
          console.log('Email enviado:', result.id);
        } else {
          console.error('Error:', result.error);
        }
      });

    // Envío síncrono (bloquea la ejecución)
    const result = await this.mail.sendAccountCreation({ ... });
  }
}
```

### Desde la API REST

#### Listar Logs (Solo ADMIN)

```bash
GET /api/mail/logs
Authorization: Bearer <jwt-token>
```

#### Enviar Email de Prueba (Solo ADMIN)

```bash
POST /api/mail/test
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "to": "test@example.com",
  "subject": "Prueba",
  "html": "<p>Contenido HTML</p>"
}
```

#### Campaña Promocional (Solo ADMIN)

```bash
POST /api/mail/promo
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "Nueva promoción",
  "bodyHtml": "<p>Detalles...</p>",
  "ctaUrl": "https://...",
  "ctaText": "Ver más"
}
```

## 📊 Monitoreo y Logs

### Base de Datos

Todos los envíos se registran en la tabla `mail_logs`:

| Campo | Descripción |
|-------|-------------|
| `id` | ID único del log |
| `type` | Tipo de email (ACCOUNT_CREATION, PASSWORD_RESET, etc.) |
| `to` | Email destinatario |
| `subject` | Asunto del correo |
| `providerMessageId` | ID del mensaje en Resend |
| `status` | SUCCESS o FAIL |
| `errorMessage` | Mensaje de error (si aplica) |
| `opens` | Contador de aperturas |
| `clicks` | Contador de clics |
| `lastEvent` | Último evento (email.opened, email.clicked, etc.) |
| `lastEventAt` | Timestamp del último evento |
| `createdAt` | Fecha de creación |

### Webhooks

El sistema procesa webhooks de Resend para actualizar métricas:

**Endpoint:** `POST /api/mail/webhook`

**Eventos soportados:**
- `email.sent` - Email enviado
- `email.delivered` - Email entregado
- `email.opened` - Email abierto
- `email.clicked` - Link clickeado
- `email.bounced` - Email rebotado
- `email.complained` - Marcado como spam

**Configuración en Resend:**

1. Ir a [Webhooks](https://resend.com/webhooks)
2. Crear nuevo webhook
3. URL: `https://tu-dominio.com/api/mail/webhook`
4. Seleccionar eventos: `email.*`

### Logs en Tiempo Real

El servicio utiliza el Logger de NestJS:

```typescript
// Logs en AuthService
this.logger.log('Correo enviado exitosamente a user@example.com');
this.logger.warn('Fallo al enviar correo: Domain not verified');
this.logger.error('Error enviando correo: Network timeout', error.stack);
```

Configurar nivel de logs en producción:

```env
LOG_LEVEL=error  # error, warn, log, verbose, debug
```

## 🧪 Testing

### Tests Unitarios

```bash
# Todos los tests
npm test

# Solo tests de mail
npm test -- mail.service.spec

# Solo tests de auth
npm test -- auth.service.spec
```

### Tests de Integración

```bash
# E2E completo
npm run test:e2e

# Solo tests de email
npm run test:e2e -- auth.mail.e2e-spec
```

### Test Manual

```bash
# Verificar configuración
npm run verify:email

# O con email personalizado
TEST_EMAIL=tu-email@example.com npm run verify:email
```

## 🔍 Troubleshooting

### Problema: Email no se envía

**Posibles causas:**

1. **RESEND_API_KEY no configurada**
   - Verificar archivo `.env`
   - Ejecutar `npm run verify:email`

2. **Dominio no verificado**
   - El sistema usa fallback a `onboarding@resend.dev`
   - Verificar dominio en [Resend Domains](https://resend.com/domains)

3. **Cuota de Resend agotada**
   - Plan gratuito: 100 emails/día
   - Verificar en [Resend Dashboard](https://resend.com/overview)

4. **Email destinatario inválido**
   - Verificar formato del email
   - Revisar logs en `mail_logs` tabla

### Problema: Email llega a spam

**Soluciones:**

1. Verificar dominio con SPF, DKIM, DMARC
2. Evitar palabras spam (gratis, oferta, ganar dinero)
3. Mantener ratio bajo de quejas
4. Usar email de remitente profesional

### Problema: Logs no se guardan

**Verificar:**

1. Tabla `mail_logs` existe en BD
2. TypeORM configurado correctamente
3. Permisos de escritura en BD

```bash
# Revisar entidades
npm run typeorm entity:show mail_logs
```

### Problema: Webhooks no funcionan

**Verificar:**

1. URL pública accesible
2. Endpoint no requiere autenticación
3. Eventos configurados en Resend

```bash
# Probar endpoint manualmente
curl -X POST https://tu-dominio.com/api/mail/webhook \
  -H "Content-Type: application/json" \
  -d '{"type":"email.delivered","data":{"email_id":"msg_123"}}'
```

## 📈 Métricas y KPIs

El sistema registra automáticamente:

- **Tasa de entrega:** emails enviados vs. entregados
- **Tasa de apertura:** emails abiertos vs. entregados
- **Tasa de clics:** clics vs. aperturas
- **Tasa de rebote:** emails rebotados vs. enviados
- **Tasa de quejas:** marcados como spam vs. entregados

Consultar con SQL:

```sql
-- Tasa de entrega
SELECT 
  type,
  COUNT(*) as total,
  SUM(CASE WHEN status = 'SUCCESS' THEN 1 ELSE 0 END) as success,
  ROUND(100.0 * SUM(CASE WHEN status = 'SUCCESS' THEN 1 ELSE 0 END) / COUNT(*), 2) as delivery_rate
FROM mail_logs
GROUP BY type;

-- Emails más abiertos
SELECT to, opens, clicks, subject
FROM mail_logs
WHERE opens > 0
ORDER BY opens DESC
LIMIT 10;
```

## 🚀 Mejoras Futuras

- [ ] Soporte para attachments (adjuntos)
- [ ] Plantillas dinámicas desde BD
- [ ] Sistema de colas con Bull/Redis
- [ ] A/B testing de asuntos
- [ ] Unsubscribe links automáticos
- [ ] Reportes analíticos en dashboard
- [ ] Integración con múltiples proveedores (SendGrid, Mailgun)

## 📝 Licencia

Uso interno IndustriaSP - whoamicode.com
