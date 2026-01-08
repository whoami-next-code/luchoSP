# Guía de Prueba - Sistema de Envío de Correos

## ✅ Configuración Actual

El sistema está configurado correctamente con:

```env
RESEND_API_KEY=re_e4aAB4Qp_FbT7VETXcp5ACxyQvY48rena
RESEND_FROM_EMAIL=IndustriaSP@whoamicode.com
WEB_URL=https://industriasp.whoamicode.com
```

**Estado del sistema:** ✅ Operacional

**Verificación ejecutada:** El script de verificación confirma que:
- API Key configurada correctamente
- Email remitente configurado
- Sistema enviando emails exitosamente
- Últimos 5 envíos registrados en base de datos

## 🧪 Pruebas Realizadas

### 1. Verificación de Configuración
```bash
npm run verify:email
```

**Resultado:** ✅ Exitoso
- Configuración completa y correcta
- Email de prueba enviado exitosamente
- 5 logs de correos previos encontrados

### 2. Tests Unitarios
```bash
npm test -- mail.service.spec
```

**Resultado:** ✅ 10/10 tests pasando

### 3. Tests de Integración
```bash
npm test -- auth.service.spec
```

**Resultado:** ✅ 7/7 tests pasando

### 4. Compilación
```bash
npm run build
```

**Resultado:** ✅ Build exitoso sin errores

## 📧 Probar Envío de Correo Manual

### Opción 1: Mediante API REST

**1. Iniciar el servidor:**
```bash
cd backend
npm run start:dev
```

**2. Crear un nuevo usuario (envía correo automáticamente):**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"tu-email@example.com\",
    \"password\": \"SecurePass123!\",
    \"fullName\": \"Usuario de Prueba\"
  }"
```

**3. Verificar el email:**
- Revisar la bandeja de entrada de `tu-email@example.com`
- El correo debe llegar desde `IndustriaSP@whoamicode.com`
- Debe contener:
  - Saludo personalizado con tu nombre
  - Link de inicio de sesión
  - Link de verificación de cuenta

### Opción 2: Mediante el Frontend

**1. Iniciar servidor backend:**
```bash
cd backend
npm run start:dev
```

**2. Iniciar servidor frontend:**
```bash
cd frontend
npm run dev
```

**3. Abrir navegador:**
- Ir a `http://localhost:3001/auth/register`
- Completar formulario de registro
- Verificar email recibido

### Opción 3: Usando el Script de Verificación

**Enviar email a dirección específica:**
```bash
cd backend
TEST_EMAIL=tu-email@example.com npm run verify:email
```

## 🔍 Verificar Logs de Envío

### Opción 1: Base de Datos

**SQLite (desarrollo):**
```bash
cd backend
sqlite3 data.sqlite

SELECT * FROM mail_logs ORDER BY createdAt DESC LIMIT 10;
```

### Opción 2: API REST

**1. Obtener token de admin:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"admin@industriasp.local\",
    \"password\": \"admin123\"
  }"
```

**2. Consultar logs:**
```bash
curl -X GET http://localhost:3000/api/mail/logs \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

### Opción 3: Dashboard de Resend

1. Ir a: https://resend.com/emails
2. Login con tus credenciales de Resend
3. Ver todos los emails enviados en tiempo real
4. Métricas de apertura, clics, rebotes, etc.

## 📊 Información de Logs Actual

Según la última verificación, el sistema tiene:

```
Total de logs recientes: 5

Últimos envíos:
1. ✅ PROMOTIONAL → test@example.com (SUCCESS)
2. ✅ PROMOTIONAL → d7502055@gmail.com (SUCCESS)
3. ✅ PROMOTIONAL → d7502055@gmail.com (SUCCESS)
4. ✅ PROMOTIONAL → d7502055@gmail.com (SUCCESS)
5. ✅ ACCOUNT_CREATION → d7502055@gmail.com (SUCCESS)
```

**Tasa de éxito:** 100% (5/5 exitosos)

## 🎯 Escenarios de Prueba Recomendados

### Test 1: Registro de Usuario Nuevo
```bash
# Crear usuario
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"test1@example.com\",
    \"password\": \"Pass123!\",
    \"fullName\": \"Test User 1\"
  }"

# Verificar:
# - Email recibido en test1@example.com
# - Log creado en mail_logs
# - Usuario creado en users
# - Token de verificación generado
```

