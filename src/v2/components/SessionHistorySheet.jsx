import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLang, locEx, locWorkout } from '../../i18n/index.jsx';
import { useLocalStorage } from '../../hooks/useLocalStorage.js';
import { WORKOUTS } from '../../data/workoutData.js';
import { springs, tints } from '../theme.js';
import Sheet from './Sheet.jsx';
import PrimaryButton from './PrimaryButton.jsx';

function formatDate(ts, lang) {
  const d = new Date(ts);
  try {
    return d.toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', {
      month: 'short', day: 'numeric', weekday: 'short',
    });
  } catch {
    return d.toDateString();
  }
}

function isToday(session) {
  const ts = session?.startedAt || session?.completedAt;
  if (!ts) return false;
  const d = new Date(ts);
  const n = new Date();
  return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth() && d.getDate() === n.getDate();
}

function formatElapsed(start, end) {
  if (!start || !end) return '—';
  const mins = Math.max(1, Math.round((end - start) / 60000));
  if (mins < 60) return `${mins}m`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

export default function SessionHistorySheet({ open, onClose, onReopen }) {
  const { lang } = useLang();
  const [history, setHistory] = useLocalStorage('atlas.history', {});
  const [expanded, setExpanded] = useState(null);
  const [editing, setEditing] = useState(null);   // { sessionId, exId, idx, log }

  const enriched = useMemo(() => {
    return Object.entries(history)
      .filter(([, s]) => s?.completedAt)
      .sort(([, a], [, b]) => (b.completedAt || 0) - (a.completedAt || 0))
      .map(([id, s]) => {
        const workout = WORKOUTS[s.type];
        const sets = Object.values(s.completedSets || {}).reduce((a, arr) => a + arr.length, 0);
        const volume = Object.values(s.completedSets || {}).reduce(
          (acc, arr) => acc + arr.reduce(
            (a, log) => a + (Number(log.weight) || 0) * (Number(log.reps) || 0),
            0,
          ),
          0,
        );
        return { id, session: s, workout, sets, volume };
      });
  }, [history]);

  const deleteLog = (sessionId, exId, idx) => {
    setHistory((prev) => {
      const next = { ...prev };
      const s = { ...next[sessionId], completedSets: { ...next[sessionId].completedSets } };
      const arr = [...(s.completedSets[exId] || [])];
      arr.splice(idx, 1);
      if (arr.length === 0) delete s.completedSets[exId];
      else s.completedSets[exId] = arr;
      next[sessionId] = s;
      return next;
    });
  };

  const updateLog = (sessionId, exId, idx, patch) => {
    setHistory((prev) => {
      const next = { ...prev };
      const s = { ...next[sessionId], completedSets: { ...next[sessionId].completedSets } };
      const arr = [...(s.completedSets[exId] || [])];
      arr[idx] = { ...arr[idx], ...patch };
      s.completedSets[exId] = arr;
      next[sessionId] = s;
      return next;
    });
  };

  return (
    <>
      <Sheet
        open={open}
        onClose={onClose}
        title={lang === 'zh' ? '历史训练' : 'Past sessions'}
        height="tall"
      >
        <div className="px-5 pt-1 pb-8 space-y-3">
          {enriched.length === 0 && (
            <div className="v2-card-flat p-8 text-center v2-t3 v2-body text-[13px]">
              {lang === 'zh' ? '还没有训练记录' : 'No sessions yet'}
            </div>
          )}

          {enriched.map(({ id, session: s, workout, sets, volume }) => {
            const isOpen = expanded === id;
            return (
              <motion.div key={id} layout className="v2-card overflow-hidden">
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.99 }}
                  transition={springs.press}
                  onClick={() => setExpanded(isOpen ? null : id)}
                  className="w-full text-left px-4 py-3.5 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="v2-caption v2-t3 text-[10px]">
                      {formatDate(s.completedAt, lang)}
                    </div>
                    <div className="v2-title text-[16px] v2-t1 mt-0.5 truncate">
                      {workout ? locWorkout(workout, 'name', lang) : s.type}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="v2-num text-[12px] v2-t1 font-semibold">
                      {sets} {lang === 'zh' ? '组' : 'sets'}
                    </div>
                    <div className="v2-num text-[11px] v2-t3">
                      {volume > 0 ? `${Math.round(volume).toLocaleString()} vol` : '—'}
                    </div>
                    <div className="v2-num text-[10px] v2-t3 mt-0.5">
                      {formatElapsed(s.startedAt, s.completedAt)}
                    </div>
                  </div>
                </motion.button>

                <AnimatePresence>
                  {isOpen && workout && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      className="overflow-hidden"
                      style={{ borderTop: '0.5px solid var(--hairline)' }}
                    >
                      {/* Reopen — walk back into today's session with all
                          sets intact. "提前结束" is a pause, not a wall. */}
                      {onReopen && isToday(s) && (
                        <div className="px-4 pt-3">
                          <PrimaryButton
                            size="md"
                            fullWidth
                            variant="tinted"
                            tint={tints.green}
                            onClick={() => { onReopen(s.type); onClose?.(); }}
                          >
                            {lang === 'zh' ? '重新打开这次训练' : 'Reopen this session'}
                          </PrimaryButton>
                        </div>
                      )}
                      <ul>
                        {workout.exercises.map((e) => {
                          const logs = s.completedSets?.[e.id] || [];
                          if (logs.length === 0) return null;
                          return (
                            <li
                              key={e.id}
                              className="px-4 py-3"
                              style={{ borderTop: '0.5px solid var(--hairline)' }}
                            >
                              <div className="v2-body text-[13.5px] v2-t1">
                                {locEx(e, 'name', lang)}
                              </div>
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                {logs.map((log, i) => (
                                  <motion.button
                                    key={i}
                                    whileTap={{ scale: 0.92 }}
                                    transition={springs.press}
                                    onClick={() => setEditing({ sessionId: id, exId: e.id, idx: i, log })}
                                    className="h-6 px-2 rounded-full flex items-center gap-1 text-[10.5px] v2-num font-semibold v2-t1"
                                    style={{
                                      background: 'var(--hairline)',
                                      boxShadow: 'inset 0 0 0 0.5px var(--hairline-strong)',
                                    }}
                                  >
                                    <span>{log.weight}{log.weightUnit || ''}</span>
                                    <span className="opacity-50">×</span>
                                    <span>{log.reps}</span>
                                  </motion.button>
                                ))}
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </Sheet>

      <Sheet
        open={!!editing}
        onClose={() => setEditing(null)}
        title={lang === 'zh' ? '编辑这组' : 'Edit historical set'}
      >
        {editing && (
          <HistoryEditForm
            log={editing.log}
            lang={lang}
            onSave={(patch) => {
              updateLog(editing.sessionId, editing.exId, editing.idx, patch);
              setEditing(null);
            }}
            onDelete={() => {
              deleteLog(editing.sessionId, editing.exId, editing.idx);
              setEditing(null);
            }}
            onCancel={() => setEditing(null)}
          />
        )}
      </Sheet>
    </>
  );
}

function HistoryEditForm({ log, lang, onSave, onDelete, onCancel }) {
  const [weight, setWeight] = useState(String(log.weight ?? ''));
  const [reps, setReps] = useState(String(log.reps ?? ''));
  const [diff, setDiff] = useState(log.difficulty || 'moderate');
  const unit = log.weightUnit || 'kg';

  const DIFF = [
    { id: 'easy',     label: lang === 'zh' ? '轻松' : 'Easy',     tint: tints.green },
    { id: 'moderate', label: lang === 'zh' ? '中等' : 'Moderate', tint: tints.mint },
    { id: 'hard',     label: lang === 'zh' ? '吃力' : 'Hard',     tint: tints.orange },
    { id: 'failure',  label: lang === 'zh' ? '力竭' : 'Failure',  tint: tints.red },
  ];

  return (
    <div className="px-5 pb-6 pt-1 space-y-4">
      <div className="flex gap-3">
        <NumField
          label={lang === 'zh' ? `重量 (${unit})` : `Weight (${unit})`}
          value={weight}
          onChange={setWeight}
        />
        <NumField
          label={lang === 'zh' ? '次数' : 'Reps'}
          value={reps}
          onChange={setReps}
        />
      </div>

      <div>
        <div className="v2-caption v2-t2 mb-2">{lang === 'zh' ? '感觉' : 'Felt'}</div>
        <div className="grid grid-cols-4 gap-2">
          {DIFF.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setDiff(d.id)}
              className="h-11 rounded-full text-[13px] font-semibold"
              style={
                diff === d.id
                  ? { background: d.tint, color: '#000' }
                  : { background: 'var(--hairline)', color: 'var(--label-1)', boxShadow: 'inset 0 0 0 0.5px var(--hairline-strong)' }
              }
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      <PrimaryButton size="lg" fullWidth onClick={() => onSave({
        weight: Number(weight),
        reps: Number(reps),
        difficulty: diff,
      })}>
        {lang === 'zh' ? '保存修改' : 'Save changes'}
      </PrimaryButton>
      <div className="flex gap-3">
        <PrimaryButton size="md" variant="plain" onClick={onCancel}>
          {lang === 'zh' ? '取消' : 'Cancel'}
        </PrimaryButton>
        <PrimaryButton size="md" fullWidth variant="tinted" tint={tints.red} onClick={onDelete}>
          {lang === 'zh' ? '删除' : 'Delete'}
        </PrimaryButton>
      </div>
    </div>
  );
}

function NumField({ label, value, onChange }) {
  return (
    <div className="flex-1 v2-card-flat p-3">
      <div className="v2-caption v2-t2 text-[10px]">{label}</div>
      <input
        type="number"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^\d.]/g, ''))}
        className="mt-1 w-full bg-transparent border-0 outline-none v2-num text-[26px] font-semibold v2-t1"
      />
    </div>
  );
}
