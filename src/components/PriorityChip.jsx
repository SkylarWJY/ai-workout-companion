import React from 'react';
import { useT } from '../i18n/index.jsx';

const DOT_COLOR = {
  extreme: 'bg-priority-extreme',
  veryhigh: 'bg-priority-veryhigh',
  high: 'bg-priority-high',
  moderate: 'bg-priority-moderate',
  low: 'bg-priority-low',
};

export default function PriorityChip({ priority, compact = false }) {
  const t = useT();
  return (
    <span
      className={`inline-flex items-center gap-1.5 ${
        compact ? 'text-[10px]' : 'text-[11px]'
      } font-medium tracking-wide uppercase text-ink-400 dark:text-ink-200`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${DOT_COLOR[priority] || 'bg-ink-300'}`} />
      {compact ? t(`priority.${priority}`).split(' ')[0] : t(`priority.${priority}`)}
    </span>
  );
}
