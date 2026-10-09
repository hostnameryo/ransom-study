import React from 'react';
import { DrillMode, EventId } from '../data/types';
import { scenarioEvents, endingDefinitions } from '../data/events';
import confetti from 'canvas-confetti';
import { playSound } from '../utils/audio';
import {
  Award,
  CheckCircle2,
  Printer,
  RotateCcw,
  GitBranch,
  ShieldCheck,
  Server,
  Briefcase,
  Layers,
  Home,
} from 'lucide-react';

interface EndingScreenProps {
  drillMode: DrillMode;
  endingId: 'ending1' | 'ending2';
  cumulativeScores: {
    event1?: { engineer: number; management: number };
    event2?: { engineer: number; management: number };
    event3A?: { engineer: number; management: number };
    event3B?: { engineer: number; management: number };
    event4?: { engineer: number; management: number };
  };
  onRestartDrill: () => void;
  onPlayAlternateRoute: (startingEventId: EventId) => void;
}

export const EndingScreen: React.FC<EndingScreenProps> = ({
  drillMode,
  endingId,
  cumulativeScores,
  onRestartDrill,
  onPlayAlternateRoute,
}) => {
  const ending = endingDefinitions[endingId];

  // Fire celebratory effects
  React.useEffect(() => {
    playSound(endingId === 'ending1' ? 'victory' : 'transition');
    if (endingId === 'ending1') {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Safe fallback
      }
    }
  }, [endingId]);

  // Calculate totals
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
    return { rank: 'C', label: '再訓練推奨 (初動判断精度の向上)', color: 'text-rose-400' };
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 print-area">
      {/* Top action row */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onRestartDrill}
          className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <Home className="w-4 h-4 text-amber-400" />
          <span>最初に戻る</span>
        </button>

        <span className="text-xs text-emerald-400 font-mono font-semibold">
          演習完全終了
        </span>
      </div>

      {/* Ending Hero Card */}
      <div
        className={`rounded-3xl p-6 sm:p-10 border mb-10 shadow-2xl relative overflow-hidden ${
          endingId === 'ending1'
            ? 'bg-gradient-to-b from-slate-900 to-emerald-950/40 border-emerald-500/40'
            : 'bg-gradient-to-b from-slate-900 to-indigo-950/40 border-indigo-500/40'
        }`}
      >
        <div className="flex items-center gap-2 text-xs font-mono mb-3">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span className="text-amber-400">DRILL COMPLETION · 演習完了</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-2">
          {ending.title}
        </h1>
        <p className="text-sm sm:text-base text-slate-300 font-medium mb-6">
          {ending.subtitle}
        </p>

        <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800/80 mb-6 text-sm text-slate-200 leading-relaxed">
          {ending.narrative}
        </div>

        {/* Key Evaluation Highlights */}
        <div>
          <h3 className="text-xs font-mono font-semibold text-slate-400 tracking-wider uppercase mb-3">
            対応評価ハイライト
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ending.evaluationPoints.map((pt, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 flex items-start gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{pt}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full Event-by-Event Score Matrix (Mandatory Requirement) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 mb-10 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              <span>全イベント別 採点対比マトリクス</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              各イベントごとのエンジニアチームおよびマネジメントチームの得点内訳と総合評価です。
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors border border-slate-700"
            >
              <Printer className="w-4 h-4" />
              <span>レポート印刷 / PDF保存</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-xs">
                <th className="pb-3 font-medium">イベント / 対応フェーズ</th>
                <th className="pb-3 font-medium text-right">エンジニア得点</th>
                <th className="pb-3 font-medium text-right">マネジメント得点</th>
                <th className="pb-3 font-medium text-right">イベント小計</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono">
              {scenarioEvents.map((ev) => {
                const s = cumulativeScores[ev.id];
                if (!s && ev.id !== 'event1' && ev.id !== 'event2' && ev.id !== 'event4') {
                  // Only show executed event branch (e.g. 3A or 3B)
                  return null;
                }

                const eng = s?.engineer ?? 0;
                const mgt = s?.management ?? 0;
                const subtotal = eng + mgt;

                return (
                  <tr key={ev.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="py-3.5 font-sans">
                      <div className="font-bold text-white">
                        {ev.numberLabel} · {ev.title}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {ev.timeframe}
                      </div>
                    </td>
                    <td className="py-3.5 text-right font-bold text-cyan-400">
                      {s?.engineer !== undefined ? `${eng} 点` : '-'}
                    </td>
                    <td className="py-3.5 text-right font-bold text-purple-400">
                      {s?.management !== undefined ? `${mgt} 点` : '-'}
                    </td>
                    <td className="py-3.5 text-right font-bold text-slate-200">
                      {s ? `${subtotal} / 200点` : '-'}
                    </td>
                  </tr>
                );
              })}

              {/* Total Score Row */}
              <tr className="border-t-2 border-slate-700 bg-slate-950/60 font-bold">
                <td className="py-4 font-sans text-base text-white">
                  総合合計得点
                </td>
                <td className="py-4 text-right text-lg text-cyan-400">
                  {totalEngineerScore} <span className="text-xs text-slate-400">/ 400点</span>
                </td>
                <td className="py-4 text-right text-lg text-purple-400">
                  {totalManagementScore} <span className="text-xs text-slate-400">/ 400点</span>
                </td>
                <td className="py-4 text-right text-lg text-amber-400">
                  {totalEngineerScore + totalManagementScore}{' '}
                  <span className="text-xs text-slate-400">/ 800点</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Team Rank Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400">エンジニアチーム総合評価</div>
                <div className="text-sm font-bold text-white">
                  {getRank(totalEngineerScore).label}
                </div>
              </div>
            </div>
            <div className="text-2xl font-black font-mono text-cyan-400">
              ランク {getRank(totalEngineerScore).rank}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400">マネジメントチーム総合評価</div>
                <div className="text-sm font-bold text-white">
                  {getRank(totalManagementScore).label}
                </div>
              </div>
            </div>
            <div className="text-2xl font-black font-mono text-purple-400">
              ランク {getRank(totalManagementScore).rank}
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={onRestartDrill}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-slate-700"
        >
          <Home className="w-4 h-4 text-amber-400" />
          <span>最初に戻る</span>
        </button>

        <button
          onClick={() =>
            onPlayAlternateRoute(endingId === 'ending1' ? 'event3B' : 'event3A')
          }
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20"
        >
          <GitBranch className="w-4 h-4" />
          <span>
            {endingId === 'ending1'
              ? 'もう一つの分岐ルート（危機事態・イベント3B）を演習'
              : '早期封じ込めルート（イベント3A）を演習'}
          </span>
        </button>
      </div>
    </div>
  );
};
