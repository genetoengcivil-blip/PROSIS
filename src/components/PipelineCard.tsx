'use client';

import { ReactNode } from 'react';
import { Lock, CheckCircle2, ChevronRight, MessageSquareQuote } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Props {
  title: string;
  status: 'done' | 'active' | 'locked';
  icon: ReactNode;
  projectId: string;
  outputContent?: any;
}

export default function PipelineCard({ title, status, icon, projectId, outputContent }: Props) {
  const router = useRouter();
  const isDone = status === 'done';
  const isLocked = status === 'locked';
  const isActive = status === 'active';

  return (
    <div className={`flex flex-col p-5 rounded-2xl border transition-all ${
      isActive ? 'bg-white border-blue-500 shadow-md scale-[1.01]' : 
      isDone ? 'bg-green-50/50 border-green-100 opacity-90' : 'bg-slate-50 border-slate-100 opacity-50'
    }`}>
      <div className="flex items-center w-full">
        <div className={`p-3 rounded-xl mr-4 ${
          isActive ? 'bg-blue-600 text-white' : 
          isDone ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-400'
        }`}>
          {isDone ? <CheckCircle2 size={20} /> : icon}
        </div>
        
        <div className="flex-1">
          <h3 className={`font-bold ${isLocked ? 'text-slate-400' : 'text-slate-800'}`}>{title}</h3>
        </div>

        {!isLocked && (
          <button 
            onClick={() => router.push(`/projeto/${projectId}`)}
            className={`px-6 py-2 rounded-full font-bold text-sm flex items-center gap-2 transition-all ${
              isDone ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isDone ? 'Revisar' : 'Iniciar'} <ChevronRight size={14} />
          </button>
        )}
        
        {isLocked && <Lock className="text-slate-300 mr-4" size={20} />}
      </div>

      {/* Exibição do Resumo da IA */}
      {isDone && outputContent?.summary && (
        <div className="mt-4 p-3 bg-white/50 rounded-xl border border-green-100 flex gap-3 items-start">
          <MessageSquareQuote size={14} className="text-green-500 mt-1 shrink-0" />
          <p className="text-xs text-slate-600 italic leading-relaxed">
            {outputContent.summary}
          </p>
        </div>
      )}
    </div>
  );
}