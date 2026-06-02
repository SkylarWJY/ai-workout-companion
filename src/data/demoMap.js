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
    {
      key: 'barbell',
      slug: 'Standing_Military_Press',
      youtubeId: '4LBVP2Oe7fg', // DeltaBolic — The PERFECT Barbell Overhead Press
      tempo: '2-1-3',
      tempoCues: {
        lift: '2 sec press the bar overhead',
        hold: '1 sec hold at lockout — head through the window',
        lower: '3 sec lower to clavicle',
      },
      content: {
        en: {
          name: 'Barbell Overhead Press',
          whyItMatters:
            'Highest absolute loading potential of any shoulder movement. The bar locks your hands in one plane so you can press genuinely heavy without coordination tax — strength built here carries over to every other press in your program.',
          howTo: [
            'Set the J-hooks around upper-chest height. Bar in front rack, elbows pointed mostly down, hands just outside shoulder width.',
            'Brace the core hard, glutes tight. Pull head back as the bar leaves the rack.',
            'Press straight up; once the bar clears the forehead, push your head through so the bar finishes over the mid-foot.',
            'Lower with control to the clavicle — touch lightly, do not bounce.',
          ],
          tips: [
            'False (thumbless) grip lets the bar sit on the heel of the palm — less wrist strain on heavy sets.',
            'Squeeze the bar hard — it tightens up the whole upper body and saves the shoulder joint.',
          ],
          commonMistakes: [
            'Hyper-extending the lower back to "press" — that\'s a hip drive, not a shoulder press. Brace abs hard, glutes tight.',
            'Pressing the bar straight up without re-stacking the head — the bar drifts forward and the shoulder takes all the load.',
            'Catching the bar on the descent instead of guiding it — wrist + clavicle slam.',
          ],
        },
        zh: {
          name: '杠铃过头推举',
          whyItMatters:
            '所有肩部动作里绝对负荷最高的。杠铃把双手锁在同一平面上，你不用维持哑铃平衡，能真的推大重量 — 这里练出的力量会带动你训练里所有其他推举进步。',
          howTo: [
            'J 钩调到上胸高度。杠铃落在前架位，肘部基本朝下，手在肩宽外一点。',
            '核心狠收紧，臀夹紧。杠铃离架时头先往后躲让位。',
            '直线向上推；杠铃过额头后，头部前送让杠铃停在脚弓正上方。',
            '控制下放到锁骨 — 轻碰即可，不要弹起。',
          ],
          tips: [
            '不握紧大拇指（假握）让杠铃压在掌根 — 大重量时手腕压力小。',
            '握杠握紧 — 整个上半身收紧，肩关节受力会减少。',
          ],
          commonMistakes: [
            '腰椎反弓"推"起 — 那是髋部发力，不是肩推。腹肌狠绷，臀夹紧。',
            '直推不让头过 — 杠铃轨迹前移，肩部承担所有负荷。',
            '下放时去接杠铃而不是控制 — 手腕和锁骨会被砸。',
          ],
        },
      },
    },
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
    {
      key: 'rope',
      slug: 'Triceps_Pushdown_-_Rope_Attachment',
      youtubeId: '-PqzEk57xiw', // DeltaBolic — The PERFECT Triceps Pushdown
      tempo: '2-1-3',
      tempoCues: {
        lift: '2 sec push down + flare rope at the bottom',
        hold: '1 sec squeeze triceps — hands wide apart',
        lower: '3 sec return upward in line with shoulders',
      },
      content: {
        en: {
          name: 'Rope Tricep Pushdown',
          whyItMatters:
            'The rope unlocks a flare at the bottom — pulling the rope ends apart at lockout gets a peak contraction the bar never can. Best for lateral + medial head detail (the horseshoe shape) and the easiest variant on the wrists.',
          howTo: [
            'Rope attachment, cable at the top. Step a half-foot back so the line of resistance falls along your forearm at lockout.',
            'Elbows pinned to ribs, slight forward lean (~15°).',
            'Push down keeping the rope together until just past mid-thigh; then flare the rope ends apart for the last few inches.',
            '3-sec return upward — fight the cable.',
          ],
          tips: [
            'Thumbless grip on the rope ends — less forearm pump, more triceps.',
            'The flare is the whole point — if you finish the rep with the rope still together, you skipped the contraction.',
          ],
          commonMistakes: [
            'Treating it like a straight-bar pushdown (no flare) — you bought the rope for nothing.',
            'Elbows drifting forward — turns it into a half-press, loses tension.',
            'Going too heavy and using bodyweight to push down — that\'s back, not triceps.',
          ],
        },
        zh: {
          name: '绳索三头下压',
          whyItMatters:
            '绳索的关键在底部能"撕开" — 锁定时把绳子两端向外拉开，得到杠铃永远不可能给的顶峰收缩。最适合外侧头 + 中头细节（马蹄形轮廓），手腕负担也最小。',
          howTo: [
            '挂绳索把手，绳索调到最高。后退半步，让锁定时阻力线沿着前臂方向。',
            '肘部紧贴肋骨，身体微微前倾（约 15°）。',
            '下压时保持双手在一起到大腿中段；最后几寸把绳索两端向外撕开。',
            '3 秒控制回放 — 跟绳索"较劲"。',
          ],
          tips: [
            '绳索末端不要握死大拇指 — 前臂不充血，三头感受更强。',
            '撕开就是这个变体的全部意义 — 如果你做完一次绳子还在一起，那等于跳过了收缩位。',
          ],
          commonMistakes: [
            '当成直杆下压（不撕开）— 那买绳索就白费了。',
            '肘部前移 — 变成了半推，张力丢失。',
            '太重，用体重往下压 — 那是背部发力，不是三头。',
          ],
        },
      },
    },
    {
      key: 'kickback',
      slug: 'Tricep_Dumbbell_Kickback',
      youtubeId: 'GZ3NzlJs_yg', // DeltaBolic — STOP THIS Tricep Kickback MISTAKE!
      tempo: '2-1-2',
      tempoCues: {
        lift: '2 sec extend the dumbbell back + slightly up',
        hold: '1 sec hard squeeze — elbow stays locked',
        lower: '2 sec return without dropping the elbow',
      },
      content: {
        en: {
          name: 'Tricep Kickback',
          whyItMatters:
            'Puts the long head of the triceps under tension at full shortening — exactly the position pushdowns CANNOT reach because the elbow needs to be behind the body. Pair it with overhead extensions and you cover the full long-head range.',
          howTo: [
            'Knee + same-side hand on bench. Hinge so the torso is parallel to the floor, flat back.',
            'Lock the upper arm against the ribs — parallel to the floor, elbow bent 90°.',
            'Extend ONLY from the elbow — kick the dumbbell back + slightly up until the arm is fully straight.',
            'Pause 1 sec at full extension. Slow 2-sec return — DO NOT let the upper arm drop.',
          ],
          tips: [
            'Light dumbbell. This is a contraction movement, not a strength one — 5-12 lb is usually plenty.',
            'Rotate the pinky up slightly at the top for an extra squeeze on the lateral head.',
          ],
          commonMistakes: [
            'Upper arm rocking up and down — that\'s the #1 mistake. The whole point is the upper arm STAYS PUT.',
            'Going too heavy — you end up swinging the dumbbell, not contracting the tricep.',
            'Half-rep at the top — the contraction is only real if the elbow fully straightens.',
          ],
        },
        zh: {
          name: '三头后踢',
          whyItMatters:
            '让三头长头在完全缩短位置承受张力 — 这正是下压做不到的位置，因为肘部必须在身体后方。配合头后屈伸一起做，长头的全行程就覆盖了。',
          howTo: [
            '同侧膝盖 + 手撑在凳子上。躯干跟地面平行，背部挺直。',
            '上臂锁在肋骨旁 — 跟地面平行，肘部弯 90°。',
            '只从肘部伸展 — 把哑铃向后 + 略向上踢，直到手臂完全伸直。',
            '完全伸直时停 1 秒。2 秒控制回放 — 上臂绝对不能掉下来。',
          ],
          tips: [
            '哑铃要轻。这是收缩动作不是力量动作 — 通常 5-12 lb 就够。',
            '顶部小指略微向上旋一下，外侧头收缩更强。',
          ],
          commonMistakes: [
            '上臂上下晃 — 头号错误。这个动作的全部意义就是上臂"不动"。',
            '太重 — 最后变成甩哑铃，不是收缩三头。',
            '顶部半程 — 肘部完全伸直才算真的收缩。',
          ],
        },
      },
    },
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
      content: {
        en: {
          name: 'Plank',
          primaryMuscles: ['Deep Core (TVA)', 'Abs'],
          secondaryMuscles: ['Glutes', 'Shoulders', 'Lower-Back Stabilizers'],
          whyItMatters:
            'Anti-extension hold — the muscles that PREVENT the lower back from arching when you squat, press, and pull. Different job from a crunch: the crunch makes abs visible, the plank stops the lower back from blowing up under load.',
          howTo: [
            'Forearms shoulder-width on the floor, elbows directly under shoulders.',
            'Tuck pelvis under (posterior tilt) — flatten the lower back.',
            'Squeeze glutes hard, brace abs like you\'re about to take a punch.',
            'Hold 20–40 seconds. Stop the set when the lower back starts to sag, NOT when arms get tired.',
          ],
          tips: [
            'Drive elbows down into the floor — that turns on the serratus and locks the shoulder blades flat.',
            'Breathe shallow in the rib cage — if you can\'t breathe at all, you\'re holding wrong.',
          ],
          commonMistakes: [
            'Hips sagging toward the floor — the lower back compensates instead of the abs working. Stop the set, no point grinding.',
            'Hips pointed up like a downward dog — easier but it stops being a plank. Body must be in one straight line.',
            'Holding 2+ minutes — past 40-60 seconds it\'s mostly an endurance test, not a strength one. Pile on more sets instead.',
          ],
        },
        zh: {
          name: '平板支撑',
          primaryMuscles: ['深层核心（腹横肌）', '腹肌'],
          secondaryMuscles: ['臀部', '肩部', '下背稳定肌群'],
          whyItMatters:
            '抗伸展等长 — 就是深蹲、推举、引体下拉时阻止腰椎反弓的那些肌肉。跟卷腹工作完全不同：卷腹让腹肌看得见，平板让下背在负重时不爆。',
          howTo: [
            '前臂着地与肩同宽，肘部正在肩关节正下方。',
            '骨盆后倾收紧 — 把腰椎压平。',
            '臀部狠夹，腹肌像迎接一记重拳那样绷紧。',
            '撑 20–40 秒。腰下沉的瞬间就停 — 不是手臂酸了才停。',
          ],
          tips: [
            '肘部往地面用力下压 — 前锯肌激活，肩胛骨锁平。',
            '肋骨那块浅呼吸 — 如果完全憋气说明姿势错了。',
          ],
          commonMistakes: [
            '臀部下沉接近地面 — 腰椎在代偿，腹肌没工作。下沉就停组，硬撑没意义。',
            '臀部翘高像下犬式 — 轻松但不算平板了。身体必须一条直线。',
            '撑 2 分钟以上 — 40–60 秒以后基本就是耐力测试，不是力量。多做几组比一组撑久强。',
          ],
        },
      },
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
    {
      key: 'bestpick',
      label: 'Best for Lats',
      labelZh: '背阔最佳',
      isBestPick: true,
      slug: 'Pullups',
      youtubeId: 'ZPG8OsHKXLw', // Jeremy Ethier — The PERFECT Pull-Up (5 Steps)
      tempo: '1-1-3',
      tempoCues: {
        lift: '1 sec drive elbows down to ribs',
        hold: '1 sec chin over the bar — full lat squeeze',
        lower: '3 sec controlled eccentric to full hang',
      },
      content: {
        en: {
          name: 'Unassisted Pull-Up (target)',
          primaryMuscles: ['Lats', 'Upper Back'],
          secondaryMuscles: ['Biceps', 'Core', 'Forearms'],
          whyItMatters:
            'The keystone movement for back width. Nothing trains the lats through their full stretched-to-shortened range with this much loading potential. Your current Assisted variant is the runway TO this — the second you can hit unassisted × 6 your lat development takes a step you cannot get any other way.',
          howTo: [
            'Full dead hang to start — shoulders packed down and back, NOT shrugged.',
            'Pull as if driving the elbows down into your back pockets — chest leads, lats do the work.',
            'Chin over the bar; squeeze for 1 sec — feel the lat shorten.',
            '3-sec eccentric back to full hang. The negative is where the lat actually grows.',
          ],
          tips: [
            'Engage the lats BEFORE you start pulling — do a scapular pull-up first (just depress the shoulders), then start the bend.',
            'Slight backward lean (~10°) keeps tension on the lats, not the biceps.',
          ],
          commonMistakes: [
            'Kipping/swinging — momentum kills the lat work.',
            'Pulling with arms first — biceps fail before lats are challenged.',
            'Dropping out of the eccentric — you skipped 50% of the growth stimulus.',
          ],
        },
        zh: {
          name: '徒手引体向上（目标）',
          primaryMuscles: ['背阔肌', '上背'],
          secondaryMuscles: ['肱二头肌', '核心', '前臂'],
          whyItMatters:
            '背宽的基石动作。没有任何动作能在拉伸位到缩短位的全行程里给背阔这么大的负荷潜力。你现在做的辅助版本就是通往这里的跑道 — 一旦能做无辅助 × 6，背阔的发展会跳一个层级，其他动作给不了。',
          howTo: [
            '完全悬挂开始 — 肩胛骨下沉收紧，不是耸肩。',
            '想象把肘部往后裤兜方向压 — 胸先上，背阔发力。',
            '下巴过杠，挤压 1 秒 — 感受背阔缩短。',
            '3 秒离心回到完全悬挂。离心阶段才是背阔真正生长的时候。',
          ],
          tips: [
            '开拉之前先激活背阔 — 先做一个肩胛引体（只下沉肩胛骨），然后再屈臂。',
            '身体略后倾约 10° 让张力留在背阔，不去二头。',
          ],
          commonMistakes: [
            '甩腿借力 — 惯性把背阔的工作毁掉。',
            '先用胳膊拉 — 二头先力竭，背阔还没受刺激。',
            '离心阶段直接掉下来 — 50% 的生长刺激跳过了。',
          ],
        },
      },
    },
  ],
  'pull-2': [
    { key: 'cable', slug: 'Seated_Cable_Rows' },
    {
      key: 'bestpick',
      label: 'Best for Upper Back',
      labelZh: '上背最佳',
      isBestPick: true,
      slug: 'T_Bar_Row_with_Handle',
      youtubeId: '4v59ShSjX2w', // DeltaBolic — BIGGER Back Workout (chest-supported row featured)
      tempo: '2-1-3',
      tempoCues: {
        lift: '2 sec row to lower chest — elbows out wider',
        hold: '1 sec squeeze blades together',
        lower: '3 sec extend arms forward',
      },
      content: {
        en: {
          name: 'Chest-Supported T-Bar Row (45°)',
          primaryMuscles: ['Mid Traps', 'Rhomboids', 'Upper Back'],
          secondaryMuscles: ['Rear Delts', 'Lats'],
          whyItMatters:
            'The 45° chest-supported angle with elbows slightly flared targets MIDDLE/LOWER traps for back THICKNESS — that\'s the dimension Cable Rows can\'t quite get because their pulling angle is too low. This is the upgrade for the area between the shoulder blades.',
          howTo: [
            'Set the bench to 45° and lay chest-down. T-bar or pair of dumbbells.',
            'Slight elbow flare (~45° from torso) — this aims the load at the upper back, not just the lats.',
            'Row to the lower chest, squeeze the shoulder blades hard for 1 sec.',
            '3-sec eccentric, get a real stretch in the upper back at the bottom.',
          ],
          tips: [
            'Pretend you\'re pinching a credit card between the shoulder blades at the top.',
            'Drop the weight 20% from your normal cable row weight — strict form here matters way more than load.',
          ],
          commonMistakes: [
            'Lifting the chest off the pad to get more range — that\'s a barbell row, not the chest-supported version.',
            'Elbows tucked tight — that\'s a lat exercise. You came here for upper back, keep them slightly out.',
            'Yanking and bouncing — the bottom stretch is the most valuable part.',
          ],
        },
        zh: {
          name: '上斜俯卧划船（45°胸支撑）',
          primaryMuscles: ['中斜方肌', '菱形肌', '上背'],
          secondaryMuscles: ['后束', '背阔'],
          whyItMatters:
            '45° 胸支撑配合肘部略微外展，把负荷打到中下斜方肌做背部"厚度" — 这是普通坐姿划船很难拿到的维度，因为拉的角度太低了。这是肩胛骨之间那块区域的升级方案。',
          howTo: [
            '凳子调到 45°，胸朝下趴上去。T 杠或一对哑铃。',
            '肘部略微外展（跟躯干约 45°）— 这才能把负荷打到上背，不只是背阔。',
            '划到下胸位置，肩胛骨用力夹紧 1 秒。',
            '3 秒离心，让上背在底部真正拉伸开。',
          ],
          tips: [
            '想象顶部用肩胛骨夹住一张信用卡。',
            '比平时坐姿划船的重量减 20% — 这个动作严格做远比重量重要。',
          ],
          commonMistakes: [
            '把胸从靠垫上抬起来增加行程 — 那是杠铃划船，不是胸支撑版本。',
            '肘部完全夹紧 — 那是背阔动作。你来这里练上背，肘部要略外展。',
            '甩起来弹起来 — 底部的拉伸才是最有价值的部分。',
          ],
        },
      },
    },
  ],
  'pull-3': [
    { key: 'cable', slug: 'Wide-Grip_Lat_Pulldown' },
    {
      key: 'bestpick',
      label: 'Best for Lat Width',
      labelZh: '背宽最佳',
      isBestPick: true,
      slug: 'Wide-Grip_Lat_Pulldown',
      youtubeId: '4v59ShSjX2w', // DeltaBolic — BIGGER Back Workout
      tempo: '2-1-3',
      tempoCues: {
        lift: '2 sec pull bar to upper chest',
        hold: '1 sec stretch then drive elbows down + back',
        lower: '3 sec extend arms upward to full stretch',
      },
      content: {
        en: {
          name: 'Single-Arm Lat Pulldown',
          primaryMuscles: ['Lats'],
          secondaryMuscles: ['Lower Traps', 'Biceps'],
          whyItMatters:
            'Unilateral pulldown gets you a longer stretched-position than the bar version — the working arm can travel farther overhead because the other side isn\'t in the way. Stretched-position training is where the lats grow fastest. Also fixes any side-to-side imbalance.',
          howTo: [
            'Cable high, single D-handle. Sit so the cable is in line with the working shoulder.',
            'Reach UP overhead first — let the lat fully stretch before you start pulling.',
            'Pull the elbow down and slightly back, like a unilateral pull-up.',
            'Pause at full contraction (handle near rib cage). 3-sec controlled return to full overhead stretch.',
          ],
          tips: [
            'Hand stays in neutral or supinated grip — neutral often feels best on the shoulder.',
            'Lean slightly away from the cable on the eccentric to maximize the stretch.',
          ],
          commonMistakes: [
            'Pulling straight down beside the body — turns into a triceps movement.',
            'Cutting the stretch short — the OVERHEAD position is where the lat gets longest.',
            'Rotating the torso to "help" — fix the torso, work the lat only.',
          ],
        },
        zh: {
          name: '单臂高位下拉',
          primaryMuscles: ['背阔肌'],
          secondaryMuscles: ['下斜方肌', '肱二头肌'],
          whyItMatters:
            '单臂下拉能拿到比直杆版本更长的拉伸位 — 工作臂可以举得更高，因为另一侧不挡路。背阔在拉伸位生长最快。还能修正左右不平衡。',
          howTo: [
            '绳索调到最高，挂单 D 把。坐姿让绳索跟工作侧肩在一条线上。',
            '先向上充分伸展 — 让背阔完全拉伸再开始拉。',
            '把肘部向下 + 略后拉，像单臂引体一样。',
            '完全收缩位（手到肋骨旁）停 1 秒。3 秒控制回到完全过头位的拉伸。',
          ],
          tips: [
            '中立握或反握 — 中立握对肩部通常最舒服。',
            '离心阶段身体略微往绳索反方向倾，拉伸最大化。',
          ],
          commonMistakes: [
            '直接沿身体侧拉下 — 变成三头动作。',
            '拉伸做不到位 — 完全过头位才是背阔最长的位置。',
            '躯干旋转借力 — 固定躯干，只让背阔工作。',
          ],
        },
      },
    },
  ],
  'pull-4': [
    { key: 'dumbbell', slug: 'Reverse_Flyes' },
    {
      key: 'bestpick',
      label: 'Best for Rear Delts',
      labelZh: '后束最佳',
      isBestPick: true,
      slug: 'Reverse_Grip_Bent-Over_Rows',
      youtubeId: 'H5UxZFl0lgk', // DeltaBolic — The PERFECT Rear Delt Machine Fly
      tempo: '2-1-2',
      tempoCues: {
        lift: '2 sec open arms wide — elbows lead',
        hold: '1 sec hard squeeze at full external rotation',
        lower: '2 sec eccentric — control the return',
      },
      content: {
        en: {
          name: 'Reverse Pec Deck',
          primaryMuscles: ['Rear Delts'],
          secondaryMuscles: ['Upper Back', 'Rotator Cuff'],
          whyItMatters:
            'Machine reverse fly locks the path so the rear delt does ALL the work — no torso swing, no lat / trap assistance, no balance compensation. For a muscle this small and stubborn, locking out every other muscle is what unlocks growth.',
          howTo: [
            'Chest pressed FIRMLY to the pad. Adjust the seat so the handles align with the shoulders, NOT chest height.',
            'Grab with a neutral or pronated grip (thumb-up reduces some bicep involvement).',
            'Pull the handles out wide — lead with the ELBOWS, not the hands.',
            'Squeeze hard at full external rotation. 2-sec eccentric, controlled return — do not let the stack crash.',
          ],
          tips: [
            'A 70-80% weight feels like 100% on rear delts. Resist the urge to load it heavier.',
            'Pause at the start of each rep (arms extended) — kills any trap/swing assist.',
          ],
          commonMistakes: [
            'Lifting the chest off the pad to get the weight back — turns it into a rowing motion. Restrains the rear delt instead of working it.',
            'Going too heavy — traps + rhomboids take over and you grow those instead.',
            'Stopping short — the back-half of the fly (when arms cross past the body line) is where the rear delt peaks.',
          ],
        },
        zh: {
          name: '反向飞鸟器械',
          primaryMuscles: ['后束'],
          secondaryMuscles: ['上背', '肩袖'],
          whyItMatters:
            '器械反向飞鸟把轨迹锁住，后束做"全部"工作 — 没有躯干借力、没有背阔 / 斜方肌帮忙、没有平衡补偿。对一块这么小又这么顽固的肌肉，锁住其他肌肉才能解锁增长。',
          howTo: [
            '胸"狠狠"贴在靠垫上。调座椅让把手跟肩同高，不是胸高。',
            '中立握或正握（拇指朝上能减少一点二头借力）。',
            '把把手向外打开 — 用"肘"带动，不是手。',
            '完全外旋时狠挤压。2 秒离心控制回放 — 不要让配重砸下来。',
          ],
          tips: [
            '70–80% 的重量对后束就像 100%。忍住加重的冲动。',
            '每次开始时停一下（手臂伸直位）— 杜绝斜方肌和摆动借力。',
          ],
          commonMistakes: [
            '胸离开靠垫去拉重量 — 变成了划船动作。后束没受刺激反而被绑住了。',
            '太重 — 斜方和菱形接管，你练的就是那些不是后束。',
            '没到位就停 — 飞鸟后半程（手臂超过身体线）才是后束顶峰。',
          ],
        },
      },
    },
  ],
  'pull-5': [
    { key: 'dumbbell', slug: 'One-Arm_Dumbbell_Row' },
    {
      key: 'bestpick',
      label: 'Best for Mid Back',
      labelZh: '中背最佳',
      isBestPick: true,
      slug: 'One-Arm_Dumbbell_Row',
      youtubeId: '4v59ShSjX2w', // DeltaBolic — BIGGER Back Workout (single-arm row featured)
      tempo: '2-1-3',
      tempoCues: {
        lift: '2 sec row dumbbell to hip — elbows tucked',
        hold: '1 sec squeeze lat hard',
        lower: '3 sec lower to full lat stretch',
      },
      content: {
        en: {
          name: 'Single-Arm Row (Elbows-Tucked)',
          primaryMuscles: ['Lats', 'Teres Major'],
          secondaryMuscles: ['Mid Traps', 'Biceps'],
          whyItMatters:
            'The cleanest unilateral lat builder. Elbows tucked tight + pulling straight back (instead of out) shifts the line of pull to the LAT and teres major specifically — no upper-trap takeover. The same row done with flared elbows hits the upper back instead, which is why most people\'s rows don\'t grow their lats.',
          howTo: [
            'One hand + same-side knee on bench. Flat back, slight arch in lower back.',
            'Hand directly under the shoulder. Dumbbell hangs straight down to start.',
            'Row the dumbbell back along the body — elbow tucked tight, brushing the ribs.',
            'Squeeze lat for 1 sec at the top (dumbbell near hip). 3-sec eccentric back to dead hang.',
          ],
          tips: [
            'Lead with the elbow — if the hand leads, the bicep takes over.',
            'Let the dumbbell pull the shoulder forward into a real stretch at the bottom — that\'s where the lat grows.',
          ],
          commonMistakes: [
            'Elbow flaring outward — turns it into an upper-back row instead of a lat row.',
            'Rotating the torso to swing — kills the unilateral isolation.',
            'Rounding the lower back at the bottom — back hurts, lat doesn\'t get worked.',
          ],
        },
        zh: {
          name: '单臂划船（肘部紧贴）',
          primaryMuscles: ['背阔肌', '大圆肌'],
          secondaryMuscles: ['中斜方肌', '肱二头肌'],
          whyItMatters:
            '最干净的单边背阔训练动作。肘部紧贴 + 沿身体方向往后划（不是向外）— 阻力线精准打到背阔和大圆肌，没有上斜方肌接管。同样的划船肘部外展就变成练上背了，这就是为什么大多数人划船练不出背阔的原因。',
          howTo: [
            '同侧手 + 膝盖撑凳。背挺直，腰部微微有自然曲线。',
            '手在肩正下方。哑铃自然下垂作为起始位。',
            '哑铃沿身体往后划 — 肘部紧贴肋骨刷过。',
            '顶部（哑铃到髋部）背阔挤压 1 秒。3 秒离心回到完全悬挂。',
          ],
          tips: [
            '用肘部带动 — 用手带动二头就接管了。',
            '底部让哑铃把肩部往前带，给背阔真正的拉伸 — 这才是背阔生长的地方。',
          ],
          commonMistakes: [
            '肘部外展 — 变成了上背划船，不是背阔划船。',
            '躯干旋转借力 — 单侧孤立的意义没了。',
            '底部腰椎弯曲 — 腰会疼，背阔反而没受刺激。',
          ],
        },
      },
    },
  ],
  'pull-6': [
    { key: 'dumbbell', slug: 'Dumbbell_Bicep_Curl' },
    {
      key: 'machine',
      label: 'Machine Preacher Curl',
      labelZh: '坐姿弯举机',
      slug: 'Machine_Bicep_Curl',
      youtubeId: 'S4dDLfp3e8w', // DeltaBolic — The PERFECT Machine Preacher Curl
      tempo: '2-1-3',
      tempoCues: {
        lift: '2 sec curl up — wrists neutral',
        hold: '1 sec hard squeeze at peak',
        lower: '3 sec eccentric to full stretch',
      },
      content: {
        en: {
          name: 'Machine Preacher Curl',
          whyItMatters:
            'Preacher position locks the upper arm against the pad so the BICEP does all the work — no swing, no cheat, no shoulder involvement. The arc of the machine also gives constant tension where free-weight preachers lose it at the top.',
          howTo: [
            'Adjust the seat so the armpits sit on top of the pad — upper arms flat, not pinched.',
            'Thumbless grip on the handles. Wrists stay neutral the whole rep.',
            'Curl up to a hard 1-sec squeeze. Stop just short of where the cam unloads.',
            '3-sec eccentric — do NOT let the arms snap straight at the bottom.',
          ],
          tips: [
            'Keep wrists neutral (not curled in) — wrist curl shifts the load off the biceps.',
            'Tuck the elbows slightly INWARD on the pad — wider elbows = forearm dominance.',
          ],
          commonMistakes: [
            'Letting the arms snap straight at the bottom — bicep tendon takes the load instead of the muscle. Eccentric injuries happen here.',
            'Pinching wrists toward the body to crank the weight up — that\'s a wrist curl + cheat.',
            'Standing up out of the seat for the last reps — defeats the entire purpose of the preacher pad.',
          ],
        },
        zh: {
          name: '坐姿牧师凳弯举机',
          whyItMatters:
            '牧师凳位置把上臂锁在垫子上，让"二头"做全部的工作 — 没有摆动、没有借力、没有肩部参与。器械的轨迹给的张力也比自由重量牧师凳更恒定（自由重量在顶部张力会丢）。',
          howTo: [
            '调座椅让腋窝刚好压在垫子顶端 — 上臂平贴，不要被夹。',
            '不握死大拇指。手腕全程保持中立位。',
            '弯举到顶部狠挤压 1 秒。停在凸轮卸力之前。',
            '3 秒离心 — 底部绝对不能让手臂"啪"地伸直。',
          ],
          tips: [
            '手腕保持中立（不要往内卷）— 卷腕等于把负荷从二头转走。',
            '肘部在垫子上略微"内收"一点 — 肘部太宽前臂会主导。',
          ],
          commonMistakes: [
            '底部让手臂弹直 — 二头肌腱承受负荷，而不是肌肉。离心损伤就发生在这里。',
            '把手腕往身体方向卷起拉重量 — 那是卷腕 + 借力。',
            '最后几次从座椅上站起来 — 整个牧师垫的意义就没了。',
          ],
        },
      },
    },
    {
      key: 'bestpick',
      label: 'Best for Long Head',
      labelZh: '二头长头最佳',
      isBestPick: true,
      slug: 'Incline_Hammer_Curls',
      youtubeId: 'W3dEbUba9Ck', // DeltaBolic — Build BIGGER Bicep Peaks!
      tempo: '2-1-3',
      tempoCues: {
        lift: '2 sec curl with arm BEHIND the body',
        hold: '1 sec squeeze + slight supination at top',
        lower: '3 sec controlled eccentric to full stretch',
      },
      content: {
        en: {
          name: 'Incline Dumbbell Curl',
          primaryMuscles: ['Biceps (Long Head)'],
          secondaryMuscles: ['Biceps (Short Head)', 'Brachialis'],
          whyItMatters:
            'The bicep PEAK comes from the LONG HEAD, which only grows when the elbow is BEHIND the body — that\'s the position the incline curl puts you in. Standing curls don\'t reach this stretched position, which is why most people\'s biceps look round but not peaked.',
          howTo: [
            'Incline bench at 45–60°. Sit all the way back so the shoulder blades touch the pad.',
            'Arms hang straight down behind the body. Dumbbells start fully extended.',
            'Curl WITHOUT moving the elbow forward — the upper arm stays locked behind the torso.',
            'Squeeze + slight supination at the top. 3-sec eccentric to a deep stretch.',
          ],
          tips: [
            'Lighter than standing curls. Long-head training is about the stretched position, not the load.',
            'If shoulders bother you, set the bench more upright (60°+) — still better than 0° standing curls.',
          ],
          commonMistakes: [
            'Elbows drifting forward as fatigue sets in — defeats the whole point. Stop the set when the elbow can\'t stay locked.',
            'Going too heavy — turns into a half-rep that doesn\'t reach the stretched position.',
            'Cutting the eccentric short — the bottom stretch is the entire purpose. 3 seconds, minimum.',
          ],
        },
        zh: {
          name: '上斜哑铃弯举',
          primaryMuscles: ['肱二头肌（长头）'],
          secondaryMuscles: ['肱二头肌（短头）', '肱肌'],
          whyItMatters:
            '二头的"峰"来自"长头"，而长头只有在肘部"在身体后方"时才生长 — 这正是上斜弯举把你放进的位置。站姿弯举到不了这个拉伸位，这就是为什么大多数人的二头是圆的但没有峰。',
          howTo: [
            '凳子调到 45–60°。完全坐进去让肩胛骨贴上靠垫。',
            '双臂在身体后方自然下垂。哑铃从完全伸展位开始。',
            '弯举时"不要"让肘部前移 — 上臂锁在躯干后方。',
            '顶部挤压 + 略微旋后。3 秒离心到深度拉伸位。',
          ],
          tips: [
            '比站姿弯举要轻。长头训练靠的是拉伸位，不是大重量。',
            '如果肩部不舒服，凳子调更直（60°以上）— 也比 0° 站姿强。',
          ],
          commonMistakes: [
            '疲劳上来肘部往前移 — 整个动作的意义就没了。肘部锁不住就停组。',
            '太重 — 变成半程，根本到不了拉伸位。',
            '离心做太快 — 底部拉伸是整个动作的全部目的。3 秒最少。',
          ],
        },
      },
    },
  ],
  'pull-7': [
    { key: 'abwheel', slug: 'Ab_Roller' },
    {
      key: 'cablecrunch',
      label: 'Best for Abs',
      labelZh: '腹肌最佳',
      isBestPick: true,
      slug: 'Cable_Crunch',
      tempo: '2-1-3',
      tempoCues: {
        lift: '2 sec crunch downward — round the spine',
        hold: '1 sec hard ab squeeze',
        lower: '3 sec return upward with control',
      },
      youtubeId: 'K2m0jj6RfYg', // STOP Making This Cable Crunch MISTAKE
      content: {
        en: {
          name: 'Cable Crunch',
          primaryMuscles: ['Abs (Rectus Abdominis)'],
          secondaryMuscles: ['Obliques'],
          whyItMatters:
            'The only ab movement you can progressively overload like a real muscle. Ab Wheel taps out at bodyweight after a few weeks; the cable crunch lets you add 5 lb every couple sessions until your abs are as developed as any other body part.',
          howTo: [
            'Cable high with the rope attachment.',
            'Kneel a step in front of the stack. Rope sits at the temples — not behind the head.',
            'Crunch DOWN by rounding the spine — chin to belly button.',
            'Hips stay completely still. Pause 1 sec. 3-sec eccentric back up.',
          ],
          tips: [
            'Pull elbows toward thighs as you crunch — that visual cue forces the spinal flexion.',
            'Imagine the rope is glued to your forehead.',
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
            '唯一能像其他肌肉一样渐进超负荷的腹肌动作。腹轮几周后就到顶（体重不变），绳索卷腹能每隔几次训练加 5 lb，直到腹肌发达程度跟其他肌群一样。',
          howTo: [
            '绳索调到最高，挂绳索把手。',
            '在配重片前一步跪下。绳索放在太阳穴两侧 — 不是脑后。',
            '通过卷起脊柱往下卷 — 下巴往肚脐方向。',
            '髋部完全不动。停 1 秒。3 秒离心回起。',
          ],
          tips: [
            '卷腹时想象肘部往大腿压 — 这个视觉提示强制脊柱屈曲。',
            '想象绳索粘在额头上。',
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
    {
      key: 'bestpick',
      label: 'Best for Quads',
      labelZh: '股四头最佳',
      isBestPick: true,
      slug: 'Leg_Extensions',
      youtubeId: 'S5S0Eus4mDo', // DeltaBolic — When You Realize the Leg Extension Isn't Just for Quads
      tempo: '2-1-3',
      tempoCues: {
        lift: '2 sec extend legs fully — hard squeeze',
        hold: '1 sec hold at lockout',
        lower: '3 sec lower to full quad stretch',
      },
      content: {
        en: {
          name: 'Leg Extension',
          primaryMuscles: ['Quads (Rectus Femoris)'],
          secondaryMuscles: ['Quads (Vastus Lateralis / Medialis)'],
          whyItMatters:
            'The only quad exercise that fully lengthens the RECTUS FEMORIS — the long head that crosses the hip joint and gives the quad its visible "tear-drop" peak. Squats train it, but only in shortened range. Add this once a week and your quad development goes up a level.',
          howTo: [
            'Feet hip-width — wider stance reduces quad activation.',
            'Grip the side handles, NOT your lap — handles let you produce maximum force.',
            'Align the knee with the machine\'s pivot point. Misalignment = knee pain.',
            'FULLY extend the legs with control. Save partials for once you\'ve already failed full reps.',
          ],
          tips: [
            'Point toes slightly OUT to bias the rectus femoris (the visible long head).',
            'Pause hard at lockout — 1 second of full squeeze is more growth stimulus than two sloppy reps.',
          ],
          commonMistakes: [
            'Cutting reps short — partial reps in the middle of a set undertrain the lengthened position.',
            'Feet too wide — distributes load and reduces the quad-specific stimulus.',
            'Slamming the weight stack on the eccentric — 3-sec lower or you skip the growth phase.',
          ],
        },
        zh: {
          name: '坐姿腿屈伸',
          primaryMuscles: ['股四头肌（股直肌）'],
          secondaryMuscles: ['股四头肌（股外侧/股内侧肌）'],
          whyItMatters:
            '唯一能让"股直肌"充分拉长的动作 — 股直肌是跨过髋关节的那个长头，给股四头视觉上的"水滴"形状。深蹲也练它，但只在缩短范围。每周加一次，你的股四头会跳一个层级。',
          howTo: [
            '双脚与髋同宽 — 站宽减少股四头激活。',
            '抓住"侧边握把"，不是放在腿上 — 握把让你能输出最大力量。',
            '膝关节对齐器械的支点。错位 = 膝痛。',
            '腿"完全"伸直再控制下放。半程要留到完整次数已经力竭后再做。',
          ],
          tips: [
            '脚尖略微"外"开偏向股直肌（视觉上的长头）。',
            '锁定位狠狠停一下 — 1 秒满收缩比 2 次糊弄的次数刺激更大。',
          ],
          commonMistakes: [
            '半程次数 — 中间半程没充分训练拉长位。',
            '双脚太宽 — 力量分散，股四头特定刺激减少。',
            '离心阶段砸下来 — 3 秒下放，否则跳过生长阶段。',
          ],
        },
      },
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
    {
      key: 'bestpick',
      label: 'Best for Glutes',
      labelZh: '臀部最佳',
      isBestPick: true,
      slug: 'Barbell_Hip_Thrust',
      youtubeId: '0xfdeCBwoYw', // Booty Builder — Hip Thrust Machine
      tempo: '2-2-3',
      tempoCues: {
        lift: '2 sec thrust hips upward',
        hold: '2 sec squeeze glutes hard at top',
        lower: '3 sec lower with control',
      },
      content: {
        en: {
          name: 'Hip Thrust',
          primaryMuscles: ['Glutes'],
          secondaryMuscles: ['Hamstrings', 'Core'],
          whyItMatters:
            'Bulgarian Split Squat is great for unilateral strength + glute shape, but the hip thrust LOADS the glutes with way more weight at peak contraction. For pure glute size, this beats split squats by a wide margin. You\'re already doing it on this program — adding it to leg-3 as the "if you can only pick one" answer for glutes.',
          howTo: [
            'Upper back on bench, feet flat ~shoulder-width.',
            'Chin tucked, ribs down — neutral spine throughout.',
            'Drive through HEELS, squeeze glutes HARD at the top.',
            'Pause 2 sec at the top, control 3-sec descent.',
          ],
          tips: [
            'Posteriorly tilt pelvis at the top — locks out the glutes, prevents lumbar arch.',
            'Pause at the top — quality over weight.',
          ],
          commonMistakes: [
            'Over-arching at the top — that\'s the lower back, NOT the glutes.',
            'Heels too far forward — turns into a leg curl.',
            'Not squeezing glutes — pushing with quads.',
          ],
        },
        zh: {
          name: '臀推',
          primaryMuscles: ['臀部'],
          secondaryMuscles: ['腘绳肌', '核心'],
          whyItMatters:
            '保加利亚分腿蹲对单边力量和臀型很好，但臀推能在收缩峰值给臀部"远远更大"的负荷。纯臀部围度上，这个动作大幅胜过分腿蹲。你已经在做臀推了 — 在 leg-3 加上它作为"只能选一个"练臀的答案。',
          howTo: [
            '上背贴凳子，双脚约肩宽。',
            '下巴微收，肋骨下压 — 全程脊柱中立。',
            '用"脚跟"发力，顶部臀部"狠"挤压。',
            '顶部停 2 秒，3 秒控制下放。',
          ],
          tips: [
            '顶部骨盆后倾 — 锁住臀部发力，防止腰椎反弓。',
            '顶部停顿 — 质量胜过重量。',
          ],
          commonMistakes: [
            '顶部腰椎过度反弓 — 那是下背在发力，不是臀。',
            '脚跟离得太远 — 变成腿弯举。',
            '不主动挤臀 — 股四头在推。',
          ],
        },
      },
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
    {
      key: 'bestpick',
      label: 'Best for Glute Isolation',
      labelZh: '臀部孤立最佳',
      isBestPick: true,
      slug: 'Glute_Kickback',
      youtubeId: 'UbOcViik3hk', // DeltaBolic — Glute Kickback Variations
      tempo: '2-1-3',
      tempoCues: {
        lift: '2 sec drive leg back + up',
        hold: '1 sec squeeze glute at the top',
        lower: '3 sec return with control',
      },
      content: {
        en: {
          name: 'Cable Glute Kickback',
          primaryMuscles: ['Glutes (Gluteus Maximus)'],
          secondaryMuscles: ['Hamstrings'],
          whyItMatters:
            'Hip thrusts get the glute under high load, but they always share the work with the hamstrings + lower back. Cable kickback is the cleanest GLUTE-ONLY isolation — perfect to pair with hip thrust at the end of the session to fully exhaust the glutes.',
          howTo: [
            'Cable at the lowest setting, ankle strap attachment.',
            'Hold a stable post for support. Slight forward lean.',
            'Drive the working leg STRAIGHT BACK + slightly up — knee can bend a little, but the action is at the HIP.',
            'Hard squeeze at the top for 1 sec. 3-sec return WITHOUT letting the cable yank.',
          ],
          tips: [
            'Slight lean forward shifts emphasis to the UPPER glute (the part that\'s "rounded" at the top of the cheek).',
            'Pause every rep at the top — momentum kills this exercise.',
          ],
          commonMistakes: [
            'Kicking with a bent leg using the hamstring — flex the glute, not the hamstring.',
            'Going too heavy — turns into a lower-back swing.',
            'Letting the cable rip the leg back to start — that\'s eccentric overload your hip flexor doesn\'t want.',
          ],
        },
        zh: {
          name: '绳索臀部后踢',
          primaryMuscles: ['臀大肌'],
          secondaryMuscles: ['腘绳肌'],
          whyItMatters:
            '臀推能给臀部很大负荷，但总是会分享给腘绳肌和下背。绳索后踢是最干净的"只练臀部"孤立动作 — 完美搭配臀推放在训练末尾把臀部彻底榨干。',
          howTo: [
            '绳索调到最低，挂踝部绑带。',
            '抓住一个稳定的柱子保持平衡。身体略微前倾。',
            '工作腿向"正后方" + 略向上踢 — 膝部可以微弯，但动作来自髋部。',
            '顶部狠狠挤臀 1 秒。3 秒控制回放，不要让绳索把腿扯回来。',
          ],
          tips: [
            '略微前倾把重点转移到"上臀"（也就是臀部上方圆润的那部分）。',
            '每次顶部停一下 — 借惯性会毁掉这个动作。',
          ],
          commonMistakes: [
            '弯腿用腘绳肌踢 — 用臀部收缩，不是腘绳肌。',
            '太重 — 变成腰椎甩动。',
            '让绳索把腿扯回起始位 — 那是髂腰肌不想要的离心负荷。',
          ],
        },
      },
    },
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
            'Hinging the torso ~15–20° forward shifts the line of resistance behind the shoulder pivot, putting peak tension on the side delt exactly where it grows — the bottom half of the lift. With Push Day already loading the shoulder up, this leg-day extra set is best done in this most-efficient form.',
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
            'Standing up out of the hinge to swing the weight.',
            'Shrugging traps to finish the lift.',
            'Going above shoulder — trap takeover.',
          ],
        },
        zh: {
          name: '前倾侧平举',
          primaryMuscles: ['中束'],
          secondaryMuscles: ['后束'],
          whyItMatters:
            '上身前倾约 15–20°，阻力方向就从肩关节支点后方拉过来，张力峰值刚好落在中束最关键的位置 — 动作下半程。推日已经给肩部上量了，腿日这一组用最高效的形式来做。',
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
            'Deadbug is great for ANTI-extension core control (the muscles that protect the spine), but it does not grow visible abs. The cable crunch is the missing piece — pure spinal flexion under progressive load. Pair them: deadbug for protection, cable crunch for size.',
          howTo: [
            'Cable high with the rope attachment.',
            'Kneel a step in front of the stack. Rope sits at the temples — not behind the head.',
            'Crunch DOWN by rounding the spine — chin to belly button.',
            'Hips stay completely still. Pause 1 sec. 3-sec eccentric back up.',
          ],
          tips: [
            'Pull elbows toward thighs as you crunch.',
            'Imagine the rope is glued to your forehead.',
          ],
          commonMistakes: [
            'Hinging at the hips — lats + glutes do all the work, abs barely move.',
            'Pulling the rope down to the face — turns it into a lat pulldown.',
            'Tossing the weight at the top of the return.',
          ],
        },
        zh: {
          name: '绳索卷腹',
          primaryMuscles: ['腹肌（腹直肌）'],
          secondaryMuscles: ['腹斜肌'],
          whyItMatters:
            '死虫式很适合"抗伸展"的核心控制（保护脊柱的那些肌肉），但它"不会"练出看得见的腹肌。绳索卷腹是缺失的那块 — 纯粹的脊柱屈曲 + 渐进负荷。两个一起做：死虫式保护，绳索卷腹长肌肉。',
          howTo: [
            '绳索调到最高，挂绳索把手。',
            '在配重片前一步跪下。绳索放在太阳穴两侧 — 不是脑后。',
            '通过卷起脊柱往下卷 — 下巴往肚脐方向。',
            '髋部完全不动。停 1 秒。3 秒离心回起。',
          ],
          tips: [
            '卷腹时想象肘部往大腿压。',
            '想象绳索粘在额头上。',
          ],
          commonMistakes: [
            '从髋部弯下 — 背阔和臀肌全包了。',
            '把绳索拉到脸前 — 变成了背阔下拉。',
            '回到顶部时放下重量太快。',
          ],
        },
      },
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
