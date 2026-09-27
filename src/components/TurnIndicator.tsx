import React from 'react';
import { User, Users, RefreshCw } from 'lucide-react';
import type { TurnTarget } from '../types';

interface TurnIndicatorProps {
  turn: TurnTarget;
  onNextTurn: () => void;
  visible: boolean;
}

export const TurnIndicator: React.FC<TurnIndicatorProps> = ({ turn, onNextTurn, visible }) => {
  if (!visible) return null;

  const getTurnDetails = () => {
    switch (turn) {
      case 'you':
        return {
          icon: <User className="w-4 h-4 text-rose-300" />,
          label: 'あなたの回答ターン',
          desc: 'あなたから先に本音を話してください',
          badgeClass: 'bg-rose-950/70 border-rose-500/40 text-rose-200'
        };
      case 'partner':
        return {
          icon: <User className="w-4 h-4 text-purple-300" />,
          label: 'パートナーの回答ターン',
          desc: 'お相手から先に本音を聞かせてください',
          badgeClass: 'bg-purple-950/70 border-purple-500/40 text-purple-200'
        };
      case 'both':
        return {
          icon: <Users className="w-4 h-4 text-gold-400" />,
          label: '2人で答えるターン',
          desc: 'お互いの意見や気持ちを語り合いましょう',
          badgeClass: 'bg-gold-950/70 border-gold-500/40 text-gold-200'
        };
    }
  };

  const details = getTurnDetails();

  return (
    <div className="flex items-center justify-center my-3 animate-fade-in">
      <div 
        onClick={onNextTurn}
        className={`group flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs cursor-pointer select-none transition-all shadow-sm hover:scale-105 active:scale-95 ${details.badgeClass}`}
        title="タップで回答ターンを交代"
      >
        <span className="flex items-center justify-center">{details.icon}</span>
        <span className="font-medium tracking-wide">{details.label}</span>
        <RefreshCw className="w-3 h-3 opacity-40 group-hover:opacity-100 transition-opacity ml-1" />
      </div>
    </div>
  );
};
