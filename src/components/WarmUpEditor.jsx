import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../i18n/index.jsx';
import { useOverrides } from '../hooks/useOverrides.jsx';
import {
  videoKey,
  putVideo,
  deleteVideo,
  formatBytes,
} from '../utils/videoStorage.js';
import { parseYouTubeId, fetchYouTubeOembed } from '../utils/youtube.js';

const LARGE_FILE_THRESHOLD = 100 * 1024 * 1024;

// Slim editor for the warm-up tile. Single video, no variants — same
// "YouTube link OR local file" choice as the exercise editor.
//
// `workoutType` is the WARMUPS key (`push` / `pull` / `leg`) and doubles
// as the IndexedDB key suffix.
export default function WarmUpEditor({ open, onClose, workoutType, label }) {
  const { t } = useLang();
  const { overrides, setOverride, clearOverride } = useOverrides();
  const ov = overrides.warmup?.[workoutType] || {};

  const [youtubeInput, setYoutubeInput] = useState('');
  const [youtubeError, setYoutubeError] = useState('');
  const [localMeta, setLocalMeta] = useState(null);
  const [oembed, setOembed] = useState(null);
  const [loadingOembed, setLoadingOembed] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    setYoutubeInput(ov.youtubeId || '');
    setLocalMeta(ov.localVideo || null);
    setYoutubeError('');
    setOembed(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, workoutType]);

  // Live-verify whatever YouTube ID the user typed in (or the stored
  // override) so they get the "✓ Title · Author" confirmation under the
  // input. Skip when a local upload is active — the YouTube field gets
  // hidden in that case.
  useEffect(() => {
    let cancelled = false;
    setOembed(null);
    if (localMeta) return;
    const id = parseYouTubeId(youtubeInput) || ov.youtubeId;
    if (!id) return;
    setLoadingOembed(true);
    fetchYouTubeOembed(id).then((data) => {
      if (cancelled) return;
      setLoadingOembed(false);
      setOembed(data);
    });
    return () => {
      cancelled = true;
    };
  }, [youtubeInput, !!localMeta, ov.youtubeId]);

  const save = () => {
    const raw = youtubeInput.trim();
    if (raw && !localMeta) {
      const id = parseYouTubeId(raw);
      if (!id) {
        setYoutubeError(t('edit.exercise.youtubeInvalid'));
        return;
      }
      setOverride('warmup', workoutType, 'youtubeId', id);
    } else {
      clearOverride('warmup', workoutType, 'youtubeId');
    }
    if (localMeta) {
      setOverride('warmup', workoutType, 'localVideo', localMeta);
    } else {
      clearOverride('warmup', workoutType, 'localVideo');
    }
    onClose();
  };

  const reset = () => {
    setYoutubeInput('');
    setYoutubeError('');
    if (localMeta) {
      deleteVideo(videoKey('warmup', workoutType, 'main'));
      setLocalMeta(null);
    }
  };

  const handleUpload = async (file) => {
    if (!file) return;
    if (file.size > LARGE_FILE_THRESHOLD) {
      const proceed = window.confirm(
        `${file.name} is ${formatBytes(file.size)}. Continue?`,
      );
      if (!proceed) return;
    }
    try {
      await putVideo(videoKey('warmup', workoutType, 'main'), file);
      setLocalMeta({
        filename: file.name,
        size: file.size,
        type: file.type,
        mtime: file.lastModified || 0,
      });
      setYoutubeInput('');
      setYoutubeError('');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Warm-up local upload failed:', err);
      setYoutubeError('Could not save the video to local storage');
    }
  };

  const hasOverride = !!ov.youtubeId || !!ov.localVideo || !!localMeta || youtubeInput.trim();

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
                {t('edit.warmup.title')}
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
                {label || t('warm.title')}
              </div>
              <div className="text-[12px] text-ink-400 dark:text-ink-200 leading-relaxed">
                {t('edit.warmup.help')}
              </div>

              <div className="rounded-2xl bg-bone-100 dark:bg-ink-800 border border-black/5 dark:border-white/5 p-3">
                <div className="text-[11px] uppercase tracking-wider mb-1.5 flex justify-between items-center">
                  <span className="text-ink-500 dark:text-ink-100 font-medium">
                    {t('edit.warmup.video')}
                  </span>
                  {hasOverride && (
                    <button
                      onClick={reset}
                      className="text-[10px] text-priority-extreme normal-case tracking-normal"
                    >
                      ↺ {t('edit.reset')}
                    </button>
                  )}
                </div>

                {localMeta ? (
                  <>
                    <div className="rounded-xl bg-priority-moderate/10 border border-priority-moderate/30 px-3 py-2 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-[10px] uppercase tracking-wider text-priority-moderate font-medium">
                          ● {t('edit.exercise.localActive')}
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
                      ⓘ {t('edit.exercise.localWarning')}
                    </div>
                  </>
                ) : (
                  <>
                    <input
                      value={youtubeInput}
                      onChange={(e) => {
                        setYoutubeInput(e.target.value);
                        setYoutubeError('');
                      }}
                      placeholder={t('edit.exercise.youtubePlaceholder')}
                      className="w-full bg-white dark:bg-ink-700 rounded-xl px-3 py-2 text-[13px] text-ink-900 dark:text-bone-100 placeholder:text-ink-300 outline-none border border-transparent focus:border-ink-900 dark:focus:border-bone-100"
                    />
                    <div className="mt-1.5 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-100 border border-black/10 dark:border-white/10 rounded-full px-2.5 py-1 active:scale-[0.97]"
                      >
                        📁 {t('edit.exercise.uploadLocal')}
                      </button>
                      {!youtubeError && oembed && (
                        <div className="text-[10px] text-ink-400 dark:text-ink-200 leading-snug truncate text-right">
                          <span className="text-priority-moderate">✓</span>{' '}
                          <span>{oembed.title}</span>
                          <span className="opacity-60">
                            {' '}· {oembed.author_name}
                          </span>
                        </div>
                      )}
                      {!youtubeError && !oembed && loadingOembed && (
                        <div className="text-[10px] text-ink-300">…</div>
                      )}
                    </div>
                  </>
                )}

                {youtubeError && (
                  <div className="text-[11px] text-priority-extreme mt-1.5">
                    {youtubeError}
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUpload(file);
                    e.target.value = '';
                  }}
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
