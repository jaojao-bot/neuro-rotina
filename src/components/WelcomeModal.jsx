import React, { useState } from 'react';
import { Sparkles, Heart, Shield, ArrowRight, User, Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../utils/supabase';

export default function WelcomeModal({ onComplete }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Mãe / Pai / Cuidador');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setErrorMsg('Por favor, preencha seu nome e seu e-mail.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const caregiverData = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role: role
      };

      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('caregivers')
          .upsert(caregiverData, { onConflict: 'email' })
          .select();

        if (error) {
          console.warn('Aviso Supabase caregivers:', error);
        }
      }

      // Salva no armazenamento local para não pedir de novo
      localStorage.setItem('neurorotina_caregiver', JSON.stringify(caregiverData));
      onComplete(caregiverData);
    } catch (err) {
      console.error(err);
      // Fallback local garantindo que o usuário nunca fique travado
      const fallbackData = { name: name.trim(), email: email.trim(), role };
      localStorage.setItem('neurorotina_caregiver', JSON.stringify(fallbackData));
      onComplete(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Cabeçalho acolhedor */}
        <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 p-8 text-white text-center relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm shadow-inner mb-4">
            <Sparkles className="w-8 h-8 text-amber-300" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Bem-vindo ao NeuroRotina!</h2>
          <p className="text-indigo-100 text-sm mt-2 max-w-xs mx-auto">
            Organização previsível, inclusiva e com suporte sensorial para o dia a dia da criança.
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Identificação do Cuidador
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 p-3 text-sm text-rose-700 bg-rose-50 rounded-xl border border-rose-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Seu Nome Completo (Cuidador)
            </label>
            <div className="relative">
              <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                placeholder="Ex: Ana Paula da Silva"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Seu E-mail
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Relação com a Criança
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
            >
              <option value="Mãe / Pai">Mãe / Pai</option>
              <option value="Tutor / Responsável Legal">Tutor / Responsável Legal</option>
              <option value="Terapeuta / Psicopedagogo">Terapeuta / Psicopedagogo</option>
              <option value="Educador / Professor">Educador / Professor</option>
              <option value="Familiar / Outro">Familiar / Outro</option>
            </select>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition disabled:opacity-50"
            >
              <span>{loading ? 'Salvando no banco...' : 'Começar a Usar'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <p className="text-center text-[11px] text-slate-400 pt-1">
            Seus dados são salvos com segurança no Supabase e usados para personalizar relatórios de acompanhamento.
          </p>
        </form>
      </div>
    </div>
  );
}
