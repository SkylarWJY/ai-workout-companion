import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useLang, locEx } from '../../i18n/index.jsx';
import { useOverrides } from '../../hooks/useOverrides.jsx';
import { demoVariants } from '../../data/demoMap.js';
import { resolveMeta } from '../../data/exerciseMeta.js';
import { videoKey, putVideo, deleteVideo, formatBytes } from '../../utils/videoStorage.js';
import { springs, tints } from '../theme.js';
import Sheet from './Sheet.jsx';
import PrimaryButton from './PrimaryButton.jsx';
import Chip from './Chip.jsx';
import VariantIcon from './VariantIcon.jsx';

// Per-exercise editor. Mounts inside a v2 sheet over the exercise modal.
// User can:
//   - Override the YouTube tutorial ID per variant
//   - Upload a local video file per variant (stored in IndexedDB)
//   - Override suggested-weight string + tempo notation
//
// Reads/writes overrides.exercise.{exerciseId}.{youtubeIdByVariant|localVideoByVariant|suggestedWeight|tempo}.
export default function ExerciseEditSheet({ open, exercise, onClose }) {
  return (
    <Sheet
      open={open && !!exercise}
      onClose={onClose}
      title=""
      height="tall"
    >
      {exercise && <EditBody exercise={exercise} onClose={onClose} />}
    </Sheet>
  );
}

