import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface NavbarProps {
  isSoundMuted: boolean;
  onToggleSound: () => void;
  currentTurn: 'X' | 'O';
  isAiThinking: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  isSoundMuted,
  onToggleSound,
  currentTurn,
  isAiThinking,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#0F0E0D]/75 backdrop-blur-md border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 md:h-20 flex items-center justify-between">
        {/* Brand / Logo */}
        <a
          href="#hero"
          className="group flex items-center gap-3 text-left focus:outline-none focus:ring-1 focus:ring-terracotta"
        >
          {/* Architectural 3x3 micro icon */}
          <div className="grid grid-cols-3 gap-0.5 w-4 h-4 p-0.5 border border-white/20 group-hover:border-terracotta transition-colors duration-300">
            {Array.from({ length: 9 }).map((_, i) => (
              <span
                key={i}
                className={`w-0.5 h-0.5 rounded-full ${
                  i === 4 ? 'bg-terracotta' : 'bg-white/40'
                } group-hover:bg-warm-white transition-colors`}
              />
            ))}
          </div>

          <div className="flex flex-col">
            <span className="font-display font-bold tracking-tight text-sm md:text-base text-warm-white group-hover:text-white transition-colors">
              THREE IN A ROW
            </span>
            <span className="font-mono-meta text-[9px] text-soft-gray/60 tracking-widest hidden sm:inline">
              ARCHITECTURAL EDITION
            </span>
          </div>
        </a>

        {/* Center/Right Nav Items */}
        <div className="flex items-center gap-6 md:gap-10">
          {/* Turn status indicator (subtle) */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 border border-white/10 rounded-full bg-white/[0.02]">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isAiThinking
                  ? 'bg-terracotta animate-pulse'
                  : currentTurn === 'X'
                  ? 'bg-warm-white'
                  : 'bg-terracotta'
              }`}
            />
            <span className="font-mono-meta text-[10px] text-soft-gray">
              {isAiThinking ? 'AI COMPUTING' : `TURN: PLAYER ${currentTurn}`}
            </span>
          </div>

          <nav className="flex items-center gap-5 md:gap-8 font-mono-meta text-[11px] text-soft-gray tracking-wider">
            <a
              href="#game-board"
              className="hover:text-warm-white transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-terracotta hover:after:w-full after:transition-all after:duration-300"
            >
              PLAY
            </a>
            <a
              href="#how-to-play"
              className="hover:text-warm-white transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-terracotta hover:after:w-full after:transition-all after:duration-300"
            >
              HOW IT WORKS
            </a>
            <a
              href="#scores"
              className="hover:text-warm-white transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-terracotta hover:after:w-full after:transition-all after:duration-300"
            >
              METRICS
            </a>
            <a
              href="#history"
              className="hidden md:inline hover:text-warm-white transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-terracotta hover:after:w-full after:transition-all after:duration-300"
            >
              ARCHIVE
            </a>
          </nav>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            aria-label={isSoundMuted ? 'Unmute tactical audio' : 'Mute tactical audio'}
            className="p-2 border border-white/10 hover:border-white/30 text-soft-gray hover:text-warm-white transition-colors rounded-sm focus:outline-none focus:ring-1 focus:ring-terracotta"
            title={isSoundMuted ? 'Sound Off' : 'Sound On'}
          >
            {isSoundMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-soft-gray/60" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-terracotta" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
