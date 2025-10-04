import React, { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Upload, FileText, Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { courseService } from '../../services';
import type { GenerateCourseFromFileData, GenerationProgress, GenerationStatus } from '../../types/course';
import { toast } from 'sonner';

interface CourseGeneratorProps {
  onCourseGenerated?: (courseId: string) => void;
  onClose?: () => void;
}

export default function CourseGenerator({ onCourseGenerated, onClose }: CourseGeneratorProps) {
  const [formData, setFormData] = useState<GenerateCourseFromFileData>({
    title: '',
    description: '',
    subject: '',
    level: 'beginner',
    tags: '',
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState<GenerationProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Vérifier le type de fichier
      const allowedTypes = ['application/pdf', 'text/plain', 'text/markdown'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Type de fichier non supporté. Utilisez PDF, TXT ou MD.');
        return;
      }

      // Vérifier la taille (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast.error('Fichier trop volumineux. Taille maximale: 10MB');
        return;
      }

      setSelectedFile(file);
      setError(null);
      
      // Auto-remplir le titre si vide
      if (!formData.title) {
        const fileName = file.name.replace(/\.[^/.]+$/, ''); // Enlever l'extension
        setFormData(prev => ({ ...prev, title: fileName }));
      }
    }
  };

  const handleInputChange = (field: keyof GenerateCourseFromFileData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    if (!selectedFile) {
      toast.error('Veuillez sélectionner un fichier');
      return;
    }

    if (!formData.title.trim() || !formData.subject.trim()) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGenerationProgress(null);

    try {
      const response = await courseService.generateCourseFromFile(selectedFile, formData);
      
      if (response.success && response.data) {
        setGenerationProgress(response.data);
        
        // Démarrer le polling pour suivre le progrès
        courseService.pollGenerationStatus(
          response.data.generationId,
          (progress) => {
            setGenerationProgress(progress);
          },
          (progress) => {
            setGenerationProgress(progress);
            setIsGenerating(false);
            toast.success('Cours généré avec succès !');
            if (progress.data?.courseId && onCourseGenerated) {
              onCourseGenerated(progress.data.courseId);
            }
          },
          (error) => {
            setError(error);
            setIsGenerating(false);
            toast.error('Erreur lors de la génération du cours');
          }
        );
      } else {
        throw new Error(response.message || 'Erreur lors de la génération');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setError(errorMessage);
      setIsGenerating(false);
      toast.error('Erreur lors de la génération du cours');
    }
  };

  const getStatusIcon = (status: GenerationStatus) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
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

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Générer un cours à partir d'un fichier
        </CardTitle>
        <CardDescription>
          Uploadez un fichier PDF, TXT ou MD pour générer automatiquement un cours avec modules et évaluations
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Sélection de fichier */}
        <div className="space-y-2">
          <Label htmlFor="file">Fichier source *</Label>
          <div className="flex items-center gap-4">
            <Input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt,.md"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              {selectedFile ? selectedFile.name : 'Sélectionner un fichier'}
            </Button>
            {selectedFile && (
              <span className="text-sm text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </span>
            )}
          </div>
        </div>

        {/* Informations du cours */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre du cours *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Ex: Introduction à l'IA"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subject">Matière *</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              placeholder="Ex: Intelligence Artificielle"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="level">Niveau</Label>
          <Select value={formData.level} onValueChange={(value) => handleInputChange('level', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un niveau" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Débutant</SelectItem>
              <SelectItem value="intermediate">Intermédiaire</SelectItem>
              <SelectItem value="advanced">Avancé</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Description du cours (optionnel)"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags</Label>
          <Input
            id="tags"
            value={formData.tags}
            onChange={(e) => handleInputChange('tags', e.target.value)}
            placeholder="Ex: IA, Machine Learning, Python (séparés par des virgules)"
          />
        </div>

        {/* Progression de la génération */}
        {generationProgress && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(generationProgress.status)}
                <span className="font-medium">{getStatusText(generationProgress.status)}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {generationProgress.progress}%
              </span>
            </div>
            
            <Progress value={generationProgress.progress} className="w-full" />
            
            {generationProgress.message && (
              <p className="text-sm text-muted-foreground">{generationProgress.message}</p>
            )}
          </div>
        )}

        {/* Erreur */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Boutons d'action */}
        <div className="flex justify-end gap-2">
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
          )}
          <Button
            onClick={handleGenerate}
            disabled={!selectedFile || isGenerating || !formData.title.trim() || !formData.subject.trim()}
            className="flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Génération...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" />
                Générer le cours
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
