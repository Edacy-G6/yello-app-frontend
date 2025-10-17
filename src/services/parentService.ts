import { apiService, type ApiResponse } from './apiService';
import type { Student } from './studentService';

// Types pour les parents
export interface Parent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  children: string[]; // IDs des enfants
  subscriptionStatus: 'active' | 'inactive' | 'trial' | 'expired';
  subscriptionType: 'basic' | 'premium' | 'family';
  subscriptionEndDate?: string;
  createdAt: string;
  lastLogin: string;
}

export interface ParentDashboard {
  children: Array<{
    student: Student;
    progress: {
      totalCourses: number;
      completedCourses: number;
      totalQuizzes: number;
      averageScore: number;
      timeSpent: number;
      lastActivity: string;
    };
    recentActivity: Array<{
      id: string;
      type: 'quiz_completed' | 'course_started' | 'course_completed' | 'achievement_earned';
      description: string;
      timestamp: string;
      courseId?: number;
      quizId?: number;
      score?: number;
    }>;
  }>;
  notifications: Array<{
    id: string;
    type: 'progress' | 'achievement' | 'reminder' | 'system';
    title: string;
    message: string;
    timestamp: string;
    isRead: boolean;
    studentId?: string;
    priority: 'low' | 'medium' | 'high';
  }>;
  summary: {
    totalChildren: number;
    activeChildren: number;
    totalCourses: number;
    totalQuizzes: number;
    averageScore: number;
    totalTimeSpent: number;
  };
}

export interface ChildProgress {
  studentId: string;
  student: Student;
  courses: Array<{
    courseId: number;
    courseTitle: string;
    progress: number;
    completedLessons: number;
    totalLessons: number;
    averageScore: number;
    timeSpent: number;
    lastActivity: string;
    status: 'in-progress' | 'completed' | 'not-started';
  }>;
  quizAttempts: Array<{
    id: string;
    quizId: number;
    quizTitle: string;
    courseTitle: string;
    score: number;
    totalPoints: number;
    timeSpent: number;
    completedAt: string;
    status: 'completed' | 'in-progress' | 'abandoned';
  }>;
  achievements: Array<{
    id: string;
    name: string;
    description: string;
    earnedAt: string;
    icon: string;
  }>;
  stats: {
    totalCourses: number;
    completedCourses: number;
    totalQuizzes: number;
    averageScore: number;
    totalTimeSpent: number;
    streak: number;
    rank?: number;
  };
}

export interface ParentReport {
  period: {
    start: string;
    end: string;
  };
  children: Array<{
    studentId: string;
    student: Student;
    summary: {
      coursesCompleted: number;
      quizzesTaken: number;
      averageScore: number;
      timeSpent: number;
      improvements: string[];
      concerns: string[];
    };
    detailedProgress: Array<{
      courseId: number;
      courseTitle: string;
      progress: number;
      timeSpent: number;
      quizScores: number[];
      lastActivity: string;
    }>;
  }>;
  recommendations: Array<{
    studentId: string;
    type: 'course' | 'quiz' | 'study_plan' | 'break';
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    action?: string;
  }>;
}

class ParentService {
  // Récupérer le profil du parent connecté
  async getCurrentParent(): Promise<ApiResponse<Parent>> {
    try {
      const response = await apiService.get<Parent>('/parents/me');
      return response;
    } catch {
      throw new Error('Erreur lors de la récupération du profil parent');
    }
  }

  // Récupérer le dashboard du parent
  async getParentDashboard(): Promise<ApiResponse<ParentDashboard>> {
    try {
      const response = await apiService.get<ParentDashboard>('/parents/me/dashboard');
      return response;
    } catch {
      throw new Error('Erreur lors de la récupération du dashboard');
    }
  }

  // Récupérer les enfants d'un parent
  async getChildren(): Promise<ApiResponse<Student[]>> {
    try {
      const response = await apiService.get<Student[]>('/parents/me/children');
      return response;
    } catch {
      throw new Error('Erreur lors de la récupération des enfants');
    }
  }

  // Récupérer les progrès d'un enfant spécifique
  async getChildProgress(childId: string): Promise<ApiResponse<ChildProgress>> {
    try {
      const response = await apiService.get<ChildProgress>(`/parents/me/children/${childId}/progress`);
      return response;
    } catch {
      throw new Error('Erreur lors de la récupération des progrès de l\'enfant');
    }
  }

  // Récupérer les notifications du parent
  async getNotifications(): Promise<ApiResponse<ParentDashboard['notifications']>> {
    try {
      const response = await apiService.get<ParentDashboard['notifications']>('/parents/me/notifications');
      return response;
    } catch {
      throw new Error('Erreur lors de la récupération des notifications');
    }
  }

  // Marquer une notification comme lue
  async markNotificationAsRead(notificationId: string): Promise<ApiResponse<void>> {
    try {
      const response = await apiService.patch<void>(`/parents/me/notifications/${notificationId}/read`);
      return response;
    } catch {
      throw new Error('Erreur lors de la mise à jour de la notification');
    }
  }

