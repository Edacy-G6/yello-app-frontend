import { apiService, type ApiResponse } from './apiService';
import type {
  Classe,
  ClasseListDto,
  ClasseResponseDto,
  CreateClasseDto,
  UpdateClasseDto,
  EnrollStudentDto,
  ClasseStats,
  ClasseFilters,
  StudentInClass,
  AvailableStudent,
  EnrollmentStatus,
} from '../types/classe';

class ClasseService {
  private readonly baseEndpoint = '/classes';

  /**
   * Récupérer toutes les classes (public)
   */
  async getClasses(filters?: ClasseFilters): Promise<ApiResponse<ClasseListDto[]>> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.search) {
        params.append('search', filters.search);
      }
      if (filters?.status) {
        params.append('status', filters.status);
      }
      if (filters?.courseId) {
        params.append('courseId', filters.courseId);
      }
      if (filters?.startDate) {
        params.append('startDate', filters.startDate.toISOString());
      }
      if (filters?.endDate) {
        params.append('endDate', filters.endDate.toISOString());
      }

      const queryString = params.toString();
      const endpoint = queryString ? `${this.baseEndpoint}?${queryString}` : this.baseEndpoint;
      
      const response = await apiService.get<ClasseListDto[]>(endpoint);
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération des classes:', error);
      throw new Error('Erreur lors de la récupération des classes');
    }
  }

  /**
   * Récupérer une classe par ID
   */
  async getClasseById(id: string): Promise<ApiResponse<ClasseResponseDto>> {
    try {
      const response = await apiService.get<ClasseResponseDto>(`${this.baseEndpoint}/${id}`);
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération de la classe:', error);
      throw new Error('Erreur lors de la récupération de la classe');
    }
  }

  /**
   * Récupérer les classes d'un enseignant
   */
  async getClassesByTeacher(teacherId: string): Promise<ApiResponse<ClasseListDto[]>> {
    try {
      const response = await apiService.get<ClasseListDto[]>(`${this.baseEndpoint}/teacher/${teacherId}`);
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération des classes de l\'enseignant:', error);
      throw new Error('Erreur lors de la récupération des classes de l\'enseignant');
    }
  }

  /**
   * Récupérer les classes d'un étudiant
   */
  async getClassesByStudent(studentId: string): Promise<ApiResponse<ClasseListDto[]>> {
    try {
      const response = await apiService.get<ClasseListDto[]>(`${this.baseEndpoint}/student/${studentId}`);
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération des classes de l\'étudiant:', error);
      throw new Error('Erreur lors de la récupération des classes de l\'étudiant');
    }
  }

  /**
   * Créer une nouvelle classe
   */
  async createClasse(data: CreateClasseDto): Promise<ApiResponse<Classe>> {
    try {
      const response = await apiService.post<Classe>(this.baseEndpoint, data);
      return response;
    } catch (error) {
      console.error('Erreur lors de la création de la classe:', error);
      throw new Error('Erreur lors de la création de la classe');
    }
  }

  /**
   * Mettre à jour une classe
   */
  async updateClasse(id: string, data: UpdateClasseDto): Promise<ApiResponse<Classe>> {
    try {
      const response = await apiService.put<Classe>(`${this.baseEndpoint}/${id}`, data);
      return response;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la classe:', error);
      throw new Error('Erreur lors de la mise à jour de la classe');
    }
  }

  /**
   * Supprimer une classe
   */
  async deleteClasse(id: string): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await apiService.delete<{ message: string }>(`${this.baseEndpoint}/${id}`);
      return response;
    } catch (error) {
      console.error('Erreur lors de la suppression de la classe:', error);
      throw new Error('Erreur lors de la suppression de la classe');
    }
  }

  /**
   * Inscrire un étudiant à une classe
   */
  async enrollStudent(classId: string, studentId: string): Promise<ApiResponse<Classe>> {
    try {
      const data: EnrollStudentDto = { studentId };
      const response = await apiService.post<Classe>(`${this.baseEndpoint}/${classId}/enroll`, data);
      return response;
    } catch (error) {
      console.error('Erreur lors de l\'inscription de l\'étudiant:', error);
      throw new Error('Erreur lors de l\'inscription de l\'étudiant');
    }
  }

  /**
   * Désinscrire un étudiant d'une classe
   */
  async unenrollStudent(classId: string, studentId: string): Promise<ApiResponse<Classe>> {
    try {
      const response = await apiService.delete<Classe>(`${this.baseEndpoint}/${classId}/unenroll/${studentId}`);
      return response;
    } catch (error) {
      console.error('Erreur lors de la désinscription de l\'étudiant:', error);
      throw new Error('Erreur lors de la désinscription de l\'étudiant');
    }
  }

  /**
   * Récupérer les statistiques d'une classe
   */
  async getClassStats(classId: string): Promise<ApiResponse<ClasseStats>> {
    try {
      const response = await apiService.get<ClasseStats>(`${this.baseEndpoint}/${classId}/stats`);
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw new Error('Erreur lors de la récupération des statistiques');
    }
  }

  /**
   * Rechercher des classes
   */
  async searchClasses(query: string, filters?: Omit<ClasseFilters, 'search'>): Promise<ApiResponse<ClasseListDto[]>> {
    try {
      const searchFilters: ClasseFilters = {
        ...filters,
        search: query,
      };
      return this.getClasses(searchFilters);
    } catch (error) {
      console.error('Erreur lors de la recherche de classes:', error);
      throw new Error('Erreur lors de la recherche de classes');
    }
  }

  /**
   * Récupérer les classes actives d'un enseignant
   */
  async getActiveClassesByTeacher(teacherId: string): Promise<ApiResponse<ClasseListDto[]>> {
    try {
      const filters: ClasseFilters = {
        status: 'ACTIVE' as any, // Type assertion nécessaire
      };
      const response = await this.getClassesByTeacher(teacherId);
      
      // Filtrer côté client pour les classes actives
      if (response.success && response.data) {
        const activeClasses = response.data.filter(classe => classe.status === 'ACTIVE');
        return {
          ...response,
          data: activeClasses,
        };
      }
      
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération des classes actives:', error);
      throw new Error('Erreur lors de la récupération des classes actives');
    }
  }

  /**
   * Vérifier si une classe est complète (nombre d'étudiants = capacité max)
   */
  isClassFull(classe: ClasseListDto | Classe): boolean {
    return classe.currentStudents >= classe.maxStudents;
  }

  /**
   * Vérifier si une classe est active
   */
  isClassActive(classe: ClasseListDto | Classe): boolean {
    return classe.status === 'ACTIVE' && classe.isActive;
  }

  /**
   * Calculer le pourcentage d'occupation d'une classe
   */
  getClassOccupancyPercentage(classe: ClasseListDto | Classe): number {
    if (classe.maxStudents === 0) return 0;
    return Math.round((classe.currentStudents / classe.maxStudents) * 100);
  }

  /**
   * Formater la date pour l'affichage
   */
  formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  /**
   * Formater l'heure pour l'affichage
   */
  formatTime(time: string): string {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  }

  /**
   * Obtenir le nom du jour de la semaine
   */
  getDayName(dayOfWeek: number): string {
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    return days[dayOfWeek] || 'Inconnu';
  }

  /**
   * Récupérer la liste des étudiants d'une classe
   */
  async getClasseStudents(classId: string): Promise<ApiResponse<StudentInClass[]>> {
    try {
      const response = await apiService.get<StudentInClass[]>(`${this.baseEndpoint}/${classId}/students`);
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération des étudiants de la classe:', error);
      throw new Error('Erreur lors de la récupération des étudiants de la classe');
    }
  }

  /**
   * Récupérer les étudiants disponibles pour une classe
   */
  async getAvailableStudents(classId: string): Promise<ApiResponse<AvailableStudent[]>> {
    try {
      const response = await apiService.get<AvailableStudent[]>(`${this.baseEndpoint}/${classId}/available-students`);
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération des étudiants disponibles:', error);
      throw new Error('Erreur lors de la récupération des étudiants disponibles');
    }
  }

  /**
   * Mettre à jour le statut d'inscription d'un étudiant
   */
  async updateStudentStatus(
    classId: string,
    studentId: string,
    status: EnrollmentStatus,
  ): Promise<ApiResponse<Classe>> {
    try {
      const data = { status };
      const response = await apiService.put<Classe>(`${this.baseEndpoint}/${classId}/students/${studentId}/status`, data);
      return response;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut de l\'étudiant:', error);
      throw new Error('Erreur lors de la mise à jour du statut de l\'étudiant');
    }
  }
}

// Instance singleton du service
export const classeService = new ClasseService();
export default classeService;
