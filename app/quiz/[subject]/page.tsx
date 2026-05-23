'use client';

import { use, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store/useAppStore';
import { QuizCard } from '@/components/ui/QuizCard';
import { BadgeModal } from '@/components/ui/BadgeModal';
import { Confetti } from '@/components/ui/Confetti';
import { StarsBackground } from '@/components/ui/StarsBackground';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { getQuestions } from '@/lib/questions';
import { SUBJECTS } from '@/lib/utils/subjects';
import { soundManager } from '@/lib/utils/soundManager';
import { scaleIn, fadeInUp } from '@/lib/utils/animations';
import type { Subject, Question } from '@/types';

const QUESTIONS_PER_QUIZ = 10;

interface ResultsScreenProps {
  score: number;
  total: number;
  totalPoints: number;
  onReplay: () => void;
  onHome: () => void;
  subjectLabel: string;
}

function ResultsScreen({ score, total, totalPoints, onReplay, onHome, subjectLabel }: ResultsScreenProps) {
  const pct = Math.round((score / total) * 100);
  const emoji = pct >= 90 ? '🏆' : pct >= 70 ? '⭐' : pct >= 50 ? '👍' : '💪';
  const msg =
    pct >= 90 ? 'Incroyable ! Tu es une vraie sorcière !' :
    pct >= 70 ? 'Très bien ! Continue comme ça !' :
    pct >= 50 ? 'Pas mal ! Tu progresses !' :
    'Continue de pratiquer, tu vas y arriver !';

  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      animate="visible"
      className="magic-card p-6 text-center space-y-4 max-w-sm mx-auto"
    >
      <div className="text-6xl">{emoji}</div>
      <h2 className="font-magic text-2xl text-gold-glow">{subjectLabel}</h2>
      <p className="text-white/80 text-base">{msg}</p>

      <div className="flex items-center justify-center gap-6 py-2">
        <div className="text-center">
          <div className="font-black text-4xl text-white">{score}/{total}</div>
          <div className="text-xs text-white/60">bonnes réponses</div>
        </div>
        <div className="w-px h-12 bg-white/20" />
        <div className="text-center">
          <div className="font-black text-4xl text-yellow-400">+{totalPoints}</div>
          <div className="text-xs text-white/60">points gagnés</div>
        </div>
      </div>

      {/* Stars */}
      <div className="flex justify-center gap-1 text-2xl">
        {[1, 2, 3].map((star) => (
          <motion.span
            key={star}
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: pct >= star * 33 ? 1 : 0.5, rotate: 0 }}
            transition={{ delay: star * 0.15, type: 'spring' }}
            style={{ opacity: pct >= star * 33 ? 1 : 0.3 }}
          >
            ⭐
          </motion.span>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onReplay}
          className="btn-magic flex-1 py-3 rounded-xl font-bold text-base"
          style={{
            background: 'rgba(255,215,0,0.15)',
            border: '2px solid rgba(255,215,0,0.4)',
            color: '#FFD700',
          }}
        >
          🔄 Rejouer
        </button>
        <button
          onClick={onHome}
          className="btn-magic flex-1 py-3 rounded-xl font-bold text-base"
          style={{
            background: 'linear-gradient(135deg, #7B2FBE, #1F4E8C)',
            color: 'white',
          }}
        >
          🏠 Accueil
        </button>
      </div>
    </motion.div>
  );
}

export default function QuizPage({ params }: { params: Promise<{ subject: string }> }) {
  const { subject: subjectParam } = use(params);
  const subject = subjectParam as Subject;

  const router = useRouter();
  const { addPoints, recordAnswer, updateBestScore, checkAndUnlockBadges, settings } = useAppStore();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [phase, setPhase] = useState<'playing' | 'results'>('playing');
  const [showConfetti, setShowConfetti] = useState(false);
  const [newBadgeId, setNewBadgeId] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const subjectMeta = SUBJECTS.find((s) => s.id === subject) ?? SUBJECTS[0];

  useEffect(() => {
    soundManager.setEnabled(settings.soundEnabled);
    const q = getQuestions(subject, QUESTIONS_PER_QUIZ);
    setQuestions(q);
  }, [subject, settings.soundEnabled]);

  const handleAnswer = useCallback(
    (correct: boolean, points: number) => {
      if (processing) return;
      setProcessing(true);

      recordAnswer(subject, correct);

      if (correct) {
        setScore((s) => s + 1);
        setPointsEarned((p) => p + points);
        addPoints(points);
      }

      const nextIdx = currentIdx + 1;

      setTimeout(() => {
        setProcessing(false);

        if (nextIdx >= questions.length) {
          // Quiz terminé
          const finalScore = score + (correct ? 1 : 0);
          const finalPoints = pointsEarned + (correct ? points : 0);
          updateBestScore(subject, finalPoints);

          const unlocked = checkAndUnlockBadges();
          if (unlocked.length > 0) {
            soundManager.play('levelup');
            setShowConfetti(true);
            setNewBadgeId(unlocked[0]);
          } else if (finalScore / questions.length >= 0.7) {
            soundManager.play('levelup');
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 4000);
          }
          setPhase('results');
        } else {
          soundManager.play('sparkle');
          setCurrentIdx(nextIdx);
        }
      }, 50);
    },
    [processing, currentIdx, questions.length, score, pointsEarned, subject, recordAnswer, addPoints, updateBestScore, checkAndUnlockBadges]
  );

  const handleReplay = () => {
    const q = getQuestions(subject, QUESTIONS_PER_QUIZ);
    setQuestions(q);
    setCurrentIdx(0);
    setScore(0);
    setPointsEarned(0);
    setPhase('playing');
    setShowConfetti(false);
    setNewBadgeId(null);
    setProcessing(false);
  };

  if (!questions.length) {
    return (
      <div className="relative min-h-dvh flex flex-col items-center justify-center">
        <StarsBackground />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="text-5xl"
        >
          ✨
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-dvh flex flex-col">
      <StarsBackground />
      <Confetti active={showConfetti} />
      <BadgeModal badgeId={newBadgeId} onClose={() => setNewBadgeId(null)} />

      <Header title={subjectMeta.label} />

      <main className="relative z-10 flex-1 px-4 pt-4 pb-32 max-w-lg mx-auto w-full flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {phase === 'playing' ? (
            <QuizCard
              key={currentIdx}
              question={questions[currentIdx]}
              questionIndex={currentIdx}
              totalQuestions={questions.length}
              onAnswer={handleAnswer}
              disabled={processing}
            />
          ) : (
            <motion.div key="results" variants={fadeInUp} initial="hidden" animate="visible">
              <ResultsScreen
                score={score}
                total={questions.length}
                totalPoints={pointsEarned}
                onReplay={handleReplay}
                onHome={() => router.push('/')}
                subjectLabel={subjectMeta.label}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <BottomNav />
    </div>
  );
}
