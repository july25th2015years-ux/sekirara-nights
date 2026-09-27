export type CardType = 'question' | 'action';

export type CardLevel = 1 | 2 | 3;

export type TurnTarget = 'you' | 'partner' | 'both';

export interface Card {
  id: string;
  type: CardType;
  level: CardLevel;
  category: string;
  question: string;
  subText?: string;
  actionPrompt?: string; // アクションカード用の行動指示
  isCustom?: boolean;
}

export type PlayMode = 'progressive' | 'level1' | 'level2' | 'level3' | 'shuffle';

export interface GameSettings {
  includeActionCards: boolean;
  actionCardProbability: number; // 0.0 - 1.0 (例: 0.2で20%の確率でアクション)
  showTurnIndicator: boolean;
}
