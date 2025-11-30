"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, 
  Users, Package, Calendar, PieChart, BarChart3, 
  ArrowUpRight, ArrowDownRight, Wallet, CreditCard
} from "lucide-react";

interface FinancialData {
  totalIncome: number;
  totalExpenses: number;
  profit: number;
  profitMargin: number;
  invoicesPaid: number;
  invoicesPending: number;
  totalSales: number;
  totalPurchases: number;
  cashFlow: number;
  monthlyData: Array<{
    month: string;
    income: number;
    expenses: number;
  }>;
}

export default function AccountingPage() {
  const [data, setData] = useState<FinancialData>({
    totalIncome: 0,
    totalExpenses: 0,
    profit: 0,
    profitMargin: 0,
    invoicesPaid: 0,
    invoicesPending: 0,
    totalSales: 0,
    totalPurchases: 0,
    cashFlow: 0,
    monthlyData: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'quarter' | 'year'>('month');

  useEffect(() => {
    fetchFinancialData();
  }, [selectedPeriod]);

  const fetchFinancialData = async () => {
    try {
      // Fetch invoices
      const { data: invoices } = await supabase
        .from('facturas')
        .select('total, estado, fecha');

      // Fetch purchase orders
      const { data: orders } = await supabase
        .from('ordenes_compra')
        .select('total, estado, fecha');

      // Calculate totals
      const paidInvoices = invoices?.filter(i => i.estado === 'Pagada') || [];
      const pendingInvoices = invoices?.filter(i => i.estado === 'Pendiente') || [];
      
      const totalIncome = paidInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
      const totalPending = pendingInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
      const totalExpenses = orders?.reduce((sum, ord) => sum + (ord.total || 0), 0) || 0;
      
      const profit = totalIncome - totalExpenses;
      const profitMargin = totalIncome > 0 ? (profit / totalIncome) * 100 : 0;

      // Monthly data for chart
      const monthlyData = calculateMonthlyData(invoices || [], orders || []);

      setData({
        totalIncome,
        totalExpenses,
        profit,
        profitMargin,
        invoicesPaid: paidInvoices.length,
        invoicesPending: pendingInvoices.length,
        totalSales: totalIncome,
        totalPurchases: totalExpenses,
        cashFlow: totalIncome - totalExpenses,
        monthlyData
      });
    } catch (error) {
      console.error('Error fetching financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateMonthlyData = (invoices: any[], orders: any[]) => {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const currentMonth = new Date().getMonth();
    const last6Months = [];

    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const monthName = months[monthIndex];
      
      const monthIncome = invoices
        .filter(inv => {
          const invMonth = new Date(inv.fecha).getMonth();
          return invMonth === monthIndex && inv.estado === 'Pagada';
        })
        .reduce((sum, inv) => sum + (inv.total || 0), 0);

      const monthExpenses = orders
        .filter(ord => {
          const ordMonth = new Date(ord.fecha).getMonth();
          return ordMonth === monthIndex;
        })
        .reduce((sum, ord) => sum + (ord.total || 0), 0);

      last6Months.push({
        month: monthName,
        income: monthIncome,
        expenses: monthExpenses
      });
    }

    return last6Months;
  };

  if (loading) {
    return <div className="text-center text-indigo-200/60 py-12">Cargando datos financieros...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Contabilidad</h1>
          <p className="text-indigo-200/60">Vista completa de la salud financiera de tu negocio</p>
        </div>
        <div className="flex gap-2">
          {(['month', 'quarter', 'year'] as const).map(period => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedPeriod === period
                  ? 'bg-indigo-500 text-white'
                  : 'bg-white/5 text-indigo-200/60 hover:bg-white/10'
              }`}
            >
              {period === 'month' ? 'Mes' : period === 'quarter' ? 'Trimestre' : 'Año'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Financial Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Income */}
        <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
            </div>
            <span className="text-xs font-medium px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400">
              +{data.profitMargin.toFixed(1)}%
            </span>
          </div>
          <h3 className="text-sm font-medium text-emerald-200/60 mb-1">Ingresos Totales</h3>
          <p className="text-3xl font-bold text-white">${data.totalIncome.toFixed(2)}</p>
          <p className="text-xs text-emerald-200/40 mt-2">{data.invoicesPaid} facturas pagadas</p>
        </div>

        {/* Total Expenses */}
        <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-500/10 rounded-xl">
              <TrendingDown className="w-6 h-6 text-red-400" />
            </div>
            <span className="text-xs font-medium px-2 py-1 rounded-md bg-red-500/10 text-red-400">
              Gastos
            </span>
          </div>
          <h3 className="text-sm font-medium text-red-200/60 mb-1">Gastos Totales</h3>
          <p className="text-3xl font-bold text-white">${data.totalExpenses.toFixed(2)}</p>
          <p className="text-xs text-red-200/40 mt-2">Compras y operaciones</p>
        </div>

        {/* Profit */}
        <div className={`bg-gradient-to-br ${data.profit >= 0 ? 'from-indigo-500/10 to-indigo-600/5 border-indigo-500/20' : 'from-amber-500/10 to-amber-600/5 border-amber-500/20'} border rounded-2xl p-6`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 ${data.profit >= 0 ? 'bg-indigo-500/10' : 'bg-amber-500/10'} rounded-xl`}>
              <DollarSign className={`w-6 h-6 ${data.profit >= 0 ? 'text-indigo-400' : 'text-amber-400'}`} />
            </div>
            {data.profit >= 0 ? (
              <ArrowUpRight className="w-5 h-5 text-emerald-400" />
            ) : (
              <ArrowDownRight className="w-5 h-5 text-red-400" />
            )}
          </div>
          <h3 className={`text-sm font-medium ${data.profit >= 0 ? 'text-indigo-200/60' : 'text-amber-200/60'} mb-1`}>
            {data.profit >= 0 ? 'Ganancia Neta' : 'Pérdida Neta'}
          </h3>
          <p className="text-3xl font-bold text-white">${Math.abs(data.profit).toFixed(2)}</p>
          <p className={`text-xs ${data.profit >= 0 ? 'text-indigo-200/40' : 'text-amber-200/40'} mt-2`}>
            Margen: {data.profitMargin.toFixed(1)}%
          </p>
        </div>

        {/* Cash Flow */}
        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/10 rounded-xl">
              <Wallet className="w-6 h-6 text-purple-400" />
            </div>
            <CreditCard className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="text-sm font-medium text-purple-200/60 mb-1">Flujo de Caja</h3>
          <p className="text-3xl font-bold text-white">${data.cashFlow.toFixed(2)}</p>
          <p className="text-xs text-purple-200/40 mt-2">{data.invoicesPending} facturas pendientes</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-400" />
              Tendencia Mensual
            </h3>
          </div>
          <div className="space-y-4">
            {data.monthlyData.map((month, idx) => {
              const maxValue = Math.max(...data.monthlyData.map(m => Math.max(m.income, m.expenses)));
              const incomeWidth = (month.income / maxValue) * 100;
              const expensesWidth = (month.expenses / maxValue) * 100;

              return (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-indigo-200/60">{month.month}</span>
                    <span className="text-white font-medium">${(month.income - month.expenses).toFixed(0)}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${incomeWidth}%` }}
                      />
                    </div>
                    <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-red-500 rounded-full transition-all duration-500"
                        style={{ width: `${expensesWidth}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex gap-4 mt-6 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-xs text-indigo-200/60">Ingresos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-xs text-indigo-200/60">Gastos</span>
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <PieChart className="w-5 h-5 text-indigo-400" />
              Resumen Financiero
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-black/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <ShoppingCart className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Ventas Totales</p>
                  <p className="text-xs text-indigo-200/40">Facturas pagadas</p>
                </div>
              </div>
              <p className="text-lg font-bold text-emerald-400">${data.totalSales.toFixed(2)}</p>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-black/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <Package className="w-4 h-4 text-red-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Compras Totales</p>
                  <p className="text-xs text-indigo-200/40">Órdenes de compra</p>
                </div>
              </div>
              <p className="text-lg font-bold text-red-400">${data.totalPurchases.toFixed(2)}</p>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-black/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/10 rounded-lg">
                  <Calendar className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Facturas Pendientes</p>
                  <p className="text-xs text-indigo-200/40">Por cobrar</p>
                </div>
              </div>
              <p className="text-lg font-bold text-amber-400">{data.invoicesPending}</p>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/20 rounded-lg">
                  <DollarSign className="w-4 h-4 text-indigo-300" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Balance Final</p>
                  <p className="text-xs text-indigo-200/40">Ingresos - Gastos</p>
                </div>
              </div>
              <p className={`text-xl font-bold ${data.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                ${Math.abs(data.profit).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-500/30 transition-all group">
            <div className="p-3 bg-indigo-500/10 rounded-xl group-hover:bg-indigo-500/20 transition-colors">
              <DollarSign className="w-6 h-6 text-indigo-400" />
            </div>
            <span className="text-sm font-medium text-white">Nueva Transacción</span>
          </button>
          <button className="flex flex-col items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-500/30 transition-all group">
            <div className="p-3 bg-emerald-500/10 rounded-xl group-hover:bg-emerald-500/20 transition-colors">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
            </div>
            <span className="text-sm font-medium text-white">Ver Ingresos</span>
          </button>
          <button className="flex flex-col items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-500/30 transition-all group">
            <div className="p-3 bg-red-500/10 rounded-xl group-hover:bg-red-500/20 transition-colors">
              <TrendingDown className="w-6 h-6 text-red-400" />
            </div>
            <span className="text-sm font-medium text-white">Ver Gastos</span>
          </button>
          <button className="flex flex-col items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-500/30 transition-all group">
            <div className="p-3 bg-purple-500/10 rounded-xl group-hover:bg-purple-500/20 transition-colors">
              <BarChart3 className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-sm font-medium text-white">Exportar Reporte</span>
          </button>
        </div>
      </div>
    </div>
  );
}
