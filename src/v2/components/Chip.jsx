import React from 'react';
import { motion } from 'framer-motion';
import { springs } from '../theme.js';

// Pill chip. Two variants: solid (tinted background, used for status badges)
// and ghost (border-only, used for selectable filters).
export default function Chip({
  children,
  tint = null,
  variant = 'solid',
  selected = false,
  onClick = null,
  size = 'md',
  className = '',
}) {
  const sizing = {
    sm: 'h-6  px-2.5 text-[11px]',
    md: 'h-7  px-3   text-[12px]',
    lg: 'h-9  px-4   text-[13px]',
  }[size];

  let style = {};
  if (variant === 'solid') {
    style = tint
      ? { background: hexToRgba(tint, 0.18), color: tint, boxShadow: `inset 0 0 0 0.5px ${hexToRgba(tint, 0.32)}` }
      : { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.92)' };
  } else if (variant === 'ghost') {
    style = selected
      ? { background: 'rgba(255,255,255,0.95)', color: '#000' }
      : { background: 'transparent', color: 'rgba(255,255,255,0.78)', boxShadow: 'inset 0 0 0 0.5px rgba(255,255,255,0.16)' };
  }

  const Tag = onClick ? motion.button : motion.span;
  return (
    <Tag
      onClick={onClick}
      whileTap={onClick ? { scale: 0.94 } : undefined}
      transition={springs.press}
      style={style}
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold tracking-[0.005em] whitespace-nowrap ${sizing} ${className}`}
    >
      {children}
    </Tag>
  );
}

function hexToRgba(hex, a) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
