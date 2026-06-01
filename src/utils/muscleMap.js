// Maps the granular muscle names used in workoutData.js to the body
// regions drawn in BodyMap.jsx.

const MAP = {
  // ── Shoulders ──
  'Front Delts': ['front-delts'],
  'Side Delts': ['side-delts'],
  'Rear Delts': ['rear-delts'],

  // ── Arms ──
  'Biceps': ['biceps'],
  'Triceps': ['triceps'],
  'Forearms': ['forearms'],

  // ── Chest ──
  'Chest': ['chest'],
  'Upper Chest': ['chest'],

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
  'Hip Flexors': ['hip-flexors'],
  'Lower Back': ['lower-back'],
  'Lower Back Stabilizers': ['lower-back'],
  'Pelvic Stabilizers': ['lower-back'],

  // ── Posture (used in Push warm-up etc.) ──
  'Posture': [],

  // ── Lower body ──
  'Quads': ['quads'],
  'Glutes': ['glutes'],
  'Hamstrings': ['hamstrings'],
  'Adductors': ['adductors'],
  'Calves': ['calves'],
  'Ankle Stabilizers': ['calves'],
};

// Returns an object of { regionId: 'primary' | 'secondary' } for a given workout.
// Primary > Secondary (one region's primary status overrides any secondary
// claim from another exercise's secondaryMuscles).
export function aggregateRegions(workout) {
  if (!workout?.exercises) return {};
  const out = {};
  const bump = (regions, level) => {
    for (const r of regions) {
      const cur = out[r];
      if (level === 'primary') out[r] = 'primary';
      else if (!cur) out[r] = 'secondary';
    }
  };
  for (const ex of workout.exercises) {
    for (const m of ex.primaryMuscles || []) bump(MAP[m] || [], 'primary');
    for (const m of ex.secondaryMuscles || []) bump(MAP[m] || [], 'secondary');
  }
  return out;
}

// For showing a legend below the body — returns sorted unique region+level pairs.
export function regionLegend(regions) {
  return Object.entries(regions).sort(([, a], [, b]) =>
    a === b ? 0 : a === 'primary' ? -1 : 1,
  );
}

// Region IDs → human label (EN). ZH labels live in i18n.
export const REGION_LABELS = {
  'front-delts': 'Front delts',
  'side-delts': 'Side delts',
  'rear-delts': 'Rear delts',
  'chest': 'Chest',
  'upper-back': 'Upper back',
  'lats': 'Lats',
  'traps': 'Traps',
  'biceps': 'Biceps',
  'triceps': 'Triceps',
  'forearms': 'Forearms',
  'abs': 'Abs / core',
  'hip-flexors': 'Hip flexors',
  'lower-back': 'Lower back',
  'quads': 'Quads',
  'glutes': 'Glutes',
  'hamstrings': 'Hamstrings',
  'adductors': 'Adductors',
  'calves': 'Calves',
};
