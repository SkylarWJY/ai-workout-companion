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

  const parts = tempo.split('-').map((s) => parseInt(s, 10));
  const has4Phase = parts.length === 4 && Number.isFinite(parts[3]);

  // Notation conventions:
  //   3-phase X-Y-Z = lift-hold-lower
  //   4-phase X-Y-Z-W = lower-bottomPause-lift-hold (Poliquin-style, eccentric first)
  let rows;
  if (has4Phase) {
    rows = [
      { color: 'bg-priority-low', label: t('tempo.lower'), icon: '↓', sec: parts[0], cue: cues.lower },
      { color: 'bg-priority-veryhigh', label: t('tempo.bottomPause'), icon: '○', sec: parts[1], cue: cues.bottomPause },
      { color: 'bg-priority-extreme', label: t('tempo.lift'), icon: '↑', sec: parts[2], cue: cues.lift },
      { color: 'bg-priority-high', label: t('tempo.hold'), icon: '◆', sec: parts[3], cue: cues.hold },
    ];
  } else {
    rows = [
      { color: 'bg-priority-extreme', label: t('tempo.lift'), icon: '↑', sec: parts[0], cue: cues.lift },
      { color: 'bg-priority-high', label: t('tempo.hold'), icon: '◆', sec: parts[1], cue: cues.hold },
      { color: 'bg-priority-low', label: t('tempo.lower'), icon: '↓', sec: parts[2], cue: cues.lower },
    ];
  }

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
        {rows.map((r, i) => (
          <PhaseRow
            key={i}
            color={r.color}
            label={r.label}
            seconds={r.sec}
            unit={t('tempo.sec')}
            cue={r.cue}
            icon={r.icon}
          />
        ))}
      </div>

      <div className="mt-3 text-[10px] uppercase tracking-wider text-ink-300 text-right">
        {has4Phase ? t('tempo.format4') : t('tempo.format')}
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
