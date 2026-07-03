import { describe, it, expect } from 'vitest';
import { recommendNextWeight, progressTrend } from './progression.js';

// The progression engine is the one piece of ATLAS that makes a
// decision the user acts on with a barbell in their hands. Every
// branch of the double-progression model gets a locked-down case
// here so a future refactor can't silently flip a recommendation.

// ── helpers ────────────────────────────────────────────────────

let sessionSeq = 0;
function session(exerciseId, logs, completedAt) {
  sessionSeq += 1;
  return {
    [`s${sessionSeq}`]: {
      type: 'pull',
      startedAt: completedAt - 3600_000,
      completedAt,
      completedSets: { [exerciseId]: logs },
    },
  };
}

function historyOf(...sessions) {
  return Object.assign({}, ...sessions);
}

const T0 = 1_700_000_000_000;
const DAY = 86_400_000;

function rec(history, overrides = {}) {
  return recommendNextWeight({
    history,
    exerciseId: 'pull-1',
    variantKey: null,
    repRange: '8-12',
    currentUnit: 'kg',
    ...overrides,
  });
}

// ── recommendNextWeight ────────────────────────────────────────

describe('recommendNextWeight — double progression', () => {
  it('returns null with no history', () => {
    expect(rec({})).toBeNull();
  });

  it('returns null when the exercise has no logged sets', () => {
    const h = historyOf(session('other-ex', [{ weight: 40, reps: 10, difficulty: 'moderate', weightUnit: 'kg' }], T0));
    expect(rec(h)).toBeNull();
  });

  it('returns null for unparseable rep ranges (AMRAP / static)', () => {
    const h = historyOf(session('pull-1', [{ weight: 40, reps: 10, difficulty: 'moderate', weightUnit: 'kg' }], T0));
    expect(rec(h, { repRange: 'AMRAP' })).toBeNull();
    expect(rec(h, { repRange: 'Static' })).toBeNull();
  });

  it('exceeded ceiling + easy → BIG bump', () => {
    const h = historyOf(session('pull-1', [{ weight: 40, reps: 13, difficulty: 'easy', weightUnit: 'kg' }], T0));
    const r = rec(h);
    expect(r.kind).toBe('bigBump');
    // 40 kg is in the 25–100 bracket → big = 5 kg
    expect(r.weight).toBe(45);
    expect(r.reasoning).toBe('exceededRangeEasy');
  });

  it('exceeded ceiling at moderate effort → SMALL bump', () => {
    const h = historyOf(session('pull-1', [{ weight: 40, reps: 13, difficulty: 'moderate', weightUnit: 'kg' }], T0));
    const r = rec(h);
    expect(r.kind).toBe('smallBump');
    // small = 2.5 kg in the 25–100 bracket
    expect(r.weight).toBe(42.5);
  });

  it('AT ceiling + easy → small bump (easyAtTop)', () => {
    const h = historyOf(session('pull-1', [{ weight: 40, reps: 12, difficulty: 'easy', weightUnit: 'kg' }], T0));
    const r = rec(h);
    expect(r.kind).toBe('smallBump');
    expect(r.reasoning).toBe('easyAtTop');
    expect(r.weight).toBe(42.5);
  });

  it('AT ceiling but hard → hold, consolidate', () => {
    const h = historyOf(session('pull-1', [{ weight: 40, reps: 12, difficulty: 'hard', weightUnit: 'kg' }], T0));
    const r = rec(h);
    expect(r.kind).toBe('holdAtTop');
    expect(r.weight).toBe(40);
  });

  it('inside the range → maintain weight, chase reps', () => {
    const h = historyOf(session('pull-1', [{ weight: 40, reps: 10, difficulty: 'hard', weightUnit: 'kg' }], T0));
    const r = rec(h);
    expect(r.kind).toBe('maintain');
    expect(r.reasoning).toBe('pushReps');
    expect(r.weight).toBe(40);
  });

  it('below the floor → 10% deload, plate-rounded', () => {
    const h = historyOf(session('pull-1', [{ weight: 40, reps: 6, difficulty: 'failure', weightUnit: 'kg' }], T0));
    const r = rec(h);
    expect(r.kind).toBe('deload');
    // 40 * 0.9 = 36 → rounds to 36 (0.5 kg precision)
    expect(r.weight).toBe(36);
  });

  it('anchors on the TOP set of the latest session, not the last log entry', () => {
    // Session ends with a back-off set at 30 kg; the top set (45 kg × 13 easy)
    // is what the recommendation must anchor on.
    const h = historyOf(
      session('pull-1', [
        { weight: 45, reps: 13, difficulty: 'easy', weightUnit: 'kg' },
        { weight: 30, reps: 15, difficulty: 'easy', weightUnit: 'kg' },
      ], T0),
    );
    const r = rec(h);
    expect(r.from.weight).toBe(45);
    expect(r.kind).toBe('bigBump');
    expect(r.weight).toBe(50);
  });

  it('uses the LATEST session when several exist', () => {
    const h = historyOf(
      session('pull-1', [{ weight: 35, reps: 12, difficulty: 'easy', weightUnit: 'kg' }], T0),
      session('pull-1', [{ weight: 40, reps: 10, difficulty: 'hard', weightUnit: 'kg' }], T0 + DAY * 3),
    );
    const r = rec(h);
    expect(r.from.weight).toBe(40);
    expect(r.kind).toBe('maintain');
  });

  it('converts stored lb → display kg before computing the bump', () => {
    // 88 lb ≈ 40 kg. Reps above ceiling at easy → big bump in kg.
    const h = historyOf(session('pull-1', [{ weight: 88, reps: 13, difficulty: 'easy', weightUnit: 'lb' }], T0));
    const r = rec(h, { currentUnit: 'kg' });
    expect(r.from.unit).toBe('kg');
    expect(r.from.weight).toBeCloseTo(40, 0);
    expect(r.weight).toBe(45);
  });

  it('respects the variant filter — other variants do not leak in', () => {
    const h = historyOf(
      session('pull-1', [{ weight: 60, reps: 13, difficulty: 'easy', weightUnit: 'kg', variant: 'machine' }], T0),
    );
    // Asking for the 'cable' variant: the machine log is filtered out → null.
    expect(rec(h, { variantKey: 'cable' })).toBeNull();
    // Asking for 'machine' works.
    expect(rec(h, { variantKey: 'machine' })?.kind).toBe('bigBump');
  });

  it('legacy logs without a variant tag count for ANY variant', () => {
    const h = historyOf(
      session('pull-1', [{ weight: 40, reps: 10, difficulty: 'moderate', weightUnit: 'kg' }], T0),
    );
    expect(rec(h, { variantKey: 'cable' })?.kind).toBe('maintain');
  });

  it('micro-plate bracket: light isolation weights bump by 0.5/1 kg', () => {
    // 5 kg lateral raise, above ceiling, easy → big = 1 kg in the <10 bracket
    const h = historyOf(session('pull-1', [{ weight: 5, reps: 16, difficulty: 'easy', weightUnit: 'kg' }], T0));
    const r = rec(h, { repRange: '12-15' });
    expect(r.weight).toBe(6);
  });
});

