import React, { useState } from 'react';
import { 
  Plus, Check, X, ShieldAlert, Star, Clock, Sparkles, UserPlus, 
  Trash2, Award, BarChart3, Settings, CheckCircle2, AlertCircle, Heart,
  Pencil, Database
} from 'lucide-react';
import WeeklyReport from './WeeklyReport';
import { sensoryAudio } from '../utils/audio';

export default function ParentsArea({
  children = [],
  activeChild,
  tasks = [],
  rewards = [],
  onApproveTask,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onAddReward,
  onDeleteReward,
  onSwitchChild,
  onAddChild,
  onAddChildSensitivity,
  onDeleteChildSensitivity,
  onUpdateChildName,
  onDeleteChild,
  emotionLogs = []
}) {
  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const safeChildren = Array.isArray(children) ? children : [];
  const safeChild = activeChild || safeChildren[0] || { id: 'child-1', name: 'Criança', avatar: '🦁', sensitivities: [] };
  const childSensitivities = Array.isArray(safeChild.sensitivities) ? safeChild.sensitivities : [];
  const safeRewards = Array.isArray(rewards) ? rewards : [];

  const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'tasks', 'rewards', 'report'
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [showNewRewardModal, setShowNewRewardModal] = useState(false);
  const [childFormMode, setChildFormMode] = useState(null);
  const [childNameInput, setChildNameInput] = useState('');
  const [childNameError, setChildNameError] = useState(false);
  const [childAgeInput, setChildAgeInput] = useState('');
  const [childAgeError, setChildAgeError] = useState(false);
  const [childDiagnosisInput, setChildDiagnosisInput] = useState('');
  const [showDeleteChildConfirm, setShowDeleteChildConfirm] = useState(false);
  const [showSensitivityForm, setShowSensitivityForm] = useState(false);
  const [sensitivityInput, setSensitivityInput] = useState('');
  const [sensitivityError, setSensitivityError] = useState('');

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

  // Edit task form state
  const [editTaskForm, setEditTaskForm] = useState({
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

  const pendingTasks = safeTasks.filter((t) => t && t.status === 'completed_pending_approval');

  const handleSaveChildName = (e) => {
    e.preventDefault();
    const name = childNameInput.trim();
    if (!name) {
      setChildNameError(true);
      return;
    }

    if (childFormMode === 'add') {
      const age = childAgeInput.trim() ? Number(childAgeInput) : null;
      if (age !== null && (!Number.isInteger(age) || age < 1)) {
        setChildAgeError(true);
        return;
      }

      onAddChild({
        name,
        age,
        diagnosis: childDiagnosisInput.trim()
      });
    } else if (childFormMode === 'edit') {
      onUpdateChildName(safeChild.id, name);
    }

    setChildFormMode(null);
    setChildNameInput('');
    setChildNameError(false);
    setChildAgeInput('');
    setChildAgeError(false);
    setChildDiagnosisInput('');
  };

  const handleAddSensitivity = (e) => {
    e.preventDefault();
    const sensitivity = sensitivityInput.trim();
    if (!sensitivity) {
      setSensitivityError('Digite uma sensibilidade para continuar.');
      return;
    }

    const duplicate = childSensitivities.some(
      (existing) =>
        typeof existing === 'string' &&
        existing.toLocaleLowerCase() === sensitivity.toLocaleLowerCase()
    );
    if (duplicate) {
      setSensitivityError('Essa sensibilidade já está registrada.');
      return;
    }

    onAddChildSensitivity(safeChild.id, sensitivity);
    setSensitivityInput('');
    setSensitivityError('');
    setShowSensitivityForm(false);
    sensoryAudio.playPop();
  };

  const handleRemoveSensitivity = (sensitivity) => {
    onDeleteChildSensitivity(safeChild.id, sensitivity);
    sensoryAudio.playPop();
  };

  const handleConfirmDeleteChild = () => {
    if (safeChildren.length <= 1) return;
    onDeleteChild(safeChild.id);
    setShowDeleteChildConfirm(false);
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!taskForm.title.trim()) return;

    onAddTask({
      ...taskForm,
      id: 'task-' + Date.now(),
      childId: safeChild.id,
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

  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setEditTaskForm({
      title: task.title || '',
      time: task.time || '09:00',
      durationMin: task.durationMin || 10,
      stars: task.stars || 10,
      category: task.category || 'Geral',
      sensoryLevel: task.sensoryLevel || 'baixo',
      sensoryTip: task.sensoryTip || ''
    });
    setShowEditTaskModal(true);
    sensoryAudio.playPop();
  };

  const handleSaveEditTask = (e) => {
    e.preventDefault();
    if (!editTaskForm.title.trim()) return;
    if (!editingTask) return;

    onUpdateTask(editingTask.id, {
      ...editTaskForm,
      stars: Math.max(1, Number(editTaskForm.stars)),
      durationMin: Math.max(1, Number(editTaskForm.durationMin))
    });

    setShowEditTaskModal(false);
    setEditingTask(null);
  };

  const handleConfirmDelete = () => {
    if (taskToDelete) {
      onDeleteTask(taskToDelete.id);
      setTaskToDelete(null);
    }
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
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-14 h-14 shrink-0 rounded-2xl bg-sky-100 flex items-center justify-center text-3xl shadow-inner">
                {safeChild.avatar}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-black text-slate-800">{safeChild.name}</h3>
                  {safeChild.diagnosis && (
                    <span className="text-xs font-extrabold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                      {safeChild.diagnosis}
                    </span>
                  )}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                  <span className="text-xs text-slate-500">Sensibilidades:</span>
                  {childSensitivities.length === 0 && (
                    <span className="text-xs text-slate-500">Nenhuma registrada</span>
                  )}
                  {childSensitivities.map((sensitivity, index) => (
                    <span
                      key={`${sensitivity}-${index}`}
                      className="inline-flex items-center gap-1 rounded-full bg-sky-50 border border-sky-100 px-2 py-0.5 text-xs text-sky-800"
                    >
                      {sensitivity}
                      <button
                        type="button"
                        onClick={() => handleRemoveSensitivity(sensitivity)}
                        aria-label={`Remover sensibilidade ${sensitivity}`}
                        title={`Remover ${sensitivity}`}
                        className="rounded-full text-sky-600 hover:text-rose-600 focus:outline-none focus:ring-2 focus:ring-sky-300"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setSensitivityInput('');
                      setSensitivityError('');
                      setShowSensitivityForm(true);
                    }}
                    className="inline-flex items-center gap-1 rounded-xl border border-sky-200 bg-white px-2 py-1 text-xs font-bold text-sky-700 hover:bg-sky-50 transition"
                  >
                    <Plus size={13} /> Adicionar sensibilidade
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setChildNameInput('');
                  setChildNameError(false);
                  setChildFormMode('add');
                }}
                className="py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-black flex items-center gap-1.5 transition"
              >
                <UserPlus size={15} /> Adicionar criança
              </button>
              <button
                type="button"
                onClick={() => {
                  setChildNameInput(safeChild.name || '');
                  setChildNameError(false);
                  setChildFormMode('edit');
                }}
                className="py-2 px-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-black flex items-center gap-1.5 transition"
              >
                <Pencil size={14} /> Editar nome
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteChildConfirm(true)}
                disabled={safeChildren.length <= 1}
                title={safeChildren.length <= 1 ? 'O último perfil não pode ser excluído' : 'Excluir este perfil'}
                className="py-2 px-3 rounded-xl bg-white border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs font-black flex items-center gap-1.5 transition disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white"
              >
                <Trash2 size={14} /> Excluir perfil
              </button>
            </div>
          </div>

          {/* Switch child selector */}
          {safeChildren.length > 1 && (
            <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-400 pl-2">Perfil:</span>
              {safeChildren.map((c) => (
                <button
                  key={c.id}
                  onClick={() => onSwitchChild(c.id)}
                  className={`py-1.5 px-3 rounded-xl text-xs font-black transition ${
                    c.id === safeChild.id
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
      </div>

      {childFormMode && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-sky-100">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-black text-slate-800 text-lg">
                {childFormMode === 'add' ? 'Adicionar criança' : 'Editar nome'}
              </h4>
              <button
                type="button"
                onClick={() => setChildFormMode(null)}
                aria-label="Fechar formulário"
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveChildName} noValidate className="space-y-4">
              <div>
                <label htmlFor="child-name" className="block text-xs font-bold text-slate-600 mb-1">
                  Nome
                </label>
                <input
                  id="child-name"
                  type="text"
                  required
                  maxLength={40}
                  autoFocus
                  value={childNameInput}
                  onChange={(e) => {
                    setChildNameInput(e.target.value);
                    setChildNameError(false);
                  }}
                  aria-invalid={childNameError}
                  aria-describedby={childNameError ? 'child-name-error' : undefined}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
                {childNameError && (
                  <p id="child-name-error" className="text-xs font-bold text-rose-600 mt-1">
                    Digite um nome para continuar.
                  </p>
                )}
              </div>

              {childFormMode === 'add' && (
                <>
                  <div>
                    <label htmlFor="child-age" className="block text-xs font-bold text-slate-600 mb-1">
                      Idade <span className="font-normal text-slate-400">(opcional)</span>
                    </label>
                    <input
                      id="child-age"
                      type="number"
                      min="1"
                      step="1"
                      value={childAgeInput}
                      onChange={(e) => {
                        setChildAgeInput(e.target.value);
                        setChildAgeError(false);
                      }}
                      aria-invalid={childAgeError}
                      aria-describedby={childAgeError ? 'child-age-error' : undefined}
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    />
                    {childAgeError && (
                      <p id="child-age-error" className="text-xs font-bold text-rose-600 mt-1">
                        Informe uma idade inteira maior que zero.
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="child-diagnosis" className="block text-xs font-bold text-slate-600 mb-1">
                      Diagnóstico <span className="font-normal text-slate-400">(opcional)</span>
                    </label>
                    <input
                      id="child-diagnosis"
                      type="text"
                      maxLength={100}
                      value={childDiagnosisInput}
                      onChange={(e) => setChildDiagnosisInput(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      Esse dado é opcional e fica salvo neste navegador.
                    </p>
                  </div>
                </>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setChildFormMode(null)}
                  className="flex-1 py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-black text-xs transition"
                >
                  {childFormMode === 'add' ? 'Criar perfil' : 'Salvar nome'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showSensitivityForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-sky-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-black text-slate-800 text-lg">Adicionar sensibilidade</h4>
                <p className="text-xs text-slate-500 mt-1">Perfil: {safeChild.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowSensitivityForm(false)}
                aria-label="Fechar formulário de sensibilidade"
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddSensitivity} noValidate className="space-y-4">
              <div>
                <label htmlFor="child-sensitivity" className="block text-xs font-bold text-slate-600 mb-1">
                  Sensibilidade
                </label>
                <input
                  id="child-sensitivity"
                  type="text"
                  maxLength={100}
                  autoFocus
                  value={sensitivityInput}
                  onChange={(e) => {
                    setSensitivityInput(e.target.value);
                    setSensitivityError('');
                  }}
                  aria-invalid={Boolean(sensitivityError)}
                  aria-describedby={sensitivityError ? 'child-sensitivity-error' : undefined}
                  placeholder="Ex: Sons altos"
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
                {sensitivityError && (
                  <p id="child-sensitivity-error" className="text-xs font-bold text-rose-600 mt-1">
                    {sensitivityError}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowSensitivityForm(false)}
                  className="flex-1 py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-black text-xs transition"
                >
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteChildConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-rose-100 text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 mx-auto flex items-center justify-center mb-3">
              <Trash2 size={26} />
            </div>
            <h4 className="font-black text-slate-800 text-base mb-1">Excluir perfil?</h4>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Excluir o perfil de <strong className="text-slate-800">{safeChild.name}</strong> também removerá seu saldo de estrelas e sua sequência.
              {safeTasks.length === 0
                ? ' Não há tarefas vinculadas a remover.'
                : safeTasks.length === 1
                ? ' Também será removida 1 tarefa vinculada.'
                : ` Também serão removidas ${safeTasks.length} tarefas vinculadas.`}{' '}
              Recompensas e histórico de emoções compartilhados serão mantidos.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setShowDeleteChildConfirm(false)}
                className="py-2.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteChild}
                className="py-2.5 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs transition"
              >
                Excluir perfil
              </button>
            </div>
          </div>
        </div>
      )}

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
          Todas as Tarefas ({safeTasks.length})
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
          Loja de Prêmios ({safeRewards.length})
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
                        {safeChild.name} marcou esta tarefa como concluída!
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
            {safeTasks.length === 0 ? (
              <div className="col-span-full bg-white rounded-3xl p-8 text-center border border-slate-100">
                <p className="text-slate-500 font-medium text-sm">
                  Nenhuma rotina cadastrada para esta criança. Clique em "Cadastrar Nova Tarefa" para começar.
                </p>
              </div>
            ) : (
              safeTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-start justify-between gap-3 hover:border-sky-100 transition"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
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

                    <h5 className="font-extrabold text-slate-800 text-base truncate">{task.title}</h5>
                    {task.sensoryTip && (
                      <p className="text-xs text-slate-500 mt-1 italic line-clamp-2">
                        💡 Dica sensorial: {task.sensoryTip}
                      </p>
                    )}
                    <span className="inline-block mt-2 text-xs font-black text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full">
                      Vale +{task.stars} ⭐
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleOpenEditModal(task)}
                      className="p-2 text-slate-400 hover:text-sky-600 rounded-xl hover:bg-sky-50 transition"
                      title="Editar rotina (título e estrelas)"
                    >
                      <Pencil size={17} />
                    </button>
                    <button
                      onClick={() => setTaskToDelete(task)}
                      className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-rose-50 transition"
                      title="Excluir rotina"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cache persistence status banner */}
          <div className="bg-sky-50/70 border border-sky-100 rounded-2xl p-3 flex items-center justify-between text-xs text-sky-800">
            <span className="flex items-center gap-2 font-bold">
              <Database size={15} className="text-sky-600" />
              Rotinas salvas automaticamente no cache do navegador
            </span>
            <span className="text-[10px] font-bold text-sky-600 bg-white/80 px-2 py-0.5 rounded-lg border border-sky-100">
              Offline-ready
            </span>
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
            {safeRewards.map((r) => (
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
        <WeeklyReport child={safeChild} emotionLogs={emotionLogs} />
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
                    max="100"
                    value={taskForm.stars}
                    onChange={(e) => setTaskForm({ ...taskForm, stars: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:border-sky-500"
                  />
                  <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                    {[5, 10, 15, 20].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setTaskForm({ ...taskForm, stars: val })}
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-lg border transition ${
                          Number(taskForm.stars) === val
                            ? 'bg-amber-500 text-white border-amber-500'
                            : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                        }`}
                      >
                        {val}⭐
                      </button>
                    ))}
                  </div>
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

      {/* Modal: Edit Routine (Modify Title & Stars) */}
      {showEditTaskModal && editingTask && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-sky-100 max-h-[92vh] overflow-y-auto animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center shadow-inner">
                  <Pencil size={20} />
                </div>
                <div>
                  <h4 className="font-black text-slate-800 text-lg leading-tight">Editar Rotina</h4>
                  <p className="text-xs text-slate-400">Modifique o título e as estrelas da atividade</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowEditTaskModal(false);
                  setEditingTask(null);
                }}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEditTask} className="space-y-4">
              {/* Título da Rotina */}
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  Título da Rotina <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Escovar os dentes"
                  value={editTaskForm.title}
                  onChange={(e) => setEditTaskForm({ ...editTaskForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition"
                />
              </div>

              {/* Quantas Estrelas cada rotina pode dar ao ser finalizada com sucesso */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-black text-amber-900 flex items-center gap-1.5">
                    <Star size={16} className="text-amber-500 fill-amber-400" />
                    Estrelas ao concluir com sucesso
                  </label>
                  <span className="text-xs font-black bg-amber-400 text-slate-900 px-2.5 py-0.5 rounded-full shadow-sm">
                    +{editTaskForm.stars} ⭐
                  </span>
                </div>

                <input
                  type="number"
                  min="1"
                  max="100"
                  required
                  value={editTaskForm.stars}
                  onChange={(e) => setEditTaskForm({ ...editTaskForm, stars: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-amber-300 text-sm font-black text-amber-950 focus:outline-none focus:border-amber-500 bg-white"
                />

                {/* Star shortcut chips */}
                <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                  <span className="text-[10px] font-bold text-amber-800">Atalhos rápidos:</span>
                  {[5, 10, 15, 20, 25, 30].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setEditTaskForm({ ...editTaskForm, stars: val })}
                      className={`text-[11px] font-black px-2.5 py-1 rounded-xl transition ${
                        Number(editTaskForm.stars) === val
                          ? 'bg-amber-500 text-white shadow'
                          : 'bg-white text-amber-800 border border-amber-200 hover:bg-amber-100'
                      }`}
                    >
                      {val} ⭐
                    </button>
                  ))}
                </div>
              </div>

              {/* Horário & Duração */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Horário previsto
                  </label>
                  <input
                    type="time"
                    value={editTaskForm.time}
                    onChange={(e) => setEditTaskForm({ ...editTaskForm, time: e.target.value })}
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
                    max="120"
                    value={editTaskForm.durationMin}
                    onChange={(e) => setEditTaskForm({ ...editTaskForm, durationMin: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              {/* Nível de Estímulo & Categoria */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Nível de Estímulo
                  </label>
                  <select
                    value={editTaskForm.sensoryLevel}
                    onChange={(e) => setEditTaskForm({ ...editTaskForm, sensoryLevel: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:border-sky-500 bg-white"
                  >
                    <option value="baixo">Baixo (Tranquilo)</option>
                    <option value="medio">Médio (Atenção)</option>
                    <option value="alto">Alto (Exigente)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Categoria
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Higiene, Escola"
                    value={editTaskForm.category}
                    onChange={(e) => setEditTaskForm({ ...editTaskForm, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              {/* Dica Sensorial */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Dica de Adaptação Sensorial (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Avisar com 5 min de antecedência"
                  value={editTaskForm.sensoryTip}
                  onChange={(e) => setEditTaskForm({ ...editTaskForm, sensoryTip: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:border-sky-500"
                />
              </div>

              {/* Botões de Ação */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditTaskModal(false);
                    setEditingTask(null);
                  }}
                  className="w-1/3 py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-3 px-5 rounded-2xl bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-sky-200 transition flex items-center justify-center gap-2"
                >
                  <Check size={18} /> Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Delete Confirmation */}
      {taskToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-rose-100 text-center animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 mx-auto flex items-center justify-center mb-3">
              <Trash2 size={26} />
            </div>

            <h4 className="font-black text-slate-800 text-base mb-1">
              Excluir Rotina?
            </h4>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Deseja realmente remover a rotina <strong className="text-slate-800">"{taskToDelete.title}"</strong>? Ela deixará de aparecer no painel da criança.
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTaskToDelete(null)}
                className="py-2.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="py-2.5 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-rose-200 transition active:scale-95"
              >
                Sim, Excluir
              </button>
            </div>
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
