import { apiService, type ApiResponse } from './apiService';

// Types pour les étudiants
export interface Student {
  _id: string;
  name: string;
  lastname: string;
  email: string;
  avatar?: string;
  profil_img?: string;
  grade?: string;
  school?: string;
  date_naiss?: string;
  enrollmentDate?: string;
  status: 'active' | 'inactive' | 'suspended';
  active: boolean;
  parentId?: string;
  totalQuizzes?: number;
  averageScore?: number;
  completionRate?: number;
  timeSpent?: number;
  lastActivity?: string;
  role?: string;
  carte_cni?: string;
  googleId?: string;
  picture?: string;
  isEmailVerified?: boolean;
  authProvider?: 'local' | 'google';
}

export interface StudentProgress {
  studentId: string;
  courseId: number;
  courseTitle: string;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  averageScore: number;
  timeSpent: number;
  lastActivity: string;
  status: 'in-progress' | 'completed' | 'not-started';
}

export interface StudentQuizAttempt {
  id: string;
  quizId: number;
  quizTitle: string;
  courseTitle: string;
  score: number;
  totalPoints: number;
  timeSpent: number;
  completedAt: string;
  status: 'completed' | 'in-progress' | 'abandoned';
}

export interface StudentStats {
  totalCourses: number;
  completedCourses: number;
  totalQuizzes: number;
  averageScore: number;
  totalTimeSpent: number;
  streak: number;
  achievements: Array<{
    id: string;
    name: string;
    description: string;
    earnedAt: string;
    icon: string;
  }>;
}

export interface StudentActivity {
  id: string;
  type: 'quiz_completed' | 'course_started' | 'course_completed' | 'achievement_earned';
  description: string;
  timestamp: string;
  courseId?: number;
  quizId?: number;
  score?: number;
}

class StudentService {
  // Récupérer tous les étudiants
  async getStudents(): Promise<ApiResponse<Student[]>> {
    try {
      const response = await apiService.get<Student[]>('/student');
      return response;
    } catch {
      throw new Error('Erreur lors de la récupération des étudiants');
    }
  }

  // Récupérer un étudiant par ID
  async getStudentById(id: string): Promise<ApiResponse<Student>> {
    try {
      const response = await apiService.get<Student>(`/student/${id}`);
      return response;
    } catch {
      throw new Error('Erreur lors de la récupération de l\'étudiant');
    }
  }

  // Récupérer le profil de l'étudiant connecté
  async getCurrentStudent(): Promise<ApiResponse<Student>> {
    try {
      const response = await apiService.get<Student>('/student/me');
      return response;
    } catch {
      throw new Error('Erreur lors de la récupération du profil');
    }
  }

  // Récupérer les cours d'un étudiant
  async getStudentCourses(studentId?: string): Promise<ApiResponse<StudentProgress[]>> {
    try {
      const url = studentId ? `/student/${studentId}/courses` : '/student/me/courses';
      const response = await apiService.get<StudentProgress[]>(url);
      return response;
    } catch {
      throw new Error('Erreur lors de la récupération des cours');
    }
  }

  // Récupérer les tentatives de quiz d'un étudiant
  async getStudentQuizAttempts(studentId?: string): Promise<ApiResponse<StudentQuizAttempt[]>> {
    try {
      const url = studentId ? `/student/${studentId}/quiz-attempts` : '/student/me/quiz-attempts';
      const response = await apiService.get<StudentQuizAttempt[]>(url);
      return response;
    } catch {
      throw new Error('Erreur lors de la récupération des tentatives de quiz');
    }
  }

  // Récupérer les statistiques d'un étudiant
  async getStudentStats(studentId?: string): Promise<ApiResponse<StudentStats>> {
    try {
      const url = studentId ? `/student/${studentId}/stats` : '/student/me/stats';
      const response = await apiService.get<StudentStats>(url);
      return response;
    } catch {
      throw new Error('Erreur lors de la récupération des statistiques');
    }
  }

