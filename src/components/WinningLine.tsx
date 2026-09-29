import React from 'react';
import { motion } from 'framer-motion';
import type { Player } from '../types/game';

interface WinningLineProps {
  line: [number, number, number] | null;
  winner: Player | 'draw' | null;
}

export const WinningLine: React.FC<WinningLineProps> = ({ line, winner }) => {
  if (!line || winner === 'draw' || !winner) return null;

  // Map each line pattern to SVG line percentages
  const getCoordinates = (line: [number, number, number]): { x1: number; y1: number; x2: number; y2: number } => {
    const key = line.join(',');
    switch (key) {
      // Rows
      case '0,1,2':
        return { x1: 8, y1: 16.66, x2: 92, y2: 16.66 };
      case '3,4,5':
        return { x1: 8, y1: 50, x2: 92, y2: 50 };
      case '6,7,8':
        return { x1: 8, y1: 83.33, x2: 92, y2: 83.33 };

      // Columns
      case '0,3,6':
        return { x1: 16.66, y1: 8, x2: 16.66, y2: 92 };
      case '1,4,7':
        return { x1: 50, y1: 8, x2: 50, y2: 92 };
      case '2,5,8':
        return { x1: 83.33, y1: 8, x2: 83.33, y2: 92 };

      // Diagonals
      case '0,4,8':
        return { x1: 10, y1: 10, x2: 90, y2: 90 };
      case '2,4,6':
        return { x1: 90, y1: 10, x2: 10, y2: 90 };

      default:
        return { x1: 0, y1: 0, x2: 0, y2: 0 };
    }
  };

  const coords = getCoordinates(line);
  const strokeColor = winner === 'X' ? '#FAF9F5' : '#B86B53';

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-20"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <defs>
        <filter id="winningGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background glow stroke */}
      <motion.line
        x1={coords.x1}
        y1={coords.y1}
        x2={coords.x2}
        y2={coords.y2}
        stroke={strokeColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity={0.4}
        filter="url(#winningGlow)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Main crisp line */}
      <motion.line
        x1={coords.x1}
        y1={coords.y1}
        x2={coords.x2}
        y2={coords.y2}
        stroke={strokeColor}
        strokeWidth="1.2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  );
};
