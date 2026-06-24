import React, { useEffect, useState } from 'react';
import { animate, useMotionValue, useTransform, motion } from 'framer-motion';

// Spring-tweens a number from 0 (or `from`) to `value` on mount and on
// value change. Renders an inline span — same DOM as plain text so it
// drops into existing layouts without breaking flex.
export default function CountUp({
  value,
  from = 0,
  duration = 1.2,
  delay = 0,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
}) {
  const target = Number(value) || 0;
  const mv = useMotionValue(from);
  const rounded = useTransform(mv, (v) => {
    const factor = Math.pow(10, decimals);
    return Math.round(v * factor) / factor;
  });
  const [display, setDisplay] = useState(from);

  useEffect(() => {
    const unsub = rounded.on('change', (v) => setDisplay(v));
    const ctrl = animate(mv, target, {
      duration,
      delay,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => { ctrl.stop(); unsub(); };
  }, [target, mv, rounded, duration, delay]);

  return (
    <motion.span className={`v2-numeric tabular-nums ${className}`}>
      {prefix}{decimals > 0 ? display.toFixed(decimals) : Math.round(display)}{suffix}
    </motion.span>
  );
}
