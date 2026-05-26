import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useT } from '../i18n/index.jsx';

export default function WarmUpSection({ workoutType, warmup, done, onMarkDone }) {
  const t = useT();
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);

  const subKey = {
    push: 'warm.subPush',
    pull: 'warm.subPull',
    leg: 'warm.subLeg',
  }[workoutType] || 'warm.subPush';

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

  return (
    <section className="px-5 pt-2">
      <div className="text-[11px] uppercase tracking-[0.18em] text-ink-300 dark:text-ink-300 mb-2 flex items-center justify-between">
        <span>{t('warm.title')}</span>
        {done && (
          <span className="text-priority-moderate text-[10px] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-priority-moderate" />
            {t('warm.done')}
          </span>
        )}
      </div>

      <motion.div
        layout
        className={`rounded-3xl overflow-hidden border bg-white dark:bg-ink-800 shadow-card dark:shadow-cardDark transition-all
          ${done ? 'border-priority-moderate/30' : 'border-black/5 dark:border-white/5'}`}
      >
        <div className="relative aspect-[3/4] bg-ink-900 overflow-hidden">
          <video
            ref={videoRef}
            src={warmup.video}
            playsInline
            preload="metadata"
            controls={false}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => { setPlaying(false); setEnded(true); }}
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
                    <path d="M3 12a9 9 0 1 0 3-6.7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3 4v5h5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
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

        <div className="p-4 space-y-3">
          <div className="text-[13px] text-ink-700 dark:text-bone-100 leading-relaxed">
            {t(subKey)}
          </div>
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
        </div>
      </motion.div>
    </section>
  );
}
