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

  // setOverride('profile', null, 'bf', 24)
  // setOverride('exercise', 'leg-1', 'currentWeight', '60 lb')
  const setOverride = useCallback(
    (scope, id, field, value) => {
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

  return (
    <OverridesContext.Provider
      value={{
        overrides,
        setOverride,
        clearOverride,
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
