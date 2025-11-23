import { ModuleHeader } from "@/components/ui/ModuleHeader";
import { Calculator, Plus } from "lucide-react";

export default function ContabilidadPage() {
  return (
    <div>
      <ModuleHeader 
        title="Contabilidad" 
        description="Gestión de ingresos, gastos y facturación."
        icon={Calculator}
        action={
          <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2">
            <Plus className="w-4 h-4" /> Nuevo Registro
          </button>
        }
      />
      
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        {/* Sub-modules placeholders */}
        {["Ingresos", "Gastos", "Facturas"].map((item) => (
          <div key={item} className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors cursor-pointer group">
            <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">{item}</h3>
            <p className="text-sm text-muted-foreground mt-2">Gestionar {item.toLowerCase()}</p>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-12 text-center">
        <p className="text-muted-foreground">Selecciona una opción para comenzar a trabajar.</p>
      </div>
    </div>
  );
}
