"use client";

import { useState } from "react";
import { FinancialReports } from "@/components/accounting/FinancialReports";
import { TransactionManager } from "@/components/accounting/TransactionManager";
import { Calculator, FileText, PieChart } from "lucide-react";

export default function AccountingPage() {
  const [activeTab, setActiveTab] = useState<'reports' | 'transactions' | 'taxes'>('reports');

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Contabilidad</h1>
          <p className="text-indigo-200/60">Gestión financiera integral</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-white/10">
        <button
          onClick={() => setActiveTab('reports')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'reports' 
              ? 'border-indigo-500 text-indigo-400' 
              : 'border-transparent text-indigo-200/60 hover:text-indigo-200'
          }`}
        >
          <PieChart className="w-4 h-4" />
          Reportes Financieros
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'transactions' 
              ? 'border-indigo-500 text-indigo-400' 
              : 'border-transparent text-indigo-200/60 hover:text-indigo-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          Transacciones
        </button>
        <button
          onClick={() => setActiveTab('taxes')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'taxes' 
              ? 'border-indigo-500 text-indigo-400' 
              : 'border-transparent text-indigo-200/60 hover:text-indigo-200'
          }`}
        >
          <Calculator className="w-4 h-4" />
          Impuestos
        </button>
      </div>

      {/* Content */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeTab === 'reports' && <FinancialReports />}
        {activeTab === 'transactions' && <TransactionManager />}
        {activeTab === 'taxes' && (
          <div className="glass p-8 rounded-xl border border-white/5 text-center">
            <Calculator className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Cálculo de Impuestos</h3>
            <p className="text-indigo-200/60 max-w-md mx-auto">
              El módulo de cálculo automático de impuestos (IVA, Retenciones) está en desarrollo.
              Próximamente podrá configurar las tasas impositivas y generar declaraciones automáticas.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
