import { useEffect, useState, type ReactNode } from 'react';
import { useAuth } from '../../hooks/useAuth';
import type { UserRole } from '../../types';
import { AuthContext, type AuthContextType } from '../../contexts/AuthContext';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);

  // Vérifier l'authentification au chargement de l'application
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await auth.checkAuthStatus();
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de l\'authentification:', error);
      } finally {
        setIsInitialized(true);
      }
    };
    
    initializeApp();
  }, []); // Pas de dépendances pour éviter les re-renders

  const contextValue: AuthContextType = {
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    error: auth.error,
    login: async (email: string, password: string) => {
      await auth.login({ email, password });
    },
    register: async (userData) => {
      await auth.register({
        ...userData,
        role: userData.role as UserRole
      });
    },
    logout: auth.logout,
    clearError: auth.clearError,
  };

  // Afficher un indicateur de chargement pendant l'initialisation
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

