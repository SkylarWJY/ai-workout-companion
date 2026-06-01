import React from 'react';
import BodyMap, { IntensityLegend } from './BodyMap.jsx';
import { useT } from '../i18n/index.jsx';
import { regionLevels } from '../utils/muscleMap.js';

export default function BodyMapSection({ workout }) {
  const t = useT();
  if (!workout) return null;
  const levels = regionLevels(workout);

  // Group hit regions by intensity level for the legend rows
  const byLevel = { 1: [], 2: [], 3: [], 4: [] };
  for (const [id, lvl] of Object.entries(levels)) {
    if (lvl > 0) byLevel[lvl].push(id);
  }

  const intensityLabels = {
    1: t('intensity.light'),
    2: t('intensity.moderate'),
    3: t('intensity.heavy'),
    4: t('intensity.peak'),
  };

  return (
    <section className="px-5 pt-4">
      <div className="text-[11px] uppercase tracking-[0.18em] text-ink-300 dark:text-ink-300 mb-2">
        {t('body.title')}
      </div>
      <div className="rounded-3xl bg-white dark:bg-ink-800 border border-black/5 dark:border-white/5 shadow-card dark:shadow-cardDark p-4">
        <BodyMap
          levels={levels}
          viewLabels={{ front: t('body.front'), back: t('body.back') }}
        />

        <div className="mt-3 pt-3 border-t border-black/5 dark:border-white/5">
          <IntensityLegend labels={intensityLabels} />
        </div>

        <div className="mt-3 space-y-2">
          {[4, 3, 2, 1].map((lvl) => {
            const ids = byLevel[lvl];
            if (!ids.length) return null;
            return (
              <Row
                key={lvl}
                level={lvl}
                label={intensityLabels[lvl]}
                names={ids.map((id) => t(`region.${id}`))}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

const LEVEL_DOT = {
  1: 'bg-[#FBBF24]',
  2: 'bg-[#F97316]',
  3: 'bg-[#EF4444]',
  4: 'bg-[#B91C1C]',
};

function Row({ level, label, names }) {
  return (
    <div className="flex items-start gap-2 text-[12px] leading-tight">
      <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${LEVEL_DOT[level]}`} />
      <div className="flex-1 min-w-0">
        <span className="text-[10px] uppercase tracking-wider text-ink-300 mr-2">
          {label}
        </span>
        <span className="text-ink-700 dark:text-bone-100">{names.join(' · ')}</span>
      </div>
    </div>
  );
}
