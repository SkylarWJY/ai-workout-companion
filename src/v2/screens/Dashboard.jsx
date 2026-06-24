import React, { useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  WEEKLY_SPLIT,
  USER_PROFILE,
  getTodayWorkoutType,
  getWorkoutsForPlan,
  getRecommendedSplit,
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
import ActivityRing from '../components/ActivityRing.jsx';
import CountUp from '../components/CountUp.jsx';
import MeshGradient from '../components/MeshGradient.jsx';
import VolumeChart from '../components/VolumeChart.jsx';
import SettingsSheet from '../components/SettingsSheet.jsx';
import SessionHistorySheet from '../components/SessionHistorySheet.jsx';
import { useTheme as useV2Theme } from '../useTheme.js';
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

// Aggregate weekly volume = sum(weight × reps) for every set in each
// ISO-week bucket. Returns up to 8 most-recent weeks for the chart.
function buildVolumeSeries(history, unit) {
  const sessions = Object.values(history || {}).filter((h) => h?.completedAt && h?.completedSets);
  const weekly = new Map();
  for (const s of sessions) {
    const wk = isoWeekKey(new Date(s.completedAt));
    let vol = 0;
    for (const arr of Object.values(s.completedSets)) {
      for (const log of arr) {
        const w = Number(log.weight) || 0;
        const reps = Number(log.reps) || 0;
        // Skip bodyweight zeros so the chart isn't dominated by reps-only work.
        if (w === 0) continue;
        vol += w * reps;
      }
    }
    weekly.set(wk, (weekly.get(wk) || 0) + vol);
  }
  const series = [...weekly.entries()]
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .slice(-8)
    .map(([k, v]) => ({ label: k, value: Math.round(v) }));
  return series;
}

function isoWeekKey(d) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

// ─────────────────────────────────────────────────────────────────────
// Screen
// ─────────────────────────────────────────────────────────────────────

export default function Dashboard({ history = {}, onOpenWorkout }) {
  const { t, lang, setLang } = useLang();
  const { overrides, weightUnit, setWeightUnit, setOverride, clearOverride, setTopLevel } = useOverrides();
  const { theme, toggle: toggleTheme } = useV2Theme();
  const toggleLang = () => setLang(lang === 'zh' ? 'en' : 'zh');

  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [historyOpen, setHistoryOpen] = React.useState(false);
  const scrollRef = React.useRef(null);
  const { scrollY: motionScrollY } = useScroll({ container: scrollRef });
  // Hero parallax — text drifts up at 0.4x scroll, mesh drifts at 0.2x.
  const heroY     = useTransform(motionScrollY, [0, 240], [0, -28]);
  const heroOpacity = useTransform(motionScrollY, [0, 180], [1, 0.35]);
  const meshY     = useTransform(motionScrollY, [0, 320], [0, -64]);
  const [scrollY, setScrollY] = React.useState(0);
  React.useEffect(() => motionScrollY.on('change', (v) => setScrollY(v)), [motionScrollY]);
  const showGlass = scrollY > 32;

  // User can customize the weekly split — overrides.weeklySplit is a
  // [{day, type}] array that mirrors WEEKLY_SPLIT but with any day's
  // type swapped through edit mode below.
  // Default is the active plan's coach-tuned recommendation (Skylar
  // bumps to 5 training days: Pull/Push 2× each + Leg 1×).
  const weeklySplit = overrides.weeklySplit || getRecommendedSplit(overrides.plan?.active);
  // Plan-aware workout lookup. `overrides.activePlan` cycles through
  // 'default' (the bundled program) and 'skylar' (coach plan tuned to
  // her side-delt + V-taper goals). Pull this once + use everywhere.
  const WORKOUTS = getWorkoutsForPlan(overrides.plan?.active);
  const todayIdx = (new Date().getDay() + 6) % 7;  // Mon = 0
  const todayType = weeklySplit[todayIdx]?.type || 'rest';
  const isRest = todayType === 'rest';
  const workout = !isRest ? WORKOUTS[todayType] : null;
  const [editingCalendar, setEditingCalendar] = React.useState(false);
  const setDayType = (idx, type) => {
    const next = weeklySplit.map((d, i) => (i === idx ? { ...d, type } : d));
    setTopLevel('weeklySplit', next);
  };
  const resetSplit = () => setTopLevel('weeklySplit', null);

  const todayDate = new Date();
  const todayDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][todayDate.getDay()];

  const weekSessions = Object.values(history).filter(
    (h) => h?.completedAt && withinDays(h.completedAt, 7),
  ).length;
  const streak = computeStreak(history);

  // Weekly training-volume (kg × reps summed per session) for the chart.
  const volumePoints = useMemo(() => buildVolumeSeries(history, weightUnit), [history, weightUnit]);
  const totalVolumeWeek = volumePoints.slice(-1)[0]?.value || 0;

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
          <div className="flex items-center gap-1.5">
            <Chip size="sm" variant="ghost" onClick={toggleLang}>
              {lang === 'zh' ? 'EN' : '中'}
            </Chip>
            <IconButton
              ariaLabel="Toggle theme"
              variant="ghost"
              size={30}
              icon={theme === 'light'
                ? <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="4.2"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5.6 5.6L7 7M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4" strokeLinecap="round"/></svg>
              }
              onClick={toggleTheme}
            />
          </div>
        }
        trailing={
          <IconButton
            ariaLabel="Settings"
            variant="glass"
            icon={ICON.settings}
            onClick={() => setSettingsOpen(true)}
          />
        }
      />

      <main
        ref={scrollRef}
        className="px-5 v2-body overflow-y-auto"
        style={{
          height: 'calc(100dvh - env(safe-area-inset-top))',
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 32px)',
        }}
      >
        {/* HERO with mesh, ring, parallax ─────────────────────────── */}
        <Hero
          isRest={isRest}
          dayShort={lang === 'zh' ? `星期${dayLetterZh[todayDate.getDay()]}` : t(`day.${todayDay}`)}
          dateStr={formatDate(todayDate, lang)}
          workoutName={isRest ? (lang === 'zh' ? '休息·恢复' : 'Recovery Day') : wname}
          workoutId={!isRest ? workout?.id : 'rest'}
          subtitle={isRest ? (lang === 'zh' ? '今天给身体一点时间。' : 'Give the work time to land.') : wsub}
          exerciseCount={workout?.exercises?.length}
          estMin={workout?.estMinutes}
          onStart={!isRest ? () => onOpenWorkout(workout.id) : null}
          weekSessions={weekSessions}
          streak={streak}
          totalVolume={totalVolumeWeek}
          weightUnit={weightUnit}
          lang={lang}
          heroY={heroY}
          heroOpacity={heroOpacity}
          meshY={meshY}
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

        {/* VOLUME CHART ────────────────────────────────────────────── */}
        {volumePoints.length > 1 && (
          <section className="mt-10">
            <SectionLabel
              trailing={
                <span className="v2-caption v2-t3">
                  {lang === 'zh' ? '过去 8 周' : 'last 8 wks'}
                </span>
              }
            >
              {lang === 'zh' ? '训练量曲线' : 'Volume trend'}
            </SectionLabel>
            <div className="v2-card p-5">
              <div className="flex items-baseline justify-between mb-3">
                <div>
                  <div className="v2-caption v2-t2">{lang === 'zh' ? '本周累计' : 'THIS WEEK'}</div>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <CountUp
                      value={totalVolumeWeek}
                      className="v2-t1 text-[32px] font-semibold tracking-[-0.02em]"
                    />
                    <span className="v2-t3 text-[13px]">{weightUnit} · {lang === 'zh' ? '总量' : 'volume'}</span>
                  </div>
                </div>
              </div>
              <VolumeChart points={volumePoints} tint={tints.mint} height={120} />
            </div>
          </section>
        )}

        {/* WEEKLY CALENDAR ─────────────────────────────────────────── */}
        <section className="mt-10">
          <SectionLabel
            trailing={
              <button
                type="button"
                onClick={() => setEditingCalendar((v) => !v)}
                className="v2-caption v2-t2 hover:v2-t1 transition inline-flex items-center gap-1"
              >
                {editingCalendar ? (
                  <>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                      <path d="M4 12l5 5 11-11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {lang === 'zh' ? '完成' : 'Done'}
                  </>
                ) : (
                  <>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                      <path d="M12 20h9M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {lang === 'zh' ? '编辑' : 'Edit'}
                  </>
                )}
              </button>
            }
          >
            {lang === 'zh' ? '本周节奏' : 'This week'}
          </SectionLabel>
          <WeeklyStrip
            history={history}
            onPick={onOpenWorkout}
            lang={lang}
            t={t}
            weeklySplit={weeklySplit}
            setDayType={setDayType}
            editing={editingCalendar}
            workouts={WORKOUTS}
          />
          {editingCalendar && overrides.weeklySplit && (
            <button
              type="button"
              onClick={resetSplit}
              className="mt-2 v2-caption v2-t3 text-[10px] hover:v2-t1 transition mx-auto block"
            >
              {lang === 'zh' ? '恢复默认顺序' : 'Reset to default'}
            </button>
          )}
        </section>

        {/* MISSION ─────────────────────────────────────────────────── */}
        <Mission overrides={overrides} lang={lang} t={t} />
      </main>

      <SettingsSheet open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <SessionHistorySheet open={historyOpen} onClose={() => setHistoryOpen(false)} />
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

