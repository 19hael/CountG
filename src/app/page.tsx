"use client";

import { useEffect, useState } from "react";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { WebAnalyticsWidget } from "@/components/dashboard/WebAnalyticsWidget";
import { ArrowDownRight, ArrowUpRight, DollarSign, Package, Users, Wallet, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

export default function Home() {
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

        // 2. Fetch Recent Transactions (Mix of Invoices and Expenses)
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
          .lt('stock_actual', 10) // Assuming 10 is generic low, or use stock_minimo comparison logic if RLS allows complex queries
          .limit(5);

        // Client-side filter for strict stock_minimo if needed, but simple query for now
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
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium transition-colors">
            Descargar Reporte
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Ingresos Totales"
          value={`$${metrics.ingresos.toFixed(2)}`}
          trend="+0%" // Todo: Calculate real trend
          trendUp={true}
          icon={DollarSign}
          color="secondary"
        />
        <SummaryCard
          title="Gastos"
          value={`$${metrics.gastos.toFixed(2)}`}
          trend="+0%"
          trendUp={false}
          icon={Wallet}
          color="destructive"
        />
        <SummaryCard
          title="Utilidad Neta"
          value={`$${metrics.utilidad.toFixed(2)}`}
          trend="+0%"
          trendUp={true}
          icon={ArrowUpRight}
          color="primary"
        />
        <SummaryCard
          title="Clientes Activos"
          value={metrics.clientes.toString()}
          trend="+0"
          trendUp={true}
          icon={Users}
          color="primary"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <TrendChart />
        </div>
        <div className="col-span-3 space-y-4">
          {/* Web Analytics Widget */}
          <div className="h-[350px]">
             <WebAnalyticsWidget />
          </div>
          
          {/* Critical Inventory Widget */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Inventario Crítico</h3>
              <Package className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="space-y-4">
              {criticalStock.length === 0 ? (
                <p className="text-sm text-muted-foreground">Todo el inventario está en orden.</p>
              ) : (
                criticalStock.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                    <div>
                      <p className="font-medium">{item.nombre}</p>
                      <p className="text-xs text-muted-foreground">Min: {item.stock_minimo}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-destructive font-bold">{item.stock_actual} un.</p>
                      <p className="text-xs text-destructive">Reponer</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <button className="w-full mt-4 text-sm text-primary hover:underline">
              Ver todo el inventario
            </button>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold">Últimas Transacciones</h3>
        </div>
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Cliente/Proveedor</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Tipo</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Estado</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Fecha</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Monto</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-muted-foreground">No hay transacciones recientes.</td>
                </tr>
              ) : (
                transactions.map((tx, i) => (
                  <tr key={i} className="border-b border-border transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle font-medium">{tx.name}</td>
                    <td className="p-4 align-middle">{tx.type}</td>
                    <td className="p-4 align-middle">
                      <span className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                        tx.status === "pagada" || tx.status === "completada" ? "bg-secondary/10 text-secondary" : "bg-yellow-500/10 text-yellow-500"
                      )}>
                        {tx.status || 'Completado'}
                      </span>
                    </td>
                    <td className="p-4 align-middle text-muted-foreground">{tx.date}</td>
                    <td className={cn("p-4 align-middle text-right font-bold", tx.isIncome ? "text-secondary" : "text-destructive")}>
                      {tx.amount}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
