import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Theme } from '../types';
import { STORAGE_KEYS, THEMES } from '../constants';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: THEMES.SYSTEM,
      
      setTheme: (theme) => set({ theme }),
      
      toggleTheme: () => {
        const { theme } = get();
        let newTheme: Theme;
        
        if (theme === THEMES.LIGHT) {
          newTheme = THEMES.DARK;
        } else if (theme === THEMES.DARK) {
          newTheme = THEMES.SYSTEM;
        } else {
          newTheme = THEMES.LIGHT;
        }
        
        set({ theme: newTheme });
      },
    }),
    {
      name: STORAGE_KEYS.THEME,
    }
  )
);
