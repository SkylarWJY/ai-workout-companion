import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { USER_PROFILE, WORKOUTS, getTodayWorkoutType } from '../data/workoutData.js';
import WeeklyCalendar from './WeeklyCalendar.jsx';
import ProgressBar from './ProgressBar.jsx';
import GoalsEditor from './GoalsEditor.jsx';
import { useLang, locWorkout, locEx } from '../i18n/index.jsx';
import { useOverrides } from '../hooks/useOverrides.jsx';
import { progressTrend, recommendNextWeight } from '../utils/progression.js';

const StatTile = ({ label, value, sub, accent }) => (
  <div className="rounded-3xl bg-white dark:bg-ink-800 border border-black/5 dark:border-white/5 p-4 shadow-card dark:shadow-cardDark">
    <div className="text-[10px] uppercase tracking-wider text-ink-300 dark:text-ink-300">
      {label}
    </div>
    <div
      className={`mt-1 text-2xl font-semibold tabular ${
        accent ? 'text-priority-extreme' : 'text-ink-900 dark:text-bone-100'
      }`}
    >
      {value}
    </div>
    {sub && (
      <div className="mt-0.5 text-xs text-ink-400 dark:text-ink-200">{sub}</div>
    )}
  </div>
);

export default function Dashboard({ onOpenWorkout, history = {} }) {
  const { t, lang } = useLang();
  const { overrides, weightUnit } = useOverrides();
  const [goalsEditorOpen, setGoalsEditorOpen] = useState(false);
  const todayType = getTodayWorkoutType();
  const isRest = todayType === 'rest';
  const workout = !isRest ? WORKOUTS[todayType] : null;

  const weekSessions = Object.values(history).filter(
    (h) => h?.completedAt && withinDays(h.completedAt, 7),
  ).length;
  const streak = computeStreak(history);

  // overrides
  const o = overrides.profile || {};
  const currentBF = o.bf ?? USER_PROFILE.currentBodyFat;
  const targetBF = o.targetBf ?? USER_PROFILE.targetBodyFat;
  const goalsList = o.goals ?? USER_PROFILE.goals;
  const pullUpCurrent = o.pullUpCurrent ?? USER_PROFILE.pullUpProgression.current;
  const pullUpTarget = o.pullUpTarget ?? USER_PROFILE.pullUpProgression.target;

  const bfProgress =
    100 -
    Math.min(
      100,
      Math.max(
        0,
        ((currentBF - targetBF) /
          (USER_PROFILE.currentBodyFat - targetBF)) *
          100,
      ),
    );

  const dayShortKey = `day.${
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()]
  }`;

  const localizedWorkoutName = workout ? locWorkout(workout, 'name', lang) : '';
  const localizedSubtitle = workout ? locWorkout(workout, 'subtitle', lang) : '';

  return (
    <div className="px-5 pb-32 pt-2 space-y-5">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="flex items-baseline justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-ink-300 dark:text-ink-300">
              {t(dayShortKey)} · {t('day.today')}
            </div>
            <h1 className="mt-1 text-[34px] leading-[1.05] font-semibold tracking-tight text-ink-900 dark:text-bone-100">
              {isRest ? t('dash.recovery') : `${localizedWorkoutName}.`}
            </h1>
          </div>
        </div>
        {!isRest ? (
          <p className="mt-2 text-sm text-ink-400 dark:text-ink-200">
            {localizedSubtitle} · {workout.exercises.length} {t('dash.exercises')} · ~
            {workout.estMinutes} {t('dash.estMin')}
          </p>
        ) : (
          <p className="mt-2 text-sm text-ink-400 dark:text-ink-200">
            {t('dash.recoveryNote')}
          </p>
        )}

        {!isRest && (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => onOpenWorkout(todayType)}
            className="mt-5 w-full rounded-3xl bg-ink-900 dark:bg-bone-100 text-bone-50 dark:text-ink-900 py-5 px-6 flex items-center justify-between shadow-card dark:shadow-cardDark"
          >
            <span className="flex flex-col items-start">
              <span className="text-[11px] uppercase tracking-wider opacity-60">
                {t('dash.startSession')}
              </span>
              <span className="mt-0.5 text-lg font-semibold">
                {t('dash.begin')} {localizedWorkoutName}
              </span>
            </span>
            <span className="w-10 h-10 rounded-full bg-bone-50/10 dark:bg-ink-900/10 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12h14M13 5l7 7-7 7"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </motion.button>
        )}
      </motion.div>

      {/* PROGRESS CARD — visible on EVERY screen, both training days
          and rest days. The content adapts:
          • Training day → "Today's plan" with [try today] recommendations
            for today's lineup
          • Rest day    → "Recent progress" showing the most-recent
            completed session's exercises, so the user can still see
            how they've been progressing on any given day
          Always anchored on real history — brand-new users (no logged
          sessions yet) see neither card, just the streak / stats. */}
      {hasAnyHistory(history) && (() => {
        const displayWorkout = !isRest && workout
          ? workout
          : WORKOUTS[mostRecentSessionType(history)];
        if (!displayWorkout) return null;
        const label = !isRest
          ? t('dash.todaysPlan')
          : t('dash.recentProgress');
        const showRecBadge = !isRest;
        // Show WHICH workout day + which muscles it trains, so the
        // user can connect "01 Overhead Press / 02 Lateral Raises..."
        // to "this is Push Day · Chest · Shoulders · Triceps".
        const wname = locWorkout(displayWorkout, 'name', lang);
        const wsub = locWorkout(displayWorkout, 'subtitle', lang);
        return (
          <section>
            <SectionLabel>{label}</SectionLabel>
            <div className="rounded-3xl bg-white dark:bg-ink-800 border border-black/5 dark:border-white/5 p-4 shadow-card dark:shadow-cardDark">
              <div className="flex items-baseline justify-between mb-3 pb-3 border-b border-black/5 dark:border-white/5">
                <div className="text-[14px] font-semibold text-ink-900 dark:text-bone-100">
                  {wname}
                </div>
                <div className="text-[11px] text-ink-400 dark:text-ink-200 text-right">
                  {wsub}
                </div>
              </div>
              <div className="space-y-3">
                {displayWorkout.exercises.map((ex, i) => (
                  <ExercisePlanRow
                    key={ex.id}
                    exercise={ex}
                    index={i + 1}
                    history={history}
                    variantKey={overrides.lastVariant?.[ex.id]}
                    weightUnit={weightUnit}
                    t={t}
                    lang={lang}
                    showRecBadge={showRecBadge}
                  />
                ))}
              </div>
            </div>
          </section>
        );
      })()}

      <section>
        <SectionLabel>{t('dash.thisWeek')}</SectionLabel>
        <WeeklyCalendar
          history={history}
          onPick={onOpenWorkout}
          todayType={todayType}
        />
      </section>

      <section className="grid grid-cols-2 gap-2.5">
        <StatTile label={t('dash.sessionsWk')} value={weekSessions} sub={t('dash.sessionsGoal')} />
        <StatTile label={t('dash.streak')} value={`${streak}d`} sub={t('dash.streakSub')} />
        <StatTile
          label={t('dash.bodyFat')}
          value={`${currentBF}%`}
          sub={`${t('dash.target')} ${targetBF}%`}
        />
        <StatTile
          label={t('dash.pullup')}
          value={pullUpCurrent}
          sub={pullUpTarget}
          accent
        />
      </section>

      <section className="rounded-3xl bg-white dark:bg-ink-800 border border-black/5 dark:border-white/5 p-5 shadow-card dark:shadow-cardDark">
        <div className="flex items-center justify-between mb-3">
          <SectionLabel className="!mb-0">{t('dash.mission')}</SectionLabel>
          <button
            onClick={() => setGoalsEditorOpen(true)}
            aria-label={t('edit.button')}
            className="w-7 h-7 rounded-full bg-bone-100 dark:bg-ink-700 flex items-center justify-center text-ink-400 dark:text-ink-200 active:scale-95 transition"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
              <path d="M12 20h9M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div className="space-y-3">
          <GoalRow
            label={t('dash.goal.recomp')}
            value={`${currentBF}% → ${targetBF}%`}
            progress={bfProgress}
          />
          <GoalRow
            label={t('dash.goal.shoulder')}
            value={t('dash.goal.shoulderSub')}
            progress={32}
          />
          <GoalRow
            label={t('dash.goal.lat')}
            value={t('dash.goal.latSub')}
            progress={45}
          />
          <GoalRow
            label={t('dash.goal.pullup')}
            value={pullUpTarget}
            progress={20}
          />
        </div>
        <div className="mt-5 flex flex-wrap gap-1.5">
          {goalsList.map((g) => (
            <GoalChip key={g}>{g}</GoalChip>
          ))}
        </div>
      </section>
      <GoalsEditor open={goalsEditorOpen} onClose={() => setGoalsEditorOpen(false)} />

      <section className="rounded-3xl border border-black/5 dark:border-white/5 p-5">
        <SectionLabel className="!mb-2">{t('dash.notes')}</SectionLabel>
        <ul className="space-y-2 text-[13px] text-ink-500 dark:text-ink-100 leading-relaxed">
          <li>{t('dash.note.1')}</li>
          <li>{t('dash.note.2')}</li>
          <li>{t('dash.note.3')}</li>
          <li>{t('dash.note.4')}</li>
        </ul>
      </section>
    </div>
  );
}

