import type { Badge, AppState } from '@/types';

interface BadgeDefinition extends Badge {
  condition: (state: AppState) => boolean;
}

function totalCorrect(state: AppState): number {
  return Object.values(state.subjectProgress).reduce((sum, p) => sum + (p?.correct ?? 0), 0);
}

function totalCompleted(state: AppState): number {
  return Object.values(state.subjectProgress).reduce((sum, p) => sum + (p?.completed ?? 0), 0);
}

export const ALL_BADGES: BadgeDefinition[] = [
  {
    id: 'first-spell',
    emoji: '🌟',
    name: 'Premier Sort',
    description: 'Première bonne réponse !',
    condition: (s) => totalCorrect(s) >= 1,
  },
  {
    id: 'bookworm',
    emoji: '📚',
    name: 'Rat de Bibliothèque',
    description: '50 questions Français correctes',
    condition: (s) => (s.subjectProgress['fr-francais']?.correct ?? 0) >= 50,
  },
  {
    id: 'arithmancy',
    emoji: '➕',
    name: 'Arithmancie',
    description: '50 questions Maths correctes',
    condition: (s) => (s.subjectProgress['fr-math']?.correct ?? 0) >= 50,
  },
  {
    id: 'streak-3',
    emoji: '🔥',
    name: '3 Jours de Suite',
    description: 'Jouer 3 jours consécutifs',
    condition: (s) => s.streakDays >= 3,
  },
  {
    id: 'mention-bien',
    emoji: '🏆',
    name: 'Mention Très Bien',
    description: '90% ou plus dans un quiz',
    condition: (s) =>
      Object.values(s.subjectProgress).some((p) => p && p.completed >= 5 && p.correct / p.completed >= 0.9),
  },
  {
    id: 'master-wizard',
    emoji: '🧙',
    name: 'Maître Sorcier',
    description: '500 points au total',
    condition: (s) => s.totalPoints >= 500,
  },
  {
    id: 'bilingual',
    emoji: '🌍',
    name: 'Bilingue',
    description: 'Compléter un quiz FR ET un quiz EN',
    condition: (s) =>
      (s.subjectProgress['fr-math']?.completed ?? 0) > 0 ||
      (s.subjectProgress['fr-francais']?.completed ?? 0) > 0
        ? ((s.subjectProgress['en-english']?.completed ?? 0) > 0 ||
           (s.subjectProgress['en-general']?.completed ?? 0) > 0) &&
          ((s.subjectProgress['fr-math']?.completed ?? 0) > 0 ||
           (s.subjectProgress['fr-francais']?.completed ?? 0) > 0)
        : false,
  },
  {
    id: 'hp-fan',
    emoji: '⚡',
    name: 'Fan de Poudlard',
    description: '10 questions Harry Potter correctes',
    condition: (s) => (s.subjectProgress['hp-trivia']?.correct ?? 0) >= 10,
  },
  {
    id: 'bsc-fan',
    emoji: '📱',
    name: 'Membre du Club',
    description: '10 questions Baby-Sitters Club correctes',
    condition: (s) => (s.subjectProgress['bsc-trivia']?.correct ?? 0) >= 10,
  },
  {
    id: 'curious',
    emoji: '🔭',
    name: 'Curieuse',
    description: '10 questions Culture Générale correctes',
    condition: (s) => (s.subjectProgress['en-general']?.correct ?? 0) >= 10,
  },
  {
    id: 'streak-7',
    emoji: '🌈',
    name: 'Une Semaine Magique',
    description: 'Jouer 7 jours consécutifs',
    condition: (s) => s.streakDays >= 7,
  },
  {
    id: 'level-5',
    emoji: '🦋',
    name: 'Sorcière Niveau 5',
    description: 'Atteindre le niveau 5',
    condition: (s) => s.level >= 5,
  },
  {
    id: 'century',
    emoji: '💯',
    name: 'Centenaire',
    description: '100 bonnes réponses au total',
    condition: (s) => totalCorrect(s) >= 100,
  },
  {
    id: 'explorer',
    emoji: '🗺️',
    name: 'Exploratrice',
    description: 'Essayer les 6 catégories',
    condition: (s) =>
      ['fr-math', 'fr-francais', 'en-english', 'en-general', 'hp-trivia', 'bsc-trivia'].every(
        (subj) => (s.subjectProgress[subj as keyof typeof s.subjectProgress]?.completed ?? 0) > 0
      ),
  },
  {
    id: 'thousand',
    emoji: '💎',
    name: 'Diamant',
    description: '1000 points magiques',
    condition: (s) => s.totalPoints >= 1000,
  },
];

export function getBadgeById(id: string): BadgeDefinition | undefined {
  return ALL_BADGES.find((b) => b.id === id);
}
