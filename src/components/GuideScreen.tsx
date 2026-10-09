import React from 'react';
import {
  ShieldAlert,
  Server,
  Briefcase,
  GitBranch,
  Award,
  AlertTriangle,
  CheckCircle2,
  Home,
} from 'lucide-react';

interface GuideScreenProps {
  onReturnToTitle?: () => void;
}

export const GuideScreen: React.FC<GuideScreenProps> = ({ onReturnToTitle }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-2">
            <ShieldAlert className="w-4 h-4" />
            <span>TRAINING MANUAL & FRAMEWORK</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            ランサムウェア対応訓練プログラム ガイド
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            サイバー攻撃（ランサムウェア）発生時におけるエンジニアチームとマネジメントチームの役割分担、初動原則、および演習の進め方について解説します。
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

      {/* Section 1: The 2 Teams */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8 shadow-xl">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span>1. 2チームの役割分担と連携</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm mb-2">
              <Server className="w-4 h-4" />
              <span>エンジニアチーム（技術・CSIRT）</span>
            </div>
            <ul className="space-y-1.5 text-slate-300">
              <li>・<strong>拡散防止:</strong> 疑わしい端末のネットワーク隔離、共有ストレージ停止、高リスク管理アカウントの即時制限</li>
              <li>・<strong>証跡保全:</strong> 決して安易に再起動・初期化せず、電源を保持したままディスクイメージ・ログを退避</li>
              <li>・<strong>復旧計画:</strong> バックアップの汚染検査、クリーン環境での段階的再構築、最新セキュリティパッチ適用</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-purple-500/30">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-sm mb-2">
              <Briefcase className="w-4 h-4" />
              <span>マネジメントチーム（経営層・広報・法務）</span>
            </div>
            <ul className="space-y-1.5 text-slate-300">
              <li>・<strong>体制構築:</strong> 経営緊急会議を開催し、指揮系統を一本化して現場の混乱を防止</li>
              <li>・<strong>業務判断:</strong> リスクベースでのシステム停止・継続判断、BCP（手動・代替業務）への切り替え</li>
              <li>・<strong>対外統制:</strong> 未確定情報の拡散を抑え、サイバー保険・弁護士・公的機関（警察/IPA）と適時連携</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Section 2: Flow and Branching */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8 shadow-xl">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-amber-400" />
          <span>2. イベントの流れとルート分岐</span>
        </h2>
        <div className="space-y-4 text-xs text-slate-300">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
            <div className="font-mono font-bold text-amber-400 shrink-0">イベント1</div>
            <div>
              <div className="font-bold text-white text-sm mb-0.5">状況発生・初動対応（～3時間以内）</div>
              <p>感染兆候の検知と初動。ネットワーク隔離と緊急指揮体制の即時立ち上げが勝負を分けます。</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
            <div className="font-mono font-bold text-amber-400 shrink-0">イベント2</div>
            <div>
              <div className="font-bold text-white text-sm mb-0.5">封じ込め継続（～24時間以内）</div>
              <p>感染の横展開（ラテラルムーブメント）阻止、バックアップ健全性確認、外部支援の正式要請。</p>
            </div>
          </div>

          {/* Branch indicator */}
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30">
            <div className="font-bold text-amber-300 mb-1 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>イベント2終了後のルート分岐条件</span>
            </div>
            <p className="leading-relaxed">
              イベント1・2における2チームの合計得点が基準値（140点 / 200点）以上の場合は、感染の局所化に成功したとして<strong>「イベント3A: 調査・復旧計画」</strong>へ進みます。
              基準値未満、あるいは危険なトラップカードを選択した場合は二次被害が発生し、<strong>「イベント3B: 危機的な状況」</strong>へ分岐します。
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
              <div className="font-bold text-emerald-400 mb-0.5">イベント3A: 調査・復旧計画</div>
              <p className="text-[11px] text-slate-300">
                早期封じ込め成功ルート。侵入経路特定、マルウェア挙動解析、クリーン環境での段階的復旧計画策定。
              </p>
            </div>
            <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30">
              <div className="font-bold text-rose-400 mb-0.5">イベント3B: 危機的な状況</div>
              <p className="text-[11px] text-slate-300">
                危機発生ルート。重要サーバー波及、BCP手動代替運用、フォレンジック緊急要請、公的通報（警察・IPA）。
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
            <div className="font-mono font-bold text-amber-400 shrink-0">イベント4</div>
            <div>
              <div className="font-bold text-white text-sm mb-0.5">復旧・再稼働（3～7日以内）</div>
              <p>テスト環境検証、セキュリティパッチ適用、認証情報の刷新、復旧確認会議と全社振り返り。</p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Endings */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8 shadow-xl">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          <span>3. 2つのエンディング</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30">
            <div className="font-bold text-emerald-400 text-sm mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>エンディング1: 早期封じ込め・段階的な再開</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              初動3時間〜24時間の正確な技術的遮断と経営陣の統制により、最悪の基幹網停止を回避。完全な安全確認を経て業務を再開した最善のシナリオです。
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/30">
            <div className="font-bold text-indigo-400 text-sm mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>エンディング2: フォレンジック対応</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              深刻な危機的状況に追い込まれながらも、証跡保全（電源保持・ログ保全）を徹底し、外部フォレンジックおよび公的機関との連携により事態を収束させた危機克服シナリオです。
            </p>
          </div>
        </div>
      </div>

      {/* Section 4: Star Priority Framework */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
          <span>4. アクション優先度（★～★★★）の基準</span>
        </h2>
        <div className="space-y-3 text-xs text-slate-300">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-500/30 flex items-start gap-3">
            <span className="font-mono text-base font-bold text-amber-400 tracking-wider shrink-0">★★★</span>
            <div>
              <div className="font-bold text-white text-sm mb-0.5">最優先・即時実施アクション</div>
              <p className="text-slate-300 leading-relaxed">
                感染拡大の直接的遮断（端末隔離・共有停止・特権アカウント一時制御）、経営緊急対策本部の立ち上げ、および安全性が担保された段階的復旧の最終承認など、1分1秒を争う致命的クリティカルタスク。
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-cyan-500/30 flex items-start gap-3">
            <span className="font-mono text-base font-bold text-cyan-400 tracking-wider shrink-0">★★</span>
            <div>
              <div className="font-bold text-white text-sm mb-0.5">高優先・重点対応アクション</div>
              <p className="text-slate-300 leading-relaxed">
                証跡保全（電源保持・ディスクイメージ取得・ログ退避）、バックアップの健全性検査、侵入経路・マルウェア解析、外部専門機関（SOC/フォレンジック）や法務・保険会社との連携など、的確な意思決定と再発防止の基盤となるタスク。
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
            <span className="font-mono text-base font-bold text-slate-400 tracking-wider shrink-0">★</span>
            <div>
              <div className="font-bold text-white text-sm mb-0.5">重要・後続支援・教訓化アクション</div>
              <p className="text-slate-300 leading-relaxed">
                社内メッセージ発信や広報文の準備、対応記録・経緯の整理、継続的な監視体制の導入、全社的な事後振り返りと再発防止計画の策定など、組織全体のガバナンスと復旧を支えるタスク。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
