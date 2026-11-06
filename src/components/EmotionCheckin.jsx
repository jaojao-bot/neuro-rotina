import React, { useState } from 'react';
import { Heart, Sparkles, Check } from 'lucide-react';
import { sensoryAudio } from '../utils/audio';

const EMOTIONS = [
  { id: 'feliz', label: 'Muito Feliz', emoji: '😄', color: 'from-amber-400 to-yellow-300', tip: 'Que maravilha! Aproveite essa energia boa!' },
  { id: 'calmo', label: 'Calmo / Bem', emoji: '😌', color: 'from-sky-400 to-teal-300', tip: 'Ótimo momento para fazer as tarefas com foco.' },
  { id: 'cansado', label: 'Cansado', emoji: '🥱', color: 'from-indigo-400 to-blue-300', tip: 'Beba uma água e faça pausas curtas.' },
  { id: 'ansioso', label: 'Inquieto / Agitado', emoji: '⚡', color: 'from-orange-400 to-amber-300', tip: 'Que tal usar o Cantinho da Calma para respirar um pouco?' },
  { id: 'bravo', label: 'Sobrecarregado', emoji: '😤', color: 'from-rose-400 to-red-300', tip: 'Está tudo bem sentir raiva. Vamos pausar um momento.' }
];

export default function EmotionCheckin({ onSelectEmotion, currentEmotion }) {
  const [selected, setSelected] = useState(currentEmotion || 'calmo');
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSelect = (emo) => {
    sensoryAudio.playPop();
    setSelected(emo.id);
    setSavedMessage(true);
    if (onSelectEmotion) {
      onSelectEmotion(emo);
    }
    setTimeout(() => setSavedMessage(false), 3000);
  };

  const currentObj = EMOTIONS.find((e) => e.id === selected) || EMOTIONS[1];

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 shadow-lg border border-sky-100">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Heart size={18} className="text-rose-500 fill-rose-500" />
          <h4 className="font-extrabold text-sm text-slate-800">
            Termômetro de Emoções de Hoje
          </h4>
        </div>
        <span className="text-[11px] font-bold text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-full">
          Auto-regulação
        </span>
      </div>

      <p className="text-xs text-slate-500 mb-3">
        Como você está se sentindo agora? Toque no seu sentimento:
      </p>

      {/* Emotion buttons */}
      <div className="grid grid-cols-5 gap-2">
        {EMOTIONS.map((emo) => {
          const isSelected = selected === emo.id;
          return (
            <button
              key={emo.id}
              onClick={() => handleSelect(emo)}
              className={`flex flex-col items-center justify-center p-2.5 rounded-2xl transition-all duration-200 active:scale-95 border-2 ${
                isSelected
                  ? 'border-sky-500 bg-sky-50 shadow-md scale-105'
                  : 'border-transparent bg-slate-50 hover:bg-slate-100 text-slate-600'
              }`}
            >
              <span className="text-2xl transform hover:scale-110 transition">{emo.emoji}</span>
              <span className="text-[10px] font-bold mt-1 text-center line-clamp-1">
                {emo.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tip for the current emotional state */}
      <div className="mt-3 p-3 rounded-2xl bg-gradient-to-r from-sky-50 to-teal-50 border border-sky-100 flex items-center justify-between">
        <p className="text-xs text-slate-700 font-semibold flex items-center gap-1.5">
          <Sparkles size={14} className="text-sky-500 shrink-0" />
          <span>{currentObj.tip}</span>
        </p>
        {savedMessage && (
          <span className="text-[10px] font-extrabold text-emerald-600 flex items-center gap-1 shrink-0 ml-2 animate-fade-in">
            <Check size={12} /> Salvo!
          </span>
        )}
      </div>
    </div>
  );
}
