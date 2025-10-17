import { useState, useEffect, useCallback } from 'react';
import { classeService } from '../services/classeService';
import type {
  Classe,
  ClasseListDto,
  ClasseResponseDto,
  CreateClasseDto,
  UpdateClasseDto,
  ClasseStats,
  ClasseFilters,
  UseClassesOptions,
  UseClasseOptions,
} from '../types/classe';
import { useAuth } from './useAuth';

/**
 * Hook pour récupérer les classes d'un enseignant
 */
export function useClasses(options: UseClassesOptions = {}) {
  const { user } = useAuth();
  const [classes, setClasses] = useState<ClasseListDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClasses = useCallback(async () => {
    if (!options.enabled && options.enabled !== undefined) return;
    
    try {
      setLoading(true);
      setError(null);
      
      let response;
      
      if (options.teacherId) {
        response = await classeService.getClassesByTeacher(options.teacherId);
      } else if (options.studentId) {
        response = await classeService.getClassesByStudent(options.studentId);
      } else if (user?.role === 'teacher') {
        response = await classeService.getClassesByTeacher(user.id);
      } else {
        response = await classeService.getClasses(options.filters);
      }

      if (response.success && response.data) {
        setClasses(response.data);
      } else {
        setError(response.message || 'Erreur lors de la récupération des classes');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [options.teacherId, options.studentId, options.filters, options.enabled, user]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const refetch = useCallback(() => {
    fetchClasses();
  }, [fetchClasses]);

  return {
    classes,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook pour récupérer une classe spécifique
 */
export function useClasse(options: UseClasseOptions) {
  const [classe, setClasse] = useState<ClasseResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClasse = useCallback(async () => {
    if (!options.enabled && options.enabled !== undefined) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await classeService.getClasseById(options.classId);

      if (response.success && response.data) {
        setClasse(response.data);
      } else {
        setError(response.message || 'Erreur lors de la récupération de la classe');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [options.classId, options.enabled]);

  useEffect(() => {
    fetchClasse();
  }, [fetchClasse]);

  const refetch = useCallback(() => {
    fetchClasse();
  }, [fetchClasse]);

  return {
    classe,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook pour récupérer les statistiques d'une classe
 */
export function useClasseStats(classId: string, enabled: boolean = true) {
  const [stats, setStats] = useState<ClasseStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!enabled) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await classeService.getClassStats(classId);

      if (response.success && response.data) {
        setStats(response.data);
      } else {
        setError(response.message || 'Erreur lors de la récupération des statistiques');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [classId, enabled]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const refetch = useCallback(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook pour créer une classe
 */
export function useCreateClasse() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createClasse = useCallback(async (data: CreateClasseDto) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await classeService.createClasse(data);

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || 'Erreur lors de la création de la classe');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createClasse,
    loading,
    error,
  };
}

/**
 * Hook pour mettre à jour une classe
 */
export function useUpdateClasse() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateClasse = useCallback(async (id: string, data: UpdateClasseDto) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await classeService.updateClasse(id, data);

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || 'Erreur lors de la mise à jour de la classe');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    updateClasse,
    loading,
    error,
  };
}

/**
 * Hook pour supprimer une classe
 */
export function useDeleteClasse() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteClasse = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await classeService.deleteClasse(id);

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || 'Erreur lors de la suppression de la classe');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    deleteClasse,
    loading,
    error,
  };
}

/**
 * Hook pour inscrire un étudiant à une classe
 */
export function useEnrollStudent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enrollStudent = useCallback(async (classId: string, studentId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await classeService.enrollStudent(classId, studentId);

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || 'Erreur lors de l\'inscription de l\'étudiant');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    enrollStudent,
    loading,
    error,
  };
}

/**
 * Hook pour désinscrire un étudiant d'une classe
 */
export function useUnenrollStudent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const unenrollStudent = useCallback(async (classId: string, studentId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await classeService.unenrollStudent(classId, studentId);

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || 'Erreur lors de la désinscription de l\'étudiant');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    unenrollStudent,
    loading,
    error,
  };
}

/**
 * Hook pour rechercher des classes
 */
export function useSearchClasses() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchClasses = useCallback(async (query: string, filters?: Omit<ClasseFilters, 'search'>) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await classeService.searchClasses(query, filters);

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || 'Erreur lors de la recherche de classes');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    searchClasses,
    loading,
    error,
  };
}
