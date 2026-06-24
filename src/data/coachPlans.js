// ─────────────────────────────────────────────────────────────────────
//  SKYLAR SCULPT PROTOCOL
//  Written for the actual goals Skylar gave us:
//    – Side delts + rear delts (visible cap, separation from arms)
//    – V-taper back driven by LATS alone — zero trap activation
//    – Tricep + bicep definition (isolation only)
//    – Visible abs + Roman lines
//    – Body recomp: 24% → 17% over 6–12 months
//
//  Every back move has an explicit anti-trap cue. Side-delt frequency
//  is bumped to 3×/week (Push + Pull finisher + Leg finisher) because
//  that is the keystone for cap roundness.
//
//  YouTube IDs reuse the existing curated tutorials where the same
//  exercise already lives in the default plan; new moves point at the
//  most authoritative form video I know.
// ─────────────────────────────────────────────────────────────────────

export const SKYLAR_PUSH = {
  id: 'push',
  name: 'Push · Sculpt',
  subtitle: 'Side Delts · Rear Delts · Triceps',
  focus: 'Capped Shoulders + Tricep Definition',
  estMinutes: 55,
  exercises: [
    {
      id: 's-push-1',
      name: 'Cable Lateral Raise (single arm)',
      order: 1,
      sets: 4,
      repRange: '12–20',
      restSeconds: 60,
      suggestedWeight: 'Cable 2.5–4.5 kg ea (start light, time-under-tension is the point)',
      currentWeight: '',
      goalWeight: '',
      priority: 'extreme',
      primaryMuscles: ['Side Delts'],
      secondaryMuscles: [],
      whyItMatters:
        'Cable tension stays constant through the entire rep — beats dumbbells for side-delt growth. Single arm = pure isolation, no compensation. This is THE move for round shoulder caps.',
      howTo: [
        'Stand sideways to a low-pulley cable. Handle in the outside hand.',
        'Lock the elbow at a slight bend. Lead with the elbow, not the hand.',
        'Raise to shoulder height — stop before traps engage.',
        '3-second eccentric back to the start. Eccentric is where it grows.',
      ],
      tips: [
        'Lean slightly AWAY from the cable to get full range at the top.',
        'Switch arms every set — alternates grip fatigue.',
        '4 kg × 18 perfect form > 8 kg × 6 with momentum.',
      ],
      commonMistakes: [
        'Yanking from the trap — shoulder stays DOWN the whole time.',
        'Going too heavy — this is an isolation move, not a press.',
        'Letting the hand lead instead of the elbow.',
      ],
      coachNote: 'Side-delt frequency = 3×/week. Keystone for the round cap look.',
      kneeFriendly: true,
      lowerBackFriendly: true,
    },
    {
      id: 's-push-2',
      name: 'Machine Shoulder Press',
      order: 2,
      sets: 3,
      repRange: '8–12',
      restSeconds: 90,
      suggestedWeight: 'Machine 15–20 kg (maintain — don\'t over-bulk front delts)',
      currentWeight: '',
      goalWeight: '',
      priority: 'high',
      primaryMuscles: ['Front Delts'],
      secondaryMuscles: ['Side Delts', 'Triceps'],
      whyItMatters:
        'Front-delt MAINTENANCE only — your front delts already get plenty of work from chest movements. 3 sets keeps them strong without overshadowing the side cap.',
      howTo: [
        'Seat height: handles at shoulder level (never above).',
        'Brace upper back into the pad. Drive straight up.',
        'Stop a hair before lockout. 3-sec eccentric.',
      ],
      tips: [
        'Lighter weight + longer ROM > heavier weight + half reps.',
        'If your front delts are catching up to your side caps, drop a set.',
      ],
      commonMistakes: [
        'Flaring elbows wide — strain on the shoulder joint.',
        'Arching lower back to push past failure.',
      ],
      coachNote: 'Volume INTENTIONALLY dropped from default 4 sets. Front delts are maintenance, not the focus.',
      kneeFriendly: true,
      lowerBackFriendly: true,
    },
    {
      id: 's-push-3',
      name: 'Reverse Pec Deck Machine',
      order: 3,
      sets: 4,
      repRange: '12–15',
      restSeconds: 60,
      suggestedWeight: 'Machine 10–18 kg (start light — rear delts are small)',
      currentWeight: '',
      goalWeight: '',
      priority: 'extreme',
      primaryMuscles: ['Rear Delts'],
      secondaryMuscles: ['Upper Back'],
      whyItMatters:
        'Best rear-delt isolation on the planet. Fixed path = elbows can\'t cheat upward into trap range. Chest pad takes lower-back stress out. This is what gives your shoulders the 3D look from the back.',
      howTo: [
        'Chest pinned to the pad, handles forward at shoulder height.',
        'Pull straight out (not down) — elbows lead, slight bend held.',
        'Squeeze rear delts at the back — pause 1 second.',
        '3-sec controlled return. Don\'t bang the stack.',
      ],
      tips: [
        'Imagine pinching a pencil between your shoulder blades, NOT shrugging.',
        'Hands NEUTRAL or slightly thumbs-up — opens up rear delt activation.',
      ],
      commonMistakes: [
        'Pulling DOWN into a row — that activates traps.',
        'Bringing the elbows above shoulder height = trap recruitment.',
        'Letting the chest come off the pad.',
      ],
      coachNote: 'Anti-trap: elbows stay LEVEL with shoulders. Never above. This + Cable Lateral is your shoulder sculpt foundation.',
      kneeFriendly: true,
      lowerBackFriendly: true,
    },
    {
      id: 's-push-4',
      name: 'Dumbbell Lateral Raise (myo-reps)',
      order: 4,
      sets: 3,
      repRange: '15–25',
      restSeconds: 45,
      suggestedWeight: 'DB 3–4.5 kg ea (light — chasing the burn, not the weight)',
      currentWeight: '',
      goalWeight: '',
      priority: 'high',
      primaryMuscles: ['Side Delts'],
      secondaryMuscles: [],
      whyItMatters:
        'Back-off set for the cap. Light weight + high reps + short rest forces metabolic stress and burns through residual fibers the cable raise missed.',
      howTo: [
        'Take half the weight you used on cable raises.',
        'Stand tall, lean slightly forward — keeps tension on side delt at lockout.',
        'Pump reps from full hang to shoulder height. Squeeze hard at the top.',
      ],
      tips: [
        'Stop when form breaks — momentum recruits traps.',
        'Burning means it\'s working.',
      ],
      commonMistakes: [
        'Going heavy and turning it into an upright row.',
        'Rocking the body — keep torso still.',
      ],
      coachNote: 'Optional myo-reps: 12 reps → 15s rest → 4 more → 15s → 4 more → 15s → 4 more.',
      kneeFriendly: true,
      lowerBackFriendly: true,
    },
    {
      id: 's-push-5',
      name: 'Cable Rope Tricep Pushdown',
      order: 5,
      sets: 3,
      repRange: '10–15',
      restSeconds: 60,
      suggestedWeight: 'Rope 10–18 kg (focus on the spread at the bottom)',
      currentWeight: '',
      goalWeight: '',
      priority: 'moderate',
      primaryMuscles: ['Triceps'],
      secondaryMuscles: [],
      whyItMatters:
        'Tricep definition for visible arm separation. Rope attachment lets you flare at the bottom = peak contraction of the long head (the part that makes the upper arm look bigger).',
      howTo: [
        'Cable high. Rope in both hands. Elbows pinned to your sides.',
        'Push down + apart at the bottom — flare the rope ends.',
        '1-sec squeeze at the lockout, 3-sec controlled return.',
      ],
      tips: [
        'Hands further apart at the bottom = more long-head activation.',
        'Keep elbows from drifting forward — that turns it into a chest move.',
      ],
      commonMistakes: [
        'Hunching the upper back to lean over the cable.',
        'Using bodyweight to throw the rope down.',
      ],
      coachNote: 'Triceps are 2/3 of the arm size. This is your arm-tone move.',
      kneeFriendly: true,
      lowerBackFriendly: true,
    },
    {
      id: 's-push-6',
      name: 'Hanging Leg Raises',
      order: 6,
      sets: 3,
      repRange: '8–15',
      restSeconds: 60,
      suggestedWeight: 'Bodyweight (knees tucked early if needed)',
      currentWeight: '',
      goalWeight: '',
      priority: 'high',
      primaryMuscles: ['Abs'],
      secondaryMuscles: ['Hip Flexors'],
      whyItMatters:
        'Best lower-ab move that hits the Roman line (the V at the hipline). Hanging anti-extension forces the entire trunk to brace.',
      howTo: [
        'Hang from a bar, shoulders ACTIVELY pulled down (no passive hang).',
        'Curl the pelvis up — think rolling the hips, not lifting the legs.',
        'Pause briefly at the top, slow return — no swinging.',
      ],
      tips: [
        'Bent knee version first. Build to straight legs over weeks.',
        'Squeeze glutes — kills the swing.',
      ],
      commonMistakes: [
        'Swinging the legs — momentum kills the ab activation.',
        'Pulling with hip flexors only — the pelvis must tilt.',
      ],
      coachNote: 'For Roman lines (马甲线), this beats every plank variant.',
      kneeFriendly: true,
      lowerBackFriendly: true,
    },
  ],
};

