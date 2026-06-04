import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../i18n/index.jsx';
import { useOverrides } from '../hooks/useOverrides.jsx';
import { parseYouTubeId } from '../utils/youtube.js';

// Fixed catalog of muscle names that muscleMap.js knows how to score.
// Keeping the picker constrained to these means a custom exercise is
// guaranteed to light up the body map correctly.
const MUSCLE_CATALOG = [
  'Front Delts', 'Side Delts', 'Rear Delts',
  'Biceps', 'Triceps', 'Forearms',
  'Chest', 'Upper Chest',
  'Lats', 'Lat Width', 'Mid Back', 'Upper Back', 'Traps',
  'Abs', 'Deep Core', 'Obliques', 'Lower Back',
  'Quads', 'Glutes', 'Hamstrings', 'Adductors', 'Calves',
];

const PRIORITY_OPTIONS = [
  { id: 'extreme', labelKey: 'priority.extreme' },
  { id: 'veryhigh', labelKey: 'priority.veryhigh' },
  { id: 'high', labelKey: 'priority.high' },
  { id: 'moderate', labelKey: 'priority.moderate' },
  { id: 'low', labelKey: 'priority.low' },
];

// Sheet for adding a new custom exercise to the current workout day.
// When `editingExercise` is passed, the sheet mounts in edit mode
// (pre-populates fields + shows a Delete action).
export default function CustomExerciseEditor({
  open,
  onClose,
  workoutId,
  editingExercise = null,
}) {
  const { t } = useLang();
  const { setOverride, clearOverride } = useOverrides();

  const [name, setName] = useState('');
  const [primaryMuscle, setPrimaryMuscle] = useState('');
  const [priority, setPriority] = useState('moderate');
  const [sets, setSets] = useState('3');
  const [repRange, setRepRange] = useState('8-12');
  const [restSeconds, setRestSeconds] = useState('90');
  const [suggestedWeight, setSuggestedWeight] = useState('');
  const [youtubeInput, setYoutubeInput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    if (editingExercise) {
      setName(editingExercise.name || '');
      setPrimaryMuscle(editingExercise.primaryMuscles?.[0] || '');
      setPriority(editingExercise.priority || 'moderate');
      setSets(String(editingExercise.sets ?? '3'));
      setRepRange(editingExercise.repRange || '8-12');
      setRestSeconds(String(editingExercise.restSeconds ?? '90'));
      setSuggestedWeight(editingExercise.suggestedWeight || '');
      setYoutubeInput(editingExercise.youtubeId || '');
    } else {
      setName('');
      setPrimaryMuscle('');
      setPriority('moderate');
      setSets('3');
      setRepRange('8-12');
      setRestSeconds('90');
      setSuggestedWeight('');
      setYoutubeInput('');
    }
    setError('');
  }, [open, editingExercise?.id]);

  const save = () => {
    if (!name.trim()) {
      setError(t('custom.errNoName'));
      return;
    }
    if (!primaryMuscle) {
      setError(t('custom.errNoMuscle'));
      return;
    }
    const setsNum = parseInt(sets, 10) || 3;
    const restNum = parseInt(restSeconds, 10) || 90;
    const ytTrim = youtubeInput.trim();
    const ytId = ytTrim ? parseYouTubeId(ytTrim) : '';
    if (ytTrim && !ytId) {
      setError(t('edit.exercise.youtubeInvalid'));
      return;
    }

    const id = editingExercise?.id || `custom-${Date.now()}`;
    const exercise = {
      id,
      workoutId,
      name: name.trim(),
      primaryMuscles: [primaryMuscle],
      secondaryMuscles: [],
      sets: setsNum,
      repRange: repRange.trim() || '8-12',
      restSeconds: restNum,
      suggestedWeight: suggestedWeight.trim(),
      priority,
      youtubeId: ytId || '',
      currentWeight: '',
      goalWeight: '',
    };

    setOverride('customExercises', null, id, exercise);
    onClose();
  };

  const remove = () => {
    if (!editingExercise) return;
    const ok = window.confirm(
      `${t('custom.deleteConfirm')} "${editingExercise.name}"?`,
    );
    if (!ok) return;
    clearOverride('customExercises', null, editingExercise.id);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[55] bg-ink-900/40 dark:bg-ink-900/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 32 }}
            className="fixed inset-x-0 bottom-0 z-[60] max-h-[90vh] overflow-y-auto rounded-t-[28px] bg-bone-50 dark:bg-ink-900 border-t border-black/5 dark:border-white/5 pb-safe"
          >
            <div className="sticky top-0 z-10 flex justify-between items-center bg-bone-50/85 dark:bg-ink-900/85 backdrop-blur-xl px-5 pt-3 pb-2 border-b border-black/5 dark:border-white/5">
              <div className="w-9 h-1 mx-auto bg-ink-200 dark:bg-ink-600 rounded-full absolute left-1/2 -translate-x-1/2 top-2" />
              <button
                onClick={onClose}
                className="pt-3 text-ink-400 dark:text-ink-200 text-sm font-medium"
              >
                {t('edit.cancel')}
              </button>
              <div className="pt-3 text-[13px] font-semibold tracking-tight text-ink-900 dark:text-bone-100 truncate max-w-[60%]">
                {editingExercise ? t('custom.titleEdit') : t('custom.titleNew')}
              </div>
              <button
                onClick={save}
                className="pt-3 text-sm font-semibold text-priority-extreme"
              >
                {editingExercise ? t('edit.save') : t('custom.add')}
              </button>
            </div>

            <div className="px-5 pt-4 pb-10 space-y-4">
              <Field label={t('custom.name')}>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('custom.namePh')}
                  className={inputCls}
                />
              </Field>

              <Field label={t('custom.primaryMuscle')}>
                <div className="flex flex-wrap gap-1.5">
                  {MUSCLE_CATALOG.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPrimaryMuscle(m)}
                      className={`text-[11px] font-medium uppercase tracking-wider rounded-full px-2.5 py-1 border transition active:scale-[0.97]
                        ${
                          primaryMuscle === m
                            ? 'bg-ink-900 dark:bg-bone-100 text-bone-50 dark:text-ink-900 border-transparent'
                            : 'bg-transparent text-ink-500 dark:text-ink-100 border-black/10 dark:border-white/10'
                        }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label={t('custom.priority')}>
                <div className="grid grid-cols-5 gap-1.5">
                  {PRIORITY_OPTIONS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPriority(p.id)}
                      className={`py-1.5 rounded-xl text-[10px] uppercase tracking-wider font-medium border transition active:scale-[0.97]
                        ${
                          priority === p.id
                            ? 'bg-ink-900 dark:bg-bone-100 text-bone-50 dark:text-ink-900 border-transparent'
                            : 'bg-transparent text-ink-700 dark:text-bone-100 border-black/10 dark:border-white/10'
                        }`}
                    >
                      {t(p.labelKey)}
                    </button>
                  ))}
                </div>
              </Field>

              <div className="grid grid-cols-3 gap-2">
                <Field label={t('edit.exercise.sets')}>
                  <input
                    type="number"
                    inputMode="numeric"
                    min="1"
                    max="20"
                    value={sets}
                    onChange={(e) => setSets(e.target.value)}
                    className={inputCls}
                  />
                </Field>
                <Field label={t('edit.exercise.reps')}>
                  <input
                    value={repRange}
                    onChange={(e) => setRepRange(e.target.value)}
                    placeholder="8–12"
                    className={inputCls}
                  />
                </Field>
                <Field label={t('edit.exercise.rest')}>
                  <input
                    type="number"
                    inputMode="numeric"
                    min="0"
                    max="600"
                    step="15"
                    value={restSeconds}
                    onChange={(e) => setRestSeconds(e.target.value)}
                    className={inputCls}
                  />
                </Field>
              </div>

              <Field label={t('edit.exercise.suggested')}>
                <input
                  value={suggestedWeight}
                  onChange={(e) => setSuggestedWeight(e.target.value)}
                  placeholder={t('custom.weightPh')}
                  className={inputCls}
                />
              </Field>

              <Field label={t('custom.tutorial')}>
                <input
                  value={youtubeInput}
                  onChange={(e) => setYoutubeInput(e.target.value)}
                  placeholder={t('edit.exercise.youtubePlaceholder')}
                  className={inputCls}
                />
                <div className="text-[10px] text-ink-300 mt-1">
                  {t('custom.tutorialHelp')}
                </div>
              </Field>

              {error && (
                <div className="text-[12px] text-priority-extreme">{error}</div>
              )}

              {editingExercise && (
                <button
                  onClick={remove}
                  className="w-full py-3 rounded-2xl border border-priority-extreme/40 text-priority-extreme text-sm font-medium active:scale-[0.98] mt-2"
                >
                  {t('custom.delete')}
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

const inputCls =
  'w-full bg-bone-100 dark:bg-ink-700 rounded-xl px-3 py-2.5 text-[14px] text-ink-900 dark:text-bone-100 placeholder:text-ink-300 outline-none border border-transparent focus:border-ink-900 dark:focus:border-bone-100';

function Field({ label, children }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider mb-1.5 text-ink-300">
        {label}
      </div>
      {children}
    </div>
  );
}
