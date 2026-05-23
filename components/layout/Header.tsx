'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAppStore } from '@/lib/store/useAppStore';

const LEVEL_NAMES = [
  '', 'Élève', 'Apprenti·e', 'Initié·e', 'Sorcier·ière',
  'Mage', 'Grand Mage', 'Archimage', 'Légende', 'Maître', 'Grand Maître ✨',
];

export function Header({ title }: { title?: string }) {
  const { totalPoints, level, character, playerName, settings, toggleSound } = useAppStore();

  const charEmoji =
    character === 'hermione' ? '🧙‍♀️'
    : character === 'harry' ? '⚡'
    : character === 'ron' ? '🧡'
    : character === 'kristy' ? '👑'
    : character === 'claudia' ? '🎨'
    : character === 'mary-anne' ? '📔'
    : '🌟';

  return (
    <header className="sticky top-0 z-40 w-full pt-safe">
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{
          background: 'rgba(13, 2, 33, 0.9)',
          borderBottom: '1px solid rgba(255, 215, 0, 0.15)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Logo / Title */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden="true">✨</span>
          <span className="font-magic text-sm text-gold-glow hidden sm:block">
            {title ?? 'Quiz Magique'}
          </span>
        </Link>

        {/* Center: Level */}
        {character && (
          <motion.div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.25)' }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="text-lg" aria-hidden="true">{charEmoji}</span>
            <div className="flex flex-col leading-none">
              <span className="text-xs text-yellow-400 font-bold">
                {playerName || 'Niv.'} {!playerName && level}
              </span>
              {playerName && <span className="text-xs text-white/60">Niv. {level}</span>}
            </div>
            <span className="text-xs font-black text-yellow-300 ml-1">⚡ {totalPoints}</span>
          </motion.div>
        )}

        {/* Sound toggle */}
        <button
          onClick={toggleSound}
          className="text-2xl p-2 rounded-full transition-all"
          style={{ background: 'rgba(255,255,255,0.05)' }}
          aria-label={settings.soundEnabled ? 'Couper le son' : 'Activer le son'}
        >
          {settings.soundEnabled ? '🔊' : '🔇'}
        </button>
      </div>
    </header>
  );
}
