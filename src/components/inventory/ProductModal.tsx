"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product?: any; // If provided, it's edit mode
}

export function ProductModal({ isOpen, onClose, onSuccess, product }: ProductModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    codigo: "",
    precio_costo: "",
    precio_venta: "",
    stock_actual: "",
    stock_minimo: "",
    categoria: "General",
  });

  useEffect(() => {
    if (product) {
      setFormData({
        nombre: product.nombre,
        codigo: product.codigo || "",
        precio_costo: product.precio_costo?.toString() || "",
        precio_venta: product.precio_venta?.toString() || "",
        stock_actual: product.stock_actual?.toString() || "",
        stock_minimo: product.stock_minimo?.toString() || "",
        categoria: product.categoria || "General",
      });
    } else {
      setFormData({
        nombre: "",
        codigo: "",
        precio_costo: "",
        precio_venta: "",
        stock_actual: "",
        stock_minimo: "",
        categoria: "General",
      });
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSave = {
        nombre: formData.nombre,
        codigo: formData.codigo,
        precio_costo: parseFloat(formData.precio_costo) || 0,
        precio_venta: parseFloat(formData.precio_venta) || 0,
        stock_actual: parseInt(formData.stock_actual) || 0,
        stock_minimo: parseInt(formData.stock_minimo) || 5,
        categoria: formData.categoria,
      };

      if (product) {
        // Update
        const { error } = await supabase
          .from('productos')
          .update(dataToSave)
          .eq('id', product.id);
        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase
          .from('productos')
          .insert([dataToSave]);
        if (error) throw error;
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Error al guardar el producto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card border border-border w-full max-w-lg rounded-xl shadow-lg p-6 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">{product ? "Editar Producto" : "Nuevo Producto"}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-sm font-medium mb-1 block">Nombre del Producto</label>
              <input
                type="text"
                required
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                className="w-full bg-muted border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Ej. Camiseta Polo"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Código / SKU</label>
              <input
                type="text"
                value={formData.codigo}
                onChange={(e) => setFormData({...formData, codigo: e.target.value})}
                className="w-full bg-muted border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="ABC-123"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Categoría</label>
              <select
                value={formData.categoria}
                onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                className="w-full bg-muted border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="General">General</option>
                <option value="Ropa">Ropa</option>
                <option value="Electrónica">Electrónica</option>
                <option value="Servicios">Servicios</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Precio Costo</label>
              <input
                type="number"
                step="0.01"
                value={formData.precio_costo}
                onChange={(e) => setFormData({...formData, precio_costo: e.target.value})}
                className="w-full bg-muted border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Precio Venta</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.precio_venta}
                onChange={(e) => setFormData({...formData, precio_venta: e.target.value})}
                className="w-full bg-muted border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Stock Actual</label>
              <input
                type="number"
                required
                value={formData.stock_actual}
                onChange={(e) => setFormData({...formData, stock_actual: e.target.value})}
                className="w-full bg-muted border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="0"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Stock Mínimo</label>
              <input
                type="number"
                value={formData.stock_minimo}
                onChange={(e) => setFormData({...formData, stock_minimo: e.target.value})}
                className="w-full bg-muted border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="5"
              />
            </div>
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
              {product ? "Guardar Cambios" : "Crear Producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
