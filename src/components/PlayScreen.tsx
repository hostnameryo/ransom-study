import React from 'react';
import {
  ActionCard,
  DrillMode,
  ScenarioEvent,
  TeamId,
  TeamEventEvaluation,
} from '../data/types';
import { getCardsByEventAndTeam } from '../data/events';
import { CardItem } from './CardItem';
import { CardDetailModal } from './CardDetailModal';
import { playSound } from '../utils/audio';
import {
  Server,
  Briefcase,
  AlertCircle,
  HelpCircle,
  CheckCircle,
  Clock,
  ArrowRight,
  Shield,
  Layers,
  Shuffle,
  Home,
} from 'lucide-react';

interface PlayScreenProps {
  currentEvent: ScenarioEvent;
  drillMode: DrillMode;
  activeTeam: TeamId;
  onCompleteTeamTurn: (evaluation: TeamEventEvaluation) => void;
  onReturnToTitle: () => void;
  completedEngineerEval?: TeamEventEvaluation | null;
}

// Utility to randomly shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const PlayScreen: React.FC<PlayScreenProps> = ({
  currentEvent,
  drillMode,
  activeTeam,
  onCompleteTeamTurn,
  onReturnToTitle,
  completedEngineerEval,
}) => {
  const [selectedCardIds, setSelectedCardIds] = React.useState<string[]>([]);
  const [inspectingCard, setInspectingCard] = React.useState<ActionCard | null>(null);
  const [showPriorityHint, setShowPriorityHint] = React.useState(false);
  const [showAllDeck, setShowAllDeck] = React.useState(false);
  const [shuffleKey, setShuffleKey] = React.useState(0);

  // Load cards for active team & event
  const teamCards = React.useMemo(() => {
    return getCardsByEventAndTeam(currentEvent.id, activeTeam);
  }, [currentEvent.id, activeTeam]);

  // Candidate cards pool with completely randomized order
  const candidateCards = React.useMemo(() => {
    if (showAllDeck) {
      return shuffleArray(teamCards);
    }
    // Randomly draw 5 good cards and 5 bad cards
    const shuffledGood = shuffleArray(teamCards.filter((c) => c.type === 'good'));
    const shuffledBad = shuffleArray(teamCards.filter((c) => c.type === 'bad'));
    const pool = [...shuffledGood.slice(0, 5), ...shuffledBad.slice(0, 5)];
    // Thoroughly randomize the final 10 cards presentation order
    return shuffleArray(pool);
  }, [teamCards, showAllDeck, shuffleKey]);

  // Reset selected cards and regenerate random shuffle when active team or event changes
  React.useEffect(() => {
    setSelectedCardIds([]);
    setShuffleKey((prev) => prev + 1);
  }, [activeTeam, currentEvent.id]);

  const handleManualReshuffle = () => {
    setSelectedCardIds([]);
    setShuffleKey((prev) => prev + 1);
    playSound('select');
  };

  const handleToggleCard = (cardId: string) => {
    playSound('select');
    setSelectedCardIds((prev) => {
      if (prev.includes(cardId)) {
        return prev.filter((id) => id !== cardId);
      }
      if (prev.length >= 5) {
        return [...prev.slice(1), cardId];
      }
      return [...prev, cardId];
    });
  };

  const handleSubmit = () => {
    if (selectedCardIds.length === 0) {
      return;
    }

    const allGoodInEvent = teamCards.filter((c) => c.type === 'good');
    const selectedCards = teamCards.filter((c) => selectedCardIds.includes(c.id));

    const correctSelections = selectedCards.filter((c) => c.type === 'good');
    const incorrectSelections = selectedCards.filter((c) => c.type === 'bad');
    const missedGoodCards = allGoodInEvent.filter((c) => !selectedCardIds.includes(c.id));

    let rawScore = correctSelections.length * 20 - incorrectSelections.length * 5;
    if (rawScore < 0) rawScore = 0;
    if (rawScore > 100) rawScore = 100;

    if (incorrectSelections.length === 0 && correctSelections.length >= 5) {
      playSound('good');
    } else if (incorrectSelections.length > 0) {
      playSound('bad');
    } else {
      playSound('good');
    }

    const evaluation: TeamEventEvaluation = {
      team: activeTeam,
      eventId: currentEvent.id,
      score: rawScore,
      selectedCardIds,
      correctSelections,
      incorrectSelections,
      missedGoodCards,
      feedbackNotes: [],
    };

    onCompleteTeamTurn(evaluation);
  };

  const isEngineer = activeTeam === 'engineer';
  const teamTitle = isEngineer ? 'エンジニアチーム' : 'マネジメントチーム';
  const teamIcon = isEngineer ? (
    <Server className="w-5 h-5 text-cyan-400" />
  ) : (
    <Briefcase className="w-5 h-5 text-purple-400" />
  );
  const prioritySummary = isEngineer
    ? currentEvent.engineerPrioritySummary
    : currentEvent.managementPrioritySummary;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
      {/* Top action row: Back to start button */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onReturnToTitle}
          className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <Home className="w-4 h-4 text-amber-400" />
          <span>最初に戻る</span>
        </button>

        <div className="text-xs text-slate-400 font-mono">
          問題順: <span className="text-amber-400">ランダム出題中</span>
        </div>
      </div>

      {/* Event Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
              <span>{currentEvent.numberLabel}</span>
              <span>·</span>
              <span className="flex items-center gap-1 text-slate-300">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {currentEvent.timeframe}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {currentEvent.title}
            </h1>
          </div>

          {/* Turn Indicator */}
          <div className="flex items-center gap-3 bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center border border-slate-800">
              {teamIcon}
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-mono">現在の解答担当</div>
              <div className="text-sm font-bold text-white">{teamTitle}</div>
            </div>
          </div>
        </div>

        {/* Narrative Context */}
        <p className="text-sm text-slate-300 leading-relaxed mb-3">
          {currentEvent.narrative}
        </p>

        {/* Key Challenge Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
          <div className="flex items-center gap-2 text-slate-300">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong className="text-amber-400">重要課題:</strong> {currentEvent.keyChallenge}
            </span>
          </div>

          <button
            onClick={() => setShowPriorityHint(!showPriorityHint)}
            className="flex items-center gap-1 text-slate-400 hover:text-amber-300 transition-colors whitespace-nowrap text-left"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{showPriorityHint ? '優先度ヒントを隠す' : '優先度方針を確認'}</span>
          </button>
        </div>

        {/* Priority Hint Accordion */}
        {showPriorityHint && (
          <div className="mt-3 p-3 bg-slate-950 border border-amber-500/30 rounded-xl text-xs text-amber-200/90 animate-in fade-in">
            <span className="font-semibold block mb-1">【チーム推奨の優先順位方針】</span>
            <p className="font-mono">{prioritySummary}</p>
          </div>
        )}
      </div>

      {/* Joint Mode notice when Engineer has finished */}
      {drillMode === 'both' && !isEngineer && completedEngineerEval && (
        <div className="mb-6 p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 flex items-center justify-between text-xs text-cyan-200">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-cyan-400" />
            <span>エンジニアチームの初動選定が完了しました。続いてマネジメントチームの対応方針を決定してください。</span>
          </div>
          <span className="font-mono text-slate-400">
            エンジニア獲得: {completedEngineerEval.score}点
          </span>
        </div>
      )}

      {/* Instructions & Hand Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-400" />
            <span>対応アクションカードの選定</span>
          </h2>
          <p className="text-xs text-slate-400">
            ランダム順で提示された候補カードの中から、このフェーズで採用すべき<strong className="text-amber-400">推奨アクション（5枚）</strong>を選択してください。
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleManualReshuffle}
            title="問題の並び順と候補をシャッフル"
            className="text-xs text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-1.5 transition-colors"
          >
            <Shuffle className="w-3.5 h-3.5 text-amber-400" />
            <span>シャッフル</span>
          </button>

          <button
            onClick={() => setShowAllDeck(!showAllDeck)}
            className="text-xs text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-1.5 transition-colors"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{showAllDeck ? '10枚表示' : '全20枚表示'}</span>
          </button>

          <div className="text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
            選択中: <strong className="text-amber-400">{selectedCardIds.length}</strong> / 5枚
          </div>
        </div>
      </div>

      {/* Card Selection Grid (Fully Randomized) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {candidateCards.map((card) => (
          <CardItem
            key={card.id}
            card={card}
            isSelected={selectedCardIds.includes(card.id)}
            onToggle={handleToggleCard}
            onOpenDetail={(c) => setInspectingCard(c)}
          />
        ))}
      </div>

      {/* Bottom Sticky Submission Bar */}
      <div className="sticky bottom-4 z-30 bg-slate-950/95 backdrop-blur-md border border-slate-800 p-4 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-xs text-slate-300">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          <span>
            {selectedCardIds.length === 5 ? (
              <span className="text-emerald-400 font-medium">
                推奨カード5枚が選択されました。方針を確定して判定へ進んでください。
              </span>
            ) : selectedCardIds.length > 0 ? (
              <span>
                あと <strong className="text-amber-400">{5 - selectedCardIds.length}</strong> 枚選択できます（5枚推奨）
              </span>
            ) : (
              <span>カードをクリックして採用するアクションを選んでください</span>
            )}
          </span>
        </div>

        <button
          onClick={handleSubmit}
          disabled={selectedCardIds.length === 0}
          className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
            selectedCardIds.length > 0
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 active:scale-[0.99]'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <span>対応方針を確定して判定する</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Detail Modal */}
      <CardDetailModal
        card={inspectingCard}
        onClose={() => setInspectingCard(null)}
        showVerdict={false}
      />
    </div>
  );
};
