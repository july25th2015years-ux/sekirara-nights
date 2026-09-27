import React from 'react';
import { X, Heart, Trash2, ArrowUpRight } from 'lucide-react';
import type { Card } from '../types';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: Card[];
  onSelectFavorite: (card: Card) => void;
  onRemoveFavorite: (cardId: string) => void;
}

export const FavoritesModal: React.FC<FavoritesModalProps> = ({
  isOpen,
  onClose,
  favorites,
  onSelectFavorite,
  onRemoveFavorite,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md max-h-[85vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-romantic-900 to-romantic-950 border border-gold-500/30 p-6 shadow-2xl">
        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full bg-romantic-800/80 text-gold-300 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ヘッダー */}
        <div className="text-center mb-5">
          <div className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/30 mx-auto flex items-center justify-center mb-2">
            <Heart className="w-5 h-5 text-rose-400 fill-rose-400" />
          </div>
          <h2 className="font-serif text-lg font-bold gold-gradient-text tracking-wider">
            お気に入りカード
          </h2>
          <p className="text-xs text-romantic-200/70 mt-1">
            保存した質問（全 {favorites.length} 件）
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="py-12 text-center text-zinc-400 text-xs">
            <Heart className="w-8 h-8 text-zinc-600 mx-auto mb-2 opacity-50" />
            <p>まだお気に入りに登録されたカードはありません。</p>
            <p className="text-[11px] text-zinc-500 mt-1">
              カード表面のハートマークを押して保存できます。
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {favorites.map((card) => (
              <div
                key={card.id}
                className="p-3.5 rounded-2xl bg-romantic-950/70 border border-romantic-800/80 hover:border-gold-500/40 transition-all flex flex-col justify-between gap-2"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="px-2 py-0.5 rounded-full bg-romantic-900 text-gold-300 border border-romantic-700">
                    {card.type === 'action' ? 'アクション' : `Level ${card.level}`} • {card.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onRemoveFavorite(card.id)}
                      className="p-1 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                      title="お気に入りから削除"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="font-serif text-xs sm:text-sm text-gold-100 font-medium leading-relaxed">
                  {card.question}
                </p>

                <div className="pt-2 border-t border-romantic-900 flex justify-end">
                  <button
                    onClick={() => {
                      onSelectFavorite(card);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1 text-[11px] text-gold-400 hover:text-gold-200 font-medium transition-colors"
                  >
                    <span>このカードをいま開く</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
