export type CardType = 'question' | 'action';

export type CardLevel = 1 | 2 | 3;

export type TurnTarget = 'you' | 'partner' | 'both';

export type DeckCategory = 'level1' | 'level2' | 'level3' | 'action';

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

export type PlayMode = 'progressive' | 'level1' | 'level2' | 'level3' | 'action_only' | 'shuffle' | 'custom';

export interface DeckSelection {
  level1: boolean;
  level2: boolean;
  level3: boolean;
  action: boolean;
}

export interface GameSettings {
  showTurnIndicator: boolean;
  shuffleOrder: boolean; // シャッフルするか、レベル順に並べるか
}
