import React, { useState } from 'react';
import { Sparkles, Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle2, LogIn, UserPlus } from 'lucide-react';
import { supabase } from '../utils/supabase';

export default function AuthModal({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(false); // false = Criar Conta, true = Entrar
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Mãe / Pai / Cuidador');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Preencha seu e-mail e senha.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('A senha precisa ter no mínimo 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        // Realizar Login com Supabase Auth
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password: password
        });

        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            throw new Error('E-mail ou senha incorretos.');
          }
          throw error;
        }

        if (data.session) {
          onAuthSuccess(data.user);
        }
      } else {
        // Criar Conta no Supabase Auth
        if (!name.trim()) {
          setErrorMsg('Por favor, informe seu nome completo.');
          setLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password: password,
          options: {
            data: {
              full_name: name.trim(),
              role: role
            }
          }
        });

        if (error) {
          throw error;
        }

        // Se o Supabase permitir auto-login imediato sem confirmação de e-mail:
        if (data.session) {
          // Grava também na tabela pública caregivers
          await supabase.from('caregivers').upsert({
            id: data.user.id,
            name: name.trim(),
            email: email.trim().toLowerCase(),
            role: role
          });

          onAuthSuccess(data.user);
        } else if (data.user) {
          setInfoMsg('Conta criada com sucesso! Verifique seu e-mail para confirmar seu cadastro ou tente fazer login.');
          setIsLogin(true);
        }
      }
    } catch (err) {
      console.error('Erro na autenticação:', err);
      setErrorMsg(err.message || 'Falha ao processar solicitação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Banner Superior */}
        <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 p-8 text-white text-center relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm shadow-inner mb-4">
            <Sparkles className="w-8 h-8 text-amber-300" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">NeuroRotina</h2>
          <p className="text-indigo-100 text-sm mt-1">
            {isLogin 
              ? 'Acesse sua conta para ver a rotina da criança' 
              : 'Crie sua conta de cuidador no banco de dados'}
          </p>
        </div>

        {/* Abas Alternar: Criar Conta vs Entrar */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100 border-b border-slate-200">
          <button
            type="button"
            onClick={() => { setIsLogin(false); setErrorMsg(''); setInfoMsg(''); }}
            className={`py-2.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
              !isLogin ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Criar Conta</span>
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(true); setErrorMsg(''); setInfoMsg(''); }}
            className={`py-2.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
              isLogin ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Já tenho conta</span>
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
          {errorMsg && (
            <div className="flex items-start gap-2.5 p-3 text-xs text-rose-700 bg-rose-50 rounded-xl border border-rose-200">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {infoMsg && (
            <div className="flex items-start gap-2.5 p-3 text-xs text-emerald-700 bg-emerald-50 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{infoMsg}</span>
            </div>
          )}

          {!isLogin && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Seu Nome Completo (Cuidador)
                </label>
                <div className="relative">
                  <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Ex: Mariana Ferreira"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Seu E-mail
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                placeholder="exemplo@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Senha de Acesso
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition disabled:opacity-50"
            >
              <span>{loading ? 'Processando...' : (isLogin ? 'Entrar no Sistema' : 'Cadastrar no Banco')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <p className="text-center text-[11px] text-slate-400 pt-1">
            Autenticação segura e criptografada com <strong>Supabase Auth</strong>.
          </p>
        </form>
      </div>
    </div>
  );
}
