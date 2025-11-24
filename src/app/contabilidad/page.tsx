"use client";

import { useState, useEffect } from "react";
import { ModuleHeader } from "@/components/ui/ModuleHeader";
import { SmartTable } from "@/components/ui/SmartTable";
import { TransactionModal } from "@/components/accounting/TransactionModal";
import { Calculator, Plus, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

export default function ContabilidadPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"ingreso" | "gasto">("ingreso");
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"todos" | "ingresos" | "gastos">("todos");

  const fetchTransactions = async () => {
    setLoading(true);
    
    // Fetch Incomes (Facturas)
    const { data: incomes } = await supabase
      .from('facturas')
      .select('*')
      .order('fecha', { ascending: false });

    // Fetch Expenses (Gastos)
    const { data: expenses } = await supabase
      .from('gastos')
      .select('*')
      .order('fecha', { ascending: false });

    // Combine and Sort
    const formattedIncomes = incomes?.map(i => ({ ...i, type: 'ingreso', monto: i.total })) || [];
    const formattedExpenses = expenses?.map(e => ({ ...e, type: 'gasto' })) || [];
    
    const combined = [...formattedIncomes, ...formattedExpenses].sort((a, b) => 
      new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
    );

    setTransactions(combined);
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleDelete = async (row: any) => {
    if (confirm('¿Estás seguro de eliminar este registro?')) {
      const table = row.type === 'ingreso' ? 'facturas' : 'gastos';
      const { error } = await supabase.from(table).delete().eq('id', row.id);
      if (!error) fetchTransactions();
    }
  };

  const filteredData = activeTab === "todos" 
    ? transactions 
    : transactions.filter(t => t.type === (activeTab === "ingresos" ? "ingreso" : "gasto"));

  const columns = [
    { 
      key: "fecha", 
      label: "Fecha",
      render: (val: string) => new Date(val).toLocaleDateString()
    },
    { key: "descripcion", label: "Descripción" },
    { key: "categoria", label: "Categoría" },
    { 
      key: "type", 
      label: "Tipo",
      render: (val: string) => (
        <span className={cn(
          "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
          val === "ingreso" ? "bg-secondary/10 text-secondary" : "bg-destructive/10 text-destructive"
        )}>
          {val === "ingreso" ? <ArrowUpCircle className="w-3 h-3" /> : <ArrowDownCircle className="w-3 h-3" />}
          {val === "ingreso" ? "Ingreso" : "Gasto"}
        </span>
      )
    },
    { 
      key: "monto", 
      label: "Monto",
      render: (val: number, row: any) => (
        <span className={cn("font-bold", row.type === "ingreso" ? "text-secondary" : "text-destructive")}>
          {row.type === "ingreso" ? "+" : "-"}${val.toFixed(2)}
        </span>
      )
    },
  ];

  return (
    <div>
      <ModuleHeader 
        title="Contabilidad" 
        description="Gestión de ingresos, gastos y facturación."
        icon={Calculator}
        action={
          <div className="flex gap-2">
            <button 
              onClick={() => {
                setEditingTransaction(null);
                setModalType("gasto");
                setIsModalOpen(true);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Registrar Gasto
            </button>
            <button 
              onClick={() => {
                setEditingTransaction(null);
                setModalType("ingreso");
                setIsModalOpen(true);
              }}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Registrar Ingreso
            </button>
          </div>
        }
      />
      
      <div className="flex gap-4 mb-6">
        {["todos", "ingresos", "gastos"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors",
              activeTab === tab 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <SmartTable
        title="Movimientos Recientes"
        data={filteredData}
        columns={columns}
        loading={loading}
        onEdit={(row) => {
          setEditingTransaction(row);
          setModalType(row.type);
          setIsModalOpen(true);
        }}
        onDelete={handleDelete}
      />

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchTransactions}
        type={modalType}
        transaction={editingTransaction}
      />
    </div>
  );
}
