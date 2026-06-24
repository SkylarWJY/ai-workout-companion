import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  WORKOUTS,
  WEEKLY_SPLIT,
  USER_PROFILE,
  getTodayWorkoutType,
} from '../../data/workoutData.js';
import { useLang, locWorkout, locEx } from '../../i18n/index.jsx';
import { useOverrides } from '../../hooks/useOverrides.jsx';
import { progressTrend, recommendNextWeight } from '../../utils/progression.js';
import { convertWeight } from '../../utils/weight.js';
import Screen from '../components/Screen.jsx';
import GlassNavBar from '../components/GlassNavBar.jsx';
import IconButton from '../components/IconButton.jsx';
import SectionLabel from '../components/SectionLabel.jsx';
import PrimaryButton from '../components/PrimaryButton.jsx';
import Chip from '../components/Chip.jsx';
import Trend from '../components/Trend.jsx';
import { tints, tintForKind, KIND_LABEL, KIND_LABEL_ZH, springs, stagger } from '../theme.js';

// ─────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────

const ICON = {
  settings: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M19.4 13.6c.04-.5.06-1 .06-1.6s-.02-1.1-.06-1.6l2.06-1.6a.5.5 0 00.12-.65l-1.95-3.38a.5.5 0 00-.6-.22l-2.43.97a7.4 7.4 0 00-2.78-1.6L13.5 2.4a.5.5 0 00-.5-.4h-2.7a.5.5 0 00-.5.4l-.33 2.52a7.4 7.4 0 00-2.78 1.6L4.27 5.55a.5.5 0 00-.6.22L1.7 9.15a.5.5 0 00.12.65l2.06 1.6c-.04.5-.06 1-.06 1.6s.02 1.1.06 1.6l-2.06 1.6a.5.5 0 00-.12.65l1.95 3.38a.5.5 0 00.6.22l2.43-.97a7.4 7.4 0 002.78 1.6l.33 2.52c.05.23.26.4.5.4h2.7a.5.5 0 00.5-.4l.33-2.52a7.4 7.4 0 002.78-1.6l2.43.97a.5.5 0 00.6-.22l1.95-3.38a.5.5 0 00-.12-.65l-2.06-1.6z" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  chevron: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  flame: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2c1 3.5-2 5-2 8 0 1.7 1.3 3 3 3 2 0 3-2 2.5-4 1.8 1.2 2.5 3 2.5 5 0 4-3 7-7 7s-7-3-7-7c0-4 4-5 4-9 0-1.5-1-2-1-3 2.5 0 4 1 5 0z" />
    </svg>
  ),
};

const dayLetterZh = ['日', '一', '二', '三', '四', '五', '六'];

function withinDays(ts, n) {
  return ts && Date.now() - ts < n * 86400000;
}

function computeStreak(history) {
  // Count consecutive days back from today that have a completed session.
  const dates = new Set(
    Object.values(history)
      .filter((h) => h?.completedAt)
      .map((h) => new Date(h.completedAt).toDateString()),
  );
  let streak = 0;
  const cur = new Date();
  while (dates.has(cur.toDateString())) {
    streak += 1;
    cur.setDate(cur.getDate() - 1);
  }
  return streak;
}

function mostRecentSessionType(history) {
  const sessions = Object.values(history || {})
    .filter((h) => h?.completedAt)
    .sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0));
  return sessions[0]?.type || 'push';
}

function hasAnyHistory(history) {
  return Object.values(history || {}).some(
    (h) => h?.completedSets && Object.keys(h.completedSets).length > 0,
  );
}

// ─────────────────────────────────────────────────────────────────────
// Screen
// ─────────────────────────────────────────────────────────────────────

