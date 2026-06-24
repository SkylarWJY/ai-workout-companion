import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLang } from '../../i18n/index.jsx';
import { fmtTime } from '../../utils/format.js';
import { tints, springs } from '../theme.js';

// Floating rest-timer pill — Apple-grade circular countdown with three
// chip controls. Mounts at the bottom of the WorkoutDay screen and
// auto-hides when timer.active goes false. Wires straight to the
// useRestTimer hook so the parent only owns start/stop calls.
export default function RestTimer({ timer, label, onDone, onStop }) {
  const { lang } = useLang();
  const { remaining, duration, running, done, active, pause, resume, skip, reset } = timer;

  if (!active && !done) return null;

  const pct = duration === 0 ? 0 : 1 - remaining / duration;
  const R = 60;
  const C = 2 * Math.PI * R;
  const accent = done ? tints.green : tints.mint;

  return (
    <AnimatePresence>
      {(active || done) && (
        <motion.div
          key="rest-timer-pill"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={springs.sheet}
          className="fixed inset-x-0 bottom-0 z-30 pointer-events-none"
          style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 88px)' }}
        >
          <div className="px-4 pointer-events-auto">
            <div
              className="mx-auto max-w-md rounded-[28px] p-4 v2-glass-strong border"
              style={{ borderColor: 'var(--hairline-strong)' }}
            >
              <div className="flex items-center gap-4">
                {/* Countdown ring */}
                <div className="relative w-[96px] h-[96px] shrink-0">
                  <svg width="96" height="96" viewBox="0 0 140 140" className="-rotate-90">
                    <circle
                      cx="70" cy="70" r={R}
                      stroke={accent}
                      strokeOpacity="0.18"
                      strokeWidth="9"
                      fill="none"
                    />
                    <motion.circle
                      cx="70" cy="70" r={R}
                      stroke={accent}
                      strokeWidth="9"
                      strokeLinecap="round"
                      fill="none"
                      strokeDasharray={C}
                      animate={{ strokeDashoffset: C * (1 - pct) }}
                      transition={{ type: 'spring', stiffness: 80, damping: 22 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="v2-caption v2-t3 text-[9px]">
                      {done
                        ? (lang === 'zh' ? '完成' : 'Ready')
                        : label || (lang === 'zh' ? '组间休息' : 'Rest')}
                    </span>
                    <span className="v2-display v2-numeric v2-t1 text-[22px] mt-0.5">
                      {done ? '00:00' : fmtTime(remaining)}
                    </span>
                  </div>
                </div>

                {/* Right column — different content for done vs running */}
                <div className="flex-1 min-w-0">
                  {done ? (
                    <>
                      <div className="v2-title text-[14px] v2-t1">
                        {lang === 'zh' ? '休息够了' : 'Rest complete'}
                      </div>
                      <div className="v2-body text-[11px] v2-t3 mt-0.5">
                        {lang === 'zh' ? '继续下一组' : 'Start the next set'}
                      </div>
                      <button
                        onClick={onDone}
                        className="mt-3 w-full h-10 rounded-full font-semibold text-[13px] tracking-[-0.01em]"
                        style={{ background: tints.green, color: '#000' }}
                      >
                        {lang === 'zh' ? '开始下一组' : 'Next set'}
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="v2-caption v2-t2">
                        {lang === 'zh' ? '建议深呼吸 + 喝水' : 'Breathe deep. Sip water.'}
                      </div>
                      <div className="mt-2 grid grid-cols-3 gap-1.5">
                        {running ? (
                          <Ctrl onClick={pause} label={lang === 'zh' ? '暂停' : 'Pause'} />
                        ) : (
                          <Ctrl onClick={resume} label={lang === 'zh' ? '继续' : 'Resume'} filled />
                        )}
                        <Ctrl onClick={reset} label={lang === 'zh' ? '重置' : 'Reset'} />
                        <Ctrl onClick={() => { skip(); onDone?.(); }} label={lang === 'zh' ? '跳过' : 'Skip'} />
                      </div>
                      <button
                        onClick={onStop}
                        className="mt-2 v2-caption v2-t3 hover:underline"
                      >
                        {lang === 'zh' ? '结束' : 'End'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
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
      className="h-8 rounded-full text-[11px] font-semibold tracking-[0.01em]"
      style={
        filled
          ? { background: 'var(--accent)', color: 'var(--canvas)' }
          : { background: 'var(--hairline)', color: 'var(--label-1)', boxShadow: 'inset 0 0 0 0.5px var(--hairline-strong)' }
      }
    >
      {label}
    </motion.button>
  );
}
