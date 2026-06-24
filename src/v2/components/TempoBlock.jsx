import React from 'react';
import { useLang } from '../../i18n/index.jsx';
import { tempoCuesZh } from '../../i18n/exerciseMetaZh.js';
import { tints } from '../theme.js';

// v2 tempo block — same data contract as v0.8 but theme-aware glass card.
//   tempo = "2-1-2" or "2-1-2-1" notation
//   tempoCues = { lift, hold, lower, bottomPause }
//   isStatic flips into "Static" mode (planks, etc.)
export default function TempoBlock({ exerciseId, variantKey, tempo, tempoCues, isStatic }) {
  const { lang } = useLang();
  if (!tempo || !tempoCues) return null;

  const cues =
    lang === 'zh'
      ? tempoCuesZh(exerciseId, variantKey) || tempoCues
      : tempoCues;

  if (isStatic || tempo === 'Static') {
    return (
      <div className="v2-card-flat p-4">
        <div className="flex items-baseline justify-between mb-2">
          <span className="v2-caption v2-t2">{lang === 'zh' ? '节奏' : 'TEMPO'}</span>
          <span className="v2-title text-[13px] v2-t1">
            {lang === 'zh' ? '静态保持' : 'Static hold'}
          </span>
        </div>
        <p className="v2-body text-[13px] v2-t1 leading-relaxed">{cues.lift}</p>
        <p className="v2-body text-[12px] v2-t3 mt-1">{cues.hold}</p>
      </div>
    );
  }

  const parts = tempo.split('-').map((s) => parseInt(s, 10));
  const has4Phase = parts.length === 4 && Number.isFinite(parts[3]);

  let rows;
  if (has4Phase) {
    rows = [
      { color: tints.blue,   label: lang === 'zh' ? '下降' : 'Lower',       icon: '↓', sec: parts[0], cue: cues.lower },
      { color: tints.orange, label: lang === 'zh' ? '底部暂停' : 'Bottom pause', icon: '○', sec: parts[1], cue: cues.bottomPause },
      { color: tints.red,    label: lang === 'zh' ? '上推' : 'Lift',        icon: '↑', sec: parts[2], cue: cues.lift },
      { color: tints.mint,   label: lang === 'zh' ? '顶端' : 'Top hold',    icon: '◆', sec: parts[3], cue: cues.hold },
    ];
  } else {
    rows = [
      { color: tints.red,  label: lang === 'zh' ? '上推' : 'Lift',  icon: '↑', sec: parts[0], cue: cues.lift },
      { color: tints.mint, label: lang === 'zh' ? '顶端' : 'Hold',  icon: '◆', sec: parts[1], cue: cues.hold },
      { color: tints.blue, label: lang === 'zh' ? '下降' : 'Lower', icon: '↓', sec: parts[2], cue: cues.lower },
    ];
  }

  return (
    <div className="v2-card-flat p-4">
      <div className="flex items-baseline justify-between mb-3">
        <span className="v2-caption v2-t2">{lang === 'zh' ? '节奏' : 'TEMPO'}</span>
        <span className="v2-display v2-numeric text-[16px] v2-t1">{tempo}</span>
      </div>
      <div className="space-y-2">
        {rows.map((r, i) => (
          <div key={i} className="flex items-start gap-3">
            <span
              className="shrink-0 mt-0.5 w-7 h-7 rounded-full text-[12px] font-semibold flex items-center justify-center"
              style={{ background: r.color, color: '#000' }}
            >
              {r.icon}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="v2-caption v2-t2">{r.label}</span>
                <span className="v2-num text-[12px] font-semibold v2-t1">
                  {r.sec}{lang === 'zh' ? '秒' : 's'}
                </span>
              </div>
              <div className="v2-body text-[12.5px] v2-t1 leading-snug mt-0.5">{r.cue}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
