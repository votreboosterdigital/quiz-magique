export type Subject =
  | 'fr-math'
  | 'fr-francais'
  | 'en-english'
  | 'en-general'
  | 'hp-trivia'
  | 'bsc-trivia'
  | 'mix';

export type Difficulty = 1 | 2 | 3;

export type Language = 'fr' | 'en';

export type Character =
  | 'hermione'
  | 'harry'
  | 'ron'
  | 'kristy'
  | 'claudia'
  | 'mary-anne';

export type House =
  | 'gryffindor'
  | 'hufflepuff'
  | 'ravenclaw'
  | 'slytherin'
  | 'bsc-club';

export interface Question {
  id: string;
  subject: Subject;
  language: Language;
  difficulty: Difficulty;
  question: string;
  options: [string, string, string, string];
  correct: 0 | 1 | 2 | 3;
  explanation: string;
  emoji?: string;
  points: number;
}

export interface Badge {
  id: string;
  emoji: string;
  name: string;
  description: string;
  unlockedAt?: number;
}

export interface SubjectProgress {
  completed: number;
  correct: number;
  bestScore: number;
  lastPlayed?: number;
}

export interface AppState {
  character: Character | null;
  house: House;
  totalPoints: number;
  level: number;
  streakDays: number;
  lastPlayedDate: string;
  subjectProgress: Partial<Record<Subject, SubjectProgress>>;
  unlockedBadgeIds: string[];
  settings: {
    soundEnabled: boolean;
    difficulty: 'auto' | Difficulty;
    animationsEnabled: boolean;
  };
}

export interface SubjectMeta {
  id: Subject;
  label: string;
  emoji: string;
  color: string;
  description: string;
  language: Language | 'both';
}
