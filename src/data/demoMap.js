// Maps exercise IDs to free-exercise-db slugs (public domain — Unlicense).
// Each slug has /0.jpg (start position) and /1.jpg (end position).
// Source: https://github.com/yuhonas/free-exercise-db
//
// Variant shape:
//   {
//     key: 'machine' | 'dumbbell' | 'bestpick' | ...,
//     label?: 'Machine Chest Press',   // overrides t(`variant.${key}`)
//     labelZh?: '坐姿胸推机',
//     isBestPick?: true,               // renders the tab in priority-veryhigh
//     slug: 'Machine_Chest_Press',     // free-exercise-db slug (fallback poster)
//     youtubeId?: 'Qu7-ceCvq7w',       // per-variant tutorial; falls back to base meta
//     tempo?: '2-1-3',                 // per-variant tempo override
//     tempoCues?: { lift, hold, lower },
//     suggestedWeight?: 'Chest Press 30 lb',
//     // Variant-specific content shown in the modal in place of the base
//     // exercise's content when this variant is selected. Either language
//     // is optional; missing fields fall back to the base exercise.
//     content?: {
//       en: { name?, primaryMuscles?, secondaryMuscles?, whyItMatters?, howTo?, tips?, commonMistakes? },
//       zh: { ... same shape ... },
//     },
//   }

export const DEMO_BASE =
  'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises';

