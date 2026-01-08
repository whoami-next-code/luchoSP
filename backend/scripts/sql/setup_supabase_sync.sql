-- Habilitar extensión UUID si no existe
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Asegurar que la tabla users tenga la columna supabaseUid
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'supabaseUid') THEN 
        ALTER TABLE public.users ADD COLUMN "supabaseUid" uuid UNIQUE;
    END IF;
END $$;

-- 2. Función para sincronizar usuarios desde Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users ("email", "fullName", "role", "verified", "supabaseUid")
  VALUES (
    new.email,
    new.raw_user_meta_data->>'fullName',
    COALESCE(new.raw_user_meta_data->>'role', 'CLIENTE'), -- Rol por defecto
    TRUE, -- Si viene de Auth, asumimos email verificado o gestionado por Auth
    new.id -- UUID de Supabase
  )
  ON CONFLICT ("email") DO UPDATE SET
    "supabaseUid" = EXCLUDED."supabaseUid",
    "fullName" = COALESCE(EXCLUDED."fullName", public.users."fullName");
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Trigger que dispara la función
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Habilitar RLS en tabla users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios pueden ver sus propios datos (basado en supabaseUid)
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT
  USING (auth.uid() = "supabaseUid");

-- Política: Service Role (NestJS) puede hacer todo
-- Nota: NestJS conecta como postgres/service_role que usualmente es bypass RLS, 
-- pero si conectas como un usuario limitado, necesitas esto.
DROP POLICY IF EXISTS "Service Role full access" ON public.users;
CREATE POLICY "Service Role full access" ON public.users
  USING (true)
  WITH CHECK (true);
