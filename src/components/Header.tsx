import React from 'react';
import { Sparkles, BookOpen, Settings, Layers, Bookmark } from 'lucide-react';
import type { PlayMode } from '../types';

interface HeaderProps {
  currentMode: PlayMode;
  currentIndex: number;
  totalCards: number;
  favoritesCount: number;
  onOpenRules: () => void;
  onOpenModeSelector: () => void;
  onOpenCustomCards: () => void;
  onOpenFavorites: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  currentIndex,
  totalCards,
  favoritesCount,
  onOpenRules,
  onOpenModeSelector,
  onOpenCustomCards,
  onOpenFavorites,
}) => {
  const getModeLabel = () => {
    switch (currentMode) {
      case 'progressive':
        return 'ステップ進行 (Lv1→3)';
      case 'level1':
        return 'Level 1 : 恋愛観・出会い';
      case 'level2':
        return 'Level 2 : 親密さ・関係性';
      case 'level3':
        return 'Level 3 : 性の本音・夜';
      case 'shuffle':
        return '全シャッフル';
    }
  };

  return (
    <header className="w-full max-w-xl mx-auto px-4 py-3 flex items-center justify-between border-b border-romantic-800/60 backdrop-blur-md sticky top-0 z-30 bg-romantic-950/80">
      {/* ロゴ / タイトル */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-romantic-500 to-gold-500 flex items-center justify-center shadow-glow-gold">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div>
          <h1 className="font-serif text-lg tracking-wider text-gold-300 font-bold leading-none">
            Sekirara <span className="text-romantic-300 font-normal">Nights</span>
          </h1>
          <button
            onClick={onOpenModeSelector}
            className="flex items-center gap-1 text-[11px] text-gold-400/80 hover:text-gold-300 transition-colors mt-0.5"
          >
            <Layers className="w-3 h-3" />
            <span>{getModeLabel()}</span>
            <span className="text-[10px] text-zinc-500">▼</span>
          </button>
        </div>
      </div>

      {/* カード枚数インジケーター & ナビゲーションアイコン */}
      <div className="flex items-center gap-1 sm:gap-2">
        <div className="hidden sm:flex items-center text-[11px] font-serif text-gold-400/70 mr-1 bg-romantic-900/60 px-2.5 py-1 rounded-full border border-romantic-800">
          <span>{currentIndex}</span>
          <span className="mx-1 text-zinc-500">/</span>
          <span>{totalCards}</span>
        </div>

        {/* お気に入り一覧 */}
        <button
          onClick={onOpenFavorites}
          title="お気に入り一覧"
          className="relative p-2 rounded-full text-gold-300/80 hover:text-gold-200 hover:bg-romantic-900/60 active:scale-95 transition-all"
        >
          <Bookmark className="w-5 h-5" />
          {favoritesCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-romantic-500 text-[10px] font-bold text-white rounded-full flex items-center justify-center shadow-sm">
              {favoritesCount}
            </span>
          )}
        </button>

        {/* ルール / ガイド */}
        <button
          onClick={onOpenRules}
          title="遊び方とルール"
          className="p-2 rounded-full text-gold-300/80 hover:text-gold-200 hover:bg-romantic-900/60 active:scale-95 transition-all"
        >
          <BookOpen className="w-5 h-5" />
        </button>

        {/* カスタムカード / 設定 */}
        <button
          onClick={onOpenCustomCards}
          title="カードのカスタマイズ"
          className="p-2 rounded-full text-gold-300/80 hover:text-gold-200 hover:bg-romantic-900/60 active:scale-95 transition-all"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
