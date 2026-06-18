import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLang, locEx } from '../i18n/index.jsx';
import { useOverrides } from '../hooks/useOverrides.jsx';
import { variantLabel } from './VariantBadge.jsx';
import { formatLogShort } from '../utils/historyLookup.js';
import { convertWeight } from '../utils/weight.js';
import { recommendNextWeight } from '../utils/progression.js';
import { useLocalStorage } from '../hooks/useLocalStorage.js';

export default function WorkoutLogger({
  exercise,
  setNumber,
  totalSets,
  variants,             // array of variant objects (from demoMap) — optional
  defaultVariantKey,    // user's last-used variant for this lift, or first variant
  lastLogsByVariant,    // { [variantKey]: log } from history — pre-fills the form per variant
  onCancel,
  onSave,
}) {
  const { t, lang } = useLang();
  const { weightUnit } = useOverrides();
  const [history] = useLocalStorage('atlas.history', {});

  // Variant selection — controls which historical log we pre-fill from
  // and what label gets written into the saved log entry. When the
  // exercise has only one variant (or none), the chip strip is hidden.
  const selectableVariants = (variants || []).filter((v) => !v.isBestPick);
  const [variantKey, setVariantKey] = useState(
    defaultVariantKey || selectableVariants[0]?.key || null,
  );

  // Last-set reference (for the "Last time" line below the form).
  const refLog =
    (variantKey && lastLogsByVariant?.[variantKey]) ||
    lastLogsByVariant?.default ||
    null;

  // Adaptive recommendation — what we ACTUALLY pre-fill. Reads the user's
  // history, looks at last session's top set + difficulty, and returns
  // the next-session weight that nudges toward the rep range:
  //   easy at top  → big bump
  //   moderate/hard at top → small bump
  //   failure / under range → de-load 10%
  //   middle of range → maintain weight, push reps
  const recommendation = recommendNextWeight({
    history,
    exerciseId: exercise.id,
    variantKey,
    repRange: exercise.repRange,
    currentUnit: weightUnit,
  });

  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [difficulty, setDifficulty] = useState('moderate');
  const [notes, setNotes] = useState('');
  useEffect(() => {
    // Priority: smart recommendation > last set's weight > empty
    const prefillWeight =
      recommendation?.weight != null
        ? String(recommendation.weight)
        : refLog?.weight != null
          ? String(
              convertWeight(refLog.weight, refLog.weightUnit || 'lb', weightUnit),
            )
          : '';
    setWeight(prefillWeight);
    setReps(refLog?.reps != null ? String(refLog.reps) : '');
    setDifficulty(refLog?.difficulty || 'moderate');
    setNotes('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variantKey, refLog?.ts, weightUnit, recommendation?.weight]);

  const DIFFICULTY = [
    { id: 'easy', label: t('log.diff.easy') },
    { id: 'moderate', label: t('log.diff.moderate') },
    { id: 'hard', label: t('log.diff.hard') },
    { id: 'failure', label: t('log.diff.failure') },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl bg-white dark:bg-ink-800 border border-black/5 dark:border-white/5 shadow-card dark:shadow-cardDark p-5 space-y-4"
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-ink-300">
            {t('log.title')}
          </div>
          <div className="text-base font-semibold text-ink-900 dark:text-bone-100">
            {locEx(exercise, 'name', lang)}
          </div>
          <div className="text-xs text-ink-400 dark:text-ink-200 mt-0.5 tabular">
            {t('workout.set')} {setNumber}/{totalSets} · {t('workout.target')} {exercise.repRange}
          </div>
        </div>
      </div>

      {/* Variant strip — only shown when the lift has multiple swappable
          variants. Picking one re-loads weight / reps / difficulty from
          that variant's last logged session. */}
      {selectableVariants.length > 1 && (
        <div>
          <div className="text-[10px] uppercase tracking-wider text-ink-300 mb-1.5">
            {t('log.variant')}
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto scroll-clean -mx-1 px-1 pb-1">
            {selectableVariants.map((v) => {
              const isSelected = v.key === variantKey;
              return (
                <button
                  key={v.key}
                  type="button"
                  onClick={() => setVariantKey(v.key)}
                  className={`shrink-0 text-[11px] font-medium uppercase tracking-wider rounded-full px-3 py-1.5 border transition active:scale-[0.97]
                    ${
                      isSelected
                        ? 'bg-ink-900 dark:bg-bone-100 text-bone-50 dark:text-ink-900 border-transparent'
                        : 'bg-transparent text-ink-500 dark:text-ink-100 border-black/10 dark:border-white/10'
                    }`}
                >
                  {variantLabel(v, t, lang)}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Adaptive recommendation banner — only shows when the algorithm
          has enough history to offer a confident next-set weight. */}
      {recommendation && (
        <RecommendationBanner
          rec={recommendation}
          unit={weightUnit}
          t={t}
        />
      )}

      <div className="grid grid-cols-2 gap-3">
        <NumField
          label={t('workout.weight')}
          suffix={weightUnit}
          value={weight}
          onChange={setWeight}
          placeholder={refLog ? String(refLog.weight) : '—'}
        />
        <NumField
          label={t('workout.reps')}
          value={reps}
          onChange={setReps}
          placeholder={
            refLog
              ? String(refLog.reps ?? '')
              : String(exercise.repRange?.split('–')[1] ?? '')
          }
        />
      </div>

      {/* "Last time" reference line — under the form fields. Only shows
          when we have a log to point at; the placeholders inside the
          inputs already convey the default. */}
      {refLog && (
        <div className="text-[11px] text-ink-400 dark:text-ink-200 -mt-2">
          <span className="text-ink-300">{t('log.lastTime')}: </span>
          <span className="tabular">
            {formatLogShort(refLog, t, weightUnit)}
          </span>
        </div>
      )}

      <div>
        <div className="text-[10px] uppercase tracking-wider text-ink-300 mb-1.5">
          {t('log.difficulty')}
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {DIFFICULTY.map((d) => (
            <button
              key={d.id}
              onClick={() => setDifficulty(d.id)}
              className={`py-2 rounded-xl text-[12px] font-medium border transition active:scale-[0.97]
                ${
                  difficulty === d.id
                    ? 'bg-ink-900 dark:bg-bone-100 text-bone-50 dark:text-ink-900 border-transparent'
                    : 'bg-transparent text-ink-700 dark:text-bone-100 border-black/10 dark:border-white/10'
                }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="text-[10px] uppercase tracking-wider text-ink-300 mb-1.5">
          {t('log.notesLabel')} <span className="text-ink-200">{t('log.notesOpt')}</span>
        </div>
        <input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={t('log.notesPh')}
          className="w-full bg-bone-100 dark:bg-ink-700 rounded-xl px-3 py-2.5 text-sm text-ink-900 dark:text-bone-100 placeholder:text-ink-300 outline-none border border-transparent focus:border-ink-900 dark:focus:border-bone-100"
        />
      </div>

      <div className="flex gap-2 pt-1">
        <button
          onClick={onCancel}
          className="flex-1 py-3 rounded-2xl border border-black/10 dark:border-white/10 text-sm font-medium text-ink-700 dark:text-bone-100 active:scale-[0.98]"
        >
          {t('log.cancel')}
        </button>
        <button
          onClick={() =>
            onSave({
              weight: weight === '' ? null : Number(weight),
              weightUnit,
              reps: reps === '' ? null : Number(reps),
              difficulty,
              notes,
              variant: variantKey || null,
              ts: Date.now(),
            })
          }
          className="flex-[2] py-3 rounded-2xl bg-ink-900 dark:bg-bone-100 text-bone-50 dark:text-ink-900 text-sm font-semibold active:scale-[0.98]"
        >
          {t('log.complete')}
        </button>
      </div>
    </motion.div>
  );
}

// Small banner that explains WHY the pre-filled weight is what it is.
// Color codes the recommendation kind so the user can read the intent
// at a glance: green = bump up, gray = maintain, red = de-load.
function RecommendationBanner({ rec, unit, t }) {
  const palette =
    rec.kind === 'bigBump' || rec.kind === 'smallBump'
      ? 'bg-priority-moderate/10 border-priority-moderate/30 text-priority-moderate'
      : rec.kind === 'deload'
        ? 'bg-priority-extreme/10 border-priority-extreme/30 text-priority-extreme'
        : 'bg-ink-200/30 border-black/10 dark:bg-ink-700/40 dark:border-white/10 text-ink-700 dark:text-bone-100';

  const reasonText = t(`log.rec.${rec.reasoning}`);
  const fromText = `${rec.from.weight} ${unit} × ${rec.from.reps} · ${t(
    `log.diff.${rec.from.difficulty}`,
  )}`;

  return (
    <div className={`rounded-2xl border px-3 py-2.5 ${palette}`}>
      <div className="text-[10px] uppercase tracking-wider opacity-70">
        {t('log.rec.label')}
      </div>
      <div className="text-[15px] font-semibold tabular leading-tight mt-0.5">
        {rec.weight} {unit}
      </div>
      <div className="text-[11px] mt-1 opacity-80 leading-snug">
        {reasonText}
      </div>
      <div className="text-[10px] mt-1 opacity-60 tabular">
        ← {fromText}
      </div>
    </div>
  );
}

const NumField = ({ label, value, onChange, suffix, placeholder }) => (
  <div>
    <div className="text-[10px] uppercase tracking-wider text-ink-300 mb-1.5">
      {label}
    </div>
    <div className="relative">
      <input
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-bone-100 dark:bg-ink-700 rounded-xl px-3 py-3 text-lg font-semibold tabular text-ink-900 dark:text-bone-100 placeholder:text-ink-300 outline-none border border-transparent focus:border-ink-900 dark:focus:border-bone-100"
      />
      {suffix && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs uppercase tracking-wider text-ink-300">
          {suffix}
        </span>
      )}
    </div>
  </div>
);
