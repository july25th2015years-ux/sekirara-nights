import React from 'react';
import { X, Compass, MessageCircleHeart, Flame, Wand2, Check, Sparkles, Layers } from 'lucide-react';
import type { DeckSelection, GameSettings } from '../types';

interface ModeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selection: DeckSelection;
  onUpdateSelection: (newSelection: DeckSelection) => void;
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  totalCardsCount: number;
}

export const ModeSelectorModal: React.FC<ModeSelectorModalProps> = ({
  isOpen,
  onClose,
  selection,
  onUpdateSelection,
  settings,
  onUpdateSettings,
  totalCardsCount,
}) => {
  if (!isOpen) return null;

  // チェックボックスの切り替え
  const toggleCategory = (key: keyof DeckSelection) => {
    const next = { ...selection, [key]: !selection[key] };
    // 最低1つは選択されている必要がある
    const hasAny = Object.values(next).some(Boolean);
    if (!hasAny) return;
    onUpdateSelection(next);
  };

  // プリセットショートカット
  const setPreset = (preset: 'all' | 'level1' | 'level2' | 'level3' | 'action_only' | 'intimate' | 'deep') => {
    switch (preset) {
      case 'all':
        onUpdateSelection({ level1: true, level2: true, level3: true, action: true });
        break;
      case 'action_only':
        onUpdateSelection({ level1: false, level2: false, level3: false, action: true });
        break;
      case 'level1':
        onUpdateSelection({ level1: true, level2: false, level3: false, action: false });
        break;
      case 'level2':
        onUpdateSelection({ level1: false, level2: true, level3: false, action: false });
        break;
      case 'level3':
        onUpdateSelection({ level1: false, level2: false, level3: true, action: false });
        break;
      case 'intimate': // Level 2 + スキンシップ
        onUpdateSelection({ level1: false, level2: true, level3: false, action: true });
        break;
      case 'deep': // Level 3 + スキンシップ
        onUpdateSelection({ level1: false, level2: false, level3: true, action: true });
        break;
    }
  };

  const categories: {
    key: keyof DeckSelection;
    title: string;
    count: number;
    sub: string;
    icon: React.ReactNode;
    color: string;
    borderActive: string;
    bgActive: string;
  }[] = [
    {
      key: 'level1',
      title: 'Level 1 : 出会い & 恋愛観',
      count: 30,
      sub: '第一印象やキュンとする瞬間、YES/NOでテンポよく語り合う',
      icon: <Compass className="w-5 h-5 text-rose-300" />,
      color: 'text-rose-200',
      borderActive: 'border-rose-400 bg-rose-950/30',
      bgActive: 'bg-rose-500'
    },
    {
      key: 'level2',
      title: 'Level 2 : 親密さ & 関係性',
      count: 30,
      sub: '普段言えない感謝、好みのスキンシップ、身体の好みに一歩踏み込む',
      icon: <MessageCircleHeart className="w-5 h-5 text-purple-300" />,
      color: 'text-purple-200',
      borderActive: 'border-purple-400 bg-purple-950/30',
      bgActive: 'bg-purple-500'
    },
    {
      key: 'level3',
      title: 'Level 3 : 性の本音 & 夜の過ごし方',
      count: 30,
      sub: '夜の営みの本音、秘密の願望、一番気持ちいい瞬間などのディープな対話',
      icon: <Flame className="w-5 h-5 text-romantic-300" />,
      color: 'text-romantic-200',
      borderActive: 'border-romantic-400 bg-romantic-900/40',
      bgActive: 'bg-romantic-500'
    },
    {
      key: 'action',
      title: 'スキンシップ・アクション',
      count: 30,
      sub: '10秒見つめ合う、耳元で囁く、ハグやキスなどのドキドキ実践ミッション',
      icon: <Wand2 className="w-5 h-5 text-amber-300" />,
      color: 'text-amber-200',
      borderActive: 'border-amber-400 bg-amber-950/30',
      bgActive: 'bg-amber-500'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-romantic-900 to-romantic-950 border border-gold-500/30 p-5 sm:p-6 shadow-2xl">
        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full bg-romantic-800/80 text-gold-300 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ヘッダー */}
        <div className="text-center mb-5">
          <div className="w-10 h-10 rounded-full bg-gold-500/10 border border-gold-500/30 mx-auto flex items-center justify-center mb-2">
            <Layers className="w-5 h-5 text-gold-400" />
          </div>
          <h2 className="font-serif text-lg font-bold gold-gradient-text tracking-wider">
            山札デッキの自由選択
          </h2>
          <p className="text-xs text-romantic-200/70 mt-1">
            遊びたいレベルやスキンシップを自由に組み合わせて選べます
          </p>
        </div>

        {/* クイックプリセット */}
        <div className="mb-4">
          <div className="text-[11px] font-semibold text-gold-400/80 mb-2 uppercase tracking-wider">
            おすすめ組み合わせ
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setPreset('all')}
              className="px-2.5 py-1 rounded-full text-xs bg-romantic-800/80 border border-romantic-700/60 hover:border-gold-400 text-gold-200 transition-colors"
            >
              全部入り (120問)
            </button>
            <button
              type="button"
              onClick={() => setPreset('action_only')}
              className="px-2.5 py-1 rounded-full text-xs bg-amber-950/40 border border-amber-500/40 hover:border-amber-300 text-amber-200 transition-colors font-medium"
            >
              スキンシップのみ (30問)
            </button>
            <button
              type="button"
              onClick={() => setPreset('intimate')}
              className="px-2.5 py-1 rounded-full text-xs bg-purple-950/40 border border-purple-500/40 hover:border-purple-300 text-purple-200 transition-colors"
            >
              Lv.2 ＋ スキンシップ
            </button>
            <button
              type="button"
              onClick={() => setPreset('deep')}
              className="px-2.5 py-1 rounded-full text-xs bg-romantic-900/60 border border-romantic-500/40 hover:border-romantic-300 text-rose-200 transition-colors"
            >
              Lv.3 ＋ スキンシップ
            </button>
          </div>
        </div>

        {/* チェックボックス選択カード群 */}
        <div className="space-y-2.5 mb-5">
          {categories.map((cat) => {
            const isChecked = selection[cat.key];
            return (
              <div
                key={cat.key}
                onClick={() => toggleCategory(cat.key)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 relative select-none ${
                  isChecked
                    ? `${cat.borderActive} shadow-sm`
                    : 'border-romantic-800/80 bg-romantic-950/40 opacity-60 hover:opacity-90'
                }`}
              >
                {/* カスタムチェックボックス */}
                <div
                  className={`mt-0.5 w-5 h-5 rounded-lg flex items-center justify-center shrink-0 border transition-all ${
                    isChecked
                      ? 'bg-gold-500 border-gold-400 text-romantic-950 font-bold'
                      : 'border-romantic-700 bg-romantic-900/70'
                  }`}
                >
                  {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>

                {/* 内容 */}
                <div className="flex-1 pr-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-bold flex items-center gap-1.5 ${cat.color}`}>
                      {cat.icon}
                      {cat.title}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-romantic-900/90 text-gold-300 border border-romantic-700">
                      {cat.count}問
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1 leading-snug">
                    {cat.sub}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* オプション設定 */}
        <div className="border-t border-romantic-800/80 pt-4 mb-5 space-y-2.5 text-xs">
          <div className="flex items-center justify-between p-3 rounded-xl bg-romantic-950/60 border border-romantic-800">
            <span className="text-zinc-300">回答ターン（あなた/相手/2人で）を表示する</span>
            <input
              type="checkbox"
              checked={settings.showTurnIndicator}
              onChange={(e) => onUpdateSettings({ showTurnIndicator: e.target.checked })}
              className="w-4 h-4 accent-gold-500 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* 決定ボタン & 選択枚数表示 */}
        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-gold-500 via-amber-400 to-gold-500 text-romantic-950 font-bold text-sm tracking-wider shadow-glow-gold hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-romantic-950" />
          <span>この組み合わせで遊ぶ（全 {totalCardsCount} 枚）</span>
        </button>
      </div>
    </div>
  );
};
