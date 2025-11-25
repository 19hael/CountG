"use client";

import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0b1e] p-4">
      <div className="w-full max-w-md glass border border-white/10 rounded-2xl p-8 shadow-2xl text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-red-500/10 text-red-500">
            <ShieldAlert className="w-12 h-12" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-4">Acceso Restringido</h1>
        <p className="text-indigo-200/70 mb-8">
          El registro público ha sido deshabilitado. Para crear una nueva cuenta empresarial, por favor contacte al administrador del sistema.
        </p>

        <Link 
          href="/login" 
          className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al Inicio de Sesión
        </Link>
      </div>
    </div>
  );
}
