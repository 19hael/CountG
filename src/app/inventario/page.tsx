import { ModuleHeader } from "@/components/ui/ModuleHeader";
import { Package, Plus } from "lucide-react";

export default function InventarioPage() {
  return (
    <div>
      <ModuleHeader 
        title="Inventario" 
        description="Control de stock y productos."
        icon={Package}
        action={
          <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2">
            <Plus className="w-4 h-4" /> Nuevo Producto
          </button>
        }
      />
      
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <input 
            type="text" 
            placeholder="Buscar producto por nombre o código..." 
            className="flex-1 bg-background border border-input rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          />
          <select className="bg-background border border-input rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option>Todas las categorías</option>
            <option>Ropa</option>
            <option>Electrónica</option>
          </select>
        </div>
        
        <div className="text-center py-12 text-muted-foreground">
          <Package className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p>No hay productos registrados aún.</p>
        </div>
      </div>
    </div>
  );
}