export const SKYLAR_PULL = {
  id: 'pull',
  name: 'Pull · V-Taper',
  subtitle: 'Lats · Rear Delts · Biceps',
  focus: 'Back Width (NO TRAPS) + Arm Definition',
  estMinutes: 55,
  exercises: [
    {
      id: 's-pull-1',
      name: 'Wide-Grip Lat Pulldown',
      order: 1,
      sets: 4,
      repRange: '8–12',
      restSeconds: 90,
      suggestedWeight: 'Machine 32–40 kg (your current 35 kg × 12 is great here)',
      currentWeight: '',
      goalWeight: '',
      priority: 'extreme',
      primaryMuscles: ['Lats'],
      secondaryMuscles: ['Biceps', 'Mid-Back'],
      whyItMatters:
        'THE V-taper builder. Wide grip + pull-to-collarbone trains lats at their widest point. Direct cause-effect for shoulder-to-waist ratio = tighter face look.',
      howTo: [
        'Wide grip (wider than shoulders). Lean back ~10°.',
        'SHOULDERS DOWN FIRST — pin shoulder blades into back pockets BEFORE pulling.',
        'Drive ELBOWS DOWN TO HIPS — not back, not up. Down.',
        'Bar to upper chest. Pause 1 second. 3-sec eccentric.',
      ],
      tips: [
        'Touch upper chest = full lat range. Stopping at chin = traps take over.',
        'Picture a straight line from elbow to ribs — that\'s the lat line.',
      ],
      commonMistakes: [
        '⚠️ SHRUGGING UP at the start of the rep = trap activation. Sink shoulders FIRST.',
        '⚠️ Pulling with arms instead of driving elbows down.',
        'Leaning back too far — turns it into a row.',
      ],
      coachNote: '🚫 ANTI-TRAP: Shoulder DOWN first, then elbow. Never the reverse.',
      kneeFriendly: true,
      lowerBackFriendly: true,
    },
    {
      id: 's-pull-2',
      name: 'Chest-Supported Machine Row (Neutral Grip)',
      order: 2,
      sets: 4,
      repRange: '10–12',
      restSeconds: 75,
      suggestedWeight: 'Machine 22–28 kg per side (your 22.5 kg history fits)',
      currentWeight: '',
      goalWeight: '',
      priority: 'extreme',
      primaryMuscles: ['Lats', 'Mid Back'],
      secondaryMuscles: ['Rear Delts', 'Biceps'],
      whyItMatters:
        'Chest pad pinned = lower back can\'t cheat. Neutral grip + low pull = lats + lower trap (the good trap section that makes the back look stacked), no UPPER trap.',
      howTo: [
        'Chest GLUED to pad — never lift off.',
        'Neutral (palms facing) handles. Pull to your LOWER ribs, not chin.',
        'Elbows stay BELOW shoulder height — non-negotiable.',
        'Squeeze at the back. 3-sec return.',
      ],
      tips: [
        'Slightly tuck the chin — prevents neck strain + signals shoulder-down.',
        'Drive elbows DOWN AND BACK — that\'s the lat row line.',
      ],
      commonMistakes: [
        '⚠️ Elbows flaring up to shoulder height = upper trap dominance.',
        'Chest coming off the pad to add weight.',
        'Pulling to the upper chest — that\'s a face pull, not a row.',
      ],
      coachNote: '🚫 ANTI-TRAP: Elbows STAY below shoulder line. Pull to lower ribs.',
      kneeFriendly: true,
      lowerBackFriendly: true,
    },
    {
      id: 's-pull-3',
      name: 'Straight-Arm Cable Pulldown',
      order: 3,
      sets: 3,
      repRange: '12–15',
      restSeconds: 60,
      suggestedWeight: 'Cable 12–18 kg (light — the stretch is the point)',
      currentWeight: '',
      goalWeight: '',
      priority: 'high',
      primaryMuscles: ['Lats'],
      secondaryMuscles: [],
      whyItMatters:
        'Pure lat isolation — biceps OFF, only the lat works. Locked-arm pulldown = the move that builds the LOWER lat point (the part that makes the V taper into the waist).',
      howTo: [
        'Cable HIGH. Straight bar attachment.',
        'Arms locked (slight bend, not bent). Step back so cable is at ~45° forward.',
        'Push the bar DOWN to your thighs in a clean arc. Lats squeeze at the bottom.',
        '3-sec control back up + feel the stretch at the top.',
      ],
      tips: [
        'Imagine you\'re pushing the floor away with the bar — engages lats max.',
        'Hinge slightly at the hip to clear the bar path.',
      ],
      commonMistakes: [
        'Bending the arms — turns it into a pushdown.',
        'Going too heavy → losing the lat squeeze.',
      ],
      coachNote: 'Zero biceps, zero traps. This is the secret weapon for lower-lat V.',
      kneeFriendly: true,
      lowerBackFriendly: true,
    },
    {
      id: 's-pull-4',
      name: 'Reverse Pec Deck Machine',
      order: 4,
      sets: 4,
      repRange: '12–15',
      restSeconds: 60,
      suggestedWeight: 'Machine 10–18 kg',
      currentWeight: '',
      goalWeight: '',
      priority: 'extreme',
      primaryMuscles: ['Rear Delts'],
      secondaryMuscles: ['Upper Back'],
      whyItMatters:
        'Doubling the rear-delt dose this week. Push day had it as the keystone — pull day repeats to lock in the cap.',
      howTo: [
        'Same form as Push day: chest pinned, neutral handles, elbows level.',
        'Squeeze the back, hold 1 sec.',
      ],
      tips: ['If you\'re sore from Push day, drop the weight 20% but keep the sets.'],
      commonMistakes: ['Pulling DOWN — that\'s a row, not a fly.'],
      coachNote: '🚫 ANTI-TRAP: Elbows level with shoulders. Never above.',
      kneeFriendly: true,
      lowerBackFriendly: true,
    },
    {
      id: 's-pull-5',
      name: 'Cable Hammer Curl (rope)',
      order: 5,
      sets: 3,
      repRange: '10–12',
      restSeconds: 60,
      suggestedWeight: 'Rope 12–16 kg',
      currentWeight: '',
      goalWeight: '',
      priority: 'moderate',
      primaryMuscles: ['Biceps', 'Brachialis'],
      secondaryMuscles: ['Forearms'],
      whyItMatters:
        'Hammer grip targets the BRACHIALIS — the muscle that pushes the bicep up and OUT, making the arm look thicker from the side. More aesthetic than supinated curls.',
      howTo: [
        'Cable low. Rope attachment. Stand close.',
        'Curl with NEUTRAL palms (hammer position). Elbows pinned to sides.',
        '1-sec squeeze at the top, 3-sec eccentric.',
      ],
      tips: [
        'Don\'t swing — the brachialis lives in the slow part of the rep.',
        'Last 2 reps cheat is fine for myo-rep style finish.',
      ],
      commonMistakes: [
        'Letting elbows drift forward — that\'s shoulder, not bicep.',
        'Going too heavy = forearms take over.',
      ],
      coachNote: 'Two arms together with rope > alternating dumbbells for this lift.',
      kneeFriendly: true,
      lowerBackFriendly: true,
    },
    {
      id: 's-pull-6',
      name: 'Cable Crunch',
      order: 6,
      sets: 3,
      repRange: '12–15',
      restSeconds: 60,
      suggestedWeight: 'Cable 18–28 kg (crunch is harder than it looks)',
      currentWeight: '',
      goalWeight: '',
      priority: 'high',
      primaryMuscles: ['Abs'],
      secondaryMuscles: ['Obliques'],
      whyItMatters:
        'Loaded ab work = thicker rectus = visible abs at higher body fat. Heavy crunches are an underrated move for the 6-pack look.',
      howTo: [
        'Cable high, rope attachment. Kneel facing away from the cable.',
        'Rope at the back of the neck. Crunch DOWN, not forward — pull elbows toward thighs.',
        '1-sec squeeze, 3-sec back up.',
      ],
      tips: [
        'Keep the hips LOCKED — only the spine moves.',
        'Picture rounding your back forward like the letter C.',
      ],
      commonMistakes: [
        'Pulling with the arms — keep rope position fixed.',
        'Letting hips bend instead of spine.',
      ],
      coachNote: 'Best move for visible upper abs.',
      kneeFriendly: true,
      lowerBackFriendly: true,
    },
  ],
};

