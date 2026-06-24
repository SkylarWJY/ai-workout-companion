import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang, locEx, locWorkout } from '../../i18n/index.jsx';
import { useOverrides, applyExerciseOverrides } from '../../hooks/useOverrides.jsx';
import { useLocalStorage } from '../../hooks/useLocalStorage.js';
import { recommendNextWeight } from '../../utils/progression.js';
import { convertWeight } from '../../utils/weight.js';
import { lastLogForExercise } from '../../utils/historyLookup.js';
import Screen from '../components/Screen.jsx';
import GlassNavBar from '../components/GlassNavBar.jsx';
import IconButton from '../components/IconButton.jsx';
import Sheet from '../components/Sheet.jsx';
import Chip from '../components/Chip.jsx';
import PrimaryButton from '../components/PrimaryButton.jsx';
import SectionLabel from '../components/SectionLabel.jsx';
import { springs, tints, tintForKind, KIND_LABEL, KIND_LABEL_ZH } from '../theme.js';

const ICON = {
  back: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  plus: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /></svg>,
  check: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 12l5 5 11-11" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>,
};

const DIFFICULTY_TINT = {
  easy:     tints.green,
  moderate: tints.mint,
  hard:     tints.orange,
  failure:  tints.red,
};

const DIFFICULTY_LETTER = { easy: 'E', moderate: 'M', hard: 'H', failure: 'F' };

