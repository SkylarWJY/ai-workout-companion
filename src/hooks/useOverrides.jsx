import { createContext, useContext, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage.js';

// All user overrides live in a single localStorage doc so a single
// "reset everything" wipes them. Structure:
//   overrides.profile = { bf, targetBf, goals: [], pullUpProgression: {...} }
//   overrides.exercise.{id} = {
//     sets, repRange, restSeconds,             // programming knobs (v0.7+) — let users
//                                              // restructure the lift without forking the source
//     suggestedWeight, currentWeight, goalWeight,
//     youtubeId,                                  // LEGACY: pre-v0.6 single-video override; still respected
//                                                 // when there is no per-variant override on the default tab
//     youtubeIdByVariant: { [variantKey]: 'ID' }, // per-variant video override map (v0.6.1+)
//     localVideoByVariant: {                      // per-variant LOCAL upload metadata (v0.7+)
//       [variantKey]: { filename, size, type, mtime } // blob itself lives in IndexedDB at `exercise::{id}::{key}`
//     },
//     // Best Pick variants are intentionally excluded from BOTH youtubeIdByVariant
//     // and localVideoByVariant (editorial lock).
//   }
//   overrides.warmup.{day} = {
//     youtubeId,                              // YouTube link replacement (wins over the bundled MOV)
//     localVideo: { filename, size, type, mtime }, // local upload metadata; blob in IndexedDB
//                                             // at `warmup::{day}::main`. Wins over youtubeId.
//     altYoutubeId,                           // LEGACY: the "watch alternate" link that's always been
//                                             // surfaced under the player; still respected
//   }
//   overrides.order.{workoutId} = [exerciseId, exerciseId, ...]
//   overrides.customExercises.{id} = {                  // v0.8+ — user-added lifts
//     id, workoutId, name, primaryMuscles[], secondaryMuscles[],
//     sets, repRange, restSeconds, suggestedWeight, priority, youtubeId,
//   }
//   overrides.weightUnit = 'lb' | 'kg'

const OverridesContext = createContext({
  overrides: {},
  setOverride: () => {},
  resetAll: () => {},
  weightUnit: 'lb',
  setWeightUnit: () => {},
});

export function OverridesProvider({ children }) {
  const [overrides, setOverrides] = useLocalStorage('atlas.overrides', {});
  const [weightUnit, setWeightUnit] = useLocalStorage('atlas.weightUnit', 'lb');

  // Generic setOverride — kept for back-compat with existing callsites,
  // but now has a runtime guard: writing (scope, null, null, value)
  // used to silently create `{ "null": value }` (the black-screen bug
  // that crashed the weekly-split editor). All new code should use
  // setTopLevel / setExerciseField / setProfileField / setFlag below
  // instead — those are shape-safe by construction.
  //
  //   setOverride('profile',  null,     'bf',            24)
  //   setOverride('exercise', 'leg-1',  'currentWeight', '60 lb')
  const setOverride = useCallback(
    (scope, id, field, value) => {
      if (id == null && field == null) {
        // eslint-disable-next-line no-console
        console.error(
          `setOverride('${scope}', null, null, value) is unsafe — ` +
            `it stores { "null": value } and crashes .map()/.filter() ` +
            `on the next render. Use setTopLevel('${scope}', value).`,
        );
        return;
      }
      setOverrides((prev) => {
        const next = { ...prev };
        if (!next[scope]) next[scope] = {};
        if (id == null) {
          next[scope] = { ...next[scope], [field]: value };
        } else {
          next[scope] = {
            ...next[scope],
            [id]: { ...(next[scope][id] || {}), [field]: value },
          };
        }
        return next;
      });
    },
    [setOverrides],
  );

  // ─── Typed setters — prefer these in new code ────────────────
  // Every callsite reads at a glance which slot it's writing, and
  // the shape can't be miswired because the function name pins it.

  // overrides.exercise.{id}.{field}
  const setExerciseField = useCallback(
    (exerciseId, field, value) => {
      setOverrides((prev) => {
        const next = { ...prev };
        const scope = { ...(next.exercise || {}) };
        scope[exerciseId] = { ...(scope[exerciseId] || {}), [field]: value };
        next.exercise = scope;
        return next;
      });
    },
    [setOverrides],
  );

  // overrides.profile.{field}
  const setProfileField = useCallback(
    (field, value) => {
      setOverrides((prev) => ({
        ...prev,
        profile: { ...(prev.profile || {}), [field]: value },
      }));
    },
    [setOverrides],
  );

  // overrides.order.{workoutId} = arr
  const setWorkoutOrder = useCallback(
    (workoutId, exerciseIds) => {
      setOverrides((prev) => ({
        ...prev,
        order: { ...(prev.order || {}), [workoutId]: exerciseIds },
      }));
    },
    [setOverrides],
  );

  // overrides.plan.active = planId
  const setActivePlan = useCallback(
    (planId) => {
      setOverrides((prev) => ({
        ...prev,
        plan: { ...(prev.plan || {}), active: planId },
      }));
    },
    [setOverrides],
  );

  // Flag-style: overrides.{scope}.{key} = value.
  // For warmupDone, cooldownDone, lastVariant, customExercises — any
  // scope that's a flat dict of {key: value}.
  const setFlag = useCallback(
    (scope, key, value) => {
      setOverrides((prev) => ({
        ...prev,
        [scope]: { ...(prev[scope] || {}), [key]: value },
      }));
    },
    [setOverrides],
  );

  const clearOverride = useCallback(
    (scope, id, field) => {
      setOverrides((prev) => {
        const next = { ...prev };
        if (id == null) {
          if (next[scope]) {
            const copy = { ...next[scope] };
            delete copy[field];
            next[scope] = copy;
          }
        } else if (next[scope]?.[id]) {
          const copy = { ...next[scope][id] };
          delete copy[field];
          next[scope] = { ...next[scope], [id]: copy };
        }
        return next;
      });
    },
    [setOverrides],
  );

  const resetAll = useCallback(() => setOverrides({}), [setOverrides]);

  // Writes a whole top-level value (e.g. an array of weekly-split entries).
  // setOverride() can't do this — its (scope, id, field, value) shape
  // always treats the slot as a nested record, so a top-level array
  // becomes an object keyed by "null" and downstream consumers crash.
  const setTopLevel = useCallback(
    (key, value) => {
      setOverrides((prev) => {
        const next = { ...prev };
        if (value == null) delete next[key];
        else next[key] = value;
        return next;
      });
    },
    [setOverrides],
  );

  return (
    <OverridesContext.Provider
      value={{
        overrides,
        setOverride,
        clearOverride,
        setTopLevel,
        // typed setters — prefer these
        setExerciseField,
        setProfileField,
        setWorkoutOrder,
        setActivePlan,
        setFlag,
        resetAll,
        weightUnit,
        setWeightUnit,
      }}
    >
      {children}
    </OverridesContext.Provider>
  );
}

export function useOverrides() {
  return useContext(OverridesContext);
}

// Helper to read an override with fallback
export function getOverride(overrides, scope, id, field) {
  if (id == null) return overrides?.[scope]?.[field];
  return overrides?.[scope]?.[id]?.[field];
}

// Merges the per-exercise overrides on top of a base exercise object so
// downstream readers (cards, modal, logger, rest timer) all see one
// consistent "effective" exercise. Only fields the user can actually
// edit are merged — content / muscles / priority / variant-specific data
// stay editorial.
const EDITABLE_PROGRAM_FIELDS = ['sets', 'repRange', 'restSeconds', 'tempo'];
export function applyExerciseOverrides(ex, ov) {
  if (!ov) return ex;
  let merged = ex;
  let mutated = false;
  for (const field of EDITABLE_PROGRAM_FIELDS) {
    if (ov[field] !== undefined && ov[field] !== null && ov[field] !== '') {
      if (!mutated) {
        merged = { ...ex };
        mutated = true;
      }
      merged[field] = ov[field];
    }
  }
  if (ov.suggestedWeight) {
    if (!mutated) {
      merged = { ...ex };
      mutated = true;
    }
    merged.suggestedWeight = ov.suggestedWeight;
  }
  return merged;
}
