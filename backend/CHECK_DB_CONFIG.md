# Verificación de Configuración de Base de Datos

## Problema: Error de Conexión ETIMEDOUT

Si estás viendo el error `connect ETIMEDOUT 2600:1f13:838:6e01:ed6d:202e:db70:d2e2:5432`, significa que la configuración de la base de datos está incorrecta.

## Solución: Configurar Variables de Entorno

### Opción 1: Usar DATABASE_URL (Recomendado para Supabase)

En tu archivo `.env` del backend, agrega:

```env
# Formato: postgres://postgres:[PASSWORD]@[HOST]:[PORT]/postgres?sslmode=require
DATABASE_URL=postgres://postgres:TU_PASSWORD@db.TU_PROJECT_ID.supabase.co:5432/postgres?sslmode=require
```

**Para obtener estos valores en Supabase:**
1. Ve a tu proyecto en Supabase Dashboard
2. Settings → Database
3. Busca "Connection string" → "URI"
4. Copia la URL y reemplaza `[YOUR-PASSWORD]` con tu contraseña real

### Opción 2: Usar Variables Individuales

```env
# Hostname de Supabase (NO uses IP directa)
DB_HOST=db.TU_PROJECT_ID.supabase.co
# O alternativamente:
SUPABASE_DB_HOST=db.TU_PROJECT_ID.supabase.co

# Puerto (5432 para Transaction Pooler, 6543 para Session Pooler)
DB_PORT=5432
# O:
SUPABASE_DB_PORT=5432

# Usuario
DB_USER=postgres
# O:
SUPABASE_DB_USER=postgres

# Contraseña (la misma que configuraste en Supabase)
DB_PASS=tu_password_aqui
# O:
SUPABASE_DB_PASSWORD=tu_password_aqui

# Nombre de la base de datos
DB_NAME=postgres

# SSL (debe estar habilitado para Supabase)
DB_SSL=true
```

## Verificar Configuración

1. **Verifica que el hostname sea correcto:**
   - ✅ Correcto: `db.xxxxx.supabase.co`
   - ❌ Incorrecto: `2600:1f13:838:6e01:ed6d:202e:db70:d2e2` (IP directa)

2. **Verifica que tengas la contraseña correcta:**
   - La contraseña es la que configuraste cuando creaste el proyecto en Supabase
   - Si la olvidaste, puedes resetearla en Settings → Database → Reset database password

3. **Verifica que SSL esté habilitado:**
   - Supabase requiere SSL para todas las conexiones
   - Asegúrate de que `DB_SSL=true` o que `sslmode=require` esté en la URL

## Obtener Información de Conexión en Supabase

1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a **Settings** → **Database**
4. En la sección **Connection string**, encontrarás:
   - **URI**: La URL completa de conexión
   - **Host**: El hostname (ej: `db.xxxxx.supabase.co`)
   - **Port**: El puerto (5432 o 6543)
   - **Database**: `postgres`
   - **User**: `postgres`
   - **Password**: La contraseña que configuraste

## Ejemplo de .env Completo

```env
# Supabase Database
DATABASE_URL=postgres://postgres:tu_password@db.xxxxx.supabase.co:5432/postgres?sslmode=require

# O usando variables individuales:
# DB_HOST=db.xxxxx.supabase.co
# DB_PORT=5432
# DB_USER=postgres
# DB_PASS=tu_password
# DB_NAME=postgres
# DB_SSL=true

# Supabase Auth
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=tu_service_role_key
SUPABASE_ANON_KEY=tu_anon_key

# Otros
WEB_URL=http://localhost:3000
RESEND_API_KEY=tu_resend_api_key
RESEND_FROM_EMAIL=noreply@tudominio.com
```

## Notas Importantes

- **NO uses direcciones IP directas**: Supabase requiere usar el hostname
- **SSL es obligatorio**: Todas las conexiones a Supabase requieren SSL
- **Usa el Transaction Pooler (puerto 5432)**: Es más eficiente para aplicaciones
- **Mantén las credenciales seguras**: No subas el archivo `.env` al repositorio

