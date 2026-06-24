import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useLang, locEx } from '../../i18n/index.jsx';
import { useOverrides } from '../../hooks/useOverrides.jsx';
import { useLocalStorage } from '../../hooks/useLocalStorage.js';
import { demoVariants, resolveVariantContent } from '../../data/demoMap.js';
import { resolveMeta } from '../../data/exerciseMeta.js';
import { progressTrend } from '../../utils/progression.js';
import { lastLogsByVariant } from '../../utils/historyLookup.js';
import { convertWeight } from '../../utils/weight.js';
import { springs, tints } from '../theme.js';
import Sheet from './Sheet.jsx';
import Chip from './Chip.jsx';
import VolumeChart from './VolumeChart.jsx';
import TempoBlock from './TempoBlock.jsx';
import VariantIcon from './VariantIcon.jsx';
import ProgressHero from './ProgressHero.jsx';
import ExerciseEditSheet from './ExerciseEditSheet.jsx';
import { videoKey, getVideoObjectUrl } from '../../utils/videoStorage.js';

const PRIORITY_TINT = {
  extreme:  tints.red,
  veryhigh: tints.orange,
  high:     tints.orange,
  moderate: tints.mint,
  low:      tints.blue,
};

export default function ExerciseModal({ open, exercise, onClose }) {
  const [editOpen, setEditOpen] = React.useState(false);
  return (
    <>
      <Sheet open={open && !!exercise} onClose={onClose} title="" height="tall">
        {exercise && (
          <ModalBody
            exercise={exercise}
            onClose={onClose}
            onEdit={() => setEditOpen(true)}
          />
        )}
      </Sheet>
      <ExerciseEditSheet
        open={editOpen}
        exercise={exercise}
        onClose={() => setEditOpen(false)}
      />
    </>
  );
}

