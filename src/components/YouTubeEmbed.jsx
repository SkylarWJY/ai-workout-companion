import React, { useState } from 'react';
import { useT } from '../i18n/index.jsx';

// YouTube Shorts embed. Lazy-loads (only mounts iframe when user taps play
// poster) so a workout day with 6 exercises doesn't blow through 6 iframes
// at once.
export default function YouTubeEmbed({ videoId }) {
  const t = useT();
  const [loaded, setLoaded] = useState(false);

  if (!videoId) return null;

  const thumb = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  const embedSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1&rel=0&modestbranding=1`;
  const watchUrl = `https://www.youtube.com/shorts/${videoId}`;

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <span className="text-[11px] uppercase tracking-[0.18em] text-ink-300">
          {t('tutorial.label')}
        </span>
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] uppercase tracking-wider text-ink-400 dark:text-ink-200 hover:text-ink-700 dark:hover:text-bone-100"
        >
          {t('tutorial.openYouTube')} ↗
        </a>
      </div>

      <div className="relative aspect-[9/16] max-h-[480px] mx-auto rounded-3xl overflow-hidden bg-ink-900 border border-black/5 dark:border-white/5">
        {loaded ? (
          <iframe
            src={embedSrc}
            title="YouTube Shorts tutorial"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <button
            onClick={() => setLoaded(true)}
            className="absolute inset-0 w-full h-full block group"
            aria-label={t('tutorial.watch')}
          >
            <img
              src={thumb}
              alt=""
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <span className="absolute inset-0 bg-ink-900/30 group-active:bg-ink-900/50 transition flex items-center justify-center">
              <span className="w-16 h-16 rounded-full bg-white/95 text-ink-900 flex items-center justify-center shadow-card">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7L8 5z" />
                </svg>
              </span>
            </span>
            <span className="absolute top-2 left-2 text-[10px] uppercase tracking-wider bg-priority-extreme/90 text-bone-50 backdrop-blur-md rounded-full px-2 py-0.5">
              YouTube Shorts
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
