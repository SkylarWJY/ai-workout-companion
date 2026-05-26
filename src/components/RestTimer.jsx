import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fmtTime } from '../utils/format.js';
import { useT } from '../i18n/index.jsx';

export default function RestTimer({ timer, label, onDone, onStop }) {
  const t = useT();
  const restLabel = label || t('rest.label');
  const { remaining, duration, running, done, active, pause, resume, skip, reset } = timer;
  if (!active && !done) return null;

  const pct = duration === 0 ? 0 : 1 - remaining / duration;
  const R = 78;
  const C = 2 * Math.PI * R;

  return (
    <AnimatePresence>
      {(active || done) && (
        <motion.div
          key="rest-timer"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          className="fixed inset-x-0 bottom-0 z-40"
        >
          <div className="px-3 pb-safe pb-3">
            <div className="mx-auto max-w-md rounded-[28px] bg-white/85 dark:bg-ink-800/85 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-card dark:shadow-cardDark p-5">
              <div className="flex items-center gap-5">
                <div className="relative w-[120px] h-[120px] shrink-0">
                  <svg width="120" height="120" viewBox="0 0 180 180" className="-rotate-90">
                    <circle cx="90" cy="90" r={R} stroke="currentColor" className="text-bone-200 dark:text-ink-600" strokeWidth="10" fill="none" />
                    <motion.circle
                      cx="90"
                      cy="90"
                      r={R}
                      stroke="currentColor"
                      className="text-ink-900 dark:text-bone-100"
                      strokeWidth="10"
                      strokeLinecap="round"
                      fill="none"
                      strokeDasharray={C}
                      animate={{ strokeDashoffset: C * (1 - pct) }}
                      transition={{ type: 'spring', stiffness: 80, damping: 22 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[10px] uppercase tracking-wider text-ink-300">
                      {done ? t('rest.ready') : restLabel}
                    </span>
                    <span className="text-2xl font-semibold tabular text-ink-900 dark:text-bone-100">
                      {done ? '00:00' : fmtTime(remaining)}
                    </span>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  {done ? (
                    <>
                      <div className="text-sm text-ink-900 dark:text-bone-100 font-medium">
                        {t('rest.complete')}
                      </div>
                      <div className="text-xs text-ink-400 dark:text-ink-200 mt-0.5">
                        {t('rest.startNext')}
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={onDone}
                          className="flex-1 py-3 rounded-2xl bg-ink-900 dark:bg-bone-100 text-bone-50 dark:text-ink-900 text-sm font-semibold active:scale-[0.98] transition"
                        >
                          {t('rest.startNextBtn')}
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-xs text-ink-400 dark:text-ink-200">
                        {t('rest.breath')}
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-1.5">
                        {running ? (
                          <CtrlButton onClick={pause} label={t('rest.pause')} />
                        ) : (
                          <CtrlButton onClick={resume} label={t('rest.resume')} filled />
                        )}
                        <CtrlButton onClick={reset} label={t('rest.reset')} />
                        <CtrlButton onClick={() => { skip(); onDone?.(); }} label={t('rest.skip')} />
                      </div>
                      <div className="mt-2 text-right">
                        <button
                          onClick={onStop}
                          className="text-[11px] uppercase tracking-wider text-ink-300 hover:text-ink-500 dark:hover:text-bone-100"
                        >
                          {t('rest.end')}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const CtrlButton = ({ onClick, label, filled }) => (
  <button
    onClick={onClick}
    className={`py-2.5 rounded-xl text-[12px] font-medium uppercase tracking-wider active:scale-[0.97] transition border
      ${
        filled
          ? 'bg-ink-900 dark:bg-bone-100 text-bone-50 dark:text-ink-900 border-transparent'
          : 'bg-transparent text-ink-700 dark:text-bone-100 border-black/10 dark:border-white/10'
      }`}
  >
    {label}
  </button>
);
