import React, { useEffect, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { LanguageProvider } from '../i18n/index.jsx';
import { OverridesProvider } from '../hooks/useOverrides.jsx';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { useTheme } from '../hooks/useTheme.js';
import { getWorkoutsForPlan } from '../data/workoutData.js';
import { useOverrides } from '../hooks/useOverrides.jsx';
import Dashboard from './screens/Dashboard.jsx';
import WorkoutDay from './screens/WorkoutDay.jsx';
import Confetti from './components/Confetti.jsx';
import { springs } from './theme.js';

function dateKeyFor(ts) {
  const d = ts ? new Date(ts) : new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function countSets(session) {
  if (!session?.completedSets) return 0;
  let n = 0;
  for (const arr of Object.values(session.completedSets)) {
    if (Array.isArray(arr)) n += arr.length;
  }
  return n;
}

export default function AppV2() {
  // Force dark theme inside v2 — OLED black is the canvas. Users who
  // want light mode can flip back to v0.8 via ?v=1.
  useEffect(() => {
    document.documentElement.classList.add('dark');
    return () => { /* leave it — v0.8 uses dark anyway */ };
  }, []);

  return (
    <LanguageProvider>
      <OverridesProvider>
        <Root />
      </OverridesProvider>
    </LanguageProvider>
  );
}

function Root() {
  useTheme();
  const [view, setView] = useState('home'); // 'home' | 'workout'
  const [activeType, setActiveType] = useState(null);
  const [history, setHistory] = useLocalStorage('atlas.history', {});
  const [activeSession, setActiveSession] = useLocalStorage('atlas.activeSession', null);
  const [confettiActive, setConfettiActive] = useState(false);

  const { overrides } = useOverrides();
  const WORKOUTS = getWorkoutsForPlan(overrides.plan?.active);
  const workout = activeType ? WORKOUTS[activeType] : null;

  // Same auto-save pattern as v0.8 Root — every logged set persists into
  // history immediately, so leaving the workout screen never costs data.
  useEffect(() => {
    if (!activeSession) return;
    if (countSets(activeSession) === 0) return;
    const id = `${dateKeyFor(activeSession.startedAt)}-${activeSession.type}`;
    setHistory((prev) => {
      const existing = prev[id];
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

  const openWorkout = (type) => {
    setActiveType(type);
    const sessionIsToday =
      activeSession?.startedAt &&
      dateKeyFor(activeSession.startedAt) === dateKeyFor(Date.now());
    if (!activeSession || activeSession.type !== type || !sessionIsToday) {
      setActiveSession({ type, startedAt: Date.now(), completedSets: {} });
    }
    setView('workout');
  };

  const exitWorkout = () => setView('home');

  const completeWorkout = () => {
    if (activeSession && workout) {
      const id = `${dateKeyFor(activeSession.startedAt)}-${workout.id}`;
      setHistory((prev) => ({
        ...prev,
        [id]: {
          ...activeSession,
          ...(prev[id] || {}),
          ...activeSession,
          completedAt: Date.now(),
          dayIdx: (new Date().getDay() + 6) % 7,
        },
      }));
    }
    // Only fire confetti when at least one set was logged — preventing
    // the burst from playing when the user ends an empty session.
    if (countSets(activeSession) > 0) {
      setConfettiActive(true);
      setTimeout(() => setConfettiActive(false), 3600);
    }
    setActiveSession(null);
    setActiveType(null);
    setView('home');
  };

  return (
    <div className="v2 min-h-[100dvh] w-full">
      <LayoutGroup>
        <div className="max-w-md mx-auto relative">
          {view === 'workout' && workout && activeSession ? (
            <motion.div
              key={`workout-${workout.id}`}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={springs.page}
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
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={springs.page}
            >
              <Dashboard history={history} onOpenWorkout={openWorkout} />
            </motion.div>
          )}
        </div>
      </LayoutGroup>
      <Confetti active={confettiActive} />
    </div>
  );
}
