import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import ExerciseCard from './ExerciseCard.jsx';
import ExerciseModal from './ExerciseModal.jsx';
import RestTimer from './RestTimer.jsx';
import WorkoutLogger from './WorkoutLogger.jsx';
import ProgressionHint from './ProgressionHint.jsx';
import WorkoutSummary from './WorkoutSummary.jsx';
import ProgressBar from './ProgressBar.jsx';
import VariantBadge from './VariantBadge.jsx';
import WarmUpSection from './WarmUpSection.jsx';
import CoolDownSection from './CoolDownSection.jsx';
import BodyMapSection from './BodyMapSection.jsx';
import { useRestTimer } from '../hooks/useRestTimer.js';
import { parseRepRange, fmtRest } from '../utils/format.js';
import { useLang, locEx, locWorkout } from '../i18n/index.jsx';
import { WARMUPS, COOLDOWNS } from '../data/warmCoolData.js';
import { exerciseMeta } from '../data/exerciseMeta.js';
import { useOverrides, applyExerciseOverrides } from '../hooks/useOverrides.jsx';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { demoVariants } from '../data/demoMap.js';
import { lastLogsByVariant } from '../utils/historyLookup.js';
import CustomExerciseEditor from './CustomExerciseEditor.jsx';

export default function WorkoutDay({ workout, session, setSession, onBack, onComplete }) {
  const { t, lang } = useLang();
  const { overrides, setOverride, clearOverride } = useOverrides();
  // Cross-session history feeds the Logger's pre-fill + the modal's
  // per-variant "last actual" display. Same localStorage key App.jsx
  // writes to on workout completion — we're a read-only consumer here.
  const [history] = useLocalStorage('atlas.history', {});
  const [openExerciseId, setOpenExerciseId] = useState(null);
  const [loggerOpen, setLoggerOpen] = useState(false);
  const [hintFor, setHintFor] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [editingOrder, setEditingOrder] = useState(false);
  const [localOrder, setLocalOrder] = useState(null);
  const [customEditorOpen, setCustomEditorOpen] = useState(false);
  const timer = useRestTimer();

  // Resolve the active exercise order: user-customized (from overrides) or
  // the default from workoutData.js. Any new exercises added to the program
  // after a custom order was saved get appended at the end so nothing is lost.
  const customOrderIds = overrides.order?.[workout.id];

  // Custom exercises the user added to THIS workout day. They merge in
  // after the base list so they sit at the bottom by default; the
  // Reorder feature can move them anywhere in the lineup.
  const customForDay = useMemo(() => {
    const all = overrides.customExercises || {};
    return Object.values(all).filter((e) => e.workoutId === workout.id);
  }, [overrides.customExercises, workout.id]);

  // 1. Combine base exercises + user-added custom exercises for this day
  // 2. Reorder by user's preference (or default if no order override set)
  // 3. Apply per-exercise overrides on top so sets/reps/rest/weight reflect
  //    whatever the user typed in the editor — this is the value passed
  //    to every downstream card, modal, logger, and rest-timer call.
  const orderedExercises = useMemo(() => {
    const exOverrides = overrides.exercise || {};
    const apply = (ex) => applyExerciseOverrides(ex, exOverrides[ex.id]);
    const fullList = [...workout.exercises, ...customForDay];

    if (!customOrderIds || !Array.isArray(customOrderIds)) {
      return fullList.map(apply);
    }
    const byId = new Map(fullList.map((e) => [e.id, e]));
    const result = [];
    for (const id of customOrderIds) {
      const ex = byId.get(id);
      if (ex) {
        result.push(apply(ex));
        byId.delete(id);
      }
    }
    for (const ex of byId.values()) result.push(apply(ex));
    return result;
  }, [workout.exercises, customForDay, customOrderIds, overrides.exercise]);

  const activeIndex = useMemo(() => {
    return orderedExercises.findIndex(
      (e) => (session.completedSets[e.id]?.length || 0) < e.sets,
    );
  }, [orderedExercises, session]);

  const activeExercise =
    activeIndex >= 0 ? orderedExercises[activeIndex] : null;
  const setNumber =
    activeExercise
      ? (session.completedSets[activeExercise.id]?.length || 0) + 1
      : 0;

  const completedCount = orderedExercises.reduce(
    (acc, e) => acc + Math.min(e.sets, session.completedSets[e.id]?.length || 0),
    0,
  );
  const totalCount = orderedExercises.reduce((acc, e) => acc + e.sets, 0);
  const allDone = completedCount >= totalCount;

  const openExercise = orderedExercises.find((e) => e.id === openExerciseId);

  const startEditOrder = () => {
    setLocalOrder(orderedExercises.map((e) => e.id));
    setEditingOrder(true);
  };
  const finishEditOrder = () => {
    if (localOrder) {
      setOverride('order', null, workout.id, localOrder);
    }
    setEditingOrder(false);
    setLocalOrder(null);
  };
  const resetOrder = () => {
    clearOverride('order', null, workout.id);
    if (editingOrder) {
      setLocalOrder(workout.exercises.map((e) => e.id));
    }
  };

  const handleStartLog = () => {
    if (!activeExercise) return;
    setLoggerOpen(true);
  };

  const handleSaveSet = (log) => {
    const ex = activeExercise;
    const next = { ...session.completedSets };
    next[ex.id] = [...(next[ex.id] || []), log];
    setSession({ ...session, completedSets: next });
    setLoggerOpen(false);
    // Remember the user's variant choice so the next Logger open
    // defaults to the same one — typically you stick to one variant
    // through a whole training block.
    if (log.variant) {
      setOverride('lastVariant', null, ex.id, log.variant);
    }

    const { high } = parseRepRange(ex.repRange);
    if (high && log.reps && log.reps >= high && log.difficulty !== 'failure') {
      setHintFor(locEx(ex, 'name', lang));
    }

    const setsDone = (next[ex.id] || []).length;
    const isLastExerciseSet =
      setsDone >= ex.sets && activeIndex === orderedExercises.length - 1;
    if (!isLastExerciseSet) timer.start(ex.restSeconds);
  };

  if (showSummary) {
    return (
      <WorkoutSummary
        workout={workout}
        session={session}
        onClose={() => {
          setShowSummary(false);
          onBack();
        }}
        onSave={() => {
          onComplete();
        }}
      />
    );
  }

  return (
    <div className="relative pb-32">
      <div className="px-5 pt-2 pb-3">
        <button
          onClick={onBack}
          className="text-[11px] uppercase tracking-wider text-ink-300 hover:text-ink-500 dark:hover:text-bone-100 flex items-center gap-1.5"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t('workout.back')}
        </button>
        <h1 className="mt-2 text-[28px] leading-tight font-semibold tracking-tight text-ink-900 dark:text-bone-100">
          {locWorkout(workout, 'name', lang)}
        </h1>
        <div className="mt-1 text-sm text-ink-400 dark:text-ink-200">
          {locWorkout(workout, 'focus', lang)}
        </div>
        <div className="mt-4">
          <ProgressBar
            label={`${t('workout.progress')} · ${completedCount}/${totalCount} ${t('workout.sets')}`}
            value={completedCount}
            total={totalCount}
          />
        </div>
      </div>

      <ProgressionHint
        visible={!!hintFor}
        exerciseName={hintFor}
        onDismiss={() => setHintFor(null)}
      />

      {WARMUPS[workout.id] && (
        <div className="mt-4">
          <WarmUpSection
            workoutType={workout.id}
            warmup={WARMUPS[workout.id]}
            done={!!session.warmUpDone}
            onMarkDone={() => setSession({ ...session, warmUpDone: !session.warmUpDone })}
          />
        </div>
      )}

      <BodyMapSection workout={workout} />

      {activeExercise && !allDone && (
        <div className="px-5 pt-4">
          <div className="text-[11px] uppercase tracking-[0.18em] text-ink-300 mb-2">
            {t('workout.upNext')}
          </div>
          <ActiveFocus
            exercise={activeExercise}
            setNumber={setNumber}
            onLog={handleStartLog}
            onOpen={() => setOpenExerciseId(activeExercise.id)}
            restRunning={timer.active || timer.done}
          />
        </div>
      )}

      <div className="px-5 pt-5">
        <div className="flex items-center justify-between mb-2">
          <div className="text-[11px] uppercase tracking-[0.18em] text-ink-300">
            {t('workout.fullSession')}
          </div>
          <div className="flex items-center gap-3">
            {customOrderIds && !editingOrder && (
              <button
                onClick={resetOrder}
                className="text-[10px] uppercase tracking-wider text-ink-300 hover:text-ink-700 dark:hover:text-bone-100"
              >
                {t('workout.resetOrder')}
              </button>
            )}
            <button
              onClick={editingOrder ? finishEditOrder : startEditOrder}
              className="text-[10px] uppercase tracking-wider font-medium text-ink-700 dark:text-bone-100 px-2.5 py-1 rounded-full border border-black/10 dark:border-white/10 active:scale-[0.97] transition"
            >
              {editingOrder ? t('workout.doneReorder') : t('workout.reorder')}
            </button>
          </div>
        </div>

        {editingOrder ? (
          <>
            <div className="text-[11px] text-ink-400 dark:text-ink-200 mb-2.5">
              {t('workout.dragHint')}
            </div>
            <LayoutGroup>
              <div className="space-y-2">
                {(localOrder || []).map((id, i) => {
                  const ex = workout.exercises.find((e) => e.id === id);
                  if (!ex) return null;
                  const swap = (from, to) => {
                    if (!localOrder) return;
                    if (to < 0 || to >= localOrder.length) return;
                    const next = [...localOrder];
                    [next[from], next[to]] = [next[to], next[from]];
                    setLocalOrder(next);
                  };
                  return (
                    <ReorderRow
                      key={id}
                      exercise={ex}
                      lang={lang}
                      isFirst={i === 0}
                      isLast={i === (localOrder?.length || 0) - 1}
                      onMoveUp={() => swap(i, i - 1)}
                      onMoveDown={() => swap(i, i + 1)}
                    />
                  );
                })}
              </div>
            </LayoutGroup>
          </>
        ) : (
          <div className="space-y-2.5">
            {orderedExercises.map((ex, i) => {
              const completed = session.completedSets[ex.id]?.length || 0;
              return (
                <ExerciseCard
                  key={ex.id}
                  index={i + 1}
                  exercise={ex}
                  totalSets={ex.sets}
                  completedSets={completed}
                  active={i === activeIndex && !allDone}
                  done={completed >= ex.sets}
                  onOpen={() => setOpenExerciseId(ex.id)}
                />
              );
            })}
            {/* + Add custom exercise button — sits at the bottom of the
                list. Tapping opens the editor sheet pre-scoped to this
                workout day. */}
            <button
              onClick={() => setCustomEditorOpen(true)}
              className="w-full rounded-3xl p-5 border-2 border-dashed border-ink-200 dark:border-ink-600 text-ink-400 dark:text-ink-200 text-[13px] font-medium uppercase tracking-wider active:scale-[0.98] transition"
            >
              + {t('custom.add')}
            </button>
          </div>
        )}
      </div>

      {COOLDOWNS[workout.id] && (
        <CoolDownSection
          stretches={COOLDOWNS[workout.id]}
          done={!!session.coolDownDone}
          onDone={() => setSession({ ...session, coolDownDone: true })}
        />
      )}

      {allDone && !showSummary && (
        <div className="px-5 pt-6">
          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setShowSummary(true)}
            className="w-full rounded-3xl bg-ink-900 dark:bg-bone-100 text-bone-50 dark:text-ink-900 py-5 px-6 flex items-center justify-between shadow-card dark:shadow-cardDark"
          >
            <span className="flex flex-col items-start">
              <span className="text-[11px] uppercase tracking-wider opacity-60">
                {t('workout.sessionComplete')}
              </span>
              <span className="mt-0.5 text-lg font-semibold">{t('workout.viewSummary')}</span>
            </span>
            <span className="text-2xl">→</span>
          </motion.button>
        </div>
      )}

      <ExerciseModal
        open={!!openExercise}
        exercise={openExercise}
        onClose={() => setOpenExerciseId(null)}
      />

      <AnimatePresence>
        {loggerOpen && activeExercise && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30 bg-ink-900/40 dark:bg-ink-900/70 backdrop-blur-sm"
              onClick={() => setLoggerOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed inset-x-0 bottom-0 z-40 px-3 pb-safe pb-4"
            >
              <div className="mx-auto max-w-md">
                <WorkoutLogger
                  exercise={activeExercise}
                  setNumber={setNumber}
                  totalSets={activeExercise.sets}
                  variants={demoVariants(activeExercise.id)}
                  defaultVariantKey={
                    overrides.lastVariant?.[activeExercise.id] ||
                    demoVariants(activeExercise.id)[0]?.key ||
                    null
                  }
                  lastLogsByVariant={lastLogsByVariant(
                    history,
                    activeExercise.id,
                  )}
                  onCancel={() => setLoggerOpen(false)}
                  onSave={handleSaveSet}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CustomExerciseEditor
        open={customEditorOpen}
        onClose={() => setCustomEditorOpen(false)}
        workoutId={workout.id}
      />

      <RestTimer
        timer={timer}
        label={activeExercise ? `${t('rest.label')} · ${locEx(activeExercise, 'name', lang)}` : t('rest.label')}
        onDone={() => {
          timer.stop();
        }}
        onStop={() => timer.stop()}
      />
    </div>
  );
}

