import React from 'react';
import { motion } from 'framer-motion';
import BodyMap, { IntensityLegend } from '../../components/BodyMap.jsx';
import { useLang } from '../../i18n/index.jsx';
import { regionLevels } from '../../utils/muscleMap.js';
import { springs } from '../theme.js';

// Wraps the v0.8 anatomical body map (body-muscles library) inside a v2
// glass card. Shows which muscles today's workout hits + per-level
// callouts. Reads i18n region labels from the same dictionary v0.8 uses
// so localized names stay one source of truth.
export default function BodyMapCard({ workout }) {
  const { t, lang } = useLang();
  if (!workout) return null;
  const levels = regionLevels(workout);
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
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springs.smooth}
      className="mt-8"
    >
      <div className="v2-caption v2-t2 mb-2">
        {lang === 'zh' ? '今日训练肌群' : 'Muscles trained'}
      </div>

      <div className="v2-card p-4">
        <BodyMap
          levels={levels}
          viewLabels={{
            front: lang === 'zh' ? '正面' : 'FRONT',
            back: lang === 'zh' ? '背面' : 'BACK',
          }}
        />

        <div className="mt-3 pt-3 v2-hairline" />
        <div className="mt-3">
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
    </motion.section>
  );
}

const LEVEL_DOT = {
  1: '#FBBF24',
  2: '#F97316',
  3: '#EF4444',
  4: '#B91C1C',
};

function Row({ level, label, names }) {
  return (
    <div className="flex items-start gap-2 text-[12px] leading-tight">
      <span
        className="mt-1.5 w-2 h-2 rounded-full shrink-0"
        style={{ background: LEVEL_DOT[level] }}
      />
      <div className="flex-1 min-w-0">
        <span className="v2-caption v2-t3 text-[9px] mr-2">{label}</span>
        <span className="v2-t1">{names.join(' · ')}</span>
      </div>
    </div>
  );
}
