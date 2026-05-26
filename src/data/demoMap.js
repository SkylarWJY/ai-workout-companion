// Maps exercise IDs to free-exercise-db slugs (public domain — Unlicense).
// Each slug has /0.jpg (start position) and /1.jpg (end position).
// Source: https://github.com/yuhonas/free-exercise-db

export const DEMO_BASE =
  'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises';

// Each entry is an ordered list of variants. Index 0 = default.
// `key` resolves to a translation string under `variant.<key>` in strings.js.
export const DEMO_VARIANTS = {
  // ── PUSH ──
  'push-1': [
    { key: 'dumbbell', slug: 'Dumbbell_Shoulder_Press' },
    { key: 'machine', slug: 'Leverage_Shoulder_Press' },
    { key: 'barbell', slug: 'Standing_Military_Press' },
  ],
  'push-2': [
    { key: 'dumbbell', slug: 'Side_Lateral_Raise' },
    { key: 'band', slug: 'Lateral_Raise_-_With_Bands' },
  ],
  'push-3': [{ key: 'dumbbell', slug: 'Incline_Dumbbell_Press' }],
  'push-4': [{ key: 'cable', slug: 'Face_Pull' }],
  'push-5': [
    { key: 'cable', slug: 'Triceps_Pushdown' },
    { key: 'rope', slug: 'Triceps_Pushdown_-_Rope_Attachment' },
    { key: 'kickback', slug: 'Tricep_Dumbbell_Kickback' },
  ],
  'push-6': [
    { key: 'bodyweight', slug: 'Hanging_Leg_Raise' },
    {
      key: 'plank',
      slug: 'Plank',
      isStatic: true,
      tempo: 'Static',
      tempoCues: {
        lift: 'Hold a tight core position for 20–40 seconds',
        hold: 'Abs braced · glutes tight · body straight',
        lower: 'No movement — pure isometric',
      },
      youtubeId: null, // no Plank tutorial in pack
    },
  ],

  // ── PULL ──
  'pull-1': [
    { key: 'pullup', slug: 'Pullups' },
    { key: 'latpulldown', slug: 'Wide-Grip_Lat_Pulldown' },
  ],
  'pull-2': [{ key: 'cable', slug: 'Seated_Cable_Rows' }],
  'pull-3': [{ key: 'cable', slug: 'Wide-Grip_Lat_Pulldown' }],
  'pull-4': [{ key: 'dumbbell', slug: 'Reverse_Flyes' }],
  'pull-5': [{ key: 'dumbbell', slug: 'One-Arm_Dumbbell_Row' }],
  'pull-6': [
    { key: 'dumbbell', slug: 'Dumbbell_Bicep_Curl' },
    { key: 'machine', slug: 'Machine_Bicep_Curl' },
  ],
  'pull-7': [
    { key: 'abwheel', slug: 'Ab_Roller' },
    {
      key: 'cablecrunch',
      slug: 'Cable_Crunch',
      tempo: '2-1-3',
      tempoCues: {
        lift: '2 sec crunch downward',
        hold: '1 sec squeeze abs',
        lower: '3 sec return upward',
      },
      youtubeId: 'K2m0jj6RfYg', // STOP Making This Cable Crunch MISTAKE
    },
  ],

  // ── LEG ──
  'leg-1': [{ key: 'dumbbell', slug: 'Goblet_Squat' }],
  'leg-2': [{ key: 'dumbbell', slug: 'Romanian_Deadlift' }],
  'leg-3': [{ key: 'dumbbell', slug: 'Dumbbell_Lunges' }],
  'leg-4': [
    { key: 'barbell', slug: 'Barbell_Hip_Thrust' },
    { key: 'smith', slug: 'Smith_Machine_Hip_Raise' },
  ],
  'leg-5': [
    { key: 'dumbbell', slug: 'Side_Lateral_Raise' },
    { key: 'band', slug: 'Lateral_Raise_-_With_Bands' },
  ],
  'leg-6': [{ key: 'bodyweight', slug: 'Standing_Calf_Raises' }],
  'leg-7': [{ key: 'bodyweight', slug: 'Dead_Bug' }],
};

export const demoVariants = (exerciseId) => DEMO_VARIANTS[exerciseId] || [];

export const demoUrlsForSlug = (slug) => [
  `${DEMO_BASE}/${slug}/0.jpg`,
  `${DEMO_BASE}/${slug}/1.jpg`,
];

// Backwards-compat — return the default variant's URLs
export const demoUrls = (exerciseId) => {
  const v = demoVariants(exerciseId);
  if (!v.length) return null;
  return demoUrlsForSlug(v[0].slug);
};
