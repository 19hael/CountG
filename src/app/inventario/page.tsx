"use client";

import { useState, useEffect } from "react";
import { ModuleHeader } from "@/components/ui/ModuleHeader";
import { SmartTable } from "@/components/ui/SmartTable";
import { ProductModal } from "@/components/inventory/ProductModal";
import { Package, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function InventarioPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) console.error(error);
    else setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (row: any) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      const { error } = await supabase
        .from('productos')
        .delete()
        .eq('id', row.id);
      
      if (!error) fetchProducts();
    }
  };

  const columns = [
    { key: "codigo", label: "Código" },
    { key: "nombre", label: "Producto" },
    { key: "categoria", label: "Categoría" },
    { 
      key: "precio_venta", 
      label: "Precio",
      render: (val: number) => `$${val.toFixed(2)}`
    },
    { 
      key: "stock_actual", 
      label: "Stock",
      render: (val: number, row: any) => (
        <span className={val <= (row.stock_minimo || 5) ? "text-destructive font-bold" : "text-secondary"}>
          {val}
        </span>
      )
    },
  ];

  return (
    <div>
      <ModuleHeader 
        title="Inventario" 
        description="Control de stock y productos."
        icon={Package}
        action={
          <button 
            onClick={() => {
              setEditingProduct(null);
              setIsModalOpen(true);
            }}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Nuevo Producto
          </button>
        }
      />
      
      <SmartTable
        title="Listado de Productos"
        data={products}
        columns={columns}
        loading={loading}
        onEdit={(row) => {
          setEditingProduct(row);
          setIsModalOpen(true);
        }}
        onDelete={handleDelete}
        onAdd={() => {
          setEditingProduct(null);
          setIsModalOpen(true);
        }}
      />

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchProducts}
        product={editingProduct}
      />
    </div>
  );
}
