"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Calculator, 
  Package, 
  Users, 
  Calendar, 
  BarChart3, 
  Settings, 
  MessageSquare 
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Contabilidad", href: "/contabilidad", icon: Calculator },
  { name: "Inventario", href: "/inventario", icon: Package },
  { name: "Clientes", href: "/clientes", icon: Users },
  { name: "Citas", href: "/agenda", icon: Calendar },
  { name: "Reportes", href: "/reportes", icon: BarChart3 },
  { name: "Chatbot", href: "/chatbot", icon: MessageSquare },
  { name: "Configuración", href: "/admin", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-card border-r border-border h-screen fixed left-0 top-0 flex flex-col z-10">
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold text-primary tracking-tight">Vixai</h1>
        <p className="text-xs text-muted-foreground">Gestión Inteligente</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
            UA
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">Usuario Admin</p>
            <p className="text-xs text-muted-foreground truncate">admin@empresa.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
