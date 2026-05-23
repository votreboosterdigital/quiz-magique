'use client';

import { motion } from 'framer-motion';

interface Props {
  current: number;
  total: number;
  label?: string;
}

export function ProgressBar({ current, total, label }: Props) {
  const pct = Math.min(100, Math.round((current / total) * 100));

  return (
    <div className="w-full space-y-1">
      {label && (
        <div className="flex justify-between items-center text-sm font-semibold text-white/70">
          <span>{label}</span>
          <span>{current} / {total}</span>
        </div>
      )}
      <div className="potion-bar w-full">
        <motion.div
          className="potion-fill"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