export const SKYLAR_LEG = {
  id: 'leg',
  name: 'Leg · Glutes + Cap',
  subtitle: 'Glutes · Hamstrings · Side Delt Finisher',
  focus: 'Glute Shape + Side Delt Frequency Dose',
  estMinutes: 65,
  exercises: [
    {
      id: 's-leg-1',
      name: 'Hip Thrust (Machine or Barbell)',
      order: 1,
      sets: 4,
      repRange: '8–12',
      restSeconds: 90,
      suggestedWeight: 'Machine 25–45 kg or BB 30–50 kg',
      currentWeight: '',
      goalWeight: '',
      priority: 'extreme',
      primaryMuscles: ['Glutes'],
      secondaryMuscles: ['Hamstrings', 'Core'],
      whyItMatters:
        'Best glute builder on Earth. Targets glute max at peak contraction — that\'s the shape, not the size of the leg.',
      howTo: [
        'Upper back on bench/pad, shoulder blades supporting weight.',
        'Heels under knees, knees bent 90°.',
        'Drive through HEELS — squeeze glutes hard at the top.',
        '1-sec squeeze, 3-sec return — full hip extension only.',
      ],
      tips: [
        'Ribs DOWN — don\'t overextend the lower back at the top.',
        'Chin tucked = better glute focus.',
      ],
      commonMistakes: [
        'Overextending the back = lumbar pain, not glute work.',
        'Not getting full hip lockout = leaving gains on the table.',
      ],
      coachNote: 'Move #1 because glutes set the lower body silhouette.',
      kneeFriendly: true,
      lowerBackFriendly: true,
    },
    {
      id: 's-leg-2',
      name: 'Leg Press',
      order: 2,
      sets: 3,
      repRange: '8–12',
      restSeconds: 90,
      suggestedWeight: 'Machine 40–70 kg (start conservative)',
      currentWeight: '',
      goalWeight: '',
      priority: 'high',
      primaryMuscles: ['Quads', 'Glutes'],
      secondaryMuscles: ['Hamstrings'],
      whyItMatters:
        'Quads + glutes without spine load. Safer than barbell squats while giving 90% of the muscle benefit.',
      howTo: [
        'Feet shoulder width on the platform, slightly higher than center.',
        'Lower until knees ~90°. Don\'t round lower back into the pad.',
        'Drive through MID-FOOT, not toes. 3-sec eccentric.',
      ],
      tips: [
        'Feet higher on platform = more glute / hamstring.',
        'Feet lower = more quad.',
      ],
      commonMistakes: [
        'Locking knees at the top — kills tension.',
        'Lifting hips off the pad at the bottom = lower back load.',
      ],
      coachNote: 'Knee-friendly compound. Pick the foot position based on what you want emphasized.',
      kneeFriendly: true,
      lowerBackFriendly: true,
    },
    {
      id: 's-leg-3',
      name: 'Romanian Deadlift (Dumbbell or Smith)',
      order: 3,
      sets: 3,
      repRange: '8–10',
      restSeconds: 90,
      suggestedWeight: 'DB 15–22 kg ea or Smith 25–35 kg',
      currentWeight: '',
      goalWeight: '',
      priority: 'high',
      primaryMuscles: ['Hamstrings', 'Glutes'],
      secondaryMuscles: ['Lower Back', 'Lats'],
      whyItMatters:
        'Best hamstring stretch + glute work. Hamstrings give the legs that lean, separated look.',
      howTo: [
        'Stand with weights at thighs. Soft knee bend (10–15°).',
        'Hip HINGE — push hips back, chest stays proud.',
        'Lower until you feel deep hamstring stretch (typically mid-shin).',
        'Drive hips forward to stand back up.',
      ],
      tips: [
        'BAR/WEIGHTS stay close to the body the entire time.',
        'Stop wherever your hamstrings cap your stretch — DON\'T round the back.',
      ],
      commonMistakes: [
        '⚠️ Rounding the lower back — back-friendly cue, you said!',
        'Squatting instead of hinging — bend hips, not knees.',
      ],
      coachNote: 'Lower back friendly version: lighter weights + Smith machine for guide.',
      kneeFriendly: true,
      lowerBackFriendly: true,
    },
    {
      id: 's-leg-4',
      name: 'Bulgarian Split Squat',
      order: 4,
      sets: 3,
      repRange: '10 ea',
      restSeconds: 75,
      suggestedWeight: 'BW or 5–10 kg DBs',
      currentWeight: '',
      goalWeight: '',
      priority: 'moderate',
      primaryMuscles: ['Quads', 'Glutes'],
      secondaryMuscles: ['Adductors', 'Core'],
      whyItMatters:
        'Unilateral move — fixes left/right imbalances and builds glute shape from the side.',
      howTo: [
        'Back foot on a bench behind you. Front foot far enough that knee tracks over ankle.',
        'Lean torso SLIGHTLY forward = more glute. Upright = more quad.',
        'Lower until back knee almost touches ground. Push through front HEEL.',
      ],
      tips: [
        'Keep front knee tracking over second toe — no caving in.',
        'Both arms in goblet position holds counterbalances well.',
      ],
      commonMistakes: [
        'Too short stance — front knee overshoots ankle.',
        'Bouncing at the bottom.',
      ],
      coachNote: 'Knee-friendly only with proper stance. If knee complains, switch to step-ups.',
      kneeFriendly: true,
      lowerBackFriendly: true,
    },
    {
      id: 's-leg-5',
      name: 'Cable Lateral Raise (3rd shoulder dose)',
      order: 5,
      sets: 4,
      repRange: '12–15',
      restSeconds: 60,
      suggestedWeight: 'Cable 2.5–4.5 kg ea',
      currentWeight: '',
      goalWeight: '',
      priority: 'high',
      primaryMuscles: ['Side Delts'],
      secondaryMuscles: [],
      whyItMatters:
        'Third side-delt session of the week. Frequency drives cap roundness — the more often you train it (within recovery), the faster it grows.',
      howTo: [
        'Same as Push day. Single arm cable, control the eccentric.',
        'After lower-body work, this hits fresh — make it count.',
      ],
      tips: ['Set this up AFTER your lower body so you don\'t skip it tired.'],
      commonMistakes: ['Skipping it because legs are toasted.'],
      coachNote: 'Side-delt frequency dose #3 of the week.',
      kneeFriendly: true,
      lowerBackFriendly: true,
    },
    {
      id: 's-leg-6',
      name: 'Standing Calf Raise (machine)',
      order: 6,
      sets: 3,
      repRange: '12–15',
      restSeconds: 45,
      suggestedWeight: 'Machine 30–50 kg',
      currentWeight: '',
      goalWeight: '',
      priority: 'low',
      primaryMuscles: ['Calves'],
      secondaryMuscles: [],
      whyItMatters: 'Optional. Calves are mostly genetic but worth 5 minutes for the back of the leg line.',
      howTo: [
        'Balls of feet on platform, heels hanging.',
        'Push to max ankle extension at the top. 2-sec squeeze.',
        '3-sec stretch at the bottom — eccentric is the calf money.',
      ],
      tips: ['Slow > heavy here. Calves respond to time-under-tension.'],
      commonMistakes: ['Bouncing reps.', 'Half range.'],
      coachNote: 'Skip if short on time.',
      kneeFriendly: true,
      lowerBackFriendly: true,
    },
    {
      id: 's-leg-7',
      name: 'Dead Bug',
      order: 7,
      sets: 3,
      repRange: '8 ea',
      restSeconds: 45,
      suggestedWeight: 'Bodyweight (light DB optional)',
      currentWeight: '',
      goalWeight: '',
      priority: 'moderate',
      primaryMuscles: ['Abs', 'Deep Core'],
      secondaryMuscles: [],
      whyItMatters:
        'Anti-extension core. Builds the deep core that holds the spine + makes the abs LOOK tighter even at higher body fat.',
      howTo: [
        'On back. Arms straight up, knees over hips (90° each joint).',
        'Lower opposite arm + leg toward floor — DON\'T let lower back arch.',
        'Slow return. Switch sides.',
      ],
      tips: [
        'Press lower back INTO the floor the whole time.',
        'Slow > many reps. 8 perfect > 20 messy.',
      ],
      commonMistakes: [
        'Lower back coming off the floor = brace fail.',
        'Going too fast — defeats the point.',
      ],
      coachNote: 'Best lower-back friendly core move. Do this even on rest days if you want.',
      kneeFriendly: true,
      lowerBackFriendly: true,
    },
  ],
};

