'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import type { SubjectMeta } from '@/types';

interface Props {
  subject: SubjectMeta;
  bestScore?: number;
  completed?: number;
  index: number;
}

export function SubjectCard({ subject, bestScore, completed, index }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, type: 'spring', stiffness: 280 }}
      whileTap={{ scale: 0.97 }}
    >
      <Link
        href={`/quiz/${subject.id}`}
        className="block rounded-2xl p-4 transition-all relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${subject.color}22, ${subject.color}11)`,
          border: `2px solid ${subject.color}44`,
        }}
        aria-label={`Jouer : ${subject.label}`}
      >
        <div
          className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity"
          style={{ background: `${subject.color}15` }}
        />

        <div className="relative z-10">
          <div className="text-4xl mb-2 text-center" aria-hidden="true">
            {subject.emoji}
          </div>
          <h3 className="font-bold text-white text-center text-base leading-tight mb-1">
            {subject.label}
          </h3>
          <p className="text-white/60 text-xs text-center leading-tight mb-3">
            {subject.description}
          </p>

          {completed !== undefined && completed > 0 && (
            <div className="flex items-center justify-center gap-2 text-xs">
              <span
                className="px-2 py-0.5 rounded-full font-bold"
                style={{ background: `${subject.color}33`, color: subject.color }}
              >
                {completed} joués
              </span>
              {bestScore !== undefined && bestScore > 0 && (
                <span className="text-yellow-400 font-bold">
                  🏆 {bestScore}pts
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
