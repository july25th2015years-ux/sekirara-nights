import React, { useState } from 'react';
import { X, Plus, Trash2, Wand2, HelpCircle, Layers } from 'lucide-react';
import type { Card, CardLevel, CardType } from '../types';

interface CustomCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  customCards: Card[];
  onAddCard: (card: Omit<Card, 'id' | 'isCustom'>) => void;
  onDeleteCard: (id: string) => void;
  onResetToDefaults: () => void;
}

export const CustomCardModal: React.FC<CustomCardModalProps> = ({
  isOpen,
  onClose,
  customCards,
  onAddCard,
  onDeleteCard,
  onResetToDefaults,
}) => {
  const [activeTab, setActiveTab] = useState<'add' | 'list'>('add');
  const [cardType, setCardType] = useState<CardType>('question');
  const [level, setLevel] = useState<CardLevel>(2);
  const [category, setCategory] = useState('2人の本音');
  const [question, setQuestion] = useState('');
  const [subText, setSubText] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    onAddCard({
      type: cardType,
      level,
      category: category.trim() || (cardType === 'action' ? 'アクション' : 'オリジナル'),
      question: question.trim(),
      subText: subText.trim() || undefined,
    });

    // フォームリセット
    setQuestion('');
    setSubText('');
    setActiveTab('list');
  };

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
            オリジナルカード管理
          </h2>
          <p className="text-xs text-romantic-200/70 mt-1">
            2人だけの特別な質問やスキンシップミッションを追加
          </p>
        </div>

        {/* タブ切り替え */}
        <div className="flex rounded-xl bg-romantic-950/80 p-1 border border-romantic-800 mb-5">
          <button
            onClick={() => setActiveTab('add')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'add'
                ? 'bg-romantic-800 text-gold-200 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>新しいカードを作る</span>
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'list'
                ? 'bg-romantic-800 text-gold-200 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>自作カード一覧 ({customCards.length})</span>
          </button>
        </div>

        {/* 作成フォーム */}
        {activeTab === 'add' && (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* カードの種類 */}
            <div>
              <label className="block text-zinc-300 mb-1.5 font-medium">カードの種類</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCardType('question')}
                  className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                    cardType === 'question'
                      ? 'border-gold-500 bg-gold-500/10 text-gold-200 font-semibold'
                      : 'border-romantic-800 bg-romantic-950/60 text-zinc-400'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>対話・質問カード</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCardType('action')}
                  className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                    cardType === 'action'
                      ? 'border-amber-400 bg-amber-500/10 text-amber-200 font-semibold'
                      : 'border-romantic-800 bg-romantic-950/60 text-zinc-400'
                  }`}
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>アクションミッション</span>
                </button>
              </div>
            </div>

            {/* レベル選択 */}
            <div>
              <label className="block text-zinc-300 mb-1.5 font-medium">難易度レベル</label>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[1, 2, 3].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setLevel(lvl as CardLevel)}
                    className={`py-2 rounded-xl border transition-all ${
                      level === lvl
                        ? 'border-gold-500 bg-romantic-800 text-gold-200 font-semibold'
                        : 'border-romantic-800 bg-romantic-950/60 text-zinc-400'
                    }`}
                  >
                    Level {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* カテゴリ */}
            <div>
              <label className="block text-zinc-300 mb-1.5 font-medium">カテゴリ名</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="例: スキンシップ, 夜の営み, 秘密の願望"
                className="w-full px-3 py-2.5 rounded-xl bg-romantic-950/80 border border-romantic-800 text-gold-100 placeholder:text-zinc-600 focus:outline-none focus:border-gold-500"
              />
            </div>

            {/* 質問またはアクション内容 */}
            <div>
              <label className="block text-zinc-300 mb-1.5 font-medium">
                {cardType === 'question' ? '質問文' : 'アクション・ミッション内容'} <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={
                  cardType === 'question'
                    ? '例: 実はずっとやってみたかった夜のシチュエーションはある？'
                    : '例: 相手の好きなところを3つ耳元で囁いてからハグする'
                }
                className="w-full px-3 py-2.5 rounded-xl bg-romantic-950/80 border border-romantic-800 text-gold-100 placeholder:text-zinc-600 focus:outline-none focus:border-gold-500 resize-none font-serif text-sm"
              />
            </div>

            {/* 補足ヒント */}
            <div>
              <label className="block text-zinc-300 mb-1.5 font-medium">補足や問いかけのヒント（任意）</label>
              <input
                type="text"
                value={subText}
                onChange={(e) => setSubText(e.target.value)}
                placeholder="例: 率直な好みを恥ずかしがらずに教えて"
                className="w-full px-3 py-2 rounded-xl bg-romantic-950/80 border border-romantic-800 text-gold-100 placeholder:text-zinc-600 focus:outline-none focus:border-gold-500 text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-gold-500 to-amber-500 text-romantic-950 font-bold text-sm tracking-wider hover:opacity-95 transition-opacity mt-4"
            >
              カードを山札に追加する
            </button>
          </form>
        )}

        {/* 自作カード一覧 */}
        {activeTab === 'list' && (
          <div>
            {customCards.length === 0 ? (
              <div className="py-12 text-center text-zinc-400 text-xs">
                <p>自作したカードはまだありません。</p>
                <p className="text-[11px] text-zinc-500 mt-1">
                  「新しいカードを作る」タブから自由に追加できます。
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                {customCards.map((card) => (
                  <div
                    key={card.id}
                    className="p-3 rounded-2xl bg-romantic-950/70 border border-romantic-800 flex items-start justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 text-[10px] text-gold-400 mb-1">
                        <span className="px-1.5 py-0.5 rounded bg-romantic-900 border border-romantic-700">
                          {card.type === 'action' ? 'アクション' : `Level ${card.level}`}
                        </span>
                        <span>{card.category}</span>
                      </div>
                      <p className="font-serif text-xs text-gold-100 font-medium">
                        {card.question}
                      </p>
                      {card.subText && (
                        <p className="text-[10px] text-zinc-400 mt-0.5">{card.subText}</p>
                      )}
                    </div>
                    <button
                      onClick={() => onDeleteCard(card.id)}
                      className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors shrink-0"
                      title="削除"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-romantic-800 flex items-center justify-between">
              <span className="text-[11px] text-zinc-500">初期状態に戻す</span>
              <button
                type="button"
                onClick={onResetToDefaults}
                className="text-[11px] text-rose-400/80 hover:text-rose-300 transition-colors"
              >
                自作カードを全削除してリセット
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
