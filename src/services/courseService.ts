import { apiService } from './apiService';
import type { ApiResponse } from '../types/api';
import type {
  Course,
  CreateCourseData,
  UpdateCourseData,
  GenerateCourseFromFileData,
  GenerationProgress,
} from '../types/course';

class CourseService {
  /**
   * Récupère tous les cours de l'enseignant connecté
   */
  async getCourses(): Promise<ApiResponse<Course[]>> {
    try {
      return await apiService.get<Course[]>('/courses');
    } catch (error) {
      console.error('Erreur lors de la récupération des cours:', error);
      throw new Error('Erreur lors de la récupération des cours');
    }
  }

  /**
   * Récupère un cours par son ID
   */
  async getCourseById(courseId: string): Promise<ApiResponse<Course>> {
    try {
      return await apiService.get<Course>(`/courses/${courseId}`);
    } catch (error) {
      console.error('Erreur lors de la récupération du cours:', error);
      throw new Error('Erreur lors de la récupération du cours');
    }
  }

  /**
   * Crée un nouveau cours
   */
  async createCourse(courseData: CreateCourseData): Promise<ApiResponse<Course>> {
    try {
      return await apiService.post<Course>('/courses', courseData);
    } catch (error) {
      console.error('Erreur lors de la création du cours:', error);
      throw new Error('Erreur lors de la création du cours');
    }
  }

  /**
   * Met à jour un cours existant
   */
  async updateCourse(courseId: string, courseData: UpdateCourseData): Promise<ApiResponse<Course>> {
    try {
      return await apiService.put<Course>(`/courses/${courseId}`, courseData);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du cours:', error);
      throw new Error('Erreur lors de la mise à jour du cours');
    }
  }

  /**
   * Supprime un cours
   */
  async deleteCourse(courseId: string): Promise<ApiResponse<null>> {
    try {
      return await apiService.delete<null>(`/courses/${courseId}`);
    } catch (error) {
      console.error('Erreur lors de la suppression du cours:', error);
      throw new Error('Erreur lors de la suppression du cours');
    }
  }

  /**
   * Génère un cours à partir d'un fichier uploadé
   */
  async generateCourseFromFile(
    file: File,
    generateData: GenerateCourseFromFileData
  ): Promise<ApiResponse<GenerationProgress>> {
    try {
      // Validation du fichier
      if (!file || file.size === 0) {
        throw new Error('Aucun fichier valide fourni');
      }

      // Validation des données
      if (!generateData.title?.trim() || !generateData.subject?.trim()) {
        throw new Error('Le titre et la matière sont obligatoires');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', generateData.title.trim());
      formData.append('subject', generateData.subject.trim());
      formData.append('level', generateData.level || 'beginner');
      
      if (generateData.description?.trim()) {
        formData.append('description', generateData.description.trim());
      }
      
      if (generateData.tags?.trim()) {
        formData.append('tags', generateData.tags.trim());
      }

      return await apiService.post<GenerationProgress>('/courses/generate-from-file', formData, {
        timeout: 300000, // 5 minutes timeout
      });
    } catch (error) {
      console.error('Erreur lors de la génération du cours:', error);
      
      // Gestion d'erreurs spécifiques
      if (error instanceof Error) {
        if (error.message.includes('timeout')) {
          throw new Error('La génération du cours a pris trop de temps. Veuillez réessayer avec un fichier plus petit.');
        } else if (error.message.includes('Network Error')) {
          throw new Error('Erreur de connexion. Vérifiez votre connexion internet.');
        } else if (error.message.includes('413')) {
          throw new Error('Fichier trop volumineux. Taille maximale: 10MB');
        } else if (error.message.includes('400')) {
          throw new Error('Format de fichier non supporté. Utilisez PDF, TXT ou MD.');
        }
      }
      
      throw new Error('Erreur lors de la génération du cours');
    }
  }

  /**
   * Met à jour le statut d'un cours
   */
  async updateCourseStatus(courseId: string, status: string): Promise<ApiResponse<Course>> {
    try {
      return await apiService.put<Course>(`/courses/${courseId}/status`, { status });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      throw new Error('Erreur lors de la mise à jour du statut');
    }
  }

  /**
   * Publie un cours
   */
  async publishCourse(courseId: string): Promise<ApiResponse<Course>> {
    try {
      return await apiService.put<Course>(`/courses/${courseId}/publish`, {});
    } catch (error) {
      console.error('Erreur lors de la publication du cours:', error);
      throw new Error('Erreur lors de la publication du cours');
    }
  }

  /**
   * Inscrit un étudiant à un cours
   */
  async enrollStudent(courseId: string, studentId: string): Promise<ApiResponse<Course>> {
    try {
      return await apiService.post<Course>(`/courses/${courseId}/enroll`, { studentId });
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      throw new Error('Erreur lors de l\'inscription');
    }
  }

  /**
   * Récupère le statut d'une génération de cours
   */
  async getGenerationStatus(generationId: string): Promise<ApiResponse<GenerationProgress>> {
    try {
      return await apiService.get<GenerationProgress>(`/courses/generation/${generationId}/status`);
    } catch (error) {
      console.error('Erreur lors de la récupération du statut:', error);
      
      // Gestion spécifique des erreurs de throttling
      if (error instanceof Error) {
        if (error.message.includes('429')) {
          throw new Error('Trop de requêtes. Veuillez patienter avant de réessayer.');
        } else if (error.message.includes('timeout')) {
          throw new Error('La requête a pris trop de temps. Veuillez réessayer.');
        } else if (error.message.includes('Network Error')) {
          throw new Error('Erreur de connexion. Vérifiez votre connexion internet.');
        }
      }
      
      throw new Error('Erreur lors de la récupération du statut');
    }
  }

  /**
   * Récupère les statistiques des cours de l'enseignant
   */
  async getCourseStats(): Promise<ApiResponse<{
    totalCourses: number;
    totalStudents: number;
    completionRate: number;
    averageScore: number;
    publishedCourses: number;
    draftCourses: number;
    enrolledStudents: number;
  }>> {
    try {
      return await apiService.get<{
        totalCourses: number;
        totalStudents: number;
        completionRate: number;
        averageScore: number;
        publishedCourses: number;
        draftCourses: number;
        enrolledStudents: number;
      }>('/courses/stats');
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw new Error('Erreur lors de la récupération des statistiques');
    }
  }

  /**
   * Polling pour suivre le statut d'une génération
   */
  async pollGenerationStatus(
    generationId: string,
    onProgress: (progress: GenerationProgress) => void,
    onComplete: (progress: GenerationProgress) => void,
    onError: (error: string) => void,
    interval: number = 2000
  ): Promise<void> {
    const poll = async () => {
      try {
        const response = await this.getGenerationStatus(generationId);
        
        if (response.success && response.data) {
          const progress = response.data;
          
          onProgress(progress);
          
          if (progress.status === 'completed') {
            onComplete(progress);
            return;
          } else if (progress.status === 'failed') {
            onError(progress.error || 'Erreur inconnue lors de la génération');
            return;
          } else {
            // Continuer le polling
            setTimeout(poll, interval);
          }
        } else {
          onError('Erreur lors de la récupération du statut');
        }
      } catch (error) {
        onError(error instanceof Error ? error.message : 'Erreur inconnue');
      }
    };

    poll();
  }
}

export const courseService = new CourseService();
export default courseService;