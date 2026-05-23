'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

type Step = 'name' | 'character' | 'subjects';

export default function HomePage() {
  const { playerName, setPlayerName, character, setCharacter, subjectProgress, settings, updateStreak } = useAppStore();
  const [step, setStep] = useState<Step>(() => {
    if (playerName && character) return 'subjects';
    if (playerName) return 'character';
    return 'name';
  });
  const [nameInput, setNameInput] = useState(playerName);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    soundManager.setEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  useEffect(() => {
    updateStreak();
  }, [updateStreak]);

  useEffect(() => {
    if (step === 'name') {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [step]);

  const handleNameSubmit = () => {
    const trimmed = nameInput.trim();
    if (!trimmed) return;
    soundManager.play('sparkle');
    setPlayerName(trimmed);
    setStep('character');
  };

  const handleCharacterSelect = (c: Character) => {
    soundManager.play('sparkle');
    setCharacter(c);
    setTimeout(() => setStep('subjects'), 400);
  };

  return (
    <div className="relative min-h-dvh flex flex-col">
      <StarsBackground />
      <Header />

      <main className="relative z-10 flex-1 px-4 pt-4 pb-32 max-w-lg mx-auto w-full">
        <AnimatePresence mode="wait">

          {/* ── ÉTAPE 1 : Saisie du prénom ── */}
          {step === 'name' && (
            <motion.div
              key="name-step"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6 pt-6"
            >
              <div className="text-center space-y-3">
                <motion.div
                  className="text-6xl"
                  animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  ✨
                </motion.div>
                <h1 className="font-magic text-3xl sm:text-4xl text-gold-glow leading-tight">
                  Quiz Magique
                </h1>
                <p className="text-white/70 text-base">
                  Bienvenue ! Comment tu t&apos;appelles ?
                </p>
              </div>

              <div className="magic-card p-5 space-y-4">
                <label className="block text-white font-bold text-base" htmlFor="player-name">
                  🧙 Ton prénom :
                </label>
                <input
                  ref={inputRef}
                  id="player-name"
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
                  placeholder="Ex : Sofia, Emma, Léa…"
                  maxLength={20}
                  autoComplete="off"
                  className="w-full rounded-xl px-4 py-3 text-xl font-bold outline-none transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '2px solid rgba(255,215,0,0.3)',
                    color: 'white',
                    caretColor: '#FFD700',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'rgba(255,215,0,0.8)')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(255,215,0,0.3)')}
                />

                <motion.button
                  onClick={handleNameSubmit}
                  disabled={!nameInput.trim()}
                  whileTap={{ scale: 0.97 }}
                  className="btn-magic w-full py-4 rounded-2xl font-black text-lg transition-all"
                  style={{
                    background: nameInput.trim()
                      ? 'linear-gradient(135deg, #FFD700, #B8860B)'
                      : 'rgba(255,255,255,0.1)',
                    color: nameInput.trim() ? '#1A0A2E' : 'rgba(255,255,255,0.3)',
                    boxShadow: nameInput.trim() ? '0 0 25px rgba(255,215,0,0.4)' : 'none',
                  }}
                >
                  C&apos;est parti ! 🪄
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ── ÉTAPE 2 : Choix du personnage ── */}
          {step === 'character' && (
            <motion.div
              key="character-step"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6"
            >
              <div className="text-center space-y-2 pt-4">
                <h2 className="font-magic text-2xl sm:text-3xl text-gold-glow leading-tight">
                  Bonjour {playerName} ! 👋
                </h2>
                <p className="text-white/70 text-base">
                  ✨ Choisis ton personnage magique ! ✨
                </p>
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
                  Continuer ! 🪄
                </motion.button>
              )}
            </motion.div>
          )}

          {/* ── ÉTAPE 3 : Choix de matière ── */}
          {step === 'subjects' && (
            <motion.div
              key="subjects-step"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-5"
            >
              <div className="text-center pt-2">
                <h2 className="font-magic text-2xl text-gold-glow mb-1">
                  Bonjour {playerName} ! ✨
                </h2>
                <p className="text-white/60 text-sm">
                  10 questions • Des sorts et des points t&apos;attendent !
                </p>
              </div>

              <motion.div
                className="grid grid-cols-2 gap-3"
                variants={staggerChildren}
                initial="hidden"
                animate="visible"
              >
                {SUBJECTS.map((subject, i) => (
                  <div key={subject.id} onClick={() => soundManager.play('click')}>
                    <SubjectCard
                      subject={subject}
                      index={i}
                      bestScore={subjectProgress[subject.id]?.bestScore}
                      completed={subjectProgress[subject.id]?.completed}
                    />
                  </div>
                ))}
              </motion.div>

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
