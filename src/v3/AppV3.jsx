import React from 'react';
import './tokens.css';
import { LanguageProvider } from '../i18n/index.jsx';
import { OverridesProvider } from '../hooks/useOverrides.jsx';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import Dashboard from './screens/Dashboard.jsx';
import WorkoutDay from './screens/WorkoutDay.jsx';

export default function AppV3() {
  return (
    <LanguageProvider>
      <OverridesProvider>
        <Root />
      </OverridesProvider>
    </LanguageProvider>
  );
}

function Root() {
  const [view, setView] = React.useState('home');
  const [activeType, setActiveType] = React.useState(null);
  const [activeSession, setActiveSession] = useLocalStorage('atlas.activeSession', null);

  return (
    <div className="v3 v3-screen">
      {view === 'home' && (
        <Dashboard
          onStart={(type) => {
            setActiveType(type);
            setActiveSession({ type, startedAt: Date.now(), completedSets: {} });
            setView('workout');
          }}
        />
      )}
      {view === 'workout' && (
        <WorkoutDay
          type={activeType}
          onBack={() => setView('home')}
        />
      )}
    </div>
  );
}
