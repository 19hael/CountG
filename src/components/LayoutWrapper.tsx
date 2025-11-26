"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { AIAssistant } from "@/components/ai/AIAssistant";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const safePath = pathname ?? "";
  const isPublicPage = ["/login", "/register", "/"].includes(safePath);

  if (isPublicPage) {
    return (
      <main className="min-h-screen bg-background">
        {children}
      </main>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col pl-64">
        <Header />
        <main className="pt-16 min-h-screen">
          <div className="p-6 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
        <AIAssistant />
      </div>
    </div>
  );
}
