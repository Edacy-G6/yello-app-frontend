import React, { useState, useRef, useCallback } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { 
  Upload, 
  FileText, 
  Loader2, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Info,
  Settings,
  Eye
} from 'lucide-react';
import { useCourseGenerationAdvanced } from '../../hooks/useCourseGenerationAdvanced';
import { CourseGenerationProgress } from './CourseGenerationProgress';
import type { GenerateCourseFromFileData } from '../../types/course';

interface CourseGeneratorAdvancedProps {
  onCourseGenerated?: (courseId: string) => void;
  onClose?: () => void;
}

export default function CourseGeneratorAdvanced({ onCourseGenerated, onClose }: CourseGeneratorAdvancedProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced'>('basic');
  const [formData, setFormData] = useState<GenerateCourseFromFileData>({
    title: '',
    description: '',
    subject: '',
    level: 'beginner',
    tags: '',
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
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
    totalGenerationTime,
    averageGenerationTime,
  } = useCourseGenerationAdvanced();

  const handleFileSelect = useCallback((file: File) => {
    // Vérifier le type de fichier
    const allowedTypes = [
      'application/pdf', 
      'text/plain', 
      'text/markdown',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      alert('Type de fichier non supporté. Utilisez PDF, TXT, MD, DOC ou DOCX.');
      return;
    }

    // Vérifier la taille (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert('Fichier trop volumineux. Taille maximale: 10MB');
      return;
    }

    setSelectedFile(file);
    
    // Auto-remplir le titre si vide
    if (!formData.title) {
      const fileName = file.name.replace(/\.[^/.]+$/, ''); // Enlever l'extension
      setFormData(prev => ({ ...prev, title: fileName }));
    }
  }, [formData.title]);

  const handleFileInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
  }, []);

  const handleInputChange = useCallback((field: keyof GenerateCourseFromFileData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!selectedFile) {
      alert('Veuillez sélectionner un fichier');
      return;
    }

    if (!formData.title.trim() || !formData.subject.trim()) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    await generateCourse(selectedFile, formData);
  }, [selectedFile, formData, generateCourse]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* En-tête avec statistiques */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Générateur de cours avancé
          </CardTitle>
          <CardDescription>
            Transformez vos documents en cours interactifs avec l'intelligence artificielle
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-muted-foreground">Générations réussies</span>
              <Badge variant="secondary">0</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-muted-foreground">Temps moyen</span>
              <Badge variant="secondary">
                {averageGenerationTime > 0 ? formatDuration(averageGenerationTime) : 'N/A'}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-purple-600" />
              <span className="text-sm text-muted-foreground">Temps total</span>
              <Badge variant="secondary">{formatDuration(totalGenerationTime)}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Onglets pour configuration */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'basic' | 'advanced')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic">Configuration de base</TabsTrigger>
          <TabsTrigger value="advanced">Options avancées</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          {/* Sélection de fichier */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Fichier source
              </CardTitle>
              <CardDescription>
                Uploadez un document PDF, TXT, MD, DOC ou DOCX
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragOver 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt,.md,.doc,.docx"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Glissez-déposez votre fichier ici
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  ou cliquez pour sélectionner un fichier
                </p>
                
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="mb-4"
                >
                  Sélectionner un fichier
                </Button>
                
                {selectedFile && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 text-green-800">
                      <CheckCircle className="h-4 w-4" />
                      <span className="font-medium">{selectedFile.name}</span>
                    </div>
                    <p className="text-sm text-green-600 mt-1">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Informations du cours */}
          <Card>
            <CardHeader>
              <CardTitle>Informations du cours</CardTitle>
              <CardDescription>
                Renseignez les détails de base de votre cours
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Options avancées
              </CardTitle>
              <CardDescription>
                Personnalisez le comportement de la génération
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Les options avancées seront disponibles dans une version future.
                  Pour l'instant, la génération utilise les paramètres par défaut optimisés.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Progression de la génération */}
      {(isGenerating || generationProgress || error) && (
        <CourseGenerationProgress
          progress={generationProgress}
          currentStep={currentStep}
          estimatedTimeRemaining={estimatedTimeRemaining}
          isGenerating={isGenerating}
          error={error}
          onCancel={cancelGeneration}
          onRetry={retryGeneration}
          onClear={clearGeneration}
        />
      )}

      {/* Boutons d'action */}
      <div className="flex justify-between">
        <div className="flex gap-2">
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Fermer
            </Button>
          )}
          <Button variant="ghost" onClick={clearGeneration}>
            Réinitialiser
          </Button>
        </div>
        
        <Button
          onClick={handleGenerate}
          disabled={!selectedFile || isGenerating || !formData.title.trim() || !formData.subject.trim()}
          className="flex items-center gap-2"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Génération en cours...
            </>
          ) : (
            <>
              <FileText className="h-4 w-4" />
              Générer le cours
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
