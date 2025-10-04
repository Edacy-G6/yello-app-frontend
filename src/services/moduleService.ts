import type { 
  Module,
  ModuleContent,
  Quiz,
  QuizQuestion,
  QuizAttempt,
  ApiResponse 
} from '../types';
import { apiService } from './apiService';

class ModuleService {
  /**
   * Récupérer un module par son ID
   */
  async getModuleById(moduleId: string): Promise<ApiResponse<Module>> {
    try {
      return await apiService.get<Module>(`/modules/${moduleId}`);
    } catch (error) {
      throw new Error('Erreur lors de la récupération du module');
    }
  }

  /**
   * Mettre à jour le contenu d'un module
   */
  async updateModuleContent(moduleId: string, content: ModuleContent[]): Promise<ApiResponse<ModuleContent[]>> {
    try {
      return await apiService.put<ModuleContent[]>(`/modules/${moduleId}/content`, { content });
    } catch (error) {
      throw new Error('Erreur lors de la mise à jour du contenu du module');
    }
  }

  /**
   * Ajouter du contenu à un module
   */
  async addModuleContent(moduleId: string, content: Partial<ModuleContent>): Promise<ApiResponse<ModuleContent>> {
    try {
      return await apiService.post<ModuleContent>(`/modules/${moduleId}/content`, content);
    } catch (error) {
      throw new Error('Erreur lors de l\'ajout du contenu');
    }
  }

  /**
   * Supprimer du contenu d'un module
   */
  async deleteModuleContent(moduleId: string, contentId: string): Promise<ApiResponse<{ message: string }>> {
    try {
      return await apiService.delete<{ message: string }>(`/modules/${moduleId}/content/${contentId}`);
    } catch (error) {
      throw new Error('Erreur lors de la suppression du contenu');
    }
  }

  /**
   * Marquer un module comme terminé
   */
  async completeModule(moduleId: string): Promise<ApiResponse<Module>> {
    try {
      return await apiService.patch<Module>(`/modules/${moduleId}/complete`);
    } catch (error) {
      throw new Error('Erreur lors de la finalisation du module');
    }
  }

  /**
   * Récupérer le quiz d'un module
   */
  async getModuleQuiz(moduleId: string): Promise<ApiResponse<Quiz>> {
    try {
      return await apiService.get<Quiz>(`/modules/${moduleId}/quiz`);
    } catch (error) {
      throw new Error('Erreur lors de la récupération du quiz');
    }
  }

  /**
   * Mettre à jour le quiz d'un module
   */
  async updateModuleQuiz(moduleId: string, quiz: Partial<Quiz>): Promise<ApiResponse<Quiz>> {
    try {
      return await apiService.put<Quiz>(`/modules/${moduleId}/quiz`, quiz);
    } catch (error) {
      throw new Error('Erreur lors de la mise à jour du quiz');
    }
  }

  /**
   * Ajouter une question au quiz
   */
  async addQuizQuestion(quizId: string, question: Partial<QuizQuestion>): Promise<ApiResponse<QuizQuestion>> {
    try {
      return await apiService.post<QuizQuestion>(`/quizzes/${quizId}/questions`, question);
    } catch (error) {
      throw new Error('Erreur lors de l\'ajout de la question');
    }
  }

  /**
   * Mettre à jour une question de quiz
   */
  async updateQuizQuestion(questionId: string, question: Partial<QuizQuestion>): Promise<ApiResponse<QuizQuestion>> {
    try {
      return await apiService.put<QuizQuestion>(`/quiz-questions/${questionId}`, question);
    } catch (error) {
      throw new Error('Erreur lors de la mise à jour de la question');
    }
  }

  /**
   * Supprimer une question de quiz
   */
  async deleteQuizQuestion(questionId: string): Promise<ApiResponse<{ message: string }>> {
    try {
      return await apiService.delete<{ message: string }>(`/quiz-questions/${questionId}`);
    } catch (error) {
      throw new Error('Erreur lors de la suppression de la question');
    }
  }

  /**
   * Activer/désactiver un quiz
   */
  async toggleQuizStatus(quizId: string, isActive: boolean): Promise<ApiResponse<Quiz>> {
    try {
      return await apiService.patch<Quiz>(`/quizzes/${quizId}/status`, { isActive });
    } catch (error) {
      throw new Error('Erreur lors de la modification du statut du quiz');
    }
  }

  /**
   * Commencer une tentative de quiz
   */
  async startQuizAttempt(quizId: string): Promise<ApiResponse<QuizAttempt>> {
    try {
      return await apiService.post<QuizAttempt>(`/quizzes/${quizId}/attempts`);
    } catch (error) {
      throw new Error('Erreur lors du démarrage du quiz');
    }
  }

  /**
   * Soumettre une tentative de quiz
   */
  async submitQuizAttempt(attemptId: string, answers: any[]): Promise<ApiResponse<QuizAttempt>> {
    try {
      return await apiService.post<QuizAttempt>(`/quiz-attempts/${attemptId}/submit`, { answers });
    } catch (error) {
      throw new Error('Erreur lors de la soumission du quiz');
    }
  }

  /**
   * Récupérer les tentatives d'un quiz
   */
  async getQuizAttempts(quizId: string): Promise<ApiResponse<QuizAttempt[]>> {
    try {
      return await apiService.get<QuizAttempt[]>(`/quizzes/${quizId}/attempts`);
    } catch (error) {
      throw new Error('Erreur lors de la récupération des tentatives');
    }
  }
}

// Instance singleton du service
export const moduleService = new ModuleService();
export default moduleService;
