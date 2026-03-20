'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Loader2, X } from 'lucide-react';

export default function NewProjectModal({ onCreated }: { onCreated: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setLoading(true);

    try {
      // 1. Criar o Projeto
      const { data: project, error: pError } = await supabase
        .from('projects')
        .insert({ name, status: 'planning' })
        .select()
        .single();

      if (pError) throw pError;

      // 2. Buscar os IDs dos Agentes
      const { data: agents } = await supabase.from('agents').select('id, role_name');

      // 3. Criar os 4 Estágios Automáticos
      const stages = [
        { project_id: project.id, agent_id: agents?.find(a => a.role_name === 'CPO')?.id, sequence_order: 1, title: 'Refino da Ideia e MVP' },
        { project_id: project.id, agent_id: agents?.find(a => a.role_name === 'DESIGNER')?.id, sequence_order: 2, title: 'Prototipagem UI/UX' },
        { project_id: project.id, agent_id: agents?.find(a => a.role_name === 'CTO')?.id, sequence_order: 3, title: 'Arquitetura de Dados' },
        { project_id: project.id, agent_id: agents?.find(a => a.role_name === 'CTO')?.id, sequence_order: 4, title: 'Geração de Código' },
      ];

      await supabase.from('project_stages').insert(stages);

      setIsOpen(false);
      setName('');
      onCreated();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return (
    <button onClick={() => setIsOpen(true)} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
      <Plus size={20} /> Novo Projeto SaaS
    </button>
  );

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900">Novo Desafio PROSIS</h2>
          <button onClick={() => setIsOpen(false)}><X className="text-slate-400" /></button>
        </div>
        <input 
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome do seu novo SaaS ou App..."
          className="w-full p-4 rounded-xl border border-slate-200 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button 
          onClick={handleCreate}
          disabled={loading}
          className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold flex justify-center items-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" /> : 'Lançar Projeto'}
        </button>
      </div>
    </div>
  );
}