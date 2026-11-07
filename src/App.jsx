import React, { useState, useEffect } from 'react';
import { 
  Users, UserCheck, ShieldCheck, Download, Sparkles, Star, 
  RotateCcw, Lock, Unlock, X, ChevronDown, Check, Smartphone, Flame 
} from 'lucide-react';
import KidsArea from './components/KidsArea';
import ParentsArea from './components/ParentsArea';
import InstallPromptModal from './components/InstallPromptModal';
import { 
  INITIAL_CHILDREN, INITIAL_TASKS, INITIAL_REWARDS, INITIAL_EMOTION_LOGS,
  STORAGE_KEYS, loadData, saveData 
} from './utils/storage';
import { sensoryAudio } from './utils/audio';

export default function App() {
  const [currentMode, setCurrentMode] = useState('kids'); // 'kids' or 'parents'
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);

  // Core App State persisted in localStorage
  const [childrenList, setChildrenList] = useState(() => 
    loadData(STORAGE_KEYS.CHILDREN, INITIAL_CHILDREN)
  );
  const [activeChildId, setActiveChildId] = useState(() => 
    loadData(STORAGE_KEYS.ACTIVE_CHILD_ID, INITIAL_CHILDREN[0].id)
  );
  const [tasksList, setTasksList] = useState(() => 
    loadData(STORAGE_KEYS.TASKS, INITIAL_TASKS)
  );
  const [rewardsList, setRewardsList] = useState(() => 
    loadData(STORAGE_KEYS.REWARDS, INITIAL_REWARDS)
  );
  const [emotionLogs, setEmotionLogs] = useState(() => 
    loadData(STORAGE_KEYS.EMOTION_LOGS, INITIAL_EMOTION_LOGS)
  );

  // Sync state to LocalStorage
  useEffect(() => {
    saveData(STORAGE_KEYS.CHILDREN, childrenList);
  }, [childrenList]);

  useEffect(() => {
    saveData(STORAGE_KEYS.ACTIVE_CHILD_ID, activeChildId);
  }, [activeChildId]);

  useEffect(() => {
    saveData(STORAGE_KEYS.TASKS, tasksList);
  }, [tasksList]);

  useEffect(() => {
    saveData(STORAGE_KEYS.REWARDS, rewardsList);
  }, [rewardsList]);

  useEffect(() => {
    saveData(STORAGE_KEYS.EMOTION_LOGS, emotionLogs);
  }, [emotionLogs]);

  const safeChildren = Array.isArray(childrenList) && childrenList.length > 0
    ? childrenList
    : INITIAL_CHILDREN;
  const activeChild = safeChildren.find((c) => c && c.id === activeChildId) || safeChildren[0] || INITIAL_CHILDREN[0];

  const safeTasks = Array.isArray(tasksList) ? tasksList : INITIAL_TASKS;
  const activeChildTasks = safeTasks.filter((t) => t && t.childId === activeChild.id);
  const safeRewards = Array.isArray(rewardsList) ? rewardsList : INITIAL_REWARDS;
  const safeEmotionLogs = Array.isArray(emotionLogs) ? emotionLogs : INITIAL_EMOTION_LOGS;

  // Handlers
  const handleModeSwitch = (targetMode) => {
    sensoryAudio.playPop();
    if (targetMode === 'parents') {
      setShowPinModal(true);
    } else {
      setCurrentMode('kids');
    }
  };

  const verifyPin = (e) => {
    e.preventDefault();
    if (pinInput === '1234') {
      sensoryAudio.playSparkle();
      setCurrentMode('parents');
      setShowPinModal(false);
      setPinInput('');
      setPinError(false);
    } else {
      sensoryAudio.playPop();
      setPinError(true);
      setPinInput('');
    }
  };

  // Child completes a task (marks as pending approval)
  const handleCompleteTask = (taskId) => {
    setTasksList((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, status: 'completed_pending_approval' } : t
      )
    );
  };

  // Parent approves task (releases stars)
  const handleApproveTask = (taskId) => {
    const task = tasksList.find((t) => t.id === taskId);
    if (!task) return;

    sensoryAudio.playChime();

    // Mark task as approved
    setTasksList((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: 'approved' } : t))
    );

    // Add stars to active child
    setChildrenList((prev) =>
      prev.map((c) =>
        c.id === task.childId
          ? {
              ...c,
              stars: c.stars + task.stars,
              streakDays: c.streakDays + 1
            }
          : c
      )
    );
  };

  // Child redeems reward
  const handleClaimReward = (reward) => {
    setChildrenList((prev) =>
      prev.map((c) =>
        c.id === activeChildId
          ? { ...c, stars: Math.max(0, c.stars - reward.cost) }
          : c
      )
    );
  };

  // Child selects emotion
  const handleSelectEmotion = (emo) => {
    const newEntry = {
      date: new Date().toISOString().split('T')[0],
      emotion: emo.id,
      label: emo.label,
      note: 'Registrado pela criança na rotina diária'
    };
    setEmotionLogs((prev) => [newEntry, ...prev.slice(0, 14)]);
  };

  // Parent adds task
  const handleAddTask = (newTask) => {
    setTasksList((prev) => [newTask, ...prev]);
    sensoryAudio.playPop();
  };

  // Parent updates task (modify title, stars, etc.)
  const handleUpdateTask = (taskId, updatedData) => {
    setTasksList((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, ...updatedData } : t))
    );
    sensoryAudio.playSparkle();
  };

  // Parent deletes task
  const handleDeleteTask = (taskId) => {
    setTasksList((prev) => prev.filter((t) => t.id !== taskId));
    sensoryAudio.playPop();
  };

  // Parent adds reward
  const handleAddReward = (newReward) => {
    setRewardsList((prev) => [newReward, ...prev]);
  };

  // Parent deletes reward
  const handleDeleteReward = (rewardId) => {
    setRewardsList((prev) => prev.filter((r) => r.id !== rewardId));
  };

  // Reset to initial demo data (for science fair booths)
  const handleResetDemoData = () => {
    if (window.confirm('Deseja reiniciar os dados de demonstração da Feira de Ciências?')) {
      sensoryAudio.playSparkle();
      setChildrenList(INITIAL_CHILDREN);
      setActiveChildId(INITIAL_CHILDREN[0].id);
      setTasksList(INITIAL_TASKS);
      setRewardsList(INITIAL_REWARDS);
      setEmotionLogs(INITIAL_EMOTION_LOGS);
      alert('Dados reiniciados com sucesso para a apresentação!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-teal-50/40 to-indigo-50/30 text-slate-800 pb-12">
      {/* Top App Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-sky-100 shadow-sm">
        <div className="max-w-xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo & Science Fair Tag */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-teal-400 text-white flex items-center justify-center text-xl shadow-md shadow-sky-200">
              🦁
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-black text-slate-800 text-base leading-none">
                  NeuroRotina
                </h1>
                <span className="text-[10px] font-extrabold text-white bg-sky-500 px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                  Kids
                </span>
              </div>
              <span className="text-[10px] font-extrabold text-teal-600 block mt-0.5">
                Projeto Feira de Ciências • TEA/TDAH
              </span>
            </div>
          </div>

          {/* Action buttons (Install & Reset) */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowInstallModal(true)}
              className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition"
              title="Baixar / Instalar App"
            >
              <Download size={14} />
              <span className="hidden sm:inline">Baixar App</span>
            </button>

            <button
              onClick={handleResetDemoData}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition"
              title="Reiniciar dados da apresentação"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>

        {/* Dual Mode Switcher Bar (Kids vs Parents) */}
        <div className="max-w-xl mx-auto px-4 pb-3">
          <div className="bg-slate-100 p-1 rounded-2xl grid grid-cols-2 gap-1 border border-slate-200">
            <button
              onClick={() => handleModeSwitch('kids')}
              className={`py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 ${
                currentMode === 'kids'
                  ? 'bg-white text-sky-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>🎈 Modo Criança</span>
            </button>

            <button
              onClick={() => handleModeSwitch('parents')}
              className={`py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 ${
                currentMode === 'parents'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Lock size={13} />
              <span>Área dos Pais (PIN)</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main App Content Container */}
      <main className="max-w-xl mx-auto px-4 pt-5">
        {currentMode === 'kids' ? (
          <KidsArea
            child={activeChild}
            tasks={activeChildTasks}
            rewards={safeRewards}
            onCompleteTask={handleCompleteTask}
            onClaimReward={handleClaimReward}
            onSelectEmotion={handleSelectEmotion}
          />
        ) : (
          <ParentsArea
            children={safeChildren}
            activeChild={activeChild}
            tasks={activeChildTasks}
            rewards={safeRewards}
            onApproveTask={handleApproveTask}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onAddReward={handleAddReward}
            onDeleteReward={handleDeleteReward}
            onSwitchChild={setActiveChildId}
            emotionLogs={safeEmotionLogs}
          />
        )}
      </main>

      {/* Parental PIN Protection Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xs w-full p-6 shadow-2xl border border-sky-100 text-center animate-fade-in relative">
            <button
              onClick={() => setShowPinModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X size={18} />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-600 mx-auto flex items-center justify-center mb-3">
              <Lock size={26} />
            </div>

            <h4 className="font-black text-slate-800 text-base mb-1">
              Controle Parental
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              Digite o PIN dos pais para gerenciar tarefas e aprovar estrelas.
            </p>

            <form onSubmit={verifyPin} className="space-y-3">
              <input
                type="password"
                maxLength="4"
                autoFocus
                placeholder="• • • •"
                value={pinInput}
                onChange={(e) => {
                  setPinError(false);
                  setPinInput(e.target.value);
                }}
                className={`w-full py-3 text-center text-2xl font-black tracking-widest rounded-2xl border-2 focus:outline-none ${
                  pinError
                    ? 'border-rose-400 bg-rose-50 text-rose-600'
                    : 'border-slate-200 focus:border-sky-500'
                }`}
              />

              {pinError && (
                <p className="text-xs font-bold text-rose-500 animate-shake">
                  PIN incorreto! Tente 1234
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-sky-200 transition active:scale-95"
              >
                Entrar na Área dos Pais
              </button>
            </form>

            <p className="text-[11px] font-bold text-slate-400 mt-3">
              💡 Para a apresentação: PIN padrão é <strong className="text-sky-600">1234</strong>
            </p>
          </div>
        </div>
      )}

      {/* PWA / Download Instructions Modal */}
      {showInstallModal && (
        <InstallPromptModal onClose={() => setShowInstallModal(false)} />
      )}
    </div>
  );
}
