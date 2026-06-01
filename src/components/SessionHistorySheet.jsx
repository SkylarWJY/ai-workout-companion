import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang, locEx, locWorkout } from '../i18n/index.jsx';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { WORKOUTS } from '../data/workoutData.js';

function formatDate(ts, lang) {
  const d = new Date(ts);
  const opts = { month: 'short', day: 'numeric', weekday: 'short' };
  try {
    return d.toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', opts);
  } catch {
    return d.toDateString();
  }
}

function formatElapsed(startTs, endTs) {
  if (!startTs || !endTs) return '—';
  const mins = Math.max(1, Math.round((endTs - startTs) / 60000));
  if (mins < 60) return `${mins}m`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

export default function SessionHistorySheet({ open, onClose }) {
  const { t, lang } = useLang();
  const [history] = useLocalStorage('atlas.history', {});
  const [expanded, setExpanded] = useState(null);

  // Sort newest first by completedAt
  const sessions = useMemo(() => {
    return Object.entries(history)
      .filter(([, s]) => s?.completedAt)
      .sort(([, a], [, b]) => (b.completedAt || 0) - (a.completedAt || 0));
  }, [history]);

  // Aggregate stats per session
  const enriched = useMemo(() => {
    return sessions.map(([id, s]) => {
      const workout = WORKOUTS[s.type];
      if (!workout) return { id, session: s, workout: null, sets: 0, volume: 0 };
      const sets = workout.exercises.reduce(
        (acc, e) => acc + (s.completedSets?.[e.id]?.length || 0),
        0,
      );
      const volume = workout.exercises.reduce((acc, e) => {
        const logs = s.completedSets?.[e.id] || [];
        return (
          acc +
          logs.reduce(
            (a, log) => a + (Number(log.weight) || 0) * (Number(log.reps) || 0),
            0,
          )
        );
      }, 0);
      return { id, session: s, workout, sets, volume };
    });
  }, [sessions]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-ink-900/40 dark:bg-ink-900/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 32 }}
            className="fixed inset-x-0 bottom-0 z-[70] max-h-[88vh] overflow-y-auto rounded-t-[28px] bg-bone-50 dark:bg-ink-900 border-t border-black/5 dark:border-white/5 pb-safe"
          >
            <div className="sticky top-0 z-10 flex justify-between items-center bg-bone-50/85 dark:bg-ink-900/85 backdrop-blur-xl px-5 pt-3 pb-2 border-b border-black/5 dark:border-white/5">
              <div className="w-9 h-1 mx-auto bg-ink-200 dark:bg-ink-600 rounded-full absolute left-1/2 -translate-x-1/2 top-2" />
              <div className="pt-3 text-[13px] font-semibold tracking-tight text-ink-900 dark:text-bone-100">
                {t('history.title')}
              </div>
              <button
                onClick={onClose}
                className="pt-3 text-ink-400 dark:text-ink-200 text-sm font-medium"
              >
                {t('settings.done')}
              </button>
            </div>

            <div className="px-5 pt-4 pb-10 space-y-3">
              {enriched.length === 0 && (
                <div className="rounded-2xl bg-white dark:bg-ink-800 border border-black/5 dark:border-white/5 p-6 text-center">
                  <div className="text-[13px] text-ink-400 dark:text-ink-200">
                    {t('history.empty')}
                  </div>
                </div>
              )}

              {enriched.map(({ id, session: s, workout, sets, volume }) => {
                const isOpen = expanded === id;
                return (
                  <motion.div
                    key={id}
                    layout
                    className="rounded-2xl bg-white dark:bg-ink-800 border border-black/5 dark:border-white/5 shadow-card dark:shadow-cardDark overflow-hidden"
                  >
                    <button
                      onClick={() => setExpanded(isOpen ? null : id)}
                      className="w-full text-left p-4 flex items-center justify-between gap-3 active:scale-[0.99] transition"
                    >
                      <div className="min-w-0">
                        <div className="text-[10px] uppercase tracking-wider text-ink-300">
                          {formatDate(s.completedAt, lang)}
                        </div>
                        <div className="text-base font-semibold text-ink-900 dark:text-bone-100 truncate">
                          {workout ? locWorkout(workout, 'name', lang) : s.type}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-[11px] tabular text-ink-400 dark:text-ink-200">
                          {sets} {t('workout.sets')}
                        </div>
                        <div className="text-[11px] tabular text-ink-500 dark:text-ink-100">
                          {volume > 0 ? `${Math.round(volume).toLocaleString()} ${t('sum.volumeUnit')}` : '—'}
                        </div>
                        <div className="text-[10px] text-ink-300 tabular mt-0.5">
                          {formatElapsed(s.startedAt, s.completedAt)}
                        </div>
                      </div>
                    </button>

                    <AnimatePresence>
                      {isOpen && workout && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden border-t border-black/5 dark:border-white/5"
                        >
                          <ul className="divide-y divide-black/5 dark:divide-white/5">
                            {workout.exercises.map((e) => {
                              const logs = s.completedSets?.[e.id] || [];
                              return (
                                <li
                                  key={e.id}
                                  className="px-4 py-2.5 flex items-start justify-between gap-3"
                                >
                                  <div className="min-w-0 flex-1">
                                    <div className="text-[13px] font-medium text-ink-900 dark:text-bone-100">
                                      {locEx(e, 'name', lang)}
                                    </div>
                                    <div className="text-[11px] text-ink-400 dark:text-ink-200 tabular">
                                      {logs.length}/{e.sets} {t('workout.sets')}
                                    </div>
                                  </div>
                                  <div className="text-right text-[11px] tabular text-ink-500 dark:text-ink-100 max-w-[55%]">
                                    {logs.length === 0
                                      ? '—'
                                      : logs
                                          .map((l) => {
                                            const w = l.weight ?? '–';
                                            const r = l.reps ?? '–';
                                            const u = l.weightUnit || '';
                                            const side = l.side ? ` (${l.side})` : '';
                                            return `${w}${u ? u : ''}×${r}${side}`;
                                          })
                                          .join('  ·  ')}
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
