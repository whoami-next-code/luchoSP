# ⚡ SOLUCIÓN RÁPIDA: Crear archivo .env

## El error `ETIMEDOUT 2600:1f13:838:6e01:ed6d:202e:db70:d2e2` significa que hay una configuración incorrecta

## ✅ SOLUCIÓN INMEDIATA

Crea manualmente un archivo llamado `.env` en la carpeta `backend/` con este contenido:

```env
DB_TYPE=sqlite
SQLITE_PATH=dev.sqlite
NODE_ENV=development
```

### Pasos:

1. Abre tu editor de texto (Notepad, VS Code, etc.)
2. Crea un nuevo archivo
3. Copia y pega las 3 líneas de arriba
4. Guarda el archivo como `.env` (con el punto al inicio) en la carpeta `backend/`
5. Reinicia el servidor

**¡Listo!** El servidor ahora usará SQLite automáticamente y no intentará conectarse a PostgreSQL.

---

## 🔍 ¿Por qué funciona esto?

El código ahora detecta automáticamente:
- Si `DB_TYPE=sqlite` → usa SQLite
- Si hay una IP incorrecta en la configuración → usa SQLite automáticamente
- Si no hay configuración válida de PostgreSQL → usa SQLite

---

## 📝 Para usar Supabase más adelante

Cuando quieras usar Supabase, edita el archivo `.env` y reemplaza el contenido con:

```env
DATABASE_URL=postgres://postgres:TU_PASSWORD@db.TU_PROJECT_ID.supabase.co:5432/postgres?sslmode=require
NODE_ENV=development
```

Obtén las credenciales en: https://supabase.com/dashboard → Tu Proyecto → Settings → Database

