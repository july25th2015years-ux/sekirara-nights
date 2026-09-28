import React from 'react';
import type { Card } from '../types';
import { Sparkles, Heart, Flame, Compass, MessageCircleHeart, Wand2 } from 'lucide-react';

interface CardViewProps {
  card: Card;
  isFlipped: boolean;
  onFlip: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const CardView: React.FC<CardViewProps> = ({
  card,
  isFlipped,
  onFlip,
  isFavorite,
  onToggleFavorite,
}) => {
  const getLevelBadge = () => {
    if (card.type === 'action') {
      return {
        label: 'ACTION CARD',
        sub: 'スキンシップ・実践',
        bg: 'from-amber-600/30 to-amber-900/40',
        border: 'border-amber-400/50',
        text: 'text-amber-300',
        icon: <Wand2 className="w-3.5 h-3.5 text-amber-300" />
      };
    }
    switch (card.level) {
      case 1:
        return {
          label: 'LEVEL 1',
          sub: '出会い & 恋愛観',
          bg: 'from-rose-900/40 to-pink-950/40',
          border: 'border-rose-400/40',
          text: 'text-rose-300',
          icon: <Compass className="w-3.5 h-3.5 text-rose-300" />
        };
      case 2:
        return {
          label: 'LEVEL 2',
          sub: '親密さ & 関係性',
          bg: 'from-purple-900/40 to-indigo-950/40',
          border: 'border-purple-400/40',
          text: 'text-purple-300',
          icon: <MessageCircleHeart className="w-3.5 h-3.5 text-purple-300" />
        };
      case 3:
        return {
          label: 'LEVEL 3',
          sub: '性の本音 & 夜の過ごし方',
          bg: 'from-romantic-600/40 to-red-950/50',
          border: 'border-romantic-400/50',
          text: 'text-romantic-300',
          icon: <Flame className="w-3.5 h-3.5 text-romantic-300" />
        };
    }
  };

  const badge = getLevelBadge();

  return (
    <div className="w-full max-w-sm mx-auto aspect-[1/1.45] sm:aspect-[1/1.4] perspective-1000 select-none">
      <div
        onClick={onFlip}
        style={{
          transformStyle: 'preserve-3d',
          WebkitTransformStyle: 'preserve-3d',
        }}
        className={`relative w-full h-full duration-700 transform-style-3d cursor-pointer transition-transform ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* ========================================================
            カード裏面（BACK）: 初期表示、タップしてめくる面
            ======================================================== */}
        <div
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(0deg) translate3d(0, 0, 1px)',
            WebkitTransform: 'rotateY(0deg) translate3d(0, 0, 1px)',
          }}
          className={`absolute inset-0 w-full h-full rounded-3xl p-4 sm:p-5 card-face-back shadow-card-elevated border border-gold-500/30 bg-gradient-to-br from-romantic-900 via-romantic-950 to-[#0e040c] overflow-hidden flex flex-col items-center justify-between transition-opacity duration-300 ${
            isFlipped ? 'opacity-0 pointer-events-none z-0' : 'opacity-100 z-10'
          }`}
        >
          {/* 背景の装飾ライン */}
          <div className="absolute inset-2 rounded-2xl border border-gold-500/20 pointer-events-none" />
          <div className="absolute inset-3.5 rounded-xl border border-gold-400/10 pointer-events-none" />
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-romantic-600/15 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-gold-600/10 rounded-full blur-2xl pointer-events-none" />

          {/* 上部ヘッダー（レベル表示） */}
          <div className="w-full flex items-center justify-between z-10 pt-1">
            <span className="text-[10px] tracking-widest text-gold-400/60 uppercase font-serif">
              Sekirara for Adults
            </span>
            <span className="text-[10px] tracking-widest text-gold-400/60 uppercase font-serif">
              {badge.label}
            </span>
          </div>

          {/* 中央のエンブレムデザイン */}
          <div className="flex flex-col items-center justify-center z-10 my-auto text-center space-y-4">
            <div className="relative w-24 h-24 rounded-full border-2 border-gold-400/30 bg-gradient-to-b from-romantic-800/50 to-romantic-950/80 flex items-center justify-center shadow-glow-gold group">
              <div className="absolute inset-1 rounded-full border border-gold-300/20" />
              {card.type === 'action' ? (
                <Wand2 className="w-10 h-10 text-gold-300 animate-pulse-subtle" />
              ) : (
                <Sparkles className="w-10 h-10 text-gold-300 animate-pulse-subtle" />
              )}
            </div>

            <div>
              <p className="font-serif text-2xl font-bold tracking-widest gold-gradient-text">
                SEKIRARA
              </p>
              <p className="text-[11px] tracking-widest text-romantic-200/70 mt-0.5 font-light">
                {badge.sub}
              </p>
            </div>
          </div>

          {/* 下部のアクションガイダンス */}
          <div className="z-10 pb-2 text-center">
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-romantic-900/60 border border-gold-500/20 text-gold-300/90 text-xs shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span className="tracking-wide">タップしてめくる</span>
            </div>
          </div>
        </div>

        {/* ========================================================
            カード表面（FRONT）: 質問・アクション内容が表示される面
            ======================================================== */}
        <div
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg) translate3d(0, 0, 1px)',
            WebkitTransform: 'rotateY(180deg) translate3d(0, 0, 1px)',
          }}
          className={`absolute inset-0 w-full h-full rounded-3xl p-5 sm:p-6 card-face-front shadow-card-elevated border border-gold-500/40 bg-gradient-to-br from-[#1a0a17] via-romantic-950 to-[#10050e] flex flex-col justify-between overflow-hidden transition-opacity duration-300 ${
            isFlipped ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
          }`}
        >
          {/* 枠線装飾 */}
          <div className="absolute inset-2 rounded-2xl border border-gold-500/20 pointer-events-none" />
          <div className="absolute inset-3.5 rounded-xl border border-gold-400/10 pointer-events-none" />

          {/* カード上部情報バー */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${badge.bg} ${badge.border} ${badge.text}`}
              >
                {badge.icon}
                {badge.label}
              </span>
              <span className="text-[11px] text-zinc-400 bg-romantic-900/60 px-2 py-0.5 rounded border border-romantic-800">
                {card.category}
              </span>
            </div>

            {/* お気に入りトグルボタン */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite();
              }}
              className="p-1.5 rounded-full bg-romantic-900/80 border border-romantic-700/60 hover:border-rose-400/60 transition-colors active:scale-90"
              title={isFavorite ? 'お気に入りから外す' : 'お気に入りに保存'}
            >
              <Heart
                className={`w-4 h-4 transition-all ${
                  isFavorite ? 'fill-rose-500 text-rose-500 scale-110' : 'text-zinc-400 hover:text-rose-300'
                }`}
              />
            </button>
          </div>

          {/* カード中央コンテンツ（質問またはアクション） */}
          <div className="relative z-10 my-auto py-2 flex flex-col justify-center">
            {card.type === 'action' && (
              <div className="mb-2 inline-flex items-center gap-1.5 text-xs text-amber-300 bg-amber-950/60 border border-amber-500/30 px-3 py-1 rounded-full w-fit">
                <Wand2 className="w-3.5 h-3.5" />
                <span className="font-semibold tracking-wide">スキンシップミッション</span>
              </div>
            )}

            <p className="font-serif text-lg sm:text-xl text-gold-100 font-medium leading-relaxed tracking-wide text-left sm:text-justify mb-3">
              {card.question}
            </p>

            {card.subText && (
              <div className="mt-2 p-3 rounded-xl bg-romantic-900/40 border border-romantic-800/60 text-xs text-romantic-200/80 leading-relaxed text-left">
                {card.subText}
              </div>
            )}
          </div>

          {/* カード下部フッター（ヒント） */}
          <div className="relative z-10 pt-2 border-t border-gold-500/15 flex items-center justify-between text-[11px] text-zinc-400">
            <span className="font-serif italic text-gold-400/60">
              {card.isCustom ? '★ オリジナルカード' : 'Sekirara for Adults'}
            </span>
            <span className="text-[10px] text-zinc-400">
              タップで裏返す
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
