import { apiService, type ApiResponse } from './apiService';

// Types pour les analytics
export interface AnalyticsData {
  studentEngagement: {
    totalStudents: number;
    activeStudents: number;
    completionRate: number;
    averageTimeSpent: number;
  };
  coursePerformance: {
    totalCourses: number;
    activeCourses: number;
    averageRating: number;
    totalEnrollments: number;
  };
  quizStatistics: {
    totalQuizzes: number;
    averageScore: number;
    completionRate: number;
    totalAttempts: number;
  };
  timeBasedData: {
    daily: Array<{
      date: string;
      students: number;
      courses: number;
      quizzes: number;
    }>;
    weekly: Array<{
      week: string;
      students: number;
      courses: number;
      quizzes: number;
    }>;
    monthly: Array<{
      month: string;
      students: number;
      courses: number;
      quizzes: number;
    }>;
  };
  topCourses: Array<{
    id: number;
    title: string;
    enrollmentCount: number;
    averageRating: number;
    completionRate: number;
  }>;
  topStudents: Array<{
    id: string;
    name: string;
    email: string;
    totalQuizzes: number;
    averageScore: number;
    completionRate: number;
  }>;
}

export interface DashboardStats {
  totalStudents: number;
  totalCourses: number;
  totalQuizzes: number;
  totalRevenue: number;
  monthlyGrowth: {
    students: number;
    courses: number;
    revenue: number;
  };
  recentActivity: Array<{
    id: string;
    type: 'enrollment' | 'quiz_completed' | 'course_created' | 'payment';
    description: string;
    timestamp: string;
    user: string;
  }>;
}

export interface PerformanceMetrics {
  pageViews: number;
  uniqueVisitors: number;
  bounceRate: number;
  averageSessionDuration: number;
  conversionRate: number;
  topPages: Array<{
    path: string;
    views: number;
    uniqueViews: number;
  }>;
}

export interface ExportOptions {
  format: 'csv' | 'excel' | 'pdf';
  dateRange: {
    start: string;
    end: string;
  };
  dataTypes: ('students' | 'courses' | 'quizzes' | 'revenue')[];
}

class AnalyticsService {
  // Récupérer les données d'analytics
  async getAnalytics(period: 'week' | 'month' | 'year' = 'month'): Promise<ApiResponse<AnalyticsData>> {
    try {
      const response = await apiService.get<AnalyticsData>(`/analytics?period=${period}`);
      return response;
    } catch (error) {
      throw new Error('Erreur lors de la récupération des analytics');
    }
  }

  // Récupérer les statistiques du dashboard
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    try {
      const response = await apiService.get<DashboardStats>('/analytics/dashboard-stats');
      return response;
    } catch (error) {
      throw new Error('Erreur lors de la récupération des statistiques');
    }
  }

  // Récupérer les métriques de performance
  async getPerformanceMetrics(): Promise<ApiResponse<PerformanceMetrics>> {
    try {
      const response = await apiService.get<PerformanceMetrics>('/analytics/performance');
      return response;
    } catch (error) {
      throw new Error('Erreur lors de la récupération des métriques');
    }
  }

  // Récupérer les données d'engagement des étudiants
  async getStudentEngagement(studentId?: string): Promise<ApiResponse<AnalyticsData['studentEngagement']>> {
    try {
      const url = studentId ? `/analytics/student-engagement/${studentId}` : '/analytics/student-engagement';
      const response = await apiService.get<AnalyticsData['studentEngagement']>(url);
      return response;
    } catch (error) {
      throw new Error('Erreur lors de la récupération de l\'engagement étudiant');
    }
  }

  // Récupérer les performances des cours
  async getCoursePerformance(courseId?: number): Promise<ApiResponse<AnalyticsData['coursePerformance']>> {
    try {
      const url = courseId ? `/analytics/course-performance/${courseId}` : '/analytics/course-performance';
      const response = await apiService.get<AnalyticsData['coursePerformance']>(url);
      return response;
    } catch (error) {
      throw new Error('Erreur lors de la récupération des performances des cours');
    }
  }

  // Récupérer les statistiques des quiz
  async getQuizStatistics(quizId?: number): Promise<ApiResponse<AnalyticsData['quizStatistics']>> {
    try {
      const url = quizId ? `/analytics/quiz-statistics/${quizId}` : '/analytics/quiz-statistics';
      const response = await apiService.get<AnalyticsData['quizStatistics']>(url);
      return response;
    } catch (error) {
      throw new Error('Erreur lors de la récupération des statistiques des quiz');
    }
  }

  // Récupérer les données temporelles
  async getTimeBasedData(
    period: 'daily' | 'weekly' | 'monthly',
    dateRange?: { start: string; end: string }
  ): Promise<ApiResponse<AnalyticsData['timeBasedData'][typeof period]>> {
    try {
      let url = `/analytics/time-based/${period}`;
      if (dateRange) {
        url += `?start=${dateRange.start}&end=${dateRange.end}`;
      }
      const response = await apiService.get<AnalyticsData['timeBasedData'][typeof period]>(url);
      return response;
    } catch (error) {
      throw new Error('Erreur lors de la récupération des données temporelles');
    }
  }

  // Récupérer les cours les plus populaires
  async getTopCourses(limit: number = 10): Promise<ApiResponse<AnalyticsData['topCourses']>> {
    try {
      const response = await apiService.get<AnalyticsData['topCourses']>(`/analytics/top-courses?limit=${limit}`);
      return response;
    } catch (error) {
      throw new Error('Erreur lors de la récupération des cours populaires');
    }
  }

  // Récupérer les étudiants les plus performants
  async getTopStudents(limit: number = 10): Promise<ApiResponse<AnalyticsData['topStudents']>> {
    try {
      const response = await apiService.get<AnalyticsData['topStudents']>(`/analytics/top-students?limit=${limit}`);
      return response;
    } catch (error) {
      throw new Error('Erreur lors de la récupération des étudiants performants');
    }
  }

  // Exporter les données d'analytics
  async exportAnalytics(options: ExportOptions): Promise<ApiResponse<Blob>> {
    try {
      const response = await apiService.post<Blob>('/analytics/export', options, {
        responseType: 'blob'
      });
      return response;
    } catch (error) {
      throw new Error('Erreur lors de l\'export des données');
    }
  }

  // Récupérer les données en temps réel
  async getRealTimeData(): Promise<ApiResponse<{
    activeUsers: number;
    onlineStudents: number;
    currentQuizzes: number;
    recentActivity: DashboardStats['recentActivity'];
  }>> {
    try {
      const response = await apiService.get('/analytics/real-time');
      return response;
    } catch (error) {
      throw new Error('Erreur lors de la récupération des données temps réel');
    }
  }

  // Récupérer les rapports personnalisés
  async getCustomReport(reportConfig: {
    metrics: string[];
    dateRange: { start: string; end: string };
    filters?: Record<string, any>;
  }): Promise<ApiResponse<any>> {
    try {
      const response = await apiService.post('/analytics/custom-report', reportConfig);
      return response;
    } catch (error) {
      throw new Error('Erreur lors de la génération du rapport personnalisé');
    }
  }
}

export const analyticsService = new AnalyticsService();
export default analyticsService;
