import type { Question, Subject } from '@/types';
import { frMathQuestions } from './fr-math';
import { frFrancaisQuestions } from './fr-francais';
import { enEnglishQuestions } from './en-english';
import { enGeneralQuestions } from './en-general';
import { hpTriviaQuestions } from './hp-trivia';
import { bscTriviaQuestions } from './bsc-trivia';

export const QUESTIONS_BY_SUBJECT: Record<Exclude<Subject, 'mix'>, Question[]> = {
  'fr-math': frMathQuestions,
  'fr-francais': frFrancaisQuestions,
  'en-english': enEnglishQuestions,
  'en-general': enGeneralQuestions,
  'hp-trivia': hpTriviaQuestions,
  'bsc-trivia': bscTriviaQuestions,
};

export function getQuestions(subject: Subject, count = 10): Question[] {
  if (subject === 'mix') {
    const all = Object.values(QUESTIONS_BY_SUBJECT).flat();
    return shuffle(all).slice(0, count);
  }
  const pool = QUESTIONS_BY_SUBJECT[subject] ?? [];
  return shuffle(pool).slice(0, count);
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export { frMathQuestions, frFrancaisQuestions, enEnglishQuestions, enGeneralQuestions, hpTriviaQuestions, bscTriviaQuestions };
