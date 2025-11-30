"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Plus, Search, FileText, MoreVertical, Mail, Phone } from "lucide-react";
import { CreateInvoiceModal } from "@/components/invoicing/CreateInvoiceModal";
import { ModalForm } from "@/components/ui/ModalForm";

export function ClientManager() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  async function fetchClients() {
    try {
      const { data } = await supabase
        .from('clientes')
        .select('*')
        .order('nombre', { ascending: true });
      setClients(data || []);
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredClients = clients.filter(client => 
    client.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateInvoice = (client: any) => {
    setSelectedClient(client);
    setIsInvoiceModalOpen(true);
  };

  const clientFields = [
    { name: "nombre", label: "Nombre Completo / Empresa", type: "text" as const, required: true, placeholder: "Ej: Juan Pérez o Empresa ABC" },
    { name: "email", label: "Email", type: "email" as const, required: true, placeholder: "cliente@ejemplo.com" },
    { name: "telefono", label: "Teléfono", type: "text" as const, required: false, placeholder: "+1 234 567 8900" },
    { name: "direccion", label: "Dirección", type: "textarea" as const, required: false, placeholder: "Calle, Ciudad, País" },
    { name: "ruc_dni", label: "RUC / DNI / ID", type: "text" as const, required: false, placeholder: "Número de identificación" },
  ];

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-indigo-500" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-indigo-400" />
          <input
            type="text"
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#11132b] border border-indigo-500/30 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50"
          />
        </div>
        <button 
          onClick={() => setIsClientModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> Nuevo Cliente
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredClients.map((client) => (
          <div key={client.id} className="glass p-5 rounded-xl border border-white/5 hover:border-indigo-500/30 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                {client.nombre.charAt(0)}
              </div>
              <button className="p-1 hover:bg-white/10 rounded text-indigo-200">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
            
            <h3 className="text-lg font-semibold text-white mb-1">{client.nombre}</h3>
            
            <div className="space-y-2 mb-6">
              {client.email && (
                <div className="flex items-center gap-2 text-sm text-indigo-200/70">
                  <Mail className="w-3 h-3" /> {client.email}
                </div>
              )}
              {client.telefono && (
                <div className="flex items-center gap-2 text-sm text-indigo-200/70">
                  <Phone className="w-3 h-3" /> {client.telefono}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-white/5 flex gap-2">
              <button 
                onClick={() => handleCreateInvoice(client)}
                className="flex-1 flex items-center justify-center gap-2 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-indigo-200 transition-colors"
              >
                <FileText className="w-4 h-4" /> Facturar
              </button>
            </div>
          </div>
        ))}
      </div>

      {isInvoiceModalOpen && selectedClient && (
        <CreateInvoiceModal 
          client={selectedClient} 
          onClose={() => setIsInvoiceModalOpen(false)} 
        />
      )}

      <ModalForm
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
        title="Nuevo Cliente"
        fields={clientFields}
        tableName="clientes"
        onSuccess={fetchClients}
      />
    </div>
  );
}
