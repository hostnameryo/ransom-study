import React from 'react';
import { Volume2, VolumeX, Home } from 'lucide-react';
import { isSoundEnabled, toggleSound } from '../utils/audio';

interface HeaderProps {
  currentTab: 'play' | 'score' | 'library' | 'guide';
  onSelectTab: (tab: 'play' | 'score' | 'library' | 'guide') => void;
  onResetDrill: () => void;
  hasActiveSession: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onResetDrill,
  hasActiveSession,
}) => {
  const [soundOn, setSoundOn] = React.useState(true);

  const handleToggleSound = () => {
    const next = toggleSound();
    setSoundOn(next);
  };

  React.useEffect(() => {
    setSoundOn(isSoundEnabled());
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark */}
        <button
          onClick={onResetDrill}
          className="text-base sm:text-lg font-bold tracking-tight text-white hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 text-left"
          title="トップ画面（演習選択）に戻る"
        >
          ランサムウェア対応訓練シミュレーター
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => onSelectTab('play')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              currentTab === 'play'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
                : 'hover:text-white'
            }`}
          >
            演習プレイ
          </button>
          <button
            onClick={() => onSelectTab('score')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              currentTab === 'score'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
                : 'hover:text-white'
            }`}
          >
            イベント別スコア表
          </button>
          <button
            onClick={() => onSelectTab('library')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              currentTab === 'library'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
                : 'hover:text-white'
            }`}
          >
            カード解説ライブラリ
          </button>
          <button
            onClick={() => onSelectTab('guide')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              currentTab === 'guide'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
                : 'hover:text-white'
            }`}
          >
            演習ガイド
          </button>
        </nav>

        {/* Zone 3: Primary Action & Sound control */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleToggleSound}
            aria-label={soundOn ? '効果音をミュート' : '効果音をオン'}
            className="p-2 text-slate-400 hover:text-slate-200 transition-colors rounded-lg hover:bg-slate-900"
            title={soundOn ? '効果音: オン' : '効果音: オフ'}
          >
            {soundOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-slate-500" />}
          </button>

          <button
            onClick={onResetDrill}
            className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
            title="トップ画面に戻る"
          >
            <Home className="w-3.5 h-3.5 text-amber-400" />
            最初に戻る
          </button>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="md:hidden flex items-center justify-around py-2 px-3 border-t border-slate-800/80 bg-slate-950 text-xs">
        <button
          onClick={() => onSelectTab('play')}
          className={`px-2 py-1 ${currentTab === 'play' ? 'text-amber-400 font-semibold' : 'text-slate-400'}`}
        >
          演習プレイ
        </button>
        <button
          onClick={() => onSelectTab('score')}
          className={`px-2 py-1 ${currentTab === 'score' ? 'text-amber-400 font-semibold' : 'text-slate-400'}`}
        >
          スコア表
        </button>
        <button
          onClick={() => onSelectTab('library')}
          className={`px-2 py-1 ${currentTab === 'library' ? 'text-amber-400 font-semibold' : 'text-slate-400'}`}
        >
          カード解説
        </button>
        <button
          onClick={() => onSelectTab('guide')}
          className={`px-2 py-1 ${currentTab === 'guide' ? 'text-amber-400 font-semibold' : 'text-slate-400'}`}
        >
          演習ガイド
        </button>
      </div>
    </header>
  );
};
