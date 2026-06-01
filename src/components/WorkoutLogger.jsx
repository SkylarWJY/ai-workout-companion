import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLang, locEx } from '../i18n/index.jsx';
import { useOverrides } from '../hooks/useOverrides.jsx';

export default function WorkoutLogger({
  exercise,
  setNumber,
  totalSets,
  defaultWeight,
  defaultReps,
  onCancel,
  onSave,
}) {
  const { t, lang } = useLang();
  const { weightUnit } = useOverrides();
  const [weight, setWeight] = useState(defaultWeight ?? '');
  const [reps, setReps] = useState(defaultReps ?? '');
  const [difficulty, setDifficulty] = useState('moderate');
  const [notes, setNotes] = useState('');

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

      <div className="grid grid-cols-2 gap-3">
        <NumField
          label={t('workout.weight')}
          suffix={weightUnit}
          value={weight}
          onChange={setWeight}
          placeholder={String(defaultWeight ?? '—')}
        />
        <NumField
          label={t('workout.reps')}
          value={reps}
          onChange={setReps}
          placeholder={String(defaultReps ?? exercise.repRange.split('–')[1] ?? '')}
        />
      </div>

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
