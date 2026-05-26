import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useT } from '../i18n/index.jsx';

export default function ProgressionHint({ visible, exerciseName, onDismiss }) {
  const t = useT();
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8 }}
          className="mx-5 mt-3 rounded-2xl bg-priority-moderate/10 dark:bg-priority-moderate/15 border border-priority-moderate/30 p-3.5 flex items-start gap-3"
        >
          <span className="mt-0.5 w-7 h-7 rounded-full bg-priority-moderate/20 flex items-center justify-center shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 19V5M5 12l7-7 7 7"
                stroke="#30D158"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-medium text-ink-900 dark:text-bone-100">
              {t('hint.title')} {exerciseName}.
            </div>
            <div className="text-[11px] text-ink-400 dark:text-ink-200 mt-0.5">
              {t('hint.sub')}
            </div>
          </div>
          <button
            onClick={onDismiss}
            className="text-[11px] uppercase tracking-wider text-ink-300 hover:text-ink-500 dark:hover:text-bone-100 shrink-0"
          >
            {t('hint.ok')}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
