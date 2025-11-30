"use client";

import { useState, useEffect } from "react";
import { Calendar, CheckCircle2, Clock, MoreVertical, Plus, User } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { ModalForm } from "@/components/ui/ModalForm";

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

interface Project {
  id: number;
  title: string;
  client: string;
  status: 'En Progreso' | 'Completado' | 'Pendiente';
  dueDate: string;
  progress: number;
  team: string[];
  tasks: Task[];
}

export function ProjectBoard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('proyectos')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En Progreso': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Completado': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Pendiente': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default: return 'bg-white/5 text-white border-white/10';
    }
  };

  const projectFields = [
    { name: "title", label: "Nombre del Proyecto", type: "text" as const, required: true, placeholder: "Ej: Rediseño Web Corporativo" },
    { name: "client", label: "Cliente", type: "text" as const, required: true, placeholder: "Nombre del cliente" },
    { name: "status", label: "Estado", type: "select" as const, required: true, options: [
      { value: "Pendiente", label: "Pendiente" },
      { value: "En Progreso", label: "En Progreso" },
      { value: "Completado", label: "Completado" }
    ]},
    { name: "dueDate", label: "Fecha de Entrega", type: "date" as const, required: true },
    { name: "progress", label: "Progreso (%)", type: "number" as const, required: false, placeholder: "0-100" },
    { name: "team", label: "Equipo (separado por comas)", type: "text" as const, required: false, placeholder: "Ana, Carlos, María" },
    { name: "tasks", label: "Tareas (separadas por comas)", type: "textarea" as const, required: false, placeholder: "Diseño UI/UX, Desarrollo Frontend, Testing" },
  ];

  if (loading) {
    return <div className="text-center text-indigo-200/60 py-12">Cargando proyectos...</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* New Project Card */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex flex-col items-center justify-center h-full min-h-[300px] rounded-2xl border-2 border-dashed border-white/10 hover:border-indigo-500/50 hover:bg-white/5 transition-all group"
        >
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-indigo-500/20 transition-colors">
            <Plus className="w-8 h-8 text-indigo-200/40 group-hover:text-indigo-400" />
          </div>
          <h3 className="text-lg font-medium text-indigo-200/60 group-hover:text-indigo-200">Nuevo Proyecto</h3>
        </button>

        {projects.map(project => (
          <div key={project.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-indigo-500/30 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
              <button className="text-indigo-200/40 hover:text-white transition-colors">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-indigo-300 transition-colors">{project.title}</h3>
            <p className="text-sm text-indigo-200/60 mb-6">{project.client}</p>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-indigo-200/60">Progreso</span>
                <span className="text-white font-medium">{project.progress || 0}%</span>
              </div>
              <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${project.progress || 0}%` }}
                />
              </div>
            </div>

            {project.tasks && project.tasks.length > 0 && (
              <div className="space-y-3 mb-6">
                {project.tasks.slice(0, 3).map((task, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      task.completed ? 'bg-emerald-500 border-emerald-500' : 'border-white/20'
                    }`}>
                      {task.completed && <CheckCircle2 className="w-3 h-3 text-black" />}
                    </div>
                    <span className={task.completed ? 'text-indigo-200/40 line-through' : 'text-indigo-200/80'}>
                      {task.title}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              {project.team && project.team.length > 0 && (
                <div className="flex -space-x-2">
                  {project.team.slice(0, 3).map((member, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-indigo-900 border-2 border-black flex items-center justify-center text-xs font-medium text-white" title={member}>
                      {member.charAt(0)}
                    </div>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2 text-xs text-indigo-200/60">
                <Calendar className="w-3 h-3" />
                {project.dueDate}
              </div>
            </div>
          </div>
        ))}
      </div>

      <ModalForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nuevo Proyecto"
        fields={projectFields}
        tableName="proyectos"
        onSuccess={fetchProjects}
      />
    </>
  );
}
