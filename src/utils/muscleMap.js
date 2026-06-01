// Maps the granular muscle names used in workoutData.js to the body
// regions drawn in BodyMap.jsx.

const MAP = {
  // ── Shoulders ──
  'Front Delts': ['delts-front'],
  'Side Delts': ['delts-side'],
  'Rear Delts': ['delts-rear'],

  // ── Arms ──
  'Biceps': ['biceps'],
  'Triceps': ['triceps'],
  'Forearms': ['forearms'],

  // ── Chest ──
  'Chest': ['pecs'],
  'Upper Chest': ['pecs'],

  // ── Back ──
  'Lats': ['lats'],
  'Back Width': ['lats'],
  'Upper Back': ['upper-back'],
  'Mid Back': ['lats'],
  'Rhomboids': ['upper-back'],
  'Mid Traps': ['traps'],
  'Traps': ['traps'],
  'Rotator Cuff': ['upper-back'],

  // ── Core ──
  'Abs': ['abs'],
  'Deep Core': ['abs'],
  'Core': ['abs'],
  'Hip Flexors': ['obliques'],
  'Lower Back': ['erectors'],
  'Lower Back Stabilizers': ['erectors'],
  'Pelvic Stabilizers': ['erectors'],
  'Posture': [],

  // ── Lower body ──
  'Quads': ['quads'],
  'Glutes': ['glutes'],
  'Hamstrings': ['hamstrings'],
  'Adductors': ['adductors'],
  'Calves': ['calves'],
  'Ankle Stabilizers': ['calves'],
};

// Per-exercise weight for a region depending on priority + primary/secondary.
const PRIORITY_WEIGHT = {
  extreme: 4,
  veryhigh: 3,
  high: 2.5,
  moderate: 2,
  low: 1.5,
};

// Returns { regionId: score } where score is the cumulative training "dose"
// for that muscle group across the day. Primary muscle = full weight,
// secondary = 40% of weight.
export function regionScores(workout) {
  if (!workout?.exercises) return {};
  const out = {};
  for (const ex of workout.exercises) {
    const w = PRIORITY_WEIGHT[ex.priority] ?? 2;
    for (const m of ex.primaryMuscles || []) {
      for (const r of MAP[m] || []) {
        out[r] = (out[r] || 0) + w;
      }
    }
    for (const m of ex.secondaryMuscles || []) {
      for (const r of MAP[m] || []) {
        out[r] = (out[r] || 0) + w * 0.4;
      }
    }
  }
  return out;
}

// Buckets a score into a 0..4 intensity level for visual styling.
//   0 = not trained
//   1 = light
//   2 = moderate
//   3 = heavy
//   4 = peak / extreme
export function scoreToLevel(score) {
  if (!score || score < 0.5) return 0;
  if (score < 2) return 1;
  if (score < 4) return 2;
  if (score < 6.5) return 3;
  return 4;
}

// Convenience: returns { regionId: level } map for direct rendering use.
export function regionLevels(workout) {
  const scores = regionScores(workout);
  const out = {};
  for (const [r, s] of Object.entries(scores)) out[r] = scoreToLevel(s);
  return out;
}

export const INTENSITY_LABELS_EN = {
  1: 'Light',
  2: 'Moderate',
  3: 'Heavy',
  4: 'Peak',
};

export const REGION_LABELS = {
  'delts-front': 'Front delts',
  'delts-side': 'Side delts',
  'delts-rear': 'Rear delts',
  'pecs': 'Chest',
  'upper-back': 'Upper back',
  'lats': 'Lats',
  'traps': 'Traps',
  'biceps': 'Biceps',
  'triceps': 'Triceps',
  'forearms': 'Forearms',
  'abs': 'Abs',
  'obliques': 'Obliques / hip flexors',
  'erectors': 'Lower back',
  'quads': 'Quads',
  'glutes': 'Glutes',
  'hamstrings': 'Hamstrings',
  'adductors': 'Adductors',
  'calves': 'Calves',
};
