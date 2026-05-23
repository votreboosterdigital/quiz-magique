'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  angle: number;
  distance: number;
}

interface Props {
  active: boolean;
  type: 'correct' | 'wrong';
}

const GOLD_COLORS = ['#FFD700', '#FFF176', '#FFECB3', '#FFB300', '#FFF9C4'];
const RED_COLORS = ['#EF4444', '#F97316', '#DC2626', '#FCA5A5'];

export function SpellEffect({ active, type }: Props) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!active) return;
    const colors = type === 'correct' ? GOLD_COLORS : RED_COLORS;
    const count = type === 'correct' ? 16 : 8;

    setParticles(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: 50,
        y: 50,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        angle: (i / count) * 360,
        distance: Math.random() * 60 + 40,
      }))
    );

    const timer = setTimeout(() => setParticles([]), 1000);
    return () => clearTimeout(timer);
  }, [active, type]);

  return (
    <AnimatePresence>
      {particles.map((p) => {
        const rad = (p.angle * Math.PI) / 180;
        const tx = Math.cos(rad) * p.distance;
        const ty = Math.sin(rad) * p.distance;

        return (
          <motion.div
            key={p.id}
            className="absolute pointer-events-none rounded-full"
            style={{
              width: p.size,
              height: p.size,
              background: p.color,
              top: `${p.y}%`,
              left: `${p.x}%`,
              zIndex: 50,
              boxShadow: `0 0 6px ${p.color}`,
            }}
            initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            animate={{ opacity: 0, x: tx, y: ty, scale: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            exit={{}}
          />
        );
      })}
    </AnimatePresence>
  );
}

export function FloatingPoints({ points, show }: { points: number; show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
          initial={{ opacity: 1, y: 0, scale: 1 }}
          animate={{ opacity: 0, y: -80, scale: 1.5 }}
          exit={{}}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          <span className="text-2xl font-black text-gold-glow">
            +{points} ✨
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
