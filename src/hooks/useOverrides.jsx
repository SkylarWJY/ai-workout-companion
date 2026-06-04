import { createContext, useContext, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage.js';

// All user overrides live in a single localStorage doc so a single
// "reset everything" wipes them. Structure:
//   overrides.profile = { bf, targetBf, goals: [], pullUpProgression: {...} }
//   overrides.exercise.{id} = {
//     suggestedWeight, currentWeight, goalWeight,
//     youtubeId,                                  // LEGACY: pre-v0.6 single-video override; still respected
//                                                 // when there is no per-variant override on the default tab
//     youtubeIdByVariant: { [variantKey]: 'ID' }, // NEW: per-variant video override map. Best Pick variants
//                                                 // are intentionally excluded (editorial lock).
//   }
//   overrides.warmup.{day} = { altYoutubeId }
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
