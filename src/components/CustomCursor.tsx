import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

export const CustomCursor: React.FC = () => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isBoardHovered, setIsBoardHovered] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const prefersReducedMotion = useReducedMotion();

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 28, stiffness: 350, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Only show on fine pointer (mouse)
    if (window.matchMedia('(pointer: coarse)').matches || prefersReducedMotion) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isInteractive = target.closest('button, a, input, select, [role="button"], [data-cursor="interactive"]');
      const isBoard = target.closest('[data-cursor="board-cell"]');

      setIsHovered(!!isInteractive);
      setIsBoardHovered(!!isBoard);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mouseX, mouseY, isVisible, prefersReducedMotion]);

  if (prefersReducedMotion || !isVisible) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden mix-blend-difference">
      {/* Precision center dot */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-[#FAF9F5] -translate-x-1/2 -translate-y-1/2"
        style={{
          x: mouseX,
          y: mouseY,
        }}
      />

      {/* Floating follower ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border border-[#FAF9F5]/40 -translate-x-1/2 -translate-y-1/2"
        style={{
          x: smoothX,
          y: smoothY,
        }}
        animate={{
          width: isBoardHovered ? 48 : isHovered ? 36 : 24,
          height: isBoardHovered ? 48 : isHovered ? 36 : 24,
          borderColor: isBoardHovered ? 'rgba(184, 107, 83, 0.7)' : isHovered ? 'rgba(250, 249, 245, 0.7)' : 'rgba(250, 249, 245, 0.25)',
          scale: isHovered || isBoardHovered ? 1.15 : 1,
        }}
        transition={{
          type: 'spring',
          damping: 25,
          stiffness: 300,
        }}
      >
        {isBoardHovered && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1.5 h-1.5 border border-[#B86B53] rotate-45" />
          </div>
        )}
      </motion.div>
    </div>
  );
};
