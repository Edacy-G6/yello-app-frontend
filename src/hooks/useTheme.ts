import { useEffect } from 'react';
import { useThemeStore } from '../store/useThemeStore';
import { THEMES } from '../constants';

export function useTheme() {
  const { theme, setTheme, toggleTheme } = useThemeStore();

  useEffect(() => {
    const root = window.document.documentElement;
    
    if (theme === THEMES.SYSTEM) {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? THEMES.DARK
        : THEMES.LIGHT;
      root.classList.remove(THEMES.LIGHT, THEMES.DARK);
      root.classList.add(systemTheme);
    } else {
      root.classList.remove(THEMES.LIGHT, THEMES.DARK);
      root.classList.add(theme);
    }
  }, [theme]);

  return { theme, setTheme, toggleTheme };
}
