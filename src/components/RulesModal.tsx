import React from 'react';
import { X, ShieldCheck, HeartHandshake, EyeOff, Sparkles, Wand2 } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
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
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-gold-500/10 border border-gold-500/30 mx-auto flex items-center justify-center mb-2">
            <Sparkles className="w-6 h-6 text-gold-400" />
          </div>
          <h2 className="font-serif text-xl font-bold gold-gradient-text tracking-wider">
            HOW TO PLAY
          </h2>
          <p className="text-xs text-romantic-200/70 mt-1">
            2人の夜を心地よく深める3つの約束
          </p>
        </div>

        {/* 3つの大切なお約束 */}
        <div className="space-y-4 mb-6">
          <div className="p-4 rounded-2xl bg-romantic-950/60 border border-romantic-800 flex items-start gap-3.5">
            <div className="p-2 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gold-200">1. パスはいつでも自由</h3>
              <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                話したくないことや、まだ心の準備ができていない質問は、ペナルティなく自由に「パス（スキップ）」できます。無理に答える必要はありません。
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-romantic-950/60 border border-romantic-800 flex items-start gap-3.5">
            <div className="p-2 rounded-xl bg-romantic-500/20 border border-romantic-500/30 text-rose-300 shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-rose-200">2. 相手の本音を否定しない</h3>
              <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                普段言いづらい好感やフェチ、願望を打ち明けてくれた相手の勇気を受け止め、興味を持って耳を傾けてください。
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-romantic-950/60 border border-romantic-800 flex items-start gap-3.5">
            <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300 shrink-0">
              <EyeOff className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-purple-200">3. 2人だけの秘密にする</h3>
              <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                この場で交わした会話や告白は、他の誰にも言わない2人だけの秘密として大切に胸にしまっておきましょう。
              </p>
            </div>
          </div>
        </div>

        {/* カードの構成ガイド */}
        <div className="border-t border-romantic-800 pt-5">
          <h4 className="text-xs font-bold text-gold-400/90 tracking-wider uppercase mb-3 text-center">
            カードのレベル構成
          </h4>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-rose-950/30 border border-rose-500/30">
              <div className="font-bold text-rose-300">Level 1</div>
              <div className="text-[10px] text-zinc-400 mt-0.5">出会い & 恋愛観</div>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-500/30">
              <div className="font-bold text-purple-300">Level 2</div>
              <div className="text-[10px] text-zinc-400 mt-0.5">親密さ & 関係性</div>
            </div>
            <div className="p-2.5 rounded-xl bg-romantic-900/40 border border-romantic-500/40">
              <div className="font-bold text-romantic-300">Level 3</div>
              <div className="text-[10px] text-zinc-400 mt-0.5">性の本音 & 夜</div>
            </div>
          </div>

          <div className="mt-3 p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-center gap-2.5 text-xs text-amber-200">
            <Wand2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              たまに出現する「アクションカード」は、質問だけでなくスキンシップの実践ミッションです。
            </span>
          </div>
        </div>

        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          className="w-full mt-6 py-3 rounded-2xl bg-gradient-to-r from-gold-500 to-amber-500 text-romantic-950 font-bold text-sm tracking-wider hover:opacity-95 transition-opacity"
        >
          理解して始める
        </button>
      </div>
    </div>
  );
};
