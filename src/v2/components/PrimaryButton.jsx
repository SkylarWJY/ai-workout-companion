import React from 'react';
import { motion } from 'framer-motion';
import { springs } from '../theme.js';

// Three weights, every Apple-grade app uses exactly these:
//   filled   — primary CTA, white on canvas
//   tinted   — secondary, colored surface w/ blur
//   plain    — text-only tertiary action
export default function PrimaryButton({
  children,
  variant = 'filled',
  size = 'md',
  tint = '#FFFFFF',
  onClick,
  disabled = false,
  className = '',
  type = 'button',
  icon = null,
  fullWidth = false,
}) {
  const sizing = {
    sm: 'h-9  px-4 text-[14px] rounded-full',
    md: 'h-12 px-6 text-[15px] rounded-full',
    lg: 'h-14 px-7 text-[17px] rounded-2xl',
  }[size];

  const v = {
    filled: {
      background: tint,
      color: tint === '#FFFFFF' ? '#000000' : '#FFFFFF',
    },
    tinted: {
      background: hexToRgba(tint, 0.16),
      color: tint,
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    },
    plain: {
      background: 'transparent',
      color: tint,
    },
  }[variant];

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: 0.96 }}
      transition={springs.press}
      style={v}
      className={[
        sizing,
        'font-semibold tracking-[-0.01em] inline-flex items-center justify-center gap-2',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
    >
      {icon && <span className="-ml-1">{icon}</span>}
      <span className="truncate">{children}</span>
    </motion.button>
  );
}

function hexToRgba(hex, a) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
