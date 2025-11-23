-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- EMPRESAS (Multi-tenant)
CREATE TABLE IF NOT EXISTS empresas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    nombre TEXT NOT NULL,
    ruc TEXT,
    razon_social TEXT,
    telefono TEXT,
    email TEXT,
    pais TEXT,
    plan TEXT DEFAULT 'free',
    fecha_creacion TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW(),
        activa BOOLEAN DEFAULT TRUE
);

-- USUARIOS
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    email TEXT UNIQUE NOT NULL,
    nombre TEXT,
    empresa_id UUID REFERENCES empresas (id),
    rol TEXT DEFAULT 'user', -- admin, user, contador
    password_hash TEXT, -- In Supabase Auth this is handled separately, but keeping for structure
    fecha_creacion TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW()
);

-- PRODUCTOS/INVENTARIO
CREATE TABLE IF NOT EXISTS productos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    empresa_id UUID REFERENCES empresas (id),
    nombre TEXT NOT NULL,
    codigo TEXT,
    precio_costo DECIMAL(10, 2),
    precio_venta DECIMAL(10, 2),
    stock_actual INTEGER DEFAULT 0,
    stock_minimo INTEGER DEFAULT 5,
    categoria TEXT,
    proveedor_id UUID, -- Can reference a proveedores table if added later
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW()
);

-- CLIENTES
CREATE TABLE IF NOT EXISTS clientes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    empresa_id UUID REFERENCES empresas (id),
    nombre TEXT NOT NULL,
    email TEXT,
    telefono TEXT,
    cedula TEXT,
    direccion TEXT,
    saldo DECIMAL(10, 2) DEFAULT 0,
    fecha_creacion TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW()
);

-- FACTURAS/INGRESOS
CREATE TABLE IF NOT EXISTS facturas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    empresa_id UUID REFERENCES empresas (id),
    cliente_id UUID REFERENCES clientes (id),
    numero TEXT,
    fecha TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW(),
        monto DECIMAL(10, 2),
        impuesto DECIMAL(10, 2),
        total DECIMAL(10, 2),
        estado TEXT DEFAULT 'pendiente', -- pagada, pendiente, anulada
        descripcion TEXT
);

-- GASTOS/EGRESOS
CREATE TABLE IF NOT EXISTS gastos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    empresa_id UUID REFERENCES empresas (id),
    fecha TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW(),
        monto DECIMAL(10, 2),
        categoria TEXT,
        descripcion TEXT,
        comprobante TEXT, -- URL to file
        responsable UUID REFERENCES usuarios (id)
);

-- CITAS
CREATE TABLE IF NOT EXISTS citas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    empresa_id UUID REFERENCES empresas (id),
    cliente_id UUID REFERENCES clientes (id),
    fecha DATE,
    hora TIME,
    duracion INTEGER, -- minutos
    servicio TEXT,
    estado TEXT DEFAULT 'programada', -- programada, completada, cancelada
    notas TEXT
);

-- CHATBOT_LOGS
CREATE TABLE IF NOT EXISTS chatbot_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    empresa_id UUID REFERENCES empresas (id),
    numero_whatsapp TEXT,
    mensaje_entrada TEXT,
    respuesta_ia TEXT,
    timestamp TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW(),
        tipo_consulta TEXT
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;

ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

ALTER TABLE productos ENABLE ROW LEVEL SECURITY;

ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;

ALTER TABLE facturas ENABLE ROW LEVEL SECURITY;

ALTER TABLE gastos ENABLE ROW LEVEL SECURITY;

ALTER TABLE citas ENABLE ROW LEVEL SECURITY;

ALTER TABLE chatbot_logs ENABLE ROW LEVEL SECURITY;

-- Create policies (Simplified for initial setup - allow all for anon for now or authenticated)
-- In production, these should be strict based on empresa_id
CREATE POLICY "Allow public read access" ON products FOR
SELECT USING (true);