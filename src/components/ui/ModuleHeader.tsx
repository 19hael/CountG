import { LucideIcon } from "lucide-react";

interface ModuleHeaderProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
}

export function ModuleHeader({ title, description, icon: Icon, action }: ModuleHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        {Icon && (
          <div className="p-3 bg-primary/10 rounded-xl text-primary">
            <Icon className="w-8 h-8" />
          </div>
        )}
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
