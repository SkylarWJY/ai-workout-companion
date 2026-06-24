import React from 'react';
import { motion } from 'framer-motion';

// Apple Watch-style activity ring. Concentric stroke arcs with
// rounded line caps. `rings` is an array of { progress, tint, label, value }.
// The outermost ring is index 0 and goes biggest.
export default function ActivityRing({
  rings = [],
  size = 168,
  stroke = 14,
  gap = 4,
  center = null,
  delay = 0,
}) {
  const baseR = (size - stroke) / 2;

  return (
    <div className="v2-ring-shadow relative inline-block" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {rings.map((ring, i) => {
          const r = baseR - i * (stroke + gap);
          if (r <= 0) return null;
          const circ = 2 * Math.PI * r;
          const target = Math.min(1, Math.max(0, ring.progress));
          // Apple-Watch-style: ring background = tint at 18% so even the
          // unfilled portion glows the right color.
          return (
            <g key={i} transform={`rotate(-90 ${size / 2} ${size / 2})`}>
              <circle
                cx={size / 2}
                cy={size / 2}
                r={r}
                stroke={ring.tint}
                strokeOpacity="0.18"
                strokeWidth={stroke}
                fill="none"
              />
              <motion.circle
                cx={size / 2}
                cy={size / 2}
                r={r}
                stroke={ring.tint}
                strokeWidth={stroke}
                strokeLinecap="round"
                fill="none"
                strokeDasharray={circ}
                initial={{ strokeDashoffset: circ }}
                animate={{ strokeDashoffset: circ * (1 - target) }}
                transition={{
                  duration: 1.4,
                  delay: delay + i * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            </g>
          );
        })}
      </svg>
      {center && (
        <div className="absolute inset-0 grid place-items-center text-center">
          {center}
        </div>
      )}
    </div>
  );
}
