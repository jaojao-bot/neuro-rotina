import React, { useState } from 'react';
import { 
  Check, Sparkles, Wind, Star, Clock, Trophy, Heart, 
  HelpCircle, CheckCircle2, ChevronRight, BookOpen, Bath, Backpack, Boxes 
} from 'lucide-react';
import VisualTimer from './VisualTimer';
import CalmCorner from './CalmCorner';
import EmotionCheckin from './EmotionCheckin';
import RewardStore from './RewardStore';
import { sensoryAudio } from '../utils/audio';

const PECS_ICONS = {
  Sparkles: '✨',
  Backpack: '🎒',
  BookOpen: '📖',
  Boxes: '🧸',
  Bath: '🛁',
  default: '⭐'
};

export default function KidsArea({
  child,
  tasks = [],
  rewards = [],
  onCompleteTask,
  onClaimReward,
  onSelectEmotion
}) {
  const safeChild = child || { name: 'Campeão', avatar: '🦁', stars: 0 };
  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const safeRewards = Array.isArray(rewards) ? rewards : [];

  const [activeTab, setActiveTab] = useState('tasks'); // 'tasks' or 'store'
  const [selectedTaskId, setSelectedTaskId] = useState(() => {
    const initial = safeTasks.find((t) => t && t.status === 'todo') || safeTasks[0];
    return initial ? initial.id : null;
  });

  // Keep selectedTask derived so updates to title or stars reflect immediately
  const selectedTask =
    safeTasks.find((t) => t && t.id === selectedTaskId) ||
    safeTasks.find((t) => t && t.status === 'todo') ||
    safeTasks[0] ||
    null;

  const [showCalmCorner, setShowCalmCorner] = useState(false);

  const handleFinishTask = (task) => {
    sensoryAudio.playChime();
    onCompleteTask(task.id);
  };

  const completedCount = safeTasks.filter((t) => t && t.status === 'approved').length;
  const pendingCount = safeTasks.filter((t) => t && t.status === 'completed_pending_approval').length;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Calm Corner Modal if opened */}
      {showCalmCorner && (
        <CalmCorner onClose={() => setShowCalmCorner(false)} />
      )}

      {/* Child Header Card */}
      <div className="bg-gradient-to-r from-sky-400 via-teal-400 to-emerald-400 rounded-3xl p-5 text-white shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner animate-pulse-gentle">
            {safeChild.avatar}
          </div>
          <div>
            <span className="text-xs font-black uppercase tracking-wider opacity-90">
              Olá, campeão!
            </span>
            <h2 className="text-2xl font-black">{safeChild.name}</h2>
          </div>
        </div>

        {/* Stars counter */}
        <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl py-2 px-4 flex items-center gap-2 shadow">
          <Star size={24} className="fill-amber-300 text-amber-300 animate-spin-slow" />
          <div>
            <span className="text-xs font-bold block opacity-80 leading-none">Estrelas</span>
            <span className="text-xl font-black">{safeChild.stars}</span>
          </div>
        </div>
      </div>

      {/* Floating Action: Cantinho da Calma button */}
      <button
        onClick={() => {
          sensoryAudio.playCalmBell();
          setShowCalmCorner(true);
        }}
        className="w-full py-3 px-5 rounded-2xl bg-teal-50 border-2 border-teal-300 hover:bg-teal-100 text-teal-800 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition active:scale-95"
      >
        <Wind size={18} className="text-teal-600 animate-pulse" />
        <span>Precisa de uma pausa? Toque para ir ao Cantinho da Calma</span>
      </button>

      {/* Emotion check-in bar */}
      <EmotionCheckin onSelectEmotion={onSelectEmotion} />

      {/* Navigation Tabs (Minhas Tarefas / Loja de Prêmios) */}
      <div className="grid grid-cols-2 gap-2 bg-slate-200/70 p-1.5 rounded-2xl">
        <button
          onClick={() => {
            sensoryAudio.playPop();
            setActiveTab('tasks');
          }}
          className={`py-3 rounded-xl font-black text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 ${
            activeTab === 'tasks'
              ? 'bg-white text-sky-600 shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Clock size={16} /> Tarefas de Hoje ({safeTasks.length})
        </button>

        <button
          onClick={() => {
            sensoryAudio.playPop();
            setActiveTab('store');
          }}
          className={`py-3 rounded-xl font-black text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 ${
            activeTab === 'store'
              ? 'bg-white text-amber-600 shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Trophy size={16} /> Prêmios ({safeChild.stars} ⭐)
        </button>
      </div>

      {/* Tab: Tasks */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          {safeTasks.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-slate-100 shadow-sm animate-fade-in">
              <div className="w-16 h-16 rounded-3xl bg-sky-100 text-sky-600 mx-auto flex items-center justify-center text-3xl mb-3 shadow-inner">
                🎈
              </div>
              <h4 className="font-black text-slate-800 text-base">Tudo limpo por aqui!</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                Nenhuma rotina para hoje no momento. Os pais podem adicionar novas atividades pela Área dos Pais.
              </p>
            </div>
          ) : (
            <>
              {/* Spotlight Active Task & Visual Timer */}
              {selectedTask && (
            <div className="space-y-4">
              <VisualTimer
                durationMinutes={selectedTask.durationMin || 10}
                taskTitle={selectedTask.title}
                onComplete={() => {}}
              />

              {/* Complete Task Button */}
              {selectedTask.status === 'todo' && (
                <button
                  onClick={() => handleFinishTask(selectedTask)}
                  className="w-full py-5 px-6 rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 active:scale-95 text-white font-black text-base shadow-xl shadow-emerald-200 flex items-center justify-center gap-3 transition transform"
                >
                  <Check size={26} strokeWidth={3} />
                  <span>Terminei esta tarefa! 🎉</span>
                </button>
              )}

              {selectedTask.status === 'completed_pending_approval' && (
                <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-4 text-center text-amber-800 font-extrabold text-sm flex items-center justify-center gap-2">
                  <span className="text-xl">⏳</span>
                  <span>Muito bem! Aguardando o Papai ou a Mamãe aprovar!</span>
                </div>
              )}

              {selectedTask.status === 'approved' && (
                <div className="bg-emerald-50 border-2 border-emerald-400 rounded-3xl p-4 text-center text-emerald-800 font-extrabold text-sm flex items-center justify-center gap-2">
                  <CheckCircle2 size={20} className="text-emerald-600" />
                  <span>Tarefa aprovada! Você ganhou +{selectedTask.stars} estrelas! ⭐</span>
                </div>
              )}
            </div>
          )}

          {/* PECS Task Cards List */}
          <div className="space-y-2 pt-2">
            <h4 className="font-black text-slate-700 text-sm px-1">
              Quadro de Rotina (Toque para selecionar):
            </h4>

            <div className="grid grid-cols-1 gap-2.5">
              {safeTasks.map((task, index) => {
                const isSelected = selectedTask?.id === task.id;
                const isApproved = task.status === 'approved';
                const isPending = task.status === 'completed_pending_approval';

                return (
                  <button
                    key={task.id}
                    onClick={() => {
                      sensoryAudio.playPop();
                      setSelectedTaskId(task.id);
                    }}
                    className={`w-full p-4 rounded-3xl text-left border-2 transition-all flex items-center justify-between gap-3 active:scale-98 ${
                      isSelected
                        ? 'border-sky-500 bg-sky-50/80 shadow-md'
                        : isApproved
                        ? 'border-emerald-200 bg-emerald-50/40 opacity-70'
                        : isPending
                        ? 'border-amber-200 bg-amber-50/50'
                        : 'border-slate-100 bg-white hover:border-slate-200 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      {/* Visual Icon (PECS style) */}
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner ${
                          isApproved
                            ? 'bg-emerald-100'
                            : isPending
                            ? 'bg-amber-100'
                            : 'bg-sky-100'
                        }`}
                      >
                        {PECS_ICONS[task.icon] || PECS_ICONS.default}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-black text-slate-400">
                            {task.time}
                          </span>
                          <span className="text-[11px] font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                            +{task.stars} ⭐
                          </span>
                        </div>
                        <h5
                          className={`font-black text-base mt-0.5 ${
                            isApproved ? 'line-through text-slate-400' : 'text-slate-800'
                          }`}
                        >
                          {task.title}
                        </h5>
                      </div>
                    </div>

                    {/* Status badge */}
                    <div>
                      {isApproved && (
                        <span className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow">
                          <Check size={18} strokeWidth={3} />
                        </span>
                      )}
                      {isPending && (
                        <span className="text-xs font-black text-amber-600 bg-amber-100 px-3 py-1 rounded-full">
                          Aguardando
                        </span>
                      )}
                      {!isApproved && !isPending && (
                        <span className="text-xs font-black text-sky-600 bg-sky-100 px-3 py-1 rounded-full flex items-center gap-1">
                          Fazer <ChevronRight size={14} />
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )}

      {/* Tab: Reward Store */}
      {activeTab === 'store' && (
        <RewardStore
          rewards={safeRewards}
          userStars={safeChild.stars}
          onClaimReward={onClaimReward}
          childName={safeChild.name}
        />
      )}
    </div>
  );
}
