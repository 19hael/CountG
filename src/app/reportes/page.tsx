import { ModuleHeader } from "@/components/ui/ModuleHeader";
import { BarChart3, Download } from "lucide-react";

export default function ReportesPage() {
  return (
    <div>
      <ModuleHeader 
        title="Reportes y Analytics" 
        description="Análisis financiero y operativo."
        icon={BarChart3}
        action={
          <button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2">
            <Download className="w-4 h-4" /> Exportar Todo
          </button>
        }
      />
      
      <div className="grid gap-6 md:grid-cols-2">
        {["Rentabilidad", "Ventas por Categoría", "Gastos por Mes", "Top Clientes"].map((report) => (
          <div key={report} className="bg-card border border-border rounded-xl p-6 h-64 flex items-center justify-center relative">
            <h3 className="absolute top-6 left-6 font-semibold">{report}</h3>
            <BarChart3 className="w-16 h-16 text-muted-foreground/20" />
          </div>
        ))}
      </div>
    </div>
  );
}
