import React, { useId, useMemo } from 'react';
import { motion } from 'framer-motion';
import { tints, springs } from '../theme.js';
import CountUp from './CountUp.jsx';

// Hero progress visualization for the Exercise Modal. Large weight count-up,
// big drawn-in line chart with an animated tracker dot riding to the latest
// point, and a velocity gauge showing first→latest % change.
//
// `points` is the array from progressTrend(): { weight, reps, date, ... }
// `inverted` — assist-weighted exercises: the logged number is machine
// HELP, so a FALLING line is progress. Flips the trend tint + adds an
// explanatory caption so -5 kg reads as the win it actually is.
export default function ProgressHero({ points = [], unit = 'kg', lang = 'en', inverted = false }) {
  const gid = useId().replace(/[:]/g, '');
  const has = points.length > 0;
  const first = points[0];
  const last = points[points.length - 1];
  const delta = has && points.length > 1 ? last.weight - first.weight : 0;
  const pctChange = first && first.weight > 0 ? (delta / first.weight) * 100 : null;

  const { path, area, dots } = useMemo(() => {
    if (points.length < 2) return { path: '', area: '', dots: [] };
    const W = 100, H = 100, pad = 6;
    const ys = points.map((p) => p.weight);
    const max = Math.max(...ys);
    const min = Math.min(...ys);
    const span = max - min || max || 1;
    const xs = points.map((_, i) => pad + (i * (W - pad * 2)) / (points.length - 1));
    const ny = points.map((p) => H - pad - ((p.weight - min) / span) * (H - pad * 2));

    // Catmull-Rom to Bezier — same as VolumeChart
    let d = `M ${xs[0]} ${ny[0]}`;
    for (let i = 0; i < xs.length - 1; i++) {
      const x0 = xs[Math.max(0, i - 1)], y0 = ny[Math.max(0, i - 1)];
      const x1 = xs[i], y1 = ny[i];
      const x2 = xs[i + 1], y2 = ny[i + 1];
      const x3 = xs[Math.min(xs.length - 1, i + 2)], y3 = ny[Math.min(ys.length - 1, i + 2)];
      const c1x = x1 + (x2 - x0) / 6;
      const c1y = y1 + (y2 - y0) / 6;
      const c2x = x2 - (x3 - x1) / 6;
      const c2y = y2 - (y3 - y1) / 6;
      d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${x2} ${y2}`;
    }
    const area = `${d} L ${xs[xs.length - 1]} ${H - 4} L ${xs[0]} ${H - 4} Z`;
    return { path: d, area, dots: xs.map((x, i) => ({ x, y: ny[i] })) };
  }, [points]);

  // Direction-aware tint: for assist-weighted lifts a NEGATIVE delta
  // (less machine help) is the win.
  const improving = inverted ? delta < 0 : delta > 0;
  const regressing = inverted ? delta > 0 : delta < 0;
  const tint = improving ? tints.green : regressing ? tints.orange : tints.mint;

  return (
    <div className="v2-card p-5">
      {/* Hero numbers */}
      <div className="flex items-end justify-between">
        <div>
          <div className="v2-caption v2-t3 text-[10px]">
            {lang === 'zh' ? '最新顶组' : 'LATEST TOP SET'}
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <CountUp
              value={has ? last.weight : 0}
              decimals={last && last.weight % 1 !== 0 ? 1 : 0}
              duration={1.1}
              className="v2-display text-[44px] v2-t1 tracking-[-0.03em] leading-none"
            />
            <span className="v2-body text-[16px] v2-t3">{unit}</span>
          </div>
          {has && (
            <div className="mt-1 v2-body text-[13px] v2-t2">
              <CountUp value={last.reps} duration={0.9} /> {lang === 'zh' ? '次' : 'reps'} · {last.difficulty}
            </div>
          )}
        </div>

        {pctChange != null && points.length > 1 && (
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ ...springs.smooth, delay: 0.4 }}
            className="text-right"
          >
            <div className="v2-caption v2-t3 text-[9px]">
              {lang === 'zh' ? '总进步' : 'OVERALL'}
            </div>
            <div className="mt-1 v2-display v2-numeric tracking-tight" style={{ color: tint, fontSize: 28 }}>
              {pctChange > 0 ? '+' : ''}{pctChange.toFixed(0)}%
            </div>
            <div className="v2-num text-[11px] v2-t3 mt-0.5 tabular-nums">
              {delta > 0 ? '+' : ''}{delta.toFixed(1)} {unit}
            </div>
            {inverted && (
              <div className="v2-caption text-[9px] mt-1" style={{ color: tint }}>
                {lang === 'zh' ? '辅助更少 = 更强' : 'less assist = stronger'}
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Chart */}
      {points.length > 1 && (
        <div className="mt-5 relative w-full" style={{ height: 140 }}>
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            width="100%"
            height="100%"
            className="overflow-visible"
          >
            <defs>
              <linearGradient id={`fill-${gid}`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={tint} stopOpacity="0.4" />
                <stop offset="100%" stopColor={tint} stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Soft fill — fades in after path draws */}
            <motion.path
              d={area}
              fill={`url(#fill-${gid})`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.0, ease: [0.2, 0.8, 0.2, 1] }}
            />
            {/* Stroke — draws in */}
            <motion.path
              d={path}
              stroke={tint}
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
            />
            {/* Per-point dots */}
            {dots.map((d, i) => {
              const isLast = i === dots.length - 1;
              return (
                <motion.circle
                  key={i}
                  cx={d.x}
                  cy={d.y}
                  r={isLast ? 2 : 1.0}
                  fill={tint}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                />
              );
            })}
            {/* Tracker — pulsing halo on the latest point */}
            {dots.length > 0 && (
              <>
                <motion.circle
                  cx={dots[dots.length - 1].x}
                  cy={dots[dots.length - 1].y}
                  r="3.5"
                  fill={tint}
                  opacity="0.25"
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.6, 1] }}
                  transition={{ duration: 2.4, repeat: Infinity, delay: 1.6, ease: 'easeInOut' }}
                />
              </>
            )}
          </svg>

          {/* X-axis labels */}
          <div className="absolute inset-x-0 bottom-[-18px] flex justify-between text-[9px] v2-t3 tracking-wide">
            <span>{lang === 'zh' ? '第1次' : 'First'}</span>
            <span className="v2-num">{points.length} {lang === 'zh' ? '次训练' : 'sessions'}</span>
            <span>{lang === 'zh' ? '最新' : 'Latest'}</span>
          </div>
        </div>
      )}

      {/* No-history hint */}
      {!has && (
        <div className="mt-3 v2-body text-[13px] v2-t3 leading-relaxed">
          {lang === 'zh' ? '今天先打基线，下次就有进步曲线了。' : 'Log a baseline today — your progress curve starts next session.'}
        </div>
      )}
    </div>
  );
}
