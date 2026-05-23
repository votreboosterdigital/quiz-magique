'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { getBadgeById } from '@/lib/utils/badges';
import { scaleIn } from '@/lib/utils/animations';
import { Confetti } from './Confetti';

interface Props {
  badgeId: string | null;
  onClose: () => void;
}

export function BadgeModal({ badgeId, onClose }: Props) {
  const badge = badgeId ? getBadgeById(badgeId) : null;

  return (
    <>
      <Confetti active={!!badgeId} />
      <AnimatePresence>
        {badge && (
          <>
            <motion.div
              className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
            <motion.div
              className="fixed inset-0 z-[95] flex items-center justify-center p-4"
              onClick={onClose}
            >
              <motion.div
                variants={scaleIn}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={(e) => e.stopPropagation()}
                className="magic-card p-8 max-w-sm w-full text-center"
                style={{ boxShadow: '0 0 60px rgba(255,215,0,0.4)' }}
              >
                <div className="mb-4 text-xs font-bold tracking-widest uppercase text-yellow-400 font-magic">
                  ✨ Badge Débloqué ! ✨
                </div>

                <motion.div
                  className="text-7xl mb-4 badge-pulse inline-block"
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.6 }}
                >
                  {badge.emoji}
                </motion.div>

                <h2 className="font-magic text-2xl text-gold-glow mb-2">
                  {badge.name}
                </h2>

                <p className="text-white/80 text-base mb-6 font-nunito">
                  {badge.description}
                </p>

                <button
                  onClick={onClose}
                  className="btn-magic w-full py-3 rounded-xl font-bold text-lg"
                  style={{
                    background: 'linear-gradient(135deg, #FFD700, #B8860B)',
                    color: '#1A0A2E',
                  }}
                >
                  Super ! 🎉
                </button>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
