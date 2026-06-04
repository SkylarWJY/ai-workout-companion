import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { demoVariants } from '../data/demoMap.js';
import { resolveMeta } from '../data/exerciseMeta.js';
import { useLang } from '../i18n/index.jsx';
import { variantLabel } from './VariantBadge.jsx';
import { videoKey, getVideoObjectUrl } from '../utils/videoStorage.js';

// YouTube-only demo (start/end image animation removed in v0.4).
// If multiple variants exist with different youtubeIds, shows a segmented
// control so the user can flip between them.
export default function ExerciseDemo({
  exerciseId,
  name,
  variantIdx: controlledIdx,
  onVariantChange,
  overrideYoutubeId,
  overrideYoutubeIdByVariant,
  overrideLocalVideoByVariant,
}) {
  const { t, lang } = useLang();
  const variants = useMemo(() => demoVariants(exerciseId), [exerciseId]);
  const [localIdx, setLocalIdx] = useState(0);
  const variantIdx = controlledIdx ?? localIdx;
  const setVariantIdx = (i) => {
    if (onVariantChange) onVariantChange(i);
    else setLocalIdx(i);
  };

  const variant = variants[variantIdx];
  const meta = resolveMeta(exerciseId, variant);
  // Resolve which video to play, in priority order:
  //   0. Per-variant LOCAL upload                         (`localVideoByVariant[key]`) — wins over everything
  //   1. Per-variant YouTube override                     (`youtubeIdByVariant[key]`)
  //   2. Legacy exercise-level YouTube override           (`youtubeId`, pre-v0.6)
  //      — only applies to the FIRST variant so it doesn't
  //        clobber distinct machine / barbell tutorials
  //   3. Variant-specific YouTube from demoMap.js
  //   4. Base meta YouTube from exerciseMeta.js
  const variantKey = variant?.key;
  const hasLocalUpload = variantKey
    ? !!overrideLocalVideoByVariant?.[variantKey]
    : false;
  const perVariantOverride = variantKey
    ? overrideYoutubeIdByVariant?.[variantKey]
    : null;
  const legacyOverride = variantIdx === 0 ? overrideYoutubeId : null;
  const videoId = perVariantOverride || legacyOverride || meta?.youtubeId;

  // For locally-uploaded videos, fetch the IndexedDB Blob and convert to
  // an object URL. Re-runs when the variant changes; revokes the previous
  // URL on cleanup so we don't leak blob memory across tab switches.
  const [localVideoUrl, setLocalVideoUrl] = useState(null);
  useEffect(() => {
    if (!hasLocalUpload) {
      setLocalVideoUrl(null);
      return;
    }
    let cancelled = false;
    let createdUrl = null;
    getVideoObjectUrl(videoKey('exercise', exerciseId, variantKey)).then((url) => {
      if (cancelled) {
        if (url) URL.revokeObjectURL(url);
        return;
      }
      createdUrl = url;
      setLocalVideoUrl(url);
    });
    return () => {
      cancelled = true;
      if (createdUrl) URL.revokeObjectURL(createdUrl);
      setLocalVideoUrl(null);
    };
  }, [hasLocalUpload, exerciseId, variantKey]);

  // de-dupe: only show variant tabs if at least one variant has its own
  // distinct video (otherwise switching does nothing visible).
  const distinctVariants = useMemo(() => {
    if (variants.length <= 1) return [];
    const ids = variants.map((v) =>
      resolveMeta(exerciseId, v).youtubeId ?? '_default',
    );
    return new Set(ids).size > 1 ? variants : [];
  }, [variants, exerciseId]);

  const [loaded, setLoaded] = useState(false);

  // reset playback state when variant changes
  useEffect(() => {
    setLoaded(false);
  }, [videoId]);

  // If the active variant has a local upload but the blob URL hasn't
  // resolved yet, show a soft loading state instead of falling through.
  if (hasLocalUpload && !localVideoUrl) {
    return (
      <FallbackDemo name={name} label={t('demo.localLoading') || 'Loading local video…'} />
    );
  }
  if (!hasLocalUpload && !videoId) {
    return <FallbackDemo name={name} label={t('demo.unavailable')} />;
  }

  const thumb = videoId
    ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
    : null;
  const embedSrc = videoId
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1&rel=0&modestbranding=1`
    : null;
  const watchUrl = videoId
    ? `https://www.youtube.com/shorts/${videoId}`
    : null;

  return (
    <div className="space-y-2">
      {distinctVariants.length > 0 && (
        <div className="flex items-center gap-1 overflow-x-auto scroll-clean -mx-1 px-1 pb-1">
          {variants.map((v, i) => {
            const isBest = v.isBestPick;
            const isSelected = i === variantIdx;
            // Best-pick tabs use the orange `priority-veryhigh` accent
            // (selected = solid orange, unselected = orange outline + text)
            // so the user can spot the editorial recommendation at a glance.
            const palette = isBest
              ? isSelected
                ? 'bg-priority-veryhigh text-bone-50 border-transparent'
                : 'bg-transparent text-priority-veryhigh border-priority-veryhigh/40'
              : isSelected
                ? 'bg-ink-900 dark:bg-bone-100 text-bone-50 dark:text-ink-900 border-transparent'
                : 'bg-transparent text-ink-500 dark:text-ink-100 border-black/10 dark:border-white/10';
            return (
              <button
                key={v.key + i}
                onClick={() => setVariantIdx(i)}
                className={`shrink-0 inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-wider rounded-full px-3 py-1.5 border transition active:scale-[0.97] ${palette}`}
              >
                {isBest && <span aria-hidden="true">★</span>}
                {variantLabel(v, t, lang)}
              </button>
            );
          })}
        </div>
      )}

      <div className="relative aspect-[9/16] max-h-[520px] mx-auto rounded-3xl overflow-hidden bg-ink-900 border border-black/5 dark:border-white/5">
        <AnimatePresence initial={false}>
          <motion.div
            key={localVideoUrl || videoId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0"
          >
            {localVideoUrl ? (
              <video
                src={localVideoUrl}
                controls
                playsInline
                preload="metadata"
                className="absolute inset-0 w-full h-full object-cover bg-ink-900"
              />
            ) : loaded ? (
              <iframe
                src={embedSrc}
                title={name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            ) : (
              <button
                onClick={() => setLoaded(true)}
                className="absolute inset-0 w-full h-full group"
                aria-label={t('tutorial.watch')}
              >
                <img
                  src={thumb}
                  alt={name}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-ink-900/60 via-transparent to-ink-900/20 group-active:from-ink-900/80 transition" />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="w-16 h-16 rounded-full bg-white/95 text-ink-900 flex items-center justify-center shadow-card">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7L8 5z" />
                    </svg>
                  </span>
                </span>
              </button>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none z-10">
          <span
            className={`text-[10px] uppercase tracking-wider text-bone-50 backdrop-blur-md rounded-full px-2 py-0.5 ${
              localVideoUrl
                ? 'bg-priority-moderate/90'
                : 'bg-priority-extreme/90'
            }`}
          >
            {localVideoUrl ? 'My Video' : 'YouTube Shorts'}
          </span>
          {variant?.key && (
            <span
              className={`text-[10px] uppercase tracking-wider backdrop-blur-md text-bone-50 rounded-full px-2 py-0.5 inline-flex items-center gap-1 ${
                variant.isBestPick
                  ? 'bg-priority-veryhigh/80'
                  : 'bg-ink-900/60'
              }`}
            >
              {variant.isBestPick && <span aria-hidden="true">★</span>}
              {variantLabel(variant, t, lang)}
            </span>
          )}
        </div>

        {watchUrl && !localVideoUrl && (
          <a
            href={watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-2 right-2 text-[10px] uppercase tracking-wider bg-white/85 dark:bg-ink-900/85 backdrop-blur-md rounded-full px-2 py-0.5 text-ink-700 dark:text-bone-100 z-10"
          >
            {t('tutorial.openYouTube')} ↗
          </a>
        )}
      </div>
    </div>
  );
}

function FallbackDemo({ name, label }) {
  return (
    <div className="aspect-video rounded-3xl bg-gradient-to-br from-bone-200 to-bone-100 dark:from-ink-700 dark:to-ink-800 border border-black/5 dark:border-white/5 flex flex-col items-center justify-center text-ink-300 dark:text-ink-300">
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.6" />
        <path d="M10 8l6 4-6 4V8z" fill="currentColor" />
      </svg>
      <div className="mt-2 text-[11px] uppercase tracking-wider">{name}</div>
      <div className="text-[10px] mt-0.5 opacity-70">{label}</div>
    </div>
  );
}
