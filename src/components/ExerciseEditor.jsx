import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useT } from '../i18n/index.jsx';
import { useOverrides } from '../hooks/useOverrides.jsx';

// Extract a YouTube video ID from a raw URL or short ID string.
function parseYouTubeId(input) {
  if (!input) return null;
  const s = input.trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;
  // try common URL patterns
  const patterns = [
    /youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/watch\?v=([A-Za-z0-9_-]{11})/,
    /youtu\.be\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/embed\/([A-Za-z0-9_-]{11})/,
  ];
  for (const re of patterns) {
    const m = s.match(re);
    if (m) return m[1];
  }
  return null;
}

export default function ExerciseEditor({ open, onClose, exercise, defaultYouTubeId }) {
  const t = useT();
  const { overrides, setOverride, clearOverride } = useOverrides();
  const ov = overrides.exercise?.[exercise?.id] || {};

  const [suggested, setSuggested] = useState('');
  const [current, setCurrent] = useState('');
  const [goal, setGoal] = useState('');
  const [yt, setYt] = useState('');
  const [ytError, setYtError] = useState('');

  useEffect(() => {
    if (!open || !exercise) return;
    setSuggested(ov.suggestedWeight ?? exercise.suggestedWeight ?? '');
    setCurrent(ov.currentWeight ?? exercise.currentWeight ?? '');
    setGoal(ov.goalWeight ?? exercise.goalWeight ?? '');
    setYt(ov.youtubeId ?? defaultYouTubeId ?? '');
    setYtError('');
  }, [open, exercise?.id]); // eslint-disable-line

  if (!exercise) return null;

  const save = () => {
    setOverride('exercise', exercise.id, 'suggestedWeight', suggested);
    setOverride('exercise', exercise.id, 'currentWeight', current);
    setOverride('exercise', exercise.id, 'goalWeight', goal);
    if (yt) {
      const id = parseYouTubeId(yt);
      if (!id) {
        setYtError('Invalid YouTube ID/URL');
        return;
      }
      setOverride('exercise', exercise.id, 'youtubeId', id);
    } else {
      clearOverride('exercise', exercise.id, 'youtubeId');
    }
    onClose();
  };

  const resetField = (field, setter) => {
    clearOverride('exercise', exercise.id, field);
    setter('');
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
            className="fixed inset-0 z-[50] bg-ink-900/40 dark:bg-ink-900/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 32 }}
            className="fixed inset-x-0 bottom-0 z-[60] max-h-[88vh] overflow-y-auto rounded-t-[28px] bg-bone-50 dark:bg-ink-900 border-t border-black/5 dark:border-white/5 pb-safe"
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
                {t('edit.exercise.title')}
              </div>
              <button
                onClick={save}
                className="pt-3 text-sm font-semibold text-priority-extreme"
              >
                {t('edit.save')}
              </button>
            </div>

            <div className="px-5 pt-4 pb-10 space-y-3">
              <div className="text-base font-semibold text-ink-900 dark:text-bone-100">
                {exercise.name}
              </div>

              <Field
                label={t('edit.exercise.suggested')}
                hasOverride={ov.suggestedWeight != null}
                onReset={() => resetField('suggestedWeight', setSuggested)}
                resetLabel={t('edit.reset')}
              >
                <input value={suggested} onChange={(e) => setSuggested(e.target.value)} className={inputCls} />
              </Field>
              <Field
                label={t('edit.exercise.current')}
                hasOverride={ov.currentWeight != null}
                onReset={() => resetField('currentWeight', setCurrent)}
                resetLabel={t('edit.reset')}
              >
                <input value={current} onChange={(e) => setCurrent(e.target.value)} className={inputCls} />
              </Field>
              <Field
                label={t('edit.exercise.goal')}
                hasOverride={ov.goalWeight != null}
                onReset={() => resetField('goalWeight', setGoal)}
                resetLabel={t('edit.reset')}
              >
                <input value={goal} onChange={(e) => setGoal(e.target.value)} className={inputCls} />
              </Field>

              <Field
                label={t('edit.exercise.youtube')}
                hasOverride={ov.youtubeId != null}
                onReset={() => resetField('youtubeId', setYt)}
                resetLabel={t('edit.reset')}
              >
                <input
                  value={yt}
                  onChange={(e) => { setYt(e.target.value); setYtError(''); }}
                  placeholder="https://youtube.com/shorts/…"
                  className={inputCls}
                />
                <div className="text-[10px] text-ink-300 mt-1">
                  {t('edit.exercise.youtubeHelp')}
                </div>
                {ytError && (
                  <div className="text-[11px] text-priority-extreme mt-1">{ytError}</div>
                )}
              </Field>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

const inputCls =
  'w-full bg-bone-100 dark:bg-ink-700 rounded-xl px-3 py-2.5 text-[14px] text-ink-900 dark:text-bone-100 placeholder:text-ink-300 outline-none border border-transparent focus:border-ink-900 dark:focus:border-bone-100';

function Field({ label, children, hasOverride, onReset, resetLabel }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider mb-1.5 flex justify-between items-center">
        <span className="text-ink-300">{label}</span>
        {hasOverride && (
          <button
            onClick={onReset}
            className="text-[10px] text-priority-extreme normal-case tracking-normal"
          >
            ↺ {resetLabel}
          </button>
        )}
      </div>
      {children}
    </div>
  );
}
