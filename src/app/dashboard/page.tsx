"use client";

import { useEffect, useState } from "react";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { WebAnalyticsWidget } from "@/components/dashboard/WebAnalyticsWidget";
import { AIChat } from "@/components/dashboard/AIChat";
import { ArrowDownRight, ArrowUpRight, DollarSign, Package, Users, Wallet, Loader2, Search, Bell, Menu } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    ingresos: 0,
    gastos: 0,
    utilidad: 0,
    clientes: 0,
  });
  const [transactions, setTransactions] = useState<any[]>([]);
  const [criticalStock, setCriticalStock] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        // 1. Fetch Metrics
        const { data: ingresosData } = await supabase.from('facturas').select('total');
        const { data: gastosData } = await supabase.from('gastos').select('monto');
        const { count: clientesCount } = await supabase.from('clientes').select('*', { count: 'exact', head: true });

        const totalIngresos = ingresosData?.reduce((acc, curr) => acc + (curr.total || 0), 0) || 0;
        const totalGastos = gastosData?.reduce((acc, curr) => acc + (curr.monto || 0), 0) || 0;

        setMetrics({
          ingresos: totalIngresos,
          gastos: totalGastos,
          utilidad: totalIngresos - totalGastos,
          clientes: clientesCount || 0,
        });

        // 2. Fetch Recent Transactions
        const { data: recentInvoices } = await supabase
          .from('facturas')
          .select('id, numero, fecha, total, estado, clientes(nombre)')
          .order('fecha', { ascending: false })
          .limit(5);

        const formattedInvoices = recentInvoices?.map((inv: any) => ({
          id: inv.id,
          name: inv.clientes?.nombre || 'Cliente Final',
          type: 'Venta',
          status: inv.estado,
          date: new Date(inv.fecha).toLocaleDateString(),
          amount: `+$${inv.total}`,
          isIncome: true
        })) || [];

        setTransactions(formattedInvoices);

        // 3. Fetch Critical Stock
        const { data: lowStock } = await supabase
          .from('productos')
          .select('nombre, stock_actual, stock_minimo')
          .lt('stock_actual', 10)
          .limit(5);

        setCriticalStock(lowStock || []);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0a0b1e]">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0b1e] text-white p-6 space-y-8">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            Panel de Control
          </h1>
          <p className="text-indigo-200/60 text-sm">Resumen general de tu negocio</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-indigo-400" />
            <input 
              type="text" 
              placeholder="Buscar..." 
              className="bg-[#11132b] border border-indigo-500/20 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-indigo-500/50 w-64 transition-all"
            />
          </div>
          <button className="p-2 rounded-full bg-[#11132b] border border-indigo-500/20 hover:bg-indigo-500/10 transition-colors relative">
            <Bell className="w-5 h-5 text-indigo-300" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border-2 border-white/10"></div>
        </div>
      </header>

      {/* Metrics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Ingresos Totales"
          value={`$${metrics.ingresos.toFixed(2)}`}
          trend="+12.5%" 
          trendUp={true}
          icon={DollarSign}
          color="secondary" // We might need to update SummaryCard to handle new color props or just rely on CSS
        />
        <SummaryCard
          title="Gastos Operativos"
          value={`$${metrics.gastos.toFixed(2)}`}
          trend="-2.4%"
          trendUp={false}
          icon={Wallet}
          color="destructive"
        />
        <SummaryCard
          title="Utilidad Neta"
          value={`$${metrics.utilidad.toFixed(2)}`}
          trend="+8.2%"
          trendUp={true}
          icon={ArrowUpRight}
          color="primary"
        />
        <SummaryCard
          title="Transacciones"
          value={transactions.length.toString()}
          trend="Mes actual"
          trendUp={true}
          icon={Package}
          color="primary"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Charts Section */}
        <div className="col-span-4 glass rounded-2xl p-6 border border-white/5">
          <h3 className="text-lg font-semibold mb-6 text-indigo-100">Tendencia de Ingresos</h3>
          <TrendChart />
        </div>

        {/* Side Widgets */}
        <div className="col-span-3 space-y-6">
          {/* Web Analytics */}
          <div className="h-[350px] glass rounded-2xl p-1 border border-white/5 overflow-hidden">
             <WebAnalyticsWidget />
          </div>
          
          {/* Critical Inventory */}
          <div className="glass rounded-2xl p-6 border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-indigo-100">Inventario Crítico</h3>
              <Package className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="space-y-3">
              {criticalStock.length === 0 ? (
                <p className="text-sm text-indigo-200/60">Todo el inventario está en orden.</p>
              ) : (
                criticalStock.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-[#0a0b1e]/50 rounded-xl border border-white/5">
                    <div>
                      <p className="font-medium text-indigo-100">{item.nombre}</p>
                      <p className="text-xs text-indigo-300/60">Mínimo: {item.stock_minimo}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-red-400 font-bold">{item.stock_actual} un.</p>
                      <p className="text-[10px] text-red-400/80 uppercase tracking-wider">Reponer</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <button className="w-full mt-4 text-sm text-indigo-400 hover:text-indigo-300 hover:underline transition-colors">
              Ver inventario completo
            </button>
          </div>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="glass rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <h3 className="text-lg font-semibold text-indigo-100">Últimas Transacciones</h3>
        </div>
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm text-left">
            <thead className="[&_tr]:border-b [&_tr]:border-white/5">
              <tr className="border-b border-white/5 transition-colors hover:bg-white/5">
                <th className="h-12 px-6 align-middle font-medium text-indigo-300/60">Cliente/Proveedor</th>
                <th className="h-12 px-6 align-middle font-medium text-indigo-300/60">Tipo</th>
                <th className="h-12 px-6 align-middle font-medium text-indigo-300/60">Estado</th>
                <th className="h-12 px-6 align-middle font-medium text-indigo-300/60">Fecha</th>
                <th className="h-12 px-6 text-right align-middle font-medium text-indigo-300/60">Monto</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-indigo-300/60">No hay transacciones recientes.</td>
                </tr>
              ) : (
                transactions.map((tx, i) => (
                  <tr key={i} className="border-b border-white/5 transition-colors hover:bg-white/5">
                    <td className="p-6 align-middle font-medium text-indigo-100">{tx.name}</td>
                    <td className="p-6 align-middle text-indigo-200">{tx.type}</td>
                    <td className="p-6 align-middle">
                      <span className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
                        tx.status === "pagada" || tx.status === "completada" 
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      )}>
                        {tx.status || 'Completado'}
                      </span>
                    </td>
                    <td className="p-6 align-middle text-indigo-300/60">{tx.date}</td>
                    <td className={cn("p-6 align-middle text-right font-bold", tx.isIncome ? "text-emerald-400" : "text-red-400")}>
                      {tx.amount}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Chat Widget */}
      <AIChat />
    </div>
  );
}
