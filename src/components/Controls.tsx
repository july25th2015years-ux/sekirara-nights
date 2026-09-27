import React from 'react';
import { ArrowLeft, ArrowRight, RotateCw, ShieldCheck, Sparkles } from 'lucide-react';

interface ControlsProps {
  isFlipped: boolean;
  canGoBack: boolean;
  onFlip: () => void;
  onNext: () => void;
  onPrev: () => void;
  onPass: () => void;
  onShuffle: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  isFlipped,
  canGoBack,
  onFlip,
  onNext,
  onPrev,
  onPass,
  onShuffle,
}) => {
  return (
    <div className="w-full max-w-sm mx-auto mt-4 px-2 select-none">
      {/* メイン操作エリア */}
      <div className="flex items-center justify-between gap-3">
        {/* 前のカードへ戻る */}
        <button
          onClick={onPrev}
          disabled={!canGoBack}
          className={`p-3.5 rounded-2xl border transition-all flex items-center justify-center ${
            canGoBack
              ? 'bg-romantic-900/70 border-romantic-700/60 text-gold-300 hover:bg-romantic-800 hover:border-gold-500/40 active:scale-95'
              : 'bg-romantic-950/40 border-romantic-900/30 text-zinc-600 cursor-not-allowed opacity-50'
          }`}
          title="前のカードに戻る"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* メインアクションボタン */}
        {!isFlipped ? (
          <button
            onClick={onFlip}
            className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-gold-500 via-amber-400 to-gold-500 text-romantic-950 font-bold tracking-wider text-sm shadow-glow-gold hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-romantic-950" />
            <span>カードをめくる</span>
          </button>
        ) : (
          <button
            onClick={onNext}
            className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-romantic-600 via-romantic-500 to-rose-600 text-white font-bold tracking-wider text-sm shadow-glow-crimson hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <span>次のカードを引く</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        )}

        {/* パス（スキップ）ボタン */}
        <button
          onClick={onPass}
          className="p-3.5 rounded-2xl border bg-romantic-900/70 border-romantic-700/60 text-rose-300/90 hover:bg-rose-950/60 hover:border-rose-500/40 hover:text-rose-200 active:scale-95 transition-all flex items-center justify-center group"
          title="パスする（無理に答えず次のカードへ）"
        >
          <ShieldCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* サブ案内テキスト & シャッフルボタン */}
      <div className="flex items-center justify-between mt-3 px-1 text-xs text-zinc-500">
        <span className="flex items-center gap-1 text-[11px] text-zinc-400">
          <ShieldCheck className="w-3.5 h-3.5 text-gold-400/80" />
          答えたくない質問は遠慮なくパスOK
        </span>

        <button
          onClick={onShuffle}
          className="flex items-center gap-1 text-[11px] text-gold-400/70 hover:text-gold-300 transition-colors"
          title="山札をシャッフル"
        >
          <RotateCw className="w-3 h-3" />
          <span>山札をシャッフル</span>
        </button>
      </div>
    </div>
  );
};
