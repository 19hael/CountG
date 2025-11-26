"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2, ArrowRight, Lock, Mail, Sparkles } from "lucide-react";

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check if already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push("/dashboard");
      }
    };
    checkSession();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      try {
        await fetch('/api/auth/set-cookie', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
          credentials: 'include',
        });
      } catch (e) {
        console.warn('Failed to set auth cookie', e);
      }

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center bg-[#0a0b1e]">
      {/* Background Stars/Nebula Effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#0a0b1e] to-[#0a0b1e]"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 z-10 grid lg:grid-cols-2 gap-12 items-center h-full">
        
        {/* Left Side: Planetary Animation & Hero Text */}
        <div className="flex flex-col items-center justify-center relative h-[600px]">
          
          {/* Central Core */}
          <div className="absolute z-20 flex flex-col items-center justify-center text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500/30 blur-xl rounded-full"></div>
              <h1 className="relative text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-4 tracking-tighter">
                VIXAI
              </h1>
            </div>
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-indigo-500/30 text-indigo-300 text-sm font-medium animate-bounce-slow">
              <Sparkles className="w-4 h-4" />
              <span>Impulsado por IA</span>
            </div>
          </div>

          {/* Orbits */}
          <div className="orbit-container absolute inset-0 pointer-events-none">
            {/* Orbit 1 */}
            <div className="planet-track w-[250px] h-[250px]"></div>
            <div className="planet w-4 h-4 bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)]" style={{ "--orbit-radius": "125px", "--orbit-duration": "8s" } as any}></div>

            {/* Orbit 2 */}
            <div className="planet-track w-[380px] h-[380px] opacity-60"></div>
            <div className="planet w-6 h-6 bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.8)]" style={{ "--orbit-radius": "190px", "--orbit-duration": "12s", "animationDelay": "-2s" } as any}></div>

            {/* Orbit 3 */}
            <div className="planet-track w-[520px] h-[520px] opacity-40"></div>
            <div className="planet w-3 h-3 bg-pink-400 shadow-[0_0_10px_rgba(244,114,182,0.8)]" style={{ "--orbit-radius": "260px", "--orbit-duration": "18s", "animationDelay": "-5s" } as any}></div>
          </div>
          
          <p className="absolute bottom-10 text-center text-muted-foreground max-w-md animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
            La nueva y más inteligente forma de gestionar tu negocio.
            Automatización, análisis predictivo y control total en una sola plataforma.
          </p>
        </div>

        {/* Right Side: Login Panel */}
        <div className="flex justify-center">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-md glass p-8 rounded-2xl shadow-2xl border border-white/10"
          >
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Bienvenido de nuevo</h2>
              <p className="text-indigo-200/70 text-sm">Accede a tu panel de control inteligente</p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-200 text-sm p-3 rounded-lg mb-6 text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-indigo-200">Email Corporativo</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-indigo-400 group-focus-within:text-indigo-300 transition-colors" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#0a0b1e]/50 border border-indigo-500/20 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-indigo-500/40 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                    placeholder="nombre@empresa.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-indigo-200">Contraseña</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-indigo-400 group-focus-within:text-indigo-300 transition-colors" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#0a0b1e]/50 border border-indigo-500/20 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-indigo-500/40 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Ingresar al Sistema <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/5 text-center">
              <p className="text-sm text-indigo-200/60">
                Acceso exclusivo para clientes corporativos.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
