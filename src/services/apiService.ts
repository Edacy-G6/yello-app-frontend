import { API_BASE_URL, STORAGE_KEYS } from '../constants';
import type { 
  ApiResponse, 
  ApiError
} from '../types/api';
import { ApiResponseConverter } from '../types/api';

// Configuration par défaut pour fetch
const defaultHeaders = {
  'Content-Type': 'application/json',
};

interface RequestOptions extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

class ApiService {
  private baseURL: string;
  private defaultTimeout: number = 30000; // 30 secondes par défaut
  private defaultRetries: number = 3;
  private defaultRetryDelay: number = 1000; // 1 seconde

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  /**
   * Récupère le token d'authentification depuis le localStorage
   */
  private getAuthToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  }

  /**
   * Construit les headers avec l'authentification
   */
  private getHeaders(customHeaders: Record<string, string> = {}): Record<string, string> {
    const token = this.getAuthToken();
    const headers: Record<string, string> = { ...defaultHeaders, ...customHeaders };

    console.log('ApiService - Token récupéré:', token ? 'Présent' : 'Absent');
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('ApiService - Authorization header ajouté');
    } else {
      console.log('ApiService - Aucun token trouvé, requête sans authentification');
    }

    console.log('ApiService - Headers finaux:', headers);
    return headers;
  }

  /**
   * Gère les erreurs HTTP et convertit les réponses
   */
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      let errorMessage = 'Une erreur est survenue';
      let errorDetails;

      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
        errorDetails = errorData;
      } catch {
        // Si la réponse n'est pas du JSON, utiliser le message par défaut
        errorMessage = response.statusText || errorMessage;
      }

      const error: ApiError = {
        message: errorMessage,
        status: response.status,
        details: errorDetails,
      };

      throw error;
    }

    try {
      const data = await response.json();
      
      // Vérifier si c'est une réponse backend standardisée
      if (this.isStandardBackendResponse(data)) {
        const backendResponse = data as {
          isSuccess: boolean;
          message: string;
          data?: unknown;
          payload?: unknown;
          error?: string;
        };
        // Convertir ResponseDto (avec 'data') vers ApiResponse (avec 'success')
        return {
          success: backendResponse.isSuccess,
          message: backendResponse.message,
          data: (backendResponse.data || backendResponse.payload) as T,
          ...(backendResponse.error && { error: backendResponse.error }),
        };
      }
      
      // Sinon, retourner la réponse telle quelle (pour compatibilité)
      return data;
    } catch {
      // Si la réponse n'est pas du JSON valide
      return ApiResponseConverter.success('Succès', {} as T);
    }
  }

  /**
   * Vérifie si la réponse est au format backend standardisé
   */
  private isStandardBackendResponse(data: unknown): boolean {
    return (
      typeof data === 'object' &&
      data !== null &&
      'isSuccess' in data &&
      'message' in data &&
      ('payload' in data || 'data' in data)
    );
  }

  /**
   * Méthode GET générique
   */
  async get<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
      ...options,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * Exécute une requête avec timeout et retry
   */
  private async executeRequestWithRetry(
    url: string,
    options: RequestOptions
  ): Promise<Response> {
    const timeout = options.timeout || this.defaultTimeout;
    const retries = options.retries || this.defaultRetries;
    const retryDelay = options.retryDelay || this.defaultRetryDelay;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        // Créer un AbortController pour le timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        return response;
      } catch (error) {
        // Si c'est la dernière tentative ou si l'erreur n'est pas liée au réseau, relancer
        if (attempt === retries || !this.isRetryableError(error)) {
          throw error;
        }

        // Attendre avant de réessayer
        await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, attempt)));
      }
    }

    throw new Error('Nombre maximum de tentatives atteint');
  }

  /**
   * Détermine si une erreur peut être retentée
   */
  private isRetryableError(error: unknown): boolean {
    if (error instanceof Error) {
      return (
        error.name === 'AbortError' ||
        error.message.includes('Network Error') ||
        error.message.includes('fetch')
      );
    }
    return false;
  }

  /**
   * Méthode POST générique
   */
  async post<T>(
    endpoint: string,
    data?: unknown,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const fetchOptions: RequestOptions = {
      method: 'POST',
      headers: this.getHeaders(),
      ...options,
    };

    if (data !== undefined && !(data instanceof FormData)) {
      fetchOptions.body = JSON.stringify(data);
    } else if (data instanceof FormData) {
      console.log('ApiService - Traitement FormData');
      console.log('ApiService - Headers avant suppression Content-Type:', fetchOptions.headers);
      
      fetchOptions.body = data;
      // Ne pas définir Content-Type pour FormData, le navigateur le fera automatiquement
      // Mais garder l'Authorization header
      const headers = fetchOptions.headers as Record<string, string>;
      const authHeader = headers?.['Authorization'];
      console.log('ApiService - Auth header à préserver:', authHeader);
      
      delete headers?.['Content-Type'];
      console.log('ApiService - Headers après suppression Content-Type:', headers);
      
      if (authHeader) {
        headers!['Authorization'] = authHeader;
        console.log('ApiService - Auth header restauré');
      } else {
        console.log('ApiService - Aucun auth header à restaurer');
      }
      
      console.log('ApiService - Headers finaux FormData:', fetchOptions.headers);
    }
    
    const response = await this.executeRequestWithRetry(url, fetchOptions);

    return this.handleResponse<T>(response);
  }

  /**
   * Méthode PUT générique
   */
  async put<T>(
    endpoint: string,
    data?: unknown,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const fetchOptions: RequestInit = {
      method: 'PUT',
      headers: this.getHeaders(),
      ...options,
    };

    if (data !== undefined) {
      fetchOptions.body = JSON.stringify(data);
    }
    
    const response = await fetch(url, fetchOptions);

    return this.handleResponse<T>(response);
  }

  /**
   * Méthode PATCH générique
   */
  async patch<T>(
    endpoint: string,
    data?: unknown,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const fetchOptions: RequestInit = {
      method: 'PATCH',
      headers: this.getHeaders(),
      ...options,
    };

    if (data !== undefined) {
      fetchOptions.body = JSON.stringify(data);
    }
    
    const response = await fetch(url, fetchOptions);

    return this.handleResponse<T>(response);
  }

  /**
   * Méthode DELETE générique
   */
  async delete<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.getHeaders(),
      ...options,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * Upload de fichier avec FormData
   */
  async uploadFile<T>(
    endpoint: string,
    file: File,
    additionalData: Record<string, unknown> = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    const formData = new FormData();
    
    formData.append('file', file);
    
    // Ajouter les données supplémentaires
    Object.entries(additionalData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });

    const token = this.getAuthToken();
    const headers: Record<string, string> = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * Méthode pour les requêtes sans authentification
   */
  async publicGet<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: defaultHeaders,
      ...options,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * Méthode pour les requêtes publiques POST
   */
  async publicPost<T>(
    endpoint: string,
    data?: unknown,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const fetchOptions: RequestInit = {
      method: 'POST',
      headers: defaultHeaders,
      ...options,
    };

    if (data !== undefined) {
      fetchOptions.body = JSON.stringify(data);
    }
    
    const response = await fetch(url, fetchOptions);

    return this.handleResponse<T>(response);
  }
}

// Instance singleton du service API
export const apiService = new ApiService();
export default apiService;
