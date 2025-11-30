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
    const fetchInvoices = async () => {
      try {
        const { data, error } = await supabase
          .from('facturas')
          .select('*')
          .order('fecha', { ascending: false });
        
        if (error) throw error;
        setInvoices(data || []);
      } catch (error) {
        console.error('Error fetching invoices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
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
        onEdit={(row) => {}}
        onDelete={(row) => {}}
      />
    </div>
  );
}
