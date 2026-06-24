import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Dashboard from './components/Dashboard.jsx';
import WorkoutDay from './components/WorkoutDay.jsx';
import SettingsSheet from './components/SettingsSheet.jsx';
import { WORKOUTS } from './data/workoutData.js';
import { useLocalStorage } from './hooks/useLocalStorage.js';
import { useTheme } from './hooks/useTheme.js';
import { LanguageProvider, useT } from './i18n/index.jsx';
import { OverridesProvider } from './hooks/useOverrides.jsx';

// Derives the `YYYY-MM-DD` key for a given Date (or now), matching the
// pre-v0.8 todayKey() format that already lives in atlas.history.
function dateKeyFor(ts) {
  const d = ts ? new Date(ts) : new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// Count total logged sets across all exercises in a session.
function countSets(session) {
  if (!session?.completedSets) return 0;
  let n = 0;
  for (const arr of Object.values(session.completedSets)) {
    if (Array.isArray(arr)) n += arr.length;
  }
  return n;
}

// Lazy-load v2 so the v0.8 bundle stays unaffected — the v2 chunk only
// downloads when the gate trips. Production / root URL keeps shipping v1.
const AppV2 = React.lazy(() => import('./v2/AppV2.jsx'));

function useV2Gate() {
  // Two triggers: ?v=2 in the URL, or localStorage.atlas.theme === 'v2'.
  // URL takes precedence so testers can A/B without persisting state.
  const [on, setOn] = React.useState(() => {
    if (typeof window === 'undefined') return false;
    const url = new URL(window.location.href);
    const param = url.searchParams.get('v');
    if (param === '2') return true;
    if (param === '1') return false;
    try {
      return JSON.parse(localStorage.getItem('atlas.theme') || 'null') === 'v2';
    } catch { return false; }
  });
  React.useEffect(() => {
    // Listen for runtime toggles from inside the app.
    const handler = () => setOn((prev) => {
      try { return JSON.parse(localStorage.getItem('atlas.theme') || 'null') === 'v2'; }
      catch { return prev; }
    });
    window.addEventListener('storage', handler);
    window.addEventListener('atlas-theme-change', handler);
    return () => {
      window.removeEventListener('storage', handler);
      window.removeEventListener('atlas-theme-change', handler);
    };
  }, []);
  return on;
}

export default function App() {
  const v2 = useV2Gate();
  if (v2) {
    return (
      <React.Suspense fallback={<div className="v2 v2-screen" />}>
        <AppV2 />
      </React.Suspense>
    );
  }
  return (
    <LanguageProvider>
      <OverridesProvider>
        <Root />
      </OverridesProvider>
    </LanguageProvider>
  );
}

function Root() {
  useTheme(); // attach class
  const [view, setView] = useState('home'); // 'home' | 'workout'
  const [activeType, setActiveType] = useState(null);
  const [history, setHistory] = useLocalStorage('atlas.history', {});
  const [bodyStats] = useLocalStorage('atlas.bodyStats', { bf: 25, weight: null });
  const [activeSession, setActiveSession] = useLocalStorage('atlas.activeSession', null);

  const workout = activeType ? WORKOUTS[activeType] : null;

  useEffect(() => {
    if (view === 'workout' && !activeSession && workout) {
      setActiveSession({
        type: workout.id,
        startedAt: Date.now(),
        completedSets: {},
      });
    }
  }, [view, activeSession, workout, setActiveSession]);

  // AUTO-SAVE — every time activeSession changes with at least one logged
  // set, mirror it into atlas.history under the date-keyed slot. This
  // makes the data durable the moment the user records a set, so leaving
  // the workout (or closing the tab) without tapping "Complete" no
  // longer loses anything.
  //
  // Date key uses the session's startedAt so sessions that span midnight
  // (or that get resumed on a different day) still land in the right
  // calendar slot — using today's date here would corrupt the slot.
  useEffect(() => {
    if (!activeSession) return;
    if (countSets(activeSession) === 0) return;
    const id = `${dateKeyFor(activeSession.startedAt)}-${activeSession.type}`;
    setHistory((prev) => {
      const existing = prev[id];
      // Touch completedAt on every save so the entry shows up in
      // SessionHistorySheet (which filters by truthy completedAt).
      // The explicit completeWorkout() still bumps it to a final
      // timestamp on user tap, but the data is safe before then.
      return {
        ...prev,
        [id]: {
          ...activeSession,
          completedAt: Date.now(),
          dayIdx: existing?.dayIdx ?? (new Date().getDay() + 6) % 7,
        },
      };
    });
  }, [activeSession, setHistory]);

  // RECOVERY — runs once on mount. If atlas.activeSession holds data
  // from before v0.8 (when only "Complete Workout" wrote to history),
  // the auto-save effect above grabs it on its first render. Nothing
  // extra needed here; this comment documents the implicit recovery
  // path so future maintainers don't add a separate one and double-mirror.

  const openWorkout = (type) => {
    setActiveType(type);
    // Resume the live session only if it's the SAME type AND was
    // started on the SAME calendar day. A push session left running
    // overnight shouldn't accept tomorrow's sets under yesterday's date
    // key — that would file new training under the wrong day.
    const sessionIsToday =
      activeSession?.startedAt &&
      dateKeyFor(activeSession.startedAt) === dateKeyFor(Date.now());
    if (!activeSession || activeSession.type !== type || !sessionIsToday) {
      setActiveSession({
        type,
        startedAt: Date.now(),
        completedSets: {},
      });
    }
    setView('workout');
  };

  const exitWorkout = () => {
    setView('home');
  };

  const completeWorkout = () => {
    // Auto-save effect already covered every logged set. This is now
    // just the explicit "I'm done" gesture: refresh completedAt, then
    // tear down the active-session state so the user gets a clean
    // dashboard.
    if (activeSession && workout) {
      const id = `${dateKeyFor(activeSession.startedAt)}-${workout.id}`;
      setHistory((prev) => ({
        ...prev,
        [id]: {
          ...activeSession,
          ...(prev[id] || {}),
          ...activeSession, // local session wins over the auto-saved copy
          completedAt: Date.now(),
          dayIdx: (new Date().getDay() + 6) % 7,
        },
      }));
    }
    setActiveSession(null);
    setActiveType(null);
    setView('home');
  };

  return (
    <div className="min-h-screen bg-bone-50 dark:bg-ink-900 grain text-ink-900 dark:text-bone-100">
      <Header />
      <main className="max-w-md mx-auto relative">
        {view === 'workout' && workout && activeSession ? (
          <motion.div
            key={`workout-${workout.id}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <WorkoutDay
              workout={workout}
              session={activeSession}
              setSession={setActiveSession}
              onBack={exitWorkout}
              onComplete={completeWorkout}
            />
          </motion.div>
        ) : (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Dashboard
              history={history}
              bodyStats={bodyStats}
              onOpenWorkout={openWorkout}
            />
          </motion.div>
        )}
      </main>
    </div>
  );
}

function Header() {
  const t = useT();
  const [settingsOpen, setSettingsOpen] = useState(false);
  return (
    <>
      <header className="sticky top-0 z-20 pt-safe bg-bone-50/80 dark:bg-ink-900/80 backdrop-blur-xl border-b border-black/5 dark:border-white/5">
        <div className="max-w-md mx-auto px-5 h-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo />
            <span className="text-[15px] font-semibold tracking-tight text-ink-900 dark:text-bone-100">
              {t('appName')}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-ink-300">
              {t('appVersion')}
            </span>
          </div>
          <button
            onClick={() => setSettingsOpen(true)}
            aria-label={t('settings.title')}
            className="w-9 h-9 rounded-full bg-bone-100 dark:bg-ink-700 border border-black/5 dark:border-white/10 flex items-center justify-center active:scale-95 transition"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
              <path
                d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </header>
      <SettingsSheet open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}

function Logo() {
  return (
    <span className="w-6 h-6 rounded-lg bg-ink-900 dark:bg-bone-100 flex items-center justify-center text-bone-50 dark:text-ink-900 text-[11px] font-bold">
      A
    </span>
  );
}