function ActiveFocus({ exercise, setNumber, onLog, onOpen, restRunning }) {
  const { t, lang } = useLang();
  const { overrides } = useOverrides();
  const muscles = locEx(exercise, 'primaryMuscles', lang);
  const meta = exerciseMeta(exercise.id);
  const suggestedWeight =
    overrides.exercise?.[exercise.id]?.suggestedWeight ??
    exercise.suggestedWeight;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl bg-ink-900 dark:bg-bone-100 text-bone-50 dark:text-ink-900 p-5 shadow-card dark:shadow-cardDark"
    >
      <div className="flex justify-between items-start">
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-[0.18em] opacity-60">
            {muscles.join(' · ')}
          </div>
          <div className="mt-1 text-xl font-semibold leading-tight">
            {locEx(exercise, 'name', lang)}
          </div>
          <div className="mt-1.5">
            <VariantBadge exerciseId={exercise.id} tone="dark" />
          </div>
          <div className="mt-1.5 text-[12px] opacity-70 tabular">
            {t('workout.set')} {setNumber}/{exercise.sets} · {t('workout.target')} {exercise.repRange}
          </div>
        </div>
        <button
          onClick={onOpen}
          className="text-[10px] uppercase tracking-wider opacity-70 underline decoration-dotted underline-offset-4"
        >
          {t('workout.details')}
        </button>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2 text-[11px] uppercase tracking-wider opacity-70">
        <div>
          <div>{t('workout.weight')}</div>
          <div className="mt-0.5 text-sm normal-case tracking-normal opacity-100 font-medium tabular leading-tight">
            {suggestedWeight}
          </div>
        </div>
        <div>
          <div>{t('workout.reps')}</div>
          <div className="mt-0.5 text-sm normal-case tracking-normal opacity-100 font-medium tabular">
            {exercise.repRange}
          </div>
        </div>
        <div>
          <div>{t('workout.rest')}</div>
          <div className="mt-0.5 text-sm normal-case tracking-normal opacity-100 font-medium tabular">
            {fmtRest(exercise.restSeconds)}
          </div>
        </div>
        {meta.tempo && (
          <div>
            <div>{t('tempo.label')}</div>
            <div className="mt-0.5 text-sm normal-case tracking-normal opacity-100 font-medium tabular">
              {meta.tempo === 'Static' ? '—' : meta.tempo}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={onLog}
        disabled={restRunning}
        className={`mt-5 w-full py-4 rounded-2xl text-sm font-semibold uppercase tracking-wider active:scale-[0.98] transition
          ${
            restRunning
              ? 'bg-white/10 dark:bg-ink-900/10 text-bone-50/50 dark:text-ink-900/40 cursor-not-allowed'
              : 'bg-bone-50 dark:bg-ink-900 text-ink-900 dark:text-bone-50'
          }`}
      >
        {restRunning ? t('workout.resting') : t('workout.completeSet')}
      </button>
    </motion.div>
  );
}

// One row in the reorder list. Uses plain ↑/↓ tap buttons instead of
// drag-and-drop — Framer Motion's Reorder relies on `touch-action: pan-x`
// which iOS Safari interprets as "let me keep scrolling vertically",
// breaking the drag. Buttons are universally reliable on touch and
// also a clearer affordance. The `motion.div` with `layout` gives us
// the smooth slide animation when items swap places.
function ReorderRow({ exercise, lang, isFirst, isLast, onMoveUp, onMoveDown }) {
  const muscles = locEx(exercise, 'primaryMuscles', lang);
  return (
    <motion.div
      layout
      transition={{ type: 'spring', stiffness: 520, damping: 38 }}
      className="rounded-2xl bg-white dark:bg-ink-800 border border-black/5 dark:border-white/5 shadow-card dark:shadow-cardDark px-3 py-2.5 flex items-center gap-3"
    >
      <div className="min-w-0 flex-1">
        <div className="text-[10px] uppercase tracking-[0.16em] text-ink-300 truncate">
          {muscles[0]}
        </div>
        <div className="text-[14px] font-semibold text-ink-900 dark:text-bone-100 leading-tight truncate">
          {locEx(exercise, 'name', lang)}
        </div>
        <div className="text-[10px] tabular text-ink-400 dark:text-ink-200 mt-0.5">
          {exercise.sets} × {exercise.repRange}
        </div>
      </div>
      <div className="flex flex-col gap-1 shrink-0">
        <button
          type="button"
          onClick={onMoveUp}
          disabled={isFirst}
          aria-label="Move up"
          className={`w-9 h-9 rounded-xl flex items-center justify-center border transition active:scale-95
            ${
              isFirst
                ? 'border-black/5 dark:border-white/5 text-ink-300/40 dark:text-ink-200/30 cursor-not-allowed'
                : 'border-black/10 dark:border-white/10 text-ink-700 dark:text-bone-100 bg-bone-50 dark:bg-ink-700'
            }`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 15l6-6 6 6"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={isLast}
          aria-label="Move down"
          className={`w-9 h-9 rounded-xl flex items-center justify-center border transition active:scale-95
            ${
              isLast
                ? 'border-black/5 dark:border-white/5 text-ink-300/40 dark:text-ink-200/30 cursor-not-allowed'
                : 'border-black/10 dark:border-white/10 text-ink-700 dark:text-bone-100 bg-bone-50 dark:bg-ink-700'
            }`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}

function lastWeight(session, exercise) {
  const logs = session.completedSets[exercise.id] || [];
  for (let i = logs.length - 1; i >= 0; i--) {
    if (logs[i].weight != null) return logs[i].weight;
  }
  return null;
}
