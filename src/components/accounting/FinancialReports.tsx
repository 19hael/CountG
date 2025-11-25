"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { CSVExportButton } from "./CSVExportButton";

export function FinancialReports() {
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<any>(null);

  useEffect(() => {
    async function fetchFinancials() {
      try {
        // Fetch Income (Facturas)
        const { data: income } = await supabase
          .from('facturas')
          .select('total, fecha')
          .eq('estado', 'pagada'); // Only realized income

        // Fetch Expenses (Gastos)
        const { data: expenses } = await supabase
          .from('gastos')
          .select('monto, fecha');

        const totalIncome = income?.reduce((acc, curr) => acc + (curr.total || 0), 0) || 0;
        const totalExpenses = expenses?.reduce((acc, curr) => acc + (curr.monto || 0), 0) || 0;
        const netProfit = totalIncome - totalExpenses;
        const taxEstimate = netProfit > 0 ? netProfit * 0.19 : 0; // Example 19% tax

        setReportData({
          income: totalIncome,
          expenses: totalExpenses,
          netProfit,
          taxEstimate,
          details: [
            { Concepto: "Ingresos Totales", Monto: totalIncome },
            { Concepto: "Gastos Operativos", Monto: totalExpenses },
            { Concepto: "Utilidad Bruta", Monto: netProfit },
            { Concepto: "Impuestos Estimados (19%)", Monto: taxEstimate },
            { Concepto: "Utilidad Neta", Monto: netProfit - taxEstimate },
          ]
        });

      } catch (error) {
        console.error("Error fetching financials:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchFinancials();
  }, []);

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-indigo-500" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Reporte Financiero</h3>
        <CSVExportButton data={reportData?.details || []} filename="reporte_financiero.csv" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="glass p-6 rounded-xl border border-white/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-indigo-200/70 text-sm">Ingresos</span>
          </div>
          <p className="text-2xl font-bold text-white">${reportData.income.toFixed(2)}</p>
        </div>

        <div className="glass p-6 rounded-xl border border-white/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-500/10 rounded-lg text-red-400">
              <TrendingDown className="w-5 h-5" />
            </div>
            <span className="text-indigo-200/70 text-sm">Gastos</span>
          </div>
          <p className="text-2xl font-bold text-white">${reportData.expenses.toFixed(2)}</p>
        </div>

        <div className="glass p-6 rounded-xl border border-white/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-indigo-200/70 text-sm">Utilidad Neta</span>
          </div>
          <p className="text-2xl font-bold text-white">${reportData.netProfit.toFixed(2)}</p>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="glass rounded-xl border border-white/5 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-white/5 text-indigo-200">
            <tr>
              <th className="px-6 py-3 font-medium">Concepto</th>
              <th className="px-6 py-3 font-medium text-right">Monto</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {reportData.details.map((row: any, i: number) => (
              <tr key={i} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 text-white">{row.Concepto}</td>
                <td className={`px-6 py-4 text-right font-mono ${row.Monto < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                  ${row.Monto.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
