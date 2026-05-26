import React, { createContext, useContext, useCallback } from 'react';
import { STRINGS } from './strings.js';
import { EXERCISES_ZH } from './exercisesZh.js';
import { WORKOUTS_ZH } from './workoutsZh.js';
import { useLocalStorage } from '../hooks/useLocalStorage.js';

const LanguageContext = createContext({
  lang: 'en',
  setLang: () => {},
  t: (k) => k,
});

export function LanguageProvider({ children }) {
  const [lang, setLang] = useLocalStorage('atlas.lang', 'en');

  const t = useCallback(
    (key, fallback) => {
      const dict = STRINGS[lang] || STRINGS.en;
      if (key in dict) return dict[key];
      if (fallback != null) return fallback;
      return STRINGS.en[key] ?? key;
    },
    [lang],
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}

export function useT() {
  return useContext(LanguageContext).t;
}

// Pull a localized field off an exercise.
// Falls back to English value if no ZH translation exists.
export function locEx(exercise, field, lang) {
  if (lang !== 'zh') return exercise[field];
  const zh = EXERCISES_ZH[exercise.id]?.[field];
  if (zh != null) return zh;
  return exercise[field];
}

export function locWorkout(workout, field, lang) {
  if (lang !== 'zh') return workout[field];
  const zh = WORKOUTS_ZH[workout.id]?.[field];
  if (zh != null) return zh;
  return workout[field];
}