export default function Dashboard({ history = {}, onOpenWorkout }) {
  const { t, lang, setLang } = useLang();
  const { overrides, weightUnit, setWeightUnit } = useOverrides();
  const toggleLang = () => setLang(lang === 'zh' ? 'en' : 'zh');

  const [scrollY, setScrollY] = React.useState(0);
  const showGlass = scrollY > 32;

  const todayType = getTodayWorkoutType();
  const isRest = todayType === 'rest';
  const workout = !isRest ? WORKOUTS[todayType] : null;

  const todayDate = new Date();
  const todayDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][todayDate.getDay()];

  const weekSessions = Object.values(history).filter(
    (h) => h?.completedAt && withinDays(h.completedAt, 7),
  ).length;
  const streak = computeStreak(history);

  // Decide which workout the recommendation card is based on:
  // training day → today's workout; rest day → most recent.
  const displayWorkout = !isRest && workout ? workout : WORKOUTS[mostRecentSessionType(history)];
  const showHistorySection = hasAnyHistory(history);
  const wname = displayWorkout ? locWorkout(displayWorkout, 'name', lang) : '';
  const wsub = displayWorkout ? locWorkout(displayWorkout, 'subtitle', lang) : '';
  const labelTop = !isRest ? (lang === 'zh' ? '今日训练' : "TODAY'S WORKOUT") : (lang === 'zh' ? '最近一次' : 'MOST RECENT');

  return (
    <Screen>
      <GlassNavBar
        title={isRest ? (lang === 'zh' ? '休息日' : 'Rest Day') : wname}
        showGlass={showGlass}
        leading={
          <Chip size="sm" variant="ghost" onClick={toggleLang}>
            {lang === 'zh' ? 'EN' : '中'}
          </Chip>
        }
        trailing={
          <IconButton
            ariaLabel="Settings"
            variant="glass"
            icon={ICON.settings}
            onClick={() => {
              const next = weightUnit === 'kg' ? 'lb' : 'kg';
              setWeightUnit(next);
            }}
          />
        }
      />

      <main
        className="px-5 pb-32 v2-body"
        onScroll={(e) => setScrollY(e.currentTarget.scrollTop)}
      >
        {/* HERO ────────────────────────────────────────────────────── */}
        <Hero
          isRest={isRest}
          dayShort={lang === 'zh' ? `星期${dayLetterZh[todayDate.getDay()]}` : t(`day.${todayDay}`)}
          dateStr={formatDate(todayDate, lang)}
          workoutName={isRest ? (lang === 'zh' ? '休息·恢复' : 'Recovery Day') : wname}
          subtitle={isRest ? (lang === 'zh' ? '今天给身体一点时间。' : 'Give the work time to land.') : wsub}
          exerciseCount={workout?.exercises?.length}
          estMin={workout?.estMinutes}
          onStart={!isRest ? () => onOpenWorkout(workout.id) : null}
        />

        {/* PROGRESS / TODAY'S PLAN ─────────────────────────────────── */}
        {showHistorySection && displayWorkout && (
          <ExerciseProgressCard
            label={labelTop}
            workout={displayWorkout}
            history={history}
            weightUnit={weightUnit}
            lang={lang}
            isToday={!isRest}
            onOpen={() => onOpenWorkout(displayWorkout.id)}
          />
        )}

        {/* WEEKLY CALENDAR ─────────────────────────────────────────── */}
        <section className="mt-10">
          <SectionLabel>{lang === 'zh' ? '本周节奏' : 'This week'}</SectionLabel>
          <WeeklyStrip history={history} onPick={onOpenWorkout} lang={lang} t={t} />
        </section>

        {/* QUICK STATS ─────────────────────────────────────────────── */}
        <section className="mt-10 grid grid-cols-2 gap-3">
          <StatTile
            label={lang === 'zh' ? '本周训练' : 'SESSIONS / WK'}
            value={`${weekSessions}`}
            sub={lang === 'zh' ? '目标 3–4' : 'goal 3–4'}
            tint={weekSessions >= 3 ? tints.green : null}
          />
          <StatTile
            label={lang === 'zh' ? '连续训练' : 'STREAK'}
            value={`${streak}`}
            suffix="d"
            sub={lang === 'zh' ? '保持节奏' : 'consistency wins'}
            tint={streak >= 3 ? tints.orange : null}
            icon={streak >= 3 ? ICON.flame : null}
          />
        </section>

        {/* MISSION ─────────────────────────────────────────────────── */}
        <Mission overrides={overrides} lang={lang} t={t} />
      </main>
    </Screen>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Subcomponents
// ─────────────────────────────────────────────────────────────────────

function formatDate(d, lang) {
  if (lang === 'zh') {
    return `${d.getMonth() + 1} 月 ${d.getDate()} 日`;
  }
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function Hero({ isRest, dayShort, dateStr, workoutName, subtitle, exerciseCount, estMin, onStart }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springs.smooth, delay: 0.04 }}
      className="pt-8"
    >
      <div className="v2-caption text-white/55">
        {dayShort} · {dateStr}
      </div>

      <h1 className="v2-display text-[44px] leading-[1.02] mt-2 max-w-[10ch]">
        {workoutName}.
      </h1>

      <p className="v2-body text-[15px] text-white/65 mt-3 max-w-[22ch]">
        {subtitle}
      </p>

      {/* Stats inline (only for training days) */}
      {!isRest && exerciseCount != null && (
        <div className="mt-5 flex items-center gap-2">
          <Chip variant="solid" size="md">
            {exerciseCount}{' '}
            <span className="opacity-65">moves</span>
          </Chip>
          {estMin && (
            <Chip variant="solid" size="md">
              ~{estMin}{' '}
              <span className="opacity-65">min</span>
            </Chip>
          )}
        </div>
      )}

      {/* Primary CTA — only on training days */}
      {onStart && (
        <div className="mt-7">
          <PrimaryButton
            size="lg"
            fullWidth
            onClick={onStart}
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M6 4l14 8-14 8V4z" fill="currentColor" />
              </svg>
            }
          >
            Start session
          </PrimaryButton>
        </div>
      )}
    </motion.section>
  );
}

