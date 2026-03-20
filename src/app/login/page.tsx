'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Loader2, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message as any);
      setLoading(false);
    } else {
      router.push('/');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-night-950 p-6 bg-gradient-radial from-night-900 to-night-950">
      <div className="max-w-md w-full bg-night-900 rounded-3xl shadow-2xl p-10 border border-slate-800 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-10">
          <Sparkles className="mx-auto text-prosis-blue mb-3" size={32} />
          <h1 className="text-4xl font-black italic text-white tracking-tighter">PROSIS</h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em] mt-2">Agent Engine Access</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative">
            <Mail className="absolute left-4 top-4 text-slate-600" size={18} />
            <input 
              type="email" placeholder="E-mail profissional" required
              className="w-full pl-12 pr-4 py-4 bg-night-800 border border-slate-800 rounded-2xl text-slate-100 placeholder:text-slate-600 focus:ring-2 focus:ring-prosis-blue focus:border-prosis-blue outline-none transition-all"
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-4 text-slate-600" size={18} />
            <input 
              type="password" placeholder="Sua senha secreta" required
              className="w-full pl-12 pr-4 py-4 bg-night-800 border border-slate-800 rounded-2xl text-slate-100 placeholder:text-slate-600 focus:ring-2 focus:ring-prosis-blue focus:border-prosis-blue outline-none transition-all"
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-red-400 text-xs font-bold text-center bg-red-950/50 p-3 rounded-xl border border-red-900">{error}</p>}

          <button 
            disabled={loading}
            className="w-full py-4 bg-prosis-blue text-white rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-950 flex justify-center items-center gap-2 disabled:opacity-50 active:scale-95"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Entrar no Cockpit'}
          </button>
        </form>
      </div>
    </div>
  );
}