function ModalBody({ exercise, onEdit }) {
  const { t, lang } = useLang();
  const { overrides, weightUnit } = useOverrides();
  const [history] = useLocalStorage('atlas.history', {});

  const variants = useMemo(() => demoVariants(exercise.id), [exercise.id]);
  const [variantIdx, setVariantIdx] = useState(0);
  useEffect(() => { setVariantIdx(0); }, [exercise.id]);

  // Skip the editorial ★ Best Pick when present — it's a curated combo,
  // not a swappable variant.
  const selectableVariants = useMemo(
    () => variants.filter((v) => !v.isBestPick),
    [variants],
  );

  const variant = selectableVariants[variantIdx] || variants[0];

  const baseMeta = resolveMeta(exercise.id, variant);
  const exOverrides = overrides.exercise?.[exercise.id];
  // Resolution priority for the displayed tutorial video:
  //   1. Per-variant LOCAL upload  (overrides.exercise.X.localVideoByVariant[key])
  //   2. Per-variant YouTube       (overrides.exercise.X.youtubeIdByVariant[key])
  //   3. Legacy exercise-level YouTube (pre-v0.6) — only for variant index 0
  //   4. Variant's bundled YouTube (demoMap.js)
  //   5. Base exerciseMeta youtubeId
  const variantKey = variant?.key;
  const perVariantYt = variantKey ? exOverrides?.youtubeIdByVariant?.[variantKey] : null;
  const localMeta = variantKey ? exOverrides?.localVideoByVariant?.[variantKey] : null;
  const legacyYt = variantIdx === 0 ? exOverrides?.youtubeId : null;
  const meta = baseMeta && {
    ...baseMeta,
    youtubeId: perVariantYt || legacyYt || baseMeta.youtubeId,
    tempo: exOverrides?.tempo || baseMeta.tempo,
  };

  // Resolve the local video blob into a playable object URL.
  const [localUrl, setLocalUrl] = React.useState(null);
  React.useEffect(() => {
    if (!localMeta) { setLocalUrl(null); return; }
    let cancelled = false;
    let created = null;
    getVideoObjectUrl(videoKey('exercise', exercise.id, variantKey)).then((url) => {
      if (cancelled) { if (url) URL.revokeObjectURL(url); return; }
      created = url;
      setLocalUrl(url);
    });
    return () => { cancelled = true; if (created) URL.revokeObjectURL(created); setLocalUrl(null); };
  }, [exercise.id, variantKey, localMeta?.ts]);

  const content = resolveVariantContent(exercise, variant, lang, locEx);
  const name = content?.name || locEx(exercise, 'name', lang);
  const howTo = content?.howTo || locEx(exercise, 'howTo', lang) || [];
  const tips  = content?.tips  || locEx(exercise, 'tips', lang)  || [];
  const mistakes = content?.commonMistakes || locEx(exercise, 'commonMistakes', lang) || [];
  const why = content?.whyItMatters || locEx(exercise, 'whyItMatters', lang) || '';

  const lastByVariant = useMemo(
    () => lastLogsByVariant(history, exercise.id),
    [history, exercise.id],
  );
  const refLog = (variant?.key && lastByVariant[variant.key]) || lastByVariant.default || null;

  const trend = useMemo(
    () => progressTrend({
      history,
      exerciseId: exercise.id,
      variantKey: variant?.key,
      currentUnit: weightUnit,
    }),
    [history, exercise.id, variant?.key, weightUnit],
  );

  const prioTint = PRIORITY_TINT[exercise.priority] || tints.mint;

  return (
    <div className="px-5 pb-8 pt-1">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <Chip size="sm" tint={prioTint}>
            {t(`priority.${exercise.priority}`)}
          </Chip>
          <h2 className="v2-display text-[28px] leading-[1.05] mt-2 v2-t1">{name}</h2>
          <div className="v2-body text-[13px] v2-t2 mt-1">
            {exercise.sets} × {exercise.repRange}
            {exercise.restSeconds ? ` · ${exercise.restSeconds}s rest` : ''}
          </div>
        </div>
        <motion.button
          type="button"
          whileTap={{ scale: 0.92 }}
          transition={springs.press}
          onClick={onEdit}
          aria-label="Edit exercise"
          className="shrink-0 w-9 h-9 rounded-full grid place-items-center"
          style={{ background: 'var(--hairline-strong)', color: 'var(--label-1)' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M12 20h9M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.button>
      </div>

      {/* Variant chips */}
      {selectableVariants.length > 1 && (
        <div className="mt-4 flex items-center gap-1.5 overflow-x-auto scroll-clean -mx-5 px-5 pb-1">
          {selectableVariants.map((v, i) => {
            const label =
              v.label && lang !== 'zh'
                ? v.label
                : v.labelZh && lang === 'zh'
                  ? v.labelZh
                  : t(`variant.${v.key}`);
            return (
              <Chip
                key={v.key || i}
                size="md"
                variant="ghost"
                selected={i === variantIdx}
                onClick={() => setVariantIdx(i)}
              >
                <VariantIcon kind={v.key} size={12} />
                {label}
              </Chip>
            );
          })}
        </div>
      )}

      {/* Tutorial player — local upload wins; otherwise YouTube thumbnail card. */}
      {localUrl ? (
        <div className="mt-4 rounded-3xl overflow-hidden relative" style={{ aspectRatio: '16/9' }}>
          <video
            src={localUrl}
            controls
            playsInline
            className="w-full h-full object-cover"
          />
          <Chip size="sm" tint={tints.green} className="absolute top-3 left-3">
            {lang === 'zh' ? '我的视频' : 'Your video'}
          </Chip>
        </div>
      ) : meta?.youtubeId ? (
        <a
          href={`https://www.youtube.com/watch?v=${meta.youtubeId}`}
          target="_blank"
          rel="noreferrer"
          className="mt-4 block rounded-3xl overflow-hidden relative"
          style={{ aspectRatio: '16/9' }}
        >
          <img
            src={`https://i.ytimg.com/vi/${meta.youtubeId}/hqdefault.jpg`}
            alt=""
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.18), rgba(0,0,0,0.5))' }}
          >
            <motion.span
              whileTap={{ scale: 0.92 }}
              transition={springs.press}
              className="w-16 h-16 rounded-full grid place-items-center"
              style={{ background: 'rgba(255,255,255,0.96)' }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#000">
                <path d="M8 5v14l11-7L8 5z" />
              </svg>
            </motion.span>
          </div>
          {perVariantYt && (
            <Chip size="sm" tint={tints.blue} className="absolute top-3 left-3">
              {lang === 'zh' ? '自定义' : 'Custom'}
            </Chip>
          )}
          <div
            className="absolute bottom-0 inset-x-0 px-4 py-2.5 text-white v2-caption text-[10px] tracking-[0.16em]"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75), transparent)' }}
          >
            {lang === 'zh' ? '在 YouTube 看完整教程' : 'Open YouTube tutorial'}
          </div>
        </a>
      ) : null}

      {/* Progress hero — big animated chart with count-up + tracker */}
      <section className="mt-6">
        <div className="v2-caption v2-t2 mb-2">
          {lang === 'zh' ? '进步曲线' : 'Your progress'}
        </div>
        <ProgressHero points={trend.points} unit={weightUnit} lang={lang} />
      </section>

      {/* Why it matters */}
      {why && (
        <section className="mt-6">
          <div className="v2-caption v2-t2 mb-2">
            {lang === 'zh' ? '为什么这个动作重要' : 'Why this matters'}
          </div>
          <div className="v2-card-flat p-4">
            <p className="v2-body text-[14px] v2-t1 leading-relaxed">{why}</p>
          </div>
        </section>
      )}

      {/* How-to */}
      {howTo.length > 0 && (
        <section className="mt-6">
          <div className="v2-caption v2-t2 mb-2">{lang === 'zh' ? '怎么做' : 'How to'}</div>
          <ol className="v2-card-flat p-4 space-y-2.5">
            {howTo.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span
                  className="shrink-0 w-6 h-6 rounded-full grid place-items-center v2-num text-[11px] font-semibold"
                  style={{ background: 'var(--hairline-strong)', color: 'var(--label-1)' }}
                >
                  {i + 1}
                </span>
                <span className="v2-body text-[13.5px] v2-t1 leading-relaxed flex-1">{step}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Tempo */}
      {meta && meta.tempo && meta.tempoCues && (
        <section className="mt-6">
          <TempoBlock
            exerciseId={exercise.id}
            variantKey={variant?.key}
            tempo={meta.tempo}
            tempoCues={meta.tempoCues}
            isStatic={meta.isStatic}
          />
        </section>
      )}

      {/* Common mistakes */}
      {mistakes.length > 0 && (
        <section className="mt-6">
          <div className="v2-caption v2-t2 mb-2">
            {lang === 'zh' ? '常见错误' : 'Common mistakes'}
          </div>
          <ul className="v2-card-flat p-4 space-y-2">
            {mistakes.map((m, i) => (
              <li key={i} className="flex gap-3">
                <span className="shrink-0 mt-0.5 w-1.5 h-1.5 rounded-full" style={{ background: tints.red }} />
                <span className="v2-body text-[13.5px] v2-t1 leading-relaxed flex-1">{m}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Tips */}
      {tips.length > 0 && (
        <section className="mt-6">
          <div className="v2-caption v2-t2 mb-2">{lang === 'zh' ? '小贴士' : 'Pro tips'}</div>
          <ul className="v2-card-flat p-4 space-y-2">
            {tips.map((tp, i) => (
              <li key={i} className="flex gap-3">
                <span className="shrink-0 mt-0.5 w-1.5 h-1.5 rounded-full" style={{ background: tints.green }} />
                <span className="v2-body text-[13.5px] v2-t1 leading-relaxed flex-1">{tp}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Joint-friendly tags */}
      {(exercise.kneeFriendly || exercise.lowerBackFriendly) && (
        <section className="mt-6 flex gap-2 flex-wrap">
          {exercise.kneeFriendly && (
            <Chip size="sm" tint={tints.green}>
              {lang === 'zh' ? '护膝盖' : 'Knee-friendly'}
            </Chip>
          )}
          {exercise.lowerBackFriendly && (
            <Chip size="sm" tint={tints.green}>
              {lang === 'zh' ? '护下背' : 'Lower-back friendly'}
            </Chip>
          )}
        </section>
      )}

      {refLog && (
        <section className="mt-6 v2-card-flat p-4">
          <div className="v2-caption v2-t2">{lang === 'zh' ? '你上次' : 'Your last set'}</div>
          <div className="mt-1.5 v2-display text-[20px] v2-numeric v2-t1">
            {convertWeight(refLog.weight, refLog.weightUnit || weightUnit, weightUnit)} {weightUnit}
            <span className="v2-body text-[14px] v2-t3"> × {refLog.reps}</span>
            <span className="v2-body text-[14px] v2-t3"> · {refLog.difficulty}</span>
          </div>
        </section>
      )}
    </div>
  );
}
