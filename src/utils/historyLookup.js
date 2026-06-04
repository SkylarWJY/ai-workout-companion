// Lookup helpers over the cross-session logged-set history.
// `history` here is the doc shape produced by App.jsx → completeWorkout:
//   {
//     '2026-05-31-push': {
//       type: 'push',
//       startedAt: 1700,
//       completedAt: 1735,
//       completedSets: {
//         'push-1': [
//           { weight: 25, weightUnit: 'lb', reps: 10, difficulty: 'moderate',
//             notes: '', variant: 'dumbbell' /* v0.7+ */, ts: 1701 },
//           ...
//         ],
//         ...
//       },
//     },
//     ...
//   }
//
// Pre-v0.7 logs don't carry a `variant` field; we treat those as the
// "default" variant for lookups so older history doesn't disappear.

// Returns the array of sessions that have at least one logged set for
// `exerciseId`, sorted newest-first.
function sessionsForExercise(history, exerciseId) {
  if (!history) return [];
  return Object.values(history)
    .filter((s) => Array.isArray(s.completedSets?.[exerciseId]) && s.completedSets[exerciseId].length > 0)
    .sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0));
}

// Find the most-recent log entry for an exercise. When `variantKey` is
// provided, only logs tagged with that variant (or untagged legacy logs,
// since those predate variant tracking) count.
export function lastLogForExercise(history, exerciseId, variantKey) {
  const sessions = sessionsForExercise(history, exerciseId);
  for (const s of sessions) {
    const logs = s.completedSets[exerciseId];
    for (let i = logs.length - 1; i >= 0; i--) {
      const log = logs[i];
      if (log.weight == null) continue;
      if (variantKey && log.variant && log.variant !== variantKey) continue;
      return { ...log, sessionDate: s.completedAt };
    }
  }
  return null;
}

// Build a `{ variantKey: lastLog }` map for every variant that has any
// logged history. Untagged legacy logs are stashed under 'default'.
// Used by the modal so we can show "Last: 30 lb × 8" alongside the
// currently-selected variant tab.
export function lastLogsByVariant(history, exerciseId) {
  const result = {};
  const sessions = sessionsForExercise(history, exerciseId);
  for (const s of sessions) {
    const logs = s.completedSets[exerciseId];
    for (let i = logs.length - 1; i >= 0; i--) {
      const log = logs[i];
      if (log.weight == null) continue;
      const key = log.variant || 'default';
      if (!result[key]) {
        result[key] = { ...log, sessionDate: s.completedAt };
      }
    }
  }
  return result;
}

// Format a log entry as a short label: "30 lb × 8 · Hard". Used in the
// modal stats line and the Logger's "last reference" line.
export function formatLogShort(log, t) {
  if (!log || log.weight == null) return null;
  const wt = `${log.weight}${log.weightUnit ? ` ${log.weightUnit}` : ''}`;
  const reps = log.reps != null ? ` × ${log.reps}` : '';
  const diff = log.difficulty
    ? ` · ${t ? t(`log.diff.${log.difficulty}`) : log.difficulty}`
    : '';
  return `${wt}${reps}${diff}`;
}
