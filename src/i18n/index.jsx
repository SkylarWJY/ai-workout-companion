import React, { createContext, useContext, useCallback, useEffect } from 'react';
import { STRINGS } from './strings.js';
import { EXERCISES_ZH } from './exercisesZh.js';
import { WORKOUTS_ZH } from './workoutsZh.js';
import { COOLDOWNS_ZH } from './warmCoolZh.js';
import { useLocalStorage } from '../hooks/useLocalStorage.js';

const LanguageContext = createContext({
  lang: 'zh',
  setLang: () => {},
  t: (k) => k,
});

// First-load default: Chinese, unless the browser explicitly reports
// an English locale. Existing users with a stale 'en' from an earlier
// build get a one-time migration via the v2 lang flip below — they
// can still toggle back to English from the nav badge.
const initialLang = (() => {
  if (typeof navigator === 'undefined') return 'zh';
  return /^en\b/i.test(navigator.language || '') ? 'en' : 'zh';
})();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useLocalStorage('atlas.lang', initialLang);

  // One-time migration: older installs stored 'en' as the hard-coded
  // default before this build. If the user is on a non-English
  // browser and the lang flag was never confirmed, flip them to zh
  // exactly once. Keyed by a separate localStorage flag so a deliberate
  // EN choice survives the migration.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const migrated = localStorage.getItem('atlas.langMigratedV2');
      if (migrated) return;
      localStorage.setItem('atlas.langMigratedV2', '1');
      const langPref = (navigator.language || '').toLowerCase();
      if (!/^en/.test(langPref) && lang === 'en') setLang('zh');
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
// Resolution order for Chinese:
//   1. Inline `${field}Zh` on the exercise itself (coach-plan data
//      stores translations alongside the source)
//   2. EXERCISES_ZH dictionary (default-plan exercises live here)
//   3. English fallback
export function locEx(exercise, field, lang) {
  if (lang !== 'zh') return exercise[field];
  const inline = exercise?.[`${field}Zh`];
  if (inline != null) return inline;
  const zh = EXERCISES_ZH[exercise.id]?.[field];
  if (zh != null) return zh;
  return exercise[field];
}

export function locWorkout(workout, field, lang) {
  if (lang !== 'zh') return workout[field];
  const inline = workout?.[`${field}Zh`];
  if (inline != null) return inline;
  const zh = WORKOUTS_ZH[workout.id]?.[field];
  if (zh != null) return zh;
  return workout[field];
}

export function locStretch(stretch, field, lang) {
  if (lang !== 'zh') return stretch[field];
  const zh = COOLDOWNS_ZH[stretch.id]?.[field];
  if (zh != null) return zh;
  return stretch[field];
}
