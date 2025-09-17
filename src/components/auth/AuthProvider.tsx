import { useEffect, type ReactNode } from 'react';
import { useAuth } from '../../hooks/useAuth';
import type { UserRole } from '../../types';
import { AuthContext, type AuthContextType } from '../../contexts/AuthContext';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuth();

  // Vérifier l'authentification au chargement de l'application
  useEffect(() => {
    const checkAuth = async () => {
      await auth.checkAuthStatus();
    };
    
    checkAuth();
  }, [auth]);

  const contextValue: AuthContextType = {
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    error: auth.error,
    login: async (email: string, password: string, rememberMe?: boolean) => {
      await auth.login({ email, password, rememberMe: rememberMe ?? false });
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

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

