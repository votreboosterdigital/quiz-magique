'use client';

import { useEffect, useRef } from 'react';

export function StarsBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = '';
    const count = 60;

    for (let i = 0; i < count; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      const size = Math.random() * 3 + 1;
      star.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        --duration: ${Math.random() * 3 + 2}s;
        --delay: ${Math.random() * 4}s;
      `;
      container.appendChild(star);
    }

    // Floating gold particles
    for (let i = 0; i < 12; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 6 + 3;
      p.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        background: rgba(255, 215, 0, 0.4);
        --duration: ${Math.random() * 6 + 6}s;
        --delay: ${Math.random() * 5}s;
      `;
      container.appendChild(p);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    />
  );
}
