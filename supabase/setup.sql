-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Tables

-- EMPRESAS (Tenants)
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

-- USUARIOS (Linked to Auth)
CREATE TABLE IF NOT EXISTS public.usuarios (
    id UUID PRIMARY KEY REFERENCES auth.users (id),
    email TEXT,
    nombre TEXT,
    empresa_id UUID REFERENCES public.empresas (id),
    rol TEXT DEFAULT 'admin',
    fecha_creacion TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW()
);

-- CLIENTES
CREATE TABLE IF NOT EXISTS public.clientes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    empresa_id UUID REFERENCES public.empresas (id),
    nombre TEXT NOT NULL,
    email TEXT,
    telefono TEXT,
    direccion TEXT,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW()
);

-- FACTURAS (Invoices/Income)
CREATE TABLE IF NOT EXISTS public.facturas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    empresa_id UUID REFERENCES public.empresas (id),
    cliente_id UUID REFERENCES public.clientes (id),
    numero TEXT,
    descripcion TEXT, -- Added description
    fecha TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW(),
        total DECIMAL(10, 2),
        estado TEXT DEFAULT 'pendiente', -- pendiente, pagada, anulada
        created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW()
);

-- GASTOS (Expenses)
CREATE TABLE IF NOT EXISTS public.gastos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    empresa_id UUID REFERENCES public.empresas (id),
    monto DECIMAL(10, 2),
    descripcion TEXT,
    categoria TEXT, -- Added category
    fecha TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW(),
        created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW()
);

-- PRODUCTOS (Inventory)
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

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.empresas ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.facturas ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.gastos ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies (Simplified for Admin usage)
-- In a real production app, you would check (empresa_id = (select empresa_id from usuarios where id = auth.uid()))

-- Policy: Users can see their own company
CREATE POLICY "Users can view own company" ON public.empresas FOR
SELECT USING (
        id IN (
            SELECT empresa_id
            FROM public.usuarios
            WHERE
                id = auth.uid ()
        )
    );

-- Policy: Users can see data belonging to their company
CREATE POLICY "Users can view own invoices" ON public.facturas FOR ALL USING (
    empresa_id IN (
        SELECT empresa_id
        FROM public.usuarios
        WHERE
            id = auth.uid ()
    )
);

CREATE POLICY "Users can view own expenses" ON public.gastos FOR ALL USING (
    empresa_id IN (
        SELECT empresa_id
        FROM public.usuarios
        WHERE
            id = auth.uid ()
    )
);

CREATE POLICY "Users can view own clients" ON public.clientes FOR ALL USING (
    empresa_id IN (
        SELECT empresa_id
        FROM public.usuarios
        WHERE
            id = auth.uid ()
    )
);

-- 5. "Magic Trigger" for Admin User Creation
-- Even if public registration is disabled, this helps YOU (the Admin) create users in Supabase Dashboard.
-- When you create a user in Authentication > Users, this trigger will auto-create their Company and Profile.

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
  -- Try to get metadata, otherwise use defaults
  user_full_name := coalesce(new.raw_user_meta_data->>'full_name', 'Admin User');
  user_company_name := coalesce(new.raw_user_meta_data->>'company_name', 'Empresa de ' || new.email);

  -- 1. Create Company
  INSERT INTO public.empresas (nombre, email)
  VALUES (user_company_name, new.email)
  RETURNING id INTO new_company_id;

  -- 2. Create User Profile linked to Company
  INSERT INTO public.usuarios (id, email, nombre, empresa_id, rol)
  VALUES (new.id, new.email, user_full_name, new_company_id, 'admin');

  RETURN new;
END;
$$;

-- Re-create Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();