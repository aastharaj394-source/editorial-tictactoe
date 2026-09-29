import React, { useState } from 'react';
import type { ScoreState } from '../types/game';
import { RotateCcw } from 'lucide-react';

interface ScoreSectionProps {
  scores: ScoreState;
  onResetScores: () => void;
}

export const ScoreSection: React.FC<ScoreSectionProps> = ({ scores, onResetScores }) => {
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

  // Calculate percentages
  const winRateX =
    scores.totalMatches > 0
      ? Math.round((scores.playerX / scores.totalMatches) * 100)
      : 0;
  const winRateO =
    scores.totalMatches > 0
      ? Math.round((scores.playerO / scores.totalMatches) * 100)
      : 0;

  return (
    <section
      id="scores"
      className="relative py-24 md:py-32 border-b border-white/[0.08] bg-[#0F0E0D]"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono-meta text-xs text-terracotta tracking-widest">
                03 — RUNTIME METRICS
              </span>
              <div className="h-[1px] w-10 bg-terracotta/40" />
            </div>

            <h2 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl text-warm-white uppercase tracking-tight">
              SESSION
              <br />
              STATISTICS<span className="text-terracotta">.</span>
            </h2>
          </div>

          {/* Reset Score Action */}
          <div>
            {showConfirm ? (
              <div className="flex items-center gap-4 p-2 border border-terracotta/50 bg-terracotta/5 font-mono-meta text-xs">
                <span className="text-warm-white">CONFIRM RESET?</span>
                <button
                  type="button"
                  onClick={() => {
                    onResetScores();
                    setShowConfirm(false);
                  }}
                  className="px-2.5 py-1 bg-terracotta text-warm-white hover:bg-terracotta/80 transition-colors"
                >
                  YES
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
                <RotateCcw className="w-3.5 h-3.5 group-hover:-rotate-90 transition-transform duration-300" />
                <span className="relative">
                  RESET SCORES
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-terracotta group-hover:w-full transition-all duration-300" />
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Asymmetrical Big Typography Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-0 border-y border-white/[0.08] divide-y md:divide-y-0 md:divide-x divide-white/[0.08]">
          {/* Total Matches */}
          <div className="md:col-span-3 py-10 md:py-14 md:pr-8 flex flex-col justify-between">
            <div>
              <span className="font-mono-meta text-[11px] text-soft-gray/60 tracking-widest block mb-2">
                01 / TOTAL MATCHES
              </span>
              <div className="font-display font-extrabold text-7xl sm:text-8xl lg:text-9xl text-warm-white tracking-tighter leading-none">
                {pad(scores.totalMatches)}
              </div>
            </div>
            <p className="text-xs text-soft-gray/60 mt-6 max-w-[200px] leading-relaxed">
              Cumulative completed rounds stored in persistent browser memory.
            </p>
          </div>

          {/* Player X Wins */}
          <div className="md:col-span-3 py-10 md:py-14 md:px-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono-meta text-[11px] text-soft-gray/60 tracking-widest">
                  02 / PLAYER X
                </span>
                <span className="font-mono-meta text-[10px] text-warm-white/70">
                  {winRateX}% RATE
                </span>
              </div>
              <div className="font-display font-extrabold text-7xl sm:text-8xl lg:text-9xl text-warm-white tracking-tighter leading-none">
                {pad(scores.playerX)}
              </div>
            </div>
            <div className="mt-6 flex items-center gap-2">
              <div className="w-2 h-2 bg-warm-white" />
              <span className="font-mono-meta text-[10px] text-soft-gray/60">PRIMARY MARK</span>
            </div>
          </div>

          {/* Player O Wins */}
          <div className="md:col-span-3 py-10 md:py-14 md:px-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono-meta text-[11px] text-terracotta tracking-widest">
                  03 / PLAYER O
                </span>
                <span className="font-mono-meta text-[10px] text-terracotta/70">
                  {winRateO}% RATE
                </span>
              </div>
              <div className="font-display font-extrabold text-7xl sm:text-8xl lg:text-9xl text-terracotta tracking-tighter leading-none">
                {pad(scores.playerO)}
              </div>
            </div>
            <div className="mt-6 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-terracotta" />
              <span className="font-mono-meta text-[10px] text-soft-gray/60">SECONDARY MARK</span>
            </div>
          </div>

          {/* Draws & Streak */}
          <div className="md:col-span-3 py-10 md:py-14 md:pl-8 flex flex-col justify-between">
            <div>
              <span className="font-mono-meta text-[11px] text-soft-gray/60 tracking-widest block mb-2">
                04 / STALEMATES
              </span>
              <div className="font-display font-extrabold text-7xl sm:text-8xl lg:text-9xl text-soft-gray/40 tracking-tighter leading-none">
                {pad(scores.draws)}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/[0.06]">
              <span className="font-mono-meta text-[10px] text-soft-gray/50 block mb-1">
                CURRENT STREAK
              </span>
              <div className="font-mono-meta text-sm text-warm-white font-medium">
                {scores.currentStreak.count > 0 && scores.currentStreak.winner ? (
                  <span>
                    PLAYER {scores.currentStreak.winner} ({pad(scores.currentStreak.count)} IN A ROW)
                  </span>
                ) : (
                  <span className="text-soft-gray/40">NO ACTIVE STREAK</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
