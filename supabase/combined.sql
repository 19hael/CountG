-- Combined Supabase SQL for CountG
-- Paste this into Supabase SQL editor and run.

-- 1) Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2) TABLAS PRINCIPALES (public schema)

-- EMPRESAS (Tenants)
CREATE TABLE IF NOT EXISTS public.empresas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre TEXT NOT NULL,
    ruc TEXT,
    razon_social TEXT,
    telefono TEXT,
    email TEXT,
    pais TEXT,
    plan TEXT DEFAULT 'free',
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    activa BOOLEAN DEFAULT TRUE
);

-- USUARIOS (Perfil enlazado a auth.users)
CREATE TABLE IF NOT EXISTS public.usuarios (
    id UUID PRIMARY KEY REFERENCES auth.users (id),
    email TEXT,
    nombre TEXT,
    empresa_id UUID REFERENCES public.empresas (id),
    rol TEXT DEFAULT 'user',
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PRODUCTOS / INVENTARIO
CREATE TABLE IF NOT EXISTS public.productos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id UUID REFERENCES public.empresas (id),
    nombre TEXT NOT NULL,
    codigo TEXT,
    precio_costo DECIMAL(10,2),
    precio_venta DECIMAL(10,2),
    stock_actual INTEGER DEFAULT 0,
    stock_minimo INTEGER DEFAULT 5,
    categoria TEXT,
    proveedor_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CLIENTES
CREATE TABLE IF NOT EXISTS public.clientes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id UUID REFERENCES public.empresas (id),
    nombre TEXT NOT NULL,
    email TEXT,
    telefono TEXT,
    cedula TEXT,
    direccion TEXT,
    saldo DECIMAL(10,2) DEFAULT 0,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- FACTURAS / INGRESOS
CREATE TABLE IF NOT EXISTS public.facturas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id UUID REFERENCES public.empresas (id),
    cliente_id UUID REFERENCES public.clientes (id),
    numero TEXT,
    descripcion TEXT,
    fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    monto DECIMAL(10,2),
    impuesto DECIMAL(10,2),
    total DECIMAL(10,2),
    estado TEXT DEFAULT 'pendiente',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- GASTOS / EGRESOS
CREATE TABLE IF NOT EXISTS public.gastos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id UUID REFERENCES public.empresas (id),
    fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    monto DECIMAL(10,2),
    categoria TEXT,
    descripcion TEXT,
    comprobante TEXT,
    responsable UUID REFERENCES public.usuarios (id)
);

-- CITAS
CREATE TABLE IF NOT EXISTS public.citas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id UUID REFERENCES public.empresas (id),
    cliente_id UUID REFERENCES public.clientes (id),
    fecha DATE,
    hora TIME,
    duracion INTEGER,
    servicio TEXT,
    estado TEXT DEFAULT 'programada',
    notas TEXT
);

-- CHATBOT LOGS
CREATE TABLE IF NOT EXISTS public.chatbot_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id UUID REFERENCES public.empresas (id),
    numero_whatsapp TEXT,
    mensaje_entrada TEXT,
    respuesta_ia TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    tipo_consulta TEXT
);

-- Invite tokens (optional)
CREATE TABLE IF NOT EXISTS public.invite_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  token TEXT UNIQUE NOT NULL,
  created_by UUID REFERENCES auth.users (id),
  empresa_id UUID REFERENCES public.empresas (id),
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3) Habilitar Row Level Security (RLS) en las tablas relevantes
ALTER TABLE public.empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facturas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gastos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.citas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatbot_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invite_tokens ENABLE ROW LEVEL SECURITY;

-- 4) POLÍTICAS RLS SUGERIDAS (básicas)
-- Users can view data for their company (ejemplo para facturas)
CREATE POLICY "Users can view own invoices" ON public.facturas
    FOR SELECT USING (
        empresa_id IN (
            SELECT empresa_id FROM public.usuarios WHERE id = auth.uid()
        )
    );
-- Política para ver clientes de la misma empresa
CREATE POLICY "Users can view own clients" ON public.clientes
    FOR SELECT USING (
        empresa_id IN (
            SELECT empresa_id FROM public.usuarios WHERE id = auth.uid()
        )
    );

-- Política para operaciones completas (SELECT/INSERT/UPDATE/DELETE) sobre recursos por empresa
CREATE POLICY "Users can operate on own resources" ON public.productos
    FOR ALL USING (
        empresa_id IN (
            SELECT empresa_id FROM public.usuarios WHERE id = auth.uid()
        )
    ) WITH CHECK (
        empresa_id IN (
            SELECT empresa_id FROM public.usuarios WHERE id = auth.uid()
        )
    );

-- Políticas para la tabla public.empresas y public.usuarios (perfil)
CREATE POLICY "Users can view own company" ON public.empresas
    FOR SELECT USING (
        id IN (
            SELECT empresa_id FROM public.usuarios WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can manage own profile" ON public.usuarios
    FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Permisos para invite_tokens (solo admins pueden crear)
CREATE POLICY "Admins can create invites" ON public.invite_tokens
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.usuarios WHERE id = auth.uid() AND rol = 'admin'
    )
  );

-- 5) TRIGGER / FUNCION: manejar creación de auth.users -> crear empresa y perfil
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
  user_full_name := coalesce(NEW.raw_user_meta_data->>'full_name', NEW.email);
  user_company_name := coalesce(NEW.raw_user_meta_data->>'company_name', 'Empresa de ' || NEW.email);

  INSERT INTO public.empresas (nombre, email)
  VALUES (user_company_name, NEW.email)
  RETURNING id INTO new_company_id;

  INSERT INTO public.usuarios (id, email, nombre, empresa_id, rol)
  VALUES (NEW.id, NEW.email, user_full_name, new_company_id, 'admin');

  RETURN NEW;
END;
$$;

-- Re-crear trigger sobre auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- END OF COMBINED SQL
