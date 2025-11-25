import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SummaryCardProps {
  title: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  icon: LucideIcon;
  color?: "primary" | "secondary" | "destructive" | "warning";
}

export function SummaryCard({ title, value, trend, trendUp, icon: Icon, color = "primary" }: SummaryCardProps) {
  const colorStyles = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    destructive: "bg-destructive/10 text-destructive",
    warning: "bg-orange-500/10 text-orange-500",
  };

  return (
    <div className="glass rounded-xl p-6 shadow-sm border border-white/5 hover:border-indigo-500/30 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-2">{value}</h3>
        </div>
        <div className={cn("p-3 rounded-lg", colorStyles[color])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center text-xs">
          <span className={cn("font-medium", trendUp ? "text-secondary" : "text-destructive")}>
            {trend}
          </span>
          <span className="text-muted-foreground ml-1">vs mes anterior</span>
        </div>
      )}
    </div>
  );
}
