'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { href: '/', emoji: '🏠', label: 'Accueil' },
  { href: '/quiz/mix', emoji: '🎲', label: 'Mix' },
  { href: '/progress', emoji: '🏆', label: 'Progrès' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 pb-safe"
      style={{
        background: 'rgba(13, 2, 33, 0.95)',
        borderTop: '1px solid rgba(255, 215, 0, 0.15)',
        backdropFilter: 'blur(12px)',
      }}
      aria-label="Navigation principale"
    >
      <div className="flex items-center justify-around py-2 max-w-lg mx-auto">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all min-w-[72px]"
              style={{
                background: active ? 'rgba(255,215,0,0.12)' : 'transparent',
              }}
              aria-current={active ? 'page' : undefined}
            >
              <motion.span
                className="text-2xl"
                animate={active ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                transition={{ duration: 0.3 }}
                aria-hidden="true"
              >
                {item.emoji}
              </motion.span>
              <span
                className="text-xs font-bold"
                style={{ color: active ? '#FFD700' : 'rgba(255,255,255,0.5)' }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
