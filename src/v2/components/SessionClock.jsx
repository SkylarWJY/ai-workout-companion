import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fmtTime } from '../../utils/format.js';
import { tints } from '../theme.js';

// Live mm:ss clock since session.startedAt. Pulses subtly with each
// second so the user senses time passing without staring at the screen.
// 1-second precision is enough — re-render every 250ms to stay smooth.
export default function SessionClock({ startedAt, paused = false }) {
  const [, force] = useState(0);
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => force((v) => v + 1), 250);
    return () => clearInterval(id);
  }, [paused]);

  if (!startedAt) return null;
  const elapsed = Math.max(0, Math.floor((Date.now() - startedAt) / 1000));
  return (
    <motion.div
      className="inline-flex items-center gap-1.5 v2-num text-[12px] font-semibold"
      animate={{ opacity: [0.92, 1, 0.92] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
    >
      <motion.span
        animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
        className="inline-block rounded-full"
        style={{ width: 6, height: 6, background: tints.green }}
      />
      <span className="v2-t1 tabular-nums">{fmtTime(elapsed)}</span>
    </motion.div>
  );
}
