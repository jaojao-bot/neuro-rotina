import React, { useState } from 'react';
import { 
  Plus, Check, X, ShieldAlert, Star, Clock, Sparkles, UserPlus, 
  Trash2, Award, BarChart3, Settings, CheckCircle2, AlertCircle, Heart 
} from 'lucide-react';
import WeeklyReport from './WeeklyReport';
import { sensoryAudio } from '../utils/audio';

export default function ParentsArea({
  children,
  activeChild,
  tasks,
  rewards,
  onApproveTask,
  onAddTask,
  onDeleteTask,
  onAddReward,
  onDeleteReward,
  onSwitchChild,
  emotionLogs
}) {
  const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'tasks', 'rewards', 'report'
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [showNewRewardModal, setShowNewRewardModal] = useState(false);

  // New task form state
  const [taskForm, setTaskForm] = useState({
    title: '',
    time: '09:00',
    durationMin: 10,
    stars: 10,
    category: 'Geral',
    sensoryLevel: 'baixo',
    sensoryTip: ''
  });

  // New reward form state
  const [rewardForm, setRewardForm] = useState({
    title: '',
    cost: 30,
    description: '',
    icon: 'Gift'
  });

  const pendingTasks = tasks.filter((t) => t.status === 'completed_pending_approval');

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!taskForm.title.trim()) return;

    onAddTask({
      ...taskForm,
      id: 'task-' + Date.now(),
      childId: activeChild.id,
      status: 'todo',
      durationMin: Number(taskForm.durationMin),
      stars: Number(taskForm.stars),
      icon: 'Sparkles'
    });

    setTaskForm({
      title: '',
      time: '09:00',
      durationMin: 10,
      stars: 10,
      category: 'Geral',
      sensoryLevel: 'baixo',
      sensoryTip: ''
    });
    setShowNewTaskModal(false);
    sensoryAudio.playPop();
  };

  const handleCreateReward = (e) => {
    e.preventDefault();
    if (!rewardForm.title.trim()) return;

    onAddReward({
      ...rewardForm,
      id: 'rew-' + Date.now(),
      cost: Number(rewardForm.cost)
    });

    setRewardForm({
      title: '',
      cost: 30,
      description: '',
      icon: 'Gift'
    });
    setShowNewRewardModal(false);
    sensoryAudio.playPop();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Child Profile Info */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-sky-100 flex items-center justify-center text-3xl shadow-inner">
            {activeChild.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-slate-800">{activeChild.name}</h3>
              <span className="text-xs font-extrabold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                {activeChild.diagnosis}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Sensibilidades: {activeChild.sensitivities?.join(' • ') || 'Nenhuma registrada'}
            </p>
          </div>
        </div>

        {/* Switch child selector */}
        {children.length > 1 && (
          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-slate-400 pl-2">Filho:</span>
            {children.map((c) => (
              <button
                key={c.id}
                onClick={() => onSwitchChild(c.id)}
                className={`py-1.5 px-3 rounded-xl text-xs font-black transition ${
                  c.id === activeChild.id
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c.avatar} {c.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('pending')}
          className={`py-2.5 px-4 rounded-2xl font-black text-xs transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'pending'
              ? 'bg-sky-600 text-white shadow-md shadow-sky-200'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <CheckCircle2 size={16} />
          Aprovar Tarefas ({pendingTasks.length})
        </button>

        <button
          onClick={() => setActiveTab('tasks')}
          className={`py-2.5 px-4 rounded-2xl font-black text-xs transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'tasks'
              ? 'bg-sky-600 text-white shadow-md shadow-sky-200'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Clock size={16} />
          Todas as Tarefas ({tasks.length})
        </button>

        <button
          onClick={() => setActiveTab('rewards')}
          className={`py-2.5 px-4 rounded-2xl font-black text-xs transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'rewards'
              ? 'bg-sky-600 text-white shadow-md shadow-sky-200'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Award size={16} />
          Loja de Prêmios ({rewards.length})
        </button>

        <button
          onClick={() => setActiveTab('report')}
          className={`py-2.5 px-4 rounded-2xl font-black text-xs transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'report'
              ? 'bg-sky-600 text-white shadow-md shadow-sky-200'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <BarChart3 size={16} />
          Relatório Feira de Ciências
        </button>
      </div>

      {/* Tab: Pending Approval Queue */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-slate-800 text-sm">
              Tarefas Concluídas Aguardando Aprovação
            </h4>
            <span className="text-xs text-slate-400">
              Aprovar gera estrelas e reforço positivo imediato
            </span>
          </div>

          {pendingTasks.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-100">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center text-3xl mb-3">
                ✨
              </div>
              <h5 className="font-black text-slate-800 text-base">Tudo em dia!</h5>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Nenhuma tarefa pendente de aprovação no momento. Quando {activeChild.name} concluir uma tarefa, ela aparecerá aqui!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {pendingTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white rounded-3xl p-5 border-2 border-amber-300 shadow-md shadow-amber-50 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-xl font-black">
                      ⭐
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                          {task.time}
                        </span>
                        <h4 className="font-extrabold text-slate-800 text-base">{task.title}</h4>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {activeChild.name} marcou esta tarefa como concluída!
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onApproveTask(task.id)}
                    className="py-3 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-200 transition"
                  >
                    <Check size={18} /> Aprovar +{task.stars} ⭐
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: All Tasks */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-extrabold text-slate-800 text-sm">Quadro de Rotina Diária</h4>
              <p className="text-xs text-slate-400">
                Tarefas com estímulos adaptados e tempo visual estimado
              </p>
            </div>
            <button
              onClick={() => setShowNewTaskModal(true)}
              className="py-2.5 px-4 rounded-2xl bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-black text-xs flex items-center gap-1.5 shadow-md shadow-sky-200 transition"
            >
              <Plus size={16} /> Cadastrar Nova Tarefa
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-start justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-black text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-full">
                      {task.time} ({task.durationMin} min)
                    </span>
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        task.sensoryLevel === 'baixo'
                          ? 'bg-emerald-50 text-emerald-700'
                          : task.sensoryLevel === 'medio'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      Estímulo {task.sensoryLevel}
                    </span>
                  </div>

                  <h5 className="font-extrabold text-slate-800 text-base">{task.title}</h5>
                  {task.sensoryTip && (
                    <p className="text-xs text-slate-500 mt-1 italic">
                      💡 Dica sensorial: {task.sensoryTip}
                    </p>
                  )}
                  <span className="inline-block mt-2 text-xs font-black text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full">
                    Vale +{task.stars} ⭐
                  </span>
                </div>

                <button
                  onClick={() => onDeleteTask(task.id)}
                  className="p-2 text-slate-300 hover:text-rose-500 rounded-xl hover:bg-rose-50 transition"
                  title="Excluir tarefa"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Rewards */}
      {activeTab === 'rewards' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-extrabold text-slate-800 text-sm">Prêmios & Recompensas</h4>
              <p className="text-xs text-slate-400">
                Estímulos motivacionais combinados com a criança
              </p>
            </div>
            <button
              onClick={() => setShowNewRewardModal(true)}
              className="py-2.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-black text-xs flex items-center gap-1.5 shadow-md shadow-amber-200 transition"
            >
              <Plus size={16} /> Criar Novo Prêmio
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {rewards.map((r) => (
              <div
                key={r.id}
                className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-start justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-black text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <Star size={12} className="fill-current" /> {r.cost} estrelas
                    </span>
                  </div>
                  <h5 className="font-extrabold text-slate-800 text-base">{r.title}</h5>
                  <p className="text-xs text-slate-500 mt-1">{r.description}</p>
                </div>

                <button
                  onClick={() => onDeleteReward(r.id)}
                  className="p-2 text-slate-300 hover:text-rose-500 rounded-xl hover:bg-rose-50 transition"
                  title="Excluir prêmio"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Scientific Weekly Report */}
      {activeTab === 'report' && (
        <WeeklyReport child={activeChild} emotionLogs={emotionLogs} />
      )}

      {/* Modal: New Task */}
      {showNewTaskModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-sky-100">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-black text-slate-800 text-lg">Nova Tarefa Sensorial</h4>
              <button
                onClick={() => setShowNewTaskModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Nome da Tarefa (Objetivo simples)
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Organizar o material escolar"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Horário da rotina
                  </label>
                  <input
                    type="time"
                    value={taskForm.time}
                    onChange={(e) => setTaskForm({ ...taskForm, time: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Timer Visual (Minutos)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={taskForm.durationMin}
                    onChange={(e) => setTaskForm({ ...taskForm, durationMin: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Valor em Estrelas ⭐
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={taskForm.stars}
                    onChange={(e) => setTaskForm({ ...taskForm, stars: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Nível de Estímulo
                  </label>
                  <select
                    value={taskForm.sensoryLevel}
                    onChange={(e) => setTaskForm({ ...taskForm, sensoryLevel: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:border-sky-500"
                  >
                    <option value="baixo">Baixo (Tranquilo)</option>
                    <option value="medio">Médio (Atenção)</option>
                    <option value="alto">Alto (Exigente)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Dica de Adaptação Sensorial (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Fone abafador de ruídos se tiver barulho"
                  value={taskForm.sensoryTip}
                  onChange={(e) => setTaskForm({ ...taskForm, sensoryTip: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-black text-sm shadow-lg shadow-sky-200 transition"
                >
                  Salvar Tarefa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Reward */}
      {showNewRewardModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-amber-100">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-black text-slate-800 text-lg">Criar Novo Prêmio</h4>
              <button
                onClick={() => setShowNewRewardModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateReward} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Nome do Prêmio
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: 30 minutos de videogame"
                  value={rewardForm.title}
                  onChange={(e) => setRewardForm({ ...rewardForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Custo em Estrelas ⭐
                </label>
                <input
                  type="number"
                  min="5"
                  max="500"
                  required
                  value={rewardForm.cost}
                  onChange={(e) => setRewardForm({ ...rewardForm, cost: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Descrição ou Condição
                </label>
                <textarea
                  rows="2"
                  placeholder="Ex: Pode escolher o jogo favorito com o irmão no final de semana"
                  value={rewardForm.description}
                  onChange={(e) => setRewardForm({ ...rewardForm, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:border-amber-500"
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm shadow-lg shadow-amber-200 transition"
                >
                  Salvar Prêmio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
