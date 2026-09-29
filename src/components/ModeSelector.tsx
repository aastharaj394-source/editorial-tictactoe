import React from 'react';
import { motion } from 'framer-motion';
import type { Difficulty, GameMode, Player } from '../types/game';

interface ModeSelectorProps {
  gameMode: GameMode;
  difficulty: Difficulty;
  humanPlayer: Player;
  onSelectMode: (mode: GameMode) => void;
  onSelectDifficulty: (diff: Difficulty) => void;
  onSelectPlayer: (symbol: Player) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  gameMode,
  difficulty,
  humanPlayer,
  onSelectMode,
  onSelectDifficulty,
  onSelectPlayer,
}) => {
  return (
    <div className="space-y-6 py-6 border-y border-white/[0.08]">
      {/* 1. Mode Selector */}
      <div>
        <div className="font-mono-meta text-[10px] text-terracotta tracking-widest mb-3 flex items-center gap-2">
          <span>01 — PROTOCOL SELECTION</span>
          <div className="h-[1px] flex-1 bg-white/[0.08]" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            data-cursor="interactive"
            onClick={() => onSelectMode('pvp')}
            className={`flex items-center justify-between p-3.5 border transition-all text-left font-mono-meta text-xs ${
              gameMode === 'pvp'
                ? 'border-warm-white bg-white/[0.04] text-warm-white'
                : 'border-white/10 text-soft-gray hover:border-white/20 hover:text-warm-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-soft-gray/50">01</span>
              <span>PLAYER VS PLAYER</span>
            </div>
            {gameMode === 'pvp' && (
              <motion.div
                layoutId="mode-indicator"
                className="w-1.5 h-1.5 bg-warm-white"
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              />
            )}
          </button>

          <button
            type="button"
            data-cursor="interactive"
            onClick={() => onSelectMode('pvc')}
            className={`flex items-center justify-between p-3.5 border transition-all text-left font-mono-meta text-xs ${
              gameMode === 'pvc'
                ? 'border-terracotta bg-terracotta/[0.06] text-warm-white'
                : 'border-white/10 text-soft-gray hover:border-white/20 hover:text-warm-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-soft-gray/50">02</span>
              <span>PLAYER VS COMPUTER</span>
            </div>
            {gameMode === 'pvc' && (
              <motion.div
                layoutId="mode-indicator"
                className="w-1.5 h-1.5 bg-terracotta"
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              />
            )}
          </button>
        </div>
      </div>

      {/* 2. Difficulty Selector (if PvC) */}
      {gameMode === 'pvc' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="font-mono-meta text-[10px] text-soft-gray/70 tracking-widest mb-3 flex items-center gap-2">
            <span>02 — AI CALIBRATION</span>
            <div className="h-[1px] flex-1 bg-white/[0.08]" />
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {(
              [
                { id: 'easy', num: '01', label: 'EASY', desc: 'Random moves' },
                { id: 'medium', num: '02', label: 'MEDIUM', desc: 'Semi-strategic' },
                { id: 'hard', num: '03', label: 'HARD', desc: 'Optimal Minimax' },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                data-cursor="interactive"
                onClick={() => onSelectDifficulty(item.id)}
                className={`p-3 border text-left transition-all ${
                  difficulty === item.id
                    ? 'border-terracotta bg-terracotta/[0.06] text-warm-white'
                    : 'border-white/10 text-soft-gray hover:border-white/20 hover:text-warm-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono-meta text-[9px] text-soft-gray/50">{item.num}</span>
                  {difficulty === item.id && <span className="w-1 h-1 rounded-full bg-terracotta" />}
                </div>
                <div className="font-mono-meta text-xs tracking-wider font-semibold">{item.label}</div>
                <div className="text-[10px] text-soft-gray/60 tracking-tight mt-0.5 hidden sm:block">
                  {item.desc}
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* 3. Player Symbol Selection */}
      <div>
        <div className="font-mono-meta text-[10px] text-soft-gray/70 tracking-widest mb-3 flex items-center gap-2">
          <span>03 — PRIMARY MARK</span>
          <div className="h-[1px] flex-1 bg-white/[0.08]" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            data-cursor="interactive"
            onClick={() => onSelectPlayer('X')}
            className={`flex items-center justify-between p-3 border transition-all text-left font-mono-meta text-xs ${
              humanPlayer === 'X'
                ? 'border-warm-white bg-white/[0.04] text-warm-white'
                : 'border-white/10 text-soft-gray hover:border-white/20 hover:text-warm-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-warm-white">X</span>
              <span className="text-[10px] tracking-wider">OFF-WHITE PIECE</span>
            </div>
            {humanPlayer === 'X' && <span className="w-1.5 h-1.5 bg-warm-white" />}
          </button>

          <button
            type="button"
            data-cursor="interactive"
            onClick={() => onSelectPlayer('O')}
            className={`flex items-center justify-between p-3 border transition-all text-left font-mono-meta text-xs ${
              humanPlayer === 'O'
                ? 'border-terracotta bg-terracotta/[0.06] text-warm-white'
                : 'border-white/10 text-soft-gray hover:border-white/20 hover:text-warm-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-terracotta">O</span>
              <span className="text-[10px] tracking-wider">TERRACOTTA PIECE</span>
            </div>
            {humanPlayer === 'O' && <span className="w-1.5 h-1.5 bg-terracotta" />}
          </button>
        </div>
      </div>
    </div>
  );
};
