import React from 'react';
import BodyMap from './BodyMap.jsx';
import { useT } from '../i18n/index.jsx';
import { aggregateRegions } from '../utils/muscleMap.js';

export default function BodyMapSection({ workout }) {
  const t = useT();
  if (!workout) return null;
  const regions = aggregateRegions(workout);
  const primaries = Object.entries(regions)
    .filter(([, l]) => l === 'primary')
    .map(([id]) => id);
  const secondaries = Object.entries(regions)
    .filter(([, l]) => l === 'secondary')
    .map(([id]) => id);

  return (
    <section className="px-5 pt-4">
      <div className="text-[11px] uppercase tracking-[0.18em] text-ink-300 dark:text-ink-300 mb-2">
        {t('body.title')}
      </div>
      <div className="rounded-3xl bg-white dark:bg-ink-800 border border-black/5 dark:border-white/5 shadow-card dark:shadow-cardDark p-4">
        <div className="text-ink-700 dark:text-bone-100">
          <BodyMap
            regions={regions}
            viewLabels={{ front: t('body.front'), back: t('body.back') }}
          />
        </div>

        <div className="mt-3 space-y-2">
          {primaries.length > 0 && (
            <Row
              dotClass="bg-priority-extreme"
              label={t('body.legend.primary')}
              names={primaries.map((id) => t(`region.${id}`))}
            />
          )}
          {secondaries.length > 0 && (
            <Row
              dotClass="bg-priority-veryhigh"
              label={t('body.legend.secondary')}
              names={secondaries.map((id) => t(`region.${id}`))}
            />
          )}
        </div>
      </div>
    </section>
  );
}

function Row({ dotClass, label, names }) {
  return (
    <div className="flex items-start gap-2 text-[12px] leading-tight">
      <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${dotClass}`} />
      <div className="flex-1 min-w-0">
        <span className="text-[10px] uppercase tracking-wider text-ink-300 mr-2">
          {label}
        </span>
        <span className="text-ink-700 dark:text-bone-100">{names.join(' · ')}</span>
      </div>
    </div>
  );
}
