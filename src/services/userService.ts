import type { 
  User,
  UserUpdateData,
  UserProfile,
  ApiResponse 
} from '../types';
import { apiService } from './apiService';

class UserService {
  /**
   * Récupérer tous les utilisateurs (admin seulement)
   */
  async getUsers(): Promise<ApiResponse<User[]>> {
    try {
      return await apiService.get<User[]>('/users');
    } catch (error) {
      throw new Error('Erreur lors de la récupération des utilisateurs');
    }
  }

  /**
   * Récupérer un utilisateur par son ID
   */
  async getUserById(userId: string): Promise<ApiResponse<User>> {
    try {
      return await apiService.get<User>(`/users/${userId}`);
    } catch (error) {
      throw new Error('Erreur lors de la récupération de l\'utilisateur');
    }
  }

  /**
   * Mettre à jour le profil utilisateur
   */
  async updateProfile(userData: UserUpdateData): Promise<ApiResponse<UserProfile>> {
    try {
      return await apiService.put<UserProfile>('/users/profile', userData);
    } catch (error) {
      throw new Error('Erreur lors de la mise à jour du profil');
    }
  }

  /**
   * Changer le mot de passe
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<{ message: string }>> {
    try {
      return await apiService.post<{ message: string }>('/users/change-password', {
        currentPassword,
        newPassword
      });
    } catch (error) {
      throw new Error('Erreur lors du changement de mot de passe');
    }
  }

  /**
   * Supprimer un utilisateur (admin seulement)
   */
  async deleteUser(userId: string): Promise<ApiResponse<{ message: string }>> {
    try {
      return await apiService.delete<{ message: string }>(`/users/${userId}`);
    } catch (error) {
      throw new Error('Erreur lors de la suppression de l\'utilisateur');
    }
  }

  /**
   * Désactiver un utilisateur (admin seulement)
   */
  async deactivateUser(userId: string): Promise<ApiResponse<User>> {
    try {
      return await apiService.patch<User>(`/users/${userId}/deactivate`);
    } catch (error) {
      throw new Error('Erreur lors de la désactivation de l\'utilisateur');
    }
  }

  /**
   * Activer un utilisateur (admin seulement)
   */
  async activateUser(userId: string): Promise<ApiResponse<User>> {
    try {
      return await apiService.patch<User>(`/users/${userId}/activate`);
    } catch (error) {
      throw new Error('Erreur lors de l\'activation de l\'utilisateur');
    }
  }

  /**
   * Changer le rôle d'un utilisateur (admin seulement)
   */
  async changeUserRole(userId: string, role: string): Promise<ApiResponse<User>> {
    try {
      return await apiService.patch<User>(`/users/${userId}/role`, { role });
    } catch (error) {
      throw new Error('Erreur lors du changement de rôle');
    }
  }

  /**
   * Rechercher des utilisateurs
   */
  async searchUsers(query: string): Promise<ApiResponse<User[]>> {
    try {
      return await apiService.get<User[]>(`/users/search?q=${encodeURIComponent(query)}`);
    } catch (error) {
      throw new Error('Erreur lors de la recherche d\'utilisateurs');
    }
  }

  /**
   * Récupérer les utilisateurs par rôle
   */
  async getUsersByRole(role: string): Promise<ApiResponse<User[]>> {
    try {
      return await apiService.get<User[]>(`/users?role=${role}`);
    } catch (error) {
      throw new Error('Erreur lors de la récupération des utilisateurs');
    }
  }

  /**
   * Obtenir les statistiques des utilisateurs (admin seulement)
   */
  async getUserStats(): Promise<ApiResponse<{
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    usersByRole: Record<string, number>;
  }>> {
    try {
      return await apiService.get('/users/stats');
    } catch (error) {
      throw new Error('Erreur lors de la récupération des statistiques utilisateurs');
    }
  }

  /**
   * Upload d'avatar
   */
  async uploadAvatar(file: File): Promise<ApiResponse<{ avatarUrl: string }>> {
    try {
      return await apiService.uploadFile<{ avatarUrl: string }>('/users/avatar', file);
    } catch (error) {
      throw new Error('Erreur lors de l\'upload de l\'avatar');
    }
  }

  /**
   * Supprimer l'avatar
   */
  async deleteAvatar(): Promise<ApiResponse<{ message: string }>> {
    try {
      return await apiService.delete<{ message: string }>('/users/avatar');
    } catch (error) {
      throw new Error('Erreur lors de la suppression de l\'avatar');
    }
  }
}

// Instance singleton du service
export const userService = new UserService();
export default userService;
