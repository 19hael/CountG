import { ModuleHeader } from "@/components/ui/ModuleHeader";
import { Calendar, Plus } from "lucide-react";

export default function AgendaPage() {
  return (
    <div>
      <ModuleHeader 
        title="Agenda de Citas" 
        description="Calendario y reservas."
        icon={Calendar}
        action={
          <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2">
            <Plus className="w-4 h-4" /> Nueva Cita
          </button>
        }
      />
      
      <div className="bg-card border border-border rounded-xl p-6 h-[600px] flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <Calendar className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p>Vista de calendario próximamente.</p>
        </div>
      </div>
    </div>
  );
}