function Hero({
  isRest, dayShort, dateStr, workoutName, workoutId, subtitle, exerciseCount, estMin, onStart,
  weekSessions, streak, totalVolume, weightUnit, lang, heroY, heroOpacity, meshY,
}) {
  const SESSION_GOAL = 3;
  const STREAK_GOAL = 7;
  const rings = [
    { progress: weekSessions / SESSION_GOAL,  tint: tints.mint,   label: 'Move',  value: weekSessions },
    { progress: streak / STREAK_GOAL,         tint: tints.orange, label: 'Streak', value: streak },
  ];

  return (
    <section className="relative pt-8">
      {/* Mesh blob behind the text. Parallaxes slightly slower than text. */}
      <motion.div
        style={{ y: meshY }}
        className="absolute -inset-x-8 -top-10 h-[420px] z-0 pointer-events-none"
      >
        <MeshGradient />
      </motion.div>

      <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springs.smooth, delay: 0.05 }}
          className="v2-caption v2-t2"
        >
          {dayShort} · {dateStr}
        </motion.div>

        <motion.h1
          layoutId={`workout-name-${workoutId}`}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springs.smooth, delay: 0.1 }}
          className="v2-display text-[44px] leading-[1.02] mt-2 max-w-[10ch] v2-t1"
        >
          {workoutName}.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springs.smooth, delay: 0.16 }}
          className="v2-body text-[15px] v2-t2 mt-3 max-w-[22ch]"
        >
          {subtitle}
        </motion.p>

        {/* Activity rings + summary numbers */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springs.smooth, delay: 0.24 }}
          className="mt-6 flex items-center gap-5"
        >
          <ActivityRing
            rings={rings}
            size={132}
            stroke={11}
            gap={3}
            delay={0.3}
            center={
              <div className="text-center">
                <CountUp
                  value={weekSessions}
                  className="v2-display text-[28px] v2-t1"
                />
                <div className="v2-caption v2-t3 mt-0.5 text-[9px]">
                  {lang === 'zh' ? '本周' : 'this week'}
                </div>
              </div>
            }
          />
          <div className="flex-1 min-w-0 space-y-2.5">
            <RingStat
              tint={tints.mint}
              label={lang === 'zh' ? '本周训练' : 'Sessions'}
              value={weekSessions}
              goal={SESSION_GOAL}
              suffix={`/ ${SESSION_GOAL}`}
            />
            <RingStat
              tint={tints.orange}
              label={lang === 'zh' ? '连续' : 'Streak'}
              value={streak}
              goal={STREAK_GOAL}
              suffix={lang === 'zh' ? ' 天' : 'd'}
            />
            {totalVolume > 0 && (
              <RingStat
                tint={tints.blue}
                label={lang === 'zh' ? '本周训练量' : 'Volume'}
                value={totalVolume}
                goal={null}
                suffix={` ${weightUnit}`}
              />
            )}
          </div>
        </motion.div>

        {/* Stats inline (only for training days) */}
        {!isRest && exerciseCount != null && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springs.smooth, delay: 0.32 }}
            className="mt-6 flex items-center gap-2"
          >
            <Chip variant="solid" size="md">
              {exerciseCount}{' '}
              <span className="opacity-65">{lang === 'zh' ? '动作' : 'moves'}</span>
            </Chip>
            {estMin && (
              <Chip variant="solid" size="md">
                ~{estMin}{' '}
                <span className="opacity-65">min</span>
              </Chip>
            )}
          </motion.div>
        )}

        {/* Primary CTA — only on training days */}
        {onStart && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springs.smooth, delay: 0.4 }}
            className="mt-6"
          >
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
              {lang === 'zh' ? '开始训练' : 'Start session'}
            </PrimaryButton>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}

