import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Theme } from '../types';
import { STORAGE_KEYS } from '../constants';

interface AppState {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  
  // UI state
  theme: Theme;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setTheme: (theme: Theme) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  logout: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      theme: 'system',
      isLoading: false,
      error: null,

      // Actions
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user 
      }),
      
      setTheme: (theme) => set({ theme }),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      setError: (error) => set({ error }),
      
      clearError: () => set({ error: null }),
      
      logout: () => set({ 
        user: null, 
        isAuthenticated: false,
        error: null 
      }),
    }),
    {
      name: STORAGE_KEYS.USER,
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
