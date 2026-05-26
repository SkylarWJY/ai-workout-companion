import React from 'react';
import { motion } from 'framer-motion';
import { useLang, locEx, locWorkout } from '../i18n/index.jsx';

export default function WorkoutSummary({ workout, session, onClose, onSave }) {
  const { t, lang } = useLang();
  const totalSets = workout.exercises.reduce((acc, e) => acc + e.sets, 0);
  const completedSets = workout.exercises.reduce(
    (acc, e) => acc + (session.completedSets[e.id]?.length || 0),
    0,
  );
  const volume = workout.exercises.reduce((acc, e) => {
    const logs = session.completedSets[e.id] || [];
    return (
      acc +
      logs.reduce(
        (a, log) => a + (Number(log.weight) || 0) * (Number(log.reps) || 0),
        0,
      )
    );
  }, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-5 pt-2 pb-32 space-y-5"
    >
      <div>
        <div className="text-[11px] uppercase tracking-[0.18em] text-ink-300">
          {t('sum.complete')}
        </div>
        <h1 className="mt-1 text-[32px] leading-tight font-semibold tracking-tight text-ink-900 dark:text-bone-100">
          {locWorkout(workout, 'name', lang)} {t('sum.lockedIn')}
        </h1>
        <p className="mt-2 text-sm text-ink-400 dark:text-ink-200">
          {t('sum.recoveryStarts')}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        <SummaryStat label={t('sum.setsLabel')} value={`${completedSets}/${totalSets}`} />
        <SummaryStat label={t('sum.volume')} value={`${Math.round(volume).toLocaleString()}`} sub={t('sum.volumeUnit')} />
        <SummaryStat label={t('sum.time')} value={fmtElapsed(session.startedAt)} />
      </div>

      <div className="rounded-3xl bg-white dark:bg-ink-800 border border-black/5 dark:border-white/5 p-5 shadow-card dark:shadow-cardDark">
        <div className="text-[11px] uppercase tracking-wider text-ink-300 mb-3">
          {t('sum.perExercise')}
        </div>
        <ul className="divide-y divide-black/5 dark:divide-white/5">
          {workout.exercises.map((e) => {
            const logs = session.completedSets[e.id] || [];
            return (
              <li key={e.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-ink-900 dark:text-bone-100">
                    {locEx(e, 'name', lang)}
                  </div>
                  <div className="text-[11px] text-ink-400 dark:text-ink-200 tabular">
                    {logs.length}/{e.sets} {t('workout.sets')}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm tabular text-ink-700 dark:text-bone-100">
                    {logs
                      .map((l) => `${l.weight ?? '–'}×${l.reps ?? '–'}`)
                      .join(' · ') || '—'}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onClose}
          className="flex-1 py-3 rounded-2xl border border-black/10 dark:border-white/10 text-sm font-medium text-ink-700 dark:text-bone-100 active:scale-[0.98]"
        >
          {t('sum.discard')}
        </button>
        <button
          onClick={onSave}
          className="flex-[2] py-3 rounded-2xl bg-ink-900 dark:bg-bone-100 text-bone-50 dark:text-ink-900 text-sm font-semibold active:scale-[0.98]"
        >
          {t('sum.save')}
        </button>
      </div>
    </motion.div>
  );
}

const SummaryStat = ({ label, value, sub }) => (
  <div className="rounded-3xl bg-white dark:bg-ink-800 border border-black/5 dark:border-white/5 p-4 shadow-card dark:shadow-cardDark">
    <div className="text-[10px] uppercase tracking-wider text-ink-300">{label}</div>
    <div className="mt-1 text-xl font-semibold tabular text-ink-900 dark:text-bone-100">
      {value}
    </div>
    {sub && <div className="text-[10px] text-ink-300 mt-0.5">{sub}</div>}
  </div>
);

function fmtElapsed(startedAt) {
  if (!startedAt) return '—';
  const min = Math.round((Date.now() - startedAt) / 60000);
  if (min < 60) return `${min}m`;
  return `${Math.floor(min / 60)}h ${min % 60}m`;
}