function RingStat({ tint, label, value, goal, suffix }) {
  const pct = goal ? Math.min(1, value / goal) : 1;
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="v2-caption v2-t2 text-[10px]">{label}</span>
        <span className="v2-num text-[14px] font-semibold v2-t1">
          <CountUp value={value} />
          <span className="v2-t3 font-normal">{suffix}</span>
        </span>
      </div>
      <div className="mt-1 h-1 rounded-full overflow-hidden v2-bg-soft">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct * 100}%` }}
          transition={{ delay: 0.4, duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-full"
          style={{ background: tint }}
        />
      </div>
    </div>
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
            <div className="v2-body text-[13px] v2-t2 mt-1 truncate">
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
      <span className="v2-caption text-[10px] v2-t3 tracking-wide">
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
        <span className="v2-caption text-[10px] v2-t3 tracking-wide whitespace-nowrap">
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
        <span className="v2-caption text-[10px] v2-t3 tracking-wide">
          {lang === 'zh' ? `× ${trend.last.reps}` : `× ${trend.last.reps} last`}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 py-3 first:pt-2 last:pb-1">
      <span className="v2-num text-[11px] tracking-wider v2-t3 w-5">
        {String(idx).padStart(2, '0')}
      </span>
      <div className="flex-1 min-w-0">
        <div className="v2-body text-[15px] v2-t1 truncate">{name}</div>
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

// Cycle through the four workout types when the user is in edit mode.
const TYPE_CYCLE = ['push', 'pull', 'leg', 'rest'];

function WeeklyStrip({ history, onPick, lang, t, weeklySplit, setDayType, editing, workouts = {} }) {
  const todayIdx = (new Date().getDay() + 6) % 7;
  return (
    <>
    <motion.div
      variants={{ show: { transition: stagger } }}
      initial="hidden"
      animate="show"
      className="grid grid-cols-7 gap-1.5"
    >
      {weeklySplit.map((d, i) => {
        const isToday = i === todayIdx;
        const isRest = d.type === 'rest';
        const completed = Object.values(history).some(
          (h) => h?.type === d.type && h?.completedAt && withinDays(h.completedAt, 7),
        );
        const muscleHint = !isRest && workouts[d.type] ? locWorkout(workouts[d.type], 'subtitle', lang).split(' · ')[0] : null;

        const handleTap = () => {
          if (editing) {
            const cur = TYPE_CYCLE.indexOf(d.type);
            const next = TYPE_CYCLE[(cur + 1) % TYPE_CYCLE.length];
            setDayType(i, next);
            return;
          }
          if (!isRest) onPick(d.type);
        };

        return (
          <motion.button
            key={d.day}
            variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
            transition={springs.smooth}
            whileTap={{ scale: 0.94 }}
            animate={editing ? { rotate: [-0.5, 0.5, -0.5] } : { rotate: 0 }}
            onClick={handleTap}
            className={[
              'relative aspect-[3/4.4] rounded-2xl flex flex-col items-center justify-between py-2 px-1.5',
              isToday
                ? ''
                : isRest
                  ? 'v2-bg-soft v2-t3'
                  : 'v2-bg-soft-2 v2-t1 v2-press',
            ].join(' ')}
            style={
              isToday
                ? {
                    background: 'var(--accent)',
                    color: 'var(--canvas)',
                    boxShadow: '0 0 0 0.5px var(--hairline-strong), 0 12px 32px -10px rgba(0,0,0,0.18)',
                  }
                : { boxShadow: 'inset 0 0.5px 0 0 var(--hairline)' }
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
    {editing && (
      <div className="mt-2 v2-caption v2-t3 text-[10px] text-center tracking-wide">
        {lang === 'zh' ? '点击格子轮换 推 / 拉 / 腿 / 休' : 'Tap a tile to cycle Push / Pull / Leg / Rest'}
      </div>
    )}
    </>
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
          <span className="v2-body text-[13px] v2-t3">{suffix}</span>
        )}
        {icon && <span className="ml-0.5" style={{ color: tint || 'white' }}>{icon}</span>}
      </div>
      {sub && <div className="v2-body text-[12px] v2-t3 mt-0.5">{sub}</div>}
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
