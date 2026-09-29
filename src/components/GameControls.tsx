import React from 'react';
import { RotateCcw, Play, Undo2, Sliders } from 'lucide-react';

interface GameControlsProps {
  onRestart: () => void;
  onNewGame: () => void;
  onUndo: () => void;
  canUndo: boolean;
  onOpenModeSelector?: () => void;
  isModeSelectorOpen?: boolean;
}

export const GameControls: React.FC<GameControlsProps> = ({
  onRestart,
  onNewGame,
  onUndo,
  canUndo,
  onOpenModeSelector,
  isModeSelectorOpen = false,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-6 md:gap-8 pt-6 border-t border-white/[0.08] font-mono-meta text-xs">
      {/* Restart match */}
      <button
        type="button"
        onClick={onRestart}
        data-cursor="interactive"
        className="group relative inline-flex items-center gap-2 text-soft-gray hover:text-warm-white transition-all duration-300 py-1 focus:outline-none focus:text-warm-white"
      >
        <RotateCcw className="w-3.5 h-3.5 group-hover:-rotate-90 transition-transform duration-300 text-soft-gray group-hover:text-warm-white" />
        <span className="relative">
          RESTART
          <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-warm-white group-hover:w-full transition-all duration-300" />
        </span>
      </button>

      {/* New game */}
      <button
        type="button"
        onClick={onNewGame}
        data-cursor="interactive"
        className="group relative inline-flex items-center gap-2 text-warm-white font-medium transition-all duration-300 py-1 focus:outline-none focus:text-white"
      >
        <Play className="w-3.5 h-3.5 text-terracotta group-hover:translate-x-0.5 transition-transform" />
        <span className="relative">
          NEW GAME
          <span className="absolute bottom-0 left-0 w-full h-[1px] bg-terracotta/70 group-hover:bg-terracotta transition-colors duration-300" />
        </span>
      </button>

      {/* Undo move */}
      <button
        type="button"
        onClick={onUndo}
        disabled={!canUndo}
        data-cursor={canUndo ? 'interactive' : 'default'}
        className={`group relative inline-flex items-center gap-2 py-1 transition-all duration-300 focus:outline-none ${
          canUndo
            ? 'text-soft-gray hover:text-warm-white cursor-pointer'
            : 'text-soft-gray/30 cursor-not-allowed'
        }`}
      >
        <Undo2 className={`w-3.5 h-3.5 ${canUndo ? 'group-hover:-translate-x-0.5' : ''} transition-transform`} />
        <span className="relative">
          UNDO
          {canUndo && (
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-warm-white group-hover:w-full transition-all duration-300" />
          )}
        </span>
      </button>

      {/* Change Mode toggle */}
      {onOpenModeSelector && (
        <button
          type="button"
          onClick={onOpenModeSelector}
          data-cursor="interactive"
          className="group relative inline-flex items-center gap-2 text-soft-gray hover:text-warm-white transition-all duration-300 py-1 focus:outline-none ml-auto"
        >
          <Sliders className="w-3.5 h-3.5 text-soft-gray group-hover:text-terracotta transition-colors" />
          <span className="relative">
            {isModeSelectorOpen ? 'CLOSE OPTIONS' : 'CONFIG'}
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-terracotta group-hover:w-full transition-all duration-300" />
          </span>
        </button>
      )}
    </div>
  );
};