export default function WorkoutDay({ workout, session, setSession, onBack, onComplete }) {
  const { t, lang } = useLang();
  const { overrides, weightUnit } = useOverrides();
  const [history] = useLocalStorage('atlas.history', {});

  const [scrollY, setScrollY] = useState(0);
  const showGlass = scrollY > 24;

  // Logger / set-editor sheets
  const [loggerFor, setLoggerFor] = useState(null);          // exercise being logged
  const [editingSet, setEditingSet] = useState(null);        // { exId, idx, log } when editing a past set
  const [actionFor, setActionFor] = useState(null);          // { exId, idx, log } when chip tapped
  const [addExOpen, setAddExOpen] = useState(false);

  // Same merged-and-overridden exercise list shape as v0.8.
  const customForDay = useMemo(() => {
    const all = overrides.customExercises || {};
    return Object.values(all).filter((e) => e.workoutId === workout.id);
  }, [overrides.customExercises, workout.id]);

  const orderedExercises = useMemo(() => {
    const exOverrides = overrides.exercise || {};
    return [...workout.exercises, ...customForDay].map(
      (ex) => applyExerciseOverrides(ex, exOverrides[ex.id]),
    );
  }, [workout.exercises, customForDay, overrides.exercise]);

  // Progress: sets logged / sets planned
  const { logged, planned } = useMemo(() => {
    let l = 0;
    let p = 0;
    for (const ex of orderedExercises) {
      p += ex.sets || 0;
      l += (session?.completedSets?.[ex.id] || []).length;
    }
    return { logged: l, planned: p };
  }, [orderedExercises, session]);

  const progress = planned > 0 ? Math.min(1, logged / planned) : 0;
  const wname = locWorkout(workout, 'name', lang);

  // Mutation helpers — all session.completedSets ops go through these.
  const upsertLog = (exId, log, replaceIdx = null) => {
    setSession((s) => {
      const cur = { ...(s || {}) };
      cur.completedSets = { ...(cur.completedSets || {}) };
      const list = [...(cur.completedSets[exId] || [])];
      const enriched = { ...log, weightUnit, ts: log.ts || Date.now() };
      if (replaceIdx != null) list[replaceIdx] = enriched;
      else list.push(enriched);
      cur.completedSets[exId] = list;
      return cur;
    });
  };

  const deleteLog = (exId, idx) => {
    setSession((s) => {
      const cur = { ...(s || {}) };
      cur.completedSets = { ...(cur.completedSets || {}) };
      const list = [...(cur.completedSets[exId] || [])];
      list.splice(idx, 1);
      if (list.length === 0) delete cur.completedSets[exId];
      else cur.completedSets[exId] = list;
      return cur;
    });
  };

  return (
    <Screen>
      <GlassNavBar
        title={wname}
        showGlass={showGlass}
        leading={<IconButton ariaLabel="Back" onClick={onBack} variant="glass" icon={ICON.back} />}
        trailing={
          <Chip size="md" variant="solid" tint={progress >= 1 ? tints.green : null}>
            <span className="v2-num">{logged}</span>
            <span className="opacity-50">/{planned}</span>
          </Chip>
        }
      />

      <main className="px-5 pb-40" onScroll={(e) => setScrollY(e.currentTarget.scrollTop)}>
        {/* HERO ────────────────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springs.smooth}
          className="pt-6"
        >
          <div className="v2-caption text-white/55">
            {lang === 'zh' ? '今日训练' : "TODAY'S SESSION"}
          </div>
          <h1 className="v2-display text-[36px] leading-[1.02] mt-2">{wname}.</h1>
          <p className="v2-body text-[14px] text-white/55 mt-1.5">
            {locWorkout(workout, 'subtitle', lang)}
          </p>

          {/* Progress bar — Apple Health style */}
          <div className="mt-5 h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
            <motion.div
              initial={false}
              animate={{ width: `${progress * 100}%` }}
              transition={springs.smooth}
              className="h-full rounded-full"
              style={{ background: progress >= 1 ? tints.green : '#FFFFFF' }}
            />
          </div>
        </motion.section>

        {/* ADD EXERCISE — discoverable at the TOP, not buried.  ──── */}
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springs.smooth, delay: 0.08 }}
          whileTap={{ scale: 0.985 }}
          onClick={() => setAddExOpen(true)}
          className="mt-7 w-full v2-card-flat py-3 px-4 flex items-center gap-3 text-left"
          style={{ boxShadow: 'inset 0 0 0 0.5px rgba(255,255,255,0.10)' }}
        >
          <span
            className="w-9 h-9 rounded-full grid place-items-center"
            style={{ background: 'rgba(255,255,255,0.10)' }}
          >
            {ICON.plus}
          </span>
          <div className="flex-1 min-w-0">
            <div className="v2-title text-[15px]">
              {lang === 'zh' ? '加一个动作' : 'Add an exercise'}
            </div>
            <div className="v2-body text-[12px] text-white/45 mt-0.5">
              {lang === 'zh' ? '今天临时换 / 加 — 一次性也行' : 'Swap, supplement, or one-off — your call'}
            </div>
          </div>
        </motion.button>

        {/* EXERCISE LIST ──────────────────────────────────────────── */}
        <section className="mt-6 space-y-3">
          <SectionLabel>{lang === 'zh' ? '动作清单' : 'Exercises'}</SectionLabel>
          {orderedExercises.map((ex, i) => (
            <ExerciseCard
              key={ex.id}
              idx={i + 1}
              ex={ex}
              session={session}
              history={history}
              lang={lang}
              t={t}
              weightUnit={weightUnit}
              onLog={() => setLoggerFor(ex)}
              onChipTap={(idx, log) => setActionFor({ exId: ex.id, idx, log })}
            />
          ))}
        </section>
      </main>

      {/* FLOATING COMPLETE BUTTON ─────────────────────────────────── */}
      <div
        className="fixed inset-x-0 bottom-0 px-5 pt-3 pb-[calc(env(safe-area-inset-bottom)+12px)] pointer-events-none z-20"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.92) 35%, rgba(0,0,0,0))',
        }}
      >
        <div className="max-w-md mx-auto pointer-events-auto">
          <PrimaryButton
            size="lg"
            fullWidth
            tint={progress >= 1 ? tints.green : '#FFFFFF'}
            onClick={onComplete}
            icon={progress >= 1 ? ICON.check : null}
          >
            {progress >= 1
              ? (lang === 'zh' ? '完成今日训练' : 'Complete workout')
              : (lang === 'zh' ? '提前结束' : 'End session')}
          </PrimaryButton>
        </div>
      </div>

      {/* LOGGER SHEET ─────────────────────────────────────────────── */}
      <Sheet
        open={!!loggerFor}
        onClose={() => setLoggerFor(null)}
        title={loggerFor ? locEx(loggerFor, 'name', lang) : ''}
        height="auto"
      >
        {loggerFor && (
          <LoggerForm
            exercise={loggerFor}
            history={history}
            weightUnit={weightUnit}
            lang={lang}
            t={t}
            onSave={(log) => {
              upsertLog(loggerFor.id, log);
              setLoggerFor(null);
            }}
            onCancel={() => setLoggerFor(null)}
          />
        )}
      </Sheet>

      {/* EDIT SET SHEET ───────────────────────────────────────────── */}
      <Sheet
        open={!!editingSet}
        onClose={() => setEditingSet(null)}
        title={lang === 'zh' ? '编辑这组' : 'Edit set'}
        height="auto"
      >
        {editingSet && (
          <LoggerForm
            exercise={orderedExercises.find((e) => e.id === editingSet.exId)}
            history={history}
            weightUnit={weightUnit}
            lang={lang}
            t={t}
            initial={editingSet.log}
            onSave={(log) => {
              upsertLog(editingSet.exId, log, editingSet.idx);
              setEditingSet(null);
            }}
            onCancel={() => setEditingSet(null)}
          />
        )}
      </Sheet>

      {/* ACTION SHEET (chip tap) ───────────────────────────────────── */}
      <Sheet
        open={!!actionFor}
        onClose={() => setActionFor(null)}
        title={actionFor ? formatSetSummary(actionFor.log, weightUnit) : ''}
      >
        {actionFor && (
          <div className="px-5 py-3 space-y-2">
            <PrimaryButton
              size="lg"
              fullWidth
              variant="tinted"
              tint={tints.blue}
              onClick={() => {
                setEditingSet(actionFor);
                setActionFor(null);
              }}
            >
              {lang === 'zh' ? '编辑这组' : 'Edit this set'}
            </PrimaryButton>
            <PrimaryButton
              size="lg"
              fullWidth
              variant="tinted"
              tint={tints.red}
              onClick={() => {
                deleteLog(actionFor.exId, actionFor.idx);
                setActionFor(null);
              }}
            >
              {lang === 'zh' ? '删除这组' : 'Delete this set'}
            </PrimaryButton>
            <PrimaryButton
              size="lg"
              fullWidth
              variant="plain"
              onClick={() => setActionFor(null)}
            >
              {lang === 'zh' ? '取消' : 'Cancel'}
            </PrimaryButton>
          </div>
        )}
      </Sheet>

      {/* ADD EXERCISE SHEET ───────────────────────────────────────── */}
      <Sheet
        open={addExOpen}
        onClose={() => setAddExOpen(false)}
        title={lang === 'zh' ? '加一个动作' : 'Add an exercise'}
        height="tall"
      >
        <AddExerciseForm
          workoutId={workout.id}
          lang={lang}
          onClose={() => setAddExOpen(false)}
        />
      </Sheet>
    </Screen>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Exercise card
