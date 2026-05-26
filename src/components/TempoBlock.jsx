import React from 'react';
import { useT, useLang } from '../i18n/index.jsx';
import { tempoCuesZh } from '../i18n/exerciseMetaZh.js';

export default function TempoBlock({ exerciseId, variantKey, tempo, tempoCues, isStatic }) {
  const t = useT();
  const { lang } = useLang();

  if (!tempo || !tempoCues) return null;

  // resolve ZH cues if needed
  const cues =
    lang === 'zh'
      ? tempoCuesZh(exerciseId, variantKey) || tempoCues
      : tempoCues;

  if (isStatic || tempo === 'Static') {
    return (
      <div className="rounded-2xl bg-bone-100 dark:bg-ink-700 border border-black/5 dark:border-white/5 p-4">
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-[11px] uppercase tracking-[0.18em] text-ink-300">
            {t('tempo.label')}
          </span>
          <span className="text-[13px] font-semibold text-ink-900 dark:text-bone-100">
            {t('tempo.static')}
          </span>
        </div>
        <p className="text-[13px] leading-relaxed text-ink-700 dark:text-bone-100">
          {cues.lift}
        </p>
        <p className="text-[12px] mt-1 text-ink-400 dark:text-ink-200">
          {cues.hold}
        </p>
      </div>
    );
  }

  const [liftSec, holdSec, lowerSec] = tempo.split('-').map((s) => parseInt(s, 10));

  return (
    <div className="rounded-2xl bg-bone-100 dark:bg-ink-700 border border-black/5 dark:border-white/5 p-4">
      <div className="flex items-baseline justify-between mb-3">
        <span className="text-[11px] uppercase tracking-[0.18em] text-ink-300">
          {t('tempo.label')}
        </span>
        <span className="text-[15px] font-semibold tabular text-ink-900 dark:text-bone-100">
          {tempo}
        </span>
      </div>

      <div className="space-y-2">
        <PhaseRow
          color="bg-priority-extreme"
          label={t('tempo.lift')}
          seconds={liftSec}
          unit={t('tempo.sec')}
          cue={cues.lift}
          icon="↑"
        />
        <PhaseRow
          color="bg-priority-high"
          label={t('tempo.hold')}
          seconds={holdSec}
          unit={t('tempo.sec')}
          cue={cues.hold}
          icon="◆"
        />
        <PhaseRow
          color="bg-priority-low"
          label={t('tempo.lower')}
          seconds={lowerSec}
          unit={t('tempo.sec')}
          cue={cues.lower}
          icon="↓"
        />
      </div>

      <div className="mt-3 text-[10px] uppercase tracking-wider text-ink-300 text-right">
        {t('tempo.format')}
      </div>
    </div>
  );
}

function PhaseRow({ color, label, seconds, unit, cue, icon }) {
  return (
    <div className="flex items-start gap-3">
      <span
        className={`shrink-0 mt-0.5 w-7 h-7 rounded-full ${color} text-bone-50 dark:text-ink-900 text-[12px] font-semibold flex items-center justify-center`}
      >
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="text-[11px] uppercase tracking-wider text-ink-400 dark:text-ink-200">
            {label}
          </span>
          <span className="text-[12px] font-semibold tabular text-ink-900 dark:text-bone-100">
            {seconds}
            {unit}
          </span>
        </div>
        <div className="text-[12.5px] text-ink-700 dark:text-bone-100 leading-snug mt-0.5">
          {cue}
        </div>
      </div>
    </div>
  );
}
