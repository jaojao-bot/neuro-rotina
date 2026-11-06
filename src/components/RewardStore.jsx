import React, { useState } from 'react';
import { Star, Gift, Check, Sparkles, Tv, TreePine, Smile, Pizza, Trophy, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sensoryAudio } from '../utils/audio';

const ICON_MAP = {
  Tv: Tv,
  TreePine: TreePine,
  Smile: Smile,
  Pizza: Pizza,
  Gift: Gift
};

export default function RewardStore({ rewards, userStars, onClaimReward, childName }) {
  const [redeemed, setRedeemed] = useState(null);

  // Find the closest reward child can work towards
  const sortedRewards = [...rewards].sort((a, b) => a.cost - b.cost);
  const nextTarget = sortedRewards.find((r) => r.cost > userStars) || sortedRewards[sortedRewards.length - 1];
  const progressPercent = nextTarget ? Math.min(100, Math.round((userStars / nextTarget.cost) * 100)) : 100;

  const handleRedeem = (reward) => {
    if (userStars < reward.cost) {
      sensoryAudio.playPop();
      return;
    }

    sensoryAudio.playSparkle();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#FBBF24', '#38BDF8', '#34D399', '#F472B6']
    });

    setRedeemed(reward);
    if (onClaimReward) {
      onClaimReward(reward);
    }
  };

  return (
    <div className="space-y-4">
      {/* Target Progress Banner */}
      {nextTarget && (
        <div className="bg-gradient-to-r from-amber-500 to-yellow-400 rounded-3xl p-5 text-white shadow-lg shadow-amber-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-black tracking-wider opacity-90 flex items-center gap-1.5">
              <Trophy size={16} /> Próxima Meta Especial
            </span>
            <span className="text-xs font-black bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full">
              {userStars} / {nextTarget.cost} ⭐
            </span>
          </div>

          <h3 className="text-lg font-black">{nextTarget.title}</h3>

          {/* Progress bar */}
          <div className="w-full bg-white/30 h-3.5 rounded-full overflow-hidden mt-3 p-0.5">
            <div
              className="bg-white h-full rounded-full transition-all duration-700 shadow-sm"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <p className="text-[11px] font-bold opacity-90 mt-2 text-right">
            {userStars >= nextTarget.cost
              ? '🎉 Você já tem estrelas suficientes! Pode resgatar!'
              : `Faltam apenas ${nextTarget.cost - userStars} estrelas! Continue firme!`}
          </p>
        </div>
      )}

      {/* Redeemed success banner */}
      {redeemed && (
        <div className="bg-emerald-50 border-2 border-emerald-400 rounded-3xl p-4 flex items-center justify-between animate-fade-in shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-2xl shadow">
              🎉
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-600 uppercase">
                Prêmio Resgatado com Sucesso!
              </p>
              <h4 className="font-extrabold text-slate-800 text-sm">{redeemed.title}</h4>
              <p className="text-[11px] text-slate-500">Mostre para o papai/mamãe!</p>
            </div>
          </div>
          <button
            onClick={() => setRedeemed(null)}
            className="text-xs font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-xl transition"
          >
            Fechar
          </button>
        </div>
      )}

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {rewards.map((reward) => {
          const IconComp = ICON_MAP[reward.icon] || Gift;
          const canAfford = userStars >= reward.cost;

          return (
            <div
              key={reward.id}
              className={`bg-white rounded-3xl p-5 border-2 transition-all flex flex-col justify-between ${
                canAfford
                  ? 'border-amber-300 shadow-lg shadow-amber-50 hover:border-amber-400'
                  : 'border-slate-100 shadow-sm opacity-80'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${
                      canAfford ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    <IconComp size={26} />
                  </div>
                  <span
                    className={`font-black text-sm px-3 py-1 rounded-full flex items-center gap-1 ${
                      canAfford
                        ? 'bg-amber-500 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <Star size={14} className="fill-current" /> {reward.cost}
                  </span>
                </div>

                <h4 className="font-extrabold text-slate-800 text-base mb-1">
                  {reward.title}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {reward.description}
                </p>
              </div>

              <button
                onClick={() => handleRedeem(reward)}
                disabled={!canAfford}
                className={`mt-4 w-full py-3 px-4 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition active:scale-95 ${
                  canAfford
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-white shadow-md shadow-amber-200 cursor-pointer'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                {canAfford ? (
                  <>
                    <Sparkles size={16} /> Trocar por {reward.cost} estrelas
                  </>
                ) : (
                  <>Faltam {reward.cost - userStars} estrelas</>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
