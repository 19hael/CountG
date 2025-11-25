"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, X, Check } from "lucide-react";

interface CreateInvoiceModalProps {
  client: any;
  onClose: () => void;
}

export function CreateInvoiceModal({ client, onClose }: CreateInvoiceModalProps) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create Invoice
      const { error } = await supabase
        .from('facturas')
        .insert({
          cliente_id: client.id,
          numero: `INV-${Date.now().toString().slice(-6)}`, // Simple auto-number
          total: parseFloat(amount),
          descripcion: description,
          estado: 'pendiente',
          fecha: new Date().toISOString()
        });

      if (error) throw error;

      // 2. Update Client Balance (Optional, if trigger doesn't exist yet)
      // Ideally this is a database trigger, but for now we can do it client-side or assume trigger handles it.
      
      alert("Factura creada exitosamente!");
      onClose();
    } catch (error: any) {
      console.error("Error creating invoice:", error);
      alert("Error al crear factura: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#0a0b1e] border border-indigo-500/30 rounded-2xl p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Nueva Factura</h3>
          <button onClick={onClose} className="text-indigo-200 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6 p-4 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
          <p className="text-sm text-indigo-200">Cliente</p>
          <p className="text-lg font-semibold text-white">{client.nombre}</p>
        </div>

        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-indigo-200 mb-1">Monto Total</label>
            <input
              type="number"
              required
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-[#11132b] border border-indigo-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500/50"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-indigo-200 mb-1">Descripción</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#11132b] border border-indigo-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500/50 h-24 resize-none"
              placeholder="Detalles de la factura..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            Generar Factura
          </button>
        </form>
      </div>
    </div>
  );
}
