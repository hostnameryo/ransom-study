import { useState } from 'react';
import {
  DrillMode,
  EventId,
  EndingId,
  TeamId,
  TeamEventEvaluation,
} from './data/types';
import { scenarioEvents } from './data/events';
import { Header } from './components/Header';
import { TitleScreen } from './components/TitleScreen';
import { PlayScreen } from './components/PlayScreen';
import { EventDebriefScreen } from './components/EventDebriefScreen';
import { EndingScreen } from './components/EndingScreen';
import { CardLibrary } from './components/CardLibrary';
import { GuideScreen } from './components/GuideScreen';
import { ScoreTableScreen } from './components/ScoreTableScreen';

type ViewState = 'TITLE' | 'PLAYING' | 'EVENT_DEBRIEF' | 'ENDING';
type ActiveTab = 'play' | 'score' | 'library' | 'guide';

export default function App() {
  const [currentTab, setCurrentTab] = useState<ActiveTab>('play');
  const [viewState, setViewState] = useState<ViewState>('TITLE');

  // Drill state
  const [drillMode, setDrillMode] = useState<DrillMode>('both');
  const [currentEventId, setCurrentEventId] = useState<EventId>('event1');
  const [activeTeam, setActiveTeam] = useState<TeamId>('engineer');

  // Current event evaluations
  const [currentEngineerEval, setCurrentEngineerEval] = useState<TeamEventEvaluation | null>(null);
  const [currentManagementEval, setCurrentManagementEval] = useState<TeamEventEvaluation | null>(null);

  // Cumulative score record: { [eventId]: { engineer: number, management: number } }
  const [cumulativeScores, setCumulativeScores] = useState<
    Record<string, { engineer: number; management: number }>
  >({});

  // Branch and Ending tracking
  const [visitedEvents, setVisitedEvents] = useState<EventId[]>(['event1']);
  const [endingId, setEndingId] = useState<EndingId>('ending1');

  const currentEvent = scenarioEvents.find((e) => e.id === currentEventId) || scenarioEvents[0];

  const handleStartDrill = (mode: DrillMode, startingEventId: EventId) => {
    setDrillMode(mode);
    setCurrentEventId(startingEventId);
    setVisitedEvents([startingEventId]);
    setActiveTeam(mode === 'management' ? 'management' : 'engineer');
    setCurrentEngineerEval(null);
    setCurrentManagementEval(null);
    setCumulativeScores({});
    setViewState('PLAYING');
    setCurrentTab('play');
  };

  const handleResetDrill = () => {
    setViewState('TITLE');
    setCurrentEventId('event1');
    setVisitedEvents(['event1']);
    setCurrentEngineerEval(null);
    setCurrentManagementEval(null);
    setCumulativeScores({});
    setCurrentTab('play');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Turn completed by an active team in the current event
  const handleCompleteTeamTurn = (evaluation: TeamEventEvaluation) => {
    if (evaluation.team === 'engineer') {
      setCurrentEngineerEval(evaluation);
      if (drillMode === 'both') {
        // Switch to Management team for the same event
        setActiveTeam('management');
      } else {
        // Solo engineer mode: directly go to debrief
        setCumulativeScores((prev) => ({
          ...prev,
          [currentEventId]: {
            engineer: evaluation.score,
            management: 0,
          },
        }));
        // If event3B was played, transition directly to Ending 3
        if (currentEventId === 'event3B') {
          setEndingId('ending3');
        }
        setViewState('EVENT_DEBRIEF');
      }
    } else {
      // Management team completed
      setCurrentManagementEval(evaluation);
      const engScore = currentEngineerEval ? currentEngineerEval.score : 0;
      setCumulativeScores((prev) => ({
        ...prev,
        [currentEventId]: {
          engineer: engScore,
          management: evaluation.score,
        },
      }));
      // If event3B was played, transition directly to Ending 3
      if (currentEventId === 'event3B') {
        setEndingId('ending3');
      }
      setViewState('EVENT_DEBRIEF');
    }
  };

  // Transition from Debrief to Next Event or Ending
  const handleProceedToNextEvent = (nextDestination: EventId | EndingId) => {
    // Direct ending navigation (e.g. from 3B clicking 'ending3')
    if (nextDestination === 'ending1' || nextDestination === 'ending2' || nextDestination === 'ending3') {
      setEndingId(nextDestination);
      setViewState('ENDING');
      return;
    }

    if (currentEventId === 'event4') {
      // Reached final ending from event4!
      // ルール:
      // 1. イベント1 -> イベント3A -> イベント4 のみ: エンディング1
      // 2. 3Bから3Aへ移動してイベント4へ来た場合: エンディング2
      // 3. それ以外の経路 (例: イベント1 -> イベント2 -> イベント3A -> イベント4): エンディング2
      const hasVisited3B = visitedEvents.includes('event3B');
      const hasVisitedEvent2 = visitedEvents.includes('event2');
      const hasVisited3A = visitedEvents.includes('event3A');

      if (!hasVisitedEvent2 && !hasVisited3B && hasVisited3A) {
        // イベント1 -> イベント3A -> イベント4
        setEndingId('ending1');
      } else {
        // 3Bから3Aへ移動してイベント4へ来た場合、またはイベント2経由など、それ以外の経路はすべてエンディング2
        setEndingId('ending2');
      }
      setViewState('ENDING');
      return;
    }

    // Normal navigation to next event (e.g., from 3B to 3A, or from 1 to 2/3A, etc.)
    setVisitedEvents((prev) => (prev.includes(nextDestination as EventId) ? prev : [...prev, nextDestination as EventId]));
    setCurrentEventId(nextDestination as EventId);
    setActiveTeam(drillMode === 'management' ? 'management' : 'engineer');
    setCurrentEngineerEval(null);
    setCurrentManagementEval(null);
    setViewState('PLAYING');
  };

  const handleRetryCurrentEvent = () => {
    setActiveTeam(drillMode === 'management' ? 'management' : 'engineer');
    setCurrentEngineerEval(null);
    setCurrentManagementEval(null);
    setViewState('PLAYING');
  };

  const handlePlayAlternateRoute = (startingEventId: EventId) => {
    // Allows trainee to play the other branch (3B or 3A)
    setVisitedEvents(['event1', startingEventId]);
    setCurrentEventId(startingEventId);
    setActiveTeam(drillMode === 'management' ? 'management' : 'engineer');
    setCurrentEngineerEval(null);
    setCurrentManagementEval(null);
    setViewState('PLAYING');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        onResetDrill={handleResetDrill}
        hasActiveSession={viewState !== 'TITLE'}
      />

      {/* Main Content Body */}
      <main className="flex-1">
        {/* Tab: Card Library */}
        {currentTab === 'library' && (
          <CardLibrary onReturnToTitle={handleResetDrill} />
        )}

        {/* Tab: Guide */}
        {currentTab === 'guide' && (
          <GuideScreen onReturnToTitle={handleResetDrill} />
        )}

        {/* Tab: Score Table */}
        {currentTab === 'score' && (
          <ScoreTableScreen
            cumulativeScores={cumulativeScores}
            onReturnToPlay={() => setCurrentTab('play')}
            onReturnToTitle={handleResetDrill}
          />
        )}

        {/* Tab: Play (Active Drill View) */}
        {currentTab === 'play' && (
          <>
            {viewState === 'TITLE' && (
              <TitleScreen
                onStartDrill={handleStartDrill}
                onOpenLibrary={() => setCurrentTab('library')}
                onOpenGuide={() => setCurrentTab('guide')}
              />
            )}

            {viewState === 'PLAYING' && (
              <PlayScreen
                currentEvent={currentEvent}
                drillMode={drillMode}
                activeTeam={activeTeam}
                onCompleteTeamTurn={handleCompleteTeamTurn}
                onReturnToTitle={handleResetDrill}
                completedEngineerEval={currentEngineerEval}
              />
            )}

            {viewState === 'EVENT_DEBRIEF' && (
              <EventDebriefScreen
                currentEvent={currentEvent}
                drillMode={drillMode}
                engineerEval={currentEngineerEval}
                managementEval={currentManagementEval}
                cumulativeScores={cumulativeScores}
                onProceedToNextEvent={handleProceedToNextEvent}
                onRetryEvent={handleRetryCurrentEvent}
                onReturnToTitle={handleResetDrill}
              />
            )}

            {viewState === 'ENDING' && (
              <EndingScreen
                drillMode={drillMode}
                endingId={endingId}
                cumulativeScores={cumulativeScores}
                onRestartDrill={handleResetDrill}
                onPlayAlternateRoute={handlePlayAlternateRoute}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
