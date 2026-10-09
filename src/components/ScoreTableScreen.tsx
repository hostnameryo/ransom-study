import React from 'react';
import { scenarioEvents } from '../data/events';
import { Layers, Printer, Server, Briefcase, Award, Home } from 'lucide-react';

interface ScoreTableScreenProps {
  cumulativeScores: {
    event1?: { engineer: number; management: number };
    event2?: { engineer: number; management: number };
    event3A?: { engineer: number; management: number };
    event3B?: { engineer: number; management: number };
    event4?: { engineer: number; management: number };
  };
  onReturnToPlay: () => void;
  onReturnToTitle: () => void;
}

export const ScoreTableScreen: React.FC<ScoreTableScreenProps> = ({
  cumulativeScores,
  onReturnToPlay,
  onReturnToTitle,
}) => {
  const totalEngineerScore = Object.values(cumulativeScores).reduce(
    (sum, item) => sum + (item?.engineer ?? 0),
    0
  );
  const totalManagementScore = Object.values(cumulativeScores).reduce(
    (sum, item) => sum + (item?.management ?? 0),
    0
  );

  const getRank = (score: number) => {
    if (score >= 360) return { rank: 'S', label: '最優秀レジリエンス組織', color: 'text-amber-400' };
    if (score >= 300) return { rank: 'A', label: '優秀なインシデント対応力', color: 'text-emerald-400' };
    if (score >= 240) return { rank: 'B', label: '標準的な初動対応水準', color: 'text-cyan-400' };
    return { rank: 'C', label: '再訓練推奨 (落とし穴対策強化)', color: 'text-rose-400' };
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 print-area">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-2">
            <Layers className="w-4 h-4" />
            <span>PROGRESS & EVALUATION MATRIX</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            イベント別 チーム採点記録表
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            各イベントで獲得したエンジニアチームおよびマネジメントチームの得点一覧です。
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onReturnToTitle}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            <Home className="w-4 h-4 text-amber-400" />
            <span>最初に戻る</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>印刷 / PDF出力</span>
          </button>
          <button
            onClick={onReturnToPlay}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors"
          >
            演習画面に戻る
          </button>
        </div>
      </div>

      {/* Main Scoreboard */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 mb-8 shadow-xl">
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-xs">
                <th className="pb-3 font-medium">イベント / アクション</th>
                <th className="pb-3 font-medium text-right">エンジニア得点</th>
                <th className="pb-3 font-medium text-right">マネジメント得点</th>
                <th className="pb-3 font-medium text-right">合計 (200点満点)</th>
                <th className="pb-3 font-medium text-center">状況</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono">
              {scenarioEvents.map((ev) => {
                const s = cumulativeScores[ev.id];
                const eng = s?.engineer;
                const mgt = s?.management;
                const subtotal = (eng ?? 0) + (mgt ?? 0);

                return (
                  <tr key={ev.id} className="hover:bg-slate-850/40 transition-colors">
                    <td className="py-3.5 font-sans">
                      <div className="font-bold text-white">
                        {ev.numberLabel} · {ev.title}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {ev.timeframe}
                      </div>
                    </td>
                    <td className="py-3.5 text-right font-bold text-cyan-400">
                      {eng !== undefined ? `${eng} 点` : <span className="text-slate-600">-</span>}
                    </td>
                    <td className="py-3.5 text-right font-bold text-purple-400">
                      {mgt !== undefined ? `${mgt} 点` : <span className="text-slate-600">-</span>}
                    </td>
                    <td className="py-3.5 text-right font-bold text-slate-200">
                      {s !== undefined ? `${subtotal} 点` : <span className="text-slate-600">-</span>}
                    </td>
                    <td className="py-3.5 text-center font-sans">
                      {s !== undefined ? (
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 font-semibold">
                          完了
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-600">未受講</span>
                      )}
                    </td>
                  </tr>
                );
              })}

              {/* Grand Total */}
              <tr className="border-t-2 border-slate-700 bg-slate-950/70 font-bold">
                <td className="py-4 font-sans text-base text-white">
                  総合累計得点
                </td>
                <td className="py-4 text-right text-lg text-cyan-400">
                  {totalEngineerScore} <span className="text-xs text-slate-500">/ 400点</span>
                </td>
                <td className="py-4 text-right text-lg text-purple-400">
                  {totalManagementScore} <span className="text-xs text-slate-500">/ 400点</span>
                </td>
                <td className="py-4 text-right text-lg text-amber-400">
                  {totalEngineerScore + totalManagementScore} <span className="text-xs text-slate-500">/ 800点</span>
                </td>
                <td className="py-4 text-center font-sans">
                  <span className="text-xs text-amber-400 font-bold">総合集計</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Evaluation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400">エンジニアチーム現状評価</div>
                <div className="text-sm font-bold text-white">
                  {getRank(totalEngineerScore).label}
                </div>
              </div>
            </div>
            <div className="text-2xl font-black font-mono text-cyan-400">
              {getRank(totalEngineerScore).rank}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-purple-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400">マネジメントチーム現状評価</div>
                <div className="text-sm font-bold text-white">
                  {getRank(totalManagementScore).label}
                </div>
              </div>
            </div>
            <div className="text-2xl font-black font-mono text-purple-400">
              {getRank(totalManagementScore).rank}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
