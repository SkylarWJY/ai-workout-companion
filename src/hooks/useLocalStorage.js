import { useEffect, useState } from 'react';

export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null || raw === undefined) return initial;
      return JSON.parse(raw);
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* swallow */
    }
  }, [key, value]);

  return [value, setValue];
}
