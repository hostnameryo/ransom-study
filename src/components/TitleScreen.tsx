import React from 'react';
import { DrillMode, EventId } from '../data/types';
import { scenarioEvents } from '../data/events';
import { Shield, Users, Server, Briefcase, ArrowRight, Play, Award, CheckCircle2 } from 'lucide-react';

interface TitleScreenProps {
  onStartDrill: (mode: DrillMode, startingEventId: EventId) => void;
  onOpenLibrary: () => void;
  onOpenGuide: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStartDrill,
  onOpenLibrary,
  onOpenGuide,
}) => {
  const [selectedMode, setSelectedMode] = React.useState<DrillMode>('both');
  const [selectedEventId, setSelectedEventId] = React.useState<EventId>('event1');

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-950/40 border border-amber-500/30 rounded-full text-xs font-medium text-amber-300 mb-4">
          <Shield className="w-3.5 h-3.5 text-amber-400" />
          <span>実践型インシデントレスポンス・シミュレーション</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
          ランサムウェア感染対応<br className="hidden sm:inline" />
          訓練プログラム
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
          エンジニアチームとマネジメントチームが連携し、未曾有のサイバー攻撃に立ち向かう訓練ゲームです。
          各フェーズのアクションカードを選択し、適切な初動対応・封じ込め・段階的復旧を達成してください。
        </p>
      </div>

      {/* Narrative Scenario Teaser */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 mb-10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500" />
        <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
          <div className="space-y-2">
            <span className="text-xs font-mono text-rose-400 tracking-wider">
              SCENARIO BRIEFING
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              某日 午前02:15、社内監視サーバーに異常アラート鳴動
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed pt-1">
              深夜、複数の社内PCおよびファイルサーバーで「.locked」拡張子への一斉暗号化と身代金要求画面（ランサムノート）を確認。
              業務停止のリスクが迫る中、エンジニアチームは技術的封じ込めを、マネジメントチームは緊急指揮統制を担わなければならない。
            </p>
          </div>
          <div className="shrink-0 flex md:flex-col gap-2 w-full md:w-auto">
            <button
              onClick={onOpenGuide}
              className="flex-1 md:flex-none px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 transition-colors text-center"
            >
              演習ルールを確認
            </button>
            <button
              onClick={onOpenLibrary}
              className="flex-1 md:flex-none px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 transition-colors text-center"
            >
              カード回答集を閲覧
            </button>
          </div>
        </div>
      </div>

      {/* Mode Selection Grid */}
      <div className="mb-10">
        <h3 className="text-sm font-semibold text-slate-400 mb-4 tracking-wide uppercase font-mono">
          演習モードを選択
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Mode 1: Both */}
          <div
            onClick={() => setSelectedMode('both')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer select-none text-left ${
              selectedMode === 'both'
                ? 'bg-slate-850 border-amber-400 ring-2 ring-amber-400/20 shadow-lg'
                : 'bg-slate-900 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
              <Users className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-base font-bold text-white">2チーム合同演習</h4>
              <span className="text-[11px] font-mono text-amber-400">推奨</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              エンジニアとマネジメントの両チームが各イベントで交代で解答。イベントごとのチーム別得点と総合連携を評価します。
            </p>
          </div>

          {/* Mode 2: Engineer Solo */}
          <div
            onClick={() => setSelectedMode('engineer')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer select-none text-left ${
              selectedMode === 'engineer'
                ? 'bg-slate-850 border-cyan-400 ring-2 ring-cyan-400/20 shadow-lg'
                : 'bg-slate-900 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3">
              <Server className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-base font-bold text-white">エンジニアチーム単独</h4>
              <span className="text-[11px] font-mono text-cyan-400">技術特化</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              ネットワーク隔離・証跡保全・バックアップ復元・パッチ適用など、技術的初動と復旧実務を集中的に訓練します。
            </p>
          </div>

          {/* Mode 3: Management Solo */}
          <div
            onClick={() => setSelectedMode('management')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer select-none text-left ${
              selectedMode === 'management'
                ? 'bg-slate-850 border-purple-400 ring-2 ring-purple-400/20 shadow-lg'
                : 'bg-slate-900 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-3">
              <Briefcase className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-base font-bold text-white">マネジメントチーム単独</h4>
              <span className="text-[11px] font-mono text-purple-400">指揮統制</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              緊急体制立ち上げ・業務停止判断・対外広報・保険連携・再稼働承認など、経営層・CSIRT統括の判断力を鍛えます。
            </p>
          </div>
        </div>
      </div>

      {/* Starting Event Picker */}
      <div className="mb-10 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-300">
            開始イベントを選択
          </h3>
          <span className="text-xs text-slate-500">
            通常は「イベント1」から通しで実施します
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {scenarioEvents.map((ev) => (
            <button
              key={ev.id}
              onClick={() => setSelectedEventId(ev.id)}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedEventId === ev.id
                  ? 'bg-slate-800 border-amber-400 text-white font-semibold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <div className="text-[11px] font-mono text-slate-400 mb-0.5">{ev.timeframe}</div>
              <div className="text-xs truncate">{ev.numberLabel}</div>
              <div className="text-[11px] text-slate-400 truncate mt-0.5">{ev.title}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 2 Endings Overview */}
      <div className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-emerald-900/40 bg-emerald-950/20 text-xs">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-1">
            <Award className="w-4 h-4" />
            <span>エンディング1: 早期封じ込め・段階的な再開</span>
          </div>
          <p className="text-slate-300">
            初動で拡散を確実に止め、イベント3A（調査・復旧計画）を経て事業を安全に早期再開する最善ゴール。
          </p>
        </div>
        <div className="p-4 rounded-xl border border-indigo-900/40 bg-indigo-950/20 text-xs">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold mb-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>エンディング2: フォレンジック対応</span>
          </div>
          <p className="text-slate-300">
            危機的状況（イベント3B）に直面しつつも、徹底した証跡保全と専門機関連携で被害を最小限に抑えるクライシス収束ゴール。
          </p>
        </div>
      </div>

      {/* Start CTA */}
      <div className="text-center pt-2">
        <button
          onClick={() => onStartDrill(selectedMode, selectedEventId)}
          className="w-full sm:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-base shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 mx-auto active:scale-[0.99]"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>演習を開始する</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