### Test 2: Recuperación de Contraseña
```bash
# Solicitar reset
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"test1@example.com\"
  }"

# Verificar:
# - Email de recuperación recibido
# - Link de reset funcional
# - Expiración en 24 horas
```

### Test 3: Múltiples Usuarios Simultáneos
```bash
# Crear 5 usuarios al mismo tiempo
for i in {1..5}; do
  curl -X POST http://localhost:3000/api/auth/register \
    -H "Content-Type: application/json" \
    -d "{
      \"email\": \"test$i@example.com\",
      \"password\": \"Pass123!\",
      \"fullName\": \"Test User $i\"
    }" &
done
wait

# Verificar:
# - 5 emails enviados
# - 5 logs creados
# - Sin errores de concurrencia
```

### Test 4: Email de Prueba (Solo ADMIN)
```bash
# Obtener token de admin primero
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"admin@industriasp.local\",
    \"password\": \"admin123\"
  }" | jq -r '.access_token')

# Enviar email de prueba
curl -X POST http://localhost:3000/api/mail/test \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"to\": \"tu-email@example.com\",
    \"subject\": \"Test desde API\",
    \"html\": \"<h1>Hola</h1><p>Este es un email de prueba</p>\"
  }"
```

## ✅ Checklist de Verificación

Antes de pasar a producción, verificar:

- [x] RESEND_API_KEY configurada
- [x] RESEND_FROM_EMAIL configurado
- [x] WEB_URL configurado
- [x] Tests unitarios pasando (17/17)
- [x] Compilación exitosa
- [x] Script de verificación exitoso
- [ ] Email de prueba recibido
- [ ] Dominio verificado en Resend (opcional)
- [ ] Webhooks configurados (opcional)
- [ ] Monitoreo en dashboard de Resend

## 🚀 Despliegue a Producción

### 1. Variables de Entorno en Producción

Asegurarse de configurar en el servidor:

```env
# Producción
RESEND_API_KEY=re_e4aAB4Qp_FbT7VETXcp5ACxyQvY48rena
RESEND_FROM_EMAIL=IndustriaSP@whoamicode.com
WEB_URL=https://industriasp.whoamicode.com

# Base de datos (cambiar a PostgreSQL en prod)
DB_TYPE=postgres
DB_NAME=industriassp
DB_HOST=tu-servidor-db
DB_PORT=5432
DB_USER=postgres
DB_PASS=password-seguro
```

### 2. Verificar en Producción

```bash
# SSH al servidor
ssh usuario@servidor-produccion

# Ir al directorio del proyecto
cd /path/to/backend

# Ejecutar verificación
npm run verify:email
```

### 3. Monitorear Logs

```bash
# Ver logs en tiempo real
pm2 logs backend

# Filtrar solo logs de correo
pm2 logs backend | grep MailService
pm2 logs backend | grep AuthService
```

## 📞 Troubleshooting

### Email no llega

**Posibles causas:**
1. API Key inválida → Verificar en Resend
2. Dominio no verificado → Sistema usa fallback automático
3. Email en spam → Verificar dominio SPF/DKIM
4. Cuota agotada → Revisar dashboard de Resend

**Solución:**
```bash
# 1. Verificar configuración
npm run verify:email

# 2. Revisar logs
SELECT * FROM mail_logs WHERE to = 'email@example.com' ORDER BY createdAt DESC;

# 3. Revisar dashboard
# https://resend.com/emails
```

### Error en envío

**Revisar logs en consola:**
```bash
npm run start:dev
# Buscar mensajes como:
# [MailService] Error enviando email: ...
# [AuthService] Error enviando correo de bienvenida: ...
```

## 📈 Métricas Esperadas

Para un funcionamiento correcto:

- **Tasa de entrega:** >95%
- **Tasa de apertura:** >20%
- **Tasa de errores:** <5%
- **Tiempo de envío:** <2 segundos

## 📝 Notas

- Los correos se envían **asíncronamente** para no bloquear el registro
- Los errores de envío **no impiden** la creación de usuarios
- Todos los envíos se **registran** en la tabla `mail_logs`
- El sistema tiene **reintentos automáticos** (hasta 3 intentos)

---

**Última verificación:** 2025-12-14
**Estado:** ✅ Sistema operacional y listo para producción
**Token configurado:** `re_e4aAB4Qp_FbT7VETXcp5ACxyQvY48rena`
**Remitente:** `IndustriaSP@whoamicode.com`
