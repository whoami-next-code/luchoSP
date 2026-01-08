# Configuración de Variables de Entorno

## Error: "password authentication failed for user postgres"

Este error significa que la contraseña de PostgreSQL es incorrecta. Tienes dos opciones:

## ✅ SOLUCIÓN RÁPIDA: Usar SQLite para Desarrollo

Si solo quieres desarrollar localmente sin configurar Supabase, usa SQLite:

1. Crea un archivo `.env` en la carpeta `backend/`
2. Agrega esta línea:

```env
DB_TYPE=sqlite
SQLITE_PATH=dev.sqlite
```

3. Reinicia el servidor. ¡Listo! No necesitas configurar nada más.

---

## ✅ SOLUCIÓN COMPLETA: Configurar PostgreSQL/Supabase

Si necesitas usar PostgreSQL (Supabase), sigue estos pasos:

### Paso 1: Obtener Credenciales de Supabase

1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a **Settings** → **Database**
4. En la sección **Connection string**, encontrarás:
   - **URI**: La URL completa de conexión
   - **Host**: El hostname (ej: `db.xxxxx.supabase.co`)
   - **Port**: El puerto (5432)
   - **Database**: `postgres`
   - **User**: `postgres`
   - **Password**: La contraseña que configuraste

### Paso 2: Crear archivo `.env`

Crea un archivo `.env` en la carpeta `backend/` con una de estas opciones:

#### Opción A: Usar DATABASE_URL (Recomendado)

```env
# Conexión a Supabase PostgreSQL
DATABASE_URL=postgres://postgres:TU_PASSWORD@db.TU_PROJECT_ID.supabase.co:5432/postgres?sslmode=require

# Supabase Auth
SUPABASE_URL=https://TU_PROJECT_ID.supabase.co
SUPABASE_SERVICE_KEY=tu_service_role_key
SUPABASE_ANON_KEY=tu_anon_key

# Otros
NODE_ENV=development
WEB_URL=http://localhost:3000
```

**⚠️ IMPORTANTE:** Reemplaza:
- `TU_PASSWORD` con tu contraseña real de Supabase
- `TU_PROJECT_ID` con el ID de tu proyecto Supabase

#### Opción B: Usar Variables Individuales

```env
# Base de datos
DB_HOST=db.TU_PROJECT_ID.supabase.co
DB_PORT=5432
DB_USER=postgres
DB_PASS=tu_password_aqui
DB_NAME=postgres
DB_SSL=true

# Supabase Auth
SUPABASE_URL=https://TU_PROJECT_ID.supabase.co
SUPABASE_SERVICE_KEY=tu_service_role_key
SUPABASE_ANON_KEY=tu_anon_key

# Otros
NODE_ENV=development
WEB_URL=http://localhost:3000
```

### Paso 3: Verificar la Contraseña

Si olvidaste tu contraseña de Supabase:

1. Ve a Supabase Dashboard → Settings → Database
2. Haz clic en **Reset database password**
3. Copia la nueva contraseña
4. Actualiza tu archivo `.env`

---

## 🔍 Verificar Configuración

Después de configurar, reinicia el servidor. Deberías ver uno de estos mensajes:

- **SQLite:** `📊 Usando SQLite para desarrollo: dev.sqlite`
- **PostgreSQL:** `📊 Conectando a PostgreSQL: db.xxxxx.supabase.co:5432/postgres`

Si ves errores de conexión, verifica:
- ✅ La contraseña es correcta
- ✅ El hostname es correcto (no uses IP directa)
- ✅ SSL está habilitado (`DB_SSL=true` o `sslmode=require`)
- ✅ El puerto es correcto (5432 para Supabase)

---

## 📝 Notas Importantes

- **NO subas el archivo `.env` al repositorio** (debe estar en `.gitignore`)
- **SQLite es solo para desarrollo local** - no lo uses en producción
- **Supabase requiere SSL** - asegúrate de tener `DB_SSL=true` o `sslmode=require`
- **Usa el hostname, no la IP** - Supabase requiere `db.xxxxx.supabase.co`, no una IP directa

