import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onNewGame: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNewGame }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative pt-24 pb-16 bg-[#0B0A09] text-warm-white overflow-hidden">
      {/* Subtle background motif */}
      <div className="absolute inset-0 bg-grid-lines pointer-events-none opacity-20" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-terracotta/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end mb-20">
          {/* Left Column: Big Headline */}
          <div className="lg:col-span-8">
            <span className="font-mono-meta text-xs text-terracotta tracking-widest block mb-6">
              CONCLUSION // INVITATION
            </span>

            <h2 className="font-display font-black text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tighter uppercase leading-[0.88] text-warm-white">
              ONE MORE
              <br />
              <span className="text-white/30">ROUND?</span>
            </h2>
          </div>

          {/* Right Column: Call to Action & 3x3 Geometry */}
          <div className="lg:col-span-4 flex flex-col justify-end items-start lg:items-end">
            <a
              href="#game-board"
              onClick={onNewGame}
              data-cursor="interactive"
              className="group inline-flex items-center gap-4 px-8 py-4 bg-warm-white text-near-black font-mono-meta text-xs font-semibold tracking-widest hover:bg-white transition-all shadow-[0_0_40px_rgba(250,249,245,0.15)] mb-8"
            >
              <span>INITIATE NEW MATCH</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            {/* Architectural 3x3 Matrix Motif */}
            <div className="grid grid-cols-3 gap-1.5 p-3 border border-white/10 bg-white/[0.01]">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 flex items-center justify-center border text-[8px] font-mono ${
                    i === 0 || i === 4 || i === 8
                      ? 'border-terracotta text-terracotta bg-terracotta/10'
                      : 'border-white/10 text-white/30'
                  }`}
                >
                  {i === 4 ? 'X' : i === 0 ? 'O' : ''}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Minimal Navigation & Legal Strip */}
        <div className="pt-10 border-t border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 font-mono-meta text-[11px] text-soft-gray/60">
          <div className="flex flex-wrap items-center gap-8">
            <a href="#game-board" className="hover:text-warm-white transition-colors">
              THE BOARD
            </a>
            <a href="#how-to-play" className="hover:text-warm-white transition-colors">
              HOW TO PLAY
            </a>
            <a href="#scores" className="hover:text-warm-white transition-colors">
              METRICS
            </a>
            <a href="#history" className="hover:text-warm-white transition-colors">
              ARCHIVE
            </a>
          </div>

          <div className="flex items-center gap-6">
            <span>© 2026 ARCHITECTURAL TIC-TAC-TOE</span>
            <button
              type="button"
              onClick={scrollToTop}
              data-cursor="interactive"
              className="text-soft-gray hover:text-warm-white transition-colors underline underline-offset-4"
            >
              BACK TO TOP ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
