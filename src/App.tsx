import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { INITIAL_CARDS } from './data/cards';
import type { Card, PlayMode, GameSettings, TurnTarget } from './types';
import { Header } from './components/Header';
import { CardView } from './components/CardView';
import { TurnIndicator } from './components/TurnIndicator';
import { Controls } from './components/Controls';
import { RulesModal } from './components/RulesModal';
import { ModeSelectorModal } from './components/ModeSelectorModal';
import { FavoritesModal } from './components/FavoritesModal';
import { CustomCardModal } from './components/CustomCardModal';
import confetti from 'canvas-confetti';

const STORAGE_KEY_CUSTOM = 'sekirara_custom_cards';
const STORAGE_KEY_FAVORITES = 'sekirara_favorites';
const STORAGE_KEY_SETTINGS = 'sekirara_settings';

export const App: React.FC = () => {
  // --- 状態管理 ---
  const [customCards, setCustomCards] = useState<Card[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CUSTOM);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [favorites, setFavorites] = useState<Card[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FAVORITES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [settings, setSettings] = useState<GameSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      return saved
        ? JSON.parse(saved)
        : {
            includeActionCards: true,
            actionCardProbability: 0.15,
            showTurnIndicator: true,
          };
    } catch {
      return {
        includeActionCards: true,
        actionCardProbability: 0.15,
        showTurnIndicator: true,
      };
    }
  });

  const [mode, setMode] = useState<PlayMode>('progressive');
  const [deck, setDeck] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [turn, setTurn] = useState<TurnTarget>('you');
  const [passNotice, setPassNotice] = useState(false);

  // モーダル管理
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isModeOpen, setIsModeOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isCustomOpen, setIsCustomOpen] = useState(false);

  // 初回訪問フラグ（初回のみルールを表示）
  useEffect(() => {
    const hasVisited = localStorage.getItem('sekirara_visited');
    if (!hasVisited) {
      setIsRulesOpen(true);
      localStorage.setItem('sekirara_visited', 'true');
    }
  }, []);

  // 永続化保存
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CUSTOM, JSON.stringify(customCards));
  }, [customCards]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  }, [settings]);

  // 全カード（初期データ ＋ カスタムカード）
  const allCards = useMemo(() => {
    return [...INITIAL_CARDS, ...customCards];
  }, [customCards]);

  // シャッフル関数（Fisher-Yates）
  const shuffleArray = <T,>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  // デッキ生成ロジック
  const buildDeck = useCallback(
    (selectedMode: PlayMode) => {
      // アクションカードのフィルタリング
      const filterActions = (cards: Card[]) => {
        if (settings.includeActionCards) return cards;
        return cards.filter((c) => c.type !== 'action');
      };

      let result: Card[] = [];

      if (selectedMode === 'progressive') {
        // ステップ進行: Level 1 -> Level 2 -> Level 3 の順で各グループをシャッフル
        const l1 = shuffleArray(filterActions(allCards.filter((c) => c.level === 1)));
        const l2 = shuffleArray(filterActions(allCards.filter((c) => c.level === 2)));
        const l3 = shuffleArray(filterActions(allCards.filter((c) => c.level === 3)));
        result = [...l1, ...l2, ...l3];
      } else if (selectedMode === 'level1') {
        result = shuffleArray(filterActions(allCards.filter((c) => c.level === 1)));
      } else if (selectedMode === 'level2') {
        result = shuffleArray(filterActions(allCards.filter((c) => c.level === 2)));
      } else if (selectedMode === 'level3') {
        result = shuffleArray(filterActions(allCards.filter((c) => c.level === 3)));
      } else {
        // shuffle
        result = shuffleArray(filterActions(allCards));
      }

      setDeck(result);
      setCurrentIndex(0);
      setIsFlipped(false);
    },
    [allCards, settings.includeActionCards]
  );

  // モードまたはカード・設定変更時にデッキ再構築
  useEffect(() => {
    buildDeck(mode);
  }, [mode, buildDeck]);

  // 現在のカード
  const currentCard = deck[currentIndex] || deck[0];

  // 次の回答ターンを決定
  const advanceTurn = () => {
    const turns: TurnTarget[] = ['you', 'partner', 'both'];
    setTurn((prev) => {
      const nextIdx = (turns.indexOf(prev) + 1) % turns.length;
      return turns[nextIdx];
    });
  };

  // カードをめくる
  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  // 次のカードへ
  const handleNext = () => {
    if (currentIndex < deck.length - 1) {
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        advanceTurn();
      }, 150);
    } else {
      // 最後のカードの場合、祝祭演出
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#e5aa2b', '#8e2363', '#fedc82'],
      });
      // 最初のカードに戻るか再シャッフル
      buildDeck(mode);
    }
  };

  // 前のカードへ
  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentIndex((prev) => prev - 1);
      }, 150);
    }
  };

  // パス（スキップ）
  const handlePass = () => {
    setPassNotice(true);
    setTimeout(() => {
      setPassNotice(false);
      handleNext();
    }, 600);
  };

  // 山札シャッフル
  const handleShuffle = () => {
    buildDeck(mode);
  };

  // お気に入りトグル
  const handleToggleFavorite = () => {
    if (!currentCard) return;
    const exists = favorites.some((f) => f.id === currentCard.id);
    if (exists) {
      setFavorites((prev) => prev.filter((f) => f.id !== currentCard.id));
    } else {
      setFavorites((prev) => [...prev, currentCard]);
    }
  };

  const isCurrentFavorite = Boolean(
    currentCard && favorites.some((f) => f.id === currentCard.id)
  );

  // カスタムカード追加
  const handleAddCustomCard = (cardData: Omit<Card, 'id' | 'isCustom'>) => {
    const newCard: Card = {
      ...cardData,
      id: `custom-${Date.now()}`,
      isCustom: true,
    };
    setCustomCards((prev) => [newCard, ...prev]);
  };

  // カスタムカード削除
  const handleDeleteCustomCard = (id: string) => {
    setCustomCards((prev) => prev.filter((c) => c.id !== id));
  };

  // リセット
  const handleResetToDefaults = () => {
    if (window.confirm('自作したカードをすべてリセットしますか？')) {
      setCustomCards([]);
    }
  };

  // キーボードショートカット
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // モーダルが開いている場合はスキップ
      if (isRulesOpen || isModeOpen || isFavoritesOpen || isCustomOpen) return;

      if (e.code === 'Space') {
        e.preventDefault();
        handleFlip();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, currentIndex, deck.length, isRulesOpen, isModeOpen, isFavoritesOpen, isCustomOpen]);

  return (
    <div className="min-h-screen romantic-gradient-bg flex flex-col justify-between relative overflow-hidden pb-6">
      {/* 背景のほのかなグローエフェクト */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-romantic-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-gold-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* ヘッダー */}
      <Header
        currentMode={mode}
        currentIndex={currentIndex + 1}
        totalCards={deck.length}
        favoritesCount={favorites.length}
        onOpenRules={() => setIsRulesOpen(true)}
        onOpenModeSelector={() => setIsModeOpen(true)}
        onOpenCustomCards={() => setIsCustomOpen(true)}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
      />

      {/* メインエリア */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 flex flex-col justify-center items-center py-2 relative z-10">
        {/* 進捗カウンター & パス通知 */}
        <div className="w-full flex items-center justify-between px-2 mb-1 text-xs text-gold-400/70 font-serif">
          <span>
            CARD {currentIndex + 1} / {deck.length}
          </span>
          {passNotice && (
            <span className="text-rose-300 font-sans animate-pulse font-medium">
              🕊️ パスしました（次へ進みます）
            </span>
          )}
        </div>

        {/* ターン表示 */}
        <TurnIndicator
          turn={turn}
          onNextTurn={advanceTurn}
          visible={settings.showTurnIndicator}
        />

        {/* 3Dカード表示 */}
        {currentCard ? (
          <CardView
            card={currentCard}
            isFlipped={isFlipped}
            onFlip={handleFlip}
            isFavorite={isCurrentFavorite}
            onToggleFavorite={handleToggleFavorite}
          />
        ) : (
          <div className="py-24 text-center text-zinc-400">
            カードがありません
          </div>
        )}

        {/* コントロールボタン群 */}
        <Controls
          isFlipped={isFlipped}
          canGoBack={currentIndex > 0}
          onFlip={handleFlip}
          onNext={handleNext}
          onPrev={handlePrev}
          onPass={handlePass}
          onShuffle={handleShuffle}
        />
      </main>

      {/* モーダル群 */}
      <RulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />

      <ModeSelectorModal
        isOpen={isModeOpen}
        onClose={() => setIsModeOpen(false)}
        currentMode={mode}
        onSelectMode={(newMode) => setMode(newMode)}
        settings={settings}
        onUpdateSettings={(newSettings) => setSettings((s) => ({ ...s, ...newSettings }))}
      />

      <FavoritesModal
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites}
        onSelectFavorite={(card) => {
          // お気に入りカードをデッキの先頭に挿入して即時表示
          setDeck([card, ...deck.filter((c) => c.id !== card.id)]);
          setCurrentIndex(0);
          setIsFlipped(true);
        }}
        onRemoveFavorite={(cardId) => {
          setFavorites((prev) => prev.filter((f) => f.id !== cardId));
        }}
      />

      <CustomCardModal
        isOpen={isCustomOpen}
        onClose={() => setIsCustomOpen(false)}
        customCards={customCards}
        onAddCard={handleAddCustomCard}
        onDeleteCard={handleDeleteCustomCard}
        onResetToDefaults={handleResetToDefaults}
      />
    </div>
  );
};

export default App;
