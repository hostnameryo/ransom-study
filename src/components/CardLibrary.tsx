import React from 'react';
import { ActionCard, CardType, EventId, TeamId } from '../data/types';
import { engineerCards } from '../data/engineerCards';
import { managementCards } from '../data/managementCards';
import { scenarioEvents } from '../data/events';
import { CardDetailModal } from './CardDetailModal';
import {
  Search,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Server,
  Briefcase,
  Filter,
  Home,
} from 'lucide-react';

interface CardLibraryProps {
  onReturnToTitle?: () => void;
}

export const CardLibrary: React.FC<CardLibraryProps> = ({ onReturnToTitle }) => {
  const [teamFilter, setTeamFilter] = React.useState<TeamId | 'all'>('all');
  const [eventFilter, setEventFilter] = React.useState<EventId | 'all'>('all');
  const [typeFilter, setTypeFilter] = React.useState<CardType | 'all'>('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [inspectingCard, setInspectingCard] = React.useState<ActionCard | null>(null);

  const allCards = React.useMemo(() => {
    return [...engineerCards, ...managementCards];
  }, []);

  const filteredCards = React.useMemo(() => {
    return allCards.filter((card) => {
      if (teamFilter !== 'all' && card.team !== teamFilter) return false;
      if (eventFilter !== 'all' && card.eventId !== eventFilter) return false;
      if (typeFilter !== 'all' && card.type !== typeFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = card.title.toLowerCase().includes(q);
        const matchesDesc = card.description.toLowerCase().includes(q);
        const matchesReason = card.reason.toLowerCase().includes(q);
        const matchesCategory = card.priorityCategory.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesReason && !matchesCategory) {
          return false;
        }
      }

      return true;
    });
  }, [allCards, teamFilter, eventFilter, typeFilter, searchQuery]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-2">
            <BookOpen className="w-4 h-4" />
            <span>REFERENCE DATABASE · 全200枚 完全回答集</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            カード解説・回答集ライブラリ
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            エンジニアチーム回答集およびマネジメントチーム回答集に収録された全アクションカード（Good/Badカード各100枚）の解説と優先順位の完全データベースです。
          </p>
        </div>

        {onReturnToTitle && (
          <button
            onClick={onReturnToTitle}
            className="self-start sm:self-center px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
          >
            <Home className="w-4 h-4 text-amber-400" />
            <span>最初に戻る</span>
          </button>
        )}
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-8 shadow-xl space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="キーワード検索（例: バックアップ, 隔離, フォレンジック, パッチ, 広報, 再起動...）"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Filter Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {/* Team Filter */}
          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1.5 flex items-center gap-1">
              <Filter className="w-3 h-3 text-slate-500" />
              <span>チーム区分</span>
            </label>
            <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800">
              <button
                onClick={() => setTeamFilter('all')}
                className={`flex-1 py-1.5 rounded text-center transition-colors ${
                  teamFilter === 'all' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                両方
              </button>
              <button
                onClick={() => setTeamFilter('engineer')}
                className={`flex-1 py-1.5 rounded text-center transition-colors ${
                  teamFilter === 'engineer' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                エンジニア
              </button>
              <button
                onClick={() => setTeamFilter('management')}
                className={`flex-1 py-1.5 rounded text-center transition-colors ${
                  teamFilter === 'management' ? 'bg-purple-500 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                マネジメント
              </button>
            </div>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1.5 flex items-center gap-1">
              <Filter className="w-3 h-3 text-slate-500" />
              <span>カード種別</span>
            </label>
            <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800">
              <button
                onClick={() => setTypeFilter('all')}
                className={`flex-1 py-1.5 rounded text-center transition-colors ${
                  typeFilter === 'all' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                すべて
              </button>
              <button
                onClick={() => setTypeFilter('good')}
                className={`flex-1 py-1.5 rounded text-center transition-colors ${
                  typeFilter === 'good' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Good (正解)
              </button>
              <button
                onClick={() => setTypeFilter('bad')}
                className={`flex-1 py-1.5 rounded text-center transition-colors ${
                  typeFilter === 'bad' ? 'bg-rose-500 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Bad (非推奨)
              </button>
            </div>
          </div>

          {/* Event Filter */}
          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1.5 flex items-center gap-1">
              <Filter className="w-3 h-3 text-slate-500" />
              <span>対象イベント</span>
            </label>
            <select
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value as EventId | 'all')}
              className="w-full py-2 px-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-400"
            >
              <option value="all">全イベント</option>
              {scenarioEvents.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.numberLabel} · {ev.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Counter */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800 font-mono">
          <span>該当カード数: <strong className="text-amber-400 font-bold">{filteredCards.length}</strong> / 200枚</span>
          {(teamFilter !== 'all' || eventFilter !== 'all' || typeFilter !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setTeamFilter('all');
                setEventFilter('all');
                setTypeFilter('all');
                setSearchQuery('');
              }}
              className="text-amber-400 hover:underline"
            >
              条件をリセット
            </button>
          )}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {filteredCards.map((card) => {
          const isGood = card.type === 'good';
          const isEng = card.team === 'engineer';
          const ev = scenarioEvents.find((e) => e.id === card.eventId);

          return (
            <div
              key={card.id}
              onClick={() => setInspectingCard(card)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer select-none text-left flex flex-col justify-between ${
                isGood
                  ? 'bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-500/70 hover:bg-emerald-950/30'
                  : 'bg-rose-950/20 border-rose-500/30 hover:border-rose-500/70 hover:bg-rose-950/30'
              }`}
            >
              <div>
                {/* Meta strip */}
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`inline-flex items-center gap-1 font-semibold ${
                        isEng ? 'text-cyan-400' : 'text-purple-400'
                      }`}
                    >
                      {isEng ? <Server className="w-3 h-3" /> : <Briefcase className="w-3 h-3" />}
                      {isEng ? '技術' : '経営'}
                    </span>
                    <span>·</span>
                    <span>{ev?.numberLabel}</span>
                    <span>·</span>
                    <span>#{card.no.toString().padStart(2, '0')}</span>
                  </div>

                  <span
                    className={`font-semibold ${
                      isGood ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {isGood ? 'Goodカード' : 'Badカード'}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-white mb-2 leading-snug">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {card.description}
                </p>
              </div>

              {/* Reason Box */}
              <div
                className={`p-3 rounded-xl border text-xs leading-relaxed ${
                  isGood
                    ? 'bg-emerald-950/50 border-emerald-800/40 text-emerald-200'
                    : 'bg-rose-950/50 border-rose-800/40 text-rose-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1 font-mono text-[10px] text-slate-400">
                  <span className="text-slate-300 font-sans">{card.priorityCategory}</span>
                  {card.priorityRank && <span className="text-amber-400 font-bold tracking-widest">優先度: {card.priorityRank}</span>}
                </div>
                <p className="text-[11px] sm:text-xs">{card.reason}</p>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCards.length === 0 && (
        <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl">
          <p className="text-slate-400 text-sm">条件に一致するカードが見つかりませんでした。</p>
        </div>
      )}

      {/* Detail Modal */}
      <CardDetailModal
        card={inspectingCard}
        onClose={() => setInspectingCard(null)}
        showVerdict={true}
      />
    </div>
  );
};
