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

// Plate increment lookup by weight bracket. Real gyms have 0.5 kg / 1 lb
// micro-plates for isolation work and 2.5 / 5 plates for compounds — these
// brackets match what people can actually load.
function bumpSize(currentWeight, unit, kind) {
  let small;
  let big;
  if (unit === 'kg') {
    if (currentWeight < 10) {
      small = 0.5; big = 1;
    } else if (currentWeight < 25) {
      small = 1;   big = 2.5;
    } else if (currentWeight < 100) {
      small = 2.5; big = 5;
    } else {
      small = 5;   big = 10;
    }
  } else {
    if (currentWeight < 20) {
      small = 1;   big = 2;
    } else if (currentWeight < 50) {
      small = 2.5; big = 5;
    } else if (currentWeight < 200) {
      small = 5;   big = 10;
    } else {
      small = 10;  big = 20;
    }
  }
  if (kind === 'big') return big;
  if (kind === 'small') return small;
  return 0;
}

// Round the recommendation to the smallest plate increment available so
// it's loadable on a real bar / rack.
function roundToPlate(w, unit) {
  if (!Number.isFinite(w)) return w;
  if (unit === 'kg') return Math.round(w * 2) / 2; // 0.5 kg
  return Math.round(w); // 1 lb
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
  // Assist-weighted exercises (assisted pull-ups): the logged number is
  // the machine's HELP, so progress means the weight goes DOWN. Every
  // bump below flips sign, and the deload becomes "add assistance".
  inverted = false,
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

  const from = { weight: w, reps, difficulty: diff, unit: currentUnit };

  // Double-progression model. Add weight ONLY after the rep-range ceiling
  // has been broken (or hit at very low effort). Anywhere inside the range
  // → hold the weight and push for more reps next session.

  // Direction multiplier: normal lifts add weight to progress;
  // assist-weighted lifts subtract it. Assist can't go below zero —
  // at 0 the user has graduated to bodyweight pull-ups.
  const dir = inverted ? -1 : 1;
  const clamp = (x) => (inverted ? Math.max(0, x) : x);

  // Above ceiling: clearly ready to progress.
  if (reps > range.high) {
    const kind = diff === 'easy' ? 'big' : 'small';
    return {
      weight: roundToPlate(clamp(w + dir * bumpSize(w, currentUnit, kind)), currentUnit),
      kind: kind === 'big' ? 'bigBump' : 'smallBump',
      reasoning: inverted
        ? (kind === 'big' ? 'reduceAssistEasy' : 'reduceAssist')
        : (kind === 'big' ? 'exceededRangeEasy' : 'exceededRange'),
      from,
    };
  }

  // Exactly at ceiling: only progress if it felt easy. Otherwise
  // consolidate — repeat, see if effort drops or reps go up.
  if (reps === range.high) {
    if (diff === 'easy') {
      return {
        weight: roundToPlate(clamp(w + dir * bumpSize(w, currentUnit, 'small')), currentUnit),
        kind: 'smallBump',
        reasoning: inverted ? 'reduceAssist' : 'easyAtTop',
        from,
      };
    }
    return {
      weight: roundToPlate(w, currentUnit),
      kind: 'holdAtTop',
      reasoning: 'holdAtTop',
      from,
    };
  }

  // Below the floor. Only back off when the effort says the load is
  // actually wrong (hard / failure). An easy or moderate set cut
  // short below the range is a partial set — someone got interrupted,
  // did a technique drill, or sandbagged — and backing off for it
  // would sabotage progress. Hold instead.
  if (reps < range.low) {
    if (diff === 'hard' || diff === 'failure') {
      return {
        // Normal: strip 10% of the load. Inverted: ADD ~10% more
        // assistance (at least one small plate) so the range is
        // reachable again.
        weight: inverted
          ? roundToPlate(Math.max(w * 1.1, w + bumpSize(w, currentUnit, 'small')), currentUnit)
          : roundToPlate(w * 0.9, currentUnit),
        kind: 'deload',
        reasoning: inverted ? 'increaseAssist' : 'underLow',
        from,
      };
    }
    return {
      weight: roundToPlate(w, currentUnit),
      kind: 'maintain',
      reasoning: 'shortSet',
      from,
    };
  }

  // Inside the range. Going to failure here is intentional, not a problem
  // — that's hypertrophy training. Hold weight, chase more reps.
  return {
    weight: roundToPlate(w, currentUnit),
    kind: 'maintain',
    reasoning: 'pushReps',
    from,
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
