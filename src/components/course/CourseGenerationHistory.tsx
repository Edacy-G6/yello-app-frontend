import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Eye,
  RefreshCw
} from 'lucide-react';
import { courseService } from '../../services/courseService';
import type { GenerationProgress, GenerationStatus } from '../../types/course';

interface CourseGenerationHistoryProps {
  onViewGeneration?: (generation: GenerationProgress) => void;
}

export const CourseGenerationHistory: React.FC<CourseGenerationHistoryProps> = ({
  onViewGeneration,
}) => {
  const [generations, setGenerations] = useState<GenerationProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGenerations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Pour l'instant, on simule des données car l'endpoint n'existe pas encore
      // const response = await courseService.getGenerationHistory();
      // if (response.success && response.data) {
      //   setGenerations(response.data);
      // }
      
      // Données simulées pour la démonstration
      const mockGenerations: GenerationProgress[] = [
        {
          generationId: '1',
          status: 'completed',
          progress: 100,
          message: 'Cours généré avec succès',
          createdAt: new Date(Date.now() - 1000 * 60 * 30), // Il y a 30 minutes
          updatedAt: new Date(Date.now() - 1000 * 60 * 30),
        },
        {
          generationId: '2',
          status: 'processing',
          progress: 75,
          message: 'Génération des quiz...',
          createdAt: new Date(Date.now() - 1000 * 60 * 5), // Il y a 5 minutes
          updatedAt: new Date(Date.now() - 1000 * 60 * 2), // Mis à jour il y a 2 minutes
        },
        {
          generationId: '3',
          status: 'failed',
          progress: 45,
          message: 'Erreur lors du traitement',
          error: 'Fichier corrompu',
          createdAt: new Date(Date.now() - 1000 * 60 * 60), // Il y a 1 heure
          updatedAt: new Date(Date.now() - 1000 * 60 * 55), // Il y a 55 minutes
        },
      ];
      
      setGenerations(mockGenerations);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGenerations();
  }, []);

  const getStatusIcon = (status: GenerationStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'processing':
        return <AlertCircle className="h-5 w-5 text-blue-500 animate-pulse" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: GenerationStatus) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'failed':
        return 'destructive';
      case 'processing':
        return 'secondary';
      case 'pending':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getStatusText = (status: GenerationStatus) => {
    switch (status) {
      case 'completed':
        return 'Terminé';
      case 'failed':
        return 'Échoué';
      case 'processing':
        return 'En cours';
      case 'pending':
        return 'En attente';
      default:
        return 'Inconnu';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'À l\'instant';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historique des générations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin mr-2" />
            Chargement...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historique des générations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchGenerations} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Réessayer
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (generations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historique des générations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Aucune génération trouvée</p>
            <p className="text-sm text-gray-500">
              Vos générations de cours apparaîtront ici
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Historique des générations
          <Button onClick={fetchGenerations} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {generations.map((generation) => (
            <div
              key={generation.generationId}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getStatusIcon(generation.status)}
                  <div>
                    <h4 className="font-medium">Génération #{generation.generationId}</h4>
                    <p className="text-sm text-gray-600">
                      {formatRelativeTime(generation.updatedAt)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusColor(generation.status)}>
                    {getStatusText(generation.status)}
                  </Badge>
                  {generation.status === 'completed' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewGeneration?.(generation)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Voir
                    </Button>
                  )}
                </div>
              </div>

              {generation.status === 'processing' && (
                <div className="mb-3">
                  <Progress value={generation.progress} className="w-full" />
                  <p className="text-sm text-gray-600 mt-1">
                    {generation.progress}% - {generation.message}
                  </p>
                </div>
              )}

              {generation.status === 'completed' && (
                <div className="mb-3">
                  <p className="text-sm text-green-600">{generation.message}</p>
                </div>
              )}

              {generation.status === 'failed' && generation.error && (
                <div className="mb-3">
                  <p className="text-sm text-red-600">
                    <strong>Erreur:</strong> {generation.error}
                  </p>
                </div>
              )}

              <div className="text-xs text-gray-500">
                Créé le {formatDate(generation.createdAt)}
                {generation.updatedAt.getTime() !== generation.createdAt.getTime() && (
                  <span> • Mis à jour le {formatDate(generation.updatedAt)}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
