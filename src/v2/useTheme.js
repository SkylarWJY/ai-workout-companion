import { useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';

// Persists & applies the v2 theme. Three states: 'light' | 'dark' | 'neon'.
// Class on the root .v2 container determines which CSS-var set wins.
const THEMES = ['light', 'dark', 'neon'];

export function useTheme() {
  // Default 'light' — soft warm-white aurora is the first-impression
  // surface. User cycles through light → dark → neon → light from the
  // nav toggle.
  const [theme, setTheme] = useLocalStorage('atlas.v2theme', 'light');

  useEffect(() => {
    const root = document.querySelector('.v2');
    if (!root) return;
    root.classList.remove('light', 'neon');
    if (theme === 'light' || theme === 'neon') root.classList.add(theme);
  }, [theme]);

  const cycle = () => setTheme((t) => {
    const i = THEMES.indexOf(t);
    return THEMES[(i + 1) % THEMES.length] || 'light';
  });

  return { theme, setTheme, toggle: cycle };
}
