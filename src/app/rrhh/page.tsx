"use client";

import { useState, useEffect } from "react";
import { ModuleHeader } from "@/components/ui/ModuleHeader";
import { SmartTable } from "@/components/ui/SmartTable";
import { Users, Briefcase } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function RRHHPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const { data, error } = await supabase
          .from('empleados')
          .select('*')
          .order('nombre');
        
        if (error) throw error;
        setEmployees(data || []);
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const columns = [
    { key: "nombre", label: "Nombre" },
    { 
      key: "cargo", 
      label: "Cargo",
      render: (val: string) => (
        <div className="flex items-center gap-2">
          <Briefcase className="w-3 h-3 text-indigo-400" />
          <span>{val}</span>
        </div>
      )
    },
    { 
      key: "salario", 
      label: "Salario Base",
      render: (val: number) => `$${val.toFixed(2)}`
    },
    { key: "inicio", label: "Fecha Ingreso" },
  ];

  return (
    <div className="space-y-6">
      <ModuleHeader 
        title="Recursos Humanos" 
        description="Gestión de personal y nómina básica."
        icon={Users}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
          <h3 className="text-indigo-200/60 text-sm font-medium mb-2">Total Empleados</h3>
          <p className="text-3xl font-bold text-white">3</p>
        </div>
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
          <h3 className="text-indigo-200/60 text-sm font-medium mb-2">Nómina Mensual</h3>
          <p className="text-3xl font-bold text-white">$3,650.00</p>
        </div>
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
          <h3 className="text-indigo-200/60 text-sm font-medium mb-2">Próx. Pago</h3>
          <p className="text-3xl font-bold text-emerald-400">30 Mar</p>
        </div>
      </div>

      <SmartTable
        title="Planilla de Empleados"
        data={employees}
        columns={columns}
        loading={loading}
        onAdd={() => {}}
        onEdit={(row) => {}}
      />
    </div>
  );
}