// ── progressTrend ──────────────────────────────────────────────

describe('progressTrend', () => {
  it('empty history → empty trend', () => {
    const t = progressTrend({ history: {}, exerciseId: 'pull-1', variantKey: null, currentUnit: 'kg' });
    expect(t.points).toEqual([]);
    expect(t.delta).toBeNull();
  });

  it('single session → zero delta baseline', () => {
    const h = historyOf(session('pull-1', [{ weight: 40, reps: 10, weightUnit: 'kg' }], T0));
    const t = progressTrend({ history: h, exerciseId: 'pull-1', variantKey: null, currentUnit: 'kg' });
    expect(t.points).toHaveLength(1);
    expect(t.delta).toBe(0);
    expect(t.percentChange).toBe(0);
  });

  it('multi-session → chronological points + delta + percent', () => {
    const h = historyOf(
      session('pull-1', [{ weight: 40, reps: 10, weightUnit: 'kg' }], T0),
      session('pull-1', [{ weight: 50, reps: 10, weightUnit: 'kg' }], T0 + DAY * 7),
    );
    const t = progressTrend({ history: h, exerciseId: 'pull-1', variantKey: null, currentUnit: 'kg' });
    expect(t.points.map((p) => p.weight)).toEqual([40, 50]);
    expect(t.delta).toBe(10);
    expect(t.percentChange).toBe(25);
  });

  it('sessions arrive unsorted — trend still sorts by completedAt', () => {
    const later = session('pull-1', [{ weight: 50, reps: 10, weightUnit: 'kg' }], T0 + DAY * 7);
    const earlier = session('pull-1', [{ weight: 40, reps: 10, weightUnit: 'kg' }], T0);
    // Insert later first to prove ordering comes from timestamps, not keys.
    const h = historyOf(later, earlier);
    const t = progressTrend({ history: h, exerciseId: 'pull-1', variantKey: null, currentUnit: 'kg' });
    expect(t.points.map((p) => p.weight)).toEqual([40, 50]);
  });
});
