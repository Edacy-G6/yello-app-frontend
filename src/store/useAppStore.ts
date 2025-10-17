import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser, Theme } from '../types';
import { STORAGE_KEYS } from '../constants';

interface AppState {
  // User state
  user: AuthUser | null;
  isAuthenticated: boolean;
  
  // UI state
  theme: Theme;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: AuthUser | null) => void;
  setTheme: (theme: Theme) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  logout: () => void;
  initializeAuth: () => void;
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

      // Action pour initialiser l'état depuis localStorage
      initializeAuth: () => {
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        const userData = localStorage.getItem(STORAGE_KEYS.USER);
        
        if (token && userData) {
          try {
            const user = JSON.parse(userData);
            set({ 
              user, 
              isAuthenticated: true 
            });
          } catch (error) {
            console.error('Erreur lors du parsing des données utilisateur:', error);
            // Nettoyer les données corrompues
            localStorage.removeItem(STORAGE_KEYS.TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER);
            localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
          }
        }
      },
    }),
    {
      name: STORAGE_KEYS.USER,
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
      // Callback appelé après la réhydratation
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Vérifier la cohérence entre localStorage et store
          const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
          if (!token && state.isAuthenticated) {
            // Token manquant mais utilisateur marqué comme connecté
            state.setUser(null);
          } else if (token && !state.isAuthenticated && state.user) {
            // Token présent mais utilisateur pas marqué comme connecté
            state.setUser(state.user);
          }
        }
      },
    }
  )
);
