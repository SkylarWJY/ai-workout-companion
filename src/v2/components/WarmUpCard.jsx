import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLang } from '../../i18n/index.jsx';
import { useOverrides } from '../../hooks/useOverrides.jsx';
import { WARMUPS } from '../../data/warmCoolData.js';
import { springs, tints } from '../theme.js';
import Chip from './Chip.jsx';

// Pre-workout warm-up card. Plays the bundled video inline (or
// falls back to the alt YouTube tutorial when the user taps it),
// shows a one-line cue, and has a "Mark done" tap target. Uses
// the existing overrides.warmupDone.{type} key the v0.8 stored
// so checking off the warm-up persists per-day.
export default function WarmUpCard({ workoutType }) {
  const { lang } = useLang();
  const { overrides, setOverride } = useOverrides();
  const warmup = WARMUPS[workoutType];
  const [playing, setPlaying] = useState(false);

  const done = !!overrides.warmupDone?.[workoutType];

  if (!warmup) return null;

  const subKeyZh = {
    push: '肩 / 胸活动 + 旋转袖热身',
    pull: '背阔活动 + 旋转袖热身',
    leg: '髋膝活动 + 神经唤醒',
  }[workoutType];
  const subKeyEn = {
    push: 'Shoulder + chest mobility · rotator-cuff prime',
    pull: 'Lat mobility · rotator-cuff prime',
    leg: 'Hip + knee mobility · CNS prime',
  }[workoutType];

  const markDone = () => {
    setOverride('warmupDone', null, workoutType, !done);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springs.smooth, delay: 0.05 }}
      className="mt-6"
    >
      <div className="v2-caption v2-t2 mb-2 flex items-center justify-between">
        <span>{lang === 'zh' ? '热身' : 'Warm-up'}</span>
        {done && (
          <Chip size="sm" tint={tints.green}>
            {lang === 'zh' ? '已完成' : 'Done'}
          </Chip>
        )}
      </div>

      <div
        className="v2-card overflow-hidden"
        style={done ? { boxShadow: `inset 0 0.5px 0 0 ${rgba(tints.green, 0.32)}` } : undefined}
      >
        {/* Video tile */}
        <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
          {playing ? (
            <video
              autoPlay
              controls
              playsInline
              poster={warmup.poster}
              className="w-full h-full object-cover"
            >
              <source src={warmup.video} />
            </video>
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              className="absolute inset-0 group"
              aria-label="Play warm-up video"
            >
              <img
                src={warmup.poster}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.5))' }}
              >
                <motion.span
                  whileTap={{ scale: 0.9 }}
                  transition={springs.press}
                  className="w-14 h-14 rounded-full grid place-items-center"
                  style={{ background: 'rgba(255,255,255,0.95)' }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#000">
                    <path d="M8 5v14l11-7L8 5z" />
                  </svg>
                </motion.span>
              </div>
              <div
                className="absolute bottom-0 inset-x-0 px-4 py-3 text-white v2-caption text-[10px] tracking-[0.16em]"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}
              >
                {warmup.rounds}× · {warmup.repsPerMove} reps / move
              </div>
            </button>
          )}
        </div>

        {/* Bottom row */}
        <div className="p-4 space-y-3">
          <p className="v2-body text-[13px] v2-t1 leading-relaxed">
            {lang === 'zh' ? subKeyZh : subKeyEn}
          </p>
          <div className="flex gap-2">
            <a
              href={`https://www.youtube.com/watch?v=${warmup.altYoutubeId}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-2.5 rounded-full text-center text-[12px] font-semibold tracking-wide v2-t1"
              style={{ background: 'var(--hairline)', boxShadow: 'inset 0 0 0 0.5px var(--hairline-strong)' }}
            >
              {lang === 'zh' ? '看 YouTube 教程' : 'Watch tutorial'}
            </a>
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              transition={springs.press}
              onClick={markDone}
              className="flex-[1.4] py-2.5 rounded-full text-[12px] font-semibold tracking-wide"
              style={
                done
                  ? { background: rgba(tints.green, 0.16), color: tints.green, boxShadow: `inset 0 0 0 0.5px ${rgba(tints.green, 0.32)}` }
                  : { background: 'var(--accent)', color: 'var(--canvas)' }
              }
            >
              {done
                ? (lang === 'zh' ? '已完成 ✓' : 'Done ✓')
                : (lang === 'zh' ? '热身完成' : 'Mark warm-up done')}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function rgba(hex, a) {
  const h = hex.replace('#', '');
  return `rgba(${parseInt(h.slice(0,2),16)}, ${parseInt(h.slice(2,4),16)}, ${parseInt(h.slice(4,6),16)}, ${a})`;
}
