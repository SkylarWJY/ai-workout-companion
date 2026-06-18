// Adaptive progression — turns the user's log history into recommendations
// for the next set and a visual trend for the modal.
//
// Two public functions:
//   - recommendNextWeight(...) → { weight, kind, reasoning } | null
//     The number we pre-fill in the Logger.
//
//   - progressTrend(...) → { points, first, last, delta, percentChange }
//     The data the Modal renders as a mini chart + "+50% in 3 weeks" line.

import { convertWeight } from './weight.js';

// Below these thresholds we use much smaller bumps — lateral raises,
// front raises, kickbacks, etc. live in single-digit / low-double-digit
// land and +2.5 kg is a 25% jump, way too aggressive.
const SMALL_WEIGHT_THRESHOLD_KG = 15;
const SMALL_WEIGHT_THRESHOLD_LB = 30;

// Smallest plate increment available on most gym setups.
function roundToPlate(w, unit) {
  if (!Number.isFinite(w)) return w;
  if (unit === 'kg') return Math.round(w * 2) / 2; // 0.5 kg
  return Math.round(w); // 1 lb
}

function bumpSize(currentWeight, unit, kind) {
  const isSmall =
    unit === 'kg'
      ? currentWeight < SMALL_WEIGHT_THRESHOLD_KG
      : currentWeight < SMALL_WEIGHT_THRESHOLD_LB;
  if (kind === 'big') return isSmall ? (unit === 'kg' ? 1 : 2) : unit === 'kg' ? 5 : 10;
  if (kind === 'small') return isSmall ? (unit === 'kg' ? 0.5 : 1) : unit === 'kg' ? 2.5 : 5;
  return 0;
}

// Pull "low" and "high" out of strings like "6-10", "10–15", "8-12 ea",
// "20-40s". Returns null when the string doesn't look numeric (AMRAP,
// "Static", etc.) so callers know to skip the recommendation.
function parseRepRange(s) {
  if (!s) return null;
  const m = String(s).match(/(\d+)\D+(\d+)/);
  if (!m) return null;
  return { low: parseInt(m[1], 10), high: parseInt(m[2], 10) };
}

// Find the most-recent completed set for an exercise + variant. We can't
// reuse historyLookup's lastLogForExercise because we specifically need
// the TOP SET (highest weight that wasn't a warm-up), not just the most
// recent entry — the recommendation should anchor on what the user
// pushed hard on, not their last warm-up rep.
function topSetLastSession(history, exerciseId, variantKey) {
  const sessions = Object.values(history || {})
    .filter((s) => s?.completedSets?.[exerciseId]?.length > 0)
    .sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0));

  for (const s of sessions) {
    const allLogs = s.completedSets[exerciseId];
    const logs = allLogs.filter((l) => {
      if (l.weight == null) return false;
      // Variant filter: respect explicit variant tags. Legacy logs
      // without a variant field count for any variant.
      if (variantKey && l.variant && l.variant !== variantKey) return false;
      return true;
    });
    if (logs.length === 0) continue;
    const top = logs.reduce((a, b) => (Number(b.weight) > Number(a.weight) ? b : a));
    return top;
  }
  return null;
}

// Suggest the working weight for the next set.
// `repRange` is the exercise's target rep range string ("6-10").
// `currentUnit` is the user's display unit setting.
// Returns null when there's no usable history, or when the rep range
// can't be parsed (AMRAP / Static / bodyweight). The caller falls
// back to whatever default it would use today.
export function recommendNextWeight({
  history,
  exerciseId,
  variantKey,
  repRange,
  currentUnit,
}) {
  const ref = topSetLastSession(history, exerciseId, variantKey);
  if (!ref) return null;

  const range = parseRepRange(repRange);
  if (!range) return null;

  // Normalize the historical weight into the user's current unit.
  // Pre-v0.6 logs may have a null weightUnit — assume it matches the
  // current setting so the conversion is a no-op (better than guessing
  // wrong and offering 33 lb when the user meant 33 kg).
  const fromUnit = ref.weightUnit || currentUnit;
  const w = Number(
    convertWeight(ref.weight, fromUnit, currentUnit),
  );
  const reps = Number(ref.reps) || 0;
  const diff = ref.difficulty;

  // At-the-top decision tree
  if (reps >= range.high) {
    if (diff === 'easy') {
      return {
        weight: roundToPlate(w + bumpSize(w, currentUnit, 'big'), currentUnit),
        kind: 'bigBump',
        reasoning: 'easyAtTop',
        from: { weight: w, reps, difficulty: diff, unit: currentUnit },
      };
    }
    if (diff === 'moderate' || diff === 'hard') {
      return {
        weight: roundToPlate(w + bumpSize(w, currentUnit, 'small'), currentUnit),
        kind: 'smallBump',
        reasoning: diff === 'moderate' ? 'moderateAtTop' : 'hardAtTop',
        from: { weight: w, reps, difficulty: diff, unit: currentUnit },
      };
    }
  }

  // Failed reps OR dropped below the bottom of the range → de-load
  if (diff === 'failure' || reps < range.low) {
    return {
      weight: roundToPlate(w * 0.9, currentUnit),
      kind: 'deload',
      reasoning: 'failedReps',
      from: { weight: w, reps, difficulty: diff, unit: currentUnit },
    };
  }

  // Anywhere in the middle: hold weight, push for more reps next time
  return {
    weight: roundToPlate(w, currentUnit),
    kind: 'maintain',
    reasoning: 'pushReps',
    from: { weight: w, reps, difficulty: diff, unit: currentUnit },
  };
}

// Build a time series of top-set weights per completed session, plus
// summary delta + percent change. Used by the modal's Progress card.
export function progressTrend({
  history,
  exerciseId,
  variantKey,
  currentUnit,
}) {
  const sessions = Object.values(history || {})
    .filter((s) => s?.completedSets?.[exerciseId]?.length > 0)
    .sort((a, b) => (a.completedAt || 0) - (b.completedAt || 0));

  const points = [];
  for (const s of sessions) {
    const logs = s.completedSets[exerciseId].filter((l) => {
      if (l.weight == null) return false;
      if (variantKey && l.variant && l.variant !== variantKey) return false;
      return true;
    });
    if (logs.length === 0) continue;
    const top = logs.reduce(
      (a, b) => (Number(b.weight) > Number(a.weight) ? b : a),
    );
    const fromUnit = top.weightUnit || currentUnit;
    points.push({
      date: s.completedAt || s.startedAt,
      weight: Number(convertWeight(top.weight, fromUnit, currentUnit)),
      reps: Number(top.reps) || 0,
      difficulty: top.difficulty || null,
    });
  }

  if (points.length === 0) {
    return { points, first: null, last: null, delta: null, percentChange: null };
  }
  if (points.length === 1) {
    return {
      points,
      first: points[0],
      last: points[0],
      delta: 0,
      percentChange: 0,
    };
  }

  const first = points[0];
  const last = points[points.length - 1];
  const delta = last.weight - first.weight;
  const percentChange = first.weight > 0 ? (delta / first.weight) * 100 : null;
  return { points, first, last, delta, percentChange };
}