  // Récupérer l'activité d'un étudiant
  async getStudentActivity(studentId?: string, limit?: number): Promise<ApiResponse<StudentActivity[]>> {
    try {
      let url = studentId ? `/student/${studentId}/activity` : '/student/me/activity';
      if (limit) {
        url += `?limit=${limit}`;
      }
      const response = await apiService.get<StudentActivity[]>(url);
      return response;
    } catch {
      throw new Error('Erreur lors de la récupération de l\'activité');
    }
  }

  // Inscrire un étudiant à un cours
  async enrollInCourse(courseId: number, studentId?: string): Promise<ApiResponse<void>> {
    try {
      const url = studentId ? `/student/${studentId}/enroll` : '/student/me/enroll';
      const response = await apiService.post<void>(url, { courseId });
      return response;
    } catch {
      throw new Error('Erreur lors de l\'inscription au cours');
    }
  }

  // Désinscrire un étudiant d'un cours
  async unenrollFromCourse(courseId: number, studentId?: string): Promise<ApiResponse<void>> {
    try {
      const url = studentId ? `/student/${studentId}/unenroll` : '/student/me/unenroll';
      const response = await apiService.post<void>(url, { courseId });
      return response;
    } catch {
      throw new Error('Erreur lors de la désinscription du cours');
    }
  }

  // Mettre à jour le profil d'un étudiant
  async updateStudentProfile(profileData: Partial<Student>, studentId?: string): Promise<ApiResponse<Student>> {
    try {
      const url = studentId ? `/student/${studentId}` : '/student/me';
      const response = await apiService.put<Student>(url, profileData);
      return response;
    } catch {
      throw new Error('Erreur lors de la mise à jour du profil');
    }
  }

  // Récupérer les progrès d'un cours spécifique
  async getCourseProgress(courseId: number, studentId?: string): Promise<ApiResponse<StudentProgress>> {
    try {
      const url = studentId ? `/student/${studentId}/courses/${courseId}/progress` : `/student/me/courses/${courseId}/progress`;
      const response = await apiService.get<StudentProgress>(url);
      return response;
    } catch {
      throw new Error('Erreur lors de la récupération du progrès');
    }
  }

  // Marquer une leçon comme terminée
  async completeLesson(lessonId: string, studentId?: string): Promise<ApiResponse<void>> {
    try {
      const url = studentId ? `/student/${studentId}/lessons/${lessonId}/complete` : `/student/me/lessons/${lessonId}/complete`;
      const response = await apiService.post<void>(url, {});
      return response;
    } catch {
      throw new Error('Erreur lors de la finalisation de la leçon');
    }
  }

  // Récupérer les recommandations de cours
  async getCourseRecommendations(studentId?: string): Promise<ApiResponse<Array<{
    id: number;
    title: string;
    description: string;
    difficulty: string;
    estimatedDuration: number;
    rating: number;
    reason: string;
  }>>> {
    try {
      const url = studentId ? `/student/${studentId}/recommendations` : '/student/me/recommendations';
      const response = await apiService.get<Array<{
        id: number;
        title: string;
        description: string;
        difficulty: string;
        estimatedDuration: number;
        rating: number;
        reason: string;
      }>>(url);
      return response;
    } catch {
      throw new Error('Erreur lors de la récupération des recommandations');
    }
  }

  // Récupérer les étudiants d'un parent
  async getParentStudents(parentId: string): Promise<ApiResponse<Student[]>> {
    try {
      const response = await apiService.get<Student[]>(`/parents/${parentId}/student`);
      return response;
    } catch {
      throw new Error('Erreur lors de la récupération des étudiants du parent');
    }
  }

  // Rechercher des étudiants
  async searchStudents(query: string, filters?: {
    grade?: string;
    school?: string;
    status?: string;
  }): Promise<ApiResponse<Student[]>> {
    try {
      const params = new URLSearchParams({ q: query });
      if (filters?.grade) params.append('grade', filters.grade);
      if (filters?.school) params.append('school', filters.school);
      if (filters?.status) params.append('status', filters.status);
      
      const response = await apiService.get<Student[]>(`/student/search?${params.toString()}`);
      return response;
    } catch {
      throw new Error('Erreur lors de la recherche d\'étudiants');
    }
  }
}

export const studentService = new StudentService();
export default studentService;
