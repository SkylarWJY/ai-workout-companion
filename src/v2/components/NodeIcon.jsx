import React from 'react';
import { motion } from 'framer-motion';

// Connected-dot SVG icons inspired by the user's liquid-glass reference.
// Each icon is built from a small number of nodes (circles) joined by
// thin lines. On activation the lines path-draw + the nodes scale in,
// giving a Lottie-feeling micro-animation without any external runtime.
//
// `active` drives the spring; `tint` is the fill/stroke color. Pass
// `size` to scale.

export default function NodeIcon({ name, active = false, size = 22, tint = 'currentColor' }) {
  const variants = {
    rest:   { opacity: active ? 1 : 0.7 },
    active: { opacity: 1 },
  };
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      style={{ color: tint }}
      animate={active ? 'active' : 'rest'}
      variants={variants}
    >
      {ICON_SHAPES[name]?.({ active })}
    </motion.svg>
  );
}

// Each shape returns an array of <motion.line>s + <motion.circle>s.
// Lines animate pathLength from 0 → 1 on activation; circles scale
// from 0 → 1. The whole thing settles in ~0.6s with a soft spring.

const lineTr  = (delay = 0) => ({ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] });
const dotTr   = (delay = 0) => ({ type: 'spring', stiffness: 380, damping: 22, delay });

function Line({ x1, y1, x2, y2, active, delay = 0, stroke = 'currentColor', width = 1.5 }) {
  return (
    <motion.line
      x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={stroke}
      strokeWidth={width}
      strokeLinecap="round"
      initial={false}
      animate={{ pathLength: active ? 1 : 0.5, opacity: active ? 1 : 0.55 }}
      transition={lineTr(delay)}
    />
  );
}

function Dot({ cx, cy, r = 1.7, active, delay = 0, fill = 'currentColor' }) {
  return (
    <motion.circle
      cx={cx} cy={cy} r={r}
      fill={fill}
      initial={false}
      animate={{ scale: active ? 1 : 0.7, opacity: active ? 1 : 0.65 }}
      transition={dotTr(delay)}
      style={{ transformOrigin: `${cx}px ${cy}px` }}
    />
  );
}

const ICON_SHAPES = {
  // HOME — pentagon "house" silhouette built from 5 dots.
  // Apex → base + two interior diagonals = a constellation house.
  home: ({ active }) => (
    <>
      <Line x1="16" y1="6"  x2="6"  y2="16" active={active} delay={0.00} />
      <Line x1="16" y1="6"  x2="26" y2="16" active={active} delay={0.05} />
      <Line x1="6"  y1="16" x2="6"  y2="25" active={active} delay={0.10} />
      <Line x1="26" y1="16" x2="26" y2="25" active={active} delay={0.10} />
      <Line x1="6"  y1="25" x2="26" y2="25" active={active} delay={0.15} />
      <Line x1="16" y1="6"  x2="16" y2="18" active={active} delay={0.18} width={1.2} />
      <Line x1="6"  y1="16" x2="26" y2="16" active={active} delay={0.18} width={1.2} />
      <Dot cx="16" cy="6"  active={active} delay={0.30} />
      <Dot cx="6"  cy="16" active={active} delay={0.32} />
      <Dot cx="26" cy="16" active={active} delay={0.34} />
      <Dot cx="6"  cy="25" active={active} delay={0.36} />
      <Dot cx="26" cy="25" active={active} delay={0.38} />
      <Dot cx="16" cy="18" active={active} delay={0.40} r={1.4} />
    </>
  ),

  // PLANS — 4 quadrant dots + an X/+ overlay = a calendar matrix.
  plans: ({ active }) => (
    <>
      <Line x1="9"  y1="9"  x2="23" y2="9"  active={active} delay={0.00} />
      <Line x1="9"  y1="23" x2="23" y2="23" active={active} delay={0.05} />
      <Line x1="9"  y1="9"  x2="9"  y2="23" active={active} delay={0.10} />
      <Line x1="23" y1="9"  x2="23" y2="23" active={active} delay={0.10} />
      <Line x1="16" y1="9"  x2="16" y2="23" active={active} delay={0.20} width={1.1} />
      <Line x1="9"  y1="16" x2="23" y2="16" active={active} delay={0.20} width={1.1} />
      <Dot cx="9"  cy="9"  active={active} delay={0.32} />
      <Dot cx="23" cy="9"  active={active} delay={0.32} />
      <Dot cx="9"  cy="23" active={active} delay={0.34} />
      <Dot cx="23" cy="23" active={active} delay={0.34} />
      <Dot cx="16" cy="16" active={active} delay={0.42} r={2.0} />
    </>
  ),

  // HISTORY — clock face: center node + four cardinal nodes + a hand.
  history: ({ active }) => (
    <>
      <Line x1="16" y1="6"  x2="16" y2="10" active={active} delay={0.05} width={1.1} />
      <Line x1="16" y1="22" x2="16" y2="26" active={active} delay={0.05} width={1.1} />
      <Line x1="6"  y1="16" x2="10" y2="16" active={active} delay={0.05} width={1.1} />
      <Line x1="22" y1="16" x2="26" y2="16" active={active} delay={0.05} width={1.1} />
      <Line x1="16" y1="16" x2="22" y2="10" active={active} delay={0.20} width={1.6} />
      <Line x1="16" y1="16" x2="16" y2="9"  active={active} delay={0.32} width={1.6} />
      <Dot cx="16" cy="6"  active={active} delay={0.30} />
      <Dot cx="16" cy="26" active={active} delay={0.32} />
      <Dot cx="6"  cy="16" active={active} delay={0.34} />
      <Dot cx="26" cy="16" active={active} delay={0.34} />
      <Dot cx="16" cy="16" active={active} delay={0.45} r={2.0} />
    </>
  ),
};
