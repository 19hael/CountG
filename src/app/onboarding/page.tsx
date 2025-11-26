"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronRight, Building2, Calculator, Package, Users, CreditCard } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    industry: "",
    taxId: "",
    currency: "USD",
    hasInventory: true,
    hasEmployees: false
  });

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else handleFinish();
  };

  const handleFinish = async () => {
    setLoading(true);
    // Simulate saving settings
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real app, we would update the user's profile/company here
    // await supabase.from('companies').update(formData)...

    router.push('/');
  };

  const steps = [
    { id: 1, title: "Empresa", icon: Building2 },
    { id: 2, title: "Operación", icon: Calculator },
    { id: 3, title: "Módulos", icon: Package },
    { id: 4, title: "Listo", icon: Check },
  ];

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />

        {/* Steps Indicator */}
        <div className="flex justify-between mb-12 relative z-10">
          {steps.map((s, i) => (
            <div key={s.id} className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                step >= s.id ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 'bg-white/5 text-indigo-200/40'
              }`}>
                <s.icon className="w-5 h-5" />
              </div>
              <span className={`text-xs font-medium transition-colors duration-500 ${
                step >= s.id ? 'text-white' : 'text-indigo-200/40'
              }`}>
                {s.title}
              </span>
            </div>
          ))}
          {/* Progress Line */}
          <div className="absolute top-5 left-0 w-full h-[2px] bg-white/5 -z-10">
            <div 
              className="h-full bg-indigo-500 transition-all duration-500"
              style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 min-h-[300px]">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
              <h2 className="text-3xl font-bold text-white">Cuéntanos sobre tu negocio</h2>
              <p className="text-indigo-200/60">Configuraremos Vixai para que se adapte a ti.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-indigo-200/80 mb-2">Nombre de la Empresa</label>
                  <input 
                    type="text" 
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
                    placeholder="Ej. Ferretería El Tornillo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-indigo-200/80 mb-2">Industria / Rubro</label>
                  <select 
                    value={formData.industry}
                    onChange={(e) => setFormData({...formData, industry: e.target.value})}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
                  >
                    <option value="">Selecciona una opción</option>
                    <option value="retail">Comercio Minorista (Retail)</option>
                    <option value="services">Servicios Profesionales</option>
                    <option value="food">Restaurante / Comida</option>
                    <option value="construction">Construcción / Ferretería</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
              <h2 className="text-3xl font-bold text-white">Datos Fiscales</h2>
              <p className="text-indigo-200/60">Para la facturación y reportes automáticos.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-indigo-200/80 mb-2">RUC / ID Fiscal</label>
                  <input 
                    type="text" 
                    value={formData.taxId}
                    onChange={(e) => setFormData({...formData, taxId: e.target.value})}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
                    placeholder="Número de identificación fiscal"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-indigo-200/80 mb-2">Moneda Principal</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setFormData({...formData, currency: 'USD'})}
                      className={`p-4 rounded-xl border transition-all ${
                        formData.currency === 'USD' 
                          ? 'bg-indigo-500/20 border-indigo-500 text-white' 
                          : 'bg-black/20 border-white/10 text-indigo-200/60 hover:bg-white/5'
                      }`}
                    >
                      <span className="text-xl font-bold block mb-1">USD</span>
                      <span className="text-xs">Dólar Americano</span>
                    </button>
                    <button 
                      onClick={() => setFormData({...formData, currency: 'LOCAL'})}
                      className={`p-4 rounded-xl border transition-all ${
                        formData.currency === 'LOCAL' 
                          ? 'bg-indigo-500/20 border-indigo-500 text-white' 
                          : 'bg-black/20 border-white/10 text-indigo-200/60 hover:bg-white/5'
                      }`}
                    >
                      <span className="text-xl font-bold block mb-1">Local</span>
                      <span className="text-xs">Moneda Local</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
              <h2 className="text-3xl font-bold text-white">Personaliza tu experiencia</h2>
              <p className="text-indigo-200/60">Activa solo lo que necesitas.</p>
              
              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 rounded-xl bg-black/20 border border-white/10 cursor-pointer hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <Package className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">Control de Inventario</h3>
                      <p className="text-xs text-indigo-200/60">Stock, almacenes y movimientos.</p>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={formData.hasInventory}
                    onChange={(e) => setFormData({...formData, hasInventory: e.target.checked})}
                    className="w-5 h-5 accent-indigo-500"
                  />
                </label>

                <label className="flex items-center justify-between p-4 rounded-xl bg-black/20 border border-white/10 cursor-pointer hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">Recursos Humanos</h3>
                      <p className="text-xs text-indigo-200/60">Empleados, planilla y asistencia.</p>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={formData.hasEmployees}
                    onChange={(e) => setFormData({...formData, hasEmployees: e.target.checked})}
                    className="w-5 h-5 accent-indigo-500"
                  />
                </label>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500 py-8">
              <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                <Check className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">¡Todo listo!</h2>
                <p className="text-indigo-200/60 max-w-md mx-auto">
                  Hemos configurado tu espacio de trabajo. Estás listo para empezar a gestionar tu negocio con Vixai.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center mt-12 pt-6 border-t border-white/10">
          <button 
            onClick={() => step > 1 && setStep(step - 1)}
            className={`text-sm font-medium text-indigo-200/60 hover:text-white transition-colors ${step === 1 ? 'invisible' : ''}`}
          >
            Atrás
          </button>
          
          <button
            onClick={handleNext}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-medium flex items-center gap-2 transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? 'Configurando...' : step === 4 ? 'Ir al Dashboard' : 'Continuar'}
            {!loading && step < 4 && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
