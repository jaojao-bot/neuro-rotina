import React, { useState, useEffect } from 'react';
import { Wind, Sparkles, X, Volume2, Smile } from 'lucide-react';
import { sensoryAudio } from '../utils/audio';

export default function CalmCorner({ onClose }) {
  const [breathePhase, setBreathePhase] = useState('Inspirar');
  const [phaseSeconds, setPhaseSeconds] = useState(4);
  const [bubbles, setBubbles] = useState([
    { id: 1, popped: false, color: 'bg-sky-200' },
    { id: 2, popped: false, color: 'bg-emerald-200' },
    { id: 3, popped: false, color: 'bg-amber-200' },
    { id: 4, popped: false, color: 'bg-purple-200' },
    { id: 5, popped: false, color: 'bg-rose-200' },
    { id: 6, popped: false, color: 'bg-teal-200' },
  ]);

  useEffect(() => {
    sensoryAudio.playCalmBell();
    // 4-4-4 breathing cycle (Square breathing for anxiety reduction)
    const phases = ['Inspirar', 'Segurar o ar', 'Expirar suavemente'];
    let currentIdx = 0;

    const timer = setInterval(() => {
      currentIdx = (currentIdx + 1) % phases.length;
      setBreathePhase(phases[currentIdx]);
      sensoryAudio.playCalmBell();
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const popBubble = (id) => {
    sensoryAudio.playPop();
    setBubbles((prev) =>
      prev.map((b) => (b.id === id ? { ...b, popped: true } : b))
    );
  };

  const resetBubbles = () => {
    sensoryAudio.playSparkle();
    setBubbles((prev) => prev.map((b) => ({ ...b, popped: false })));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-sky-50 to-teal-50 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-sky-100 flex flex-col items-center relative animate-fade-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full bg-white/80 hover:bg-white shadow transition"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-2 text-sky-600 font-extrabold text-sm mb-4 bg-sky-100/80 px-4 py-1.5 rounded-full">
          <Wind size={18} />
          <span>Cantinho da Calma & Descompressão</span>
        </div>

        <h3 className="text-xl font-black text-slate-800 text-center mb-1">
          Respire com a Bolha Mágica
        </h3>
        <p className="text-xs text-slate-500 text-center mb-6 max-w-xs">
          Acalme o corpo e os pensamentos. Siga o movimento da respiração.
        </p>

        {/* Breathing guide circle */}
        <div className="relative w-48 h-48 flex items-center justify-center my-4">
          <div className="absolute inset-0 rounded-full bg-sky-300/30 animate-breathe filter blur-md"></div>
          <div className="relative w-36 h-36 rounded-full bg-gradient-to-tr from-sky-400 to-teal-300 shadow-xl flex flex-col items-center justify-center text-white transition-all duration-1000 transform animate-breathe">
            <span className="text-lg font-black tracking-wide text-center px-2">
              {breathePhase}
            </span>
            <span className="text-[11px] font-bold opacity-80 mt-1">4 segundos</span>
          </div>
        </div>

        {/* Sensory pop fidget bubbles */}
        <div className="w-full mt-4 bg-white/70 rounded-2xl p-4 border border-sky-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
              <Sparkles size={14} className="text-amber-500" />
              Estalar bolinhas sensoriais (Fidget):
            </span>
            <button
              onClick={resetBubbles}
              className="text-[11px] font-bold text-sky-600 hover:underline"
            >
              Recarregar bolhas
            </button>
          </div>

          <div className="grid grid-cols-6 gap-2">
            {bubbles.map((b) => (
              <button
                key={b.id}
                onClick={() => !b.popped && popBubble(b.id)}
                className={`h-11 rounded-2xl transition-all duration-300 transform active:scale-90 flex items-center justify-center ${
                  b.popped
                    ? 'bg-slate-200 opacity-40 scale-95 shadow-inner'
                    : `${b.color} shadow-md hover:scale-105 active:scale-95`
                }`}
              >
                {!b.popped && (
                  <div className="w-3 h-3 rounded-full bg-white/60"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-3.5 px-6 rounded-2xl bg-teal-500 hover:bg-teal-600 active:scale-95 text-white font-black text-sm shadow-lg shadow-teal-200 transition flex items-center justify-center gap-2"
        >
          <Smile size={18} />
          Estou me sentindo melhor, voltar à rotina
        </button>
      </div>
    </div>
  );
}
