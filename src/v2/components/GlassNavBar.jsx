import React from 'react';
import { motion } from 'framer-motion';

// Apple-style scrolled-content top bar. Glass appears once you scroll past
// the hero — hides until then so the page reads as a clean full-bleed canvas.
export default function GlassNavBar({
  title,
  showGlass = false,
  leading = null,
  trailing = null,
  centered = true,
}) {
  return (
    <motion.header
      initial={false}
      animate={{
        backgroundColor: showGlass ? 'rgba(28,28,30,0.62)' : 'rgba(28,28,30,0)',
        backdropFilter: showGlass ? 'blur(28px) saturate(180%)' : 'blur(0px)',
        WebkitBackdropFilter: showGlass ? 'blur(28px) saturate(180%)' : 'blur(0px)',
        borderBottomColor: showGlass ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0)',
      }}
      transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
      className="sticky top-0 z-30 w-full border-b border-transparent"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="relative h-11 px-3 flex items-center">
        <div className="flex items-center gap-1">{leading}</div>
        {centered && (
          <motion.div
            initial={false}
            animate={{ opacity: showGlass ? 1 : 0, y: showGlass ? 0 : 4 }}
            transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
            className="absolute inset-x-0 text-center pointer-events-none select-none"
          >
            <span className="v2-title text-[17px] leading-none">{title}</span>
          </motion.div>
        )}
        <div className="ml-auto flex items-center gap-1">{trailing}</div>
      </div>
    </motion.header>
  );
}
