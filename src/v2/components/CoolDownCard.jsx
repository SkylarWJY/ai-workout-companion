import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLang, locStretch } from '../../i18n/index.jsx';
import { COOLDOWNS, COOLDOWN_HOLD_SECS } from '../../data/warmCoolData.js';
import { useOverrides } from '../../hooks/useOverrides.jsx';
import { fmtTime } from '../../utils/format.js';
import { springs, tints } from '../theme.js';
import Chip from './Chip.jsx';
import PrimaryButton from './PrimaryButton.jsx';

// Post-workout cool-down card. Tap "Begin" to enter timer mode — each
// stretch holds for 30s. Unilateral stretches auto-flip L → R. Mirrors
// v0.8 mechanics but with v2 glass card + animated ring.
export default function CoolDownCard({ workoutType }) {
  const { t, lang } = useLang();
  const { overrides, setFlag } = useOverrides();
  const stretches = COOLDOWNS[workoutType] || [];
  const doneFlag = !!overrides.cooldownDone?.[workoutType];

  // Phase state — 'list' (idle) or 'timer' (active stretch w/ countdown)
  const [phase, setPhase] = useState('list');
  const [idx, setIdx] = useState(0);
  const [side, setSide] = useState('L');
  const [remaining, setRemaining] = useState(COOLDOWN_HOLD_SECS);
  const [running, setRunning] = useState(false);
  const endRef = useRef(0);
  const tickRef = useRef(null);
  const idxRef = useRef(0);
  const sideRef = useRef('L');

  useEffect(() => { idxRef.current = idx; }, [idx]);
  useEffect(() => { sideRef.current = side; }, [side]);
  useEffect(() => () => { if (tickRef.current) clearInterval(tickRef.current); }, []);

  const stretchesRef = useRef(stretches);
  useEffect(() => { stretchesRef.current = stretches; }, [stretches]);

  if (!stretches.length) return null;

  const total = stretches.length;
  const current = stretches[idx];
  const lastOne = idx === total - 1;
  const isUni = !!current?.unilateral;

  const clearTick = () => {
    if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null; }
  };

  const startInterval = (secs) => {
    clearTick();
    endRef.current = Date.now() + secs * 1000;
    setRunning(true);
    tickRef.current = setInterval(() => {
      const left = Math.max(0, Math.round((endRef.current - Date.now()) / 1000));
      setRemaining(left);
      if (left <= 0) {
        clearTick();
        setRunning(false);
        if (navigator.vibrate) navigator.vibrate([60, 40, 60]);
        const cur = stretchesRef.current[idxRef.current];
        if (cur?.unilateral && sideRef.current === 'L') {
          setSide('R'); sideRef.current = 'R';
          setRemaining(COOLDOWN_HOLD_SECS);
          startInterval(COOLDOWN_HOLD_SECS);
        }
      }
    }, 200);
  };

  const begin = () => {
    setPhase('timer'); setIdx(0); idxRef.current = 0;
    setSide('L'); sideRef.current = 'L';
    setRemaining(COOLDOWN_HOLD_SECS);
    startInterval(COOLDOWN_HOLD_SECS);
  };

  const next = () => {
    if (lastOne) {
      clearTick(); setRunning(false); setPhase('list');
      setFlag('cooldownDone', workoutType, true);
      return;
    }
    const ni = idx + 1; idxRef.current = ni; setIdx(ni);
    setSide('L'); sideRef.current = 'L';
    setRemaining(COOLDOWN_HOLD_SECS);
    startInterval(COOLDOWN_HOLD_SECS);
  };

  const skip = () => {
    clearTick(); setRunning(false); setPhase('list');
  };

  const pct = 1 - remaining / COOLDOWN_HOLD_SECS;
  const R = 78;
  const C = 2 * Math.PI * R;

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springs.smooth}
      className="mt-8"
    >
      <div className="v2-caption v2-t2 mb-2 flex items-center justify-between">
        <span>{lang === 'zh' ? '拉伸 / 放松' : 'Cool-down'}</span>
        <span className="v2-t3 text-[10px] tracking-wide">
          {total} × {COOLDOWN_HOLD_SECS}s
        </span>
      </div>

      <AnimatePresence>
        {phase === 'list' ? (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="v2-card p-4"
          >
            <ul className="space-y-3">
              {stretches.map((s, i) => (
                <li key={s.id} className="flex items-center gap-3">
                  {/* Thumb of the stretch pose */}
                  <div
                    className="shrink-0 w-14 h-14 rounded-2xl overflow-hidden relative"
                    style={{ background: 'var(--surface-2)' }}
                  >
                    {s.image && (
                      <img
                        src={s.image}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    )}
                    <span
                      className="absolute top-1 left-1 px-1.5 py-0.5 rounded-full text-[9px] v2-num font-semibold"
                      style={{ background: 'rgba(0,0,0,0.55)', color: '#fff' }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="v2-body text-[14px] v2-t1 truncate">{locStretch(s, 'name', lang)}</div>
                    <div className="v2-caption v2-t3 text-[9px] tracking-wide mt-0.5">
                      {locStretch(s, 'target', lang)}
                      {s.unilateral && (lang === 'zh' ? ' · 双侧' : ' · L + R')}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <PrimaryButton
                size="md"
                fullWidth
                onClick={begin}
                icon={
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M6 4l14 8-14 8V4z" fill="currentColor" />
                  </svg>
                }
              >
                {doneFlag
                  ? (lang === 'zh' ? '再做一次' : 'Run again')
                  : (lang === 'zh' ? '开始拉伸' : 'Start cool-down')}
              </PrimaryButton>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="timer"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={springs.smooth}
            className="v2-card overflow-hidden"
          >
            {/* Hero image — full-width pose photo with blur-edge gradient. */}
            {current.image && (
              <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
                <img
                  src={current.image}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(to bottom, transparent 50%, var(--surface-1) 100%)' }}
                />
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span
                    className="v2-caption text-[10px] tracking-wide px-2 py-1 rounded-full"
                    style={{ background: 'rgba(0,0,0,0.5)', color: '#fff' }}
                  >
                    {idx + 1} / {total}
                  </span>
                  <span
                    className="v2-caption text-[10px] tracking-wide px-2 py-1 rounded-full"
                    style={{ background: 'rgba(0,0,0,0.5)', color: '#fff' }}
                  >
                    {locStretch(current, 'target', lang)}
                  </span>
                </div>
              </div>
            )}

            <div className="px-5 pt-3 pb-5 text-center">
              {!current.image && (
                <div className="v2-caption v2-t3 text-[9px] tracking-wide">
                  {idx + 1} / {total}
                </div>
              )}
              <div className="v2-title text-[18px] v2-t1 mt-1">
                {locStretch(current, 'name', lang)}
              </div>
              <div className="v2-body text-[12.5px] v2-t2 mt-1 max-w-[26ch] mx-auto leading-relaxed">
                {locStretch(current, 'cue', lang)}
              </div>

              {/* Big ring */}
              <div className="relative w-[180px] h-[180px] mx-auto mt-4">
                <svg width="180" height="180" viewBox="0 0 180 180" className="-rotate-90 v2-ring-shadow">
                  <circle cx="90" cy="90" r={R} stroke={tints.mint} strokeOpacity="0.18" strokeWidth="10" fill="none" />
                  <motion.circle
                    cx="90" cy="90" r={R}
                    stroke={tints.mint}
                    strokeWidth="10"
                    strokeLinecap="round"
                    fill="none"
                    strokeDasharray={C}
                    animate={{ strokeDashoffset: C * (1 - pct) }}
                    transition={{ type: 'spring', stiffness: 80, damping: 22 }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  {isUni && (
                    <div className="v2-caption text-[10px]" style={{ color: tints.mint }}>
                      {lang === 'zh' ? (side === 'L' ? '左侧' : '右侧') : (side === 'L' ? 'LEFT' : 'RIGHT')}
                    </div>
                  )}
                  <div className="v2-display v2-numeric v2-t1 text-[44px] mt-1">
                    {fmtTime(remaining)}
                  </div>
                </div>
              </div>

            {/* L/R toggle when unilateral */}
            {isUni && (
              <div className="mt-4 inline-flex rounded-full v2-bg-soft p-0.5">
                {['L', 'R'].map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setSide(s); sideRef.current = s;
                      setRemaining(COOLDOWN_HOLD_SECS);
                      startInterval(COOLDOWN_HOLD_SECS);
                    }}
                    className="h-8 px-4 rounded-full v2-num text-[12px] font-semibold transition"
                    style={
                      side === s
                        ? { background: 'var(--accent)', color: 'var(--canvas)' }
                        : { color: 'var(--label-2)' }
                    }
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <div className="mt-5 flex gap-2">
              <PrimaryButton size="md" variant="plain" onClick={skip}>
                {lang === 'zh' ? '结束' : 'End'}
              </PrimaryButton>
              <PrimaryButton size="md" fullWidth onClick={next}>
                {lastOne
                  ? (lang === 'zh' ? '完成拉伸' : 'Finish cool-down')
                  : (lang === 'zh' ? '下一个' : 'Next stretch')}
              </PrimaryButton>
            </div>
            </div>{/* close px-5 pt-3 pb-5 wrapper */}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
