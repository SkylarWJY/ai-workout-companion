import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useLang } from '../../i18n/index.jsx';
import { fmtTime } from '../../utils/format.js';
import { tints, springs } from '../theme.js';

// Immersive WORK mode. Same visual grammar as RestOverlay but green
// and the ring FILLS as the user works (so the bar rises like she
// asked). User can tap "Log this set" at any moment to open the
// logger — that's the moment when work ends and rest begins.
//
// `seconds` is the expected work duration computed from reps × tempo.
// Internally we just track elapsed time and stop at whatever value.
// If she goes longer than expected, the ring caps at full but the
// elapsed clock keeps climbing (so she sees she's pushed past).
export default function WorkOverlay({
  open,
  exerciseName,
  expectedSeconds = 30,
  onLogSet,
  onCancel,
}) {
  const { lang } = useLang();
  const [elapsed, setElapsed] = useState(0);
  const startedAtRef = useRef(0);

  useEffect(() => {
    if (!open) {
      setElapsed(0);
      return;
    }
    startedAtRef.current = Date.now();
    setElapsed(0);
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAtRef.current) / 1000));
    }, 100);
    return () => clearInterval(id);
  }, [open]);

  // Countdown semantics: ring starts full at green, drains as seconds
  // tick away. When elapsed ≥ expected, ring stays empty + tint warms
  // through mint → orange so the user feels "you're past the budget"
  // without it ever flashing red mid-rep.
  const remainingSec = Math.max(0, expectedSeconds - elapsed);
  const overran = elapsed >= expectedSeconds;
  const pct = remainingSec / expectedSeconds;       // 1 → 0 over time
  const drained = 1 - pct;
  const ringTint = overran ? tints.orange : tints.green;

  const SIZE = 300;
  const R = 134;
  const CIRC = 2 * Math.PI * R;

  // Portal to document.body so framer-motion's transforms on ancestor
  // routers don't pin `position: fixed` to a non-viewport coordinate
  // space. Inherit the .v2 + light/dark theme class from the live root.
  const portalRoot = typeof document !== 'undefined' ? document.body : null;
  if (!portalRoot) return null;

  const inner = (
    <AnimatePresence>
      {open && (
        <motion.div
          key="work-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
          className="fixed inset-0 z-40 flex flex-col items-center justify-center"
          style={{
            background: 'rgba(0,0,0,0.78)',
            backdropFilter: 'blur(28px) saturate(160%)',
            WebkitBackdropFilter: 'blur(28px) saturate(160%)',
            paddingTop: 'env(safe-area-inset-top)',
            paddingBottom: 'env(safe-area-inset-bottom)',
          }}
        >
          {/* Soft radial glow — gentle 1.5s breathing in green */}
          <motion.div
            aria-hidden
            animate={{ scale: [1, 1.04, 1], opacity: [0.55, 0.85, 0.55] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
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
                {overran
                  ? (lang === 'zh' ? '加油！冲一下' : 'Push through')
                  : (lang === 'zh' ? '正在训练' : 'WORKING')}
              </div>
              {exerciseName && (
                <div className="v2-title text-[18px] text-white/95 mt-1 max-w-[24ch] truncate">
                  {exerciseName}
                </div>
              )}
            </div>
            <button
              onClick={onCancel}
              className="v2-caption text-[11px] text-white/45 hover:text-white/85 transition"
            >
              {lang === 'zh' ? '取消' : 'Cancel'}
            </button>
          </div>

          {/* GIANT FILLING RING — counts up while working */}
          <div className="relative" style={{ width: SIZE, height: SIZE }}>
            <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="-rotate-90 v2-ring-shadow">
              <circle
                cx={SIZE / 2} cy={SIZE / 2} r={R}
                stroke="rgba(255,255,255,0.10)"
                strokeWidth="14"
                fill="none"
              />
              <motion.circle
                cx={SIZE / 2} cy={SIZE / 2} r={R}
                stroke={ringTint}
                strokeWidth="14"
                strokeLinecap="round"
                fill="none"
                strokeDasharray={CIRC}
                // Drain: offset goes from 0 (full ring) to CIRC (empty)
                // as time elapses. Same direction as RestOverlay so the
                // visual grammar matches across phases.
                animate={{ strokeDashoffset: CIRC * drained }}
                transition={{ type: 'spring', stiffness: 60, damping: 22 }}
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <div className="v2-caption text-[10px] tracking-[0.2em] text-white/45 mb-2">
                {overran
                  ? (lang === 'zh' ? '超出 +' : 'OVER +')
                  : (lang === 'zh' ? '剩余' : 'REMAINING')}
              </div>
              <div
                className="v2-display v2-numeric"
                style={{
                  fontSize: 88,
                  letterSpacing: '-0.04em',
                  lineHeight: 1,
                  color: '#fff',
                  textShadow: overran ? `0 0 24px ${rgba(ringTint, 0.55)}` : 'none',
                }}
              >
                {overran ? fmtTime(elapsed - expectedSeconds) : fmtTime(remainingSec)}
              </div>
              <div className="v2-caption text-[10px] text-white/55 mt-3 tabular-nums">
                {overran
                  ? (lang === 'zh' ? '已用 ' : 'used ')
                  : (lang === 'zh' ? '预计 ' : 'target ')}
                <span className="v2-num">{fmtTime(overran ? elapsed : expectedSeconds)}</span>
              </div>
            </div>
          </div>

          {/* Single big CTA — tapping ends work, opens the logger. */}
          <div className="absolute bottom-12 inset-x-0 px-8">
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              transition={springs.press}
              onClick={onLogSet}
              className="w-full h-14 rounded-2xl v2-num text-[16px] font-semibold tracking-[-0.01em]"
              style={{
                background: '#fff',
                color: '#000',
                boxShadow: `0 12px 28px -8px ${rgba(tints.green, 0.55)}`,
              }}
            >
              {lang === 'zh' ? '完成 — 记录这组' : 'Done — log this set'}
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Mirror the .v2 + light flag onto the portal subtree so CSS vars
  // (--canvas, --label-1, etc.) and font tokens still resolve. Pulled
  // from document.querySelector('.v2') at mount time.
  const rootEl = typeof document !== 'undefined' ? document.querySelector('.v2') : null;
  const themeClass = `v2${rootEl?.classList.contains('light') ? ' light' : ''}`;
  return createPortal(<div className={themeClass}>{inner}</div>, portalRoot);
}

function rgba(hex, a) {
  const h = hex.replace('#', '');
  return `rgba(${parseInt(h.slice(0,2),16)}, ${parseInt(h.slice(2,4),16)}, ${parseInt(h.slice(4,6),16)}, ${a})`;
}
