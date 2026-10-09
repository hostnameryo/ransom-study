import React from 'react';
import { ActionCard } from '../data/types';
import { X, ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react';

interface CardDetailModalProps {
  card: ActionCard | null;
  onClose: () => void;
  showVerdict?: boolean;
}

export const CardDetailModal: React.FC<CardDetailModalProps> = ({
  card,
  onClose,
  showVerdict = false,
}) => {
  if (!card) return null;

  const isGood = card.type === 'good';
  const teamLabel = card.team === 'engineer' ? 'エンジニアチーム' : 'マネジメントチーム';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Metadata */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-3 font-mono">
          <span>{teamLabel}</span>
          <span>·</span>
          <span>カード #{card.no.toString().padStart(2, '0')}</span>
          <span>·</span>
          <span className="font-sans text-slate-300">{card.priorityCategory}</span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-4">
          {card.title}
        </h3>

        {/* Description Box */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 mb-5">
          <p className="text-sm text-slate-200 leading-relaxed">
            {card.description}
          </p>
        </div>

        {/* Verdict and rationale (visible if showVerdict is true) */}
        {showVerdict ? (
          <div
            className={`p-4 rounded-xl border ${
              isGood
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
            }`}
          >
            <div className="flex items-center gap-2 font-semibold text-sm mb-2">
              {isGood ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>推奨アクション (Goodカード)</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>不適切・トラップ (Badカード)</span>
                </>
              )}
              {card.priorityRank && (
                <span className="ml-auto text-xs text-amber-400 font-mono font-bold tracking-widest">
                  優先度: {card.priorityRank}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
              {card.reason}
            </p>
          </div>
        ) : (
          <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-800 text-xs text-slate-400 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p>
              このカードがインシデント初動・封じ込めにおいて適切か、あるいは二次被害を招くトラップかを判断して選択してください。
            </p>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
