import { useState, useCallback, useRef } from 'react';
import { courseService } from '../services/courseService';
import { useNotifications } from '../components/ui/notification';
import type { 
  GenerateCourseFromFileData, 
  GenerationProgress, 
  GenerationStatus,
  Course 
} from '../types/course';

interface UseCourseGenerationAdvancedReturn {
  // État de génération
  isGenerating: boolean;
  generationProgress: GenerationProgress | null;
  generatedCourse: Course | null;
  error: string | null;
  currentStep: string;
  estimatedTimeRemaining: number;

  // Actions
  generateCourse: (file: File, data: GenerateCourseFromFileData) => Promise<void>;
  cancelGeneration: () => void;
  retryGeneration: () => void;
  clearGeneration: () => void;
  resetError: () => void;

  // Statistiques
  totalGenerationTime: number;
  averageGenerationTime: number;
}

interface GenerationStats {
  totalTime: number;
  count: number;
  averageTime: number;
}

export const useCourseGenerationAdvanced = (): UseCourseGenerationAdvancedReturn => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState<GenerationProgress | null>(null);
  const [generatedCourse, setGeneratedCourse] = useState<Course | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState<number>(0);
  
  const [stats, setStats] = useState<GenerationStats>({
    totalTime: 0,
    count: 0,
    averageTime: 0,
  });

  const startTimeRef = useRef<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const currentFileRef = useRef<File | null>(null);
  const currentDataRef = useRef<GenerateCourseFromFileData | null>(null);

  const { success, error: showError, warning, info } = useNotifications();

  const updateStats = useCallback((generationTime: number) => {
    setStats(prev => {
      const newCount = prev.count + 1;
      const newTotalTime = prev.totalTime + generationTime;
      const newAverageTime = newTotalTime / newCount;
      
      return {
        totalTime: newTotalTime,
        count: newCount,
        averageTime: newAverageTime,
      };
    });
  }, []);

  const estimateTimeRemaining = useCallback((progress: number) => {
    if (startTimeRef.current === 0 || progress === 0) {
      setEstimatedTimeRemaining(0);
      return;
    }

    const elapsedTime = Date.now() - startTimeRef.current;
    const totalEstimatedTime = (elapsedTime / progress) * 100;
    const remaining = Math.max(0, totalEstimatedTime - elapsedTime);
    
    setEstimatedTimeRemaining(Math.round(remaining / 1000)); // en secondes
  }, []);

  const generateCourse = useCallback(async (file: File, data: GenerateCourseFromFileData) => {
    try {
      setIsGenerating(true);
      setError(null);
      setGeneratedCourse(null);
      setCurrentStep('Initialisation...');
      setEstimatedTimeRemaining(0);
      
      // Sauvegarder les données pour le retry
      currentFileRef.current = file;
      currentDataRef.current = data;
      
      // Créer un AbortController pour pouvoir annuler
      abortControllerRef.current = new AbortController();
      startTimeRef.current = Date.now();

      info('Début de la génération du cours', 'Génération');

      // Validation du fichier
      if (!file || file.size === 0) {
        throw new Error('Aucun fichier valide fourni');
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

      // Validation des données
      if (!data.title?.trim() || !data.subject?.trim()) {
        throw new Error('Le titre et la matière sont obligatoires');
      }

      setCurrentStep('Upload du fichier...');

      // Lancer la génération
      const response = await courseService.generateCourseFromFile(file, data);
      
      if (response.success && response.data) {
        setGenerationProgress(response.data);
        setCurrentStep('Génération en cours...');
        
        // Commencer le polling si la génération est en cours
        if (response.data.status === 'pending' || response.data.status === 'processing') {
          await pollGenerationStatus(response.data.generationId);
        } else if (response.data.status === 'completed') {
          const generationTime = Date.now() - startTimeRef.current;
          updateStats(generationTime);
          setGeneratedCourse(response.data.courseData);
          setIsGenerating(false);
          success('Cours généré avec succès !', 'Génération terminée');
        } else if (response.data.status === 'failed') {
          throw new Error(response.data.error || 'Erreur lors de la génération');
        }
      } else {
        throw new Error(response.message || 'Erreur lors de la génération');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      setIsGenerating(false);
      showError(errorMessage, 'Erreur de génération');
    }
  }, [success, showError, info, updateStats]);

  const pollGenerationStatus = useCallback(async (generationId: string) => {
    const maxPollTime = 10 * 60 * 1000; // 10 minutes for advanced generation
    const startTime = Date.now();
    let delay = 2000; // 2 secondes

    try {
      const poll = async (): Promise<void> => {
        if (Date.now() - startTime > maxPollTime) {
          throw new Error('La génération a pris trop de temps.');
        }

        // Vérifier si la génération a été annulée
        if (abortControllerRef.current?.signal.aborted) {
          return;
        }

        const response = await courseService.getGenerationStatus(generationId);
        
        if (response.success && response.data) {
          const progress = response.data;
          setGenerationProgress(progress);
          
          // Mettre à jour l'estimation du temps restant
          estimateTimeRemaining(progress.progress);
          
          // Mettre à jour l'étape actuelle
          setCurrentStep(progress.message || 'Génération en cours...');
          
          if (progress.status === 'completed') {
            const generationTime = Date.now() - startTimeRef.current;
            updateStats(generationTime);
            setGeneratedCourse(progress.courseData);
            setIsGenerating(false);
            setCurrentStep('Terminé');
            setEstimatedTimeRemaining(0);
            success('Cours généré avec succès !', 'Génération terminée');
            return;
          } else if (progress.status === 'failed') {
            throw new Error(progress.error || 'Erreur lors de la génération');
          } else if (progress.status === 'processing' || progress.status === 'pending') {
            // Exponential backoff with jitter
            delay = Math.min(delay * 1.5, 30000); // Augmenter de 50%, max 30s
            const jitter = delay * 0.1 * Math.random();
            console.log(`Polling again in ${Math.round((delay + jitter)/1000)}s`);
            setTimeout(poll, delay + jitter);
          }
        } else {
          throw new Error(response.message || 'Erreur lors de la récupération du statut');
        }
      };

      await poll();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du polling';
      setError(errorMessage);
      setIsGenerating(false);
      showError(errorMessage, 'Erreur de génération');
    }
  }, [success, showError, estimateTimeRemaining, updateStats]);

  const cancelGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsGenerating(false);
    setCurrentStep('Annulé');
    warning('Génération annulée', 'Action utilisateur');
  }, [warning]);

  const retryGeneration = useCallback(() => {
    if (currentFileRef.current && currentDataRef.current) {
      setError(null);
      generateCourse(currentFileRef.current, currentDataRef.current);
    }
  }, [generateCourse]);

  const clearGeneration = useCallback(() => {
    setIsGenerating(false);
    setGenerationProgress(null);
    setGeneratedCourse(null);
    setError(null);
    setCurrentStep('');
    setEstimatedTimeRemaining(0);
    currentFileRef.current = null;
    currentDataRef.current = null;
    abortControllerRef.current = null;
  }, []);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isGenerating,
    generationProgress,
    generatedCourse,
    error,
    currentStep,
    estimatedTimeRemaining,
    generateCourse,
    cancelGeneration,
    retryGeneration,
    clearGeneration,
    resetError,
    totalGenerationTime: stats.totalTime,
    averageGenerationTime: stats.averageTime,
  };
};
