import React from 'react';
import { useT } from '../i18n/index.jsx';
import { demoVariants } from '../data/demoMap.js';

// Renders "OR MACHINE · BARBELL" style chip when an exercise has > 1 variant.
// `tone` controls colour against dark vs light backgrounds.
export default function VariantBadge({ exerciseId, tone = 'light', className = '' }) {
  const t = useT();
  const variants = demoVariants(exerciseId);
  if (variants.length <= 1) return null;

  const alts = variants.slice(1).map((v) => t(`variant.${v.key}`));

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
