# Arquitectura de Autenticación Híbrida (Supabase + PostgreSQL)

Este documento describe la arquitectura de autenticación implementada para separar las responsabilidades entre Supabase (Auth) y el Backend Local (Lógica de Negocio).

## 1. Visión General

El sistema utiliza una arquitectura "Hand-in-Hand" donde:
- **Supabase** maneja exclusivamente la identidad, registro, login y recuperación de contraseñas.
- **PostgreSQL Local** maneja la lógica de negocio, relaciones de datos y una tabla `users` espejo sincronizada.
- **Backend NestJS** actúa como puente, validando tokens de Supabase y manteniendo la sincronización.

## 2. Flujo de Autenticación

### A. Registro (Frontend -> Supabase)
1. El usuario completa el formulario en el Frontend (`/auth/register`).
2. El Frontend llama directamente a `supabase.auth.signUp()`.
3. Supabase crea el usuario en su nube y retorna la sesión/usuario.
4. **Sincronización Inmediata**: El Frontend llama a `/api/sync-user` (Next.js API), que a su vez llama a `POST /api/auth/register-external` en el Backend para crear el usuario localmente.

### B. Login (Frontend -> Supabase)
1. El usuario inicia sesión en el Frontend (`/auth/login`).
2. El Frontend llama a `supabase.auth.signInWithPassword()`.
3. Supabase retorna el JWT (Access Token).
4. El Frontend almacena la sesión en `AuthContext`.

### C. Peticiones Protegidas (Frontend -> Backend)
1. El Frontend incluye el JWT en el header `Authorization: Bearer <token>`.
2. El Backend recibe la petición y el `SupabaseAuthGuard` intercepta.
3. **Validación**: El Guard valida el token contra Supabase (`/auth/v1/user`).
4. **Sincronización Lazy**:
   - El Guard extrae el `supabaseUid` (UUID) del token.
   - Busca el usuario local por `supabaseUid`.
   - Si no existe, lo busca por `email` (para migración).
   - Si no existe, lo crea automáticamente.
   - Si existe pero no tiene `supabaseUid`, lo actualiza.
5. El `req.user` se popula con los datos locales (`id`, `role`) y de Supabase (`supabaseUid`).

## 3. Estructura de Datos

### Tabla `users` (PostgreSQL Local)
| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | SERIAL | ID numérico interno para relaciones (FK). |
| `supabaseUid` | UUID | ID único de Supabase (Link fuerte). |
| `email` | VARCHAR | Email del usuario (Link secundario). |
| `role` | ENUM | Rol de negocio (ADMIN, CLIENTE, etc.). |
| `fullName` | VARCHAR | Nombre sincronizado. |

## 4. Seguridad

- **SupabaseAuthGuard**: Es la única puerta de entrada para rutas protegidas.
- **Service Key**: El Backend requiere la `SUPABASE_SERVICE_KEY` para validar tokens y administrar usuarios si es necesario.
- **External Secret**: El endpoint `register-external` está protegido por un secreto compartido (`EXTERNAL_REG_SECRET`) para evitar creaciones de usuarios no autorizadas.

## 5. Configuración Requerida

### Backend (.env)
```env
SUPABASE_URL=https://<project>.supabase.co
SUPABASE_SERVICE_KEY=<service_role_secret>
EXTERNAL_REG_SECRET=<secreto_fuerte>
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon_key>
EXTERNAL_REG_SECRET=<secreto_fuerte>
```

## 6. Mantenimiento

- **Migración**: Los usuarios existentes se vincularán automáticamente por email en su primer login.
- **Limpieza**: Se recomienda implementar un Webhook de Supabase para eliminar usuarios locales cuando se eliminan en Supabase (opcional).
