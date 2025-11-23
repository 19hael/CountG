import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { ArrowDownRight, ArrowUpRight, DollarSign, Package, Users, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="space-y-6">
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
          value="$45,231.89"
          trend="+20.1%"
          trendUp={true}
          icon={DollarSign}
          color="secondary"
        />
        <SummaryCard
          title="Gastos"
          value="$12,234.00"
          trend="+4.5%"
          trendUp={false}
          icon={Wallet}
          color="destructive"
        />
        <SummaryCard
          title="Utilidad Neta"
          value="$32,997.89"
          trend="+12.2%"
          trendUp={true}
          icon={ArrowUpRight}
          color="primary"
        />
        <SummaryCard
          title="Clientes Activos"
          value="+573"
          trend="+201"
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
          {/* Critical Inventory Widget */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Inventario Crítico</h3>
              <Package className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="space-y-4">
              {[
                { name: "Camiseta Roja M", stock: 12, min: 20 },
                { name: "Pantalón Jeans 32", stock: 5, min: 15 },
                { name: "Zapatillas Nike 42", stock: 2, min: 10 },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Min: {item.min}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-destructive font-bold">{item.stock} un.</p>
                    <p className="text-xs text-destructive">Reponer</p>
                  </div>
                </div>
              ))}
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
              {[
                { name: "Juan Pérez", type: "Venta", status: "Completado", date: "2025-11-23", amount: "+$250.00" },
                { name: "Proveedor ABC", type: "Gasto", status: "Pagado", date: "2025-11-22", amount: "-$1,200.00" },
                { name: "Maria Lopez", type: "Venta", status: "Pendiente", date: "2025-11-22", amount: "+$85.00" },
                { name: "Servicios Luz", type: "Gasto", status: "Pagado", date: "2025-11-21", amount: "-$120.00" },
              ].map((tx, i) => (
                <tr key={i} className="border-b border-border transition-colors hover:bg-muted/50">
                  <td className="p-4 align-middle font-medium">{tx.name}</td>
                  <td className="p-4 align-middle">{tx.type}</td>
                  <td className="p-4 align-middle">
                    <span className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                      tx.status === "Completado" || tx.status === "Pagado" ? "bg-secondary/10 text-secondary" : "bg-yellow-500/10 text-yellow-500"
                    )}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="p-4 align-middle text-muted-foreground">{tx.date}</td>
                  <td className={cn("p-4 align-middle text-right font-bold", tx.amount.startsWith("+") ? "text-secondary" : "text-destructive")}>
                    {tx.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
