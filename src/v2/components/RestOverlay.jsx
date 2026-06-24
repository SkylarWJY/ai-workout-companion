import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLang } from '../../i18n/index.jsx';
import { fmtTime } from '../../utils/format.js';
import { springs, tints } from '../theme.js';

// Full-screen immersive rest mode. Replaces the previous bottom-pill
// timer. While the timer is active, a smoked-glass scrim covers the
// workout, a giant ring drains from full to empty, and the digit
// breathes with a 1-second pulse. The ring tint shifts from mint →
// orange → red as the final 5 seconds approach, giving the user a
// felt sense of time passing instead of a number ticking.
//
// When the timer completes, the overlay holds for a beat on "GO" then
// auto-dismisses so the next set tap is one motion away.
export default function RestOverlay({ timer, exerciseName, onDone, onStop }) {
  const { lang } = useLang();
  const { active, done, running, duration, remaining, pause, resume, skip, reset } = timer;
  const [showGoFlash, setShowGoFlash] = useState(false);
  const doneFiredRef = useRef(false);

  // When timer flips to done, briefly flash "GO" then auto-close.
  useEffect(() => {
    if (done && !doneFiredRef.current) {
      doneFiredRef.current = true;
      setShowGoFlash(true);
      const t = setTimeout(() => {
        setShowGoFlash(false);
        onDone?.();
      }, 1200);
      return () => clearTimeout(t);
    }
    if (!done) doneFiredRef.current = false;
  }, [done, onDone]);

  if (!active && !done) return null;

  const pct = duration === 0 ? 0 : remaining / duration;
  const drained = 1 - pct;
  const isFinal = remaining <= 5 && remaining > 0;
  const isCritical = remaining <= 3 && remaining > 0;

  // Ring stroke tint transitions: mint → orange (5s) → red (3s)
  const ringTint = isCritical ? tints.red : isFinal ? tints.orange : tints.mint;

  // Big SVG ring constants — sized to fit a 390-wide phone with margin.
  const SIZE = 300;
  const R = 134;
  const CIRC = 2 * Math.PI * R;

  return (
    <AnimatePresence>
      {(active || done) && (
        <motion.div
          key="rest-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
          className="fixed inset-0 z-40 flex flex-col items-center justify-center"
          style={{
            background: 'rgba(0,0,0,0.78)',
            backdropFilter: 'blur(28px) saturate(160%)',
            WebkitBackdropFilter: 'blur(28px) saturate(160%)',
            paddingTop: 'env(safe-area-inset-top)',
            paddingBottom: 'env(safe-area-inset-bottom)',
          }}
        >
          {/* Soft radial pulse behind the ring — colors with urgency */}
          <motion.div
            aria-hidden
            initial={false}
            animate={{
              scale: isCritical ? [1, 1.08, 1] : isFinal ? [1, 1.04, 1] : 1,
              opacity: isCritical ? [0.9, 0.45, 0.9] : isFinal ? [0.7, 0.4, 0.7] : 0.6,
            }}
            transition={{ duration: isCritical ? 0.45 : isFinal ? 0.8 : 1.5, repeat: Infinity }}
            className="absolute"
            style={{
              width: SIZE * 1.6,
              height: SIZE * 1.6,
              background: `radial-gradient(circle, ${rgba(ringTint, 0.32)} 0%, transparent 65%)`,
              filter: 'blur(28px)',
              pointerEvents: 'none',
            }}
          />

          {/* Header strip */}
          <div className="absolute top-0 inset-x-0 px-5 pt-12 flex items-center justify-between">
            <div>
              <div className="v2-caption text-[10px] tracking-[0.2em] text-white/55">
                {done ? (lang === 'zh' ? '准备下一组' : 'Up next') : (lang === 'zh' ? '组间休息' : 'Resting')}
              </div>
              {exerciseName && (
                <div className="v2-title text-[18px] text-white/95 mt-1 max-w-[24ch] truncate">
                  {exerciseName}
                </div>
              )}
            </div>
            <button
              onClick={onStop}
              className="v2-caption text-[11px] text-white/45 hover:text-white/85 transition"
            >
              {lang === 'zh' ? '结束' : 'End'}
            </button>
          </div>

          {/* GIANT DRAIN RING ─────────────────────────────────────── */}
          <div className="relative" style={{ width: SIZE, height: SIZE }}>
            <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="-rotate-90 v2-ring-shadow">
              {/* Track */}
              <circle
                cx={SIZE / 2} cy={SIZE / 2} r={R}
                stroke="rgba(255,255,255,0.10)"
                strokeWidth="14"
                fill="none"
              />
              {/* Drain ring */}
              <motion.circle
                cx={SIZE / 2} cy={SIZE / 2} r={R}
                stroke={ringTint}
                strokeWidth="14"
                strokeLinecap="round"
                fill="none"
                strokeDasharray={CIRC}
                animate={{ strokeDashoffset: CIRC * drained }}
                transition={{ type: 'spring', stiffness: 80, damping: 24 }}
              />
              {/* Soft inner glow */}
              <motion.circle
                cx={SIZE / 2} cy={SIZE / 2} r={R - 8}
                stroke={rgba(ringTint, 0.18)}
                strokeWidth="14"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={CIRC * 0.94}
                strokeDashoffset={CIRC * 0.94 * drained}
                animate={{ opacity: isFinal ? [0.6, 1, 0.6] : 0.5 }}
                transition={{ duration: isCritical ? 0.5 : 1, repeat: Infinity }}
              />
            </svg>

            {/* Center number — pulses on every tick */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <AnimatePresence mode="popLayout">
                {!done && !showGoFlash && (
                  <motion.div
                    key={`tick-${remaining}`}
                    initial={{ scale: 0.95, opacity: 0.5 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.02, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
                    className="text-center"
                  >
                    <div
                      className="v2-display v2-numeric"
                      style={{
                        fontSize: 88,
                        letterSpacing: '-0.04em',
                        lineHeight: 1,
                        color: '#fff',
                        textShadow: isCritical ? `0 0 24px ${rgba(ringTint, 0.6)}` : 'none',
                      }}
                    >
                      {fmtTime(remaining)}
                    </div>
                    <div className="v2-caption text-[10px] text-white/55 mt-3">
                      {lang === 'zh' ? '深呼吸 · 喝水' : 'Breathe deep · sip water'}
                    </div>
                  </motion.div>
                )}
                {(done || showGoFlash) && (
                  <motion.div
                    key="go-flash"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.4, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                    className="text-center"
                  >
                    <div
                      className="v2-display"
                      style={{
                        fontSize: 96,
                        fontWeight: 800,
                        letterSpacing: '-0.04em',
                        lineHeight: 1,
                        color: tints.green,
                        textShadow: `0 0 32px ${rgba(tints.green, 0.6)}`,
                      }}
                    >
                      GO
                    </div>
                    <div className="v2-caption text-[10px] text-white/60 mt-3 tracking-[0.2em]">
                      {lang === 'zh' ? '下一组' : 'NEXT SET'}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Controls — bottom row */}
          {!done && !showGoFlash && (
            <div className="absolute bottom-12 inset-x-0 px-8">
              <div className="grid grid-cols-3 gap-3">
                {running ? (
                  <Ctrl onClick={pause} label={lang === 'zh' ? '暂停' : 'Pause'} />
                ) : (
                  <Ctrl onClick={resume} label={lang === 'zh' ? '继续' : 'Resume'} filled />
                )}
                <Ctrl onClick={reset} label={lang === 'zh' ? '重置' : 'Reset'} />
                <Ctrl
                  onClick={() => { skip(); }}
                  label={lang === 'zh' ? '跳过' : 'Skip'}
                />
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Ctrl({ onClick, label, filled }) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.92 }}
      transition={springs.press}
      onClick={onClick}
      className="h-12 rounded-full v2-num text-[14px] font-semibold tracking-[-0.01em]"
      style={
        filled
          ? { background: '#fff', color: '#000' }
          : { background: 'rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.95)', boxShadow: 'inset 0 0 0 0.5px rgba(255,255,255,0.18)' }
      }
    >
      {label}
    </motion.button>
  );
}

function rgba(hex, a) {
  const h = hex.replace('#', '');
  return `rgba(${parseInt(h.slice(0,2),16)}, ${parseInt(h.slice(2,4),16)}, ${parseInt(h.slice(4,6),16)}, ${a})`;
}
