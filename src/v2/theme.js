// v2 — motion + token primitives shared across every screen.
// Centralize so a tweak to spring stiffness ripples everywhere.

// Apple-flavored spring presets. These match the curves Apple uses in
// SwiftUI's `.spring(response:dampingFraction:)` for: sheets (response 0.5,
// damping 0.85), interactive controls (0.32, 0.9), and bouncy entrances
// (0.6, 0.75). Framer Motion takes (stiffness, damping, mass) — derived
// here so we don't get cargo-culted magic numbers in every component.
export const springs = {
  sheet:   { type: 'spring', stiffness: 280, damping: 32,  mass: 1 },     // bottom sheet present/dismiss
  press:   { type: 'spring', stiffness: 700, damping: 32,  mass: 0.6 },   // tap micro-bounce
  page:    { type: 'spring', stiffness: 220, damping: 30,  mass: 1 },     // screen-to-screen
  pop:     { type: 'spring', stiffness: 380, damping: 24,  mass: 0.8 },   // hero element pop-in
  smooth:  { type: 'spring', stiffness: 160, damping: 28,  mass: 1 },     // generic layout
};

// Cubic-bezier easings for opacity-only transitions where springs feel wrong.
export const eases = {
  out:  [0.2, 0.8, 0.2, 1.0],
  in:   [0.4, 0.0, 1.0, 1.0],
  inOut: [0.4, 0.0, 0.2, 1.0],
};

// Stagger for list reveals.
export const stagger = { delayChildren: 0.04, staggerChildren: 0.04 };

// Apple system tint hex codes — synced with index.css :root.
export const tints = {
  blue:   '#0A84FF',
  indigo: '#5E5CE6',
  green:  '#30D158',
  orange: '#FF9F0A',
  red:    '#FF453A',
  mint:   '#66D4CF',
  pink:   '#FF375F',
};

// Map a recommendation `kind` from progression.js to a visual tint.
// Used by Logger banner + Dashboard row chip.
export function tintForKind(kind) {
  if (kind === 'bigBump' || kind === 'smallBump' || kind === 'easyAtTop') return tints.green;
  if (kind === 'holdAtTop') return tints.blue;
  if (kind === 'maintain') return tints.mint;
  if (kind === 'deload') return tints.orange;
  return tints.blue;
}

// One-liner that says what the recommendation IS in plain words.
// Pairs with the longer `reasoning` text from progression.js.
// Tight one-or-two-word labels that fit the right column without
// truncation on a 390-wide phone. The longer "Why?" sentence is in
// the Logger banner — Dashboard rows are scannable headlines only.
export const KIND_LABEL = {
  bigBump:   'Load up',
  smallBump: 'Bump up',
  easyAtTop: 'Bump up',
  holdAtTop: 'Hold + push',
  maintain:  'Push reps',
  deload:    'De-load',
};

export const KIND_LABEL_ZH = {
  bigBump:   '加重',
  smallBump: '加重',
  easyAtTop: '加重',
  holdAtTop: '保持·冲 reps',
  maintain:  '冲 reps',
  deload:    '减重',
};
