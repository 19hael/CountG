"use client";

import { useState } from "react";
import { ModuleHeader } from "@/components/ui/ModuleHeader";
import { SmartTable } from "@/components/ui/SmartTable";
import { ShoppingCart, Truck, Plus, FileText } from "lucide-react";

export default function ComprasPage() {
  const [activeTab, setActiveTab] = useState<'orders' | 'providers'>('orders');

  // Mock Data
  const orders = [
    { id: 1, numero: "OC-2024-001", proveedor: "Distribuidora Central", fecha: "2024-03-22", total: 5400.00, estado: "Recibido" },
    { id: 2, numero: "OC-2024-002", proveedor: "Importaciones Tech", fecha: "2024-03-23", total: 1200.00, estado: "Pendiente" },
  ];

  const providers = [
    { id: 1, nombre: "Distribuidora Central", contacto: "Carlos Ruiz", telefono: "555-0123", email: "ventas@distcentral.com" },
    { id: 2, nombre: "Importaciones Tech", contacto: "Ana Silva", telefono: "555-0987", email: "contacto@itech.com" },
  ];

  const orderColumns = [
    { key: "numero", label: "N° Orden" },
    { key: "proveedor", label: "Proveedor" },
    { key: "fecha", label: "Fecha" },
    { key: "total", label: "Total", render: (val: number) => `$${val.toFixed(2)}` },
    { 
      key: "estado", 
      label: "Estado",
      render: (val: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          val === 'Recibido' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'
        }`}>
          {val}
        </span>
      )
    },
  ];

  const providerColumns = [
    { key: "nombre", label: "Empresa" },
    { key: "contacto", label: "Contacto" },
    { key: "telefono", label: "Teléfono" },
    { key: "email", label: "Email" },
  ];

  return (
    <div className="space-y-6">
      <ModuleHeader 
        title="Compras y Proveedores" 
        description="Gestión de abastecimiento y relaciones comerciales."
        icon={ShoppingCart}
      />

      {/* Tabs */}
      <div className="flex gap-4 border-b border-white/10">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'orders' 
              ? 'border-indigo-500 text-indigo-400' 
              : 'border-transparent text-indigo-200/60 hover:text-indigo-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          Órdenes de Compra
        </button>
        <button
          onClick={() => setActiveTab('providers')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'providers' 
              ? 'border-indigo-500 text-indigo-400' 
              : 'border-transparent text-indigo-200/60 hover:text-indigo-200'
          }`}
        >
          <Truck className="w-4 h-4" />
          Proveedores
        </button>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeTab === 'orders' && (
          <SmartTable
            title="Órdenes de Compra"
            data={orders}
            columns={orderColumns}
            loading={false}
            onAdd={() => console.log("New Order")}
            onEdit={(row) => console.log("Edit Order", row)}
          />
        )}

        {activeTab === 'providers' && (
          <SmartTable
            title="Directorio de Proveedores"
            data={providers}
            columns={providerColumns}
            loading={false}
            onAdd={() => console.log("New Provider")}
            onEdit={(row) => console.log("Edit Provider", row)}
          />
        )}
      </div>
    </div>
  );
}
