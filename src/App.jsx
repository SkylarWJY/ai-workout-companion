import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Dashboard from './components/Dashboard.jsx';
import WorkoutDay from './components/WorkoutDay.jsx';
import DarkModeToggle from './components/DarkModeToggle.jsx';
import LanguageToggle from './components/LanguageToggle.jsx';
import { WORKOUTS } from './data/workoutData.js';
import { useLocalStorage } from './hooks/useLocalStorage.js';
import { useTheme } from './hooks/useTheme.js';
import { todayKey } from './utils/format.js';
import { LanguageProvider, useT } from './i18n/index.jsx';

export default function App() {
  return (
    <LanguageProvider>
      <Root />
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
  return (
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
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <DarkModeToggle />
        </div>
      </div>
    </header>
  );
}

function Logo() {
  return (
    <span className="w-6 h-6 rounded-lg bg-ink-900 dark:bg-bone-100 flex items-center justify-center text-bone-50 dark:text-ink-900 text-[11px] font-bold">
      A
    </span>
  );
}