// Each entry is an ordered list of variants. Index 0 = default.
// `key` resolves to a translation string under `variant.<key>` in strings.js.
export const DEMO_VARIANTS = {
  // ── PUSH ──
  'push-1': [
    {
      key: 'dumbbell',
      slug: 'Dumbbell_Shoulder_Press',
      // base meta now points at the DB version (see exerciseMeta.js push-1)
    },
    {
      key: 'machine',
      label: 'Machine Shoulder Press',
      labelZh: '推肩机',
      slug: 'Leverage_Shoulder_Press',
      youtubeId: '6v4nrRVySj0', // The PERFECT Machine Shoulder Press
      content: {
        en: {
          name: 'Machine Shoulder Press',
          whyItMatters:
            'Fixed path lets you press to failure safely and lifts a stabilizer tax off your delts — the heads of the shoulder do the work without your core fighting balance. Best when you are learning the press or pushing for rep PRs.',
          howTo: [
            'Set the seat so the handles sit at shoulder level — never above.',
            'Plant feet, brace upper back hard into the pad.',
            'Press straight up; stop a hair shy of locking out.',
            '3-second eccentric back to a stretched shoulder position.',
          ],
          tips: [
            'Drive elbows up and slightly in front of the body — that is the front-delt line.',
            'Lighter weight + longer ROM beats heavier weight + half reps.',
          ],
          commonMistakes: [
            'Seat too high — the press becomes an upper-trap shrug.',
            'Locking elbows hard at the top — kills tension, pounds the joint.',
            'Bouncing off the bottom stop instead of controlling the stretch.',
          ],
        },
        zh: {
          name: '坐姿推肩机',
          whyItMatters:
            '固定轨迹让你可以安全推到力竭，把稳定器肌群的"借力税"卸掉 — 三角肌头本身专心做功，核心不用打架。学习推举或者冲组数 PR 的时候最好用。',
          howTo: [
            '调座椅高度让握把刚好在肩部 — 不能更高。',
            '脚踩稳，上背紧靠椅背。',
            '垂直向上推，差一点就锁死即可（不要完全锁定）。',
            '3 秒离心回到肩部充分拉伸位。',
          ],
          tips: [
            '肘部向上 + 略向身体前方推 — 这是前束的发力线。',
            '轻一点 + 完整行程 > 重一点 + 半程。',
          ],
          commonMistakes: [
            '座椅太高 — 推举变成耸肩。',
            '顶部肘部锁死 — 失去张力，关节磨损。',
            '底部弹起 — 跳过了拉伸位。',
          ],
        },
      },
    },
    { key: 'barbell', slug: 'Standing_Military_Press' },
    {
      key: 'bestpick',
      label: 'Best for Front Delts',
      labelZh: '前束最佳',
      isBestPick: true,
      slug: 'Cable_Front_Raise',
      youtubeId: 'oq0GIcQj9Ew', // DeltaBolic — Shoulder Exercise Variations (Cables Only!)
      tempo: '2-1-3',
      tempoCues: {
        lift: '2 sec raise straight in front',
        hold: '1 sec pause just above shoulder',
        lower: '3 sec lower under control',
      },
      content: {
        en: {
          name: 'Cable Front Raise',
          primaryMuscles: ['Front Delts'],
          secondaryMuscles: ['Upper Chest'],
          whyItMatters:
            'Constant tension through the entire range — exactly where dumbbells go light at the top. Isolates the front delt without letting the triceps drive the lift.',
          howTo: [
            'Cable at the lowest setting, stand a step in front of the stack.',
            'Single hand, neutral or pronated grip behind the body.',
            'Raise straight in front to just above shoulder height.',
            'Pause 1 sec, slow 3-sec eccentric.',
          ],
          tips: [
            'Step forward to set a slight pre-stretch — the bottom of the lift is where cables outperform dumbbells.',
            'Pinkies up at the top for the strongest contraction.',
          ],
          commonMistakes: [
            'Swinging the torso to lift — kills the isolation.',
            'Going above face height — the cable pulls toward your shoulder instead of away.',
            'Wrist-curl grip — biceps start sneaking into the lift.',
          ],
        },
        zh: {
          name: '绳索前平举',
          primaryMuscles: ['前束'],
          secondaryMuscles: ['上胸'],
          whyItMatters:
            '全程恒定张力 — 哑铃在顶部失去张力的位置，绳索还在拉。把前束孤立出来，不让三头借力。',
          howTo: [
            '绳索调到最低，站在配重片前一步。',
            '单手，中立握或反握，手在身后。',
            '向身体正前方抬起，停在肩部稍高的位置。',
            '顶部停 1 秒，3 秒离心控制下放。',
          ],
          tips: [
            '上前一步给底部一个预拉伸 — 这是绳索优于哑铃的地方。',
            '顶部小指向上，挤压最强。',
          ],
          commonMistakes: [
            '躯干借力前后摆 — 失去孤立。',
            '抬高过脸 — 绳索方向变成往肩部拉，张力丢失。',
            '手腕翻起 — 二头肌偷力。',
          ],
        },
      },
    },
  ],

  'push-2': [
    { key: 'dumbbell', slug: 'Side_Lateral_Raise' },
    {
      key: 'machine',
      label: 'Cable / Machine',
      labelZh: '绳索 / 器械',
      slug: 'Side_Lateral_Raise',
      youtubeId: 'JlT2xB92lY8', // DeltaBolic — Cable Lateral Raise Complete Guide
      content: {
        en: {
          name: 'Cable Lateral Raise',
          whyItMatters:
            'Cables fix dumbbells\' fatal flaw: zero tension at the bottom. With the cable behind you, the side delt is loaded from the very first inch of the lift — exactly where growth happens.',
          howTo: [
            'Cable on the lowest setting, opposite side of the working arm.',
            'Stand so the cable crosses behind your back.',
            'Raise to shoulder height — no higher.',
            '3-sec eccentric, do not let the cable yank the arm down.',
          ],
          tips: [
            'Step away from the stack to dial in the resistance angle.',
            'Keep shoulders pressed down throughout — no shrug.',
          ],
          commonMistakes: [
            'Shrugging at the top — traps take over.',
            'Standing too close to the stack — kills the bottom tension.',
            'Going above shoulder — same trap takeover.',
          ],
        },
        zh: {
          name: '绳索侧平举',
          whyItMatters:
            '绳索补上了哑铃最大的短板：底部零张力。绳索绕到身后之后，中束从第一寸就开始受力 — 增肌就在这里发生。',
          howTo: [
            '绳索调到最低，挂在工作臂相反侧。',
            '站姿让绳索绕过身后。',
            '抬到肩部水平 — 不要更高。',
            '3 秒离心，不要让绳索把胳膊扯下来。',
          ],
          tips: [
            '调整跟配重片的距离来微调阻力角度。',
            '全程压肩 — 不要耸肩。',
          ],
          commonMistakes: [
            '顶部耸肩 — 斜方肌接管。',
            '离配重片太近 — 底部张力没了。',
            '抬过肩 — 又变成耸肩。',
          ],
        },
      },
    },
    {
      key: 'bestpick',
      label: 'Best for Side Delts',
      labelZh: '中束最佳',
      isBestPick: true,
      slug: 'Side_Lateral_Raise',
      youtubeId: 'Kl3LEzQ5Zqs', // DeltaBolic — The Perfect Lateral Raise (lean-forward)
      tempo: '2-1-3',
      tempoCues: {
        lift: '2 sec raise out to the side',
        hold: '1 sec hold at shoulder height',
        lower: '3 sec eccentric — fight the descent',
      },
      content: {
        en: {
          name: 'Lean-Forward Lateral Raise',
          primaryMuscles: ['Side Delts'],
          secondaryMuscles: ['Rear Delts'],
          whyItMatters:
            'Hinging the torso ~15–20° forward shifts the line of resistance behind the shoulder pivot, putting peak tension on the side delt exactly where it grows — the bottom half of the lift, where the standing version goes light.',
          howTo: [
            'Grab a post or wall with the off hand for support.',
            'Hinge ~15–20° forward — chest stays up, hips back.',
            'Soft elbows, lead with the elbow (not the hand).',
            'Raise to shoulder height. 3-sec eccentric.',
          ],
          tips: [
            'Thumbless grip — kills forearm tension so you feel the delt.',
            'Pinkies slightly higher than thumbs (pour-the-water cue).',
          ],
          commonMistakes: [
            'Standing up out of the hinge to swing the weight — the whole point is the hinge.',
            'Shrugging traps to finish the lift.',
            'Going above shoulder — trap takeover.',
          ],
        },
        zh: {
          name: '前倾侧平举',
          primaryMuscles: ['中束'],
          secondaryMuscles: ['后束'],
          whyItMatters:
            '上身前倾约 15–20°，阻力方向就从肩关节支点后方拉过来，张力峰值刚好落在中束最关键的位置 — 动作下半程，也就是普通站姿侧平举失去张力的地方。',
          howTo: [
            '空手扶墙或柱子稳定身体。',
            '上身前倾 15–20° — 挺胸，髋后推。',
            '肘部微屈，用肘部带动（不是手）。',
            '抬到肩高。3 秒离心。',
          ],
          tips: [
            '不要握紧大拇指 — 前臂不发力，三角肌感受更强。',
            '小指略高于拇指（倒水的姿势）。',
          ],
          commonMistakes: [
            '抬重量时身体回直 — 前倾才是动作的本质。',
            '顶部耸肩借力。',
            '抬过肩高 — 斜方肌接管。',
          ],
        },
      },
    },
  ],

  'push-3': [
    { key: 'dumbbell', slug: 'Incline_Dumbbell_Press' },
    {
      key: 'machine',
      label: 'Machine Chest Press',
      labelZh: '坐姿胸推机',
      slug: 'Incline_Dumbbell_Press',
      youtubeId: 'Qu7-ceCvq7w', // DeltaBolic — The PERFECT Machine Chest Press
      tempo: '2-1-3',
      tempoCues: {
        lift: '2 sec press forward — soft squeeze at lockout',
        hold: '1 sec brief hold (no jam)',
        lower: '3 sec lower into deep chest stretch',
      },
      content: {
        en: {
          name: 'Machine Chest Press',
          whyItMatters:
            'Locked press path means you can grind productive reps even when fatigued — no coordination tax, no dumbbell-balance failure. Easier to bias upper chest than dumbbells if you set the seat right.',
          howTo: [
            'Adjust seat so handles sit at mid-chest height (slightly lower for upper-chest bias).',
            'Thumbless ("false") grip — relaxes the forearm so the chest drives the press.',
            'Press out smooth — soft squeeze at lockout (do not jam the handles).',
            '3-sec eccentric back to a deep chest stretch.',
          ],
          tips: [
            'Lean back slightly = more chest. Sit upright = more triceps.',
            'For upper-chest bias, drop the seat one notch so handles start a bit lower than mid-chest.',
          ],
          commonMistakes: [
            'Seat too low — press travels to face height, becomes a shoulder press.',
            'Bouncing off lockout to swing the next rep — kills tension.',
            'Half-rep return (skips the stretch) — the stretch is where the chest grows.',
          ],
        },
        zh: {
          name: '坐姿胸推机',
          whyItMatters:
            '推举轨迹固定，疲劳时也能榨出有效次数 — 不用花精力维持平衡，不会因为协调性提前力竭。座椅调对的话，比哑铃更好上斜偏向上胸。',
          howTo: [
            '调座椅让握把刚好在中胸高度（偏上胸时调低一格）。',
            '不握紧大拇指（假握）— 前臂松开，胸大肌驱动推举。',
            '推到锁定，顶部胸轻挤一下（不要把握把怼死）。',
            '3 秒离心回到胸部充分拉伸。',
          ],
          tips: [
            '略后仰 = 更多胸；端正坐 = 更多三头。',
            '想偏上胸：座椅低一档，让握把起点低于中胸。',
          ],
          commonMistakes: [
            '座椅太低 — 推举路径变到脸前，变成肩推。',
            '锁定时弹起借力 — 张力丢失。',
            '半程回放 — 没拉伸到，胸大肌生长的关键点跳过了。',
          ],
        },
      },
    },
    {
      key: 'bestpick',
      label: 'Best for Upper Chest',
      labelZh: '上胸最佳',
      isBestPick: true,
      slug: 'Cable_Crossover',
      youtubeId: 'ZVwgKeqrYeA', // DeltaBolic — Cable Chest Fly Angles
      tempo: '2-1-3',
      tempoCues: {
        lift: '2 sec arc up + across toward forehead',
        hold: '1 sec squeeze inner upper chest',
        lower: '3 sec eccentric — open wide for a stretch',
      },
      content: {
        en: {
          name: 'Low-to-High Cable Fly',
          primaryMuscles: ['Upper Chest'],
          secondaryMuscles: ['Front Delts'],
          whyItMatters:
            'Pure upper-pec angle without the front-delt overlap that incline pressing always has. Constant tension across the entire arc — the line of resistance matches the upper pec fiber direction exactly.',
          howTo: [
            'Both cables at lowest setting. Staggered stance for balance.',
            'Soft elbow bend (~15°) — lock the angle, this is a fly, not a press.',
            'Arc the handles up and across toward forehead height.',
            'Squeeze for 1 sec, slow open back into a stretch.',
          ],
          tips: [
            'Lead with the elbows, finish with the hands — that is the fly mechanic.',
            'Hands meet around forehead/face height — that is where upper-pec contraction peaks.',
          ],
          commonMistakes: [
            'Straight arms — pulls all the load onto the front delt and shoulder joint.',
            'Crossing the hands too far — no extra contraction, just shoulder strain.',
            'Letting hands drift down to chest height — kills the upper-pec bias entirely.',
          ],
        },
        zh: {
          name: '低位上斜绳索飞鸟',
          primaryMuscles: ['上胸'],
          secondaryMuscles: ['前束'],
          whyItMatters:
            '纯粹的上胸发力角度，没有上斜卧推一定会带的前束借力。整个运动轨迹张力恒定 — 阻力方向跟上胸纤维走向完美匹配。',
          howTo: [
            '两边绳索都调到最低。错步站稳。',
            '肘部微屈（约 15°）— 锁死这个角度，这是飞鸟不是推举。',
            '双手沿弧线向上 + 向额头方向收拢。',
            '顶部挤压 1 秒，慢慢张开到充分拉伸。',
          ],
          tips: [
            '肘部带动，手在最后收拢 — 这是飞鸟的发力机制。',
            '双手汇合在额头 / 脸的高度 — 这是上胸收缩峰值。',
          ],
          commonMistakes: [
            '手臂伸直 — 负荷全压到前束和肩关节。',
            '双手交叉过深 — 没有更多收缩，只有肩部受伤风险。',
            '双手落到胸部高度 — 上胸偏向直接没了。',
          ],
        },
      },
    },
  ],

  'push-4': [
    { key: 'cable', slug: 'Face_Pull' },
    {
      key: 'bestpick',
      label: 'Best for Rear Delts',
      labelZh: '后束最佳',
      isBestPick: true,
      slug: 'Reverse_Grip_Bent-Over_Rows',
      youtubeId: 'FeERX9UwspY', // DeltaBolic — The PERFECT Rear Delt Cable Fly
      tempo: '2-1-3',
      tempoCues: {
        lift: '2 sec pull arm wide + out',
        hold: '1 sec pause in external rotation',
        lower: '3 sec eccentric — control the return',
      },
      content: {
        en: {
          name: 'Single-Arm Cable Reverse Fly',
          primaryMuscles: ['Rear Delts'],
          secondaryMuscles: ['Upper Back', 'Rotator Cuff'],
          whyItMatters:
            'Cables let you put the line of pull behind the shoulder pivot — the exact angle where rear delts get torque. Single-arm means full ROM with no compensation from the other side, and you can train rear delts unilaterally to even out side-to-side weakness.',
          howTo: [
            'Two cables at upper-chest height, crossed. Grab the opposite handle.',
            'Step back to put tension on the cable from the start.',
            'Pull arm outward in a wide arc — like a scarecrow swing.',
            'Pause at full external rotation. 3-sec eccentric return.',
          ],
          tips: [
            'Soft elbow, lock the angle the whole rep.',
            'Lead with the elbow, not the hand — that is rear delt.',
            'Stop when the forearm is parallel to the floor — past that is trap territory.',
          ],
          commonMistakes: [
            'Rotating the torso to swing the arm wider — feels strong, no rear delt.',
            'Going too heavy — traps and rhomboids take over.',
            'Stopping before external rotation kicks in — that is where the rear delt peaks.',
          ],
        },
        zh: {
          name: '单臂绳索反向飞鸟',
          primaryMuscles: ['后束'],
          secondaryMuscles: ['上背', '肩袖'],
          whyItMatters:
            '绳索可以把发力线放到肩关节支点的后方 — 正是后束发力的角度。单臂版本能拿到完整行程，另一侧不能借力，还能单边训练补强弱侧。',
          howTo: [
            '两边绳索都调到上胸高度，交叉。抓对侧的把手。',
            '后退一步给绳索预张力。',
            '手臂向外画一个大弧 — 像稻草人甩臂。',
            '在最大外旋位停顿。3 秒离心控制回放。',
          ],
          tips: [
            '肘部微屈，全程锁死角度。',
            '肘部带动，不是手 — 这才是后束发力。',
            '前臂跟地面平行时停 — 再往后就是斜方肌接管了。',
          ],
          commonMistakes: [
            '躯干旋转借力 — 感觉很重，但后束没怎么动。',
            '重量太大 — 斜方肌和菱形肌接管。',
            '没到外旋就停 — 那才是后束顶峰。',
          ],
        },
      },
    },
  ],

  'push-5': [
    { key: 'cable', slug: 'Triceps_Pushdown' },
    { key: 'rope', slug: 'Triceps_Pushdown_-_Rope_Attachment' },
    { key: 'kickback', slug: 'Tricep_Dumbbell_Kickback' },
    {
      key: 'bestpick',
      label: 'Best for Triceps',
      labelZh: '三头最佳',
      isBestPick: true,
      slug: 'Triceps_Pushdown_-_Rope_Attachment',
      youtubeId: 'NTk0Igxqcsk', // DeltaBolic — The PERFECT High Cable Overhead Triceps Extension
      tempo: '2-1-3',
      tempoCues: {
        lift: '2 sec extend elbows straight overhead',
        hold: '1 sec squeeze + flare hands',
        lower: '3 sec stretch into deep overhead position',
      },
      content: {
        en: {
          name: 'Overhead Cable Tricep Extension',
          primaryMuscles: ['Triceps (Long Head)'],
          secondaryMuscles: ['Triceps (Medial / Lateral)'],
          whyItMatters:
            'Long-head bias. Pushdowns mostly hit medial + lateral heads; the long head only grows when stretched against load, and that requires the arm overhead. This is the single most underused tricep movement.',
          howTo: [
            'Cable high, rope attachment.',
            'Step out and lean ~30° forward — upper arms locked at ears.',
            'Extend from the elbows only — upper arms do not move.',
            'Stretch into a deep overhead position. Flare hands apart at the bottom for the tricep peak.',
          ],
          tips: [
            'Grip the very ends of the rope so you can flare without losing tension.',
            'Elbows pointing at the ceiling the whole rep — if they drop forward, shoulders steal the work.',
          ],
          commonMistakes: [
            'Elbows flaring wide — drops tension off the long head.',
            'Elbows traveling forward (toward face) — turns it into a shoulder press.',
            'Half ROM at the top — skipping the stretch defeats the whole purpose.',
          ],
        },
        zh: {
          name: '头后绳索三头屈伸',
          primaryMuscles: ['三头肌（长头）'],
          secondaryMuscles: ['三头肌（中 / 外侧头）'],
          whyItMatters:
            '长头偏向。下压主要打中头和外侧头；长头只有在负重拉伸下才生长，而那必须把手举过头。这是被严重低估的三头动作。',
          howTo: [
            '绳索调到最高，挂绳索把手。',
            '上前一步前倾约 30° — 上臂锁在耳朵两侧。',
            '只从肘部伸展 — 上臂不动。',
            '拉伸到头部正上方完整位置。底部双手向外撕开做长头顶峰收缩。',
          ],
          tips: [
            '抓绳索的最末端，这样底部可以撕开但不丢张力。',
            '肘部全程对着天花板 — 一旦往前掉，肩膀就偷力了。',
          ],
          commonMistakes: [
            '肘部外展 — 长头张力丢失。',
            '肘部往前移（接近脸）— 变成肩部推举。',
            '顶部半程 — 跳过拉伸位完全背离动作目的。',
          ],
        },
      },
    },
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
      youtubeId: 'gni543DXmvI', // ArielYu_Fit — how to perfect plank
    },
    {
      key: 'bestpick',
      label: 'Best for Abs',
      labelZh: '腹肌最佳',
      isBestPick: true,
      slug: 'Cable_Crunch',
      youtubeId: 'K2m0jj6RfYg', // STOP Making This Cable Crunch MISTAKE
      tempo: '2-1-3',
      tempoCues: {
        lift: '2 sec crunch downward — round the spine',
        hold: '1 sec hard ab squeeze',
        lower: '3 sec return upward with control',
      },
      content: {
        en: {
          name: 'Cable Crunch',
          primaryMuscles: ['Abs (Rectus Abdominis)'],
          secondaryMuscles: ['Obliques'],
          whyItMatters:
            'The only ab movement you can progressively overload like a real muscle. Hanging leg raises and planks tap out at bodyweight after a few sessions; the cable crunch lets you add weight every week until your abs are as developed as any other body part.',
          howTo: [
            'Cable high with the rope attachment.',
            'Kneel a step in front of the stack. Rope sits at the temples — not behind the head.',
            'Crunch DOWN by rounding the spine — chin to belly button.',
            'Hips stay completely still. Pause 1 sec. 3-sec eccentric back up.',
          ],
          tips: [
            'Pull elbows toward thighs as you crunch — that visual cue forces the spinal flexion.',
            'Imagine the rope is glued to your forehead — moving it apart from your head means abs are not driving the rep.',
          ],
          commonMistakes: [
            'Hinging at the hips — lats + glutes do all the work, abs barely move.',
            'Pulling the rope down to the face — turns it into a lat pulldown.',
            'Tossing the weight at the top of the return — kills the eccentric, which is the growth phase.',
          ],
        },
        zh: {
          name: '绳索卷腹',
          primaryMuscles: ['腹肌（腹直肌）'],
          secondaryMuscles: ['腹斜肌'],
          whyItMatters:
            '唯一能像其他肌肉一样渐进超负荷的腹肌动作。悬垂举腿和平板支撑几周后就到顶（体重不变），绳索卷腹能每周加重量，直到腹肌发达程度跟其他肌群一样。',
          howTo: [
            '绳索调到最高，挂绳索把手。',
            '在配重片前一步跪下。绳索放在太阳穴两侧 — 不是脑后。',
            '通过卷起脊柱往下卷 — 下巴往肚脐方向。',
            '髋部完全不动。停 1 秒。3 秒离心回起。',
          ],
          tips: [
            '卷腹时想象肘部往大腿压 — 这个视觉提示强制脊柱屈曲。',
            '想象绳索粘在额头上 — 一旦绳索离开头，说明不是腹肌发力。',
          ],
          commonMistakes: [
            '从髋部弯下 — 背阔和臀肌全包了，腹肌几乎没动。',
            '把绳索拉到脸前 — 变成了背阔下拉。',
            '回到顶部时放下重量太快 — 跳过离心，而那才是增肌阶段。',
          ],
        },
      },
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
    {
      key: 'machine',
      label: 'Curl Machine',
      labelZh: '弯举机',
      slug: 'Machine_Bicep_Curl',
    },
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
  'leg-1': [
    { key: 'dumbbell', slug: 'Goblet_Squat' },
    {
      key: 'machine',
      label: 'Leg Press',
      labelZh: '腿举机',
      slug: 'Goblet_Squat',
      youtubeId: 'ahaJTts1f3s', // Gerardi Performance — Leg Press Machine
      tempo: '3-1-2-1', // lower-bottomPause-lift-topHold (eccentric-first)
      tempoCues: {
        lower: '3 sec lower platform back — knees track over toes',
        bottomPause: '1 sec stretched pause at the bottom',
        lift: '2 sec drive platform away — heels through',
        hold: '1 sec brief hold at top, knees soft (not locked)',
      },
      suggestedWeight: 'Leg Press 55 lb · 3 × 12',
    },
  ],
  'leg-2': [
    { key: 'dumbbell', slug: 'Romanian_Deadlift' },
    {
      key: 'machine',
      label: 'Seated Leg Curl',
      labelZh: '坐姿腿弯举',
      slug: 'Romanian_Deadlift',
      youtubeId: 'xdbEG3xGLI8', // DeltaBolic — PERFECT Seated Leg Curl Tips
      tempoCues: {
        lift: '2 sec curl heels toward glutes',
        hold: '1 sec squeeze hamstrings at bottom',
        lower: '3 sec extend legs back out',
      },
      suggestedWeight: 'Seated Leg Curl 25 lb',
    },
  ],
  'leg-3': [
    { key: 'dumbbell', slug: 'Dumbbell_Lunges' },
    {
      key: 'machine',
      label: 'Glute Kickback',
      labelZh: '臀部后踢机',
      slug: 'Dumbbell_Lunges',
      youtubeId: 'UbOcViik3hk', // DeltaBolic — Glute Kickback Variations
      tempoCues: {
        lift: '2 sec drive leg back + up',
        hold: '1 sec squeeze glute at top',
        lower: '3 sec return with control',
      },
      suggestedWeight: 'Glute Kickback 15 lb each side',
    },
  ],
  'leg-4': [
    { key: 'dumbbell', slug: 'Barbell_Hip_Thrust' },
    {
      key: 'machine',
      label: 'Hip Thrust Machine',
      labelZh: '臀推机',
      slug: 'Barbell_Hip_Thrust',
      youtubeId: '0xfdeCBwoYw', // Booty Builder — Hip Thrust Machine Correct vs Incorrect
    },
    { key: 'barbell', slug: 'Barbell_Hip_Thrust' },
    { key: 'smith', slug: 'Smith_Machine_Hip_Raise' },
  ],
  'leg-5': [
    { key: 'dumbbell', slug: 'Side_Lateral_Raise' },
    {
      key: 'machine',
      label: 'Cable / Machine',
      labelZh: '绳索 / 器械',
      slug: 'Side_Lateral_Raise',
      youtubeId: 'JlT2xB92lY8', // DeltaBolic — Cable Lateral Raise Complete Guide
    },
    { key: 'band', slug: 'Lateral_Raise_-_With_Bands' },
  ],
  'leg-6': [
    { key: 'bodyweight', slug: 'Standing_Calf_Raises' },
    {
      key: 'machine',
      label: 'Calf Machine',
      labelZh: '提踵机',
      slug: 'Standing_Calf_Raises',
      youtubeId: 'GnrwIpDtuto', // DeltaBolic — Struggling to Grow Your Calves
      tempoCues: {
        lift: '2 sec press up onto the big toe',
        hold: '1 sec squeeze calves hard at top',
        lower: '3 sec lower below platform — full stretch',
      },
      suggestedWeight: 'Calf Machine — moderate, full ROM',
    },
  ],
  'leg-7': [
    { key: 'bodyweight', slug: 'Dead_Bug' },
    {
      key: 'machine',
      label: 'Ab Crunch Machine',
      labelZh: '卷腹机',
      slug: 'Dead_Bug',
      youtubeId: 'fl9FSpCpvq0', // Colossus Fitness — Ab Crunch Machine
      tempoCues: {
        lift: '2 sec crunch down — round the spine',
        hold: '1 sec squeeze abs hard',
        lower: '3 sec return upward with control',
      },
      suggestedWeight: 'Ab Crunch Machine — moderate',
    },
  ],
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

// Resolves the content that should be shown in the modal for a given
// (exercise, variant, lang) tuple. If the variant has its own `content`
// block, those fields win — anything missing falls back to the base
// exercise. Returns plain values (strings / arrays), already localized.
export function resolveVariantContent(exercise, variant, lang, locEx) {
  const baseTr = (field) => locEx(exercise, field, lang);
  const v = variant?.content?.[lang] ?? variant?.content?.en;
  if (!v) {
    return {
      name: baseTr('name'),
      primaryMuscles: baseTr('primaryMuscles'),
      secondaryMuscles: baseTr('secondaryMuscles'),
      whyItMatters: baseTr('whyItMatters'),
      howTo: baseTr('howTo'),
      tips: baseTr('tips'),
      commonMistakes: baseTr('commonMistakes'),
      isVariantContent: false,
    };
  }
  return {
    name: v.name ?? baseTr('name'),
    primaryMuscles: v.primaryMuscles ?? baseTr('primaryMuscles'),
    secondaryMuscles: v.secondaryMuscles ?? baseTr('secondaryMuscles'),
    whyItMatters: v.whyItMatters ?? baseTr('whyItMatters'),
    howTo: v.howTo ?? baseTr('howTo'),
    tips: v.tips ?? baseTr('tips'),
    commonMistakes: v.commonMistakes ?? baseTr('commonMistakes'),
    isVariantContent: true,
  };
}
