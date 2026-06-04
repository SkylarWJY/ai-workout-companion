import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../i18n/index.jsx';
import { useOverrides } from '../hooks/useOverrides.jsx';
import { demoVariants } from '../data/demoMap.js';
import { resolveMeta } from '../data/exerciseMeta.js';
import { variantLabel } from './VariantBadge.jsx';

// Extract a YouTube video ID from a raw URL or short ID string.
function parseYouTubeId(input) {
  if (!input) return null;
  const s = input.trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;
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

// Fetch the YouTube oembed info (title + author) for a video ID. Used as
// a soft verification step so the user can confirm they pasted the right
// link. oembed supports CORS so it works from the browser.
async function fetchOembed(videoId) {
  if (!videoId) return null;
  try {
    const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const r = await fetch(url);
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}

export default function ExerciseEditor({ open, onClose, exercise, defaultYouTubeId }) {
  const { t, lang } = useLang();
  const { overrides, setOverride, clearOverride } = useOverrides();
  const ov = overrides.exercise?.[exercise?.id] || {};

  const variants = exercise ? demoVariants(exercise.id) : [];

  const [suggested, setSuggested] = useState('');
  const [current, setCurrent] = useState('');
  const [goal, setGoal] = useState('');
  // Per-variant YouTube inputs — keyed by variant.key. Empty string means
  // "no override, use the default video for this variant".
  const [videoByVariant, setVideoByVariant] = useState({});
  const [videoErrors, setVideoErrors] = useState({});

  useEffect(() => {
    if (!open || !exercise) return;
    setSuggested(ov.suggestedWeight ?? exercise.suggestedWeight ?? '');
    setCurrent(ov.currentWeight ?? exercise.currentWeight ?? '');
    setGoal(ov.goalWeight ?? exercise.goalWeight ?? '');
    // Seed each variant's input with whatever override the user already set.
    const stored = ov.youtubeIdByVariant || {};
    const seeded = {};
    for (const v of variants) {
      seeded[v.key] = stored[v.key] || '';
    }
    setVideoByVariant(seeded);
    setVideoErrors({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, exercise?.id]);

  if (!exercise) return null;

  const save = () => {
    setOverride('exercise', exercise.id, 'suggestedWeight', suggested);
    setOverride('exercise', exercise.id, 'currentWeight', current);
    setOverride('exercise', exercise.id, 'goalWeight', goal);

    // Validate every variant input, then commit the map atomically.
    const errors = {};
    const next = {};
    for (const v of variants) {
      if (v.isBestPick) continue; // editorial lock
      const raw = (videoByVariant[v.key] || '').trim();
      if (!raw) continue; // empty = no override
      const id = parseYouTubeId(raw);
      if (!id) {
        errors[v.key] = t('edit.exercise.youtubeInvalid');
        continue;
      }
      next[v.key] = id;
    }
    if (Object.keys(errors).length > 0) {
      setVideoErrors(errors);
      return;
    }
    if (Object.keys(next).length > 0) {
      setOverride('exercise', exercise.id, 'youtubeIdByVariant', next);
    } else {
      clearOverride('exercise', exercise.id, 'youtubeIdByVariant');
    }
    onClose();
  };

  const resetField = (field, setter) => {
    clearOverride('exercise', exercise.id, field);
    setter('');
  };

  const resetVariantVideo = (variantKey) => {
    setVideoByVariant((prev) => ({ ...prev, [variantKey]: '' }));
    setVideoErrors((prev) => {
      const copy = { ...prev };
      delete copy[variantKey];
      return copy;
    });
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

            <div className="px-5 pt-4 pb-10 space-y-4">
              <div className="text-base font-semibold text-ink-900 dark:text-bone-100">
                {exercise.name}
              </div>

              <Field
                label={t('edit.exercise.suggested')}
                hasOverride={ov.suggestedWeight != null}
                onReset={() => resetField('suggestedWeight', setSuggested)}
                resetLabel={t('edit.reset')}
              >
                <input
                  value={suggested}
                  onChange={(e) => setSuggested(e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field
                label={t('edit.exercise.current')}
                hasOverride={ov.currentWeight != null}
                onReset={() => resetField('currentWeight', setCurrent)}
                resetLabel={t('edit.reset')}
              >
                <input
                  value={current}
                  onChange={(e) => setCurrent(e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field
                label={t('edit.exercise.goal')}
                hasOverride={ov.goalWeight != null}
                onReset={() => resetField('goalWeight', setGoal)}
                resetLabel={t('edit.reset')}
              >
                <input
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className={inputCls}
                />
              </Field>

              {/* Per-variant video section — one input per non-bestpick variant. */}
              <div className="pt-2 border-t border-black/5 dark:border-white/5">
                <div className="text-[11px] uppercase tracking-wider text-ink-300 mb-1 mt-3">
                  {t('edit.exercise.videos')}
                </div>
                <div className="text-[11px] text-ink-400 dark:text-ink-200 mb-3 leading-relaxed">
                  {t('edit.exercise.videosHelp')}
                </div>

                <div className="space-y-3">
                  {variants.map((v) => {
                    if (v.isBestPick) {
                      return (
                        <BestPickRow
                          key={v.key}
                          label={variantLabel(v, t, lang)}
                          lockedLabel={t('edit.exercise.bestPickLocked')}
                        />
                      );
                    }
                    const inputValue = videoByVariant[v.key] || '';
                    const storedOverride = ov.youtubeIdByVariant?.[v.key];
                    const defaultId = resolveMeta(exercise.id, v).youtubeId;
                    const effectiveId =
                      parseYouTubeId(inputValue) || storedOverride || defaultId;
                    return (
                      <VariantVideoRow
                        key={v.key}
                        label={variantLabel(v, t, lang)}
                        value={inputValue}
                        onChange={(val) => {
                          setVideoByVariant((p) => ({ ...p, [v.key]: val }));
                          setVideoErrors((p) => {
                            const copy = { ...p };
                            delete copy[v.key];
                            return copy;
                          });
                        }}
                        hasOverride={storedOverride != null}
                        onReset={() => resetVariantVideo(v.key)}
                        resetLabel={t('edit.reset')}
                        error={videoErrors[v.key]}
                        effectiveVideoId={effectiveId}
                        placeholder={t('edit.exercise.youtubePlaceholder')}
                      />
                    );
                  })}
                </div>
              </div>
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

// Row for one editable variant: label + input + oembed verify line.
function VariantVideoRow({
  label,
  value,
  onChange,
  hasOverride,
  onReset,
  resetLabel,
  error,
  effectiveVideoId,
  placeholder,
}) {
  const [oembed, setOembed] = useState(null);
  const [loadingOembed, setLoadingOembed] = useState(false);

  // Soft-verify the effective video ID via oembed whenever it changes so
  // the user sees "Found: Title — Author" confirmation under the input.
  useEffect(() => {
    let cancelled = false;
    setOembed(null);
    if (!effectiveVideoId) return;
    setLoadingOembed(true);
    fetchOembed(effectiveVideoId).then((data) => {
      if (cancelled) return;
      setLoadingOembed(false);
      setOembed(data);
    });
    return () => {
      cancelled = true;
    };
  }, [effectiveVideoId]);

  return (
    <div className="rounded-2xl bg-bone-100 dark:bg-ink-800 border border-black/5 dark:border-white/5 p-3">
      <div className="text-[11px] uppercase tracking-wider mb-1.5 flex justify-between items-center">
        <span className="text-ink-500 dark:text-ink-100 font-medium">{label}</span>
        {hasOverride && (
          <button
            onClick={onReset}
            className="text-[10px] text-priority-extreme normal-case tracking-normal"
          >
            ↺ {resetLabel}
          </button>
        )}
      </div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white dark:bg-ink-700 rounded-xl px-3 py-2 text-[13px] text-ink-900 dark:text-bone-100 placeholder:text-ink-300 outline-none border border-transparent focus:border-ink-900 dark:focus:border-bone-100"
      />
      {error && (
        <div className="text-[11px] text-priority-extreme mt-1.5">{error}</div>
      )}
      {!error && oembed && (
        <div className="text-[10px] text-ink-400 dark:text-ink-200 mt-1.5 leading-snug">
          <span className="text-priority-moderate">✓</span>{' '}
          <span className="line-clamp-1">{oembed.title}</span>
          <span className="opacity-60"> · {oembed.author_name}</span>
        </div>
      )}
      {!error && !oembed && loadingOembed && (
        <div className="text-[10px] text-ink-300 mt-1.5">…</div>
      )}
      {!error && !oembed && !loadingOembed && effectiveVideoId && (
        <div className="text-[10px] text-ink-300 mt-1.5">
          (could not verify — video may be private or unavailable)
        </div>
      )}
    </div>
  );
}

// Read-only row for the ★ Best Pick variant — editorial lock.
function BestPickRow({ label, lockedLabel }) {
  return (
    <div className="rounded-2xl border border-priority-veryhigh/30 bg-priority-veryhigh/5 p-3 flex items-center justify-between">
      <div className="text-[11px] uppercase tracking-wider text-priority-veryhigh font-medium inline-flex items-center gap-1">
        <span aria-hidden="true">★</span>
        {label}
      </div>
      <div className="text-[10px] uppercase tracking-wider text-priority-veryhigh/70">
        🔒 {lockedLabel}
      </div>
    </div>
  );
}
