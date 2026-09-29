import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const HowToPlay: React.FC = () => {
  // Demonstration animated board state
  const [demoStep, setDemoStep] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDemoStep((prev) => (prev + 1) % 5);
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  // Demo sequence:
  // Step 0: Empty
  // Step 1: X at (0,0)
  // Step 2: O at (1,1)
  // Step 3: X at (0,1)
  // Step 4: X at (0,2) -> Top Row Win!
  const getDemoMark = (index: number): 'X' | 'O' | null => {
    if (demoStep === 0) return null;
    if (demoStep >= 1 && index === 0) return 'X';
    if (demoStep >= 2 && index === 4) return 'O';
    if (demoStep >= 3 && index === 1) return 'X';
    if (demoStep >= 4 && index === 2) return 'X';
    return null;
  };

  const isDemoWinning = demoStep === 4;

  return (
    <section
      id="how-to-play"
      className="relative py-24 md:py-32 border-b border-white/[0.08] bg-[#0F0E0D] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Editorial Headline & Steps */}
          <div className="lg:col-span-7">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-6">
              <span className="font-mono-meta text-xs text-terracotta tracking-widest">
                04 — ARCHITECTURAL RULES
              </span>
              <div className="h-[1px] w-10 bg-terracotta/40" />
            </div>

            {/* Large Statement */}
            <h2 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl text-warm-white tracking-tight uppercase leading-[0.92] mb-10">
              THREE MARKS.
              <br />
              ONE LINE.
              <br />
              <span className="text-white/40">GAME OVER.</span>
            </h2>

            {/* Editorial Rule Steps */}
            <div className="space-y-8 max-w-xl">
              <div className="flex gap-6 items-start">
                <span className="font-mono-meta text-xs text-terracotta pt-0.5">01</span>
                <div>
                  <h3 className="font-mono-meta text-xs text-warm-white font-semibold tracking-wider mb-1">
                    ALTERNATING PLACEMENT
                  </h3>
                  <p className="text-sm text-soft-gray leading-relaxed font-light">
                    Players alternate placing their allocated geometric mark (<span className="text-warm-white font-mono">X</span> or <span className="text-terracotta font-mono">O</span>) into any unoccupied cell of the 3×3 matrix.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <span className="font-mono-meta text-xs text-terracotta pt-0.5">02</span>
                <div>
                  <h3 className="font-mono-meta text-xs text-warm-white font-semibold tracking-wider mb-1">
                    ORTHOGONAL OR DIAGONAL ALIGNMENT
                  </h3>
                  <p className="text-sm text-soft-gray leading-relaxed font-light">
                    Establish a contiguous trio across any horizontal tier, vertical channel, or diagonal vector. The first player to complete the alignment claims the match.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <span className="font-mono-meta text-xs text-terracotta pt-0.5">03</span>
                <div>
                  <h3 className="font-mono-meta text-xs text-warm-white font-semibold tracking-wider mb-1">
                    SPATIAL EXHAUSTION
                  </h3>
                  <p className="text-sm text-soft-gray leading-relaxed font-light">
                    If all nine cells are occupied without a completed sequence, the state resolves into a graceful stalemate (draw).
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Animated Visual Demonstration Grid */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative p-6 border border-white/[0.08] bg-white/[0.01] w-full max-w-[340px]">
              {/* Header Label */}
              <div className="flex items-center justify-between font-mono-meta text-[10px] text-soft-gray/50 mb-4 pb-2 border-b border-white/[0.06]">
                <span>TACTICAL DEMO</span>
                <span className="text-terracotta">PHASE 0{demoStep + 1}</span>
              </div>

              {/* 3x3 Mini Demonstration Grid */}
              <div className="relative grid grid-cols-3 gap-2 aspect-square p-2 bg-[#141312] border border-white/10">
                {Array.from({ length: 9 }).map((_, idx) => {
                  const mark = getDemoMark(idx);
                  const isWinningTrio = isDemoWinning && (idx === 0 || idx === 1 || idx === 2);

                  return (
                    <div
                      key={idx}
                      className={`relative flex items-center justify-center border transition-all duration-300 ${
                        isWinningTrio
                          ? 'border-terracotta bg-terracotta/10'
                          : 'border-white/[0.07] bg-white/[0.01]'
                      }`}
                    >
                      {mark === 'X' && (
                        <motion.span
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className={`font-display font-black text-xl ${
                            isWinningTrio ? 'text-warm-white' : 'text-warm-white/80'
                          }`}
                        >
                          X
                        </motion.span>
                      )}
                      {mark === 'O' && (
                        <motion.span
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="font-display font-black text-xl text-terracotta"
                        >
                          O
                        </motion.span>
                      )}
                      <span className="absolute bottom-1 right-1 font-mono text-[8px] text-soft-gray/30">
                        {idx}
                      </span>
                    </div>
                  );
                })}

                {/* Simulated winning connector bar */}
                {isDemoWinning && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.4 }}
                    className="absolute top-[16.66%] left-4 right-4 h-[2px] bg-terracotta origin-left shadow-[0_0_10px_rgba(184,107,83,0.8)] pointer-events-none"
                  />
                )}
              </div>

              {/* Bottom Caption */}
              <div className="font-mono-meta text-[10px] text-center text-soft-gray/50 mt-4">
                {isDemoWinning ? (
                  <span className="text-terracotta font-medium">SEQUENCE RESOLVED // LINE COMPLETE</span>
                ) : (
                  <span>ACTIVE SPATIAL TRAVERSAL</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
