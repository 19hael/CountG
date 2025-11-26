<div align="center">
  <img src="public/globe.svg" alt="Vixai Logo" width="120" height="120" />
  <h1>Vixai (CountG)</h1>
  <p><strong>La Plataforma de Gestión Inteligente para PYMEs del Futuro</strong></p>
  
  <a href="https://nextjs.org">
    <img src="https://img.shields.io/badge/Next.js-15.0-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  </a>
  <a href="https://react.dev">
    <img src="https://img.shields.io/badge/React-19.0-blue?style=for-the-badge&logo=react" alt="React" />
  </a>
  <a href="https://tailwindcss.com">
    <img src="https://img.shields.io/badge/Tailwind_CSS-4.0-38bdf8?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  </a>
  <a href="https://supabase.com">
    <img src="https://img.shields.io/badge/Supabase-Database-3ecf8e?style=for-the-badge&logo=supabase" alt="Supabase" />
  </a>
  <a href="https://deepmind.google/technologies/gemini/">
    <img src="https://img.shields.io/badge/Gemini_AI-2.0_Flash-8e75b2?style=for-the-badge&logo=google-gemini" alt="Gemini AI" />
  </a>
</div>

<br />

## 🚀 Visión General

**Vixai** es una solución integral de gestión empresarial (ERP) diseñada para modernizar PYMEs. No es solo un sistema de contabilidad; es un **copiloto inteligente** que ayuda a los dueños de negocios a tomar decisiones estratégicas, automatizar tareas repetitivas y gestionar todas las áreas de su empresa desde una única interfaz elegante y moderna.

---

## 💎 Características Principales

### 🧠 Inteligencia Artificial (Vixai AI)

Potenciado por **Gemini 2.0 Flash Lite**, nuestro asistente no es un simple chatbot.

- **Context-Aware**: Sabe en qué pantalla estás. Si estás en Contabilidad, actúa como un _Analista Financiero_. Si estás en el POS, actúa como un _Copiloto Administrativo_.
- **Análisis Proactivo**: Interpreta tus datos para darte consejos sobre rentabilidad y reducción de costos.

### 🛒 Punto de Venta (POS) y Facturación

- **Interfaz Rápida**: Diseñada para pantallas táctiles y uso ágil.
- **Facturación Electrónica**: Emisión de comprobantes lista para integrar con APIs locales.
- **Control de Caja**: Arqueos y gestión de múltiples métodos de pago.

### 📦 Inventario Inteligente

- **Stock en Tiempo Real**: Actualización automática con cada venta o compra.
- **Alertas de Stock Bajo**: Nunca te quedes sin mercadería clave.
- **Valorización**: Cálculo automático del valor de tu inventario.

### 💼 Gestión Financiera y Contable

- **Asientos Automáticos**: Cada movimiento operativo genera su contrapartida contable sin intervención manual.
- **Reportes Financieros**: Estado de Resultados, Balance General y Flujo de Caja en tiempo real.
- **Impuestos**: Estimación automática de obligaciones fiscales.

### 👥 Recursos Humanos y Proyectos

- **Nómina**: Gestión de empleados, cargos y salarios.
- **Gestión de Proyectos**: Tableros Kanban para seguimiento de tareas y entregables por cliente.

---

## 🛠️ Stack Tecnológico

Este proyecto está construido con las tecnologías más modernas y performantes del ecosistema web:

| Tecnología                  | Propósito                                                                 |
| --------------------------- | ------------------------------------------------------------------------- |
| **Next.js 15 (App Router)** | Framework React para producción. SSR y Server Components.                 |
| **React 19**                | Biblioteca de UI con las últimas características (Hooks, Server Actions). |
| **Tailwind CSS 4**          | Motor de estilos utility-first para un diseño rápido y consistente.       |
| **Supabase**                | Backend-as-a-Service: Base de datos Postgres, Autenticación y Realtime.   |
| **Google GenAI SDK**        | Integración nativa con modelos Gemini para la IA.                         |
| **Lucide React**            | Iconografía moderna y ligera.                                             |
| **Framer Motion**           | Animaciones fluidas para una experiencia de usuario premium.              |

---

## 📂 Estructura del Proyecto

```bash
src/
├── app/                 # Rutas de la aplicación (Next.js App Router)
│   ├── api/             # Endpoints de API (Chat, Auth, etc.)
│   ├── compras/         # Módulo de Compras
│   ├── contabilidad/    # Módulo de Contabilidad
│   ├── facturacion/     # Módulo de Facturación
│   ├── inventario/      # Módulo de Inventario
│   ├── onboarding/      # Wizard de configuración inicial
│   ├── pos/             # Punto de Venta
│   ├── proyectos/       # Gestión de Proyectos
│   ├── rrhh/            # Recursos Humanos
│   └── ...
├── components/          # Componentes de UI Reutilizables
│   ├── ai/              # Componentes del Asistente IA
│   ├── layout/          # Sidebar, Header, Wrappers
│   ├── ui/              # Componentes base (Tablas, Botones, Cards)
│   └── ...
├── lib/                 # Utilidades y Lógica de Negocio
│   ├── services/        # Servicios (Accounting, Inventory)
│   └── supabase.ts      # Cliente de Supabase
└── ...
```

---

## ⚡ Instalación y Despliegue

### Requisitos Previos

- Node.js 18+
- Cuenta en Supabase
- API Key de Google Gemini

### Pasos

1.  **Clonar el repositorio**

    ```bash
    git clone https://github.com/tu-usuario/count-g.git
    cd count-g
    ```

2.  **Instalar dependencias**

    ```bash
    npm install
    ```

3.  **Configurar variables de entorno**
    Crea un archivo `.env.local` en la raíz:

    ```env
    NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
    GEMINI_API_KEY=tu_gemini_api_key
    ```

4.  **Correr el servidor de desarrollo**
    ```bash
    npm run dev
    ```
    Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🎨 Galería de Módulos

<div align="center">
  <table>
    <tr>
      <td align="center"><strong>Dashboard</strong><br/>Vista general de métricas</td>
      <td align="center"><strong>POS</strong><br/>Venta rápida y ágil</td>
    </tr>
    <tr>
      <td align="center"><strong>Proyectos</strong><br/>Gestión visual Kanban</td>
      <td align="center"><strong>Onboarding</strong><br/>Configuración guiada</td>
    </tr>
  </table>
</div>

---

<div align="center">
  <p>Desarrollado con ❤️ por el equipo de Vixai</p>
  <p>© 2025 Vixai Inc. Todos los derechos reservados.</p>
</div>
