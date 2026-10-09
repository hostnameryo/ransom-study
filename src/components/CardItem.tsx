import React from 'react';
import { ActionCard } from '../data/types';
import { Check, Info } from 'lucide-react';

interface CardItemProps {
  card: ActionCard;
  isSelected: boolean;
  onToggle: (id: string) => void;
  onOpenDetail?: (card: ActionCard) => void;
  showVerdict?: boolean; // When in debrief or library mode
  disabled?: boolean;
}

export const CardItem: React.FC<CardItemProps> = ({
  card,
  isSelected,
  onToggle,
  onOpenDetail,
  showVerdict = false,
  disabled = false,
}) => {
  const isGood = card.type === 'good';

  return (
    <div
      onClick={() => {
        if (!disabled) onToggle(card.id);
      }}
      className={`relative group rounded-xl p-4 transition-all duration-150 cursor-pointer border text-left flex flex-col justify-between select-none ${
        showVerdict
          ? isGood
            ? 'bg-emerald-950/30 border-emerald-500/40 hover:border-emerald-500'
            : 'bg-rose-950/30 border-rose-500/40 hover:border-rose-500'
          : isSelected
          ? 'bg-slate-800/90 border-amber-400 ring-2 ring-amber-400/30 shadow-lg shadow-amber-500/5'
          : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
      } ${disabled ? 'opacity-80 cursor-default' : ''}`}
    >
      <div>
        {/* Top metadata strip */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <div className="flex items-center gap-1.5 font-mono">
            <span className="text-slate-500">#{card.no.toString().padStart(2, '0')}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-300 font-sans">{card.priorityCategory}</span>
          </div>

          <div className="flex items-center gap-1.5">
            {onOpenDetail && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenDetail(card);
                }}
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800"
                title="詳細・解説を見る"
              >
                <Info className="w-3.5 h-3.5" />
              </button>
            )}

            {!showVerdict && (
              <div
                className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                  isSelected
                    ? 'bg-amber-400 border-amber-400 text-slate-950 font-bold'
                    : 'border-slate-700 bg-slate-950/60'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            )}
          </div>
        </div>

        {/* Card Title */}
        <h3 className="text-base font-semibold text-white mb-2 leading-snug tracking-tight">
          {card.title}
        </h3>

        {/* Card Description */}
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3">
          {card.description}
        </p>
      </div>

      {/* Debrief / Library Mode Extra Info */}
      {showVerdict && (
        <div className="mt-3 pt-3 border-t border-slate-800 text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span
              className={`font-semibold ${
                isGood ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {isGood ? '推奨アクション (Good)' : '非推奨アクション (Bad)'}
            </span>
            {card.priorityRank && (
              <span className="text-amber-400 font-mono text-xs font-bold tracking-widest">
                優先度: {card.priorityRank}
              </span>
            )}
          </div>
          <p className="text-slate-300 text-[11px] sm:text-xs leading-relaxed">
            {card.reason}
          </p>
        </div>
      )}

      {/* Active selection helper bar */}
      {!showVerdict && isSelected && (
        <div className="mt-3 pt-2 border-t border-amber-400/20 flex items-center justify-between text-[11px] text-amber-300">
          <span>採用予定アクション</span>
          <span className="font-mono">選択済</span>
        </div>
      )}
    </div>
  );
};
