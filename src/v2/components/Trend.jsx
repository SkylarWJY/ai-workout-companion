import React from 'react';
import { motion } from 'framer-motion';

// Sparkline-style bars showing top-set weight per session.
// Scales bars 0.18..1 so even the smallest session has a visible base.
export default function Trend({ points = [], tint = '#FFFFFF', height = 28 }) {
  if (!points.length) return null;
  const weights = points.map((p) => p.weight);
  const max = Math.max(...weights);
  const min = Math.min(...weights);
  const span = max - min || max || 1;

  return (
    <div className="flex items-end gap-[3px]" style={{ height }}>
      {points.map((p, i) => {
        const norm = (p.weight - min) / span;        // 0..1
        const h = Math.max(0.18, norm) * height;     // never fully empty
        const opacity = 0.4 + 0.6 * (i / Math.max(1, points.length - 1));
        return (
          <motion.div
            key={i}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: h, opacity }}
            transition={{ delay: 0.05 + i * 0.04, duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
            style={{ width: 4, background: tint, borderRadius: 2 }}
          />
        );
      })}
    </div>
  );
}
