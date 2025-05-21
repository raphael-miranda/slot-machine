export type Symbol = 'C' | 'L' | 'O' | 'W';

export interface GameSession {
  id: string;
  credits: number;
  isActive: boolean;
}

export interface RollResult {
  symbols: string[];
  creditsWon: number;
  totalCredits: number;
}