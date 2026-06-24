import React, { useId, useMemo } from 'react';
import { motion } from 'framer-motion';

// Weekly volume line chart. Stroke-draws on mount, then a soft fill
// fades in underneath. Tap-friendly aspect ratio (16:7).
//
// `points`: [{ label, value }] — already aggregated per week.
export default function VolumeChart({
  points = [],
  height = 130,
  tint = '#FFFFFF',
  label = '',
}) {
  const gid = useId().replace(/[:]/g, '');

  const { d, area, max, min } = useMemo(() => {
    if (!points.length) return { d: '', area: '', max: 0, min: 0 };
    const max = Math.max(...points.map((p) => p.value));
    const min = Math.min(...points.map((p) => p.value));
    const span = max - min || max || 1;
    const W = 100;
    const H = 100;
    const pad = 6;
    const xs = points.map((_, i) => (points.length === 1 ? W / 2 : pad + (i * (W - pad * 2)) / (points.length - 1)));
    const ys = points.map((p) => H - pad - ((p.value - min) / span) * (H - pad * 2));

    // Catmull-Rom-to-Bezier for a soft curve. With < 2 points just draw straight.
    let d = `M ${xs[0]} ${ys[0]}`;
    for (let i = 0; i < xs.length - 1; i++) {
      const x0 = xs[Math.max(0, i - 1)];
      const y0 = ys[Math.max(0, i - 1)];
      const x1 = xs[i];
      const y1 = ys[i];
      const x2 = xs[i + 1];
      const y2 = ys[i + 1];
      const x3 = xs[Math.min(xs.length - 1, i + 2)];
      const y3 = ys[Math.min(ys.length - 1, i + 2)];
      const c1x = x1 + (x2 - x0) / 6;
      const c1y = y1 + (y2 - y0) / 6;
      const c2x = x2 - (x3 - x1) / 6;
      const c2y = y2 - (y3 - y1) / 6;
      d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${x2} ${y2}`;
    }
    const area = `${d} L ${xs[xs.length - 1]} ${H - 4} L ${xs[0]} ${H - 4} Z`;
    return { d, area, max, min };
  }, [points]);

  if (!points.length) return null;

  return (
    <div className="relative w-full" style={{ height }}>
      {label && (
        <div className="v2-caption v2-t2 absolute top-0 left-0">{label}</div>
      )}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        width="100%"
        height={height}
        className="overflow-visible"
      >
        <defs>
          <linearGradient id={`grad-${gid}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={tint} stopOpacity="0.35" />
            <stop offset="100%" stopColor={tint} stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d={area}
          fill={`url(#grad-${gid})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.path
          d={d}
          stroke={tint}
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          vectorEffect="non-scaling-stroke"
        />
        {points.map((p, i) => {
          const W = 100;
          const pad = 6;
          const x = points.length === 1 ? W / 2 : pad + (i * (W - pad * 2)) / (points.length - 1);
          const max = Math.max(...points.map((q) => q.value));
          const min = Math.min(...points.map((q) => q.value));
          const span = max - min || max || 1;
          const y = 100 - 6 - ((p.value - min) / span) * (100 - 12);
          const isLast = i === points.length - 1;
          return (
            <motion.circle
              key={i}
              cx={x}
              cy={y}
              r={isLast ? 1.8 : 1.0}
              fill={tint}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            />
          );
        })}
      </svg>
    </div>
  );
}
