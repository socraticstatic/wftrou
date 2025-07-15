import { useState, useEffect } from 'react';

export function useTheme() {
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem('darkMode');
    if (stored !== null) return JSON.parse(stored);
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  return { darkMode, setDarkMode };
}