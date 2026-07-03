// Cross-file consistency validator for exercise data.
//
// Exercise truth is split across four modules (coachPlans / workoutData /
// exerciseMeta / demoMap). Editing one and forgetting another has caused
// real production bugs — e.g. renaming s-push-3 from Reverse Pec Deck to
// Incline DB Press in coachPlans while the fallback video map still
// pointed at the rear-delt clip. This validator runs in prebuild and
// fails the build on that whole class of drift.
//
// Checks:
//   1. Every Skylar exercise id has a SKYLAR_TUTORIAL_FALLBACKS entry,
//      and every fallback entry maps to a real exercise (no orphans).
//   2. Every exercise resolves to at least one playable video
//      (meta youtubeId, fallback, or a variant with youtubeId).
//   3. Within one exercise, variant youtubeIds are distinct — three
//      chips pointing at one video is a lie the user already caught once.
//   4. Skylar plan content is fully bilingual: nameZh, whyItMattersZh,
//      howToZh, tipsZh, commonMistakesZh present on every exercise.
//   5. Every variant carries a labelZh.

import { PLANS } from '../src/data/workoutData.js';
import { SKYLAR_TUTORIAL_FALLBACKS } from '../src/data/coachPlans.js';
import { exerciseMeta } from '../src/data/exerciseMeta.js';
import { demoVariants } from '../src/data/demoMap.js';
import { STRINGS } from '../src/i18n/strings.js';

const errors = [];

const allExercises = [];
for (const plan of Object.values(PLANS)) {
  for (const workout of Object.values(plan.workouts)) {
    for (const ex of workout.exercises || []) {
      allExercises.push({ ex, planId: plan.id, workoutId: workout.id });
    }
  }
}
const skylarExercises = allExercises.filter(({ ex }) => ex.id.startsWith('s-'));
const knownIds = new Set(allExercises.map(({ ex }) => ex.id));

// 1 — fallback map ↔ plan exercise ids, both directions
for (const { ex } of skylarExercises) {
  if (!SKYLAR_TUTORIAL_FALLBACKS[ex.id]) {
    errors.push(`[fallback-missing] ${ex.id} (${ex.name}) has no SKYLAR_TUTORIAL_FALLBACKS entry`);
  }
}
for (const id of Object.keys(SKYLAR_TUTORIAL_FALLBACKS)) {
  if (!knownIds.has(id)) {
    errors.push(`[fallback-orphan] SKYLAR_TUTORIAL_FALLBACKS['${id}'] points at an exercise that no longer exists`);
  }
}

// 2 — every exercise has a playable video somewhere
for (const { ex, planId } of allExercises) {
  const meta = exerciseMeta(ex.id) || {};
  const variants = demoVariants(ex.id) || [];
  const hasVideo = !!meta.youtubeId || variants.some((v) => v.youtubeId);
  if (!hasVideo) {
    errors.push(`[no-video] ${ex.id} (${ex.name}, plan=${planId}) resolves to no video at all`);
  }
}

// 3 — variant videos distinct within one exercise
for (const { ex } of allExercises) {
  const variants = demoVariants(ex.id) || [];
  const withIds = variants.filter((v) => v.youtubeId);
  const seen = new Map();
  for (const v of withIds) {
    if (seen.has(v.youtubeId)) {
      errors.push(
        `[dup-video] ${ex.id}: variants '${seen.get(v.youtubeId)}' and '${v.key}' share youtubeId ${v.youtubeId}`,
      );
    } else {
      seen.set(v.youtubeId, v.key);
    }
  }
}

// 4 — Skylar bilingual completeness
const ZH_FIELDS = ['nameZh', 'whyItMattersZh', 'howToZh', 'tipsZh', 'commonMistakesZh'];
for (const { ex } of skylarExercises) {
  for (const f of ZH_FIELDS) {
    const v = ex[f];
    const missing = v == null || (Array.isArray(v) && v.length === 0) || v === '';
    if (missing) errors.push(`[zh-missing] ${ex.id} (${ex.name}) lacks ${f}`);
  }
}

// 5 — every variant chip readable in Chinese. The modal resolves
// labelZh first and falls back to the STRINGS dictionary key
// `variant.{key}` — a variant is only broken when BOTH are absent.
for (const { ex } of allExercises) {
  for (const v of demoVariants(ex.id) || []) {
    const dictCovered = !!STRINGS.zh?.[`variant.${v.key}`];
    if (!v.labelZh && !dictCovered) {
      errors.push(`[zh-missing] ${ex.id} variant '${v.key}' has neither labelZh nor STRINGS.zh['variant.${v.key}']`);
    }
  }
}

if (errors.length) {
  console.error(`✗ exercise data drift — ${errors.length} issue(s):\n`);
  for (const e of errors) console.error('  ' + e);
  process.exit(1);
}
console.log(`✓ exercise data consistent (${allExercises.length} exercises, ${skylarExercises.length} Skylar, 5 checks)`);
