"use client";

import { POSInterface } from "@/components/pos/POSInterface";
import { ModuleHeader } from "@/components/ui/ModuleHeader";
import { ShoppingBag } from "lucide-react";

export default function POSPage() {
  return (
    <div className="h-full flex flex-col">
      <ModuleHeader 
        title="Punto de Venta" 
        description="Facturación rápida y control de caja."
        icon={ShoppingBag}
      />
      
      <div className="flex-1 mt-4">
        <POSInterface />
      </div>
    </div>
  );
}
