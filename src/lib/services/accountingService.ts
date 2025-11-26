import { supabase } from "@/lib/supabase";

export interface JournalEntry {
  date: string;
  description: string;
  reference: string;
  debit_account: string;
  credit_account: string;
  amount: number;
  company_id: string;
}

export const accountingService = {
  async createJournalEntry(entry: JournalEntry) {
    const { data, error } = await supabase
      .from('asientos_contables')
      .insert([entry])
      .select()
      .single();

    if (error) {
      console.error('Error creating journal entry:', error);
      throw error;
    }

    return data;
  },

  async recordSale(saleId: string, amount: number, companyId: string) {
    // Debit Cash/Bank, Credit Sales Revenue
    await this.createJournalEntry({
      date: new Date().toISOString(),
      description: `Venta #${saleId}`,
      reference: saleId,
      debit_account: '101-Caja',
      credit_account: '401-Ventas',
      amount: amount,
      company_id: companyId
    });

    // Calculate Tax (assuming 18%)
    const taxAmount = amount - (amount / 1.18);
    await this.createJournalEntry({
      date: new Date().toISOString(),
      description: `IGV Venta #${saleId}`,
      reference: saleId,
      debit_account: '401-Ventas', // Reduce sales revenue by tax amount (simplified)
      credit_account: '201-IGV Por Pagar',
      amount: taxAmount,
      company_id: companyId
    });
  },

  async recordPurchase(purchaseId: string, amount: number, companyId: string) {
    // Debit Inventory, Credit Cash/Bank
    await this.createJournalEntry({
      date: new Date().toISOString(),
      description: `Compra #${purchaseId}`,
      reference: purchaseId,
      debit_account: '102-Inventario',
      credit_account: '101-Caja',
      amount: amount,
      company_id: companyId
    });
  }
};
