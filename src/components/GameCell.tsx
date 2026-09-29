import React from 'react';
import { motion } from 'framer-motion';
import type { CellValue, Player } from '../types/game';
import { soundEngine } from '../utils/audio';

interface GameCellProps {
  index: number;
  value: CellValue;
  isWinningCell: boolean;
  isGameActive: boolean;
  isAiTurn: boolean;
  currentTurn: Player;
  onClick: () => void;
}

export const GameCell: React.FC<GameCellProps> = ({
  index,
  value,
  isWinningCell,
  isGameActive,
  isAiTurn,
  currentTurn,
  onClick,
}) => {
  const row = Math.floor(index / 3);
  const col = index % 3;
  const isClickable = !value && isGameActive && !isAiTurn;

  const handleMouseEnter = () => {
    if (isClickable) {
      soundEngine.playHover();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && isClickable) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <button
      type="button"
      role="gridcell"
      aria-label={`Row ${row + 1} Column ${col + 1}${value ? `, marked ${value}` : ', empty'}`}
      aria-disabled={!isClickable}
      data-cursor={isClickable ? 'board-cell' : 'interactive'}
      onClick={isClickable ? onClick : undefined}
      onMouseEnter={handleMouseEnter}
      onKeyDown={handleKeyDown}
      disabled={!isClickable && value !== null}
      className={`group relative aspect-square flex items-center justify-center p-4 md:p-6 transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-terracotta ${
        isWinningCell
          ? 'bg-terracotta/10 shadow-[inset_0_0_24px_rgba(184,107,83,0.15)]'
          : isClickable
          ? 'hover:bg-white/[0.03] cursor-pointer'
          : 'cursor-default'
      }`}
    >
      {/* Subtle coordinate label */}
      <span className="absolute top-2 left-2.5 font-mono-meta text-[9px] text-soft-gray/30 group-hover:text-soft-gray/60 transition-colors pointer-events-none select-none">
        {row},{col}
      </span>

      {/* Ghost preview on hover when empty and clickable */}
      {isClickable && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-20 transition-opacity duration-200 pointer-events-none">
          {currentTurn === 'X' ? (
            <svg viewBox="0 0 100 100" className="w-12 h-12 stroke-warm-white stroke-[8] fill-none">
              <line x1="20" y1="20" x2="80" y2="80" strokeLinecap="round" />
              <line x1="80" y1="20" x2="20" y2="80" strokeLinecap="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 100 100" className="w-12 h-12 stroke-terracotta stroke-[8] fill-none">
              <circle cx="50" cy="50" r="30" strokeLinecap="round" />
            </svg>
          )}
        </div>
      )}

      {/* Render Value (X or O) */}
      {value === 'X' && (
        <motion.div
          initial={{ scale: 0.88, opacity: 0, rotate: -6 }}
          animate={{
            scale: isWinningCell ? [1, 1.08, 1.04] : 1,
            opacity: 1,
            rotate: 0,
          }}
          transition={{
            duration: 0.35,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="relative w-full h-full max-w-[80px] max-h-[80px] flex items-center justify-center"
        >
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full stroke-[7] fill-none stroke-warm-white drop-shadow-[0_2px_12px_rgba(250,249,245,0.15)]"
          >
            <motion.line
              x1="22"
              y1="22"
              x2="78"
              y2="78"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            />
            <motion.line
              x1="78"
              y1="22"
              x2="22"
              y2="78"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.28, delay: 0.08, ease: 'easeOut' }}
            />
          </svg>
        </motion.div>
      )}

      {value === 'O' && (
        <motion.div
          initial={{ scale: 0.88, opacity: 0, rotate: 6 }}
          animate={{
            scale: isWinningCell ? [1, 1.08, 1.04] : 1,
            opacity: 1,
            rotate: 0,
          }}
          transition={{
            duration: 0.35,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="relative w-full h-full max-w-[80px] max-h-[80px] flex items-center justify-center"
        >
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full stroke-[7] fill-none stroke-terracotta drop-shadow-[0_2px_12px_rgba(184,107,83,0.2)]"
          >
            <motion.circle
              cx="50"
              cy="50"
              r="30"
              strokeLinecap="round"
              initial={{ pathLength: 0, rotate: -90 }}
              animate={{ pathLength: 1, rotate: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            />
          </svg>
        </motion.div>
      )}
    </button>
  );
};
