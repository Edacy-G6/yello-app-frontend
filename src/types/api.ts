/**
 * Types centralisés pour les réponses API
 * Format standardisé pour toute l'application
 */

// Interface standardisée pour toutes les réponses du backend
export interface StandardApiResponse<T = unknown> {
  isSuccess: boolean;
  message: string;
  payload: T;
  statusCode?: number;
  error?: string;
}

// Interface pour les réponses d'erreur
export interface ApiError {
  message: string;
  status: number;
  details?: unknown;
}

// Interface pour les réponses de succès (format frontend)
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
}

// Interface pour les réponses paginées
export interface PaginatedApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Types pour les réponses d'authentification
export interface AuthApiResponse {
  user: {
    _id?: string;
    id?: string;
    email: string;
    name: string;
    lastname?: string;
    role: string;
    authProvider?: string;
    active?: boolean;
    schoolId?: string;
    createdAt: string;
    updatedAt: string;
  };
  access_token: string;
  refresh_token: string;
  expires_in?: number;
}

export interface RegisterApiResponse {
  _id?: string;
  id?: string;
  email: string;
  name: string;
  lastname?: string;
  role: string;
  authProvider?: string;
  active?: boolean;
  schoolId?: string;
  createdAt: string;
  updatedAt: string;
}

// Types pour les réponses de cours
export interface CourseStatsResponse {
  totalCourses: number;
  publishedCourses: number;
  draftCourses: number;
  enrolledStudents: number;
}

// Utilitaires pour convertir les réponses
export class ApiResponseConverter {
  /**
   * Convertit une réponse backend standardisée en réponse frontend
   */
  static fromBackend<T>(backendResponse: StandardApiResponse<T>): ApiResponse<T> {
    return {
      success: backendResponse.isSuccess,
      message: backendResponse.message,
      data: backendResponse.payload,
      ...(backendResponse.error && { error: backendResponse.error }),
    };
  }

  /**
   * Crée une réponse de succès
   */
  static success<T>(message: string, data: T): ApiResponse<T> {
    return {
      success: true,
      message,
      data,
    };
  }

  /**
   * Crée une réponse d'erreur
   */
  static error<T>(message: string, error?: string): ApiResponse<T> {
    return {
      success: false,
      message,
      data: null as T,
      ...(error && { error }),
    };
  }

  /**
   * Crée une réponse paginée
   */
  static paginated<T>(
    message: string,
    data: T[],
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    }
  ): PaginatedApiResponse<T> {
    return {
      success: true,
      message,
      data,
      pagination,
    };
  }
}
