import React from 'react';
import { motion } from 'framer-motion';

// Highlight colour palette (Tailwind tokens for the palette):
//   primary → priority-extreme (red)
//   secondary → priority-veryhigh (amber) at lower opacity
//   none → subtle grey (body fill)

const COLORS = {
  bodyFill: 'rgba(120,120,135,0.18)',
  bodyStroke: 'rgba(120,120,135,0.32)',
  primary: '#FF453A',
  secondary: '#FF9F0A',
  none: 'rgba(120,120,135,0.10)',
};

function fillFor(level) {
  if (level === 'primary') return COLORS.primary;
  if (level === 'secondary') return COLORS.secondary;
  return COLORS.none;
}

function opacityFor(level) {
  if (level === 'primary') return 0.85;
  if (level === 'secondary') return 0.55;
  return 1;
}

// Reusable region — animated fill so transitions feel smooth.
function Region({ level = null, ...rectOrPath }) {
  const isPath = !!rectOrPath.d;
  const props = {
    initial: false,
    animate: { fill: fillFor(level), opacity: opacityFor(level) },
    transition: { duration: 0.35 },
  };
  return isPath ? (
    <motion.path {...rectOrPath} {...props} />
  ) : (
    <motion.rect {...rectOrPath} {...props} rx={rectOrPath.rx ?? 4} />
  );
}

