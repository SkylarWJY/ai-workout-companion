import React from 'react';
import { useLang } from '../../i18n/index.jsx';
import { useOverrides } from '../../hooks/useOverrides.jsx';
import { getWorkoutsForPlan } from '../../data/workoutData.js';
import { locWorkout, locEx } from '../../i18n/index.jsx';

// v3 WorkoutDay — stub that uses v2's data layer so taps don't crash.
// The neon aesthetic comes through via the v3-card / v3-pill tokens.
export default function WorkoutDay({ type, onBack }) {
  const { lang } = useLang();
  const { overrides } = useOverrides();
  const workouts = getWorkoutsForPlan(overrides.plan?.active || 'default');
  const workout = type ? workouts[type] : null;

  if (!workout) {
    return (
      <main style={{ padding: 24, color: 'var(--c-text-2)' }}>
        <button className="v3-pill is-light" onClick={onBack}>← Back</button>
      </main>
    );
  }

  return (
    <main style={{ padding: '20px 18px 110px', maxWidth: 480, margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <button className="v3-iconbtn" aria-label="Back" onClick={onBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12l6-6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div style={{ fontWeight: 700, fontSize: 16 }}>
          {locWorkout(workout, 'title', lang)}
        </div>
        <div style={{ width: 40 }} />
      </header>

      <div className="v3-label" style={{ marginBottom: 8 }}>
        {locWorkout(workout, 'subtitle', lang)}
      </div>

      {workout.exercises.map((ex, i) => (
        <div key={ex.id} className="v3-card" style={{ padding: '16px 18px', marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
            <div>
              <div style={{ color: 'var(--c-accent)', fontSize: 12, fontWeight: 700, letterSpacing: '0.06em' }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <div style={{ fontWeight: 700, fontSize: 16, marginTop: 4 }}>
                {locEx(ex, 'name', lang)}
              </div>
              <div style={{ color: 'var(--c-text-2)', fontSize: 12, marginTop: 4 }}>
                {ex.sets} × {ex.repsLow}–{ex.repsHigh}
                {ex.rest ? ` · ${ex.rest}s rest` : ''}
              </div>
            </div>
          </div>
        </div>
      ))}
    </main>
  );
}
