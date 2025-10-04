import type { 
  AuthResponse, 
  LoginData, 
  RegisterData, 
  AuthUser,
  UserRole
} from '../types';
import type { 
  ApiResponse,
  AuthApiResponse,
  RegisterApiResponse
} from '../types/api';
import { ApiResponseConverter } from '../types/api';
import { STORAGE_KEYS } from '../constants';
import { apiService } from './apiService';
import { googleAuthService, type GoogleAuthResponse } from './googleAuthService';

class AuthService {
  /**
   * Connexion utilisateur
   */
  async login(loginData: LoginData): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await apiService.publicPost<AuthApiResponse>('/auth/login', loginData);
      
      console.log('Réponse API login:', response);
      
      if (response.success && response.data) {
        const responseData = response.data;
        
        // Construire l'objet AuthResponse à partir de la réponse du backend
        const authResponse: AuthResponse = {
          user: {
            id: responseData.user._id || responseData.user.id || '',
            email: responseData.user.email || '',
            name: `${responseData.user.name || ''} ${responseData.user.lastname || ''}`.trim(),
            role: (responseData.user.role || 'teacher') as UserRole,
            schoolId: responseData.user.schoolId || '',
            token: responseData.access_token || '',
            refreshToken: responseData.refresh_token || '',
            createdAt: new Date(responseData.user.createdAt),
            updatedAt: new Date(responseData.user.updatedAt),
          },
          message: response.message || 'Connexion réussie',
        };

        // Sauvegarder le token et les données utilisateur
        if (authResponse.user.token) {
          localStorage.setItem(STORAGE_KEYS.TOKEN, authResponse.user.token);
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, authResponse.user.refreshToken);
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(authResponse.user));
        }

        return ApiResponseConverter.success(response.message || 'Connexion réussie', authResponse);
      } else {
        throw new Error(response.message || 'Erreur de connexion');
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw new Error('Email ou mot de passe incorrect');
    }
  }

  /**
   * Inscription utilisateur
   */
  async register(registerData: RegisterData): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await apiService.publicPost<RegisterApiResponse>('/auth/register', registerData);
      
      console.log('Réponse API register:', response);
      
      if (response.success && response.data) {
        const responseData = response.data;
        
        // L'inscription est réussie, mais pas de token (connexion requise)
        const authResponse: AuthResponse = {
          user: {
            id: responseData._id || responseData.id || '',
            email: responseData.email || '',
            name: `${responseData.name || ''} ${responseData.lastname || ''}`.trim(),
            role: (responseData.role || 'teacher') as UserRole,
            schoolId: responseData.schoolId || '',
            token: '', // Pas de token lors de l'inscription
            refreshToken: '', // Pas de refresh token lors de l'inscription
            createdAt: new Date(responseData.createdAt || new Date()),
            updatedAt: new Date(responseData.updatedAt || new Date()),
          },
          message: response.message || 'Inscription réussie',
        };

        return ApiResponseConverter.success(
          response.message || 'Inscription réussie. Veuillez vous connecter.',
          authResponse
        );
      } else {
        throw new Error(response.message || 'Erreur lors de l\'inscription');
      }
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      throw new Error('Erreur lors de l\'inscription. Vérifiez vos informations.');
    }
  }

  /**
   * Rafraîchissement du token
   */
  async refreshToken(refreshToken: string): Promise<ApiResponse<{ token: string }>> {
    try {
      const response = await apiService.publicPost<{ token: string }>('/auth/refresh', {
        refreshToken
      });
      
      if (response.success) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.token);
      }
      
      return response;
    } catch {
      throw new Error('Erreur lors du rafraîchissement du token');
    }
  }

  /**
   * Déconnexion utilisateur
   */
  async logout(): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await apiService.post<{ message: string }>('/auth/logout');
      
      // Nettoyer le localStorage
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      
      return response;
    } catch {
      // Même en cas d'erreur, on nettoie le localStorage
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);

    return {
      success: true,
      message: 'Déconnexion réussie',
      data: { message: 'Vous avez été déconnecté avec succès' }
    };
  }
  }

  /**
   * Récupérer l'utilisateur actuel
   */
  async getCurrentUser(): Promise<ApiResponse<AuthUser>> {
    try {
      const response = await apiService.get<AuthUser>('/auth/profile-simple');
      
      if (response.success && response.data) {
        // Mettre à jour les données utilisateur dans le localStorage
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data));
        return response;
      } else {
        return ApiResponseConverter.error(
          response.message || 'Erreur lors de la récupération du profil'
        );
      }
    } catch (error) {
      console.error('Erreur API getCurrentUser:', error);
      return ApiResponseConverter.error('Erreur lors de la récupération du profil utilisateur');
    }
  }

  /**
   * Vérifier si l'utilisateur est authentifié
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    return !!token;
  }

  /**
   * Obtenir l'utilisateur depuis le localStorage
   */
  getStoredUser(): AuthUser | null {
    try {
      const userData = localStorage.getItem(STORAGE_KEYS.USER);
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  /**
   * Authentification Google
   */
  async loginWithGoogle(credential: string): Promise<ApiResponse<GoogleAuthResponse>> {
    try {
      return await googleAuthService.authenticateWithGoogle(credential);
    } catch (error) {
      console.error('Erreur lors de l\'authentification Google:', error);
      throw new Error('Erreur lors de l\'authentification Google');
    }
  }

  /**
   * Vérifie si l'utilisateur est connecté via Google
   */
  isGoogleUser(): boolean {
    return googleAuthService.isGoogleUser();
  }

  /**
   * Récupère les informations de l'utilisateur Google
   */
  getCurrentGoogleUser(): GoogleAuthResponse['data'] | null {
    const googleResponse = googleAuthService.getCurrentGoogleUser();
    return googleResponse?.user || null;
  }

  /**
   * Déconnexion avec gestion Google
   */
  async logoutWithGoogle(): Promise<void> {
    try {
      // Déconnexion standard
      await this.logout();
      
      // Déconnexion Google si nécessaire
      if (this.isGoogleUser()) {
        await googleAuthService.signOut();
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion Google:', error);
      throw error;
    }
  }
}

// Instance singleton du service
export const authService = new AuthService();
export default authService;