const SectionLabel = ({ children, className = '' }) => (
  <div
    className={`text-[11px] uppercase tracking-[0.18em] text-ink-300 dark:text-ink-300 mb-2 ${className}`}
  >
    {children}
  </div>
);

const GoalRow = ({ label, value, progress }) => (
  <div>
    <div className="flex justify-between text-sm">
      <span className="text-ink-700 dark:text-bone-100">{label}</span>
      <span className="text-ink-400 dark:text-ink-200 text-xs tabular">{value}</span>
    </div>
    <div className="mt-1.5">
      <ProgressBar value={progress} total={100} thin />
    </div>
  </div>
);

const GoalChip = ({ children }) => (
  <span className="text-[11px] uppercase tracking-wider text-ink-700 dark:text-bone-100 bg-bone-100 dark:bg-ink-700 rounded-full px-2.5 py-1">
    {children}
  </span>
);

// Compact per-exercise row showing recommendation + trend. Designed for
// the dashboard's "Today's Plan" card so the user sees their progress
// without diving into a modal.
function ExercisePlanRow({ exercise, index, history, variantKey, weightUnit, t, lang, showRecBadge = true }) {
  const trend = progressTrend({
    history,
    exerciseId: exercise.id,
    variantKey,
    currentUnit: weightUnit,
  });
  const rec = recommendNextWeight({
    history,
    exerciseId: exercise.id,
    variantKey,
    repRange: exercise.repRange,
    currentUnit: weightUnit,
  });
  const hasHistory = trend.points.length > 0;
  const hasTrend = trend.points.length >= 2;
  const positive = hasTrend && trend.delta > 0;
  const negative = hasTrend && trend.delta < 0;
  const arrow = positive ? '↑' : negative ? '↓' : '→';
  const trendColor = positive
    ? 'text-priority-moderate'
    : negative
      ? 'text-priority-extreme'
      : 'text-ink-300';

  const recColor =
    rec?.kind === 'bigBump' || rec?.kind === 'smallBump'
      ? 'text-priority-moderate'
      : rec?.kind === 'deload'
        ? 'text-priority-extreme'
        : 'text-ink-900 dark:text-bone-100';

  const name = locEx(exercise, 'name', lang);

  return (
    <div className="flex items-start gap-3">
      <span className="text-[10px] uppercase tracking-wider text-ink-300 tabular w-5 mt-1">
        {String(index).padStart(2, '0')}
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-[14px] font-medium text-ink-900 dark:text-bone-100 truncate leading-tight">
          {name}
        </div>
        <div className="text-[11px] text-ink-400 dark:text-ink-200 tabular mt-0.5 leading-snug">
          {hasHistory ? (
            <>
              {t('dash.lastShort')} {trend.last.weight} {weightUnit} × {trend.last.reps}
              {trend.last.difficulty &&
                ` · ${t(`log.diff.${trend.last.difficulty}`)}`}
            </>
          ) : (
            <span className="opacity-70">{t('dash.firstTime')}</span>
          )}
        </div>
      </div>
      <div className="text-right shrink-0">
        {/* Right column. On training days we show the algorithm's
            recommendation ("try today: 17.5 kg"). On rest days we
            show the last actual weight as the headline — the user
            is reviewing history, not planning today's lifts. */}
        {showRecBadge && rec ? (
          <>
            <div className={`text-[15px] font-semibold tabular leading-tight ${recColor}`}>
              {rec.weight} {weightUnit}
            </div>
            <div className="text-[9px] uppercase tracking-wider text-ink-300 mt-0.5">
              {t('dash.todayTry')}
            </div>
          </>
        ) : hasHistory ? (
          <div className="text-[15px] font-semibold tabular leading-tight text-ink-900 dark:text-bone-100">
            {trend.last.weight} {weightUnit}
          </div>
        ) : null}
        {hasTrend && trend.percentChange != null && (
          <div className={`text-[10px] tabular mt-0.5 ${trendColor}`}>
            {arrow} {Math.abs(Math.round(trend.percentChange))}%
          </div>
        )}
      </div>
    </div>
  );
}

// On rest days we want to show progress for SOMETHING — pick the
// workout type the user trained most recently. Falls back to null
// when history is empty so the caller skips the card.
function mostRecentSessionType(history) {
  if (!history) return null;
  let bestType = null;
  let bestTs = 0;
  for (const s of Object.values(history)) {
    if (!s?.completedAt) continue;
    if (s.completedAt > bestTs) {
      bestTs = s.completedAt;
      bestType = s.type;
    }
  }
  return bestType;
}

// Returns true if any completed session exists in history.
function hasAnyHistory(history) {
  if (!history) return false;
  for (const s of Object.values(history)) {
    if (s?.completedAt) return true;
  }
  return false;
}

function withinDays(ts, days) {
  return Date.now() - new Date(ts).getTime() <= days * 86400000;
}

function computeStreak(history) {
  const days = new Set(
    Object.values(history)
      .filter((h) => h?.completedAt)
      .map((h) => new Date(h.completedAt).toDateString()),
  );
  let s = 0;
  for (let i = 0; i < 60; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    if (days.has(d.toDateString())) s += 1;
    else if (i > 0) break;
  }
  return s;
}
