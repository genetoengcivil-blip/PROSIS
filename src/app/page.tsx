'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Rocket, Layout, Database, Code, FolderOpen, Sparkles, ArrowRight, LogOut, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import NewProjectModal from '@/components/NewProjectModal';
import PipelineCard from '@/components/PipelineCard';

export default function Dashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectStages, setSelectedProjectStages] = useState<any[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadProjects = async () => {
    setLoading(true);
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (data) setProjects(data);
    setLoading(false);
  };

  const loadStages = async (projectId: string) => {
    const { data } = await supabase
      .from('project_stages')
      .select('*')
      .eq('project_id', projectId)
      .order('sequence_order', { ascending: true });
    if (data) {
      setSelectedProjectStages(data);
      setActiveProjectId(projectId);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  useEffect(() => { loadProjects(); }, []);

  const getIcon = (role: string) => {
    switch (role) {
      case 'CPO': return <Rocket size={20} />;
      case 'DESIGNER': return <Layout size={20} />;
      case 'CTO': return <Database size={20} />;
      default: return <Code size={20} />;
    }
  };

  return (
    <main className="min-h-screen p-6 max-w-6xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">PROSIS</h1>
          <p className="text-slate-500 font-medium uppercase text-[10px] tracking-[0.3em]">Agente Intelligence Engine</p>
        </div>
        <div className="flex items-center gap-4">
          <NewProjectModal onCreated={loadProjects} />
          <button 
            onClick={handleLogout}
            className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
            title="Sair do Sistema"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={32} /></div>
      ) : projects.length === 0 ? (
        <section className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
          <Sparkles className="mx-auto text-blue-500 mb-4" size={48} />
          <h2 className="text-xl font-bold text-slate-800">Nenhum projeto iniciado</h2>
          <p className="text-slate-400 mb-8">Lance sua primeira ideia de SaaS clicando no botão acima.</p>
        </section>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="space-y-4">
            <h2 className="font-bold text-slate-400 uppercase text-[10px] tracking-widest px-2">Histórico</h2>
            {projects.map((project) => (
              <div 
                key={project.id} 
                onClick={() => loadStages(project.id)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all group ${
                  activeProjectId === project.id ? 'bg-blue-600 border-blue-600 text-white shadow-xl' : 'bg-white border-slate-200 hover:border-blue-300'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold truncate pr-4">{project.name}</span>
                  <ArrowRight size={16} className={activeProjectId === project.id ? 'text-white' : 'text-slate-300 group-hover:text-blue-500'} />
                </div>
              </div>
            ))}
          </section>

          <section className="lg:col-span-2 space-y-4">
            {!activeProjectId ? (
              <div className="h-full min-h-[300px] border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400 p-8 text-center italic">
                <FolderOpen size={40} className="mb-4 opacity-20" />
                Selecione um projeto para ver os agentes
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {selectedProjectStages.map((stage, index) => {
                  const isFirst = index === 0;
                  const prevIsDone = isFirst ? true : selectedProjectStages[index - 1].is_completed;
                  let status: 'done' | 'active' | 'locked' = 'locked';
                  if (stage.is_completed) status = 'done';
                  else if (prevIsDone) status = 'active';

                  return (
                    <PipelineCard 
                      key={stage.id}
                      title={stage.title}
                      status={status}
                      icon={getIcon(stage.agent_name)}
                      projectId={activeProjectId}
                      outputContent={stage.output_content}
                    />
                  );
                })}
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
}