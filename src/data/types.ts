export type TeamId = 'engineer' | 'management';

export type EventId = 'event1' | 'event2' | 'event3A' | 'event3B' | 'event4';

export type CardType = 'good' | 'bad';

export interface ActionCard {
  id: string; // e.g. eng_ev1_g1
  team: TeamId;
  eventId: EventId;
  type: CardType;
  no: number; // 1 ~ 10
  title: string;
  description: string;
  reason: string; // "正しい: ..." or "誤り: ..."
  priorityCategory: string; // e.g. "体制の構築", "拡散防止", "証跡保存"
  priorityRank?: string; // e.g. "①", "②", "③～⑤"
}

export interface ScenarioEvent {
  id: EventId;
  numberLabel: string; // "イベント1", "イベント3A" etc.
  title: string;
  timeframe: string; // "～3時間以内", "1～3日以内" etc.
  narrative: string;
  keyChallenge: string;
  engineerPrioritySummary: string;
  managementPrioritySummary: string;
}

export interface SelectedCardResult {
  card: ActionCard;
  isCorrect: boolean;
  points: number;
}

export interface TeamEventEvaluation {
  team: TeamId;
  eventId: EventId;
  score: number; // 0 ~ 100
  selectedCardIds: string[];
  correctSelections: ActionCard[];
  incorrectSelections: ActionCard[];
  missedGoodCards: ActionCard[];
  feedbackNotes: string[];
}

export interface FullDrillHistory {
  event1?: { engineer: TeamEventEvaluation; management: TeamEventEvaluation };
  event2?: { engineer: TeamEventEvaluation; management: TeamEventEvaluation };
  event3A?: { engineer: TeamEventEvaluation; management: TeamEventEvaluation };
  event3B?: { engineer: TeamEventEvaluation; management: TeamEventEvaluation };
  event4?: { engineer: TeamEventEvaluation; management: TeamEventEvaluation };
}

export type DrillMode = 'both' | 'engineer' | 'management';
