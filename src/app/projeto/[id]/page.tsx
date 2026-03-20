'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Send, ChevronLeft, Bot, User, Loader2, CheckCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ProjectPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState<any>(null);
  const [finishing, setFinishing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadProjectData() {
      const { data: currentStage } = await supabase
        .from('project_stages')
        .select('*, projects(name)')
        .eq('project_id', params.id)
        .eq('is_completed', false)
        .order('sequence_order', { ascending: true })
        .limit(1)
        .single();
      
      setStage(currentStage);

      if (currentStage) {
        const { data: history } = await supabase
          .from('agent_interactions')
          .select('*')
          .eq('project_stage_id', currentStage.id)
          .order('created_at', { ascending: true });
        
        if (history) setMessages(history);
      }
    }
    loadProjectData();
  }, [params.id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSendMessage() {
    if (!input.trim() || !stage || loading) return;
    const userMsg = { user_input: input, agent_output: null };
    setMessages([...messages, userMsg]);
    setLoading(true);
    const textToSend = input;
    setInput('');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message: textToSend, stageId: stage.id, agentRole: stage.agent_name, history: messages }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev.slice(0, -1), { user_input: textToSend, agent_output: data.text }]);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }

  const handleFinishStage = async () => {
    if (!stage || messages.length === 0) return;
    setFinishing(true);
    try {
      await fetch('/api/summarize', { method: 'POST', body: JSON.stringify({ stageId: stage.id, history: messages }) });
      await supabase.from('project_stages').update({ is_completed: true }).eq('id', stage.id);
      router.push('/');
      router.refresh();
    } catch (err) { console.error(err); } finally { setFinishing(false); }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-50">
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-slate-100 rounded-full transition-colors"><ChevronLeft size={20}/></Link>
          <div>
            <h1 className="font-bold text-slate-900">{stage?.projects?.name || 'Projeto'}</h1>
            <p className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-black uppercase tracking-widest inline-block">Agente {stage?.agent_name}</p>
          </div>
        </div>
        <button 
          onClick={handleFinishStage}
          disabled={finishing || messages.length === 0}
          className="bg-green-600 text-white px-5 py-2 rounded-xl text-xs font-black uppercase hover:bg-green-700 flex items-center gap-2 transition-all disabled:opacity-50"
        >
          {finishing ? <><Sparkles className="animate-pulse" size={14}/> Resumindo...</> : <><CheckCircle size={14}/> Concluir</>}
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {messages.map((msg, i) => (
          <div key={i} className="space-y-6">
            {/* Usuário */}
            <div className="flex gap-4 max-w-2xl ml-auto flex-row-reverse">
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-white shrink-0 text-xs font-bold shadow-md">U</div>
              <div className="bg-blue-600 p-4 rounded-2xl rounded-tr-none text-white shadow-md text-sm">{msg.user_input}</div>
            </div>
            
            {/* Agente com Markdown */}
            {msg.agent_output && (
              <div className="flex gap-4 max-w-3xl">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-md"><Bot size={16}/></div>
                <div className="bg-white p-5 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm text-slate-700 text-sm prose prose-slate max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.agent_output}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        ))}
        {loading && <div className="flex gap-2 items-center text-blue-500 text-xs font-bold animate-pulse"><Bot size={14}/> O AGENTE ESTÁ ANALISANDO...</div>}
        <div ref={scrollRef} />
      </div>

      <footer className="p-4 bg-white border-t">
        <div className="max-w-4xl mx-auto flex gap-2">
          <input 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} 
            placeholder={`Descreva aqui para o Agente ${stage?.agent_name}...`} 
            className="flex-1 p-4 bg-slate-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm border border-transparent focus:border-blue-200"
          />
          <button 
            onClick={handleSendMessage} 
            disabled={loading || !input.trim()}
            className="p-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 disabled:shadow-none"
          >
            <Send size={20} />
          </button>
        </div>
      </footer>
    </div>
  );
}