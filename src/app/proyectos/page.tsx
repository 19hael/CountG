"use client";

import { ProjectBoard } from "@/components/projects/ProjectBoard";
import { ModuleHeader } from "@/components/ui/ModuleHeader";
import { FolderKanban } from "lucide-react";

export default function ProyectosPage() {
  return (
    <div className="space-y-6">
      <ModuleHeader 
        title="Gestión de Proyectos" 
        description="Control de tareas, tiempos y entregables por cliente."
        icon={FolderKanban}
      />
      
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <ProjectBoard />
      </div>
    </div>
  );
}
