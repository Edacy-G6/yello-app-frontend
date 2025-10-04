import { apiService, type ApiResponse } from './apiService';

export interface GoogleAuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      _id: string;
      name: string;
      lastname: string;
      email: string;
      picture?: string;
      role: string;
      authProvider: string;
      isEmailVerified: boolean;
    };
    token: string;
    refreshToken: string;
  };
}

export interface GoogleCredentialResponse {
  credential: string;
  select_by?: string;
  client_id?: string;
}

class GoogleAuthService {
  /**
   * Authentifie un utilisateur avec un token Google
   * @param credential Token Google ID reçu de Google
   * @returns Réponse d'authentification
   */
  async authenticateWithGoogle(credential: string): Promise<ApiResponse<GoogleAuthResponse>> {
    try {
      const response = await apiService.publicPost<GoogleAuthResponse>('/auth/google', {
        token: credential,
      });

      if (response.success && response.data?.data) {
        // Stocker les tokens et informations utilisateur
        const { user, token, refreshToken } = response.data.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
      }

      return response;
    } catch (error) {
      console.error('Erreur lors de l\'authentification Google:', error);
      throw new Error('Erreur lors de l\'authentification Google');
    }
  }

  /**
   * Gère la réponse de Google One Tap
   * @param response Réponse de Google One Tap
   * @returns Promesse d'authentification
   */
  async handleGoogleResponse(response: GoogleCredentialResponse): Promise<ApiResponse<GoogleAuthResponse>> {
    if (!response.credential) {
      throw new Error('Token Google manquant');
    }

    return this.authenticateWithGoogle(response.credential);
  }

  /**
   * Déconnecte l'utilisateur Google
   */
  async signOut(): Promise<void> {
    try {
      // Nettoyer le stockage local
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');

      // Si Google Sign-In est disponible, déconnecter aussi de Google
      if (window.google?.accounts?.id) {
        window.google.accounts.id.disableAutoSelect();
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion Google:', error);
    }
  }

  /**
   * Vérifie si l'utilisateur est connecté via Google
   * @returns true si connecté via Google
   */
  isGoogleUser(): boolean {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return false;

      const user = JSON.parse(userStr);
      return user.authProvider === 'google';
    } catch {
      return false;
    }
  }

  /**
   * Récupère les informations de l'utilisateur Google connecté
   * @returns Informations utilisateur ou null
   */
  getCurrentGoogleUser(): GoogleAuthResponse['data']['user'] | null {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return null;

      const user = JSON.parse(userStr);
      return user.authProvider === 'google' ? user : null;
    } catch {
      return null;
    }
  }
}

// Déclaration des types globaux pour Google
declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (config: any) => void;
          prompt: (callback?: (notification: any) => void) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          disableAutoSelect: () => void;
          revoke: (email: string, callback: () => void) => void;
        };
      };
    };
  }
}

export const googleAuthService = new GoogleAuthService();
export default googleAuthService;
