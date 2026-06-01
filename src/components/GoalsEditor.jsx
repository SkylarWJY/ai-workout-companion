import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useT } from '../i18n/index.jsx';
import { useOverrides } from '../hooks/useOverrides.jsx';
import { USER_PROFILE } from '../data/workoutData.js';

export default function GoalsEditor({ open, onClose }) {
  const t = useT();
  const { overrides, setOverride } = useOverrides();
  const o = overrides.profile || {};

  const [bf, setBf] = useState('');
  const [targetBf, setTargetBf] = useState('');
  const [pullUpCurrent, setPullUpCurrent] = useState('');
  const [pullUpTarget, setPullUpTarget] = useState('');
  const [goals, setGoals] = useState('');

  useEffect(() => {
    if (!open) return;
    setBf(String(o.bf ?? USER_PROFILE.currentBodyFat));
    setTargetBf(String(o.targetBf ?? USER_PROFILE.targetBodyFat));
    setPullUpCurrent(o.pullUpCurrent ?? USER_PROFILE.pullUpProgression.current);
    setPullUpTarget(o.pullUpTarget ?? USER_PROFILE.pullUpProgression.target);
    setGoals((o.goals ?? USER_PROFILE.goals).join('\n'));
  }, [open]); // eslint-disable-line

  const save = () => {
    if (bf !== '') setOverride('profile', null, 'bf', Number(bf));
    if (targetBf !== '') setOverride('profile', null, 'targetBf', Number(targetBf));
    if (pullUpCurrent !== '') setOverride('profile', null, 'pullUpCurrent', pullUpCurrent);
    if (pullUpTarget !== '') setOverride('profile', null, 'pullUpTarget', pullUpTarget);
    const goalsArr = goals.split('\n').map((s) => s.trim()).filter(Boolean);
    if (goalsArr.length > 0) setOverride('profile', null, 'goals', goalsArr);
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
            className="fixed inset-0 z-30 bg-ink-900/40 dark:bg-ink-900/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 32 }}
            className="fixed inset-x-0 bottom-0 z-40 max-h-[88vh] overflow-y-auto rounded-t-[28px] bg-bone-50 dark:bg-ink-900 border-t border-black/5 dark:border-white/5 pb-safe"
          >
            <div className="sticky top-0 z-10 flex justify-between items-center bg-bone-50/85 dark:bg-ink-900/85 backdrop-blur-xl px-5 pt-3 pb-2 border-b border-black/5 dark:border-white/5">
              <div className="w-9 h-1 mx-auto bg-ink-200 dark:bg-ink-600 rounded-full absolute left-1/2 -translate-x-1/2 top-2" />
              <button
                onClick={onClose}
                className="pt-3 text-ink-400 dark:text-ink-200 text-sm font-medium"
              >
                {t('edit.cancel')}
              </button>
              <div className="pt-3 text-[13px] font-semibold tracking-tight text-ink-900 dark:text-bone-100">
                {t('edit.goals.title')}
              </div>
              <button
                onClick={save}
                className="pt-3 text-sm font-semibold text-priority-extreme"
              >
                {t('edit.save')}
              </button>
            </div>

            <div className="px-5 pt-4 pb-10 space-y-3">
              <Field label={t('edit.profile.bf')} suffix="%">
                <input
                  type="number"
                  inputMode="decimal"
                  value={bf}
                  onChange={(e) => setBf(e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label={t('edit.profile.targetBf')} suffix="%">
                <input
                  type="number"
                  inputMode="decimal"
                  value={targetBf}
                  onChange={(e) => setTargetBf(e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label={t('edit.profile.pullup')}>
                <input
                  value={pullUpCurrent}
                  onChange={(e) => setPullUpCurrent(e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label={t('edit.profile.pullupTarget')}>
                <input
                  value={pullUpTarget}
                  onChange={(e) => setPullUpTarget(e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label={t('edit.profile.goals')}>
                <textarea
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  rows={4}
                  className={inputCls + ' resize-none'}
                />
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

function Field({ label, suffix, children }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider text-ink-300 mb-1.5 flex justify-between">
        <span>{label}</span>
        {suffix && <span>{suffix}</span>}
      </div>
      {children}
    </div>
  );
}
