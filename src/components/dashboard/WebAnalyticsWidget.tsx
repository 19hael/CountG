"use client";

import { useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Globe, ArrowUpRight, Link as LinkIcon, ExternalLink } from "lucide-react";

const data = [
  { name: "Lun", visits: 120 },
  { name: "Mar", visits: 180 },
  { name: "Mie", visits: 150 },
  { name: "Jue", visits: 250 },
  { name: "Vie", visits: 310 },
  { name: "Sab", visits: 280 },
  { name: "Dom", visits: 190 },
];

export function WebAnalyticsWidget() {
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [isLinked, setIsLinked] = useState(false);

  const handleLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (websiteUrl) {
      setIsLinked(true);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Globe className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Estadísticas Web</h3>
            <p className="text-xs text-muted-foreground">Tráfico de tu sitio web</p>
          </div>
        </div>
        {isLinked && (
          <div className="flex items-center gap-1 text-xs text-secondary bg-secondary/10 px-2 py-1 rounded-full">
            <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            En vivo
          </div>
        )}
      </div>

      {!isLinked ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 py-8">
          <div className="p-4 bg-muted rounded-full">
            <LinkIcon className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <h4 className="font-medium">Vincula tu sitio web</h4>
            <p className="text-sm text-muted-foreground max-w-[200px] mx-auto mt-1">
              Ingresa la URL de tu página para ver las estadísticas.
            </p>
          </div>
          <form onSubmit={handleLink} className="flex w-full max-w-xs gap-2">
            <input
              type="url"
              placeholder="https://tu-negocio.com"
              required
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className="flex-1 bg-muted border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button 
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground">Visitas Hoy</p>
              <p className="text-2xl font-bold">1,234</p>
              <p className="text-xs text-secondary flex items-center gap-1">
                +12% <ArrowUpRight className="w-3 h-3" />
              </p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground">Tiempo Promedio</p>
              <p className="text-2xl font-bold">2m 45s</p>
              <p className="text-xs text-muted-foreground">Estable</p>
            </div>
          </div>

          <div className="flex-1 min-h-[150px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="name" 
                  stroke="#888888" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--foreground)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="visits" 
                  stroke="var(--primary)" 
                  fillOpacity={1} 
                  fill="url(#colorVisits)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex justify-between items-center pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground truncate max-w-[150px]">{websiteUrl}</p>
            <a 
              href={websiteUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              Ver sitio <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
