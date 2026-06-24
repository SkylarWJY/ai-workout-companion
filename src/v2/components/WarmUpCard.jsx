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
  // Two-source toggle: 'mov' = bundled, 'alt' = altYoutubeId.
  // Lets the user swap to a different tutorial inline without leaving
  // the page (what the v0.8 ↓ Watch alternate button did).
  const [source, setSource] = useState('mov');

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
        {/* Video tile — switches between bundled MOV and YouTube alt. */}
        <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
          {source === 'alt' && warmup.altYoutubeId ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${warmup.altYoutubeId}?autoplay=${playing ? 1 : 0}&playsinline=1&rel=0`}
              title="Warm-up tutorial"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            />
          ) : playing ? (
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

        {/* Source toggle — bundled vs YouTube tutorial. */}
        {warmup.altYoutubeId && (
          <div className="px-4 pt-3 flex items-center gap-1.5">
            <SourceTab
              active={source === 'mov'}
              onClick={() => { setSource('mov'); setPlaying(false); }}
              label={lang === 'zh' ? '主视频' : 'Main video'}
              icon="●"
            />
            <SourceTab
              active={source === 'alt'}
              onClick={() => { setSource('alt'); setPlaying(true); }}
              label={lang === 'zh' ? '换一个教程' : 'Alt tutorial'}
              icon="▶"
            />
          </div>
        )}

        {/* Bottom row */}
        <div className="p-4 space-y-3">
          <p className="v2-body text-[13px] v2-t1 leading-relaxed">
            {lang === 'zh' ? subKeyZh : subKeyEn}
          </p>
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            transition={springs.press}
            onClick={markDone}
            className="w-full py-3 rounded-full text-[13px] font-semibold tracking-wide"
            style={
              done
                ? { background: rgba(tints.green, 0.16), color: tints.green, boxShadow: `inset 0 0 0 0.5px ${rgba(tints.green, 0.32)}` }
                : { background: 'var(--accent)', color: 'var(--canvas)' }
            }
          >
            {done
              ? (lang === 'zh' ? '已完成 ✓' : 'Warm-up done ✓')
              : (lang === 'zh' ? '热身完成' : 'Mark warm-up done')}
          </motion.button>
        </div>
      </div>
    </motion.section>
  );
}

function SourceTab({ active, onClick, label, icon }) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.94 }}
      transition={springs.press}
      onClick={onClick}
      className="h-7 px-3 rounded-full inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wide"
      style={
        active
          ? { background: 'var(--accent)', color: 'var(--canvas)' }
          : { background: 'var(--hairline)', color: 'var(--label-1)', boxShadow: 'inset 0 0 0 0.5px var(--hairline-strong)' }
      }
    >
      <span style={{ opacity: 0.55 }}>{icon}</span>
      {label}
    </motion.button>
  );
}

function rgba(hex, a) {
  const h = hex.replace('#', '');
  return `rgba(${parseInt(h.slice(0,2),16)}, ${parseInt(h.slice(2,4),16)}, ${parseInt(h.slice(4,6),16)}, ${a})`;
}
