"use client";

import { useState, useEffect } from "react";
import { ModuleHeader } from "@/components/ui/ModuleHeader";
import { SmartTable } from "@/components/ui/SmartTable";
import { FileText, Plus, Download, Send } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function FacturacionPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for now, or fetch from 'facturas' if table exists
    // In a real scenario, we would fetch from Supabase
    const mockInvoices = [
      { id: 1, numero: "F001-00001", cliente: "Juan Perez", fecha: "2024-03-20", total: 150.00, estado: "Pagada" },
      { id: 2, numero: "F001-00002", cliente: "Empresa ABC", fecha: "2024-03-21", total: 1250.50, estado: "Pendiente" },
      { id: 3, numero: "F001-00003", cliente: "Maria Lopez", fecha: "2024-03-21", total: 45.00, estado: "Pagada" },
    ];
    setInvoices(mockInvoices);
    setLoading(false);
  }, []);

  const columns = [
    { key: "numero", label: "N° Factura" },
    { key: "cliente", label: "Cliente" },
    { key: "fecha", label: "Fecha" },
    { 
      key: "total", 
      label: "Total",
      render: (val: number) => `$${val.toFixed(2)}`
    },
    { 
      key: "estado", 
      label: "Estado",
      render: (val: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          val === 'Pagada' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
        }`}>
          {val}
        </span>
      )
    },
  ];

  return (
    <div>
      <ModuleHeader 
        title="Facturación" 
        description="Historial de facturas y documentos electrónicos."
        icon={FileText}
        action={
          <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2">
            <Plus className="w-4 h-4" /> Nueva Factura
          </button>
        }
      />
      
      <SmartTable
        title="Documentos Emitidos"
        data={invoices}
        columns={columns}
        loading={loading}
        onEdit={(row) => console.log("View invoice", row)}
        onDelete={(row) => console.log("Void invoice", row)}
      />
    </div>
  );
}
