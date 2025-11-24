"use client";

import { useState, useEffect } from "react";
import { ModuleHeader } from "@/components/ui/ModuleHeader";
import { SmartTable } from "@/components/ui/SmartTable";
import { TransactionModal } from "@/components/accounting/TransactionModal";
import { Calculator, Plus, ArrowUpCircle, ArrowDownCircle, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

export default function ContabilidadPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"ingreso" | "gasto">("ingreso");
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"todos" | "ingresos" | "gastos">("todos");
  const [summary, setSummary] = useState({ ingresos: 0, gastos: 0, balance: 0 });

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

    // Calculate Summary
    const totalIngresos = formattedIncomes.reduce((acc, curr) => acc + (curr.monto || 0), 0);
    const totalGastos = formattedExpenses.reduce((acc, curr) => acc + (curr.monto || 0), 0);

    setSummary({
      ingresos: totalIngresos,
      gastos: totalGastos,
      balance: totalIngresos - totalGastos
    });

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

  // Prepare chart data (simplified for last 7 transactions for demo, ideally grouped by date)
  const chartData = transactions.slice(0, 10).reverse().map(t => ({
    name: new Date(t.fecha).toLocaleDateString(undefined, { day: '2-digit', month: '2-digit' }),
    monto: t.type === 'ingreso' ? t.monto : -t.monto
  }));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <ModuleHeader 
        title="Contabilidad" 
        description="Gestión financiera integral."
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
              <Plus className="w-4 h-4" /> Gasto
            </button>
            <button 
              onClick={() => {
                setEditingTransaction(null);
                setModalType("ingreso");
                setIsModalOpen(true);
              }}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Ingreso
            </button>
          </div>
        }
      />
      
      {/* Financial Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Ingresos Totales</h3>
            <div className="p-2 bg-secondary/10 rounded-full">
              <TrendingUp className="w-4 h-4 text-secondary" />
            </div>
          </div>
          <p className="text-2xl font-bold text-secondary">+${summary.ingresos.toFixed(2)}</p>
        </div>
        
        <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Gastos Totales</h3>
            <div className="p-2 bg-destructive/10 rounded-full">
              <TrendingDown className="w-4 h-4 text-destructive" />
            </div>
          </div>
          <p className="text-2xl font-bold text-destructive">-${summary.gastos.toFixed(2)}</p>
        </div>

        <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Balance Neto</h3>
            <div className="p-2 bg-primary/10 rounded-full">
              <DollarSign className="w-4 h-4 text-primary" />
            </div>
          </div>
          <p className={cn("text-2xl font-bold", summary.balance >= 0 ? "text-foreground" : "text-destructive")}>
            ${summary.balance.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-card border border-border p-6 rounded-xl shadow-sm h-[300px]">
        <h3 className="text-lg font-semibold mb-4">Flujo de Caja (Últimos Movimientos)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorMonto" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
              itemStyle={{ color: 'var(--foreground)' }}
            />
            <Area type="monotone" dataKey="monto" stroke="var(--primary)" fillOpacity={1} fill="url(#colorMonto)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

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
