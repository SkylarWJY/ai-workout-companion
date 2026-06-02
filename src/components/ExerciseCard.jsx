import React from 'react';
import { motion } from 'framer-motion';
import PriorityChip from './PriorityChip.jsx';
import VariantBadge from './VariantBadge.jsx';
import { useLang, locEx } from '../i18n/index.jsx';
import { fmtRest } from '../utils/format.js';
import { useOverrides } from '../hooks/useOverrides.jsx';

export default function ExerciseCard({
  exercise,
  index,
  totalSets,
  completedSets,
  active,
  done,
  onOpen,
}) {
  const { t, lang } = useLang();
  const { overrides } = useOverrides();
  const name = locEx(exercise, 'name', lang);
  const muscles = locEx(exercise, 'primaryMuscles', lang);
  const suggestedWeight =
    overrides.exercise?.[exercise.id]?.suggestedWeight ??
    exercise.suggestedWeight;

  return (
    <motion.button
      layout
      whileTap={{ scale: 0.99 }}
      onClick={onOpen}
      className={`relative w-full text-left rounded-3xl p-5 border transition-all
        ${
          active
            ? 'bg-ink-900 dark:bg-bone-100 text-bone-50 dark:text-ink-900 border-transparent shadow-card dark:shadow-cardDark'
            : 'bg-white dark:bg-ink-800 text-ink-900 dark:text-bone-100 border-black/5 dark:border-white/5 shadow-card dark:shadow-cardDark'
        }
        ${done && !active ? 'opacity-50' : ''}
      `}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div
            className={`text-[10px] uppercase tracking-[0.16em] ${
              active ? 'opacity-60' : 'text-ink-300 dark:text-ink-300'
            }`}
          >
            {String(index).padStart(2, '0')}
          </div>
          <h3 className="mt-1 text-lg font-semibold leading-tight">{name}</h3>
          <div className="mt-1.5">
            <VariantBadge exerciseId={exercise.id} tone={active ? 'dark' : 'light'} />
          </div>
          <div
            className={`mt-1.5 text-[12px] tabular ${
              active ? 'opacity-70' : 'text-ink-400 dark:text-ink-200'
            }`}
          >
            {exercise.sets} × {exercise.repRange} · {fmtRest(exercise.restSeconds)} {t('workout.rest').toLowerCase()}
          </div>
        </div>
        <div className={`flex flex-col items-end gap-1.5 shrink-0 ${active ? 'text-bone-50 dark:text-ink-900' : ''}`}>
          {/* Primary muscle pill — what this exercise actually trains, */}
          {/* prominent so you can scan the day's targets at a glance. */}
          <span
            className={`text-[10px] font-semibold uppercase tracking-[0.14em] rounded-full px-2.5 py-1 max-w-[140px] truncate ${
              active
                ? 'bg-bone-50/15 text-bone-50 dark:bg-ink-900/15 dark:text-ink-900'
                : 'bg-ink-900 text-bone-50 dark:bg-bone-100 dark:text-ink-900'
            }`}
            title={muscles.join(' · ')}
          >
            {muscles[0]}
          </span>
          {!active && <PriorityChip priority={exercise.priority} compact />}
          {done && (
            <span className="text-[10px] uppercase tracking-wider flex items-center gap-1 text-priority-moderate">
              <span className="w-1.5 h-1.5 rounded-full bg-priority-moderate" />
              {t('card.done')}
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1.5">
        {Array.from({ length: totalSets }).map((_, i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full ${
              i < completedSets
                ? active
                  ? 'bg-bone-50 dark:bg-ink-900'
                  : 'bg-ink-900 dark:bg-bone-100'
                : active
                  ? 'bg-white/15 dark:bg-ink-900/15'
                  : 'bg-bone-200 dark:bg-ink-700'
            }`}
          />
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className={`text-[11px] ${active ? 'opacity-70' : 'text-ink-400 dark:text-ink-200'}`}>
          {suggestedWeight}
        </span>
        <span className={`text-[11px] tabular ${active ? 'opacity-90' : 'text-ink-500 dark:text-ink-100'}`}>
          {completedSets}/{totalSets} {t('workout.sets')}
        </span>
      </div>
    </motion.button>
  );
}
