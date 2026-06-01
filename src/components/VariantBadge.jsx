import React from 'react';
import { useLang } from '../i18n/index.jsx';
import { demoVariants } from '../data/demoMap.js';

// Returns the human label for a variant — uses the variant's own `label`/`labelZh`
// override if set, otherwise falls back to t(`variant.${key}`).
export function variantLabel(v, t, lang) {
  if (lang === 'zh' && v.labelZh) return v.labelZh;
  if (v.label) return v.label;
  return t(`variant.${v.key}`);
}

// Renders "OR LEG PRESS · BARBELL" style chip when an exercise has > 1 variant.
// `tone` controls colour against dark vs light backgrounds.
export default function VariantBadge({ exerciseId, tone = 'light', className = '' }) {
  const { t, lang } = useLang();
  const variants = demoVariants(exerciseId);
  if (variants.length <= 1) return null;

  const alts = variants.slice(1).map((v) => variantLabel(v, t, lang));

  const palette =
    tone === 'dark'
      ? 'bg-bone-50/10 text-bone-50/80'
      : 'bg-bone-100 dark:bg-ink-700 text-ink-500 dark:text-ink-100';

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.14em] rounded-full px-2 py-0.5 ${palette} ${className}`}
    >
      <span className="opacity-60">{t('variant.or')}</span>
      {alts.join(' · ')}
    </span>
  );
}
