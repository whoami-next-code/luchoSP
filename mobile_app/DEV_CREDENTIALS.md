# Credenciales de Desarrollo - App Flutter

## Usuario con Todos los Permisos (ADMIN)

Para crear un usuario completo con todos los permisos para la app Flutter, ejecuta:

```bash
cd backend
npm run create:flutter-user
```

### Credenciales por Defecto

- **Email:** `flutter@industriasp.com`
- **Password:** `Flutter123!`
- **Rol:** ADMIN (todos los permisos)
- **Estado:** Email confirmado, usuario activo

### Credenciales Personalizadas

Si quieres crear un usuario con credenciales diferentes:

```bash
cd backend
npx ts-node scripts/create-flutter-user.ts --email tuemail@example.com --password TuPassword123! --name "Tu Nombre"
```

## Características del Usuario Creado

✅ Usuario registrado en Supabase  
✅ Email confirmado automáticamente  
✅ Sincronizado en base de datos local  
✅ Rol ADMIN (máximos permisos)  
✅ Pedido de prueba asignado (aparece en "Mis Trabajos")  
✅ Login verificado y funcionando  

## Uso en la App

1. Ejecuta el script para crear el usuario
2. Abre la app Flutter
3. Ingresa las credenciales en la pantalla de login
4. Deberías ver tus trabajos asignados en "Mis Trabajos"

## Otros Usuarios de Prueba

### Usuario Cliente
- Email: `cliente@prueba.com`
- Password: `Cliente123!`
- Rol: CLIENTE

### Usuario Admin
- Email: `admin@industriasp.local` (o el configurado en ADMIN_EMAIL)
- Password: `admin123` (o el configurado en ADMIN_PASSWORD)
- Rol: ADMIN

## Notas

- Todos los usuarios de prueba tienen email confirmado automáticamente
- Los usuarios se crean tanto en Supabase como en la base de datos local
- Puedes ejecutar los scripts múltiples veces sin problemas (son idempotentes)
