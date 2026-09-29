export type Player = 'X' | 'O';
export type CellValue = Player | null;
export type BoardState = CellValue[];

export type GameMode = 'pvp' | 'pvc';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface WinnerState {
  winner: Player | 'draw' | null;
  line: [number, number, number] | null;
}

export interface MatchRecord {
  id: string;
  mode: GameMode;
  difficulty?: Difficulty;
  playerSymbol: Player;
  winner: Player | 'draw';
  movesCount: number;
  timestamp: number;
}

export interface ScoreState {
  playerX: number;
  playerO: number;
  draws: number;
  totalMatches: number;
  currentStreak: {
    winner: Player | null;
    count: number;
  };
}
