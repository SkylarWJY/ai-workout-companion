import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Dashboard from './components/Dashboard.jsx';
import WorkoutDay from './components/WorkoutDay.jsx';
import SettingsSheet from './components/SettingsSheet.jsx';
import { WORKOUTS } from './data/workoutData.js';
import { useLocalStorage } from './hooks/useLocalStorage.js';
import { useTheme } from './hooks/useTheme.js';
import { todayKey } from './utils/format.js';
import { LanguageProvider, useT } from './i18n/index.jsx';
import { OverridesProvider } from './hooks/useOverrides.jsx';

export default function App() {
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

  const openWorkout = (type) => {
    setActiveType(type);
    if (!activeSession || activeSession.type !== type) {
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
    if (activeSession && workout) {
      const id = `${todayKey()}-${workout.id}`;
      setHistory({
        ...history,
        [id]: {
          ...activeSession,
          completedAt: Date.now(),
          dayIdx: (new Date().getDay() + 6) % 7,
        },
      });
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
