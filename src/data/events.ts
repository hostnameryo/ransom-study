import { EventId, ScenarioEvent, EndingId } from './types';
import { engineerCards } from './engineerCards';
import { managementCards } from './managementCards';

export const scenarioEvents: ScenarioEvent[] = [
  {
    id: 'event1',
    numberLabel: 'イベント1',
    title: '状況発生・初動対応',
    timeframe: '～3時間以内',
    narrative: '未明、社内監視アラートが発報し、複数の端末でファイル拡張子が改ざんされランサムノート（身代金要求画面）が表示されていることが判明。感染の水平移動（ラテラルムーブメント）を即座に止めつつ、初動指揮体制を直ちに立ち上げる必要がある。',
    keyChallenge: '迅速なネットワーク隔離・アカウント一時制御と、経営・CSIRTによる指揮系統の一本化',
    engineerPrioritySummary: '★★★: 拡散防止 / ★★: 証跡保存 / ★: 分析・制御・支援',
    managementPrioritySummary: '★★★: 体制構築・拡散防止 / ★★: 被害最小化・調査準備 / ★: 支援'
  },
  {
    id: 'event2',
    numberLabel: 'イベント2',
    title: '封じ込め継続',
    timeframe: '～24時間以内',
    narrative: '発生から24時間。初期隔離後も攻撃者が別の管理アカウントや裏口を狙うリスクが残る。業務継続への影響を精査しながら、バックアップの健全性を確認し、外部専門ベンダーの正式支援を仰ぐ重要な局面である。',
    keyChallenge: 'リスクベースでの業務継続・停止判断、バックアップ汚染確認、外部SOC/専門家の正式投入',
    engineerPrioritySummary: '★★★: 拡散防止 / ★★: 被害最小化・調査準備 / ★: 支援',
    managementPrioritySummary: '★★★: 体制構築・拡散防止 / ★★: 被害最小化・調査準備 / ★: 支援'
  },
  {
    id: 'event3A',
    numberLabel: 'イベント3A',
    title: '調査・復旧計画',
    timeframe: '1～3日以内',
    narrative: '【早期封じ込め成功ルート】迅速な初動により感染拡大の抑え込みに成功。外部フォレンジック専門機関と連携して侵入経路と脆弱性を特定し、安全なクリーン環境での段階的な復旧計画を策定・承認する段階に進む。',
    keyChallenge: '侵入経路の特定・マルウェア挙動解析・バックアップ復元テスト・復旧優先順位の経営承認',
    engineerPrioritySummary: '★★★: 調査・分析 / ★★: 影響確認・復旧復元 / ★: 支援',
    managementPrioritySummary: '★★★: 要請・調査 / ★★: 復旧計画・被害整理 / ★: 支援・教訓化'
  },
  {
    id: 'event3B',
    numberLabel: 'イベント3B',
    title: '危機的な状況',
    timeframe: '1～3日以内',
    narrative: '【危機発生ルート】重要サーバーや基幹業務ネットワークにも感染の兆候が確認され、二次被害や情報流出の深刻な懸念が生じた。緊急対策本部を直ちに強化し、紙・手動などの代替業務切り替えと公的機関（警察・IPA等）への通報が急務となる。',
    keyChallenge: '重要システムの通信制御拡張、BCP代替運用への切替、フォレンジック緊急投入、公的機関・取引先対応の統制',
    engineerPrioritySummary: '★★★: 被害の最小化 / ★★: 調査分析・支援 / ★: 復旧準備',
    managementPrioritySummary: '★★★: 被害の最小化 / ★★: 支援体制 / ★: 被害の整理'
  },
  {
    id: 'event4',
    numberLabel: 'イベント4',
    title: '復旧・再稼働',
    timeframe: '3～7日以内',
    narrative: '調査と封じ込めの完了を受け、安全性が確認されたシステムから順次段階的に再稼働させる。セキュリティパッチ適用と認証情報の刷新を徹底し、事後の振り返りと再発防止策を組織に定着させる最終局面。',
    keyChallenge: 'テスト環境での事前確認・クリーン環境再構築・セキュリティパッチ適用・復旧確認会議と教訓化',
    engineerPrioritySummary: '★★★: 復旧準備・対応 / ★★: 調査・証拠保全 / ★: 支援',
    managementPrioritySummary: '★★★: 復旧対応 / ★★: 情報整理・支援 / ★: 教訓化'
  }
];

export interface EndingData {
  id: EndingId;
  title: string;
  subtitle: string;
  conditionDescription: string;
  narrative: string;
  evaluationPoints: string[];
}

