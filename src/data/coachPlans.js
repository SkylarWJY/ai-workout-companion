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
  nameZh: '推日 · 雕刻',
  subtitle: 'Side Delts · Rear Delts · Triceps',
  subtitleZh: '中束 · 后束 · 三头',
  focus: 'Capped Shoulders + Tricep Definition',
  focusZh: '圆肩膀 + 三头分离线',
  estMinutes: 55,
  exercises: [
    {
      id: 's-push-1',
      name: 'Cable Lateral Raise (single arm)',
      nameZh: '绳索侧平举（单手）',
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
      whyItMattersZh:
        '绳索的张力贯穿整个动作 — 中束生长效率超过哑铃。单手做＝纯孤立，没有代偿。这是圆肩膀肌肉帽的核心动作。',
      howTo: [
        'Stand sideways to a low-pulley cable. Handle in the outside hand.',
        'Lock the elbow at a slight bend. Lead with the elbow, not the hand.',
        'Raise to shoulder height — stop before traps engage.',
        '3-second eccentric back to the start. Eccentric is where it grows.',
      ],
      howToZh: [
        '侧身站在低位绳索旁，外侧手握把。',
        '肘部微弯锁死，让肘部领动，不是手。',
        '抬到肩膀高度 — 斜方肌一参与就立刻停。',
        '3 秒离心慢慢回起点。离心阶段才是长肌肉的关键。',
      ],
      tips: [
        'Lean slightly AWAY from the cable to get full range at the top.',
        'Switch arms every set — alternates grip fatigue.',
        '4 kg × 18 perfect form > 8 kg × 6 with momentum.',
      ],
      tipsZh: [
        '身体微微远离绳索 — 顶端能拉到更完整的行程。',
        '每组换手，避免握力疲劳。',
        '4 kg × 18 标准动作 > 8 kg × 6 借力。',
      ],
      commonMistakes: [
        'Yanking from the trap — shoulder stays DOWN the whole time.',
        'Going too heavy — this is an isolation move, not a press.',
        'Letting the hand lead instead of the elbow.',
      ],
      commonMistakesZh: [
        '用斜方肌带动 — 肩膀必须始终下沉。',
        '上重量太猛 — 这是孤立动作，不是推举。',
        '用手引导而不是肘部领动。',
      ],
      coachNote: 'Side-delt frequency = 3×/week. Keystone for the round cap look.',
      coachNoteZh: '中束每周训练 3 次。圆肩膀肌肉帽的核心动作。',
      kneeFriendly: true,
      lowerBackFriendly: true,
    },
    {
      id: 's-push-2',
      name: 'Machine Shoulder Press',
      nameZh: '推肩机',
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
      whyItMattersZh:
        '只是前束 维持 — 推胸动作已经够练前束了。3 组保持力量，但不会盖过侧束的视觉。',
      howTo: [
        'Seat height: handles at shoulder level (never above).',
        'Brace upper back into the pad. Drive straight up.',
        'Stop a hair before lockout. 3-sec eccentric.',
      ],
      howToZh: [
        '座椅高度：握把刚好在肩膀高度（永远不要更高）。',
        '上背贴稳靠垫，直上推。',
        '上推快到顶时提前停一点，3 秒离心。',
      ],
      tips: [
        'Lighter weight + longer ROM > heavier weight + half reps.',
        'If your front delts are catching up to your side caps, drop a set.',
      ],
      tipsZh: [
        '轻一点的重量 + 更完整的行程 > 大重量但半截行程。',
        '如果前束开始盖过侧束的样子，立刻砍一组。',
      ],
      commonMistakes: [
        'Flaring elbows wide — strain on the shoulder joint.',
        'Arching lower back to push past failure.',
      ],
      commonMistakesZh: [
        '肘部张太开 — 伤肩关节。',
        '靠塌腰借力 — 找其他重量。',
      ],
      coachNote: 'Volume INTENTIONALLY dropped from default 4 sets. Front delts are maintenance, not the focus.',
      coachNoteZh: '组数从默认的 4 组刻意降到 3 组。前束只维持，不是重点。',
      kneeFriendly: true,
      lowerBackFriendly: true,
    },
    {
      id: 's-push-3',
      name: 'Reverse Pec Deck Machine',
      nameZh: '反向蝴蝶机',
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
      whyItMattersZh:
        '地球上最好的后束孤立动作。固定轨道 = 肘部不会偷偷抬上斜方肌区域。胸垫去掉下背压力。这就是让肩膀从背面看有 3D 立体感的核心动作。',
      howTo: [
        'Chest pinned to the pad, handles forward at shoulder height.',
        'Pull straight out (not down) — elbows lead, slight bend held.',
        'Squeeze rear delts at the back — pause 1 second.',
        '3-sec controlled return. Don\'t bang the stack.',
      ],
      howToZh: [
        '胸部紧贴胸垫，握把放在肩膀高度的前方。',
        '直接往两侧拉（不是往下）— 肘部领动，微弯保持。',
        '后端夹紧后束 — 顶端停 1 秒。',
        '3 秒控制回去，不要砸配重片。',
      ],
      tips: [
        'Imagine pinching a pencil between your shoulder blades, NOT shrugging.',
        'Hands NEUTRAL or slightly thumbs-up — opens up rear delt activation.',
      ],
      tipsZh: [
        '想象两个肩胛骨之间夹一支铅笔，不是耸肩。',
        '握把保持 中性 或稍微大拇指朝上 — 后束最容易激活。',
      ],
      commonMistakes: [
        'Pulling DOWN into a row — that activates traps.',
        'Bringing the elbows above shoulder height = trap recruitment.',
        'Letting the chest come off the pad.',
      ],
      commonMistakesZh: [
        '往下拉做成划船 — 那是斜方肌发力。',
        '肘部抬到肩膀以上 = 斜方肌偷工。',
        '胸离开胸垫。',
      ],
      coachNote: 'Anti-trap: elbows stay LEVEL with shoulders. Never above. This + Cable Lateral is your shoulder sculpt foundation.',
      coachNoteZh: '🚫 不动斜方：肘部与肩膀齐平，永远不超过。这个 + 绳索侧平举 = 你雕刻肩膀的两个基石。',
      kneeFriendly: true,
      lowerBackFriendly: true,
    },
    {
      id: 's-push-4',
      name: 'Dumbbell Lateral Raise (myo-reps)',
      nameZh: '哑铃侧平举（myo-reps 燃烧组）',
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
      whyItMattersZh:
        '肩膀帽的减重收尾组。轻重量 + 高次数 + 短休息 = 强制代谢压力，烧掉绳索侧平举没顾上的残余肌纤维。',
      howTo: [
        'Take half the weight you used on cable raises.',
        'Stand tall, lean slightly forward — keeps tension on side delt at lockout.',
        'Pump reps from full hang to shoulder height. Squeeze hard at the top.',
      ],
      howToZh: [
        '用你绳索侧平举一半的重量。',
        '站直，身体微微前倾 — 顶端中束才有持续张力。',
        '从完全下放到肩膀高度，顶端用力夹一下。',
      ],
      tips: [
        'Stop when form breaks — momentum recruits traps.',
        'Burning means it\'s working.',
      ],
      tipsZh: [
        '动作变形立刻停 — 借力等于让斜方肌参与。',
        '烧得感觉就是有效。',
      ],
      commonMistakes: [
        'Going heavy and turning it into an upright row.',
        'Rocking the body — keep torso still.',
      ],
      commonMistakesZh: [
        '上重量太大变成直立划船。',
        '身体摇晃借力 — 躯干保持稳定。',
      ],
      coachNote: 'Optional myo-reps: 12 reps → 15s rest → 4 more → 15s → 4 more → 15s → 4 more.',
      coachNoteZh: '可选 myo-reps：12 下 → 休 15 秒 → 再 4 下 → 休 15 秒 → 再 4 下 → 休 15 秒 → 再 4 下。',
      kneeFriendly: true,
      lowerBackFriendly: true,
    },
    {
      id: 's-push-5',
      name: 'Cable Rope Tricep Pushdown',
      nameZh: '绳索三头下压（绳子把手）',
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
      whyItMattersZh:
        '让手臂分离线条更清晰的三头训练。绳子把手底端可以撇开 = 长头峰收缩（就是让上臂看起来更立体的那块肌肉）。',
      howTo: [
        'Cable high. Rope in both hands. Elbows pinned to your sides.',
        'Push down + apart at the bottom — flare the rope ends.',
        '1-sec squeeze at the lockout, 3-sec controlled return.',
      ],
      howToZh: [
        '绳索高位，双手握绳。肘部贴紧身体两侧。',
        '下压 + 底端两手撇开 — 把绳子尾端拉开。',
        '锁定位置夹紧 1 秒，3 秒控制回去。',
      ],
      tips: [
        'Hands further apart at the bottom = more long-head activation.',
        'Keep elbows from drifting forward — that turns it into a chest move.',
      ],
      tipsZh: [
        '底端双手分得越开 = 长头激活越多。',
        '肘部不要前飘 — 一前飘就变成胸的动作了。',
      ],
      commonMistakes: [
        'Hunching the upper back to lean over the cable.',
        'Using bodyweight to throw the rope down.',
      ],
      commonMistakesZh: [
        '上背弓起来往绳索方向探。',
        '用体重把绳子甩下去。',
      ],
      coachNote: 'Triceps are 2/3 of the arm size. This is your arm-tone move.',
      coachNoteZh: '三头占整个手臂围度的 2/3。这就是让手臂更立体的关键动作。',
      kneeFriendly: true,
      lowerBackFriendly: true,
    },
    {
      id: 's-push-6',
      name: 'Hanging Leg Raises',
      nameZh: '悬挂举腿',
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
      whyItMattersZh:
        '最好的下腹动作，专打马甲线（髋部那道 V）。悬挂抗伸展强制整个躯干收紧。',
      howTo: [
        'Hang from a bar, shoulders ACTIVELY pulled down (no passive hang).',
        'Curl the pelvis up — think rolling the hips, not lifting the legs.',
        'Pause briefly at the top, slow return — no swinging.',
      ],
      howToZh: [
        '悬挂在杠上，肩膀 主动 下沉（不要被动垂着）。',
        '把骨盆卷上来 — 想着滚动髋部，不是抬腿。',
        '顶端稍停，慢慢回去，不要摆动。',
      ],
      tips: [
        'Bent knee version first. Build to straight legs over weeks.',
        'Squeeze glutes — kills the swing.',
      ],
      tipsZh: [
        '先做屈膝版，几周后再做直腿。',
        '夹紧臀部 — 可以消除摆动。',
      ],
      commonMistakes: [
        'Swinging the legs — momentum kills the ab activation.',
        'Pulling with hip flexors only — the pelvis must tilt.',
      ],
      commonMistakesZh: [
        '摆动腿 — 借力之后腹肌就练不到了。',
        '只用髂腰肌拉 — 骨盆必须翻转。',
      ],
      coachNote: 'For Roman lines (马甲线), this beats every plank variant.',
      coachNoteZh: '想练马甲线，这个比任何平板支撑都强。',
      kneeFriendly: true,
      lowerBackFriendly: true,
    },
  ],
};

