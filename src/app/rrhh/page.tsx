"use client";

import { useState } from "react";
import { ModuleHeader } from "@/components/ui/ModuleHeader";
import { SmartTable } from "@/components/ui/SmartTable";
import { Users, UserPlus, Briefcase } from "lucide-react";

export default function RRHHPage() {
  // Mock Data
  const employees = [
    { id: 1, nombre: "Roberto Gómez", cargo: "Vendedor Senior", salario: 1200.00, inicio: "2023-01-15" },
    { id: 2, nombre: "Laura Martínez", cargo: "Contadora", salario: 1500.00, inicio: "2023-03-01" },
    { id: 3, nombre: "Pedro Sánchez", cargo: "Almacenero", salario: 950.00, inicio: "2023-06-10" },
  ];

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
        loading={false}
        onAdd={() => console.log("New Employee")}
        onEdit={(row) => console.log("Edit Employee", row)}
      />
    </div>
  );
}
