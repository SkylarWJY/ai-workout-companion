import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PriorityChip from './PriorityChip.jsx';
import ExerciseDemo from './ExerciseDemo.jsx';
import TempoBlock from './TempoBlock.jsx';
import YouTubeEmbed from './YouTubeEmbed.jsx';
import { useLang, locEx } from '../i18n/index.jsx';
import { fmtRest } from '../utils/format.js';
import { demoVariants } from '../data/demoMap.js';
import { resolveMeta } from '../data/exerciseMeta.js';

export default function ExerciseModal({ open, exercise, onClose }) {
  const { t, lang } = useLang();
  const variants = useMemo(
    () => (exercise ? demoVariants(exercise.id) : []),
    [exercise],
  );
  const [variantIdx, setVariantIdx] = useState(0);

  // reset variant when modal re-opens for a different exercise
  useEffect(() => {
    setVariantIdx(0);
  }, [exercise?.id]);

  const variant = variants[variantIdx];
  const meta = exercise ? resolveMeta(exercise.id, variant) : null;

  return (
    <AnimatePresence>
      {open && exercise && (
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
            className="fixed inset-x-0 bottom-0 z-40 max-h-[90vh] overflow-y-auto rounded-t-[28px] bg-bone-50 dark:bg-ink-900 border-t border-black/5 dark:border-white/5 pb-safe"
          >
            <div className="sticky top-0 z-10 flex justify-between items-center bg-bone-50/85 dark:bg-ink-900/85 backdrop-blur-xl px-5 pt-3 pb-2 border-b border-black/5 dark:border-white/5">
              <div className="w-9 h-1 mx-auto bg-ink-200 dark:bg-ink-600 rounded-full absolute left-1/2 -translate-x-1/2 top-2" />
              <div className="pt-3">
                <PriorityChip priority={exercise.priority} />
              </div>
              <button
                onClick={onClose}
                aria-label={t('modal.done')}
                className="pt-3 text-ink-400 dark:text-ink-200 text-sm font-medium"
              >
                {t('modal.done')}
              </button>
            </div>

            <div className="px-5 pt-4 pb-10 space-y-6">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-ink-900 dark:text-bone-100">
                  {locEx(exercise, 'name', lang)}
                </h2>
                <div className="mt-1 text-sm text-ink-400 dark:text-ink-200 tabular">
                  {exercise.sets} × {exercise.repRange} · {t('workout.rest').toLowerCase()} {fmtRest(exercise.restSeconds)} · {exercise.suggestedWeight}
                </div>
                {meta?.tempo && (
                  <div className="mt-1 text-[12px] tabular text-ink-500 dark:text-ink-100">
                    {t('tempo.label')} · {meta.tempo === 'Static' ? t('tempo.static') : meta.tempo}
                  </div>
                )}
              </div>

              <ExerciseDemo
                exerciseId={exercise.id}
                name={locEx(exercise, 'name', lang)}
                variantIdx={variantIdx}
                onVariantChange={setVariantIdx}
              />

              {meta?.tempo && (
                <TempoBlock
                  exerciseId={exercise.id}
                  variantKey={variant?.key}
                  tempo={meta.tempo}
                  tempoCues={meta.tempoCues}
                  isStatic={meta.isStatic}
                />
              )}

              {meta?.youtubeId && <YouTubeEmbed videoId={meta.youtubeId} />}

              <Section title={t('modal.whyMatters')}>
                <p className="text-[14px] leading-relaxed text-ink-700 dark:text-bone-100">
                  {locEx(exercise, 'whyItMatters', lang)}
                </p>
              </Section>

              <Section title={t('modal.targetMuscles')}>
                <div className="flex flex-wrap gap-1.5">
                  {locEx(exercise, 'primaryMuscles', lang).map((m) => (
                    <Pill key={m} primary>
                      {m}
                    </Pill>
                  ))}
                  {locEx(exercise, 'secondaryMuscles', lang).map((m) => (
                    <Pill key={m}>{m}</Pill>
                  ))}
                </div>
              </Section>

              <Section title={t('modal.howToPerform')}>
                <ol className="space-y-2.5">
                  {locEx(exercise, 'howTo', lang).map((step, i) => (
                    <li
                      key={i}
                      className="flex gap-3 text-[14px] leading-relaxed text-ink-700 dark:text-bone-100"
                    >
                      <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-ink-900 dark:bg-bone-100 text-bone-50 dark:text-ink-900 text-[11px] font-semibold tabular flex items-center justify-center">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </Section>

              <Section title={t('modal.formTips')}>
                <ul className="space-y-2">
                  {locEx(exercise, 'tips', lang).map((tt, i) => (
                    <li
                      key={i}
                      className="flex gap-2 text-[14px] leading-relaxed text-ink-700 dark:text-bone-100"
                    >
                      <span className="text-priority-moderate">✓</span>
                      <span>{tt}</span>
                    </li>
                  ))}
                </ul>
              </Section>

              <Section title={t('modal.commonMistakes')}>
                <ul className="space-y-2">
                  {locEx(exercise, 'commonMistakes', lang).map((tt, i) => (
                    <li
                      key={i}
                      className="flex gap-2 text-[14px] leading-relaxed text-ink-700 dark:text-bone-100"
                    >
                      <span className="text-priority-extreme">×</span>
                      <span>{tt}</span>
                    </li>
                  ))}
                </ul>
              </Section>

              {(exercise.kneeFriendly || exercise.backFriendly) && (
                <Section title={t('modal.jointNotes')}>
                  <div className="space-y-2">
                    {exercise.kneeFriendly && (
                      <FriendlyNote
                        label={t('modal.knee')}
                        text={locEx(exercise, 'kneeFriendly', lang)}
                      />
                    )}
                    {exercise.backFriendly && (
                      <FriendlyNote
                        label={t('modal.lowerBack')}
                        text={locEx(exercise, 'backFriendly', lang)}
                      />
                    )}
                  </div>
                </Section>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

const Section = ({ title, children }) => (
  <section>
    <div className="text-[11px] uppercase tracking-[0.18em] text-ink-300 mb-2">
      {title}
    </div>
    {children}
  </section>
);

const Pill = ({ children, primary }) => (
  <span
    className={`text-[11px] uppercase tracking-wider rounded-full px-2.5 py-1 ${
      primary
        ? 'bg-ink-900 dark:bg-bone-100 text-bone-50 dark:text-ink-900'
        : 'bg-bone-100 dark:bg-ink-700 text-ink-700 dark:text-bone-100'
    }`}
  >
    {children}
  </span>
);

const FriendlyNote = ({ label, text }) => (
  <div className="rounded-2xl bg-bone-100 dark:bg-ink-800 border border-black/5 dark:border-white/5 p-3 flex gap-3">
    <span className="text-[10px] uppercase tracking-wider text-ink-300 mt-0.5">
      {label}
    </span>
    <span className="text-[13px] leading-relaxed text-ink-700 dark:text-bone-100">
      {text}
    </span>
  </div>
);
