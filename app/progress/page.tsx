'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAppStore } from '@/lib/store/useAppStore';
import { StarsBackground } from '@/components/ui/StarsBackground';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { ALL_BADGES } from '@/lib/utils/badges';
import { SUBJECTS } from '@/lib/utils/subjects';
import { fadeInUp, staggerChildren } from '@/lib/utils/animations';

const LEVEL_NAMES = [
  '', 'Élève', 'Apprenti·e', 'Initié·e', 'Sorcier·ière',
  'Mage', 'Grand Mage', 'Archimage', 'Légende', 'Maître', 'Grand Maître ✨',
];

const LEVEL_THRESHOLDS = [0, 0, 100, 250, 500, 800, 1200, 1800, 2500, 3500, 5000];

export default function ProgressPage() {
  const { totalPoints, level, streakDays, subjectProgress, unlockedBadgeIds, character } = useAppStore();

  const currentThreshold = LEVEL_THRESHOLDS[level] ?? 0;
  const nextThreshold = LEVEL_THRESHOLDS[level + 1] ?? currentThreshold;
  const progressPct = nextThreshold > currentThreshold
    ? Math.round(((totalPoints - currentThreshold) / (nextThreshold - currentThreshold)) * 100)
    : 100;

  const totalCorrect = Object.values(subjectProgress).reduce((s, p) => s + (p?.correct ?? 0), 0);
  const totalPlayed = Object.values(subjectProgress).reduce((s, p) => s + (p?.completed ?? 0), 0);

  return (
    <div className="relative min-h-dvh flex flex-col">
      <StarsBackground />
      <Header title="Mes Progrès" />

      <main className="relative z-10 flex-1 px-4 pt-4 pb-32 max-w-lg mx-auto w-full space-y-5">

        {/* Level card */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="magic-card p-5 text-center"
        >
          <div className="text-5xl mb-2">
            {character === 'hermione' ? '🧙‍♀️'
              : character === 'harry' ? '⚡'
              : character === 'ron' ? '🧡'
              : character === 'kristy' ? '👑'
              : character === 'claudia' ? '🎨'
              : character === 'mary-anne' ? '📔'
              : '🌟'}
          </div>
          <h2 className="font-magic text-xl text-gold-glow mb-1">
            Niveau {level} — {LEVEL_NAMES[level]}
          </h2>
          <p className="text-white/60 text-sm mb-3">
            {totalPoints} points au total
          </p>

          {/* Level progress bar */}
          <div className="potion-bar w-full mb-1">
            <motion.div
              className="potion-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
          <p className="text-xs text-white/40">
            {progressPct}% vers le niveau {level + 1}
          </p>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              { label: 'Questions', value: totalPlayed, emoji: '📋' },
              { label: 'Correctes', value: totalCorrect, emoji: '✅' },
              { label: 'Jours 🔥', value: streakDays, emoji: '🔥' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl p-2 text-center"
                style={{ background: 'rgba(255,255,255,0.06)' }}
              >
                <div className="text-2xl">{stat.emoji}</div>
                <div className="font-black text-xl text-white">{stat.value}</div>
                <div className="text-xs text-white/50">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Per-subject progress */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
          className="magic-card p-4 space-y-3"
        >
          <h3 className="font-magic text-base text-gold-glow">📊 Par Matière</h3>
          {SUBJECTS.filter((s) => s.id !== 'mix').map((subject) => {
            const prog = subjectProgress[subject.id];
            const pct = prog && prog.completed > 0
              ? Math.round((prog.correct / prog.completed) * 100)
              : 0;
            return (
              <Link key={subject.id} href={`/quiz/${subject.id}`} className="block">
                <div className="flex items-center gap-3">
                  <span className="text-2xl w-8 text-center flex-shrink-0">{subject.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-sm text-white truncate">{subject.label}</span>
                      <span className="text-xs text-white/60 flex-shrink-0 ml-2">
                        {prog?.correct ?? 0}/{prog?.completed ?? 0}
                      </span>
                    </div>
                    <div className="potion-bar">
                      <motion.div
                        className="potion-fill"
                        style={{ background: subject.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                  <span className="text-xs font-bold text-yellow-400 w-10 text-right flex-shrink-0">
                    {pct}%
                  </span>
                </div>
              </Link>
            );
          })}
        </motion.div>

        {/* Badges */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
          className="magic-card p-4"
        >
          <h3 className="font-magic text-base text-gold-glow mb-3">
            🏅 Badges ({unlockedBadgeIds.length}/{ALL_BADGES.length})
          </h3>
          <motion.div
            className="grid grid-cols-3 gap-3"
            variants={staggerChildren}
            initial="hidden"
            animate="visible"
          >
            {ALL_BADGES.map((badge, i) => {
              const unlocked = unlockedBadgeIds.includes(badge.id);
              return (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex flex-col items-center gap-1 p-2 rounded-xl text-center"
                  style={{
                    background: unlocked ? 'rgba(255,215,0,0.12)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${unlocked ? 'rgba(255,215,0,0.4)' : 'rgba(255,255,255,0.08)'}`,
                  }}
                  title={badge.description}
                >
                  <span
                    className="text-3xl"
                    style={{ filter: unlocked ? 'none' : 'grayscale(1) opacity(0.3)' }}
                  >
                    {badge.emoji}
                  </span>
                  <span
                    className="text-xs font-bold leading-tight"
                    style={{ color: unlocked ? '#FFD700' : 'rgba(255,255,255,0.3)' }}
                  >
                    {badge.name}
                  </span>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

      </main>

      <BottomNav />
    </div>
  );
}
