'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store/useAppStore';
import { CharacterPicker } from '@/components/ui/CharacterPicker';
import { SubjectCard } from '@/components/ui/SubjectCard';
import { StarsBackground } from '@/components/ui/StarsBackground';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { SUBJECTS } from '@/lib/utils/subjects';
import { soundManager } from '@/lib/utils/soundManager';
import { fadeInUp, staggerChildren } from '@/lib/utils/animations';
import type { Character } from '@/types';

export default function HomePage() {
  const { character, setCharacter, subjectProgress, settings, updateStreak } = useAppStore();
  const [step, setStep] = useState<'character' | 'subjects'>(character ? 'subjects' : 'character');
  const router = useRouter();

  useEffect(() => {
    soundManager.setEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  useEffect(() => {
    updateStreak();
  }, [updateStreak]);

  const handleCharacterSelect = (c: Character) => {
    soundManager.play('sparkle');
    setCharacter(c);
    setTimeout(() => setStep('subjects'), 400);
  };

  const handleSubjectClick = () => {
    soundManager.play('click');
  };

  return (
    <div className="relative min-h-dvh flex flex-col">
      <StarsBackground />
      <Header />

      <main className="relative z-10 flex-1 px-4 pt-4 pb-32 max-w-lg mx-auto w-full">
        <AnimatePresence mode="wait">
          {step === 'character' ? (
            <motion.div
              key="character-step"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6"
            >
              {/* Title */}
              <div className="text-center space-y-2 pt-4">
                <motion.h1
                  className="font-magic text-3xl sm:text-4xl text-gold-glow leading-tight"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  Quiz Magique
                </motion.h1>
                <motion.p
                  className="text-white/70 text-base"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  ✨ Choisis ton personnage pour commencer ! ✨
                </motion.p>
              </div>

              <CharacterPicker selected={character} onSelect={handleCharacterSelect} />

              {character && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => setStep('subjects')}
                  className="btn-magic w-full py-4 rounded-2xl font-black text-lg"
                  style={{
                    background: 'linear-gradient(135deg, #FFD700, #B8860B)',
                    color: '#1A0A2E',
                    boxShadow: '0 0 25px rgba(255,215,0,0.4)',
                  }}
                >
                  C&apos;est parti ! 🪄
                </motion.button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="subjects-step"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-5"
            >
              {/* Welcome back */}
              <div className="text-center pt-2">
                <h2 className="font-magic text-2xl text-gold-glow mb-1">
                  Choisis ta matière !
                </h2>
                <p className="text-white/60 text-sm">
                  10 questions • Des sorts et des points t&apos;attendent ✨
                </p>
              </div>

              {/* Subject grid */}
              <motion.div
                className="grid grid-cols-2 gap-3"
                variants={staggerChildren}
                initial="hidden"
                animate="visible"
              >
                {SUBJECTS.map((subject, i) => (
                  <div key={subject.id} onClick={handleSubjectClick}>
                    <SubjectCard
                      subject={subject}
                      index={i}
                      bestScore={subjectProgress[subject.id]?.bestScore}
                      completed={subjectProgress[subject.id]?.completed}
                    />
                  </div>
                ))}
              </motion.div>

              {/* Change character */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                onClick={() => setStep('character')}
                className="w-full text-center text-white/40 text-sm py-2 hover:text-white/70 transition-colors"
              >
                Changer de personnage
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <BottomNav />
    </div>
  );
}
