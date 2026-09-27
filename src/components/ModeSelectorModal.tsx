import React from 'react';
import { X, Layers, Compass, MessageCircleHeart, Flame, Shuffle, Check, Wand2, UserCheck } from 'lucide-react';
import type { PlayMode, GameSettings } from '../types';

interface ModeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMode: PlayMode;
  onSelectMode: (mode: PlayMode) => void;
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
}

export const ModeSelectorModal: React.FC<ModeSelectorModalProps> = ({
  isOpen,
  onClose,
  currentMode,
  onSelectMode,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  const modes: { id: PlayMode; title: string; subtitle: string; icon: React.ReactNode; color: string }[] = [
    {
      id: 'progressive',
      title: '段階的ステップ進行（おすすめ）',
      subtitle: 'Level 1から順に少しずつ深まり、自然にディープな対話へ導きます',
      icon: <Layers className="w-5 h-5 text-gold-400" />,
      color: 'border-gold-500/50 bg-gradient-to-r from-gold-950/40 to-romantic-900/40'
    },
    {
      id: 'level1',
      title: 'Level 1 : 出会い & 恋愛観',
      subtitle: '第一印象やお互いのキュンとした瞬間など、気軽に楽しむアイスブレイク',
      icon: <Compass className="w-5 h-5 text-rose-400" />,
      color: 'border-rose-500/40 bg-rose-950/20'
    },
    {
      id: 'level2',
      title: 'Level 2 : 親密さ & 関係性',
      subtitle: '感謝の気持ちや身体の好み、普段言えない本音に一歩踏み込む',
      icon: <MessageCircleHeart className="w-5 h-5 text-purple-400" />,
      color: 'border-purple-500/40 bg-purple-950/20'
    },
    {
      id: 'level3',
      title: 'Level 3 : 性の本音 & 夜の過ごし方',
      subtitle: '夜の営みの本音、秘密の願望、試してみたいことなど最もディープな対話',
      icon: <Flame className="w-5 h-5 text-romantic-400" />,
      color: 'border-romantic-500/40 bg-romantic-950/30'
    },
    {
      id: 'shuffle',
      title: '全レベル シャッフル',
      subtitle: 'すべての難易度からランダムにカードが出現します',
      icon: <Shuffle className="w-5 h-5 text-zinc-300" />,
      color: 'border-zinc-700 bg-zinc-900/30'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md max-h-[88vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-romantic-900 to-romantic-950 border border-gold-500/30 p-6 shadow-2xl">
        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full bg-romantic-800/80 text-gold-300 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ヘッダー */}
        <div className="text-center mb-5">
          <h2 className="font-serif text-lg font-bold gold-gradient-text tracking-wider">
            プレイモード選択
          </h2>
          <p className="text-xs text-romantic-200/70 mt-1">
            今夜のシチュエーションに合わせて選択してください
          </p>
        </div>

        {/* モードリスト */}
        <div className="space-y-2.5 mb-6">
          {modes.map((m) => {
            const isSelected = currentMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => {
                  onSelectMode(m.id);
                  onClose();
                }}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3.5 relative ${
                  isSelected ? 'border-gold-400 bg-romantic-800/80 shadow-glow-gold' : `${m.color} hover:border-gold-500/40`
                }`}
              >
                <div className="p-2 rounded-xl bg-romantic-950/70 shrink-0">
                  {m.icon}
                </div>
                <div className="pr-6">
                  <div className="text-sm font-bold text-gold-100 flex items-center gap-1.5">
                    {m.title}
                  </div>
                  <div className="text-xs text-zinc-400 mt-0.5 leading-snug">
                    {m.subtitle}
                  </div>
                </div>

                {isSelected && (
                  <div className="absolute top-4 right-4 text-gold-400">
                    <Check className="w-5 h-5" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* オプション設定 */}
        <div className="border-t border-romantic-800 pt-4 space-y-3">
          <h3 className="text-xs font-bold text-gold-400 tracking-wider uppercase mb-2">
            ゲームオプション
          </h3>

          {/* スキンシップ/アクションカードの有無 */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-romantic-950/60 border border-romantic-800 text-xs">
            <div className="flex items-center gap-2 text-zinc-200">
              <Wand2 className="w-4 h-4 text-amber-400" />
              <span>スキンシップ・アクションカードを含める</span>
            </div>
            <input
              type="checkbox"
              checked={settings.includeActionCards}
              onChange={(e) => onUpdateSettings({ includeActionCards: e.target.checked })}
              className="w-4 h-4 accent-gold-500 rounded cursor-pointer"
            />
          </div>

          {/* ターン表示 */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-romantic-950/60 border border-romantic-800 text-xs">
            <div className="flex items-center gap-2 text-zinc-200">
              <UserCheck className="w-4 h-4 text-rose-400" />
              <span>どちらが先に答えるかターン表示する</span>
            </div>
            <input
              type="checkbox"
              checked={settings.showTurnIndicator}
              onChange={(e) => onUpdateSettings({ showTurnIndicator: e.target.checked })}
              className="w-4 h-4 accent-gold-500 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
