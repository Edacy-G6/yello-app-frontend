import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import type { GenerateCourseFromFileData, CourseLevel } from '../../types/course';
import { useCourseGeneration } from '../../hooks/useCourseGeneration';

interface CourseGenerationFormProps {
  onCourseGenerated?: (course: any) => void;
  onCancel?: () => void;
}

export const CourseGenerationForm: React.FC<CourseGenerationFormProps> = ({
  onCourseGenerated,
  onCancel,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<GenerateCourseFromFileData>({
    title: '',
    subject: '',
    level: 'beginner',
    description: '',
    tags: '',
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    isGenerating,
    generationProgress,
    generatedCourse,
    error,
    generateCourse,
    clearGeneration,
    resetError,
  } = useCourseGeneration();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      resetError();
      
      // Auto-remplir le titre si vide
      if (!formData.title) {
        const fileName = file.name.replace(/\.[^/.]+$/, ''); // Enlever l'extension
        setFormData(prev => ({ ...prev, title: fileName }));
      }
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      return;
    }

    try {
      await generateCourse(selectedFile, formData);
    } catch (err) {
      console.error('Erreur lors de la génération:', err);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setFormData({
      title: '',
      subject: '',
      level: 'beginner',
      description: '',
      tags: '',
    });
    clearGeneration();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getStatusIcon = () => {
    if (error) return <XCircle className="h-5 w-5 text-red-500" />;
    if (generatedCourse) return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (isGenerating) return <AlertCircle className="h-5 w-5 text-blue-500 animate-pulse" />;
    return <FileText className="h-5 w-5 text-gray-500" />;
  };

  const getStatusText = () => {
    if (error) return 'Erreur';
    if (generatedCourse) return 'Terminé';
    if (isGenerating) return 'En cours...';
    return 'Prêt';
  };

  const getStatusColor = () => {
    if (error) return 'destructive';
    if (generatedCourse) return 'default';
    if (isGenerating) return 'secondary';
    return 'outline';
  };

  // Si un cours a été généré avec succès
  if (generatedCourse) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-500" />
            Cours généré avec succès !
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold">{generatedCourse.title}</h3>
            <p className="text-gray-600">{generatedCourse.description}</p>
            <div className="flex justify-center gap-2">
              <Badge variant="outline">{generatedCourse.subject}</Badge>
              <Badge variant="outline">{generatedCourse.level}</Badge>
              <Badge variant="outline">{generatedCourse.modules?.length || 0} modules</Badge>
            </div>
          </div>
          
          <div className="flex gap-2 justify-center">
            <Button 
              onClick={() => onCourseGenerated?.(generatedCourse)}
              className="flex-1"
            >
              Voir le cours
            </Button>
            <Button variant="outline" onClick={handleReset}>
              Générer un autre cours
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-6 w-6" />
          Génération de cours par IA
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sélection de fichier */}
          <div className="space-y-2">
            <Label htmlFor="file">Fichier source *</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                id="file"
                onChange={handleFileSelect}
                accept=".pdf,.txt,.md,.doc,.docx"
                className="hidden"
                disabled={isGenerating}
              />
              
              {selectedFile ? (
                <div className="space-y-2">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto" />
                  <div>
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-gray-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveFile}
                    disabled={isGenerating}
                  >
                    Supprimer
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                  <div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isGenerating}
                    >
                      Sélectionner un fichier
                    </Button>
                    <p className="text-sm text-gray-500 mt-2">
                      PDF, TXT, MD, DOC, DOCX (max 10MB)
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Formulaire de configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre du cours *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Ex: Introduction à la programmation"
                required
                disabled={isGenerating}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Matière *</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Ex: Informatique, Mathématiques"
                required
                disabled={isGenerating}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">Niveau *</Label>
              <Select
                value={formData.level}
                onValueChange={(value: CourseLevel) => setFormData(prev => ({ ...prev, level: value }))}
                disabled={isGenerating}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Débutant</SelectItem>
                  <SelectItem value="intermediate">Intermédiaire</SelectItem>
                  <SelectItem value="advanced">Avancé</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (optionnel)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="Ex: programmation, python, bases"
                disabled={isGenerating}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optionnel)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Description du cours..."
              rows={3}
              disabled={isGenerating}
            />
          </div>

          {/* Statut et progression */}
          {(isGenerating || generationProgress || error) && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon()}
                  <span className="font-medium">{getStatusText()}</span>
                </div>
                <Badge variant={getStatusColor()}>
                  {generationProgress?.status || 'pending'}
                </Badge>
              </div>

              {generationProgress && (
                <div className="space-y-2">
                  <Progress value={generationProgress.progress} className="w-full" />
                  <p className="text-sm text-gray-600">{generationProgress.message}</p>
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Boutons d'action */}
          <div className="flex gap-2 justify-end">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} disabled={isGenerating}>
                Annuler
              </Button>
            )}
            <Button
              type="submit"
              disabled={!selectedFile || isGenerating || !formData.title || !formData.subject}
              className="min-w-[120px]"
            >
              {isGenerating ? 'Génération...' : 'Générer le cours'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
