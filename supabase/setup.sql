-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Tables
CREATE TABLE IF NOT EXISTS public.empresas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    nombre TEXT NOT NULL,
    email TEXT,
    plan TEXT DEFAULT 'free',
    fecha_creacion TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW(),
        activa BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS public.usuarios (
    id UUID PRIMARY KEY REFERENCES auth.users (id), -- Link to Auth User
    email TEXT,
    nombre TEXT,
    empresa_id UUID REFERENCES public.empresas (id),
    rol TEXT DEFAULT 'admin',
    fecha_creacion TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.facturas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    empresa_id UUID REFERENCES public.empresas (id),
    cliente_id UUID, -- Can reference clients table
    numero TEXT,
    fecha TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW(),
        total DECIMAL(10, 2),
        estado TEXT DEFAULT 'pendiente',
        created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.gastos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    empresa_id UUID REFERENCES public.empresas (id),
    monto DECIMAL(10, 2),
    descripcion TEXT,
    fecha TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW(),
        created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.clientes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    empresa_id UUID REFERENCES public.empresas (id),
    nombre TEXT NOT NULL,
    email TEXT,
    telefono TEXT,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.productos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    empresa_id UUID REFERENCES public.empresas (id),
    nombre TEXT NOT NULL,
    stock_actual INTEGER DEFAULT 0,
    stock_minimo INTEGER DEFAULT 5,
    precio_venta DECIMAL(10, 2),
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW()
);

-- 3. Enable RLS
ALTER TABLE public.empresas ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.facturas ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.gastos ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;

-- 4. Create Basic Policies (Adjust for production!)
-- Allow users to read their own data based on company_id
CREATE POLICY "Users can view own company data" ON public.empresas FOR
SELECT USING (
        id IN (
            SELECT empresa_id
            FROM public.usuarios
            WHERE
                id = auth.uid ()
        )
    );

CREATE POLICY "Users can view own profile" ON public.usuarios FOR
SELECT USING (id = auth.uid ());

-- 5. Create Trigger Function for New User Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  new_company_id uuid;
  user_full_name text;
  user_company_name text;
BEGIN
  -- Get metadata
  user_full_name := coalesce(new.raw_user_meta_data->>'full_name', 'Usuario Nuevo');
  user_company_name := coalesce(new.raw_user_meta_data->>'company_name', 'Empresa de ' || new.email);

  -- Create Company
  INSERT INTO public.empresas (nombre, email)
  VALUES (user_company_name, new.email)
  RETURNING id INTO new_company_id;

  -- Create User Profile
  INSERT INTO public.usuarios (id, email, nombre, empresa_id, rol)
  VALUES (new.id, new.email, user_full_name, new_company_id, 'admin');

  RETURN new;
END;
$$;

-- 6. Create Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();