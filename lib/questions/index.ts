import type { Question, Subject } from '@/types';
import { frMathQuestions } from './fr-math';
import { frMathQuestions2 } from './fr-math-2';
import { frFrancaisQuestions } from './fr-francais';
import { frFrancaisQuestions2 } from './fr-francais-2';
import { enEnglishQuestions } from './en-english';
import { enEnglishQuestions2 } from './en-english-2';
import { enGeneralQuestions } from './en-general';
import { enGeneralQuestions2 } from './en-general-2';
import { hpTriviaQuestions } from './hp-trivia';
import { hpTriviaQuestions2 } from './hp-trivia-2';
import { bscTriviaQuestions } from './bsc-trivia';
import { bscTriviaQuestions2 } from './bsc-trivia-2';

export const QUESTIONS_BY_SUBJECT: Record<Exclude<Subject, 'mix'>, Question[]> = {
  'fr-math': [...frMathQuestions, ...frMathQuestions2],
  'fr-francais': [...frFrancaisQuestions, ...frFrancaisQuestions2],
  'en-english': [...enEnglishQuestions, ...enEnglishQuestions2],
  'en-general': [...enGeneralQuestions, ...enGeneralQuestions2],
  'hp-trivia': [...hpTriviaQuestions, ...hpTriviaQuestions2],
  'bsc-trivia': [...bscTriviaQuestions, ...bscTriviaQuestions2],
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

export { frMathQuestions, frFrancaisQuestions, enEnglishQuestions, enGeneralQuestions, hpTriviaQuestions, bscTriviaQuestions, frMathQuestions2, frFrancaisQuestions2, enEnglishQuestions2, enGeneralQuestions2, hpTriviaQuestions2, bscTriviaQuestions2 };
