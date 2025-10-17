import { apiService, type ApiResponse } from './apiService';

// Types pour les quiz
export interface Quiz {
  id: number;
  title: string;
  courseId: number;
  courseTitle: string;
  questionCount: number;
  studentCount: number;
  averageScore: number;
  status: 'active' | 'draft' | 'archived';
  createdAt: string;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'fill-blank';
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
  timeLimit?: number;
}

export interface QuizAttempt {
  id: string;
  quizId: number;
  studentId: string;
  answers: { questionId: string; answer: string; isCorrect: boolean }[];
  score: number;
  totalPoints: number;
  timeSpent: number;
  completedAt: string;
  status: 'completed' | 'in-progress' | 'abandoned';
}

export interface QuizStats {
  totalQuizzes: number;
  activeQuizzes: number;
  draftQuizzes: number;
  archivedQuizzes: number;
  averageScore: number;
  totalAttempts: number;
  completionRate: number;
}

class QuizService {
  // Récupérer tous les quiz
  async getQuizzes(): Promise<ApiResponse<Quiz[]>> {
    try {
      const response = await apiService.get<Quiz[]>('/quizzes');
      return response;
    } catch {
      throw new Error('Erreur lors de la récupération des quiz');
    }
  }

  // Récupérer un quiz par ID
  async getQuizById(id: number): Promise<ApiResponse<Quiz>> {
    try {
      const response = await apiService.get<Quiz>(`/quizzes/${id}`);
      return response;
    } catch {
      throw new Error('Erreur lors de la récupération du quiz');
    }
  }

  // Récupérer les questions d'un quiz
  async getQuizQuestions(quizId: number): Promise<ApiResponse<QuizQuestion[]>> {
    try {
      const response = await apiService.get<QuizQuestion[]>(`/quizzes/${quizId}/questions`);
      return response;
    } catch {
      throw new Error('Erreur lors de la récupération des questions');
    }
  }

  // Créer un nouveau quiz
  async createQuiz(quizData: Partial<Quiz>): Promise<ApiResponse<Quiz>> {
    try {
      const response = await apiService.post<Quiz>('/quizzes', quizData);
      return response;
    } catch {
      throw new Error('Erreur lors de la création du quiz');
    }
  }

  // Mettre à jour un quiz
  async updateQuiz(id: number, quizData: Partial<Quiz>): Promise<ApiResponse<Quiz>> {
    try {
      const response = await apiService.put<Quiz>(`/quizzes/${id}`, quizData);
      return response;
    } catch {
      throw new Error('Erreur lors de la mise à jour du quiz');
    }
  }

  // Supprimer un quiz
  async deleteQuiz(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await apiService.delete<void>(`/quizzes/${id}`);
      return response;
    } catch {
      throw new Error('Erreur lors de la suppression du quiz');
    }
  }

  // Démarrer une tentative de quiz
  async startQuizAttempt(quizId: number): Promise<ApiResponse<QuizAttempt>> {
    try {
      const response = await apiService.post<QuizAttempt>(`/quizzes/${quizId}/attempts`, {});
      return response;
    } catch {
      throw new Error('Erreur lors du démarrage du quiz');
    }
  }

  // Soumettre une réponse
  async submitAnswer(attemptId: string, questionId: string, answer: string): Promise<ApiResponse<void>> {
    try {
      const response = await apiService.post<void>(`/quiz-attempts/${attemptId}/answers`, {
        questionId,
        answer
      });
      return response;
    } catch {
      throw new Error('Erreur lors de la soumission de la réponse');
    }
  }

  // Terminer une tentative de quiz
  async completeQuizAttempt(attemptId: string): Promise<ApiResponse<QuizAttempt>> {
    try {
      const response = await apiService.post<QuizAttempt>(`/quiz-attempts/${attemptId}/complete`);
      return response;
    } catch {
      throw new Error('Erreur lors de la finalisation du quiz');
    }
  }

  // Récupérer les statistiques des quiz
  async getQuizStats(): Promise<ApiResponse<QuizStats>> {
    try {
      const response = await apiService.get<QuizStats>('/quizzes/stats');
      return response;
    } catch {
      throw new Error('Erreur lors de la récupération des statistiques');
    }
  }

  // Récupérer les tentatives d'un quiz
  async getQuizAttempts(quizId: number): Promise<ApiResponse<QuizAttempt[]>> {
    try {
      const response = await apiService.get<QuizAttempt[]>(`/quizzes/${quizId}/attempts`);
      return response;
    } catch {
      throw new Error('Erreur lors de la récupération des tentatives');
    }
  }

  // Récupérer les tentatives d'un étudiant
  async getStudentAttempts(studentId: string): Promise<ApiResponse<QuizAttempt[]>> {
    try {
      const response = await apiService.get<QuizAttempt[]>(`/students/${studentId}/quiz-attempts`);
      return response;
    } catch {
      throw new Error('Erreur lors de la récupération des tentatives étudiant');
    }
  }

  // Dupliquer un quiz
  async duplicateQuiz(id: number): Promise<ApiResponse<Quiz>> {
    try {
      const response = await apiService.post<Quiz>(`/quizzes/${id}/duplicate`);
      return response;
    } catch {
      throw new Error('Erreur lors de la duplication du quiz');
    }
  }

  // Publier/archiver un quiz
  async updateQuizStatus(id: number, status: 'active' | 'draft' | 'archived'): Promise<ApiResponse<Quiz>> {
    try {
      const response = await apiService.patch<Quiz>(`/quizzes/${id}/status`, { status });
      return response;
    } catch {
      throw new Error('Erreur lors de la mise à jour du statut');
    }
  }
}

export const quizService = new QuizService();
export default quizService;