// ─────────────────────────────────────────────────────────────────────

function ExerciseCard({ idx, ex, session, history, lang, t, weightUnit, onLog, onChipTap }) {
  const logs = session?.completedSets?.[ex.id] || [];
  const planned = ex.sets || 0;
  const done = logs.length;
  const complete = done >= planned && planned > 0;

  const rec = useMemo(
    () => recommendNextWeight({
      history,
      exerciseId: ex.id,
      variantKey: null,
      repRange: ex.repRange,
      currentUnit: weightUnit,
    }),
    [history, ex.id, ex.repRange, weightUnit],
  );

  const lastLog = useMemo(
    () => lastLogForExercise(history, ex.id),
    [history, ex.id],
  );

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springs.smooth}
      className="v2-card p-4"
    >
      <div className="flex items-start gap-3">
        <span className="v2-num text-[11px] tracking-wider text-white/35 mt-1.5 w-5">
          {String(idx).padStart(2, '0')}
        </span>
        <div className="flex-1 min-w-0">
          <div className="v2-title text-[17px] leading-tight">
            {locEx(ex, 'name', lang)}
          </div>
          <div className="v2-body text-[12.5px] text-white/55 mt-1">
            {planned} × {ex.repRange}
            {ex.restSeconds ? ` · ${ex.restSeconds}s rest` : ''}
          </div>
        </div>
        {complete && (
          <span
            className="shrink-0 w-6 h-6 rounded-full grid place-items-center"
            style={{ background: tints.green, color: '#000' }}
          >
            {ICON.check}
          </span>
        )}
      </div>

      {/* Set chips — tap to edit/delete; tap [+] to log new */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {logs.map((log, i) => (
          <SetChip
            key={i}
            log={log}
            displayUnit={weightUnit}
            onClick={() => onChipTap(i, log)}
          />
        ))}
        {Array.from({ length: Math.max(0, planned - done) }).map((_, i) => (
          <span
            key={`empty-${i}`}
            className="h-7 px-3 rounded-full flex items-center gap-1 text-[11px] tracking-wide v2-num text-white/30"
            style={{ boxShadow: 'inset 0 0 0 0.5px rgba(255,255,255,0.10)' }}
          >
            {String(done + i + 1).padStart(2, '0')}
          </span>
        ))}
      </div>

      {/* Recommendation row + Log button */}
      <div className="mt-3 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          {rec ? (
            <div className="flex items-center gap-2">
              <span className="v2-caption text-[10px] text-white/40">
                {lang === 'zh' ? '建议' : 'Try'}
              </span>
              <Chip size="sm" tint={tintForKind(rec.kind)}>
                {rec.weight} {weightUnit}
              </Chip>
              <span className="v2-caption text-[10px] text-white/40 whitespace-nowrap">
                {(lang === 'zh' ? KIND_LABEL_ZH : KIND_LABEL)[rec.kind]}
              </span>
            </div>
          ) : lastLog ? (
            <span className="v2-caption text-[10px] text-white/40">
              {lang === 'zh' ? `上次 ${lastLog.weight}${lastLog.weightUnit || weightUnit} × ${lastLog.reps}` : `Last ${lastLog.weight} ${lastLog.weightUnit || weightUnit} × ${lastLog.reps}`}
            </span>
          ) : (
            <span className="v2-caption text-[10px] text-white/40">
              {lang === 'zh' ? '首次基线' : 'First baseline'}
            </span>
          )}
        </div>
        <motion.button
          type="button"
          whileTap={{ scale: 0.94 }}
          transition={springs.press}
          onClick={onLog}
          className="h-9 px-4 rounded-full bg-white text-black font-semibold text-[13px] tracking-[-0.01em]"
        >
          {complete
            ? (lang === 'zh' ? '+ 加一组' : '+ Extra set')
            : (lang === 'zh' ? '记录这组' : 'Log set')}
        </motion.button>
      </div>
    </motion.div>
  );
}

