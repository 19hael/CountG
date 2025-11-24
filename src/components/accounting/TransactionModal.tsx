"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  type: "ingreso" | "gasto";
  transaction?: any;
}

export function TransactionModal({ isOpen, onClose, onSuccess, type, transaction }: TransactionModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    descripcion: "",
    monto: "",
    categoria: "General",
    fecha: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (transaction) {
      setFormData({
        descripcion: transaction.descripcion || "",
        monto: (transaction.monto || transaction.total || "").toString(),
        categoria: transaction.categoria || "General",
        fecha: transaction.fecha ? new Date(transaction.fecha).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      });
    } else {
      setFormData({
        descripcion: "",
        monto: "",
        categoria: "General",
        fecha: new Date().toISOString().split('T')[0],
      });
    }
  }, [transaction, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSave = {
        descripcion: formData.descripcion,
        monto: parseFloat(formData.monto) || 0,
        categoria: formData.categoria,
        fecha: formData.fecha,
      };

      if (type === "ingreso") {
        // Save to 'facturas' (simplified as income)
        const invoiceData = {
          ...dataToSave,
          total: dataToSave.monto,
          estado: 'pagada',
          numero: `INV-${Date.now()}` // Simple auto-gen
        };
        
        if (transaction) {
          const { error } = await supabase.from('facturas').update(invoiceData).eq('id', transaction.id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('facturas').insert([invoiceData]);
          if (error) throw error;
        }
      } else {
        // Save to 'gastos'
        if (transaction) {
          const { error } = await supabase.from('gastos').update(dataToSave).eq('id', transaction.id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('gastos').insert([dataToSave]);
          if (error) throw error;
        }
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving transaction:", error);
      alert("Error al guardar el registro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card border border-border w-full max-w-lg rounded-xl shadow-lg p-6 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">
            {transaction ? "Editar" : "Nuevo"} {type === "ingreso" ? "Ingreso" : "Gasto"}
          </h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Descripción</label>
            <input
              type="text"
              required
              value={formData.descripcion}
              onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
              className="w-full bg-muted border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder={type === "ingreso" ? "Venta de servicios" : "Compra de materiales"}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Monto</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.monto}
                onChange={(e) => setFormData({...formData, monto: e.target.value})}
                className="w-full bg-muted border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Fecha</label>
              <input
                type="date"
                required
                value={formData.fecha}
                onChange={(e) => setFormData({...formData, fecha: e.target.value})}
                className="w-full bg-muted border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Categoría</label>
            <select
              value={formData.categoria}
              onChange={(e) => setFormData({...formData, categoria: e.target.value})}
              className="w-full bg-muted border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="General">General</option>
              <option value="Ventas">Ventas</option>
              <option value="Servicios">Servicios</option>
              <option value="Operativo">Operativo</option>
              <option value="Nómina">Nómina</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {transaction ? "Guardar Cambios" : "Registrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