export const SKYLAR_PULL = {
  id: 'pull',
  name: 'Pull · V-Taper',
  nameZh: '拉日 · V 倒三角',
  subtitle: 'Lats · Rear Delts · Biceps',
  subtitleZh: '阔背 · 后束 · 二头',
  focus: 'Back Width (NO TRAPS) + Arm Definition',
  focusZh: '背阔宽（不动斜方）+ 手臂线条',
  estMinutes: 55,
  exercises: [
    {
      id: 's-pull-1',
      name: 'Wide-Grip Lat Pulldown',
      nameZh: '宽距高位下拉',
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
      whyItMattersZh:
        'V 倒三角的核心动作。宽距 + 拉到锁骨位置 = 阔背最宽处发力。直接决定你的肩腰比 = 脸看上去更紧实。',
      howTo: [
        'Wide grip (wider than shoulders). Lean back ~10°.',
        'SHOULDERS DOWN FIRST — pin shoulder blades into back pockets BEFORE pulling.',
        'Drive ELBOWS DOWN TO HIPS — not back, not up. Down.',
        'Bar to upper chest. Pause 1 second. 3-sec eccentric.',
      ],
      howToZh: [
        '宽握（比肩宽）。身体后倾约 10°。',
        '肩膀先沉下来 — 拉之前先把肩胛骨"塞进后裤袋"。',
        '把肘部 往下、往髋部方向 拉 — 不是往后，不是往上，是 往下。',
        '拉到上胸位置。停 1 秒。3 秒离心。',
      ],
      tips: [
        'Touch upper chest = full lat range. Stopping at chin = traps take over.',
        'Picture a straight line from elbow to ribs — that\'s the lat line.',
      ],
      tipsZh: [
        '碰到上胸 = 阔背最完整的行程。停在下巴位置 = 斜方肌接管了。',
        '想象从肘部到肋骨有一条直线 — 那就是阔背的发力线。',
      ],
      commonMistakes: [
        '⚠️ SHRUGGING UP at the start of the rep = trap activation. Sink shoulders FIRST.',
        '⚠️ Pulling with arms instead of driving elbows down.',
        'Leaning back too far — turns it into a row.',
      ],
      commonMistakesZh: [
        '⚠️ 开始时耸肩 = 斜方肌发力。先把肩膀沉下来。',
        '⚠️ 用手臂拉，而不是用肘部往下带。',
        '后仰太多 — 变成划船了。',
      ],
      coachNote: '🚫 ANTI-TRAP: Shoulder DOWN first, then elbow. Never the reverse.',
      coachNoteZh: '🚫 不动斜方：先把肩胛骨往下沉，再启动肘部。永远不要反过来。',
      kneeFriendly: true,
      lowerBackFriendly: true,
    },
    {
      id: 's-pull-2',
      name: 'Chest-Supported Machine Row (Neutral Grip)',
      nameZh: '胸托划船机（中性握）',
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
      whyItMattersZh:
        '胸贴胸垫 = 下背没法偷工。中性握 + 低位拉 = 阔背 + 下斜方（让背看上去厚实的"好"斜方部分），不动 上 斜方。',
      howTo: [
        'Chest GLUED to pad — never lift off.',
        'Neutral (palms facing) handles. Pull to your LOWER ribs, not chin.',
        'Elbows stay BELOW shoulder height — non-negotiable.',
        'Squeeze at the back. 3-sec return.',
      ],
      howToZh: [
        '胸 粘 在胸垫上 — 永远不要离开。',
        '中性握（掌心相对）。拉到 下肋骨 位置，不是下巴。',
        '肘部始终低于肩膀高度 — 不能商量。',
        '后端用力夹一下。3 秒回去。',
      ],
      tips: [
        'Slightly tuck the chin — prevents neck strain + signals shoulder-down.',
        'Drive elbows DOWN AND BACK — that\'s the lat row line.',
      ],
      tipsZh: [
        '微微收下巴 — 保护颈椎 + 提示肩膀下沉。',
        '肘部 往下、往后 拉 — 这是阔背划船的发力线。',
      ],
      commonMistakes: [
        '⚠️ Elbows flaring up to shoulder height = upper trap dominance.',
        'Chest coming off the pad to add weight.',
        'Pulling to the upper chest — that\'s a face pull, not a row.',
      ],
      commonMistakesZh: [
        '⚠️ 肘部张开抬到肩膀高度 = 上斜方接管。',
        '胸离开胸垫去借力。',
        '拉到上胸 — 那是面拉，不是划船。',
      ],
      coachNote: '🚫 ANTI-TRAP: Elbows STAY below shoulder line. Pull to lower ribs.',
      coachNoteZh: '🚫 不动斜方：肘部始终保持在肩膀以下。划到下肋骨位置。',
      kneeFriendly: true,
      lowerBackFriendly: true,
    },
    {
      id: 's-pull-3',
      name: 'Straight-Arm Cable Pulldown',
      nameZh: '直臂绳索下压',
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
      whyItMattersZh:
        '纯阔背孤立 — 二头不参与，只有阔背工作。锁臂下压 = 练下阔背最尖那一段（让 V 字真正收到腰部的关键）。',
      howTo: [
        'Cable HIGH. Straight bar attachment.',
        'Arms locked (slight bend, not bent). Step back so cable is at ~45° forward.',
        'Push the bar DOWN to your thighs in a clean arc. Lats squeeze at the bottom.',
        '3-sec control back up + feel the stretch at the top.',
      ],
      howToZh: [
        '绳索 高位。直杆把手。',
        '手臂锁住（微弯，不是弯曲）。往后站让绳索往前 约 45°。',
        '画弧线把杆 往下 压到大腿。底端阔背用力夹一下。',
        '3 秒控制回去 + 顶端感受拉伸。',
      ],
      tips: [
        'Imagine you\'re pushing the floor away with the bar — engages lats max.',
        'Hinge slightly at the hip to clear the bar path.',
      ],
      tipsZh: [
        '想象用杆把地板推开 — 阔背激活最大化。',
        '髋部稍微前倾给杆让出运动轨迹。',
      ],
      commonMistakes: [
        'Bending the arms — turns it into a pushdown.',
        'Going too heavy → losing the lat squeeze.',
      ],
      commonMistakesZh: [
        '手肘弯曲 — 变成三头下压了。',
        '上重量太大 → 阔背的挤压感丢掉。',
      ],
      coachNote: 'Zero biceps, zero traps. This is the secret weapon for lower-lat V.',
      coachNoteZh: '零二头、零斜方。这是练下背阔（V 字最尖部分）的秘密武器。',
      kneeFriendly: true,
      lowerBackFriendly: true,
    },
    {
      id: 's-pull-4',
      name: 'Reverse Pec Deck Machine',
      nameZh: '反向蝴蝶机',
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
      whyItMattersZh:
        '本周后束的第 2 次训练。推日已经做了核心组，拉日重复一遍把肩膀帽刻死。',
      howTo: [
        'Same form as Push day: chest pinned, neutral handles, elbows level.',
        'Squeeze the back, hold 1 sec.',
      ],
      howToZh: [
        '动作和推日一样：胸贴垫，中性握，肘部与肩平。',
        '后端用力夹紧，停 1 秒。',
      ],
      tips: ['If you\'re sore from Push day, drop the weight 20% but keep the sets.'],
      tipsZh: ['如果推日做完还酸，重量减 20% 但组数保留。'],
      commonMistakes: ['Pulling DOWN — that\'s a row, not a fly.'],
      commonMistakesZh: ['往下拉 — 那是划船，不是飞鸟。'],
      coachNote: '🚫 ANTI-TRAP: Elbows level with shoulders. Never above.',
      coachNoteZh: '🚫 不动斜方：肘部与肩膀齐平，永远不超过。',
      kneeFriendly: true,
      lowerBackFriendly: true,
    },
    {
      id: 's-pull-5',
      name: 'Cable Hammer Curl (rope)',
      nameZh: '绳索锤式弯举（绳子把手）',
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
      whyItMattersZh:
        '锤式握法专门打 肱肌 — 把二头从下面往外推，让手臂从侧面看更厚。比传统反握弯举更有美学效果。',
      howTo: [
        'Cable low. Rope attachment. Stand close.',
        'Curl with NEUTRAL palms (hammer position). Elbows pinned to sides.',
        '1-sec squeeze at the top, 3-sec eccentric.',
      ],
      howToZh: [
        '绳索 低位。绳子把手。站近一点。',
        '中性握（锤式位置）弯举。肘部紧贴身体。',
        '顶端夹紧 1 秒，3 秒离心。',
      ],
      tips: [
        'Don\'t swing — the brachialis lives in the slow part of the rep.',
        'Last 2 reps cheat is fine for myo-rep style finish.',
      ],
      tipsZh: [
        '不要摆动 — 肱肌是在慢动作里被激活的。',
        '最后 2 下借点力收尾没问题（myo-rep 风格）。',
      ],
      commonMistakes: [
        'Letting elbows drift forward — that\'s shoulder, not bicep.',
        'Going too heavy = forearms take over.',
      ],
      commonMistakesZh: [
        '肘部前飘 — 那是肩膀发力，不是二头。',
        '上重量太大 = 前臂接管。',
      ],
      coachNote: 'Two arms together with rope > alternating dumbbells for this lift.',
      coachNoteZh: '双手一起用绳索 > 哑铃交替弯举（这个动作来说）。',
      kneeFriendly: true,
      lowerBackFriendly: true,
    },
    {
      id: 's-pull-6',
      name: 'Cable Crunch',
      nameZh: '绳索卷腹',
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
      whyItMattersZh:
        '负重练腹 = 腹直肌更厚 = 体脂稍高也能看到腹肌。重量卷腹是练 6 块腹肌外形的低估动作。',
      howTo: [
        'Cable high, rope attachment. Kneel facing away from the cable.',
        'Rope at the back of the neck. Crunch DOWN, not forward — pull elbows toward thighs.',
        '1-sec squeeze, 3-sec back up.',
      ],
      howToZh: [
        '绳索高位，绳子把手。跪着背对绳索。',
        '绳子绕过颈后。往 下 卷腹（不是前），把肘部往大腿方向拉。',
        '夹紧 1 秒，3 秒慢慢回去。',
      ],
      tips: [
        'Keep the hips LOCKED — only the spine moves.',
        'Picture rounding your back forward like the letter C.',
      ],
      tipsZh: [
        '髋部锁死 — 只有脊柱在动。',
        '想象把背弯成字母 C。',
      ],
      commonMistakes: [
        'Pulling with the arms — keep rope position fixed.',
        'Letting hips bend instead of spine.',
      ],
      commonMistakesZh: [
        '用手臂拉 — 绳子位置固定不动。',
        '让髋部弯曲，不是脊柱。',
      ],
      coachNote: 'Best move for visible upper abs.',
      coachNoteZh: '让上腹更清晰的最佳动作。',
      kneeFriendly: true,
      lowerBackFriendly: true,
    },
  ],
};

