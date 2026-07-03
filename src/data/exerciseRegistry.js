// Single read API for everything the app knows about an exercise.
//
// The underlying data is still physically split across four modules
// (historical layout — see the validator in scripts/validate-exercises.mjs
// that keeps them consistent at build time):
//
//   workoutData.js / coachPlans.js  → programming (sets/reps/rest) + content
//   exerciseMeta.js                 → tempo, cues, default youtubeId
//   demoMap.js                      → variants (tools, per-variant videos)
//
// New code should resolve exercises through getExerciseBundle() instead
// of importing those modules directly — one import, one shape, and when
// the data eventually moves to file-per-exercise the callsites won't
// change.

import { PLANS } from './workoutData.js';
import { exerciseMeta } from './exerciseMeta.js';
import { demoVariants } from './demoMap.js';

// Flattens every exercise in every plan into { [id]: { exercise, planId, workoutId } }.
let _index = null;
function buildIndex() {
  if (_index) return _index;
  _index = {};
  for (const plan of Object.values(PLANS)) {
    for (const workout of Object.values(plan.workouts)) {
      for (const ex of workout.exercises || []) {
        // First plan wins on duplicate ids (default before skylar);
        // ids are namespaced (s-*) so collisions shouldn't happen.
        if (!_index[ex.id]) {
          _index[ex.id] = { exercise: ex, planId: plan.id, workoutId: workout.id };
        }
      }
    }
  }
  return _index;
}

// Everything about one exercise, resolved. Returns null for unknown ids.
export function getExerciseBundle(exerciseId) {
  const entry = buildIndex()[exerciseId];
  if (!entry) return null;
  const meta = exerciseMeta(exerciseId) || {};
  const variants = demoVariants(exerciseId) || [];
  return {
    id: exerciseId,
    planId: entry.planId,
    workoutId: entry.workoutId,
    exercise: entry.exercise,
    meta,
    variants,
    // The video that shows when no variant is selected.
    defaultVideoId:
      meta.youtubeId || variants.find((v) => v.youtubeId)?.youtubeId || null,
  };
}

// All exercise ids across all plans — the validator iterates this.
export function allExerciseIds() {
  return Object.keys(buildIndex());
}
