import React from 'react';

// Tiny inline SVG glyphs for the variant chip. Helps users spot
// "machine" vs "cable" vs "dumbbell" at a glance.
// `kind` matches the variant.key in demoMap.js.
export default function VariantIcon({ kind, size = 13 }) {
  const w = size, h = size;
  switch (kind) {
    case 'dumbbell':
    case 'dumbbell-paused':
    case 'dumbbell-rdl':
      return (
        <svg width={w} height={h} viewBox="0 0 24 24" fill="none">
          <rect x="2" y="9" width="2" height="6" rx="0.6" fill="currentColor" />
          <rect x="4" y="7" width="2" height="10" rx="0.6" fill="currentColor" />
          <rect x="6" y="11" width="12" height="2" rx="0.6" fill="currentColor" />
          <rect x="18" y="7" width="2" height="10" rx="0.6" fill="currentColor" />
          <rect x="20" y="9" width="2" height="6" rx="0.6" fill="currentColor" />
        </svg>
      );
    case 'machine':
    case 'leg-press':
    case 'leg-curl':
    case 'leg-extension':
    case 'hack':
    case 'smith':
    case 'pec-deck':
    case 'machine-row':
      return (
        <svg width={w} height={h} viewBox="0 0 24 24" fill="none">
          <rect x="3" y="6" width="18" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.8" fill="none" />
          <circle cx="8.5" cy="12" r="1.5" fill="currentColor" />
          <rect x="12.5" y="9" width="6" height="1.6" rx="0.8" fill="currentColor" />
          <rect x="12.5" y="13.5" width="4" height="1.6" rx="0.8" fill="currentColor" />
        </svg>
      );
    case 'cable':
    case 'cable-tricep':
    case 'cable-fly':
    case 'rope':
    case 'rope-pushdown':
    case 'face-pull':
      return (
        <svg width={w} height={h} viewBox="0 0 24 24" fill="none">
          <path d="M5 3v6c0 4 5 4 7 6s3 6 3 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" fill="none" />
          <circle cx="5" cy="3" r="1.4" fill="currentColor" />
          <rect x="13" y="19" width="4" height="2" rx="0.7" fill="currentColor" />
        </svg>
      );
    case 'barbell':
    case 'barbell-back':
    case 'barbell-front':
    case 'barbell-rdl':
      return (
        <svg width={w} height={h} viewBox="0 0 24 24" fill="none">
          <rect x="1" y="11" width="2.5" height="2" rx="0.6" fill="currentColor" />
          <rect x="3.5" y="10" width="2" height="4" rx="0.6" fill="currentColor" />
          <rect x="5.5" y="11.4" width="13" height="1.2" rx="0.6" fill="currentColor" />
          <rect x="18.5" y="10" width="2" height="4" rx="0.6" fill="currentColor" />
          <rect x="20.5" y="11" width="2.5" height="2" rx="0.6" fill="currentColor" />
        </svg>
      );
    case 'assisted':
    case 'pull-up':
    case 'chin-up':
      return (
        <svg width={w} height={h} viewBox="0 0 24 24" fill="none">
          <rect x="3" y="4" width="18" height="1.6" rx="0.6" fill="currentColor" />
          <path d="M10 5.6V11M14 5.6V11M10 11h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="12" cy="14" r="2" fill="currentColor" />
        </svg>
      );
    case 'kettlebell':
      return (
        <svg width={w} height={h} viewBox="0 0 24 24" fill="none">
          <path d="M9 5.5h6c0 1.5 1 2 1 3a6 6 0 1 1-8 0c0-1 1-1.5 1-3z" stroke="currentColor" strokeWidth="1.7" fill="none" />
        </svg>
      );
    case 'bodyweight':
    case 'plank':
    case 'leg-raise':
      return (
        <svg width={w} height={h} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="6" r="2" stroke="currentColor" strokeWidth="1.7" />
          <path d="M12 9v6M9 18l3-3 3 3M9 11l3 1 3-1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      );
    default:
      // Generic dot — never empty.
      return (
        <svg width={w} height={h} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="3" fill="currentColor" />
        </svg>
      );
  }
}
