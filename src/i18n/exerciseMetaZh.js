// Chinese translations for tempo cues, keyed by exercise id (or variant key).

export const EXERCISE_META_ZH = {
  // ── PUSH ──
  'push-1': { lift: '2 秒向上推举哑铃过头', hold: '1 秒顶部停顿', lower: '3 秒控制下放' },
  'push-2': { lift: '2 秒向两侧抬起', hold: '1 秒肩高停住', lower: '2 秒下放' },
  'push-3': { lift: '2 秒向上推', hold: '1 秒顶部挤压胸部', lower: '3 秒下放' },
  'push-4': { lift: '2 秒拉向面部', hold: '1 秒挤压后束 / 上背', lower: '2 秒手臂前伸还原' },
  'push-5': { lift: '2 秒向下下压', hold: '1 秒底部挤压三头', lower: '3 秒控制回放' },
  'push-6': { lift: '2 秒抬腿', hold: '1 秒顶部停住', lower: '3 秒控制下放' },

  // ── PULL ──
  'pull-1': { lift: '1 秒拉起', hold: '1 秒顶部挤压', lower: '3 秒下放' },
  'pull-2': { lift: '2 秒划船拉向身体', hold: '1 秒挤压肩胛骨', lower: '3 秒手臂前伸' },
  'pull-3': { lift: '2 秒下拉杠铃', hold: '1 秒胸前挤压', lower: '3 秒回放' },
  'pull-4': { lift: '2 秒外展手臂', hold: '1 秒挤压后束', lower: '2 秒下放' },
  'pull-5': { lift: '2 秒向上划船', hold: '1 秒顶部挤压', lower: '3 秒下放' },
  'pull-6': { lift: '2 秒弯举', hold: '1 秒挤压肱二头肌', lower: '3 秒下放' },
  'pull-7': { lift: '2 秒收回', hold: '1 秒最大拉伸停住', lower: '3 秒向前推出' },

  // ── LEG ──
  'leg-1': { lift: '2 秒起身', hold: '1 秒底部停住', lower: '3 秒下蹲' },
  'leg-2': { lift: '2 秒髋部前送站起', hold: '1 秒底部拉伸停住', lower: '3 秒沿大腿下放 / 髋后推' },
  'leg-3': { lift: '2 秒推起', hold: '1 秒底部停住', lower: '3 秒下蹲' },
  'leg-4': { lift: '2 秒臀部上顶', hold: '2 秒顶部挤臀', lower: '3 秒下放' },
  'leg-5': { lift: '2 秒外展手臂', hold: '1 秒肩高停住', lower: '2 秒下放' },
  'leg-6': { lift: '2 秒踮起脚尖', hold: '1 秒顶部挤压小腿', lower: '3 秒拉伸下放' },
  'leg-7': { lift: '2 秒伸出对侧手 + 腿', hold: '1 秒收紧核心保持', lower: '2 秒收回起始位' },

  // ── Variant overrides (keyed by exerciseId.variantKey) ──
  'push-1.bestpick': {
    lift: '2 秒向身前抬起',
    hold: '1 秒肩部稍高位停住',
    lower: '3 秒控制下放',
  },
  'push-2.bestpick': {
    lift: '2 秒向侧抬起',
    hold: '1 秒肩高停住',
    lower: '3 秒离心 — 控制下落',
  },
  'push-3.machine': {
    lift: '2 秒向前推 — 顶部胸部轻挤',
    hold: '1 秒短暂停留（不要顶死）',
    lower: '3 秒下放到胸部充分拉伸',
  },
  'push-3.bestpick': {
    lift: '2 秒沿弧线向上 + 向额头方向汇合',
    hold: '1 秒挤压上胸内侧',
    lower: '3 秒离心 — 张开到拉伸位',
  },
  'push-4.bestpick': {
    lift: '2 秒手臂向外画大弧',
    hold: '1 秒外旋位停顿',
    lower: '3 秒离心 — 控制回放',
  },
  'push-5.bestpick': {
    lift: '2 秒向头顶方向伸直',
    hold: '1 秒挤压 + 双手撕开',
    lower: '3 秒拉伸到头后充分位置',
  },
  'push-6.plank': {
    lift: '维持紧实核心 20–40 秒',
    hold: '腹部收紧 · 臀部夹紧 · 身体保持一条直线',
    lower: '无动作 — 纯等长收缩',
  },
  'push-6.bestpick': {
    lift: '2 秒向下卷腹 — 卷起脊柱',
    hold: '1 秒腹肌硬挤',
    lower: '3 秒回放向上',
  },
  'pull-7.cablecrunch': {
    lift: '2 秒向下卷腹',
    hold: '1 秒挤压腹肌',
    lower: '3 秒回放向上',
  },
};

export const tempoCuesZh = (exerciseId, variantKey) => {
  if (variantKey) {
    const key = `${exerciseId}.${variantKey}`;
    if (EXERCISE_META_ZH[key]) return EXERCISE_META_ZH[key];
  }
  return EXERCISE_META_ZH[exerciseId];
};
