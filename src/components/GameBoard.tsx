import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { BoardState, GameMode, Player, WinnerState } from '../types/game';
import { GameCell } from './GameCell';
import { WinningLine } from './WinningLine';
import { RotateCcw } from 'lucide-react';

interface GameBoardProps {
  board: BoardState;
  winnerState: WinnerState;
  currentTurn: Player;
  isAiThinking: boolean;
  gameMode: GameMode;
  humanPlayer: Player;
  onCellClick: (index: number) => void;
  onRestart: () => void;
  onNewGame: () => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  board,
  winnerState,
  currentTurn,
  isAiThinking,
  gameMode,
  humanPlayer,
  onCellClick,
  onRestart,
  onNewGame,
}) => {
  const isWinning = (index: number): boolean => {
    return !!winnerState.line && winnerState.line.includes(index);
  };

  const isGameOver = winnerState.winner !== null;

  // Determine game over headline
  const getGameOverMessage = () => {
    if (winnerState.winner === 'draw') {
      return {
        eyebrow: 'RESULT // STALEMATE',
        headline: 'MATCH DRAW.',
        subtext: 'No more legal spatial moves remaining.',
      };
    }
    if (gameMode === 'pvc') {
      const isHumanWin = winnerState.winner === humanPlayer;
      return {
        eyebrow: isHumanWin ? 'MATCH OUTCOME // VICTORY' : 'MATCH OUTCOME // DEFEAT',
        headline: isHumanWin ? 'YOU WIN.' : 'AI COMPUTED WIN.',
        subtext: isHumanWin
          ? 'Spatial sequence successfully executed.'
          : 'Recursive minimax found the optimal line.',
      };
    }
    return {
      eyebrow: 'MATCH OUTCOME // VICTORY',
      headline: `PLAYER ${winnerState.winner} WINS.`,
      subtext: `Three marks aligned across the orthogonal matrix.`,
    };
  };

  const outcome = isGameOver ? getGameOverMessage() : null;

  return (
    <div className="relative w-full max-w-[460px] md:max-w-[500px] mx-auto select-none">
      {/* Exterior Architectural Registration Frame */}
      <div className="relative p-2 md:p-3 bg-[#141312] border border-white/[0.08] shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
        {/* Subtle corner ticks */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white/30" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-white/30" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-white/30" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white/30" />

        {/* 3x3 Grid Board Container */}
        <div
          role="grid"
          aria-label="Tic-Tac-Toe Board"
          className="relative grid grid-cols-3 bg-[#11100F] border border-white/[0.06] divide-x divide-y divide-white/[0.08]"
        >
          {board.map((cellValue, idx) => (
            <GameCell
              key={idx}
              index={idx}
              value={cellValue}
              isWinningCell={isWinning(idx)}
              isGameActive={!isGameOver}
              isAiTurn={isAiThinking}
              currentTurn={currentTurn}
              onClick={() => onCellClick(idx)}
            />
          ))}

          {/* Animated Connecting Winning Line */}
          <WinningLine line={winnerState.line} winner={winnerState.winner} />
        </div>

        {/* Game End Editorial Announcement Banner */}
        <AnimatePresence>
          {isGameOver && outcome && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-x-2 md:inset-x-3 bottom-2 md:bottom-3 bg-[#0F0E0D]/95 backdrop-blur-md border-t border-white/20 p-6 flex flex-col justify-between z-30"
            >
              <div className="mb-4">
                <span className="font-mono-meta text-[10px] text-terracotta tracking-widest block mb-1">
                  {outcome.eyebrow}
                </span>
                <h3 className="font-display font-extrabold text-2xl md:text-3xl text-warm-white tracking-tight">
                  {outcome.headline}
                </h3>
                <p className="text-xs text-soft-gray/80 mt-1">{outcome.subtext}</p>
              </div>

              <div className="flex items-center gap-4 pt-3 border-t border-white/[0.08] font-mono-meta text-xs">
                <button
                  type="button"
                  onClick={onNewGame}
                  data-cursor="interactive"
                  className="px-4 py-2 bg-warm-white text-near-black font-semibold tracking-wider hover:bg-white transition-colors"
                >
                  NEXT ROUND
                </button>
                <button
                  type="button"
                  onClick={onRestart}
                  data-cursor="interactive"
                  className="flex items-center gap-2 text-soft-gray hover:text-warm-white transition-colors py-2"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>REPLAY MATCH</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Board bottom metadata strip */}
      <div className="flex items-center justify-between mt-3 px-1 font-mono-meta text-[10px] text-soft-gray/50">
        <div>CANVAS ID: TTT-09</div>
        <div>
          {isAiThinking ? (
            <span className="text-terracotta flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-terracotta animate-ping" />
              MINIMAX RESOLVING
            </span>
          ) : (
            `AWAITING P${currentTurn}`
          )}
        </div>
        <div>GRID 3×3</div>
      </div>
    </div>
  );
};
