// Per-exercise tempo + YouTube Shorts tutorial mapping.
// YouTube IDs verified by oembed title lookup against actual video content.

export const EXERCISE_META = {
  // ── PUSH ──
  'push-1': {
    // Overhead Press
    tempo: '2-1-3',
    tempoCues: {
      lift: '2 sec press weight overhead',
      hold: '1 sec hold at the top',
      lower: '3 sec lower weight back down',
    },
    youtubeId: '6v4nrRVySj0', // The PERFECT Machine Shoulder Press
  },
  'push-2': {
    // Lateral Raises
    tempo: '2-1-2',
    tempoCues: {
      lift: '2 sec raise arms out to sides',
      hold: '1 sec hold at shoulder height',
      lower: '2 sec lower arms down',
    },
    youtubeId: 'UFcaodmbXd8', // Lateral Raise Tip
  },
  'push-3': {
    // Incline Dumbbell Press
    tempo: '2-1-3',
    tempoCues: {
      lift: '2 sec press dumbbells upward',
      hold: '1 sec squeeze chest at top',
      lower: '3 sec lower dumbbells down',
    },
    youtubeId: 'V3BNe4vJX60', // Dumbbell Incline Press
  },
  'push-4': {
    // Face Pulls
    tempo: '2-1-2',
    tempoCues: {
      lift: '2 sec pull toward face',
      hold: '1 sec squeeze rear delts / upper back',
      lower: '2 sec extend arms forward',
    },
    youtubeId: 'I41wK3wTZlo', // Rear Delt Cable Face Pull
  },
  'push-5': {
    // Tricep Pushdowns
    tempo: '2-1-3',
    tempoCues: {
      lift: '2 sec push weight downward',
      hold: '1 sec squeeze triceps at bottom',
      lower: '3 sec return upward',
    },
    youtubeId: '4NWWB0f0vzQ', // Cable Triceps Extension
  },
  'push-6': {
    // Hanging Leg Raise (default); Plank variant overrides in demoMap.
    tempo: '2-1-3',
    tempoCues: {
      lift: '2 sec raise legs upward',
      hold: '1 sec hold at top',
      lower: '3 sec lower legs down',
    },
    youtubeId: 'KDbFKEScp1M', // Hanging Leg Raise mistake
  },

  // ── PULL ──
  'pull-1': {
    // Assisted Pull-Ups
    tempo: '1-1-3',
    tempoCues: {
      lift: '1 sec pull up',
      hold: '1 sec squeeze at the top',
      lower: '3 sec lower down',
    },
    youtubeId: 'yF85efFDGY4', // Assisted Pull Ups Machine
  },
  'pull-2': {
    // Chest-Supported Row
    tempo: '2-1-3',
    tempoCues: {
      lift: '2 sec row toward body',
      hold: '1 sec squeeze shoulder blades',
      lower: '3 sec extend arms forward',
    },
    youtubeId: 'lHD0Z4pI0Cg', // Chest Supported Row
  },
  'pull-3': {
    // Wide-Grip Lat Pulldown
    tempo: '2-1-3',
    tempoCues: {
      lift: '2 sec pull bar down',
      hold: '1 sec squeeze at chest',
      lower: '3 sec return bar upward',
    },
    youtubeId: 'bNmvKpJSWKM', // The PERFECT Lat Pulldown
  },
  'pull-4': {
    // Rear Delt Flyes
    tempo: '2-1-2',
    tempoCues: {
      lift: '2 sec raise arms outward',
      hold: '1 sec squeeze rear delts',
      lower: '2 sec lower weights back down',
    },
    youtubeId: '7tgx6QHB0-A', // Rear Delt Machine Flyes mistakes
  },
  'pull-5': {
    // Single-Arm Dumbbell Row
    tempo: '2-1-3',
    tempoCues: {
      lift: '2 sec pull dumbbell upward',
      hold: '1 sec squeeze at top',
      lower: '3 sec lower dumbbell down',
    },
    youtubeId: 'jpi4reqwiKY', // Single-Arm Dumbbell Bent-Over Row
  },
  'pull-6': {
    // Bicep Curls
    tempo: '2-1-3',
    tempoCues: {
      lift: '2 sec curl weight up',
      hold: '1 sec squeeze bicep',
      lower: '3 sec lower weight down',
    },
    youtubeId: 'j1FjaWu5Am4', // Bicep form tips
  },
  'pull-7': {
    // Ab Wheel (default); Cable Crunch variant overrides in demoMap.
    tempo: '3-1-2',
    tempoCues: {
      lift: '2 sec pull back in',
      hold: '1 sec stretched hold',
      lower: '3 sec roll outward',
    },
    // No specific Ab Wheel tutorial in pack — leave empty so embed hides.
    youtubeId: null,
  },

  // ── LEG ──
  'leg-1': {
    // Goblet Squat
    tempo: '3-1-2',
    tempoCues: {
      lift: '2 sec stand back up',
      hold: '1 sec pause at bottom',
      lower: '3 sec lower into squat',
    },
    youtubeId: 'YSnMWxs7wss', // GOBLET SQUAT key points
  },
  'leg-2': {
    // Romanian Deadlift
    tempo: '3-1-2',
    tempoCues: {
      lift: '2 sec drive hips forward to stand up',
      hold: '1 sec stretch hold at bottom',
      lower: '3 sec lower weight down the legs / hinge hips back',
    },
    youtubeId: 'CBOhr6H7BEY', // RDL Tips
  },
  'leg-3': {
    // Bulgarian Split Squat
    tempo: '3-1-2',
    tempoCues: {
      lift: '2 sec push back up',
      hold: '1 sec pause at bottom',
      lower: '3 sec lower into split squat',
    },
    youtubeId: 'uBSoEWZu07k', // Bulgarian Split Squat – Glute-Focused
  },
  'leg-4': {
    // Hip Thrust
    tempo: '2-2-3',
    tempoCues: {
      lift: '2 sec thrust hips upward',
      hold: '2 sec squeeze glutes at top',
      lower: '3 sec lower hips down',
    },
    youtubeId: '_i6qpcI1Nw4', // Hip Thrust Tips
  },
  'leg-5': {
    // Lateral Raises (same exercise as push-2)
    tempo: '2-1-2',
    tempoCues: {
      lift: '2 sec raise arms outward',
      hold: '1 sec hold at shoulder height',
      lower: '2 sec lower arms down',
    },
    youtubeId: 'UFcaodmbXd8', // Lateral Raise Tip
  },
  'leg-6': {
    // Standing Calf Raise
    tempo: '2-1-3',
    tempoCues: {
      lift: '2 sec rise onto toes',
      hold: '1 sec squeeze calves at top',
      lower: '3 sec lower heels down / stretch',
    },
    youtubeId: 'wdOkFomQNp8', // Build BIGGER Calves
  },
  'leg-7': {
    // Deadbug
    tempo: '2-1-2',
    tempoCues: {
      lift: '2 sec extend opposite arm + leg outward',
      hold: '1 sec hold while bracing core',
      lower: '2 sec return to starting position',
    },
    youtubeId: null, // No specific Deadbug tutorial in pack
  },
};

export const exerciseMeta = (exerciseId) => EXERCISE_META[exerciseId] || {};

// Resolves effective tempo + cues + youtubeId for an exercise + selected variant.
// Variant fields (from demoMap.js) take precedence.
export const resolveMeta = (exerciseId, variant) => {
  const base = exerciseMeta(exerciseId);
  if (!variant) return base;
  return {
    tempo: variant.tempo ?? base.tempo,
    tempoCues: variant.tempoCues ?? base.tempoCues,
    youtubeId: variant.youtubeId ?? base.youtubeId,
    isStatic: variant.isStatic ?? base.isStatic ?? false,
  };
};
