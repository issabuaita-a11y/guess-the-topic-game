export interface Bot {
  id: string;
  name: string;
  avatarColor: string;
  style: 'terse' | 'chatty' | 'formal' | 'casual';
}

export interface Topic {
  id: string;
  label: string;
  hints: string[];
}

export interface Message {
  id: string;
  botId: string;
  text: string;
  timestamp: number;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export enum GamePhase {
  START = 'START',
  DIFFICULTY_SELECT = 'DIFFICULTY_SELECT',
  PLAYING = 'PLAYING',
  ROUND_OVER = 'ROUND_OVER',
}

export type Language = 'en' | 'ar';

export interface GameState {
  phase: GamePhase;
  difficulty: Difficulty;
  language: Language;
  currentTopic: Topic | null;
  options: Topic[]; // The correct topic + distractors
  messages: Message[];
  score: number;
  timeLeft: number;
  round: number;
  isTyping: string[]; // List of bot IDs currently "typing"
  lastResult: 'win' | 'loss' | 'timeout' | null;
  badges: string[];
}