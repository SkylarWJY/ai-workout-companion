import React from 'react';
import { motion } from 'framer-motion';

export default function ProgressBar({ value = 0, total = 1, thin = false, label }) {
  const pct = total === 0 ? 0 : Math.min(100, Math.round((value / total) * 100));
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-baseline mb-1.5 text-[11px] uppercase tracking-wider text-ink-400 dark:text-ink-200">
          <span>{label}</span>
          <span className="tabular text-ink-700 dark:text-bone-100">{pct}%</span>
        </div>
      )}
      <div
        className={`relative w-full ${thin ? 'h-1' : 'h-1.5'} bg-bone-200 dark:bg-ink-700 rounded-full overflow-hidden`}
      >
        <motion.div
          className="absolute inset-y-0 left-0 bg-ink-900 dark:bg-bone-100 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        />
      </div>
    </div>
  );
}
