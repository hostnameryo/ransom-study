import { useState } from 'react';
import {
  DrillMode,
  EventId,
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
  const [selectedRoute, setSelectedRoute] = useState<'event3A' | 'event3B'>('event3A');
  const [endingId, setEndingId] = useState<'ending1' | 'ending2'>('ending1');

  const currentEvent = scenarioEvents.find((e) => e.id === currentEventId) || scenarioEvents[0];

  const handleStartDrill = (mode: DrillMode, startingEventId: EventId) => {
    setDrillMode(mode);
    setCurrentEventId(startingEventId);
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
      setViewState('EVENT_DEBRIEF');
    }
  };

  // Transition from Debrief to Next Event or Ending
  const handleProceedToNextEvent = (nextEventId: EventId) => {
    if (currentEventId === 'event4') {
      // Reached final ending!
      // Ending 1 if route was 3A and good total score, otherwise Ending 2
      const determinedEnding = selectedRoute === 'event3A' ? 'ending1' : 'ending2';
      setEndingId(determinedEnding);
      setViewState('ENDING');
      return;
    }

    if (currentEventId === 'event2') {
      // Branch to nextEventId (3A or 3B)
      const branchRoute = nextEventId === 'event3B' ? 'event3B' : 'event3A';
      setSelectedRoute(branchRoute);
    }

    setCurrentEventId(nextEventId);
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
    const branchRoute = startingEventId === 'event3B' ? 'event3B' : 'event3A';
    setSelectedRoute(branchRoute);
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
