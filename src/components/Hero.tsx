import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, CornerDownRight } from 'lucide-react';
import { HeroScene } from './3d/HeroScene';

export const Hero: React.FC = () => {
  return (
    <section
      id="hero"
      className="relative min-h-screen pt-24 md:pt-28 pb-16 flex flex-col justify-between border-b border-white/[0.08] bg-grid-dots overflow-hidden"
    >
      {/* Subtle architectural framing grid lines */}
      <div className="absolute inset-0 bg-grid-lines pointer-events-none opacity-40" />

      {/* Atmospheric radial gradient glow behind 3D object */}
      <div className="absolute right-0 top-1/4 w-[600px] h-[600px] bg-terracotta/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-10 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center my-auto">
        {/* Left Column: Editorial Headline & Copy */}
        <div className="lg:col-span-6 flex flex-col justify-center text-left">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 mb-6 md:mb-8"
          >
            <span className="font-mono-meta text-xs md:text-sm text-terracotta tracking-widest">
              01 — TWO PLAYERS. ONE BOARD.
            </span>
            <div className="h-[1px] w-12 bg-terracotta/40 hidden sm:block" />
          </motion.div>

          {/* Massive Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-black text-5xl sm:text-7xl md:text-8xl lg:text-[5.75rem] xl:text-[6.75rem] leading-[0.88] tracking-tighter text-warm-white uppercase mb-8"
          >
            THREE
            <br />
            <span className="text-white/40">IN A</span> ROW<span className="text-terracotta">.</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-lg text-soft-gray font-light max-w-md leading-relaxed mb-10"
          >
            A game of elemental strategy, architectural spatial precision, and pure intuition.
            Engineered with recursive minimax intelligence.
          </motion.p>

          {/* Action Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center gap-6"
          >
            <a
              href="#game-board"
              data-cursor="interactive"
              className="group inline-flex items-center gap-4 px-7 py-3.5 bg-warm-white text-near-black font-mono-meta text-xs tracking-widest font-semibold hover:bg-white hover:shadow-[0_0_30px_rgba(250,249,245,0.2)] transition-all duration-300"
            >
              <span>ENGAGE BOARD</span>
              <CornerDownRight className="w-3.5 h-3.5 group-hover:translate-x-1 group-hover:translate-y-0.5 transition-transform" />
            </a>

            <a
              href="#how-to-play"
              data-cursor="interactive"
              className="inline-flex items-center gap-2 font-mono-meta text-xs text-soft-gray hover:text-warm-white transition-colors py-2 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-white/20 hover:after:bg-terracotta after:transition-colors"
            >
              EXPLORE MECHANICS
            </a>
          </motion.div>

          {/* Studio Metadata Stamp */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.45 }}
            className="mt-12 md:mt-16 pt-6 border-t border-white/[0.08] flex items-center justify-between text-soft-gray/50 font-mono-meta text-[10px]"
          >
            <div>MATRIX: 3×3 ORTHOGONAL</div>
            <div>ALGO: MINIMAX α-β</div>
            <div className="hidden sm:block">STATUS: CALIBRATED</div>
          </motion.div>
        </div>

        {/* Right Column: 3D Scene Viewport */}
        <div className="lg:col-span-6 relative flex items-center justify-center">
          <div className="w-full aspect-square max-w-[560px] relative">
            <HeroScene className="w-full h-full" />

            {/* Corner architectural registration marks */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-white/20 pointer-events-none" />
            <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-white/20 pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-white/20 pointer-events-none" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-white/20 pointer-events-none" />

            {/* Overlay coordinate caption */}
            <div className="absolute -bottom-4 right-0 font-mono-meta text-[9px] text-soft-gray/40 tracking-widest hidden sm:block">
              FIG 01.0 / SPATIAL AXIS PROJECTION
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Scroll Indicator Bar */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 w-full pt-8 flex items-center justify-between font-mono-meta text-[10px] text-soft-gray/50">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-terracotta rounded-full inline-block animate-ping" />
          <span>INTERACTIVE SPATIAL ENGINE</span>
        </div>

        <a
          href="#game-board"
          aria-label="Scroll to game board"
          className="flex items-center gap-2 hover:text-warm-white transition-colors"
        >
          <span>SCROLL TO PLAY</span>
          <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
        </a>
      </div>
    </section>
  );
};
