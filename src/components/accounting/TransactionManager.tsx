"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { CSVExportButton } from "./CSVExportButton";
import { Loader2, Plus, ArrowUpRight, ArrowDownRight } from "lucide-react";

export function TransactionManager() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');

  useEffect(() => {
    async function fetchTransactions() {
      try {
        // Fetch Invoices (Income)
        const { data: invoices } = await supabase
          .from('facturas')
          .select('id, numero, fecha, total, estado, descripcion')
          .order('fecha', { ascending: false });

        // Fetch Expenses
        const { data: expenses } = await supabase
          .from('gastos')
          .select('id, descripcion, fecha, monto, categoria')
          .order('fecha', { ascending: false });

        // Normalize data
        const incomeTx = invoices?.map((inv: any) => ({
          id: inv.id,
          date: new Date(inv.fecha).toLocaleDateString(),
          description: `Factura #${inv.numero} - ${inv.descripcion || ''}`,
          amount: inv.total,
          type: 'income',
          status: inv.estado,
          category: 'Ventas'
        })) || [];

        const expenseTx = expenses?.map((exp: any) => ({
          id: exp.id,
          date: new Date(exp.fecha).toLocaleDateString(),
          description: exp.descripcion,
          amount: exp.monto,
          type: 'expense',
          status: 'pagado', // Expenses are usually immediate, or add status field to table
          category: exp.categoria || 'General'
        })) || [];

        // Merge and sort
        const allTx = [...incomeTx, ...expenseTx].sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setTransactions(allTx);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, []);

  const filteredTx = transactions.filter(tx => {
    if (filter === 'all') return true;
    return tx.type === filter;
  });

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-indigo-500" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button 
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-indigo-200 hover:bg-white/10'}`}
          >
            Todos
          </button>
          <button 
            onClick={() => setFilter('income')}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${filter === 'income' ? 'bg-emerald-600 text-white' : 'bg-white/5 text-indigo-200 hover:bg-white/10'}`}
          >
            Ingresos
          </button>
          <button 
            onClick={() => setFilter('expense')}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${filter === 'expense' ? 'bg-red-600 text-white' : 'bg-white/5 text-indigo-200 hover:bg-white/10'}`}
          >
            Gastos
          </button>
        </div>
        <div className="flex gap-2">
          <CSVExportButton data={filteredTx} filename="transacciones.csv" />
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" /> Nueva Transacción
          </button>
        </div>
      </div>

      <div className="glass rounded-xl border border-white/5 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-white/5 text-indigo-200">
            <tr>
              <th className="px-6 py-3 font-medium">Fecha</th>
              <th className="px-6 py-3 font-medium">Descripción</th>
              <th className="px-6 py-3 font-medium">Categoría</th>
              <th className="px-6 py-3 font-medium">Estado</th>
              <th className="px-6 py-3 font-medium text-right">Monto</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredTx.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-indigo-200/50">
                  No hay transacciones registradas.
                </td>
              </tr>
            ) : (
              filteredTx.map((tx, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 text-indigo-100">{tx.date}</td>
                  <td className="px-6 py-4 text-indigo-100 font-medium">
                    <div className="flex items-center gap-2">
                      {tx.type === 'income' ? (
                        <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-400" />
                      )}
                      {tx.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-indigo-200/70">{tx.category}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      tx.status === 'pagada' || tx.status === 'pagado' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-right font-mono font-bold ${
                    tx.type === 'income' ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {tx.type === 'income' ? '+' : '-'}${Number(tx.amount).toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
