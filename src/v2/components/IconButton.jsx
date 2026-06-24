import React from 'react';
import { motion } from 'framer-motion';
import { springs } from '../theme.js';

// Circular icon button. Used for nav bar leading/trailing.
export default function IconButton({
  icon,
  onClick,
  ariaLabel,
  variant = 'ghost', // 'ghost' (transparent) | 'glass' (frosted disc) | 'filled' (white)
  size = 36,
}) {
  const style = {
    ghost:  { background: 'transparent', color: 'rgba(255,255,255,0.92)' },
    glass:  {
      background: 'rgba(255,255,255,0.10)',
      color: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(18px) saturate(180%)',
      WebkitBackdropFilter: 'blur(18px) saturate(180%)',
      boxShadow: 'inset 0 0.5px 0 0 rgba(255,255,255,0.18)',
    },
    filled: { background: '#FFFFFF', color: '#000000' },
  }[variant];

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.92 }}
      transition={springs.press}
      onClick={onClick}
      aria-label={ariaLabel}
      style={{ ...style, width: size, height: size }}
      className="rounded-full flex items-center justify-center"
    >
      {icon}
    </motion.button>
  );
}
