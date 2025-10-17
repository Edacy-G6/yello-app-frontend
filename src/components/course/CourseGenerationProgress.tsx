import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Clock, 
  FileText, 
  Brain, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  Loader2,
  RefreshCw,
  X
} from 'lucide-react';
import type { GenerationProgress, GenerationStatus } from '../../types/course';

interface CourseGenerationProgressProps {
  progress: GenerationProgress | null;
  currentStep: string;
  estimatedTimeRemaining: number;
  isGenerating: boolean;
  error: string | null;
  onCancel: () => void;
  onRetry: () => void;
  onClear: () => void;
}

export function CourseGenerationProgress({
  progress,
  currentStep,
  estimatedTimeRemaining,
  isGenerating,
  error,
  onCancel,
  onRetry,
  onClear,
}: CourseGenerationProgressProps) {
  if (!progress && !error && !isGenerating) {
    return null;
  }

  const getStatusIcon = (status: GenerationStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'processing':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: GenerationStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: GenerationStatus) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'processing':
        return 'Génération en cours';
      case 'completed':
        return 'Terminé';
      case 'failed':
        return 'Échec';
      default:
        return 'Inconnu';
    }
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds}s`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours}h ${minutes}m`;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Génération de cours
          </CardTitle>
          <div className="flex items-center gap-2">
            {progress && (
              <Badge className={getStatusColor(progress.status)}>
                {getStatusIcon(progress.status)}
                <span className="ml-1">{getStatusText(progress.status)}</span>
              </Badge>
            )}
            {isGenerating && (
              <Button
                variant="outline"
                size="sm"
                onClick={onCancel}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4 mr-1" />
                Annuler
              </Button>
            )}
            {error && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                className="text-blue-600 hover:text-blue-700"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Réessayer
              </Button>
            )}
            {!isGenerating && !error && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClear}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progression */}
        {progress && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Progression</span>
              <span className="text-muted-foreground">{progress.progress}%</span>
            </div>
            <Progress value={progress.progress} className="w-full" />
          </div>
        )}

        {/* Étape actuelle */}
        {currentStep && (
          <div className="flex items-center gap-2 text-sm">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Étape actuelle :</span>
            <span className="font-medium">{currentStep}</span>
          </div>
        )}

        {/* Temps estimé restant */}
        {estimatedTimeRemaining > 0 && isGenerating && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Temps estimé restant : {formatTime(estimatedTimeRemaining)}</span>
          </div>
        )}

        {/* Message de statut */}
        {progress?.message && (
          <div className="text-sm text-muted-foreground">
            {progress.message}
          </div>
        )}

        {/* Erreur */}
        {error && (
          <div className="rounded-md bg-red-50 p-3 border border-red-200">
            <div className="flex items-start gap-2">
              <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-red-800">Erreur de génération</h4>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Détails de la génération */}
        {progress && (
          <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
            <div>
              <span className="font-medium">ID de génération :</span>
              <br />
              <code className="bg-gray-100 px-1 rounded">
                {progress.generationId.substring(0, 8)}...
              </code>
            </div>
            <div>
              <span className="font-medium">Dernière mise à jour :</span>
              <br />
              {new Date(progress.updatedAt).toLocaleTimeString()}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
