import { ModuleHeader } from "@/components/ui/ModuleHeader";
import { Settings, UserPlus } from "lucide-react";

export default function AdminPage() {
  return (
    <div>
      <ModuleHeader 
        title="Administración" 
        description="Gestión de usuarios y configuración."
        icon={Settings}
        action={
          <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2">
            <UserPlus className="w-4 h-4" /> Invitar Usuario
          </button>
        }
      />
      
      <div className="space-y-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Usuarios del Sistema</h3>
          <div className="space-y-4">
            {[
              { name: "Usuario Admin", email: "admin@empresa.com", role: "Administrador" },
              { name: "Juan Vendedor", email: "juan@empresa.com", role: "Vendedor" },
            ].map((user, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-accent/50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <span className="text-sm bg-background border border-border px-3 py-1 rounded-full">
                  {user.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
