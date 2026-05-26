import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../hooks/useTheme.js';

export default function DarkModeToggle() {
  const { theme, toggle } = useTheme();
  const dark = theme === 'dark';
  return (
    <button
      aria-label="Toggle theme"
      onClick={toggle}
      className="relative w-12 h-7 rounded-full bg-bone-200 dark:bg-ink-600 border border-black/5 dark:border-white/10 flex items-center px-0.5 active:scale-95 transition-transform"
    >
      <motion.span
        layout
        className="w-6 h-6 rounded-full bg-white dark:bg-bone-100 shadow-sm flex items-center justify-center text-[10px]"
        animate={{ x: dark ? 20 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 32 }}
      >
        {dark ? (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
            <path
              d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
              stroke="#0A0A0A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="4" stroke="#0A0A0A" strokeWidth="2" />
            <path
              d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
              stroke="#0A0A0A"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        )}
      </motion.span>
    </button>
  );
}
