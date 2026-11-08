import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, CheckCircle, Volume2 } from 'lucide-react';
import { sensoryAudio } from '../utils/audio';

export default function VisualTimer({ durationMinutes = 10, onComplete, taskTitle }) {
  const parsedDuration = Number(durationMinutes);
  const safeDurationMinutes = Number.isFinite(parsedDuration)
    ? Math.min(120, Math.max(1, Math.round(parsedDuration)))
    : 10;
  const totalSeconds = safeDurationMinutes * 60;
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    setSecondsLeft(totalSeconds);
    setIsRunning(false);
    setIsCompleted(false);
  }, [totalSeconds]);

  useEffect(() => {
    let interval = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsRunning(false);
            setIsCompleted(true);
            sensoryAudio.playChime();
            if (onComplete) onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft, onComplete]);

  const togglePlay = () => {
    sensoryAudio.playPop();
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    sensoryAudio.playPop();
    setIsRunning(false);
    setSecondsLeft(totalSeconds);
    setIsCompleted(false);
  };

  // Fraction left for SVG circle
  const progressFraction = totalSeconds > 0 ? secondsLeft / totalSeconds : 0;
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progressFraction * circumference;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Sensory color transitions: Blue (Calm) -> Soft Orange (Final 20%) -> Green (Done)
  let timerColor = '#0EA5E9'; // Calm Sky
  if (progressFraction <= 0.25) timerColor = '#F59E0B'; // Gentle amber warning
  if (isCompleted) timerColor = '#10B981'; // Finished green

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-sky-100 flex flex-col items-center">
      <div className="flex items-center justify-between w-full mb-3">
        <span className="text-xs uppercase tracking-wider font-extrabold text-sky-600 bg-sky-50 px-3 py-1 rounded-full">
          ⏱️ Timer Visual Sensorial (Time Timer)
        </span>
        <button
          onClick={() => sensoryAudio.playChime()}
          className="p-1.5 text-sky-400 hover:text-sky-600 rounded-full hover:bg-sky-50 transition"
          title="Ouvir som suave"
        >
          <Volume2 size={18} />
        </button>
      </div>

      <p className="text-slate-600 font-bold text-center mb-4 line-clamp-1">
        {taskTitle || 'Tempo para a tarefa'}
      </p>

      {/* Visual countdown disk (critical for ADHD/Autism time blindness) */}
      <div className="relative w-52 h-52 flex items-center justify-center my-2">
        <svg className="w-full h-full transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="104"
            cy="104"
            r={radius}
            stroke="#E2E8F0"
            strokeWidth="18"
            fill="transparent"
          />
          {/* Depleting visual wedge */}
          <circle
            cx="104"
            cy="104"
            r={radius}
            stroke={timerColor}
            strokeWidth="18"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-linear"
          />
        </svg>

        {/* Center label */}
        <div className="absolute flex flex-col items-center">
          {isCompleted ? (
            <div className="flex flex-col items-center text-emerald-600 animate-bounce">
              <CheckCircle size={44} />
              <span className="text-base font-black mt-1">Concluído!</span>
            </div>
          ) : (
            <>
              <span className="text-4xl font-extrabold text-slate-800 tracking-tight">
                {timeFormatted}
              </span>
              <span className="text-xs font-bold text-slate-400 mt-0.5">
                {Math.ceil(secondsLeft / 60)} min restantes
              </span>
            </>
          )}
        </div>
      </div>

      {/* Control buttons */}
      <div className="flex items-center gap-3 mt-4 w-full max-w-xs">
        <button
          onClick={togglePlay}
          className={`flex-1 py-3 px-5 rounded-2xl font-bold flex items-center justify-center gap-2 text-white shadow-lg transition active:scale-95 ${
            isRunning
              ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-200'
              : 'bg-sky-500 hover:bg-sky-600 shadow-sky-200'
          }`}
        >
          {isRunning ? (
            <>
              <Pause size={20} /> Pausar
            </>
          ) : (
            <>
              <Play size={20} /> Iniciar Timer
            </>
          )}
        </button>

        <button
          onClick={resetTimer}
          className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition active:scale-95"
          title="Reiniciar tempo"
        >
          <RotateCcw size={20} />
        </button>
      </div>

      <p className="text-[11px] text-slate-400 text-center mt-3">
        💡 O disco colorido diminui gradualmente, facilitando a noção de tempo sem ansiedade.
      </p>
    </div>
  );
}
