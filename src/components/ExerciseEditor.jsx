import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../i18n/index.jsx';
import { useOverrides } from '../hooks/useOverrides.jsx';
import { demoVariants } from '../data/demoMap.js';
import { resolveMeta } from '../data/exerciseMeta.js';
import { variantLabel } from './VariantBadge.jsx';
import {
  videoKey,
  putVideo,
  deleteVideo,
  formatBytes,
} from '../utils/videoStorage.js';
import { parseYouTubeId, fetchYouTubeOembed as fetchOembed } from '../utils/youtube.js';

// Files bigger than this trigger a confirmation prompt. iOS PWAs have
// real quotas (~1 GB total) and a 100-MB video is a lot.
const LARGE_FILE_THRESHOLD = 100 * 1024 * 1024;

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
  // Per-variant local-video metadata (filename + size + type), keyed by
  // variant.key. The actual Blob lives in IndexedDB; this map is what
  // gets serialized into the overrides doc.
  const [localByVariant, setLocalByVariant] = useState({});

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
    setLocalByVariant({ ...(ov.localVideoByVariant || {}) });
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

    // Local-video metadata — the actual blobs are already in IndexedDB
    // (written by handleLocalUpload below) and stay there. We just persist
    // the catalog of "which variants have a local upload, with what name
    // and size".
    if (Object.keys(localByVariant).length > 0) {
      setOverride(
        'exercise',
        exercise.id,
        'localVideoByVariant',
        localByVariant,
      );
    } else {
      clearOverride('exercise', exercise.id, 'localVideoByVariant');
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
    // If there's a local upload for this variant, delete it from IndexedDB
    // and clear the metadata. Best Picks aren't editable so this is safe.
    if (localByVariant[variantKey]) {
      deleteVideo(videoKey('exercise', exercise.id, variantKey));
      setLocalByVariant((prev) => {
        const copy = { ...prev };
        delete copy[variantKey];
        return copy;
      });
    }
  };

  // File picker handler — writes the chosen Blob into IndexedDB under a
  // key built from the exercise + variant, then stages the metadata
  // (filename / size / type) in local state for save().
  const handleLocalUpload = async (variantKey, file) => {
    if (!file) return;
    if (file.size > LARGE_FILE_THRESHOLD) {
      const proceed = window.confirm(
        `${file.name} is ${formatBytes(file.size)}. ` +
          `Large videos may eat your device storage quota. Continue?`,
      );
      if (!proceed) return;
    }
    try {
      await putVideo(videoKey('exercise', exercise.id, variantKey), file);
      setLocalByVariant((prev) => ({
        ...prev,
        [variantKey]: {
          filename: file.name,
          size: file.size,
          type: file.type,
          mtime: file.lastModified || 0,
        },
      }));
      // Clear any YouTube override on the same variant — locals win, so
      // keeping a YouTube ID around would just be misleading.
      setVideoByVariant((prev) => ({ ...prev, [variantKey]: '' }));
      setVideoErrors((prev) => {
        const copy = { ...prev };
        delete copy[variantKey];
        return copy;
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Local video write failed:', err);
      setVideoErrors((prev) => ({
        ...prev,
        [variantKey]: 'Could not save the video to local storage',
      }));
    }
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
                    const local = localByVariant[v.key] || null;
                    const hasAnyOverride =
                      storedOverride != null || local != null;
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
                        hasOverride={hasAnyOverride}
                        onReset={() => resetVariantVideo(v.key)}
                        resetLabel={t('edit.reset')}
                        error={videoErrors[v.key]}
                        effectiveVideoId={effectiveId}
                        placeholder={t('edit.exercise.youtubePlaceholder')}
                        localMeta={local}
                        onLocalUpload={(file) =>
                          handleLocalUpload(v.key, file)
                        }
                        uploadLabel={t('edit.exercise.uploadLocal')}
                        localActiveLabel={t('edit.exercise.localActive')}
                        localStorageWarning={t('edit.exercise.localWarning')}
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

// Row for one editable variant. Two input modes coexist:
//   1. YouTube link / ID  (verified live via oembed)
//   2. Local file upload  (Blob written to IndexedDB; metadata staged here)
// Locals win over YouTube — when one is set, the YouTube input is hidden.
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
  localMeta,
  onLocalUpload,
  uploadLabel,
  localActiveLabel,
  localStorageWarning,
}) {
  const [oembed, setOembed] = useState(null);
  const [loadingOembed, setLoadingOembed] = useState(false);
  const fileInputRef = useRef(null);

  // Skip oembed when there's a local upload — its YouTube ID is moot.
  useEffect(() => {
    let cancelled = false;
    setOembed(null);
    if (!effectiveVideoId || localMeta) return;
    setLoadingOembed(true);
    fetchOembed(effectiveVideoId).then((data) => {
      if (cancelled) return;
      setLoadingOembed(false);
      setOembed(data);
    });
    return () => {
      cancelled = true;
    };
  }, [effectiveVideoId, !!localMeta]);

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

      {localMeta ? (
        // Local-upload active — show filename + size + storage warning,
        // plus an "Upload different" button to swap.
        <>
          <div className="rounded-xl bg-priority-moderate/10 border border-priority-moderate/30 px-3 py-2 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-wider text-priority-moderate font-medium">
                ● {localActiveLabel}
              </div>
              <div className="text-[12px] text-ink-700 dark:text-bone-100 leading-snug truncate">
                {localMeta.filename}
              </div>
              <div className="text-[10px] text-ink-400 dark:text-ink-200 tabular">
                {formatBytes(localMeta.size)}
              </div>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="shrink-0 text-[10px] uppercase tracking-wider text-ink-700 dark:text-bone-100 border border-black/10 dark:border-white/10 rounded-full px-2.5 py-1 active:scale-[0.97]"
            >
              ⇄
            </button>
          </div>
          <div className="text-[10px] text-ink-400 dark:text-ink-200 mt-1.5 leading-snug">
            ⓘ {localStorageWarning}
          </div>
        </>
      ) : (
        <>
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-white dark:bg-ink-700 rounded-xl px-3 py-2 text-[13px] text-ink-900 dark:text-bone-100 placeholder:text-ink-300 outline-none border border-transparent focus:border-ink-900 dark:focus:border-bone-100"
          />
          <div className="mt-1.5 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-100 border border-black/10 dark:border-white/10 rounded-full px-2.5 py-1 active:scale-[0.97]"
            >
              📁 {uploadLabel}
            </button>
            {!error && oembed && (
              <div className="text-[10px] text-ink-400 dark:text-ink-200 leading-snug truncate text-right">
                <span className="text-priority-moderate">✓</span>{' '}
                <span>{oembed.title}</span>
                <span className="opacity-60"> · {oembed.author_name}</span>
              </div>
            )}
            {!error && !oembed && loadingOembed && (
              <div className="text-[10px] text-ink-300">…</div>
            )}
          </div>
        </>
      )}

      {error && (
        <div className="text-[11px] text-priority-extreme mt-1.5">{error}</div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onLocalUpload(file);
          e.target.value = ''; // allow re-picking the same file
        }}
      />
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
