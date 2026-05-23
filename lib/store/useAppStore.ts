'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AppState, Character, House, Subject, SubjectProgress, Difficulty } from '@/types';
import { ALL_BADGES } from '@/lib/utils/badges';

interface AppStore extends AppState {
  setCharacter: (character: Character) => void;
  setHouse: (house: House) => void;
  addPoints: (points: number) => void;
  recordAnswer: (subject: Subject, correct: boolean) => void;
  updateBestScore: (subject: Subject, score: number) => void;
  checkAndUnlockBadges: () => string[];
  toggleSound: () => void;
  setDifficulty: (d: 'auto' | Difficulty) => void;
  toggleAnimations: () => void;
  updateStreak: () => void;
  resetProgress: () => void;
}

const DEFAULT_STATE: AppState = {
  character: null,
  house: 'gryffindor',
  totalPoints: 0,
  level: 1,
  streakDays: 0,
  lastPlayedDate: '',
  subjectProgress: {},
  unlockedBadgeIds: [],
  settings: {
    soundEnabled: true,
    difficulty: 'auto',
    animationsEnabled: true,
  },
};

function calcLevel(points: number): number {
  if (points < 100) return 1;
  if (points < 250) return 2;
  if (points < 500) return 3;
  if (points < 800) return 4;
  if (points < 1200) return 5;
  if (points < 1800) return 6;
  if (points < 2500) return 7;
  if (points < 3500) return 8;
  if (points < 5000) return 9;
  return 10;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...DEFAULT_STATE,

      setCharacter: (character) => {
        const house: House =
          character === 'hermione' ? 'gryffindor'
          : character === 'harry' ? 'gryffindor'
          : character === 'ron' ? 'gryffindor'
          : 'bsc-club';
        set({ character, house });
      },

      setHouse: (house) => set({ house }),

      addPoints: (points) => {
        const newTotal = get().totalPoints + points;
        set({ totalPoints: newTotal, level: calcLevel(newTotal) });
      },

      recordAnswer: (subject, correct) => {
        const prev = get().subjectProgress[subject] ?? { completed: 0, correct: 0, bestScore: 0 };
        const updated: SubjectProgress = {
          ...prev,
          completed: prev.completed + 1,
          correct: prev.correct + (correct ? 1 : 0),
          lastPlayed: Date.now(),
        };
        set((s) => ({
          subjectProgress: { ...s.subjectProgress, [subject]: updated },
        }));
      },

      updateBestScore: (subject, score) => {
        const prev = get().subjectProgress[subject] ?? { completed: 0, correct: 0, bestScore: 0 };
        if (score > prev.bestScore) {
          set((s) => ({
            subjectProgress: {
              ...s.subjectProgress,
              [subject]: { ...prev, bestScore: score },
            },
          }));
        }
      },

      checkAndUnlockBadges: () => {
        const state = get();
        const newlyUnlocked: string[] = [];
        for (const badge of ALL_BADGES) {
          if (!state.unlockedBadgeIds.includes(badge.id)) {
            if (badge.condition(state)) {
              newlyUnlocked.push(badge.id);
            }
          }
        }
        if (newlyUnlocked.length > 0) {
          set((s) => ({
            unlockedBadgeIds: [...s.unlockedBadgeIds, ...newlyUnlocked],
          }));
        }
        return newlyUnlocked;
      },

      toggleSound: () =>
        set((s) => ({ settings: { ...s.settings, soundEnabled: !s.settings.soundEnabled } })),

      setDifficulty: (d) =>
        set((s) => ({ settings: { ...s.settings, difficulty: d } })),

      toggleAnimations: () =>
        set((s) => ({ settings: { ...s.settings, animationsEnabled: !s.settings.animationsEnabled } })),

      updateStreak: () => {
        const today = new Date().toDateString();
        const last = get().lastPlayedDate;
        if (last === today) return;
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        const newStreak = last === yesterday ? get().streakDays + 1 : 1;
        set({ streakDays: newStreak, lastPlayedDate: today });
      },

      resetProgress: () => set(DEFAULT_STATE),
    }),
    {
      name: 'quiz-magique-v1',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
