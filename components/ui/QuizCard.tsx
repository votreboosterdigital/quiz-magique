'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Question } from '@/types';
import { slideInRight, fadeInUp } from '@/lib/utils/animations';
import { soundManager } from '@/lib/utils/soundManager';
import { SpellEffect, FloatingPoints } from './SpellEffect';
import { ProgressBar } from './ProgressBar';

interface Props {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  onAnswer: (correct: boolean, points: number) => void;
  disabled?: boolean;
}

type ButtonState = 'idle' | 'correct' | 'wrong' | 'revealed';

export function QuizCard({ question, questionIndex, totalQuestions, onAnswer, disabled }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [states, setStates] = useState<ButtonState[]>(['idle', 'idle', 'idle', 'idle']);
  const [showEffect, setShowEffect] = useState(false);
  const [effectType, setEffectType] = useState<'correct' | 'wrong'>('correct');
  const [showPoints, setShowPoints] = useState(false);
  const [shakeCard, setShakeCard] = useState(false);
  const answered = selected !== null;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleAnswer = useCallback(
    (idx: number) => {
      if (answered || disabled) return;
      setSelected(idx);

      const isCorrect = idx === question.correct;

      const newStates: ButtonState[] = question.options.map((_, i) => {
        if (i === question.correct) return 'revealed';
        if (i === idx && !isCorrect) return 'wrong';
        return 'idle';
      });
      if (isCorrect) newStates[idx] = 'correct';
      setStates(newStates);

      setEffectType(isCorrect ? 'correct' : 'wrong');
      setShowEffect(true);

      if (isCorrect) {
        soundManager.play('correct');
        setShowPoints(true);
        setTimeout(() => setShowPoints(false), 1400);
      } else {
        soundManager.play('wrong');
        setShakeCard(true);
        setTimeout(() => setShakeCard(false), 600);
      }

      timerRef.current = setTimeout(() => {
        setShowEffect(false);
        onAnswer(isCorrect, isCorrect ? question.points : 0);
      }, isCorrect ? 1200 : 1800);
    },
    [answered, disabled, question, onAnswer]
  );

  const btnClass = (i: number): string => {
    const base = 'answer-btn';
    switch (states[i]) {
      case 'correct': return `${base} answer-btn-correct`;
      case 'wrong': return `${base} answer-btn-wrong ${shakeCard ? 'shake' : ''}`;
      case 'revealed': return `${base} answer-btn-revealed`;
      default: return `${base} answer-btn-idle`;
    }
  };

  const LABELS = ['A', 'B', 'C', 'D'];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        variants={slideInRight}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="relative magic-card p-5 w-full max-w-lg mx-auto"
      >
        <SpellEffect active={showEffect} type={effectType} />
        <FloatingPoints points={question.points} show={showPoints} />

        {/* Header */}
        <div className="mb-4">
          <ProgressBar
            current={questionIndex}
            total={totalQuestions}
            label={`Question ${questionIndex + 1} / ${totalQuestions}`}
          />
        </div>

        {/* Question */}
        <motion.div
          variants={fadeInUp}
          className="mb-6"
        >
          {question.emoji && (
            <div className="text-4xl mb-3 text-center" aria-hidden="true">
              {question.emoji}
            </div>
          )}
          <p className="text-white font-nunito font-bold text-xl leading-snug text-center">
            {question.question}
          </p>
        </motion.div>

        {/* Options */}
        <div className="grid grid-cols-1 gap-3">
          {question.options.map((option, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.06 }}
            >
              <button
                className={btnClass(i)}
                onClick={() => handleAnswer(i)}
                disabled={answered}
                aria-label={`Réponse ${LABELS[i]}: ${option}`}
              >
                <span className="inline-flex items-center gap-3">
                  <span
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-black"
                    style={{
                      background: states[i] === 'correct' ? '#22c55e'
                        : states[i] === 'wrong' ? '#ef4444'
                        : states[i] === 'revealed' ? '#22c55e'
                        : 'rgba(255,215,0,0.2)',
                      color: states[i] !== 'idle' ? 'white' : '#FFD700',
                    }}
                  >
                    {states[i] === 'correct' ? '✓'
                      : states[i] === 'wrong' ? '✗'
                      : states[i] === 'revealed' ? '✓'
                      : LABELS[i]}
                  </span>
                  <span>{option}</span>
                </span>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Explanation */}
        <AnimatePresence>
          {answered && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-3 rounded-xl text-sm font-semibold"
              style={{
                background: selected === question.correct
                  ? 'rgba(34,197,94,0.15)'
                  : 'rgba(239,68,68,0.15)',
                border: `1px solid ${selected === question.correct ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)'}`,
                color: selected === question.correct ? '#86efac' : '#fca5a5',
              }}
            >
              💡 {question.explanation}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
