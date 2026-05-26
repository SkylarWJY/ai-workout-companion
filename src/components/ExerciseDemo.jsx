import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { demoVariants, demoUrlsForSlug } from '../data/demoMap.js';
import { useT } from '../i18n/index.jsx';

export default function ExerciseDemo({ exerciseId, name, intervalMs = 900 }) {
  const t = useT();
  const variants = useMemo(() => demoVariants(exerciseId), [exerciseId]);
  const [variantIdx, setVariantIdx] = useState(0);
  const variant = variants[variantIdx];
  const urls = useMemo(
    () => (variant ? demoUrlsForSlug(variant.slug) : null),
    [variant],
  );

  const [frame, setFrame] = useState(0);
  const [loaded, setLoaded] = useState([false, false]);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    setLoaded([false, false]);
    setErrored(false);
    setFrame(0);
    if (!urls) return;
    let alive = true;
    urls.forEach((u, i) => {
      const img = new Image();
      img.onload = () => alive && setLoaded((l) => updateAt(l, i, true));
      img.onerror = () => alive && setErrored(true);
      img.src = u;
    });
    return () => {
      alive = false;
    };
  }, [urls?.[0], urls?.[1]]);

  useEffect(() => {
    if (!urls || errored) return;
    const id = setInterval(() => setFrame((f) => 1 - f), intervalMs);
    return () => clearInterval(id);
  }, [urls?.[0], errored, intervalMs]);

  if (!variant) return <FallbackDemo name={name} unavailableLabel={t('demo.unavailable')} />;
  if (errored) return <FallbackDemo name={name} unavailableLabel={t('demo.unavailable')} />;

  const ready = loaded[0] && loaded[1];

  return (
    <div className="space-y-2">
      {variants.length > 1 && (
        <div className="flex items-center gap-1 overflow-x-auto scroll-clean -mx-1 px-1">
          {variants.map((v, i) => (
            <button
              key={v.key + i}
              onClick={() => setVariantIdx(i)}
              className={`shrink-0 text-[11px] font-medium uppercase tracking-wider rounded-full px-3 py-1.5 border transition active:scale-[0.97]
                ${
                  i === variantIdx
                    ? 'bg-ink-900 dark:bg-bone-100 text-bone-50 dark:text-ink-900 border-transparent'
                    : 'bg-transparent text-ink-500 dark:text-ink-100 border-black/10 dark:border-white/10'
                }`}
            >
              {t(`variant.${v.key}`)}
            </button>
          ))}
        </div>
      )}

      <div className="relative aspect-video rounded-3xl bg-bone-200 dark:bg-ink-700 border border-black/5 dark:border-white/5 overflow-hidden">
        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center text-ink-300 text-[11px] uppercase tracking-wider">
            {t('demo.loading')}
          </div>
        )}
        <AnimatePresence initial={false}>
          <motion.img
            key={`${variantIdx}-${frame}`}
            src={urls[frame]}
            alt={name}
            initial={{ opacity: 0 }}
            animate={{ opacity: ready ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0 w-full h-full object-contain bg-white"
          />
        </AnimatePresence>
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-wider bg-ink-900/70 text-bone-50 backdrop-blur-md rounded-full px-2 py-0.5">
            {t('demo.live')}{' · '}{t(`variant.${variant.key}`)}
          </span>
          <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider bg-white/70 dark:bg-ink-900/70 backdrop-blur-md rounded-full px-2 py-0.5 text-ink-700 dark:text-bone-100">
            <span className={`w-1.5 h-1.5 rounded-full transition ${frame === 0 ? 'bg-priority-extreme' : 'bg-ink-200'}`} />
            <span className={`w-1.5 h-1.5 rounded-full transition ${frame === 1 ? 'bg-priority-extreme' : 'bg-ink-200'}`} />
          </span>
        </div>
      </div>
    </div>
  );
}

function FallbackDemo({ name, unavailableLabel }) {
  return (
    <div className="aspect-video rounded-3xl bg-gradient-to-br from-bone-200 to-bone-100 dark:from-ink-700 dark:to-ink-800 border border-black/5 dark:border-white/5 flex flex-col items-center justify-center text-ink-300 dark:text-ink-300">
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.6" />
        <path d="M10 8l6 4-6 4V8z" fill="currentColor" />
      </svg>
      <div className="mt-2 text-[11px] uppercase tracking-wider">{name}</div>
      <div className="text-[10px] mt-0.5 opacity-70">{unavailableLabel}</div>
    </div>
  );
}

function updateAt(arr, i, val) {
  const next = [...arr];
  next[i] = val;
  return next;
}
