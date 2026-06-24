import React from 'react';
import { createPortal } from 'react-dom';
import { motion, LayoutGroup } from 'framer-motion';
import { useLang } from '../../i18n/index.jsx';
import { springs, tints } from '../theme.js';
import NodeIcon from './NodeIcon.jsx';

// Floating liquid-glass tab bar pinned to the bottom of the viewport.
// Heavy-saturation backdrop blur, hairline highlight, and a sliding
// chip behind the active tab driven by Framer Motion's shared layoutId
// so the highlight glides between slots (matches the user's reference).
//
// Portals to document.body so it stays viewport-anchored even when the
// scroll container's transform context shifts.
//
// `tabs` is an array of { id, icon } pairs. `active` is the current id;
// `onChange(id)` fires on tap.
export default function GlassTabBar({ tabs, active, onChange, accentTint }) {
  const { lang } = useLang();
  const accent = accentTint || '#E9FF4A'; // user's reference uses an electric lime — matches "very high-end" feel

  if (typeof document === 'undefined') return null;

  const inner = (
    <div
      className="fixed inset-x-0 bottom-0 z-30 pointer-events-none flex justify-center"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 12px)' }}
    >
      <motion.div
        initial={{ y: 28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ...springs.sheet, delay: 0.15 }}
        className="pointer-events-auto relative inline-flex p-1.5 rounded-full"
        style={{
          // Liquid glass. Two layers: heavy blur for refraction + thin
          // hairline border for that sky-pill look. Saturation pump
          // brings the colors behind through with a slight vibrancy.
          background: 'rgba(255,255,255,0.10)',
          backdropFilter: 'blur(36px) saturate(220%)',
          WebkitBackdropFilter: 'blur(36px) saturate(220%)',
          boxShadow:
            'inset 0 0 0 0.5px rgba(255,255,255,0.34), 0 12px 28px -8px rgba(0,0,0,0.4), 0 0 0 0.5px rgba(0,0,0,0.18)',
        }}
      >
        <LayoutGroup id="glass-tab">
          {tabs.map((t) => {
            const isActive = t.id === active;
            return (
              <motion.button
                key={t.id}
                type="button"
                whileTap={{ scale: 0.92 }}
                transition={springs.press}
                onClick={() => onChange(t.id)}
                className="relative h-12 w-14 grid place-items-center rounded-full"
                aria-label={t.label || t.id}
              >
                {/* Sliding active highlight */}
                {isActive && (
                  <motion.span
                    layoutId="glass-tab-pill"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: accent,
                      boxShadow: `0 6px 18px -4px ${accent}99, inset 0 0 0 0.5px rgba(0,0,0,0.18)`,
                    }}
                  />
                )}
                {/* Icon — black when active so it pops on the lime, else translucent white */}
                <span
                  className="relative"
                  style={{ color: isActive ? '#0A0A0A' : 'rgba(255,255,255,0.78)' }}
                >
                  <NodeIcon name={t.id} active={isActive} size={22} />
                </span>
              </motion.button>
            );
          })}
        </LayoutGroup>
      </motion.div>
    </div>
  );

  return createPortal(<div className="v2">{inner}</div>, document.body);
}
