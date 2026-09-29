import React, { useState } from 'react';
import type { MatchRecord } from '../types/game';
import { Trash2 } from 'lucide-react';

interface GameHistoryProps {
  history: MatchRecord[];
  onClearHistory: () => void;
}

export const GameHistory: React.FC<GameHistoryProps> = ({ history, onClearHistory }) => {
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };

  return (
    <section
      id="history"
      className="relative py-24 md:py-32 border-b border-white/[0.08] bg-[#0F0E0D]"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono-meta text-xs text-terracotta tracking-widest">
                05 — HISTORICAL ARCHIVE
              </span>
              <div className="h-[1px] w-10 bg-terracotta/40" />
            </div>

            <h2 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl text-warm-white uppercase tracking-tight">
              MATCH
              <br />
              CHRONOLOGY<span className="text-terracotta">.</span>
            </h2>
          </div>

          {/* Clear Archive Action */}
          {history.length > 0 && (
            <div>
              {showConfirm ? (
                <div className="flex items-center gap-3 p-2 border border-terracotta/50 bg-terracotta/5 font-mono-meta text-xs">
                  <span className="text-warm-white">PURGE ARCHIVE?</span>
                  <button
                    type="button"
                    onClick={() => {
                      onClearHistory();
                      setShowConfirm(false);
                    }}
                    className="px-2.5 py-1 bg-terracotta text-warm-white hover:bg-terracotta/80 transition-colors"
                  >
                    PURGE
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowConfirm(false)}
                    className="text-soft-gray hover:text-warm-white transition-colors"
                  >
                    CANCEL
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowConfirm(true)}
                  data-cursor="interactive"
                  className="group flex items-center gap-2 font-mono-meta text-xs text-soft-gray hover:text-warm-white transition-colors py-1"
                >
                  <Trash2 className="w-3.5 h-3.5 text-soft-gray group-hover:text-terracotta transition-colors" />
                  <span className="relative">
                    CLEAR HISTORY
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-terracotta group-hover:w-full transition-all duration-300" />
                  </span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Editorial Match List */}
        {history.length === 0 ? (
          <div className="border border-white/[0.08] p-12 text-center">
            <span className="font-mono-meta text-xs text-soft-gray/50 tracking-widest block mb-2">
              NO HISTORICAL RECORDS LOGGED
            </span>
            <p className="text-sm text-soft-gray/70 max-w-sm mx-auto font-light">
              Engage the 3×3 matrix to initiate historical round logging. Every completed outcome will be archived here.
            </p>
          </div>
        ) : (
          <div className="border-t border-white/[0.08] divide-y divide-white/[0.08]">
            {/* Table Header Row */}
            <div className="grid grid-cols-12 py-3 px-2 font-mono-meta text-[10px] text-soft-gray/50 uppercase tracking-widest">
              <div className="col-span-2 sm:col-span-1">INDEX</div>
              <div className="col-span-4 sm:col-span-3">PROTOCOL</div>
              <div className="col-span-3 sm:col-span-4">RESULT</div>
              <div className="col-span-3 sm:col-span-2 text-right sm:text-left">MOVES</div>
              <div className="hidden sm:block col-span-2 text-right">TIMESTAMP</div>
            </div>

            {/* Match Rows */}
            {history.slice(0, 15).map((match, idx) => {
              const isWinX = match.winner === 'X';
              const isDraw = match.winner === 'draw';

              return (
                <div
                  key={match.id}
                  className="grid grid-cols-12 py-4 px-2 items-center hover:bg-white/[0.02] transition-colors font-mono-meta text-xs"
                >
                  {/* Index */}
                  <div className="col-span-2 sm:col-span-1 text-soft-gray/50">
                    {pad(history.length - idx)}
                  </div>

                  {/* Mode / Difficulty */}
                  <div className="col-span-4 sm:col-span-3 flex items-center gap-2">
                    <span className="text-soft-gray">
                      {match.mode === 'pvp'
                        ? 'PVP LOCAL'
                        : `AI (${(match.difficulty || 'hard').toUpperCase()})`}
                    </span>
                  </div>

                  {/* Result */}
                  <div className="col-span-3 sm:col-span-4 flex items-center gap-3">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isDraw
                          ? 'bg-soft-gray/40'
                          : isWinX
                          ? 'bg-warm-white'
                          : 'bg-terracotta'
                      }`}
                    />
                    <span
                      className={`font-semibold tracking-wider ${
                        isDraw
                          ? 'text-soft-gray/60'
                          : isWinX
                          ? 'text-warm-white'
                          : 'text-terracotta'
                      }`}
                    >
                      {isDraw ? 'DRAW' : `PLAYER ${match.winner} WON`}
                    </span>
                  </div>

                  {/* Moves count */}
                  <div className="col-span-3 sm:col-span-2 text-right sm:text-left text-soft-gray/70">
                    {match.movesCount} MOVES
                  </div>

                  {/* Timestamp */}
                  <div className="hidden sm:block col-span-2 text-right text-soft-gray/40 text-[11px]">
                    {formatTime(match.timestamp)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
