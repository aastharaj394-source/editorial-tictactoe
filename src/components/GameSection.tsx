import React, { useState } from 'react';
import type { BoardState, Difficulty, GameMode, Player, ScoreState, WinnerState } from '../types/game';
import { GameBoard } from './GameBoard';
import { GameControls } from './GameControls';
import { ModeSelector } from './ModeSelector';

interface GameSectionProps {
  board: BoardState;
  winnerState: WinnerState;
  currentTurn: Player;
  humanPlayer: Player;
  gameMode: GameMode;
  difficulty: Difficulty;
  isAiThinking: boolean;
  matchNumber: number;
  scores: ScoreState;
  canUndo: boolean;
  onCellClick: (index: number) => void;
  onRestart: () => void;
  onNewGame: () => void;
  onUndo: () => void;
  onSelectMode: (mode: GameMode) => void;
  onSelectDifficulty: (diff: Difficulty) => void;
  onSelectPlayer: (symbol: Player) => void;
}

export const GameSection: React.FC<GameSectionProps> = ({
  board,
  winnerState,
  currentTurn,
  humanPlayer,
  gameMode,
  difficulty,
  isAiThinking,
  matchNumber,
  scores,
  canUndo,
  onCellClick,
  onRestart,
  onNewGame,
  onUndo,
  onSelectMode,
  onSelectDifficulty,
  onSelectPlayer,
}) => {
  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false);

  // Pad numbers with leading zero for editorial look
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

  return (
    <section
      id="game-board"
      className="relative py-20 md:py-28 border-b border-white/[0.08] bg-[#0F0E0D] overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-white/[0.015] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono-meta text-xs text-terracotta tracking-widest">
                02 — THE BOARD
              </span>
              <div className="h-[1px] w-10 bg-terracotta/40" />
            </div>

            <h2 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl text-warm-white uppercase tracking-tight leading-[0.95]">
              MAKE
              <br />
              YOUR MOVE<span className="text-terracotta">.</span>
            </h2>
          </div>

          <div className="flex items-center gap-8 font-mono-meta text-xs text-soft-gray border-l border-white/10 pl-6">
            <div>
              <span className="text-[10px] text-soft-gray/50 block mb-0.5">PROTOCOL</span>
              <span className="text-warm-white font-medium uppercase">
                {gameMode === 'pvp' ? 'PVP LOCAL' : `AI / ${difficulty.toUpperCase()}`}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-soft-gray/50 block mb-0.5">ROUND</span>
              <span className="text-warm-white font-medium">#{pad(matchNumber)}</span>
            </div>
          </div>
        </div>

        {/* Asymmetrical Composition: Left Meta + Center Board + Right Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-14 items-start">
          {/* Left Column: Match Status & Metadata */}
          <div className="lg:col-span-3 flex flex-col justify-between space-y-8 order-2 lg:order-1">
            {/* Current Turn Badge */}
            <div className="p-5 border border-white/[0.08] bg-white/[0.02]">
              <span className="font-mono-meta text-[10px] text-soft-gray/60 tracking-widest block mb-2">
                ACTIVE STATE
              </span>
              <div className="flex items-center gap-3">
                <span
                  className={`w-3 h-3 rounded-full ${
                    isAiThinking
                      ? 'bg-terracotta animate-ping'
                      : currentTurn === 'X'
                      ? 'bg-warm-white'
                      : 'bg-terracotta'
                  }`}
                />
                <span className="font-display font-bold text-lg md:text-xl text-warm-white">
                  {isAiThinking
                    ? 'AI RESOLVING'
                    : gameMode === 'pvc'
                    ? currentTurn === humanPlayer
                      ? `YOUR TURN (${currentTurn})`
                      : `AI'S TURN (${currentTurn})`
                    : `PLAYER ${currentTurn}'S TURN`}
                </span>
              </div>
              <p className="font-mono-meta text-[10px] text-soft-gray/60 mt-3 pt-3 border-t border-white/[0.06]">
                {winnerState.winner
                  ? 'ROUND CONCLUDED'
                  : isAiThinking
                  ? 'CALCULATING OPTIMAL PATH...'
                  : 'AWAITING GRID INPUT'}
              </p>
            </div>

            {/* Quick Score Ticker */}
            <div className="space-y-4">
              <span className="font-mono-meta text-[10px] text-soft-gray/50 tracking-widest block">
                RUNNING STANDINGS
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 border border-white/[0.08]">
                  <span className="font-mono-meta text-[9px] text-soft-gray/50 block">PLAYER X</span>
                  <span className="font-display font-bold text-3xl text-warm-white">
                    {pad(scores.playerX)}
                  </span>
                </div>
                <div className="p-4 border border-white/[0.08]">
                  <span className="font-mono-meta text-[9px] text-soft-gray/50 block">PLAYER O</span>
                  <span className="font-display font-bold text-3xl text-terracotta">
                    {pad(scores.playerO)}
                  </span>
                </div>
              </div>
            </div>

            {/* Keyboard shortcut hint */}
            <div className="text-[11px] text-soft-gray/50 font-mono-meta hidden lg:block leading-relaxed">
              [KEYBOARD TIP]
              <br />
              Tab to navigate cells.
              <br />
              Enter or Space to place mark.
            </div>
          </div>

          {/* Center Column: The Architectural Board */}
          <div className="lg:col-span-6 flex flex-col items-center order-1 lg:order-2">
            <GameBoard
              board={board}
              winnerState={winnerState}
              currentTurn={currentTurn}
              isAiThinking={isAiThinking}
              gameMode={gameMode}
              humanPlayer={humanPlayer}
              onCellClick={onCellClick}
              onRestart={onRestart}
              onNewGame={onNewGame}
            />

            {/* Interactive Controls Bar */}
            <div className="w-full max-w-[500px] mt-6">
              <GameControls
                onRestart={onRestart}
                onNewGame={onNewGame}
                onUndo={onUndo}
                canUndo={canUndo}
                onOpenModeSelector={() => setIsConfigOpen((prev) => !prev)}
                isModeSelectorOpen={isConfigOpen}
              />
            </div>
          </div>

          {/* Right Column: Configuration & Mode Drawer */}
          <div className="lg:col-span-3 order-3">
            <div className="border border-white/[0.08] p-5 bg-white/[0.01]">
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono-meta text-xs text-warm-white font-semibold tracking-wider">
                  CONFIGURATION
                </span>
                <span className="font-mono-meta text-[9px] text-terracotta">LIVE</span>
              </div>

              <ModeSelector
                gameMode={gameMode}
                difficulty={difficulty}
                humanPlayer={humanPlayer}
                onSelectMode={onSelectMode}
                onSelectDifficulty={onSelectDifficulty}
                onSelectPlayer={onSelectPlayer}
              />

              <div className="mt-4 pt-4 border-t border-white/[0.08] text-[10px] font-mono-meta text-soft-gray/50">
                SETTINGS AUTOMATICALLY SYNC WITH CURRENT ROUND.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
