// Warm-up videos + cool-down stretch sequences for each workout day.
// Video assets live in /public/warmup/, cool-down images in /public/cooldown/<day>/.

export const WARMUPS = {
  push: {
    video: '/warmup/upper.mov',
    repsPerMove: '10–15',
    rounds: 2,
    altYoutubeId: '3eRXUNyOsYc',
  },
  pull: {
    video: '/warmup/upper.mov',
    repsPerMove: '10–15',
    rounds: 2,
    altYoutubeId: '3eRXUNyOsYc',
  },
  leg: {
    video: '/warmup/leg.mov',
    repsPerMove: '10',
    rounds: 1,
    altYoutubeId: 'KDI03y0rzvs',
  },
};

// Each cool-down stretch is held for COOLDOWN_HOLD_SECS.
export const COOLDOWN_HOLD_SECS = 30;

export const COOLDOWNS = {
  push: [
    {
      id: 'p-shoulder-stretch',
      image: '/cooldown/push/shoulder-stretch.jpg',
      name: 'Standing Shoulder Stretch',
      target: 'Shoulders',
      cue: 'Stand tall with shoulders relaxed. Hold your arm just above the elbow.',
      unilateral: true,
    },
    {
      id: 'p-crescent-moon',
      image: '/cooldown/push/crescent-moon.jpg',
      name: 'Crescent Moon Stretch',
      target: 'Side body / lats',
      cue: 'Keep shoulders down, away from ears. Stretch one side then the other.',
      unilateral: true,
    },
    {
      id: 'p-chest-opener',
      image: '/cooldown/push/chest-opener.jpg',
      name: 'Chest Opener',
      target: 'Chest · Front delts',
      cue: 'Exhale as you lift hands behind you. Pull shoulders back.',
    },
    {
      id: 'p-tricep-stretch',
      image: '/cooldown/push/tricep-stretch.jpg',
      name: 'Standing Tricep Stretch',
      target: 'Triceps',
      cue: 'Reach fingertips down your spine. Keep shoulders relaxed.',
      unilateral: true,
    },
    {
      id: 'p-cross-body',
      image: '/cooldown/push/cross-body-shoulder.jpg',
      name: 'Cross-Body Shoulder Stretch',
      target: 'Posterior shoulder',
      cue: 'Pull the arm across the body just above the elbow.',
      unilateral: true,
    },
    {
      id: 'p-wall-chest',
      image: '/cooldown/push/wall-chest.jpg',
      name: 'Wall Chest Stretch',
      target: 'Chest · Biceps',
      cue: 'Plant hand on wall at shoulder height. Rotate body away gently.',
      unilateral: true,
    },
  ],

  pull: [
    {
      id: 'pl-overhead-tricep',
      image: '/cooldown/pull/overhead-tricep.jpg',
      name: 'Overhead Tricep & Lat Stretch',
      target: 'Triceps · Lats',
      cue: 'Reach one arm overhead, bend the elbow, pull gently with the other hand.',
      unilateral: true,
    },
    {
      id: 'pl-neck',
      image: '/cooldown/pull/neck-stretch.jpg',
      name: 'Neck Lateral Stretch',
      target: 'Neck · Upper traps',
      cue: 'Tilt head to one side, place hand on top of head, breathe.',
      unilateral: true,
    },
    {
      id: 'pl-cobra',
      image: '/cooldown/pull/cobra-pose.jpg',
      name: 'Cobra Pose',
      target: 'Spine · Front fascia',
      cue: 'Press chest forward and up. Keep shoulders away from ears.',
    },
    {
      id: 'pl-thread-needle',
      image: '/cooldown/pull/thread-needle.jpg',
      name: 'Thread the Needle',
      target: 'Mid-back · Shoulders',
      cue: 'From all-fours, slide one arm under the other. Sink shoulder to floor.',
      unilateral: true,
    },
    {
      id: 'pl-doorway-chest',
      image: '/cooldown/pull/doorway-chest.jpg',
      name: 'Doorway / Wall Chest Stretch',
      target: 'Chest · Biceps',
      cue: 'Arm against the wall at shoulder height, rotate body away.',
      unilateral: true,
    },
  ],

  leg: [
    {
      id: 'l-hip-flexor',
      image: '/cooldown/leg/hip-flexor.jpg',
      name: 'Kneeling Hip Flexor Stretch',
      target: 'Hip flexors',
      cue: 'One knee down. Tuck pelvis. Reach the opposite arm overhead.',
      unilateral: true,
    },
    {
      id: 'l-quad',
      image: '/cooldown/leg/quad-stretch.jpg',
      name: 'Standing Quad Stretch',
      target: 'Quadriceps',
      cue: 'Pull heel to glute. Keep knees together, tuck pelvis.',
      unilateral: true,
    },
    {
      id: 'l-glute-lying',
      image: '/cooldown/leg/glute-lying.jpg',
      name: 'Lying Glute Stretch',
      target: 'Glutes',
      cue: 'Cross ankle over opposite knee. Pull the bottom thigh toward chest.',
      unilateral: true,
    },
    {
      id: 'l-cobra',
      image: '/cooldown/leg/cobra-pose.jpg',
      name: 'Cobra Pose',
      target: 'Abs · Lower back',
      cue: 'Press chest up and forward. Soften shoulders.',
    },
    {
      id: 'l-childs',
      image: '/cooldown/leg/childs-pose.jpg',
      name: "Child's Pose",
      target: 'Lats · Lower back · Hips',
      cue: 'Knees wide, hips back to heels, arms long. Forehead down.',
    },
    {
      id: 'l-pigeon',
      image: '/cooldown/leg/pigeon-pose.jpg',
      name: 'Pigeon Pose',
      target: 'Glutes · Hip rotators',
      cue: 'Front shin across, back leg long. Sink hips down. Square pelvis.',
      unilateral: true,
    },
    {
      id: 'l-neck-side',
      image: '/cooldown/leg/neck-side.jpg',
      name: 'Neck Side Stretch',
      target: 'Neck',
      cue: 'Hand on top of head, tilt ear to shoulder, breathe deep.',
      unilateral: true,
    },
    {
      id: 'l-hamstring-9090',
      image: '/cooldown/leg/hamstring-9090.jpg',
      name: '90/90 Hamstring Stretch',
      target: 'Hamstrings',
      cue: 'On back, knee + hip 90°. Slowly straighten the leg.',
      unilateral: true,
    },
    {
      id: 'l-butterfly',
      image: '/cooldown/leg/butterfly.jpg',
      name: 'Butterfly Stretch',
      target: 'Adductors · Hip flexors',
      cue: 'Soles together, knees out. Hinge forward from the hips.',
    },
  ],
};
