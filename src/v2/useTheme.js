import { useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';

// Persists & applies the v2 light/dark choice. Toggling adds/removes
// the `.light` class on the root .v2 container so every CSS var swaps.
export function useTheme() {
  // Default to 'light' — user explicitly wanted the lighter, softer
  // surface as the first impression. Aurora behind the warm glass
  // panels reads beautifully on the warm-white canvas.
  const [theme, setTheme] = useLocalStorage('atlas.v2theme', 'light');

  useEffect(() => {
    const root = document.querySelector('.v2');
    if (!root) return;
    if (theme === 'light') root.classList.add('light');
    else root.classList.remove('light');
  }, [theme]);

  return { theme, setTheme, toggle: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')) };
}
