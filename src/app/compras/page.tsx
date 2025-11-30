"use client";

import { useState, useEffect } from "react";
import { ModuleHeader } from "@/components/ui/ModuleHeader";
import { SmartTable } from "@/components/ui/SmartTable";
import { ShoppingCart, Truck, Plus, FileText } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ComprasPage() {
  const [activeTab, setActiveTab] = useState<'orders' | 'providers'>('orders');

  const [orders, setOrders] = useState<any[]>([]);
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, providersRes] = await Promise.all([
          supabase.from('ordenes_compra').select('*').order('fecha', { ascending: false }),
          supabase.from('proveedores').select('*').order('nombre')
        ]);

        if (ordersRes.error) throw ordersRes.error;
        if (providersRes.error) throw providersRes.error;

        setOrders(ordersRes.data || []);
        setProviders(providersRes.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
            loading={loading}
            onAdd={() => {}}
            onEdit={(row) => {}}
          />
        )}

        {activeTab === 'providers' && (
          <SmartTable
            title="Directorio de Proveedores"
            data={providers}
            columns={providerColumns}
            loading={false}
            onAdd={() => {}}
            onEdit={(row) => {}}
          />
        )}
      </div>
    </div>
  );
}
