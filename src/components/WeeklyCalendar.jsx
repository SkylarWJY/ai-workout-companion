import React from 'react';
import { motion } from 'framer-motion';
import { WEEKLY_SPLIT, WORKOUTS } from '../data/workoutData.js';
import { useLang, locWorkout } from '../i18n/index.jsx';

export default function WeeklyCalendar({ history = {}, onPick, todayType }) {
  const { t, lang } = useLang();
  const todayIdx = (new Date().getDay() + 6) % 7; // Mon = 0
  return (
    <div className="grid grid-cols-7 gap-1.5">
      {WEEKLY_SPLIT.map((d, i) => {
        const isToday = i === todayIdx;
        const completed = Object.values(history).some(
          (entry) =>
            entry?.type === d.type &&
            entry?.dayIdx === i &&
            entry?.completedAt &&
            sameWeek(new Date(entry.completedAt)),
        );
        const isRest = d.type === 'rest';
        // Show a tiny muscle hint under the type label so the user
        // sees "推日 / 胸·肩·三头" instead of just "推日". Saves them
        // having to remember which day trains what.
        const muscleHint = !isRest && WORKOUTS[d.type]
          ? locWorkout(WORKOUTS[d.type], 'subtitle', lang)
          : null;
        return (
          <motion.button
            key={d.day}
            whileTap={{ scale: 0.94 }}
            onClick={() => !isRest && onPick?.(d.type)}
            className={`group relative aspect-[3/4] rounded-2xl flex flex-col items-center justify-between py-2 px-1 border transition
              ${
                isToday
                  ? 'border-ink-900 dark:border-bone-100 bg-ink-900 dark:bg-bone-100 text-bone-50 dark:text-ink-900'
                  : 'border-black/5 dark:border-white/5 bg-white dark:bg-ink-800 text-ink-700 dark:text-bone-100'
              }
              ${isRest ? 'opacity-50' : 'active:opacity-80'}
            `}
          >
            <span
              className={`text-[10px] uppercase tracking-wider ${
                isToday ? 'opacity-80' : 'text-ink-300 dark:text-ink-300'
              }`}
            >
              {t(`day.${d.day}`)}
            </span>
            <div className="flex flex-col items-center gap-0.5 min-w-0 px-0.5">
              <span className="text-[11px] font-semibold tabular leading-none">
                {t(`type.${d.type}.upper`)}
              </span>
              {muscleHint && (
                <span
                  className={`text-[8px] leading-tight text-center line-clamp-2 ${
                    isToday ? 'opacity-70' : 'text-ink-300 dark:text-ink-300'
                  }`}
                >
                  {muscleHint}
                </span>
              )}
            </div>
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                completed
                  ? 'bg-priority-moderate'
                  : isToday
                    ? 'bg-bone-50 dark:bg-ink-900'
                    : 'bg-transparent'
              }`}
            />
          </motion.button>
        );
      })}
    </div>
  );
}

function sameWeek(date) {
  const now = new Date();
  const day = now.getDay();
  const diff = (day + 6) % 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() - diff);
  monday.setHours(0, 0, 0, 0);
  const nextMon = new Date(monday);
  nextMon.setDate(monday.getDate() + 7);
  return date >= monday && date < nextMon;
}