function SetChip({ log, displayUnit, onClick }) {
  const fromUnit = log.weightUnit || displayUnit;
  const w = convertWeight(log.weight ?? 0, fromUnit, displayUnit);
  const diffTint = DIFFICULTY_TINT[log.difficulty] || tints.mint;
  const letter = DIFFICULTY_LETTER[log.difficulty] || 'M';
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.92 }}
      transition={springs.press}
      onClick={onClick}
      className="h-7 px-2.5 rounded-full flex items-center gap-1.5 text-[11px] v2-num font-semibold tracking-[0.01em]"
      style={{
        background: 'rgba(255,255,255,0.08)',
        color: 'rgba(255,255,255,0.95)',
        boxShadow: `inset 0 0 0 0.5px rgba(255,255,255,0.12)`,
      }}
    >
      <span>{w}{log.weightUnit || displayUnit}</span>
      <span className="opacity-50">×</span>
      <span>{log.reps}</span>
      <span
        className="ml-0.5 rounded-full px-1 text-[9px] font-bold"
        style={{ background: diffTint, color: '#000' }}
      >
        {letter}
      </span>
    </motion.button>
  );
}

function formatSetSummary(log, unit) {
  const w = log.weight ?? 0;
  return `${w}${log.weightUnit || unit} × ${log.reps} · ${log.difficulty}`;
}

// ─────────────────────────────────────────────────────────────────────
// Logger form (used inside Logger Sheet AND Edit Sheet)
// ─────────────────────────────────────────────────────────────────────

