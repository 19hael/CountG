import { ModuleHeader } from "@/components/ui/ModuleHeader";
import { Users, Plus } from "lucide-react";

export default function ClientesPage() {
  return (
    <div>
      <ModuleHeader 
        title="Clientes / CRM" 
        description="Gestión de base de datos de clientes."
        icon={Users}
        action={
          <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2">
            <Plus className="w-4 h-4" /> Nuevo Cliente
          </button>
        }
      />
      
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="text-center py-12 text-muted-foreground">
          <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p>Base de datos de clientes vacía.</p>
        </div>
      </div>
    </div>
  );
}
