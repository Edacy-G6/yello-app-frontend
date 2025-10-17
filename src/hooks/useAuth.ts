import { useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import { authService } from '../services/authService';
import type { AuthUser, LoginData, RegisterData } from '../types';
import { STORAGE_KEYS } from '../constants';

export function useAuth() {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    error,
    setUser, 
    setLoading, 
    setError, 
    clearError,
    logout: storeLogout,
    initializeAuth
  } = useAppStore();

  const login = useCallback(async (loginData: LoginData) => {
    setLoading(true);
    clearError();

    try {
      const response = await authService.login(loginData);
      const authUser = response.data.user;

      // Les tokens sont déjà sauvegardés par authService.login()
      setUser(authUser);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de connexion';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setUser, setLoading, setError, clearError]);

  const register = useCallback(async (registerData: RegisterData) => {
    setLoading(true);
    clearError();

    try {
      const response = await authService.register(registerData);
      const authUser = response.data.user;

      // Ne pas définir l'utilisateur comme connecté lors de l'inscription
      // L'utilisateur doit se connecter après l'inscription
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur d\'inscription';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, clearError]);

  const logout = useCallback(async () => {
    setLoading(true);
    clearError();

    try {
      if (user?.token) {
        await authService.logout();
      }
    } catch (error) {
      // Même en cas d'erreur, on déconnecte l'utilisateur localement
      console.warn('Erreur lors de la déconnexion:', error);
    } finally {
      // Suppression des tokens du localStorage
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      
      storeLogout();
      setLoading(false);
    }
  }, [user?.token, storeLogout, setLoading, clearError]);

  const refreshToken = useCallback(async () => {
    if (!user?.refreshToken) {
      throw new Error('Aucun refresh token disponible');
    }

    try {
      const response = await authService.refreshToken(user.refreshToken);
      const newToken = response.data.token;

      // Mise à jour du token
      localStorage.setItem(STORAGE_KEYS.TOKEN, newToken);
      
      if (user) {
        const updatedUser: AuthUser = {
          ...user,
          token: newToken,
          updatedAt: new Date(),
        };
        setUser(updatedUser);
      }

      return newToken;
    } catch (error) {
      // Si le refresh échoue, on déconnecte l'utilisateur
      await logout();
      throw error;
    }
  }, [user, setUser, logout]);

  const checkAuthStatus = useCallback(async () => {
    setLoading(true);
    
    try {
      // D'abord, initialiser depuis localStorage
      initializeAuth();
      
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const userData = localStorage.getItem(STORAGE_KEYS.USER);
      
      if (!token) {
        setLoading(false);
        return false;
      }

      // Si on a un token et des données utilisateur, on peut considérer l'utilisateur comme connecté
      // et essayer de vérifier avec le serveur en arrière-plan
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          
          // Vérifier avec le serveur en arrière-plan (sans bloquer l'UI)
          authService.getCurrentUser()
            .then(response => {
              if (response.success) {
                setUser(response.data);
              } else {
                console.warn('Token invalide côté serveur, déconnexion.');
                logout();
              }
            })
            .catch(error => {
              console.warn('Erreur lors de la vérification serveur, déconnexion.', error);
              logout();
            });
          
          setLoading(false);
          return true;
        } catch (parseError) {
          console.error('Erreur lors du parsing des données utilisateur:', parseError);
          // Données corrompues, on nettoie
          localStorage.removeItem(STORAGE_KEYS.TOKEN);
          localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER);
          storeLogout();
          setLoading(false);
          return false;
        }
      } else {
        // Pas de données utilisateur, on nettoie
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        storeLogout();
        setLoading(false);
        return false;
      }
    } catch (error) {
      // Erreur générale, on nettoie
      console.warn('Erreur lors de la vérification de l\'authentification:', error instanceof Error ? error.message : 'Erreur inconnue');
      
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      
      storeLogout();
      setLoading(false);
      return false;
    }
  }, [setUser, storeLogout, initializeAuth, setLoading]);

  const hasRole = useCallback((role: string | string[]) => {
    if (!user) return false;
    
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    
    return user.role === role;
  }, [user]);

  const hasPermission = useCallback((permission: string) => {
    if (!user) return false;
    
    // Logique de permissions basée sur les rôles
    const rolePermissions: Record<string, string[]> = {
      teacher: ['view_classes', 'create_lessons', 'manage_students', 'view_reports'],
      student: ['view_lessons', 'take_quizzes', 'view_progress'],
      parent: ['view_child_progress', 'view_reports'],
      admin: ['manage_school', 'manage_users', 'view_all_reports', 'system_settings'],
    };

    return rolePermissions[user.role]?.includes(permission) || false;
  }, [user]);

  return {
    // État
    user,
    isAuthenticated,
    isLoading,
    error,
    
    // Actions
    login,
    register,
    logout,
    refreshToken,
    checkAuthStatus,
    clearError,
    
    // Utilitaires
    hasRole,
    hasPermission,
  };
}
