import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang, locStretch } from '../i18n/index.jsx';
import { COOLDOWN_HOLD_SECS } from '../data/warmCoolData.js';
import { fmtTime } from '../utils/format.js';

export default function CoolDownSection({ stretches, done, onDone }) {
  const { t, lang } = useLang();
  const [active, setActive] = useState(false);
  const [idx, setIdx] = useState(0);
  const [remaining, setRemaining] = useState(COOLDOWN_HOLD_SECS);
  const [running, setRunning] = useState(false);
  const endRef = useRef(0);
  const tickRef = useRef(null);

  const total = stretches.length;
  const current = stretches[idx];
  const lastOne = idx === total - 1;

  const clearTick = () => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
  };

  const startInterval = (seconds) => {
    clearTick();
    endRef.current = Date.now() + seconds * 1000;
    setRunning(true);
    tickRef.current = setInterval(() => {
      const left = Math.max(0, Math.round((endRef.current - Date.now()) / 1000));
      setRemaining(left);
      if (left <= 0) {
        clearTick();
        setRunning(false);
        if (navigator.vibrate) navigator.vibrate([60, 40, 60]);
      }
    }, 200);
  };

  const beginCool = () => {
    setActive(true);
    setIdx(0);
    setRemaining(COOLDOWN_HOLD_SECS);
    startInterval(COOLDOWN_HOLD_SECS);
  };

  const next = () => {
    if (lastOne) {
      clearTick();
      setRunning(false);
      setActive(false);
      onDone?.();
      return;
    }
    setIdx((i) => i + 1);
    setRemaining(COOLDOWN_HOLD_SECS);
    startInterval(COOLDOWN_HOLD_SECS);
  };

  const restart = () => {
    setRemaining(COOLDOWN_HOLD_SECS);
    startInterval(COOLDOWN_HOLD_SECS);
  };

  useEffect(() => () => clearTick(), []);

  return (
    <section className="px-5 pt-6">
      <div className="text-[11px] uppercase tracking-[0.18em] text-ink-300 dark:text-ink-300 mb-2 flex items-center justify-between">
        <span>{t('cool.title')}</span>
        {done && (
          <span className="text-priority-moderate text-[10px] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-priority-moderate" />
            {t('cool.done')}
          </span>
        )}
      </div>

      {!active ? (
        <CollapsedView
          stretches={stretches}
          done={done}
          onStart={beginCool}
          sub={t('cool.sub')}
          startLabel={t('cool.start')}
          holdLabel={t('cool.holdEach')}
          lang={lang}
          targetLabel={t('cool.target')}
        />
      ) : (
        <ActiveView
          current={current}
          idx={idx}
          total={total}
          remaining={remaining}
          running={running}
          onNext={next}
          onRestart={restart}
          lastOne={lastOne}
          t={t}
          lang={lang}
        />
      )}
    </section>
  );
}

function CollapsedView({ stretches, done, onStart, sub, startLabel, holdLabel, lang, targetLabel }) {
  return (
    <motion.div
      layout
      className={`rounded-3xl bg-white dark:bg-ink-800 border shadow-card dark:shadow-cardDark p-4 space-y-3 transition
        ${done ? 'border-priority-moderate/30' : 'border-black/5 dark:border-white/5'}`}
    >
      <div className="text-[13px] text-ink-700 dark:text-bone-100">{sub}</div>

      <div className="grid grid-cols-3 gap-2">
        {stretches.slice(0, 6).map((s) => (
          <div key={s.id} className="relative aspect-square rounded-2xl overflow-hidden bg-bone-100 dark:bg-ink-700">
            <img src={s.image} alt={locStretch(s, 'name', lang)} className="absolute inset-0 w-full h-full object-cover" />
          </div>
        ))}
      </div>
      {stretches.length > 6 && (
        <div className="text-[11px] text-ink-300 text-center">
          +{stretches.length - 6}
        </div>
      )}

      <button
        onClick={onStart}
        className="w-full py-3 rounded-2xl bg-ink-900 dark:bg-bone-100 text-bone-50 dark:text-ink-900 text-[12px] uppercase tracking-wider font-semibold active:scale-[0.98]"
      >
        {startLabel} · {stretches.length} × {holdLabel}
      </button>
    </motion.div>
  );
}

function ActiveView({ current, idx, total, remaining, running, onNext, onRestart, lastOne, t, lang }) {
  const pct = remaining / 30;
  const R = 70;
  const C = 2 * Math.PI * R;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={current.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25 }}
        className="rounded-3xl bg-white dark:bg-ink-800 border border-black/5 dark:border-white/5 shadow-card dark:shadow-cardDark overflow-hidden"
      >
        <div className="relative aspect-square bg-bone-100 dark:bg-ink-700 overflow-hidden">
          <img
            src={current.image}
            alt={locStretch(current, 'name', lang)}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* progress ring overlay */}
          <div className="absolute top-3 right-3">
            <div className="relative w-[78px] h-[78px]">
              <svg width="78" height="78" viewBox="0 0 160 160" className="-rotate-90">
                <circle cx="80" cy="80" r={R} stroke="rgba(255,255,255,0.25)" strokeWidth="10" fill="none" />
                <motion.circle
                  cx="80" cy="80" r={R}
                  stroke="white"
                  strokeWidth="10"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray={C}
                  animate={{ strokeDashoffset: C * (1 - pct) }}
                  transition={{ type: 'spring', stiffness: 80, damping: 22 }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-bone-50 font-semibold tabular text-base">
                {fmtTime(remaining)}
              </div>
            </div>
          </div>
          <div className="absolute top-3 left-3 bg-ink-900/60 backdrop-blur-md text-bone-50 rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-wider tabular">
            {t('cool.stretchOf')} {idx + 1} / {total}
          </div>
        </div>

        <div className="p-4 space-y-2.5">
          <div className="text-base font-semibold text-ink-900 dark:text-bone-100 leading-tight">
            {locStretch(current, 'name', lang)}
          </div>
          <div className="text-[11px] uppercase tracking-wider text-ink-300">
            {t('cool.target')} · <span className="text-ink-500 dark:text-ink-100 normal-case tracking-normal">{locStretch(current, 'target', lang)}</span>
          </div>
          <p className="text-[13px] leading-relaxed text-ink-700 dark:text-bone-100">
            {locStretch(current, 'cue', lang)}
          </p>

          <div className="flex gap-2 pt-2">
            <button
              onClick={onRestart}
              className="flex-1 py-3 rounded-2xl border border-black/10 dark:border-white/10 text-[12px] uppercase tracking-wider font-medium text-ink-700 dark:text-bone-100 active:scale-[0.98]"
            >
              {t('rest.reset')}
            </button>
            <button
              onClick={onNext}
              className="flex-[1.6] py-3 rounded-2xl bg-ink-900 dark:bg-bone-100 text-bone-50 dark:text-ink-900 text-[12px] uppercase tracking-wider font-semibold active:scale-[0.98]"
            >
              {lastOne ? t('cool.finish') : t('cool.next')}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
