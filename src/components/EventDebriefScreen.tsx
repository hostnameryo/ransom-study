import React from 'react';
import {
  ActionCard,
  DrillMode,
  EventId,
  EndingId,
  ScenarioEvent,
  TeamEventEvaluation,
} from '../data/types';
import { scenarioEvents } from '../data/events';
import { CardDetailModal } from './CardDetailModal';
import {
  Award,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  GitBranch,
  Server,
  Briefcase,
  Layers,
  Home,
} from 'lucide-react';

interface EventDebriefScreenProps {
  currentEvent: ScenarioEvent;
  drillMode: DrillMode;
  engineerEval?: TeamEventEvaluation | null;
  managementEval?: TeamEventEvaluation | null;
  cumulativeScores: {
    event1?: { engineer: number; management: number };
    event2?: { engineer: number; management: number };
    event3A?: { engineer: number; management: number };
    event3B?: { engineer: number; management: number };
    event4?: { engineer: number; management: number };
  };
  onProceedToNextEvent: (nextDestination: EventId | EndingId) => void;
  onRetryEvent: () => void;
  onReturnToTitle: () => void;
}

export const EventDebriefScreen: React.FC<EventDebriefScreenProps> = ({
  currentEvent,
  drillMode,
  engineerEval,
  managementEval,
  cumulativeScores,
  onProceedToNextEvent,
  onRetryEvent,
  onReturnToTitle,
}) => {
  const [activeReviewTeam, setActiveReviewTeam] = React.useState<'engineer' | 'management'>('engineer');
  const [inspectingCard, setInspectingCard] = React.useState<ActionCard | null>(null);

  // Default review tab based on mode
  React.useEffect(() => {
    if (drillMode === 'management') {
      setActiveReviewTeam('management');
    } else {
      setActiveReviewTeam('engineer');
    }
  }, [drillMode]);

  // Determine Branching if current event is Event 2
  const isEvent2 = currentEvent.id === 'event2';
  const combinedEvent2Score = (engineerEval?.score ?? 0) + (managementEval?.score ?? 0);
  const isBranch3A = combinedEvent2Score >= 140; // 70% threshold

  const [overrideBranch, setOverrideBranch] = React.useState<EventId | null>(null);
  const targetedBranch = overrideBranch || (isBranch3A ? 'event3A' : 'event3B');

  const handleNext = () => {
    if (currentEvent.id === 'event1') {
      onProceedToNextEvent('event2');
    } else if (currentEvent.id === 'event2') {
      onProceedToNextEvent(targetedBranch);
    } else if (currentEvent.id === 'event3A' || currentEvent.id === 'event3B') {
      onProceedToNextEvent('event4');
    } else if (currentEvent.id === 'event4') {
      // Trigger ending
      onProceedToNextEvent('event4');
    }
  };

  const currentReviewEval = activeReviewTeam === 'engineer' ? engineerEval : managementEval;

  const getScoreGrade = (score: number) => {
    if (score >= 90) return { label: 'S (卓越)', color: 'text-amber-400 border-amber-400/40 bg-amber-400/10' };
    if (score >= 75) return { label: 'A (優良)', color: 'text-emerald-400 border-emerald-400/40 bg-emerald-400/10' };
    if (score >= 60) return { label: 'B (標準)', color: 'text-cyan-400 border-cyan-400/40 bg-cyan-400/10' };
    return { label: 'C (要改善)', color: 'text-rose-400 border-rose-400/40 bg-rose-400/10' };
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Top action row */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onReturnToTitle}
          className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <Home className="w-4 h-4 text-amber-400" />
          <span>最初に戻る</span>
        </button>

        <span className="text-xs text-slate-500 font-mono">
          フェーズ判定完了
        </span>
      </div>

      {/* Title Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-700 rounded-full text-xs font-mono text-amber-400 mb-2">
          <span>{currentEvent.numberLabel} 評価レポート</span>
          <span>·</span>
          <span>{currentEvent.timeframe}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          {currentEvent.title} · 結果と採点分析
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          各チームの初動判断・選択カードの成否と、次のフェーズへの影響を確認してください。
        </p>
      </div>

      {/* Side-by-Side Team Score Cards (Mandatory Requirement) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Engineer Team Score Card */}
        {(drillMode === 'both' || drillMode === 'engineer') && engineerEval && (
          <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Server className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">エンジニアチーム得点</h3>
                  <span className="text-[11px] text-slate-400 font-mono">技術初動・封じ込め</span>
                </div>
              </div>

              <div className={`px-2.5 py-1 rounded-lg border text-xs font-bold font-mono ${getScoreGrade(engineerEval.score).color}`}>
                {getScoreGrade(engineerEval.score).label}
              </div>
            </div>

            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">
                {engineerEval.score}
              </span>
              <span className="text-sm font-mono text-slate-400">/ 100点</span>
            </div>

            {/* Breakdown stats */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-400">正解Goodカード</div>
                  <div className="font-bold text-white font-mono">{engineerEval.correctSelections.length} 枚採用</div>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
                <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-400">非推奨アクション</div>
                  <div className="font-bold text-white font-mono">{engineerEval.incorrectSelections.length} 枚選択</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Management Team Score Card */}
        {(drillMode === 'both' || drillMode === 'management') && managementEval && (
          <div className="bg-slate-900 border border-purple-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">マネジメントチーム得点</h3>
                  <span className="text-[11px] text-slate-400 font-mono">指揮統制・対外判断</span>
                </div>
              </div>

              <div className={`px-2.5 py-1 rounded-lg border text-xs font-bold font-mono ${getScoreGrade(managementEval.score).color}`}>
                {getScoreGrade(managementEval.score).label}
              </div>
            </div>

            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">
                {managementEval.score}
              </span>
              <span className="text-sm font-mono text-slate-400">/ 100点</span>
            </div>

            {/* Breakdown stats */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-400">正解Goodカード</div>
                  <div className="font-bold text-white font-mono">{managementEval.correctSelections.length} 枚採用</div>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
                <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-400">非推奨アクション</div>
                  <div className="font-bold text-white font-mono">{managementEval.incorrectSelections.length} 枚選択</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Branching Announcement (Displayed on Event 1) */}
      {currentEvent.id === 'event1' && (
        <div className="mb-8 p-6 rounded-2xl bg-slate-900 border border-cyan-500/40 shadow-xl">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
            <GitBranch className="w-4 h-4" />
            <span>NEXT PHASE SELECTION · 次の進行ルート選択</span>
          </div>

          <h3 className="text-lg font-bold text-white mb-2">
            初動対応完了後の移行フェーズを選択してください
          </h3>

          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            初動判定の結果を受け、引き続きネットワーク・端末の隔離や証跡保全を徹底する<strong>「イベント2: 封じ込め継続」</strong>に進むか、迅速な初動により早期封じ込めに成功した想定で<strong>「イベント3A: 調査・復旧計画」</strong>へ直接進むかを選択できます。
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
            <button
              onClick={() => onProceedToNextEvent('event2')}
              className="p-4 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-700 hover:border-amber-400 text-left transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">
                    標準ルート
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
                </div>
                <div className="text-base font-bold text-white group-hover:text-amber-400 mb-1">
                  イベント2: 封じ込め継続 へ進む
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  初期遮断に続いて基幹共有サーバやアカウント権限の停止・詳細ログ保全など、徹底した拡散防止フェーズを進めます。
                </p>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-850 text-xs text-amber-400 font-semibold flex items-center gap-1">
                <span>イベント2を開始する</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>

            <button
              onClick={() => onProceedToNextEvent('event3A')}
              className="p-4 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-cyan-500/40 hover:border-cyan-400 text-left transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-400/10 border border-cyan-400/20">
                    早期初動成功ルート
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                </div>
                <div className="text-base font-bold text-white group-hover:text-cyan-400 mb-1">
                  イベント3A: 調査・復旧計画 へ進む
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  初動対応が迅速かつ的確に成功した想定で、直ちに侵入経路の特定・影響範囲分析および段階的な復旧計画策定へ進みます。
                </p>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-850 text-xs text-cyan-400 font-semibold flex items-center gap-1">
                <span>イベント3Aを開始する</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Branching Announcement (Displayed on Event 2) */}
      {isEvent2 && (
        <div className="mb-8 p-6 rounded-2xl bg-slate-900 border border-amber-500/40 shadow-xl">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-2">
            <GitBranch className="w-4 h-4" />
            <span>SCENARIO BRANCHING TRIGGER</span>
          </div>

          <h3 className="text-lg font-bold text-white mb-2">
            イベント2 封じ込め判定によるルート分岐
          </h3>

          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            {isBranch3A ? (
              <span className="text-emerald-300">
                ✅ 2チーム合計得点 <strong>{combinedEvent2Score}点 / 200点</strong>（基準値140点以上）：
                迅速な初期遮断と経営連携により、基幹ネットワークへの感染波及を阻止しました！
                次のステージは<strong>「イベント3A: 調査・復旧計画」</strong>へ進みます。
              </span>
            ) : (
              <span className="text-rose-300">
                ⚠️ 2チーム合計得点 <strong>{combinedEvent2Score}点 / 200点</strong>（基準値140点未満）：
                初動の遅れや非推奨アクションの選択により、ランサムウェアが基幹データベースや複数拠点へ波及しました。
                次のステージは危機的非常事態<strong>「イベント3B: 危機的な状況」</strong>へ進みます。
              </span>
            )}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-800 text-xs">
            <span className="text-slate-400">演習用ルート強制指定:</span>
            <button
              onClick={() => setOverrideBranch('event3A')}
              className={`px-3 py-1.5 rounded-lg border transition-colors ${
                targetedBranch === 'event3A'
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-semibold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              イベント3A (調査・復旧計画) で進む
            </button>
            <button
              onClick={() => setOverrideBranch('event3B')}
              className={`px-3 py-1.5 rounded-lg border transition-colors ${
                targetedBranch === 'event3B'
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300 font-semibold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              イベント3B (危機的な状況) で進む
            </button>
          </div>
        </div>
      )}

      {/* Branching Announcement (Displayed on Event 3B) */}
      {currentEvent.id === 'event3B' && (
        <div className="mb-8 p-6 rounded-2xl bg-slate-900 border border-rose-500/60 shadow-xl bg-gradient-to-b from-slate-900 to-rose-950/20">
          <div className="flex items-center gap-2 text-xs font-mono text-rose-400 mb-2">
            <GitBranch className="w-4 h-4 text-rose-400" />
            <span className="font-bold">CRITICAL INCIDENT BRANCH · 危機的状況の分岐</span>
          </div>

          <h3 className="text-lg font-bold text-white mb-2">
            イベント3B到達に伴うエンディング3判定
          </h3>

          <p className="text-sm text-rose-200 leading-relaxed mb-4">
            イベント3B（危機的な状況）を経由したため、ランサムウェア被害が重要基幹網やActive Directoryにまで波及しました。<br className="hidden sm:inline" />
            <strong>【エンディング3: 危機的状況の継続（フォレンジック対応の継続中・会社の存亡に関わる重大事態）】</strong>へ直行します。
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
            <button
              onClick={() => onProceedToNextEvent('ending3')}
              className="p-4 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 border border-rose-500/60 hover:border-rose-400 text-left transition-all group flex flex-col justify-between shadow-lg shadow-rose-950/40"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-rose-300 px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/30">
                    決定エンディング
                  </span>
                  <ArrowRight className="w-4 h-4 text-rose-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="text-base font-bold text-white group-hover:text-rose-300 mb-1">
                  エンディング3: 危機的状況の継続 へ進む
                </div>
                <p className="text-xs text-rose-200 leading-relaxed">
                  フォレンジック対応の継続中であり、業務停止・信用失墜の長期化に伴い会社の存亡に関わる危機的な状態が続いている最終報告書を確認します。
                </p>
              </div>
              <div className="mt-3 pt-3 border-t border-rose-900/50 text-xs text-rose-300 font-semibold flex items-center gap-1">
                <span>エンディング3の結果を見る</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>

            <button
              onClick={() => onProceedToNextEvent('event3A')}
              className="p-4 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-700 hover:border-amber-400 text-left transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">
                    リカバリ検証用
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
                </div>
                <div className="text-base font-bold text-white group-hover:text-amber-400 mb-1">
                  イベント3A: 調査・復旧計画 をやり直す
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  早期封じ込めに成功していた場合の「イベント3A: 調査・復旧計画」の出題に切り替えて検証演習を行います。
                </p>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-850 text-xs text-amber-400 font-semibold flex items-center gap-1">
                <span>イベント3Aを体験する</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Cumulative Event-by-Event Progression Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">
        <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-400" />
          <span>全イベント別スコア推移表</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono">
                <th className="pb-3 font-medium">イベント名</th>
                <th className="pb-3 font-medium">エンジニア得点</th>
                <th className="pb-3 font-medium">マネジメント得点</th>
                <th className="pb-3 font-medium">合計 / ステータス</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {scenarioEvents.map((ev) => {
                const scores = cumulativeScores[ev.id];
                const isCurrent = ev.id === currentEvent.id;
                const isDone = Boolean(scores);

                return (
                  <tr
                    key={ev.id}
                    className={`${isCurrent ? 'bg-amber-400/5' : ''} transition-colors`}
                  >
                    <td className="py-3 font-sans">
                      <div className="font-semibold text-slate-200">
                        {ev.numberLabel} · {ev.title}
                      </div>
                      <div className="text-[11px] text-slate-500">{ev.timeframe}</div>
                    </td>
                    <td className="py-3">
                      {scores?.engineer !== undefined ? (
                        <span className="font-bold text-cyan-400">{scores.engineer} 点</span>
                      ) : isCurrent && engineerEval ? (
                        <span className="font-bold text-cyan-400">{engineerEval.score} 点</span>
                      ) : (
                        <span className="text-slate-600">-</span>
                      )}
                    </td>
                    <td className="py-3">
                      {scores?.management !== undefined ? (
                        <span className="font-bold text-purple-400">{scores.management} 点</span>
                      ) : isCurrent && managementEval ? (
                        <span className="font-bold text-purple-400">{managementEval.score} 点</span>
                      ) : (
                        <span className="text-slate-600">-</span>
                      )}
                    </td>
                    <td className="py-3">
                      {isDone || isCurrent ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {isCurrent ? '今回評価' : '完了済'}
                        </span>
                      ) : (
                        <span className="text-slate-600">未開始</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Card Decision Review Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-white">
              選択アクションの成否と解説
            </h3>
            <p className="text-xs text-slate-400">
              各チームが採用したアクションの正誤根拠と、見落とした推奨策を確認します。
            </p>
          </div>

          {drillMode === 'both' && (
            <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveReviewTeam('engineer')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeReviewTeam === 'engineer'
                    ? 'bg-cyan-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Server className="w-3.5 h-3.5" />
                エンジニアの回答
              </button>
              <button
                onClick={() => setActiveReviewTeam('management')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeReviewTeam === 'management'
                    ? 'bg-purple-500 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                マネジメントの回答
              </button>
            </div>
          )}
        </div>

        {/* Selected Cards Review */}
        {currentReviewEval && (
          <div className="space-y-6">
            {/* 1. Correct Good Selections */}
            <div>
              <h4 className="text-xs font-semibold text-emerald-400 mb-3 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>適切に採用できた推奨アクション ({currentReviewEval.correctSelections.length}枚)</span>
              </h4>
              {currentReviewEval.correctSelections.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentReviewEval.correctSelections.map((card) => (
                    <div
                      key={card.id}
                      onClick={() => setInspectingCard(card)}
                      className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs cursor-pointer hover:border-emerald-500/60 transition-colors"
                    >
                      <div className="flex items-center justify-between font-mono text-[11px] text-slate-400 mb-1">
                        <span>#{card.no.toString().padStart(2, '0')} · {card.priorityCategory}</span>
                        {card.priorityRank && <span className="text-amber-400 font-bold tracking-widest">優先度 {card.priorityRank}</span>}
                      </div>
                      <div className="font-bold text-white text-sm mb-1">{card.title}</div>
                      <p className="text-slate-300 text-[11px] line-clamp-2 mb-2">{card.description}</p>
                      <div className="text-[11px] text-emerald-300 bg-emerald-950/40 p-2 rounded-lg border border-emerald-800/40">
                        {card.reason}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">推奨アクションの採用がありませんでした。</p>
              )}
            </div>

            {/* 2. Incorrect Bad Traps */}
            {currentReviewEval.incorrectSelections.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-rose-400 mb-3 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>選択してしまった非推奨・不適切アクション ({currentReviewEval.incorrectSelections.length}枚)</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentReviewEval.incorrectSelections.map((card) => (
                    <div
                      key={card.id}
                      onClick={() => setInspectingCard(card)}
                      className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 text-xs cursor-pointer hover:border-rose-500/60 transition-colors"
                    >
                      <div className="flex items-center justify-between font-mono text-[11px] text-rose-400 mb-1">
                        <span>#{card.no.toString().padStart(2, '0')} · {card.priorityCategory}</span>
                        <span className="font-bold text-rose-400">非推奨</span>
                      </div>
                      <div className="font-bold text-white text-sm mb-1">{card.title}</div>
                      <p className="text-slate-300 text-[11px] line-clamp-2 mb-2">{card.description}</p>
                      <div className="text-[11px] text-rose-300 bg-rose-950/40 p-2 rounded-lg border border-rose-800/40">
                        {card.reason}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Missed Good Cards */}
            <div>
              <h4 className="text-xs font-semibold text-slate-400 mb-3 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                <span>見落とした推奨アクションの例</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentReviewEval.missedGoodCards.slice(0, 4).map((card) => (
                  <div
                    key={card.id}
                    onClick={() => setInspectingCard(card)}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs cursor-pointer hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center justify-between font-mono text-[11px] text-slate-500 mb-1">
                      <span>#{card.no.toString().padStart(2, '0')} · {card.priorityCategory}</span>
                      {card.priorityRank && <span className="text-amber-400 font-bold tracking-widest">優先度 {card.priorityRank}</span>}
                    </div>
                    <div className="font-semibold text-slate-200 mb-1">{card.title}</div>
                    <p className="text-slate-400 text-[11px] line-clamp-1">{card.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation action footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onReturnToTitle}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Home className="w-4 h-4 text-amber-400" />
            <span>最初に戻る</span>
          </button>

          <button
            onClick={onRetryEvent}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>このイベントをやり直す</span>
          </button>
        </div>

        {/* Next navigation buttons based on current event */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {currentEvent.id === 'event1' ? (
            <>
              <button
                onClick={() => onProceedToNextEvent('event2')}
                className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm border border-slate-750 flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-[0.99]"
              >
                <span>イベント2 (封じ込め継続) へ</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>
              <button
                onClick={() => onProceedToNextEvent('event3A')}
                className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/20 transition-all active:scale-[0.99]"
              >
                <span>イベント3A (調査・復旧計画) へ</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : currentEvent.id === 'event3B' ? (
            <>
              <button
                onClick={() => onProceedToNextEvent('ending3')}
                className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-rose-600/30 transition-all active:scale-[0.99]"
              >
                <span>エンディング3 (危機的状況の継続) へ進む</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onProceedToNextEvent('event3A')}
                className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-bold text-xs sm:text-sm border border-slate-700 flex items-center justify-center gap-1.5 transition-all active:scale-[0.99]"
              >
                <span>イベント3A (調査・復旧計画) に戻る</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>
            </>
          ) : currentEvent.id === 'event2' ? (
            <button
              onClick={() => onProceedToNextEvent(targetedBranch)}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-[0.99]"
            >
              <span>
                {targetedBranch === 'event3A'
                  ? 'イベント3A (調査・復旧計画) へ進む'
                  : 'イベント3B (危機的な状況) へ進む'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : currentEvent.id === 'event3A' ? (
            <button
              onClick={() => onProceedToNextEvent('event4')}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-[0.99]"
            >
              <span>イベント4 (復旧・再稼働) へ進む</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => onProceedToNextEvent('event4')}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-[0.99]"
            >
              <span>最終評価とエンディングへ進む</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <CardDetailModal
        card={inspectingCard}
        onClose={() => setInspectingCard(null)}
        showVerdict={true}
      />
    </div>
  );
};