function LoggerForm({ exercise, history, weightUnit, lang, t, onSave, onCancel, initial = null }) {
  const rec = useMemo(
    () => recommendNextWeight({
      history,
      exerciseId: exercise?.id,
      variantKey: null,
      repRange: exercise?.repRange,
      currentUnit: weightUnit,
    }),
    [history, exercise?.id, exercise?.repRange, weightUnit],
  );
  const refLog = useMemo(() => lastLogForExercise(history, exercise?.id), [history, exercise?.id]);

  const [weight, setWeight] = useState(() => {
    if (initial?.weight != null) {
      return String(convertWeight(initial.weight, initial.weightUnit || weightUnit, weightUnit));
    }
    if (rec?.weight != null) return String(rec.weight);
    if (refLog?.weight != null) {
      return String(convertWeight(refLog.weight, refLog.weightUnit || weightUnit, weightUnit));
    }
    return '';
  });
  const [reps, setReps] = useState(() => (initial?.reps != null ? String(initial.reps) : (refLog?.reps != null ? String(refLog.reps) : '')));
  const [difficulty, setDifficulty] = useState(initial?.difficulty || 'moderate');

  const incWeight = (d) => setWeight((w) => {
    const step = weightUnit === 'kg' ? (Number(w) < 25 ? 1 : 2.5) : 5;
    const next = Math.max(0, (Number(w) || 0) + d * step);
    return String(weightUnit === 'kg' ? Math.round(next * 2) / 2 : Math.round(next));
  });
  const incReps = (d) => setReps((r) => String(Math.max(0, (Number(r) || 0) + d)));

  const canSave = weight !== '' && reps !== '';

  const DIFF = [
    { id: 'easy',     label: lang === 'zh' ? '轻松' : 'Easy',     tint: tints.green },
    { id: 'moderate', label: lang === 'zh' ? '中等' : 'Moderate', tint: tints.mint },
    { id: 'hard',     label: lang === 'zh' ? '吃力' : 'Hard',     tint: tints.orange },
    { id: 'failure',  label: lang === 'zh' ? '力竭' : 'Failure',  tint: tints.red },
  ];

  return (
    <div className="px-5 pb-6 pt-1">
      {/* Recommendation banner */}
      {rec && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springs.smooth}
          className="mb-5 p-4 rounded-2xl"
          style={{
            background: hexToRgba(tintForKind(rec.kind), 0.14),
            boxShadow: `inset 0 0 0 0.5px ${hexToRgba(tintForKind(rec.kind), 0.55)}`,
          }}
        >
          <div className="flex items-center gap-2">
            <Chip size="sm" tint={tintForKind(rec.kind)}>
              {rec.weight} {weightUnit}
            </Chip>
            <span className="v2-caption text-[10px] whitespace-nowrap" style={{ color: tintForKind(rec.kind) }}>
              {(lang === 'zh' ? KIND_LABEL_ZH : KIND_LABEL)[rec.kind]}
            </span>
          </div>
          <div className="v2-body text-[12.5px] text-white/70 mt-1.5">
            {t(`log.rec.${rec.reasoning}`)}
          </div>
        </motion.div>
      )}

      {/* Weight stepper */}
      <NumberRow
        label={lang === 'zh' ? `重量 (${weightUnit})` : `Weight (${weightUnit})`}
        value={weight}
        onChange={setWeight}
        onMinus={() => incWeight(-1)}
        onPlus={() => incWeight(1)}
        bigNumber
      />

      <div className="my-4 v2-hairline" />

      {/* Reps stepper */}
      <NumberRow
        label={lang === 'zh' ? '次数' : 'Reps'}
        value={reps}
        onChange={setReps}
        onMinus={() => incReps(-1)}
        onPlus={() => incReps(1)}
      />

      <div className="my-4 v2-hairline" />

      {/* Difficulty chips */}
      <div>
        <div className="v2-caption mb-2">
          {lang === 'zh' ? '感觉如何' : 'How did it feel'}
        </div>
        <div className="grid grid-cols-4 gap-2">
          {DIFF.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setDifficulty(d.id)}
              className="h-11 rounded-full flex items-center justify-center text-[13px] font-semibold transition"
              style={
                difficulty === d.id
                  ? { background: d.tint, color: '#000' }
                  : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.78)', boxShadow: 'inset 0 0 0 0.5px rgba(255,255,255,0.12)' }
              }
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Save bar */}
      <div className="mt-6 flex gap-3">
        <PrimaryButton size="lg" variant="plain" onClick={onCancel}>
          {lang === 'zh' ? '取消' : 'Cancel'}
        </PrimaryButton>
        <PrimaryButton
          size="lg"
          fullWidth
          disabled={!canSave}
          onClick={() => onSave({ weight: Number(weight), reps: Number(reps), difficulty })}
        >
          {initial
            ? (lang === 'zh' ? '保存修改' : 'Save changes')
            : (lang === 'zh' ? '完成这组' : 'Save set')}
        </PrimaryButton>
      </div>
    </div>
  );
}