  // Marquer toutes les notifications comme lues
  async markAllNotificationsAsRead(): Promise<ApiResponse<void>> {
    try {
      const response = await apiService.patch<void>('/parents/me/notifications/read-all');
      return response;
    } catch {
      throw new Error('Erreur lors de la mise à jour des notifications');
    }
  }

  // Générer un rapport de progrès
  async generateProgressReport(
    childId: string,
    period: { start: string; end: string }
  ): Promise<ApiResponse<ParentReport>> {
    try {
      const response = await apiService.post<ParentReport>(`/parents/me/children/${childId}/report`, period);
      return response;
    } catch {
      throw new Error('Erreur lors de la génération du rapport');
    }
  }

  // Exporter un rapport
  async exportReport(
    childId: string,
    period: { start: string; end: string },
    format: 'pdf' | 'excel' | 'csv'
  ): Promise<ApiResponse<Blob>> {
    try {
      const response = await apiService.post<Blob>(
        `/parents/me/children/${childId}/export-report`,
        { period, format }
      );
      return response;
    } catch {
      throw new Error('Erreur lors de l\'export du rapport');
    }
  }

  // Mettre à jour le profil du parent
  async updateParentProfile(profileData: Partial<Parent>): Promise<ApiResponse<Parent>> {
    try {
      const response = await apiService.put<Parent>('/parents/me', profileData);
      return response;
    } catch {
      throw new Error('Erreur lors de la mise à jour du profil');
    }
  }

  // Ajouter un enfant
  async addChild(childData: {
    firstName: string;
    lastName: string;
    email: string;
    grade: string;
    school: string;
  }): Promise<ApiResponse<Student>> {
    try {
      const response = await apiService.post<Student>('/parents/me/children', childData);
      return response;
    } catch {
      throw new Error('Erreur lors de l\'ajout de l\'enfant');
    }
  }

  // Supprimer un enfant
  async removeChild(childId: string): Promise<ApiResponse<void>> {
    try {
      const response = await apiService.delete<void>(`/parents/me/children/${childId}`);
      return response;
    } catch {
      throw new Error('Erreur lors de la suppression de l\'enfant');
    }
  }

  // Récupérer les paramètres de notification
  async getNotificationSettings(): Promise<ApiResponse<{
    emailNotifications: boolean;
    pushNotifications: boolean;
    smsNotifications: boolean;
    weeklyReports: boolean;
    achievementAlerts: boolean;
    progressAlerts: boolean;
  }>> {
    try {
      const response = await apiService.get<{
        emailNotifications: boolean;
        pushNotifications: boolean;
        smsNotifications: boolean;
        weeklyReports: boolean;
        achievementAlerts: boolean;
        progressAlerts: boolean;
      }>('/parents/me/notification-settings');
      return response;
    } catch {
      throw new Error('Erreur lors de la récupération des paramètres');
    }
  }

  // Mettre à jour les paramètres de notification
  async updateNotificationSettings(settings: {
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    smsNotifications?: boolean;
    weeklyReports?: boolean;
    achievementAlerts?: boolean;
    progressAlerts?: boolean;
  }): Promise<ApiResponse<void>> {
    try {
      const response = await apiService.put<void>('/parents/me/notification-settings', settings);
      return response;
    } catch {
      throw new Error('Erreur lors de la mise à jour des paramètres');
    }
  }

  // Récupérer l'historique des paiements
  async getPaymentHistory(): Promise<ApiResponse<Array<{
    id: string;
    amount: number;
    currency: string;
    status: 'completed' | 'pending' | 'failed';
    description: string;
    date: string;
    subscriptionType: string;
  }>>> {
    try {
      const response = await apiService.get<Array<{
        id: string;
        amount: number;
        currency: string;
        status: 'completed' | 'pending' | 'failed';
        description: string;
        date: string;
        subscriptionType: string;
      }>>('/parents/me/payment-history');
      return response;
    } catch {
      throw new Error('Erreur lors de la récupération de l\'historique des paiements');
    }
  }

  // Récupérer les informations d'abonnement
  async getSubscriptionInfo(): Promise<ApiResponse<{
    type: 'basic' | 'premium' | 'family';
    status: 'active' | 'inactive' | 'trial' | 'expired';
    startDate: string;
    endDate?: string;
    autoRenew: boolean;
    price: number;
    currency: string;
    features: string[];
  }>> {
    try {
      const response = await apiService.get<{
        type: 'basic' | 'premium' | 'family';
        status: 'active' | 'inactive' | 'trial' | 'expired';
        startDate: string;
        endDate?: string;
        autoRenew: boolean;
        price: number;
        currency: string;
        features: string[];
      }>('/parents/me/subscription');
      return response;
    } catch {
      throw new Error('Erreur lors de la récupération des informations d\'abonnement');
    }
  }
}

export const parentService = new ParentService();
export default parentService;