export const endingDefinitions: Record<EndingId, EndingData> = {
  ending1: {
    id: 'ending1',
    title: 'エンディング1: 早期封じ込め・段階的な再開',
    subtitle: '早期封じ込めと冷静な経営指揮によるレジリエンス達成',
    conditionDescription: 'イベント1からイベント3A（調査・復旧計画）、イベント4（復旧・再稼働）へと進み、安全な段階的再開を果たした最善のシナリオ。',
    narrative: 'エンジニアチームの迅速なネットワーク隔離・アカウント制御と、マネジメントチームの明確な指揮系統構築により、ランサムウェアの被害を最小限の領域で食い止めました。バックアップの完全性を維持したまま、クリーン環境での検証を経て安全に基幹業務を再開。取引先や社会への信頼を維持し、強固なインシデント対応体制を確立しました。',
    evaluationPoints: [
      '初動3時間以内の拡散防止措置（ネットワーク隔離、共有サーバ停止、バックアップ保護）が完璧に機能',
      '経営緊急会議で意思決定を一本化し、現場の混乱と業務停止リスクをコントロール',
      '安全が確認されたクリーン環境から段階的に再開し、再感染リスクを完全に排除',
      '事後の振り返りとパッチ更新により、組織的なセキュリティ成熟度を向上'
    ]
  },
  ending2: {
    id: 'ending2',
    title: 'エンディング2: フォレンジック対応',
    subtitle: '深刻な危機を徹底した証跡保全と専門機関連携で克服',
    conditionDescription: 'イベント2（封じ込め継続）を経由した経路、またはイベント3Bからイベント3Aへ移動してイベント4（復旧・再稼働）を完了した経路など、徹底した証跡保全と専門機関連携によって事態を収束させたシナリオ。',
    narrative: '重要システムへの感染リスクに直面したものの、現場は安易な再起動や初期化を行わず、証跡を厳格に保持（電源保持、ディスクイメージ取得、ログ退避）。外部フォレンジック専門会社や警察・IPAと緊密に連携し、侵入経路の全容を解明しました。苦難の経験を糧に、抜本的なセキュリティアーキテクチャの刷新へと繋げました。',
    evaluationPoints: [
      '危機的状況でも慌てず証跡（メモリ、通信ログ、イメージ）を完全保全し、法的リスクを最小化',
      '代替業務（手動・紙・予備回線）を迅速に展開し、最低限の事業継続（BCP）を維持',
      '外部専門機関（フォレンジック・弁護士）および公的機関（警察・IPA）との連携を的確に実施',
      '攻撃者の潜伏経路を徹底特定し、全社的なセキュリティ機器の再点検と監視体制を確立'
    ]
  },
  ending3: {
    id: 'ending3',
    title: 'エンディング3: 危機的状況の継続（会社の存亡に関わる重大事態）',
    subtitle: 'フォレンジック対応の継続中・会社の存亡に関わる危機的な状態が継続',
    conditionDescription: 'イベント3B（危機的な状況）で終了したシナリオ。被害が基幹網へ拡大し、フォレンジック対応を継続しているものの事業停止と信用失墜が長期化し、会社の存亡を揺るがす深刻な危機が続いている状態。',
    narrative: '重要基幹システムやActive Directory、バックアップ網にまで暗号化とデータ侵害の疑いが波及。外部フォレンジック専門機関および警察・サイバー特別捜査隊による大規模な原因究明と証跡保全が24時間体制で継続していますが、業務システムは広範囲で停止したままです。顧客データ漏洩の懸念、取引先へのサプライチェーン停止、巨額の金銭被害や賠償リスクに直面しており、まさに会社の存亡に関わる危機的な状態が続いています。',
    evaluationPoints: [
      'イベント3B（危機的状況）への突入により、基幹インフラへの深刻な侵害波及を許した重大インシデント',
      '外部フォレンジック調査機関・警察が現在も総動員で調査を継続中だが、業務全面再開の目途は立たず',
      '紙・手動による代替業務の限界と、サプライチェーン・取引先への事業停止影響が極めて深刻',
      '初動における迅速な遮断判断と、全社レベルのサイバーBCP（事業継続計画）の抜本的再構築が至急必要'
    ]
  }
};

export function getCardsByEventAndTeam(eventId: EventId, team: 'engineer' | 'management') {
  const all = team === 'engineer' ? engineerCards : managementCards;
  return all.filter((c) => c.eventId === eventId);
}