export const SKYLAR_PLAN = {
  push: SKYLAR_PUSH,
  pull: SKYLAR_PULL,
  leg: SKYLAR_LEG,
};

// Suggested YouTube tutorials for the NEW exercises in this plan.
// Reuses curated default-plan IDs where the move already exists;
// the user can swap any one via the modal pencil at any time.
// Mapping: exercise.id  →  default youtubeId fallback
export const SKYLAR_TUTORIAL_FALLBACKS = {
  // Push
  's-push-1': '4tj4DH9KuQI', // DeltaBolic — PERFECT Cable Lateral Raise (fallback to lateral raise default)
  's-push-2': '6v4nrRVySj0', // The PERFECT Machine Shoulder Press (push-1 machine variant)
  's-push-3': 'TfwzWdvHGiM', // Jeff Nippard — Reverse Pec Deck (rear delt fallback)
  's-push-4': 'mGqEWBCWN9c', // DeltaBolic — Lateral Raises
  's-push-5': '-PqzEk57xiw', // DeltaBolic — PERFECT Tricep Pushdown (rope variant)
  's-push-6': '_HDZODOx7Zw', // DeltaBolic — Hanging Leg Raises
  // Pull
  's-pull-1': 'CAwf7n6Luuc', // Jeff Nippard — Wide Lat Pulldown
  's-pull-2': '4v59ShSjX2w', // DeltaBolic — Chest-Supported Row (T-Bar version)
  's-pull-3': 'la9JtkfcqgY', // Renaissance — Straight-Arm Pulldown
  's-pull-4': 'TfwzWdvHGiM', // Jeff Nippard — Reverse Pec Deck
  's-pull-5': 'RHc3CVgM8jw', // Jeff Nippard — Hammer Curl
  's-pull-6': 'kvw60RrZ8mg', // Jeff Nippard — Cable Crunch
  // Leg
  's-leg-1': 'xDmFkJxPzeM', // Bret Contreras — Hip Thrust
  's-leg-2': 'IZxyjW7MPJQ', // DeltaBolic — Leg Press
  's-leg-3': 'jEy_czb3RKA', // DeltaBolic — RDL
  's-leg-4': '2C-uNgKwPLE', // Athlean-X — Bulgarian Split Squat
  's-leg-5': '4tj4DH9KuQI', // Cable Lateral Raise
  's-leg-6': '-M4-G8p8fmc', // Standing Calf Raise
  's-leg-7': '4XLEnwUr1d8', // Dead Bug
};