function NumberRow({ label, value, onChange, onMinus, onPlus, bigNumber = false }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <div className="v2-caption">{label}</div>
        <input
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^\d.]/g, ''))}
          placeholder="0"
          className={`mt-1 w-full bg-transparent border-0 outline-none v2-num font-semibold tracking-[-0.02em] text-white ${
            bigNumber ? 'text-[40px] leading-none' : 'text-[28px] leading-none'
          }`}
        />
      </div>
      <div className="flex items-center gap-2">
        <StepperButton onClick={onMinus} symbol="−" />
        <StepperButton onClick={onPlus} symbol="+" />
      </div>
    </div>
  );
}

function StepperButton({ onClick, symbol }) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.88 }}
      transition={springs.press}
      onClick={onClick}
      className="w-12 h-12 rounded-full grid place-items-center text-[22px] font-light text-white"
      style={{
        background: 'rgba(255,255,255,0.08)',
        boxShadow: 'inset 0 0 0 0.5px rgba(255,255,255,0.12)',
      }}
    >
      {symbol}
    </motion.button>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Add-Exercise form (custom one-off exercise)
// ─────────────────────────────────────────────────────────────────────

function AddExerciseForm({ workoutId, lang, onClose }) {
  const { setOverride, overrides } = useOverrides();
  const [name, setName] = useState('');
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState('10-15');
  const [primary, setPrimary] = useState('');

  const save = () => {
    if (!name.trim()) return;
    const id = `custom-${Date.now()}`;
    const ex = {
      id,
      name: name.trim(),
      order: 99,
      sets: Number(sets) || 3,
      repRange: reps,
      restSeconds: 75,
      suggestedWeight: '',
      currentWeight: '',
      goalWeight: '',
      priority: 'moderate',
      primaryMuscles: primary ? [primary] : [],
      secondaryMuscles: [],
      whyItMatters: '',
      howTo: [],
      commonMistakes: [],
      tips: [],
      kneeFriendly: true,
      lowerBackFriendly: true,
      progressionNote: '',
      workoutId,
      custom: true,
    };
    setOverride('customExercises', null, id, ex);
    onClose();
  };

  return (
    <div className="px-5 pt-1 pb-6 space-y-4">
      <Field label={lang === 'zh' ? '动作名' : 'Name'}>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={lang === 'zh' ? '比如 「绳索三头屈伸」' : 'e.g. Cable Tricep Pushdown'}
          className="w-full bg-transparent border-0 outline-none v2-title text-[20px] text-white placeholder-white/30"
        />
      </Field>
      <div className="v2-hairline" />
      <div className="flex gap-4">
        <Field label={lang === 'zh' ? '组数' : 'Sets'}>
          <input
            type="number"
            inputMode="numeric"
            value={sets}
            onChange={(e) => setSets(e.target.value.replace(/\D/g, ''))}
            className="w-full bg-transparent border-0 outline-none v2-num text-[22px] font-semibold text-white"
          />
        </Field>
        <Field label={lang === 'zh' ? '次数范围' : 'Rep range'}>
          <input
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            placeholder="10-15"
            className="w-full bg-transparent border-0 outline-none v2-num text-[22px] font-semibold text-white"
          />
        </Field>
      </div>
      <div className="v2-hairline" />
      <Field label={lang === 'zh' ? '主要肌群（可选）' : 'Primary muscle (optional)'}>
        <input
          value={primary}
          onChange={(e) => setPrimary(e.target.value)}
          placeholder={lang === 'zh' ? '比如「三头」' : 'e.g. Triceps'}
          className="w-full bg-transparent border-0 outline-none v2-body text-[16px] text-white placeholder-white/30"
        />
      </Field>

      <div className="pt-4 flex gap-3">
        <PrimaryButton size="lg" variant="plain" onClick={onClose}>
          {lang === 'zh' ? '取消' : 'Cancel'}
        </PrimaryButton>
        <PrimaryButton size="lg" fullWidth disabled={!name.trim()} onClick={save}>
          {lang === 'zh' ? '加进今天' : 'Add to today'}
        </PrimaryButton>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <div className="v2-caption mb-1">{label}</div>
      {children}
    </div>
  );
}

function hexToRgba(hex, a) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
