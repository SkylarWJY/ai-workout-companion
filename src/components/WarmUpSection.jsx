import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useT } from '../i18n/index.jsx';
import YouTubeEmbed from './YouTubeEmbed.jsx';
import WarmUpEditor from './WarmUpEditor.jsx';
import { useOverrides } from '../hooks/useOverrides.jsx';
import { videoKey, getVideoObjectUrl } from '../utils/videoStorage.js';

// Resolution priority for the warm-up player:
//   1. Local upload override          (`overrides.warmup.{day}.localVideo`)
//   2. YouTube link override          (`overrides.warmup.{day}.youtubeId`)
//   3. The bundled MOV from `warmup.video` (default)
//
// The "alt YouTube watch" link below the player stays as the static
// `warmup.altYoutubeId` — it's an editorial recommendation, not a
// user-editable slot.
export default function WarmUpSection({ workoutType, warmup, done, onMarkDone }) {
  const t = useT();
  const { overrides } = useOverrides();
  const ov = overrides.warmup?.[workoutType] || {};

  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [showAlt, setShowAlt] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);

  // Fetch the local video blob (if any) as an object URL whenever the
  // override flips on/off or the workout day changes.
  const hasLocalOverride = !!ov.localVideo;
  const [localVideoUrl, setLocalVideoUrl] = useState(null);
  useEffect(() => {
    if (!hasLocalOverride) {
      setLocalVideoUrl(null);
      return;
    }
    let cancelled = false;
    let createdUrl = null;
    getVideoObjectUrl(videoKey('warmup', workoutType, 'main')).then((url) => {
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
  }, [hasLocalOverride, workoutType]);

  const youtubeOverride = ov.youtubeId || null;
  // The video URL to feed into <video src=...>. Locals win, else the
  // bundled MOV. (If only the YouTube override is set we render an
  // iframe below, not a <video>, so this path returns the default MOV.)
  const effectiveVideoSrc = localVideoUrl || warmup.video;
  // Reset transport state whenever the source changes so the play/pause
  // chrome doesn't lie after a swap.
  useEffect(() => {
    setPlaying(false);
    setEnded(false);
  }, [effectiveVideoSrc, youtubeOverride]);

  const subKey =
    { push: 'warm.subPush', pull: 'warm.subPull', leg: 'warm.subLeg' }[
      workoutType
    ] || 'warm.subPush';

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
      setEnded(false);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  const replay = () => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.play();
    setPlaying(true);
    setEnded(false);
  };

  // Renders the main player tile. Three modes:
  //   - YouTube override → iframe (no transport buttons; YouTube has its own)
  //   - Local override OR default MOV → <video> with our play/pause overlay
  const playerTile = youtubeOverride && !localVideoUrl ? (
    <div className="relative aspect-[3/4] bg-ink-900 overflow-hidden">
      <iframe
        src={`https://www.youtube.com/embed/${youtubeOverride}?playsinline=1&rel=0&modestbranding=1`}
        title={t('warm.title')}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    </div>
  ) : (
    <div className="relative aspect-[3/4] bg-ink-900 overflow-hidden">
      <video
        ref={videoRef}
        key={effectiveVideoSrc}
        src={effectiveVideoSrc}
        poster={localVideoUrl ? undefined : warmup.poster}
        playsInline
        preload="metadata"
        controls={false}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setEnded(true);
        }}
        className="absolute inset-0 w-full h-full object-cover"
      />
      {!playing && (
        <button
          onClick={ended ? replay : toggle}
          className="absolute inset-0 flex items-center justify-center bg-ink-900/30 active:bg-ink-900/40 transition"
          aria-label={t('warm.play')}
        >
          <span className="w-16 h-16 rounded-full bg-white/95 text-ink-900 flex items-center justify-center shadow-card">
            {ended ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 12a9 9 0 1 0 3-6.7"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3 4v5h5"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7L8 5z" />
              </svg>
            )}
          </span>
        </button>
      )}
      {playing && (
        <button
          onClick={toggle}
          aria-label={t('warm.pause')}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-ink-900/60 backdrop-blur-md text-bone-50 flex items-center justify-center"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </svg>
        </button>
      )}
    </div>
  );

  return (
    <section className="px-5 pt-2">
      <div className="text-[11px] uppercase tracking-[0.18em] text-ink-300 dark:text-ink-300 mb-2 flex items-center justify-between">
        <span>{t('warm.title')}</span>
        <div className="flex items-center gap-3">
          {done && (
            <span className="text-priority-moderate text-[10px] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-priority-moderate" />
              {t('warm.done')}
            </span>
          )}
          <button
            onClick={() => setEditorOpen(true)}
            aria-label={t('edit.button')}
            className="text-ink-400 dark:text-ink-200 active:scale-[0.95] transition"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 20h9M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <motion.div
        layout
        className={`rounded-3xl overflow-hidden border bg-white dark:bg-ink-800 shadow-card dark:shadow-cardDark transition-all
          ${done ? 'border-priority-moderate/30' : 'border-black/5 dark:border-white/5'}`}
      >
        {playerTile}

        <div className="p-4 space-y-3">
          <div className="text-[13px] text-ink-700 dark:text-bone-100 leading-relaxed">
            {t(subKey)}
          </div>
          {/* Hide our transport when YouTube iframe owns playback. */}
          {!(youtubeOverride && !localVideoUrl) && (
            <div className="flex gap-2">
              <button
                onClick={ended ? replay : toggle}
                className="flex-1 py-3 rounded-2xl border border-black/10 dark:border-white/10 text-[12px] uppercase tracking-wider font-medium text-ink-700 dark:text-bone-100 active:scale-[0.98]"
              >
                {ended ? t('warm.replay') : playing ? t('warm.pause') : t('warm.play')}
              </button>
              <button
                onClick={onMarkDone}
                className={`flex-[1.4] py-3 rounded-2xl text-[12px] uppercase tracking-wider font-semibold active:scale-[0.98] transition
                  ${
                    done
                      ? 'bg-priority-moderate/15 text-priority-moderate border border-priority-moderate/30'
                      : 'bg-ink-900 dark:bg-bone-100 text-bone-50 dark:text-ink-900 border border-transparent'
                  }`}
              >
                {done ? t('warm.done') : t('warm.markDone')}
              </button>
            </div>
          )}
          {/* For the YouTube override, the only chrome we keep is the
              "mark done" button — YouTube handles play/pause itself. */}
          {youtubeOverride && !localVideoUrl && (
            <button
              onClick={onMarkDone}
              className={`w-full py-3 rounded-2xl text-[12px] uppercase tracking-wider font-semibold active:scale-[0.98] transition
                ${
                  done
                    ? 'bg-priority-moderate/15 text-priority-moderate border border-priority-moderate/30'
                    : 'bg-ink-900 dark:bg-bone-100 text-bone-50 dark:text-ink-900 border border-transparent'
                }`}
            >
              {done ? t('warm.done') : t('warm.markDone')}
            </button>
          )}

          {warmup.altYoutubeId && (
            <button
              onClick={() => setShowAlt((v) => !v)}
              className="w-full text-[11px] uppercase tracking-wider text-ink-300 hover:text-ink-700 dark:hover:text-bone-100 pt-1"
            >
              {showAlt ? '↑' : '↓'} {t('warm.altWatch')}
            </button>
          )}
        </div>

        <AnimatePresence>
          {showAlt && warmup.altYoutubeId && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden border-t border-black/5 dark:border-white/5"
            >
              <div className="p-4">
                <YouTubeEmbed videoId={warmup.altYoutubeId} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <WarmUpEditor
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        workoutType={workoutType}
        label={t('warm.title')}
      />
    </section>
  );
}
