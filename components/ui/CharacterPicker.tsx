'use client';

import { motion } from 'framer-motion';
import type { Character } from '@/types';

interface CharacterConfig {
  id: Character;
  name: string;
  emoji: string;
  house: string;
  trait: string;
  color: string;
}

const CHARACTERS: CharacterConfig[] = [
  { id: 'hermione', name: 'Hermione', emoji: '🧙‍♀️', house: 'Gryffondor', trait: 'Intelligente', color: '#B8860B' },
  { id: 'harry', name: 'Harry', emoji: '⚡', house: 'Gryffondor', trait: 'Courageux', color: '#740001' },
  { id: 'ron', name: 'Ron', emoji: '🧡', house: 'Gryffondor', trait: 'Loyal', color: '#CC5500' },
  { id: 'kristy', name: 'Kristy', emoji: '👑', house: 'BSC Club', trait: 'Leader', color: '#FF69B4' },
  { id: 'claudia', name: 'Claudia', emoji: '🎨', house: 'BSC Club', trait: 'Créative', color: '#9B59B6' },
  { id: 'mary-anne', name: 'Mary Anne', emoji: '📔', house: 'BSC Club', trait: 'Sensible', color: '#20B2AA' },
];

interface Props {
  selected: Character | null;
  onSelect: (c: Character) => void;
}

export function CharacterPicker({ selected, onSelect }: Props) {
  return (
    <div className="grid grid-cols-3 gap-3 w-full max-w-md mx-auto">
      {CHARACTERS.map((char, i) => (
        <motion.button
          key={char.id}
          onClick={() => onSelect(char.id)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, type: 'spring', stiffness: 300 }}
          whileTap={{ scale: 0.95 }}
          aria-label={`Choisir ${char.name}`}
          className="relative flex flex-col items-center gap-2 p-3 rounded-2xl transition-all"
          style={{
            background: selected === char.id
              ? `linear-gradient(135deg, ${char.color}44, ${char.color}22)`
              : 'rgba(255,255,255,0.06)',
            border: `2px solid ${selected === char.id ? char.color : 'rgba(255,215,0,0.15)'}`,
            boxShadow: selected === char.id ? `0 0 20px ${char.color}66` : 'none',
          }}
        >
          {selected === char.id && (
            <motion.div
              layoutId="character-select"
              className="absolute inset-0 rounded-2xl"
              style={{ background: `${char.color}11` }}
            />
          )}

          <motion.span
            animate={selected === char.id ? { scale: [1, 1.2, 1] } : { scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-4xl select-none"
            role="img"
            aria-label={char.name}
          >
            {char.emoji}
          </motion.span>

          <span className="font-nunito font-bold text-sm text-white leading-tight text-center">
            {char.name}
          </span>

          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ background: `${char.color}33`, color: char.color }}
          >
            {char.trait}
          </span>
        </motion.button>
      ))}
    </div>
  );
}

export { CHARACTERS };