function ExerciseProgressCard({
  label,
  workout,
  history,
  weightUnit,
  lang,
  isToday,
  onOpen,
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springs.smooth, delay: 0.12 }}
      className="mt-10"
    >
      <SectionLabel>{label}</SectionLabel>

      <motion.button
        type="button"
        onClick={onOpen}
        whileTap={{ scale: 0.985 }}
        transition={springs.press}
        className="w-full v2-card p-5 text-left"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="v2-title text-[20px] truncate">{locWorkout(workout, 'name', lang)}</div>
            <div className="v2-body text-[13px] text-white/55 mt-1 truncate">
              {locWorkout(workout, 'subtitle', lang)}
            </div>
          </div>
          <span className="opacity-50 mt-1">{ICON.chevron}</span>
        </div>

        <div className="mt-4 space-y-1">
          {(workout.exercises || []).slice(0, 6).map((ex, i) => (
            <ExerciseRow
              key={ex.id}
              ex={ex}
              history={history}
              weightUnit={weightUnit}
              lang={lang}
              isToday={isToday}
              idx={i + 1}
            />
          ))}
        </div>
      </motion.button>
    </motion.section>
  );
}

function ExerciseRow({ ex, history, weightUnit, lang, isToday, idx }) {
  const trend = useMemo(
    () => progressTrend({ history, exerciseId: ex.id, variantKey: null, currentUnit: weightUnit }),
    [history, ex.id, weightUnit],
  );
  const rec = useMemo(
    () =>
      recommendNextWeight({
        history,
        exerciseId: ex.id,
        variantKey: null,
        repRange: ex.repRange,
        currentUnit: weightUnit,
      }),
    [history, ex.id, ex.repRange, weightUnit],
  );

  const hasHist = !!trend?.last;
  const name = locEx(ex, 'name', lang);

  // Right column: either a recommendation chip, the last weight, or
  // "First time" hint.
  let rightContent;
  if (!hasHist) {
    rightContent = (
      <span className="v2-caption text-[10px] text-white/40 tracking-wide">
        {lang === 'zh' ? '首次基线' : 'First baseline'}
      </span>
    );
  } else if (isToday && rec) {
    const tint = tintForKind(rec.kind);
    const label = (lang === 'zh' ? KIND_LABEL_ZH : KIND_LABEL)[rec.kind] || '';
    rightContent = (
      <div className="flex flex-col items-end gap-1">
        <Chip size="sm" tint={tint}>
          {rec.weight} {weightUnit}
        </Chip>
        <span className="v2-caption text-[10px] text-white/40 tracking-wide whitespace-nowrap">
          {label}
        </span>
      </div>
    );
  } else {
    rightContent = (
      <div className="flex flex-col items-end gap-1">
        <span className="v2-num text-[15px] font-semibold text-white">
          {trend.last.weight} {weightUnit}
        </span>
        <span className="v2-caption text-[10px] text-white/40 tracking-wide">
          {lang === 'zh' ? `× ${trend.last.reps}` : `× ${trend.last.reps} last`}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 py-3 first:pt-2 last:pb-1">
      <span className="v2-num text-[11px] tracking-wider text-white/35 w-5">
        {String(idx).padStart(2, '0')}
      </span>
      <div className="flex-1 min-w-0">
        <div className="v2-body text-[15px] text-white truncate">{name}</div>
        {hasHist && trend.points.length > 1 && (
          <div className="mt-1.5">
            <Trend points={trend.points.slice(-8)} tint={tints.green} height={18} />
          </div>
        )}
      </div>
      <div className="shrink-0">{rightContent}</div>
    </div>
  );
}

function WeeklyStrip({ history, onPick, lang, t }) {
  const todayIdx = (new Date().getDay() + 6) % 7;
  return (
    <motion.div
      variants={{ show: { transition: stagger } }}
      initial="hidden"
      animate="show"
      className="grid grid-cols-7 gap-1.5"
    >
      {WEEKLY_SPLIT.map((d, i) => {
        const isToday = i === todayIdx;
        const isRest = d.type === 'rest';
        const completed = Object.values(history).some(
          (h) => h?.type === d.type && h?.completedAt && withinDays(h.completedAt, 7),
        );
        const muscleHint = !isRest && WORKOUTS[d.type] ? locWorkout(WORKOUTS[d.type], 'subtitle', lang).split(' · ')[0] : null;

        return (
          <motion.button
            key={d.day}
            variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
            transition={springs.smooth}
            whileTap={!isRest ? { scale: 0.94 } : {}}
            onClick={() => !isRest && onPick(d.type)}
            disabled={isRest}
            className={[
              'relative aspect-[3/4.4] rounded-2xl flex flex-col items-center justify-between py-2 px-1.5',
              isToday
                ? 'bg-white text-black'
                : isRest
                  ? 'bg-white/[0.04] text-white/35'
                  : 'bg-white/[0.06] text-white/85 v2-press',
            ].join(' ')}
            style={
              isToday
                ? { boxShadow: '0 0 0 0.5px rgba(255,255,255,0.4), 0 12px 32px -10px rgba(255,255,255,0.25)' }
                : { boxShadow: 'inset 0 0.5px 0 0 rgba(255,255,255,0.06)' }
            }
          >
            <span className="v2-caption text-[9px] opacity-65">
              {lang === 'zh' ? dayLetterZh[(i + 1) % 7] : t(`day.${d.day}`)}
            </span>
            <div className="flex flex-col items-center gap-0.5 min-w-0 w-full">
              <span className="v2-title text-[12px] leading-none">
                {lang === 'zh' ? typeLabelZh(d.type) : t(`type.${d.type}.upper`)}
              </span>
              {muscleHint && (
                <span className={`text-[8.5px] leading-tight text-center line-clamp-1 ${isToday ? 'opacity-60' : 'opacity-45'}`}>
                  {muscleHint}
                </span>
              )}
            </div>
            <span
              className={`w-1 h-1 rounded-full ${
                completed
                  ? isToday ? 'bg-black' : 'bg-[#30D158]'
                  : 'bg-transparent'
              }`}
            />
          </motion.button>
        );
      })}
    </motion.div>
  );
}

function typeLabelZh(type) {
  return { push: '推', pull: '拉', leg: '腿', rest: '休' }[type] || type;
}

function StatTile({ label, value, suffix, sub, tint = null, icon = null }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springs.smooth}
      className="v2-card p-4 flex flex-col gap-1"
    >
      <div className="v2-caption">{label}</div>
      <div className="flex items-baseline gap-1 mt-1">
        <span
          className="v2-num text-[28px] font-semibold tracking-[-0.02em]"
          style={tint ? { color: tint } : { color: '#FFFFFF' }}
        >
          {value}
        </span>
        {suffix && (
          <span className="v2-body text-[13px] text-white/40">{suffix}</span>
        )}
        {icon && <span className="ml-0.5" style={{ color: tint || 'white' }}>{icon}</span>}
      </div>
      {sub && <div className="v2-body text-[12px] text-white/45 mt-0.5">{sub}</div>}
    </motion.div>
  );
}

function Mission({ overrides, lang }) {
  const o = overrides.profile || {};
  const goalsList = o.goals ?? USER_PROFILE.goals;
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springs.smooth, delay: 0.2 }}
      className="mt-10"
    >
      <SectionLabel>{lang === 'zh' ? '当前目标' : 'CURRENT MISSION'}</SectionLabel>
      <div className="v2-card p-5">
        <div className="flex flex-wrap gap-2">
          {goalsList.map((g, i) => (
            <Chip key={i} variant="solid">{g}</Chip>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