function EditBody({ exercise, onClose }) {
  const { t, lang } = useLang();
  const { overrides, setExerciseField, clearOverride } = useOverrides();

  const variants = useMemo(
    () => demoVariants(exercise.id).filter((v) => !v.isBestPick),
    [exercise.id],
  );
  const exOv = overrides.exercise?.[exercise.id] || {};
  const ytById = exOv.youtubeIdByVariant || {};
  const localById = exOv.localVideoByVariant || {};

  const [draftYt, setDraftYt] = useState({ ...ytById });
  const [draftLocal, setDraftLocal] = useState({ ...localById });
  const [suggested, setSuggested] = useState(exOv.suggestedWeight ?? exercise.suggestedWeight ?? '');
  const [tempo, setTempo] = useState(exOv.tempo ?? '');

  useEffect(() => {
    setDraftYt({ ...ytById });
    setDraftLocal({ ...localById });
    setSuggested(exOv.suggestedWeight ?? exercise.suggestedWeight ?? '');
    setTempo(exOv.tempo ?? '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise.id]);

  const handleFile = async (variantKey, file) => {
    if (!file) return;
    const key = videoKey('exercise', exercise.id, variantKey);
    await putVideo(key, file);
    setDraftLocal((prev) => ({
      ...prev,
      [variantKey]: { filename: file.name, sizeBytes: file.size, type: file.type, ts: Date.now() },
    }));
  };

  const handleRemoveFile = async (variantKey) => {
    const key = videoKey('exercise', exercise.id, variantKey);
    await deleteVideo(key);
    setDraftLocal((prev) => {
      const next = { ...prev };
      delete next[variantKey];
      return next;
    });
  };

  const save = () => {
    // Per-variant YouTube ID map
    const cleanYt = Object.fromEntries(
      Object.entries(draftYt).filter(([, v]) => v && v.trim()).map(([k, v]) => [k, extractYouTubeId(v)]),
    );
    if (Object.keys(cleanYt).length) {
      setExerciseField(exercise.id, 'youtubeIdByVariant', cleanYt);
    } else {
      clearOverride('exercise', exercise.id, 'youtubeIdByVariant');
    }
    if (Object.keys(draftLocal).length) {
      setExerciseField(exercise.id, 'localVideoByVariant', draftLocal);
    } else {
      clearOverride('exercise', exercise.id, 'localVideoByVariant');
    }
    if (suggested && suggested !== exercise.suggestedWeight) {
      setExerciseField(exercise.id, 'suggestedWeight', suggested);
    } else {
      clearOverride('exercise', exercise.id, 'suggestedWeight');
    }
    if (tempo && tempo.trim()) {
      setExerciseField(exercise.id, 'tempo', tempo.trim());
    } else {
      clearOverride('exercise', exercise.id, 'tempo');
    }
    onClose();
  };

  const reset = () => {
    clearOverride('exercise', exercise.id, 'youtubeIdByVariant');
    clearOverride('exercise', exercise.id, 'localVideoByVariant');
    clearOverride('exercise', exercise.id, 'suggestedWeight');
    clearOverride('exercise', exercise.id, 'tempo');
    onClose();
  };

  return (
    <div className="px-5 pt-1 pb-8 space-y-6">
      <header>
        <div className="v2-caption v2-t3 text-[10px]">{lang === 'zh' ? '编辑动作' : 'EDIT EXERCISE'}</div>
        <h2 className="v2-display text-[24px] v2-t1 leading-tight mt-1">
          {locEx(exercise, 'name', lang)}
        </h2>
        <p className="v2-body text-[12.5px] v2-t3 mt-1">
          {lang === 'zh'
            ? '换成你喜欢的博主视频，或者上传自己拍的教学。改了也只对你自己生效。'
            : 'Swap in your favorite tutorial channel or upload your own form video. Changes only affect this device.'}
        </p>
      </header>

      {/* Per-variant video controls */}
      <section>
        <div className="v2-caption v2-t2 mb-2">
          {lang === 'zh' ? '教学视频（每个变体）' : 'Tutorial video (per variant)'}
        </div>
        <div className="v2-card-flat divide-y" style={{ '--tw-divide-opacity': 1 }}>
          {variants.map((v) => (
            <VariantRow
              key={v.key}
              variant={v}
              exerciseId={exercise.id}
              ytValue={draftYt[v.key] ?? ''}
              onYtChange={(val) => setDraftYt((prev) => ({ ...prev, [v.key]: val }))}
              localMeta={draftLocal[v.key]}
              onUpload={(file) => handleFile(v.key, file)}
              onRemove={() => handleRemoveFile(v.key)}
              lang={lang}
            />
          ))}
        </div>
      </section>

      {/* Suggested weight */}
      <section>
        <div className="v2-caption v2-t2 mb-2">
          {lang === 'zh' ? '建议重量提示' : 'Suggested weight hint'}
        </div>
        <input
          value={suggested}
          onChange={(e) => setSuggested(e.target.value)}
          placeholder={lang === 'zh' ? '比如 「Machine 8-12 kg · DB 5 kg ea」' : 'e.g. Machine 8-12 kg · DB 5 kg ea'}
          className="w-full v2-card-flat px-4 py-3 v2-body text-[14px] v2-t1 bg-transparent border-0 outline-none"
        />
      </section>

      {/* Tempo override */}
      <section>
        <div className="v2-caption v2-t2 mb-2">
          {lang === 'zh' ? '节奏（覆盖默认）' : 'Tempo (override default)'}
        </div>
        <input
          value={tempo}
          onChange={(e) => setTempo(e.target.value.replace(/[^\d\-]/g, ''))}
          placeholder="2-1-3"
          inputMode="numeric"
          className="w-full v2-card-flat px-4 py-3 v2-num text-[16px] v2-t1 bg-transparent border-0 outline-none"
        />
        <div className="v2-caption v2-t3 text-[10px] mt-1.5">
          {lang === 'zh' ? '格式：上推-保持-下降，比如 2-1-3' : 'Format: lift-hold-lower, e.g. 2-1-3'}
        </div>
      </section>

      {/* Save / reset */}
      <div className="space-y-2 pt-2">
        <PrimaryButton size="lg" fullWidth onClick={save}>
          {lang === 'zh' ? '保存修改' : 'Save changes'}
        </PrimaryButton>
        <PrimaryButton size="md" variant="plain" fullWidth onClick={reset} tint={tints.red}>
          {lang === 'zh' ? '清除所有自定义' : 'Reset all customizations'}
        </PrimaryButton>
      </div>
    </div>
  );
}

function VariantRow({ variant, exerciseId, ytValue, onYtChange, localMeta, onUpload, onRemove, lang }) {
  const { t } = useLang();
  const baseMeta = resolveMeta(exerciseId, variant);
  const baseYt = baseMeta?.youtubeId || '';
  const label =
    variant.label && lang !== 'zh'
      ? variant.label
      : variant.labelZh && lang === 'zh'
        ? variant.labelZh
        : t(`variant.${variant.key}`);
  const inputRef = React.useRef(null);

  return (
    <div className="px-4 py-3.5" style={{ borderTop: '0.5px solid var(--hairline)' }}>
      <div className="flex items-center gap-2 mb-2">
        <span className="v2-t1"><VariantIcon kind={variant.key} size={14} /></span>
        <span className="v2-title text-[14px] v2-t1">{label}</span>
      </div>

      {/* YouTube ID / URL */}
      <input
        value={ytValue}
        onChange={(e) => onYtChange(e.target.value)}
        placeholder={baseYt ? `YouTube · default ${baseYt}` : 'Paste YouTube link or 11-char ID'}
        className="w-full bg-transparent border-0 outline-none v2-num text-[13px] v2-t1 placeholder:opacity-30"
        style={{ borderBottom: '0.5px solid var(--hairline)' }}
      />

      {/* Local upload row */}
      <div className="mt-3 flex items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => onUpload(e.target.files?.[0])}
        />
        {localMeta ? (
          <>
            <Chip size="sm" tint={tints.green}>
              {localMeta.filename ? localMeta.filename.slice(0, 22) : 'video'} · {formatBytes(localMeta.sizeBytes || 0)}
            </Chip>
            <button
              type="button"
              onClick={onRemove}
              className="v2-caption v2-t3 text-[10px] hover:underline"
              style={{ color: 'var(--tint-red)' }}
            >
              {lang === 'zh' ? '移除' : 'Remove'}
            </button>
          </>
        ) : (
          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            transition={springs.press}
            onClick={() => inputRef.current?.click()}
            className="v2-caption text-[11px] font-semibold v2-t1 px-3 py-1.5 rounded-full"
            style={{ background: 'var(--hairline-strong)' }}
          >
            {lang === 'zh' ? '↑ 上传本地视频' : '↑ Upload local video'}
          </motion.button>
        )}
      </div>
    </div>
  );
}

// Accept both raw video IDs and full YouTube URLs of any shape.
function extractYouTubeId(input) {
  if (!input) return '';
  const s = String(input).trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;
  const patterns = [
    /youtu\.be\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/watch\?v=([A-Za-z0-9_-]{11})/,
    /youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/embed\/([A-Za-z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = s.match(p);
    if (m) return m[1];
  }
  return s; // fall through — keep whatever they typed
}