export default function BodyMap({ regions = {}, viewLabels }) {
  const r = (id) => regions[id] || null;
  return (
    <div className="w-full">
      <svg
        viewBox="0 0 340 360"
        className="w-full h-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ──────────────── FRONT VIEW (left half) ──────────────── */}
        <g transform="translate(0, 4)">
          {/* Body outline (head + torso + arms + legs combined silhouette) */}
          <path
            d="M85 28
               c-13 0 -23 10 -23 23
               c0 10 4 17 10 21
               c-3 1 -6 3 -7 6
               l-22 6 c-3 1 -5 3 -5 7
               l0 56 c0 4 2 7 5 8
               l8 2
               l-12 28 c-2 6 -2 11 0 16
               l8 22
               l0 30
               l0 50 c0 4 3 7 7 7
               l9 0 c4 0 7 -3 7 -7
               l0 -50
               l0 -28
               l0 -38
               l2 0
               l0 38
               l0 28
               l0 50 c0 4 3 7 7 7
               l9 0 c4 0 7 -3 7 -7
               l0 -50
               l0 -30
               l8 -22
               c2 -5 2 -10 0 -16
               l-12 -28
               l8 -2 c3 -1 5 -4 5 -8
               l0 -56 c0 -4 -2 -6 -5 -7
               l-22 -6 c-1 -3 -4 -5 -7 -6
               c6 -4 10 -11 10 -21
               c0 -13 -10 -23 -23 -23 z"
            fill={COLORS.bodyFill}
            stroke={COLORS.bodyStroke}
            strokeWidth="0.8"
          />

          {/* Shoulders (front delts) */}
          <Region cx="48" cy="76" r="0" />
          <Region level={r('front-delts')} x="32" y="65" width="20" height="18" rx="9" />
          <Region level={r('front-delts')} x="118" y="65" width="20" height="18" rx="9" />

          {/* Side delts (small caps on outer arm) */}
          <Region level={r('side-delts')} x="26" y="78" width="14" height="14" rx="7" />
          <Region level={r('side-delts')} x="130" y="78" width="14" height="14" rx="7" />

          {/* Chest */}
          <Region level={r('chest')} d="M55 86 q30 -6 60 0 l0 22 q-30 8 -60 0 z" />

          {/* Biceps */}
          <Region level={r('biceps')} x="28" y="92" width="16" height="26" rx="8" />
          <Region level={r('biceps')} x="126" y="92" width="16" height="26" rx="8" />

          {/* Abs */}
          <Region level={r('abs')} d="M68 112 q17 -2 34 0 l-2 38 q-15 4 -30 0 z" />

          {/* Forearms */}
          <Region level={r('forearms')} x="24" y="122" width="14" height="36" rx="7" />
          <Region level={r('forearms')} x="132" y="122" width="14" height="36" rx="7" />

          {/* Hip flexors */}
          <Region level={r('hip-flexors')} d="M68 152 l34 0 l-4 14 q-13 4 -26 0 z" />

          {/* Quads */}
          <Region level={r('quads')} x="60" y="170" width="22" height="58" rx="10" />
          <Region level={r('quads')} x="88" y="170" width="22" height="58" rx="10" />

          {/* Adductors */}
          <Region level={r('adductors')} d="M80 170 l10 0 l-2 36 l-6 0 z" />

          {/* Calves (front shins area = a bit lower) */}
          <Region level={r('calves')} x="60" y="246" width="20" height="44" rx="8" />
          <Region level={r('calves')} x="90" y="246" width="20" height="44" rx="8" />

          <text x="85" y="354" textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.4" letterSpacing="2">
            {viewLabels?.front || 'FRONT'}
          </text>
        </g>

        {/* ──────────────── BACK VIEW (right half) ──────────────── */}
        <g transform="translate(170, 4)">
          <path
            d="M85 28
               c-13 0 -23 10 -23 23
               c0 10 4 17 10 21
               c-3 1 -6 3 -7 6
               l-22 6 c-3 1 -5 3 -5 7
               l0 56 c0 4 2 7 5 8
               l8 2
               l-12 28 c-2 6 -2 11 0 16
               l8 22
               l0 30
               l0 50 c0 4 3 7 7 7
               l9 0 c4 0 7 -3 7 -7
               l0 -50
               l0 -28
               l0 -38
               l2 0
               l0 38
               l0 28
               l0 50 c0 4 3 7 7 7
               l9 0 c4 0 7 -3 7 -7
               l0 -50
               l0 -30
               l8 -22
               c2 -5 2 -10 0 -16
               l-12 -28
               l8 -2 c3 -1 5 -4 5 -8
               l0 -56 c0 -4 -2 -6 -5 -7
               l-22 -6 c-1 -3 -4 -5 -7 -6
               c6 -4 10 -11 10 -21
               c0 -13 -10 -23 -23 -23 z"
            fill={COLORS.bodyFill}
            stroke={COLORS.bodyStroke}
            strokeWidth="0.8"
          />

          {/* Traps */}
          <Region level={r('traps')} d="M70 60 q15 -4 30 0 l-2 16 q-13 3 -26 0 z" />

          {/* Rear delts */}
          <Region level={r('rear-delts')} x="32" y="68" width="20" height="18" rx="9" />
          <Region level={r('rear-delts')} x="118" y="68" width="20" height="18" rx="9" />

          {/* Upper back (rhomboids area) */}
          <Region level={r('upper-back')} d="M58 80 q27 -4 54 0 l-2 18 q-25 4 -50 0 z" />

          {/* Lats */}
          <Region level={r('lats')} d="M52 98 q33 -4 66 0 l-6 42 q-27 5 -54 0 z" />

          {/* Triceps */}
          <Region level={r('triceps')} x="28" y="92" width="16" height="32" rx="8" />
          <Region level={r('triceps')} x="126" y="92" width="16" height="32" rx="8" />

          {/* Forearms (back) */}
          <Region level={r('forearms')} x="24" y="128" width="14" height="30" rx="7" />
          <Region level={r('forearms')} x="132" y="128" width="14" height="30" rx="7" />

          {/* Lower back */}
          <Region level={r('lower-back')} d="M64 142 q21 -2 42 0 l-2 14 q-19 3 -38 0 z" />

          {/* Glutes */}
          <Region level={r('glutes')} d="M58 160 q27 -3 54 0 l-3 26 q-24 4 -48 0 z" />

          {/* Hamstrings */}
          <Region level={r('hamstrings')} x="60" y="190" width="22" height="54" rx="10" />
          <Region level={r('hamstrings')} x="88" y="190" width="22" height="54" rx="10" />

          {/* Calves (back) */}
          <Region level={r('calves')} x="60" y="248" width="20" height="44" rx="8" />
          <Region level={r('calves')} x="90" y="248" width="20" height="44" rx="8" />

          <text x="85" y="354" textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.4" letterSpacing="2">
            {viewLabels?.back || 'BACK'}
          </text>
        </g>
      </svg>
    </div>
  );
}
