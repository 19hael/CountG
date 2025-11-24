"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, User, Building2, ArrowRight, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    companyName: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Sign up user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            company_name: formData.companyName,
          },
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Create Company Record
        // Note: In a real production app with strict RLS, this might be handled by a Database Trigger (handle_new_user)
        // to avoid client-side permission issues. However, for this MVP, we attempt client-side insert.
        // If RLS blocks this, we should rely on the trigger or update policies.
        
        const { data: companyData, error: companyError } = await supabase
          .from('empresas')
          .insert([{ 
            nombre: formData.companyName, 
            email: formData.email, // Linking company to creator's email for reference
            created_at: new Date().toISOString()
          }])
          .select()
          .single();

        if (companyError) {
          console.error("Error creating company:", companyError);
          // If company creation fails, we might want to stop or warn. 
          // But if it's a duplicate or RLS issue, we might proceed if the trigger handled it.
          // For now, let's assume if it fails, we can't proceed with linking.
          throw new Error("Error al crear la empresa. Por favor contacte soporte.");
        }

        if (companyData) {
            // 3. Create User Record linked to Company
            const { error: userError } = await supabase
                .from('usuarios')
                .insert([{ 
                    id: authData.user.id, // Match Auth ID
                    email: formData.email, 
                    nombre: formData.fullName, 
                    empresa_id: companyData.id,
                    rol: 'admin',
                    created_at: new Date().toISOString()
                }]);
            
            if (userError) {
              console.error("Error creating user profile:", userError);
              throw new Error("Error al crear el perfil de usuario.");
            }
        }
      }

      router.push("/");
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message || "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Vixai</h1>
          <p className="text-muted-foreground">Crea tu cuenta empresarial</p>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Nombre Completo</label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                className="w-full bg-muted border border-input rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="Juan Pérez"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Nombre de Empresa</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                className="w-full bg-muted border border-input rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="Mi Negocio S.A.S"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-muted border border-input rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="nombre@empresa.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full bg-muted border border-input rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="••••••••"
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground font-medium py-2.5 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Crear Cuenta <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
