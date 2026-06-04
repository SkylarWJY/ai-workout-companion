import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLang, locEx } from '../i18n/index.jsx';
import { useOverrides } from '../hooks/useOverrides.jsx';
import { variantLabel } from './VariantBadge.jsx';
import { formatLogShort } from '../utils/historyLookup.js';

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

  // Variant selection — controls which historical log we pre-fill from
  // and what label gets written into the saved log entry. When the
  // exercise has only one variant (or none), the chip strip is hidden.
  const selectableVariants = (variants || []).filter((v) => !v.isBestPick);
  const [variantKey, setVariantKey] = useState(
    defaultVariantKey || selectableVariants[0]?.key || null,
  );

  // Pre-fill weight/reps/difficulty whenever the chosen variant changes —
  // each variant has its own last-reference, so a tab switch should
  // reload the form to reflect "last time I did THIS variant."
  const refLog =
    (variantKey && lastLogsByVariant?.[variantKey]) ||
    lastLogsByVariant?.default ||
    null;

  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [difficulty, setDifficulty] = useState('moderate');
  const [notes, setNotes] = useState('');
  useEffect(() => {
    setWeight(refLog?.weight != null ? String(refLog.weight) : '');
    setReps(refLog?.reps != null ? String(refLog.reps) : '');
    setDifficulty(refLog?.difficulty || 'moderate');
    // Notes don't carry over — each set's notes are session-specific
    setNotes('');
  }, [variantKey, refLog?.ts]);

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
          <span className="tabular">{formatLogShort(refLog, t)}</span>
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
