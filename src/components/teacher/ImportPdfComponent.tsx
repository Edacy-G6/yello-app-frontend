import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { ROUTES } from '../../constants';
import { aiService, type AIProcessingStep, type PDFAnalysisResult } from '../../services/aiService';
import { courseService } from '../../services/courseService';
import { Upload, FileText, Sparkles, CheckCircle, AlertCircle, Clock, Brain } from 'lucide-react';

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  file: File; // Ajouter le fichier complet
}

export function ImportPdfComponent() {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingSteps, setProcessingSteps] = useState<AIProcessingStep[]>([]);
  const [currentStep, setCurrentStep] = useState<AIProcessingStep | null>(null);
  const [analysisResult, setAnalysisResult] = useState<PDFAnalysisResult | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const navigate = useNavigate();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find(file => file.type === 'application/pdf');
    
    if (pdfFile) {
      setUploadedFile({
        name: pdfFile.name,
        size: pdfFile.size,
        type: pdfFile.type,
        file: pdfFile
      });
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file && file.type === 'application/pdf') {
        setUploadedFile({
          name: file.name,
          size: file.size,
          type: file.type,
          file: file
        });
      }
    }
  }, []);

  const handleAnalyzePDF = async () => {
    if (!uploadedFile) return;
    
    try {
      const file = new File([], uploadedFile.name, { type: uploadedFile.type });
      const analysis = await aiService.analyzePDF(file);
      setAnalysisResult(analysis);
      setShowAnalysis(true);
    } catch (error) {
      console.error('Erreur lors de l\'analyse:', error);
    }
  };

  const handleGenerateCourse = async () => {
    if (!uploadedFile) return;
    
    setIsProcessing(true);
    setProcessingSteps([]);
    setCurrentStep(null);
    
    try {
      // Utiliser le fichier complet stocké
      const file = uploadedFile.file;
      
      // Utiliser le service de cours réel au lieu de la simulation
      const generateData = {
        title: uploadedFile.name.replace('.pdf', ''),
        description: `Cours généré automatiquement à partir de ${uploadedFile.name}`,
        subject: 'Général',
        level: 'beginner',
        tags: 'auto-generated'
      };

      const response = await courseService.generateCourseFromFile(file, generateData);
      
      if (response.success && response.data) {
        // Suivre la progression de la génération
        courseService.pollGenerationStatus(
          response.data.generationId,
          (progress) => {
            // Convertir le progrès en étapes pour l'affichage
            const step = {
              id: 'generation',
              title: 'Génération du cours',
              description: progress.message || 'Génération en cours...',
              progress: progress.progress,
              status: progress.status === 'processing' ? 'processing' : 
                     progress.status === 'completed' ? 'completed' : 'pending',
              duration: 1000
            };
            
            setCurrentStep(step);
            setProcessingSteps([step]);
          },
          (progress) => {
            // Génération terminée avec succès
            if (progress.data?.courseId) {
              navigate(`/teacher/course-editor/${progress.data.courseId}`);
            } else {
              navigate(ROUTES.TEACHER_COURSE_EDITOR);
            }
          },
          (error) => {
            console.error('Erreur lors de la génération:', error);
            setIsProcessing(false);
          }
        );
      } else {
        throw new Error(response.message || 'Erreur lors de la génération');
      }
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
      setIsProcessing(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Importer un PDF
          </h1>
          <p className="text-lg text-muted-foreground">
            Téléchargez votre PDF et laissez l'IA créer un cours interactif adapté
          </p>
        </div>

        {/* Zone d'upload */}
        <div className="max-w-4xl mx-auto">
          {!uploadedFile ? (
            <Card 
              className={`border-2 border-dashed transition-colors ${
                isDragOver 
                  ? 'border-primary bg-primary/5' 
                  : 'border-muted-foreground/25 hover:border-primary/50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <CardContent className="p-12 text-center">
                <div className="space-y-6">
                  {/* Icône d'upload */}
                  <div className="flex justify-center">
                    <div className="p-4 bg-muted rounded-full">
                      <Upload className="h-12 w-12 text-muted-foreground" />
                    </div>
                  </div>

                  {/* Texte principal */}
                  <div className="space-y-2">
                    <h3 className="text-2xl font-semibold text-foreground">
                      Glissez votre PDF ici
                    </h3>
                    <p className="text-muted-foreground">
                      Ou cliquez pour sélectionner un fichier PDF
                    </p>
                  </div>

                  {/* Bouton de sélection */}
                  <div className="pt-4">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="pdf-upload"
                    />
                    <Button 
                      asChild
                      className="bg-primary hover:bg-primary/90"
                    >
                      <label htmlFor="pdf-upload" className="cursor-pointer">
                        <FileText className="h-4 w-4 mr-2" />
                        Sélectionner un PDF
                      </label>
                    </Button>
                  </div>

                  {/* Informations supplémentaires */}
                  <div className="pt-4 text-sm text-muted-foreground">
                    <p>Formats supportés : PDF (max. 50 MB)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Fichier sélectionné */
            <Card className="border-primary">
              <CardContent className="p-8">
                <div className="space-y-6">
                  {/* Informations du fichier */}
                  <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
                    <div className="p-2 bg-primary/10 rounded">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{uploadedFile.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(uploadedFile.size)}
                      </p>
                    </div>
                  </div>

                  {/* Boutons d'action */}
                  <div className="text-center space-y-3">
                    <div className="flex space-x-3 justify-center">
                      <Button 
                        onClick={handleAnalyzePDF}
                        variant="outline"
                        size="lg"
                        className="min-w-[150px]"
                      >
                        <Brain className="h-4 w-4 mr-2" />
                        Analyser
                      </Button>
                      <Button 
                        onClick={handleGenerateCourse}
                        disabled={isProcessing}
                        size="lg"
                        className="bg-primary hover:bg-primary/90 min-w-[150px]"
                      >
                        {isProcessing ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Traitement...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 mr-2" />
                            Générer cours
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Message d'information */}
                  <div className="text-center text-sm text-muted-foreground">
                    <p>
                      L'IA va analyser votre PDF et créer un cours interactif avec des quiz automatiques
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Analyse PDF */}
        {showAnalysis && analysisResult && (
          <div className="max-w-4xl mx-auto mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5" />
                  <span>Analyse du PDF</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Titre détecté</h4>
                      <p className="text-sm text-muted-foreground">{analysisResult.title}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-foreground mb-1">Pages</h4>
                        <p className="text-2xl font-bold text-primary">{analysisResult.pages}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground mb-1">Mots</h4>
                        <p className="text-2xl font-bold text-primary">{analysisResult.wordCount.toLocaleString()}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Durée estimée</h4>
                      <p className="text-sm text-muted-foreground">{analysisResult.estimatedDuration} minutes</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Difficulté</h4>
                      <Badge variant={analysisResult.difficulty === 'easy' ? 'default' : analysisResult.difficulty === 'medium' ? 'secondary' : 'destructive'}>
                        {analysisResult.difficulty === 'easy' ? 'Facile' : analysisResult.difficulty === 'medium' ? 'Moyen' : 'Difficile'}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Sujets identifiés</h4>
                    <div className="space-y-2">
                      {analysisResult.topics.map((topic, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-muted-foreground">{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Progression du traitement IA */}
        {isProcessing && (
          <div className="max-w-4xl mx-auto mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5" />
                  <span>Traitement par l'IA</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {processingSteps.map((step) => (
                    <div key={step.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {step.status === 'completed' ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : step.status === 'processing' ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                          ) : step.status === 'error' ? (
                            <AlertCircle className="h-5 w-5 text-destructive" />
                          ) : (
                            <Clock className="h-5 w-5 text-muted-foreground" />
                          )}
                          <div>
                            <h4 className="font-medium text-foreground">{step.title}</h4>
                            <p className="text-sm text-muted-foreground">{step.description}</p>
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {step.progress}%
                        </span>
                      </div>
                      <Progress value={step.progress} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Informations sur le processus */}
        <div className="max-w-4xl mx-auto mt-12">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Comment ça fonctionne ?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto mb-3">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-medium text-foreground mb-2">1. Import</h4>
                  <p className="text-sm text-muted-foreground">
                    Uploadez votre document PDF
                  </p>
                </div>
                <div className="text-center">
                  <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto mb-3">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-medium text-foreground mb-2">2. Analyse IA</h4>
                  <p className="text-sm text-muted-foreground">
                    Extraction automatique du contenu
                  </p>
                </div>
                <div className="text-center">
                  <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto mb-3">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-medium text-foreground mb-2">3. Génération</h4>
                  <p className="text-sm text-muted-foreground">
                    Création du cours interactif
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