export const SKYLAR_LEG = {
  id: 'leg',
  name: 'Leg · Glutes + Cap',
  nameZh: '腿日 · 臀 + 肩膀第三剂',
  subtitle: 'Glutes · Hamstrings · Side Delt Finisher',
  subtitleZh: '臀 · 腿后 · 中束加餐',
  focus: 'Glute Shape + Side Delt Frequency Dose',
  focusZh: '臀型 + 中束训练第三次',
  estMinutes: 65,
  exercises: [
    {
      id: 's-leg-1',
      name: 'Hip Thrust (Machine or Barbell)',
      nameZh: '臀推（机器或杠铃）',
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
      whyItMattersZh:
        '地球上最好的臀部塑形动作。峰收缩打臀大肌 — 决定的是臀型，不是腿的围度。',
      howTo: [
        'Upper back on bench/pad, shoulder blades supporting weight.',
        'Heels under knees, knees bent 90°.',
        'Drive through HEELS — squeeze glutes hard at the top.',
        '1-sec squeeze, 3-sec return — full hip extension only.',
      ],
      howToZh: [
        '上背靠在凳子或胸垫上，肩胛骨承担重量。',
        '脚跟在膝盖下方，膝盖弯 90°。',
        '用 脚跟 蹬地 — 顶端臀部用力夹紧。',
        '夹紧 1 秒，3 秒回去 — 必须完全伸髋。',
      ],
      tips: [
        'Ribs DOWN — don\'t overextend the lower back at the top.',
        'Chin tucked = better glute focus.',
      ],
      tipsZh: [
        '肋骨 收住 — 顶端不要塌腰过伸。',
        '收下巴 = 臀部发力更集中。',
      ],
      commonMistakes: [
        'Overextending the back = lumbar pain, not glute work.',
        'Not getting full hip lockout = leaving gains on the table.',
      ],
      commonMistakesZh: [
        '过伸下背 = 腰痛，不是臀部训练。',
        '没有完全锁髋 = 收益打折。',
      ],
      coachNote: 'Move #1 because glutes set the lower body silhouette.',
      coachNoteZh: '排在第一位，因为臀部决定下半身整个轮廓。',
      kneeFriendly: true,
      lowerBackFriendly: true,
    },
    {
      id: 's-leg-2',
      name: 'Leg Press',
      nameZh: '腿举',
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
      whyItMattersZh:
        '股四头 + 臀部，但没有脊柱负荷。比杠铃深蹲安全，肌肉收益却有 90%。',
      howTo: [
        'Feet shoulder width on the platform, slightly higher than center.',
        'Lower until knees ~90°. Don\'t round lower back into the pad.',
        'Drive through MID-FOOT, not toes. 3-sec eccentric.',
      ],
      howToZh: [
        '脚踏板上与肩同宽，位置稍高于中心。',
        '下放到膝盖 约 90°。下背不要弓进胸垫。',
        '用 脚掌中部 蹬，不是脚尖。3 秒离心。',
      ],
      tips: [
        'Feet higher on platform = more glute / hamstring.',
        'Feet lower = more quad.',
      ],
      tipsZh: [
        '脚位置越高 = 臀部 / 腿后越多。',
        '脚位置越低 = 股四头越多。',
      ],
      commonMistakes: [
        'Locking knees at the top — kills tension.',
        'Lifting hips off the pad at the bottom = lower back load.',
      ],
      commonMistakesZh: [
        '顶端锁死膝盖 — 张力丢掉。',
        '底端臀部离开靠垫 = 下背承担负荷。',
      ],
      coachNote: 'Knee-friendly compound. Pick the foot position based on what you want emphasized.',
      coachNoteZh: '护膝盖的复合动作。脚的位置决定重点：高 = 臀 + 腿后；低 = 股四头。',
      kneeFriendly: true,
      lowerBackFriendly: true,
    },
    {
      id: 's-leg-3',
      name: 'Romanian Deadlift (Dumbbell or Smith)',
      nameZh: '罗马尼亚硬拉（哑铃或史密斯）',
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
      whyItMattersZh:
        '腿后链最好的拉伸 + 臀部训练。腿后肌发达让腿看上去精瘦、有分离线。',
      howTo: [
        'Stand with weights at thighs. Soft knee bend (10–15°).',
        'Hip HINGE — push hips back, chest stays proud.',
        'Lower until you feel deep hamstring stretch (typically mid-shin).',
        'Drive hips forward to stand back up.',
      ],
      howToZh: [
        '站直，重量放在大腿前。膝盖微弯（10–15°）。',
        '髋部 折叠 — 把髋部往后推，胸保持挺起。',
        '下放到腿后有明显拉伸感（通常到小腿中段）。',
        '把髋部往前送回到站立位。',
      ],
      tips: [
        'BAR/WEIGHTS stay close to the body the entire time.',
        'Stop wherever your hamstrings cap your stretch — DON\'T round the back.',
      ],
      tipsZh: [
        '杆 / 重量 始终贴近身体。',
        '腿后能拉到哪儿就停在哪儿 — 千万 别 弓背。',
      ],
      commonMistakes: [
        '⚠️ Rounding the lower back — back-friendly cue, you said!',
        'Squatting instead of hinging — bend hips, not knees.',
      ],
      commonMistakesZh: [
        '⚠️ 弓下背 — 你说要护下背的！',
        '做成深蹲不是髋折叠 — 弯髋，不是弯膝盖。',
      ],
      coachNote: 'Lower back friendly version: lighter weights + Smith machine for guide.',
      coachNoteZh: '护下背版本：轻一点 + 用史密斯机引导轨迹。',
      kneeFriendly: true,
      lowerBackFriendly: true,
    },
    {
      id: 's-leg-4',
      name: 'Bulgarian Split Squat',
      nameZh: '保加利亚分腿蹲',
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
      whyItMattersZh:
        '单腿动作 — 修正左右不平衡，从侧面雕刻臀型。',
      howTo: [
        'Back foot on a bench behind you. Front foot far enough that knee tracks over ankle.',
        'Lean torso SLIGHTLY forward = more glute. Upright = more quad.',
        'Lower until back knee almost touches ground. Push through front HEEL.',
      ],
      howToZh: [
        '后脚搭在身后的凳子上。前脚距离够远，膝盖刚好在脚踝上方。',
        '上身 微微 前倾 = 臀部更多。完全直立 = 股四头更多。',
        '下放到后膝快碰地。用前脚的 脚跟 蹬起。',
      ],
      tips: [
        'Keep front knee tracking over second toe — no caving in.',
        'Both arms in goblet position holds counterbalances well.',
      ],
      tipsZh: [
        '前膝跟随第二脚趾方向 — 不要内扣。',
        '哑铃高脚杯姿势抱在胸前可以平衡。',
      ],
      commonMistakes: [
        'Too short stance — front knee overshoots ankle.',
        'Bouncing at the bottom.',
      ],
      commonMistakesZh: [
        '步距太短 — 前膝超过脚踝。',
        '底端反弹借力。',
      ],
      coachNote: 'Knee-friendly only with proper stance. If knee complains, switch to step-ups.',
      coachNoteZh: '只有姿势正确才护膝。膝盖一不舒服，立刻换成台阶上踏。',
      kneeFriendly: true,
      lowerBackFriendly: true,
    },
    {
      id: 's-leg-5',
      name: 'Cable Lateral Raise (3rd shoulder dose)',
      nameZh: '绳索侧平举（本周第 3 剂）',
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
      whyItMattersZh:
        '本周中束的第 3 次。频率决定肩膀帽的圆度 — 在恢复范围内训练越频繁，长得越快。',
      howTo: [
        'Same as Push day. Single arm cable, control the eccentric.',
        'After lower-body work, this hits fresh — make it count.',
      ],
      howToZh: [
        '动作和推日一样：单手绳索，控制离心。',
        '做完腿之后，肩膀还是新的 — 别敷衍。',
      ],
      tips: ['Set this up AFTER your lower body so you don\'t skip it tired.'],
      tipsZh: ['先做下肢再做这个，免得累了就直接跳过。'],
      commonMistakes: ['Skipping it because legs are toasted.'],
      commonMistakesZh: ['因为腿做完累了就跳过。'],
      coachNote: 'Side-delt frequency dose #3 of the week.',
      coachNoteZh: '本周中束训练的第 3 次 — 频率才是圆肩膀的关键。',
      kneeFriendly: true,
      lowerBackFriendly: true,
    },
    {
      id: 's-leg-6',
      name: 'Standing Calf Raise (machine)',
      nameZh: '站姿提踵（机器）',
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
      whyItMattersZh: '可选。小腿主要看天赋，但花 5 分钟能修一下腿后线条还是值得。',
      howTo: [
        'Balls of feet on platform, heels hanging.',
        'Push to max ankle extension at the top. 2-sec squeeze.',
        '3-sec stretch at the bottom — eccentric is the calf money.',
      ],
      howToZh: [
        '前脚掌踩平台，脚跟悬空。',
        '顶端踝关节完全伸展。夹紧 2 秒。',
        '底端拉伸 3 秒 — 离心是小腿的关键。',
      ],
      tips: ['Slow > heavy here. Calves respond to time-under-tension.'],
      tipsZh: ['慢 > 重。小腿对持续张力时间最敏感。'],
      commonMistakes: ['Bouncing reps.', 'Half range.'],
      commonMistakesZh: ['弹起来借力。', '只做半截行程。'],
      coachNote: 'Skip if short on time.',
      coachNoteZh: '时间紧可以跳过。',
      kneeFriendly: true,
      lowerBackFriendly: true,
    },
    {
      id: 's-leg-7',
      name: 'Dead Bug',
      nameZh: '死虫式',
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
      whyItMattersZh:
        '抗伸展核心。锻炼撑住脊柱的深层核心 + 让腹部看上去更紧实（即使体脂稍高也有效）。',
      howTo: [
        'On back. Arms straight up, knees over hips (90° each joint).',
        'Lower opposite arm + leg toward floor — DON\'T let lower back arch.',
        'Slow return. Switch sides.',
      ],
      howToZh: [
        '仰卧。双臂垂直伸向天花板，膝盖在髋部正上方（每个关节都是 90°）。',
        '对侧的手臂 + 腿同时往地板放 — 下背 不能 离开地面。',
        '慢慢回去，换边。',
      ],
      tips: [
        'Press lower back INTO the floor the whole time.',
        'Slow > many reps. 8 perfect > 20 messy.',
      ],
      tipsZh: [
        '下背始终 压 在地板上。',
        '慢 > 多。8 下标准 > 20 下乱做。',
      ],
      commonMistakes: [
        'Lower back coming off the floor = brace fail.',
        'Going too fast — defeats the point.',
      ],
      commonMistakesZh: [
        '下背离开地面 = 核心没撑住。',
        '动作太快 — 失去意义。',
      ],
      coachNote: 'Best lower-back friendly core move. Do this even on rest days if you want.',
      coachNoteZh: '最护下背的核心动作。休息日想做也行。',
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
