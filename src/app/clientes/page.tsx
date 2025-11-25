"use client";

import { ClientManager } from "@/components/crm/ClientManager";
import { Users } from "lucide-react";

export default function ClientesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
          <Users className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Clientes</h1>
          <p className="text-indigo-200/60">Gestión de relaciones y facturación</p>
        </div>
      </div>

      <ClientManager />
    </div>
  );
}
