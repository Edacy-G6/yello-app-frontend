import { useState, useCallback } from 'react';
import { courseService } from '../services/courseService';
import type { 
  GenerateCourseFromFileData, 
  GenerationProgress, 
  GenerationStatus,
  Course 
} from '../types/course';

interface UseCourseGenerationReturn {
  // État de génération
  isGenerating: boolean;
  generationProgress: GenerationProgress | null;
  generatedCourse: Course | null;
  error: string | null;

  // Actions
  generateCourse: (file: File, data: GenerateCourseFromFileData) => Promise<void>;
  pollGenerationStatus: (generationId: string) => Promise<void>;
  clearGeneration: () => void;
  resetError: () => void;
}

export const useCourseGeneration = (): UseCourseGenerationReturn => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState<GenerationProgress | null>(null);
  const [generatedCourse, setGeneratedCourse] = useState<Course | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateCourse = useCallback(async (file: File, data: GenerateCourseFromFileData) => {
    try {
      setIsGenerating(true);
      setError(null);
      setGeneratedCourse(null);

      // Validation du fichier
      if (!file) {
        throw new Error('Aucun fichier sélectionné');
      }

      const allowedTypes = [
        'application/pdf',
        'text/plain',
        'text/markdown',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];

      if (!allowedTypes.includes(file.type)) {
        throw new Error('Type de fichier non supporté. Formats acceptés: PDF, TXT, MD, DOC, DOCX');
      }

      // Limite de taille (10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error('Fichier trop volumineux. Taille maximale: 10MB');
      }

      // Lancer la génération
      const response = await courseService.generateCourseFromFile(file, data);
      
      if (response.success && response.data) {
        setGenerationProgress(response.data);
        
        // Commencer le polling si la génération est en cours
        if (response.data.status === 'pending' || response.data.status === 'processing') {
          await pollGenerationStatus(response.data.generationId);
        } else if (response.data.status === 'completed') {
          setGeneratedCourse(response.data.courseData);
          setIsGenerating(false);
        } else if (response.data.status === 'failed') {
          setError(response.data.error || 'Erreur lors de la génération');
          setIsGenerating(false);
        }
      } else {
        throw new Error(response.message || 'Erreur lors de la génération');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      setIsGenerating(false);
    }
  }, []);

  const pollGenerationStatus = useCallback(async (generationId: string) => {
    try {
      const poll = async (): Promise<void> => {
        const response = await courseService.getGenerationStatus(generationId);
        
        if (response.success && response.data) {
          const progress = response.data;
          setGenerationProgress(progress);
          
          if (progress.status === 'completed') {
            setGeneratedCourse(progress.courseData);
            setIsGenerating(false);
            return;
          } else if (progress.status === 'failed') {
            setError(progress.error || 'Erreur lors de la génération');
            setIsGenerating(false);
            return;
          } else if (progress.status === 'processing' || progress.status === 'pending') {
            // Continuer le polling après 2 secondes
            setTimeout(poll, 2000);
          }
        } else {
          setError(response.message || 'Erreur lors de la récupération du statut');
          setIsGenerating(false);
        }
      };

      await poll();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du polling';
      setError(errorMessage);
      setIsGenerating(false);
    }
  }, []);

  const clearGeneration = useCallback(() => {
    setIsGenerating(false);
    setGenerationProgress(null);
    setGeneratedCourse(null);
    setError(null);
  }, []);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isGenerating,
    generationProgress,
    generatedCourse,
    error,
    generateCourse,
    pollGenerationStatus,
    clearGeneration,
    resetError,
  };
};
