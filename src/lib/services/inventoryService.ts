import { supabase } from "@/lib/supabase";

export const inventoryService = {
  async updateStock(productId: string, quantity: number, type: 'IN' | 'OUT') {
    // 1. Get current stock
    const { data: product, error: fetchError } = await supabase
      .from('productos')
      .select('stock_actual')
      .eq('id', productId)
      .single();

    if (fetchError) throw fetchError;

    // 2. Calculate new stock
    const newStock = type === 'IN' 
      ? product.stock_actual + quantity 
      : product.stock_actual - quantity;

    if (newStock < 0) throw new Error('Stock insuficiente');

    // 3. Update product
    const { error: updateError } = await supabase
      .from('productos')
      .update({ stock_actual: newStock })
      .eq('id', productId);

    if (updateError) throw updateError;

    // 4. Record movement
    await supabase.from('movimientos_inventario').insert({
      producto_id: productId,
      tipo: type,
      cantidad: quantity,
      fecha: new Date().toISOString()
    });

    return newStock;
  },

  async checkLowStock(companyId: string) {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .lt('stock_actual', 5) // Hardcoded threshold or use column
      .eq('company_id', companyId);

    if (error) throw error;
    return data;
  }
};
