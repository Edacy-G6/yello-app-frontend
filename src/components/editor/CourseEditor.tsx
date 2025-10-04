import { useState, useCallback, useEffect } from 'react';
import type { JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Progress } from '../ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { EXPORT_FORMATS, ROUTES } from '../../constants';
import { aiService, type AIProcessingStep } from '../../services/aiService';
import { courseService } from '../../services/courseService';
import type { CourseContent, Course, Module } from '../../types';
import { 
  Bold, 
  Italic, 
  List, 
  Download, 
  RefreshCw, 
  ArrowLeft,
  Eye,
  Save,
  Trash2,
  Edit3,
  Type,
  Calculator,
  BookOpen,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

interface CourseEditorProps {
  courseId: string;
}

interface EditingItem {
  id: string;
  type: CourseContent['type'];
  level: 1 | 2 | 3;
  content: string;
  isEditing: boolean;
}

export function CourseEditor({ courseId }: CourseEditorProps) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<EditingItem | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [courseContent, setCourseContent] = useState<CourseContent[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regenerationSteps, setRegenerationSteps] = useState<AIProcessingStep[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger les données du cours
  useEffect(() => {
    const loadCourseData = async () => {
      try {
        console.log('CourseEditor - Début du chargement, courseId:', courseId);
        setLoading(true);
        const response = await courseService.getCourseById(courseId);
        
        console.log('CourseEditor - Réponse API:', response);
        
        if (response.success && response.data) {
          console.log('CourseEditor - Données du cours reçues:', response.data.title);
          setCourse(response.data);
          
          // Convertir les modules en contenu éditable
          const content: CourseContent[] = [];
          
          // Ajouter le titre du cours
          content.push({
            id: 'course-title',
            type: 'heading',
            level: 1,
            content: response.data.title
          });
          
          // Ajouter la description
          if (response.data.description) {
            content.push({
              id: 'course-description',
              type: 'paragraph',
              level: 3,
              content: response.data.description
            });
          }
          
          // Ajouter les modules
          if (response.data.modules && Array.isArray(response.data.modules)) {
            response.data.modules.forEach((module: Module, index: number) => {
              // Titre du module
              content.push({
                id: `module-${module._id}-title`,
                type: 'heading',
                level: 2,
                content: module.name
              });
              
              // Contenu du module
              content.push({
                id: `module-${module._id}-content`,
                type: 'paragraph',
                level: 3,
                content: module.content
              });
              
              // Quiz QCM
              if (module.qcmQuestions && module.qcmQuestions.length > 0) {
                content.push({
                  id: `module-${module._id}-qcm`,
                  type: 'heading',
                  level: 3,
                  content: 'Quiz QCM'
                });
                
                module.qcmQuestions.forEach((question, qIndex) => {
                  content.push({
                    id: `module-${module._id}-qcm-${qIndex}`,
                    type: 'paragraph',
                    level: 3,
                    content: `Q${qIndex + 1}: ${question.question}`
                  });
                });
              }
              
              // Quiz Réponses Courtes
              if (module.shortAnswerQuestions && module.shortAnswerQuestions.length > 0) {
                content.push({
                  id: `module-${module._id}-short`,
                  type: 'heading',
                  level: 3,
                  content: 'Quiz Réponses Courtes'
                });
                
                module.shortAnswerQuestions.forEach((question, qIndex) => {
                  content.push({
                    id: `module-${module._id}-short-${qIndex}`,
                    type: 'paragraph',
                    level: 3,
                    content: `Q${qIndex + 1}: ${question.question}`
                  });
                });
              }
              
              // Quiz Textes à Trous
              if (module.fillInTheBlanksQuestions && module.fillInTheBlanksQuestions.length > 0) {
                content.push({
                  id: `module-${module._id}-fill`,
                  type: 'heading',
                  level: 3,
                  content: 'Quiz Textes à Trous'
                });
                
                module.fillInTheBlanksQuestions.forEach((question, qIndex) => {
                  content.push({
                    id: `module-${module._id}-fill-${qIndex}`,
                    type: 'paragraph',
                    level: 3,
                    content: `Q${qIndex + 1}: ${question.sentence}`
                  });
                });
              }
            });
          }
          
          setCourseContent(content);
          setModules(response.data.modules || []);
        }
      } catch (error) {
        console.error('Erreur lors du chargement du cours:', error);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      loadCourseData();
    }
  }, [courseId]);

  const handleAutoSave = useCallback(async () => {
    setIsSaving(true);
    // Simulation de la sauvegarde
    await new Promise(resolve => setTimeout(resolve, 1000));
    setHasUnsavedChanges(false);
    setLastSaved(new Date());
    setIsSaving(false);
  }, []);

  // Sauvegarde automatique
  useEffect(() => {
    if (hasUnsavedChanges) {
      const timer = setTimeout(() => {
        handleAutoSave();
      }, 2000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [hasUnsavedChanges, handleAutoSave]);

  const handleManualSave = useCallback(async () => {
    await handleAutoSave();
  }, [handleAutoSave]);

  const handleContentChange = useCallback((id: string, newContent: string) => {
    setCourseContent(prev => 
      prev.map(item => 
        item.id === id ? { ...item, content: newContent } : item
      )
    );
    setHasUnsavedChanges(true);
  }, []);

  const handleAddElement = useCallback((type: CourseContent['type'], level: 1 | 2 | 3 = 3) => {
    const newItem: CourseContent = {
      id: `new-${Date.now()}`,
      type,
      level,
      content: type === 'heading' ? 'Nouveau titre' : 'Nouveau contenu'
    };
    setCourseContent(prev => [...prev, newItem]);
    setHasUnsavedChanges(true);
  }, []);

  const handleDeleteElement = useCallback((id: string) => {
    setCourseContent(prev => prev.filter(item => item.id !== id));
    setHasUnsavedChanges(true);
  }, []);

  const handleEditElement = useCallback((item: CourseContent) => {
    setEditingItem({
      id: item.id,
      type: item.type,
      level: item.level,
      content: item.content,
      isEditing: true
    });
  }, []);

  const handleSaveEdit = useCallback(() => {
    if (editingItem) {
      handleContentChange(editingItem.id, editingItem.content);
      setEditingItem(null);
    }
  }, [editingItem, handleContentChange]);

  const renderContent = (item: CourseContent) => {
    const isEditingThisItem = editingItem?.id === item.id;
    
    if (isEditingThisItem) {
      return (
        <div className="space-y-2 p-4 border border-primary rounded-lg bg-primary/5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-primary">
              Édition en cours
            </span>
            <div className="flex space-x-2">
              <Button size="sm" onClick={handleSaveEdit}>
                <CheckCircle className="h-3 w-3 mr-1" />
                Sauvegarder
              </Button>
              <Button size="sm" variant="outline" onClick={() => setEditingItem(null)}>
                Annuler
              </Button>
            </div>
          </div>
          <Textarea
            value={editingItem.content}
            onChange={(e) => setEditingItem(prev => prev ? { ...prev, content: e.target.value } : null)}
            className="min-h-[100px]"
            placeholder="Contenu de l'élément..."
          />
        </div>
      );
    }

    switch (item.type) {
      case 'heading': {
        const HeadingTag = `h${item.level}` as keyof JSX.IntrinsicElements;
        const headingClasses = {
          1: 'text-2xl font-bold text-foreground mb-6 mt-8',
          2: 'text-xl font-semibold text-foreground mb-4 mt-6',
          3: 'text-lg font-medium text-foreground mb-3 mt-4'
        };
        return (
          <HeadingTag className={headingClasses[item.level]}>
            {item.content}
          </HeadingTag>
        );
      }
      
      case 'formula':
        return (
          <div className="bg-muted p-4 rounded-lg my-4">
            <code className="text-lg font-mono text-foreground">
              {item.content}
            </code>
          </div>
        );
      
      case 'example':
        return (
          <div className="bg-primary/5 border-l-4 border-primary p-4 rounded-lg my-4">
            <p className="text-foreground whitespace-pre-line">
              {item.content}
            </p>
          </div>
        );
      
      case 'exercise':
        return (
          <div className="bg-green-500/5 border-l-4 border-green-500 p-4 rounded-lg my-4">
            <p className="text-foreground whitespace-pre-line">
              {item.content}
            </p>
          </div>
        );
      
      default:
        return (
          <p className="text-foreground mb-4 whitespace-pre-line">
            {item.content}
          </p>
        );
    }
  };

  const handleExport = (format: string) => {
    console.log('Export en format:', format);
    setShowExportDialog(false);
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    setRegenerationSteps([]);
    
    try {
      const result = await aiService.regenerateContent(courseContent, (step) => {
        setRegenerationSteps(prev => {
          const existing = prev.find(s => s.id === step.id);
          if (existing) {
            return prev.map(s => s.id === step.id ? step : s);
          }
          return [...prev, step];
        });
      });

      if (result) {
        setCourseContent(result);
        setHasUnsavedChanges(true);
      }
    } catch (error) {
      console.error('Erreur lors de la régénération:', error);
    } finally {
      setIsRegenerating(false);
    }
  };

  console.log('CourseEditor - Render, course:', course, 'loading:', loading);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement du cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header avec navigation */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate(ROUTES.TEACHER_IMPORT_PDF)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {course?.title || 'Cours non trouvé'}
              </h1>
              <p className="text-sm text-muted-foreground">ID: {courseId}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Indicateur de sauvegarde */}
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              {isSaving && (
                <div className="flex items-center space-x-1">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary"></div>
                  <span>Sauvegarde...</span>
                </div>
              )}
              {lastSaved && !isSaving && (
                <div className="flex items-center space-x-1">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>Sauvegardé {lastSaved.toLocaleTimeString()}</span>
                </div>
              )}
              {hasUnsavedChanges && !isSaving && (
                <div className="flex items-center space-x-1">
                  <AlertCircle className="h-3 w-3 text-yellow-500" />
                  <span>Modifications non sauvegardées</span>
                </div>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Eye className="h-4 w-4 mr-2" />
              {isEditing ? 'Aperçu' : 'Édition'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleManualSave}
              disabled={isSaving}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content">Contenu</TabsTrigger>
            <TabsTrigger value="preview">Aperçu</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Barre d'outils d'édition */}
              {isEditing && (
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <CardTitle className="text-lg">Outils d'édition</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Formatage
                      </label>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Bold className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Italic className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <List className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Ajouter des éléments
                      </label>
                      <div className="space-y-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full justify-start"
                          onClick={() => handleAddElement('heading', 1)}
                        >
                          <Type className="h-4 w-4 mr-2" />
                          Titre principal
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full justify-start"
                          onClick={() => handleAddElement('heading', 2)}
                        >
                          <Type className="h-4 w-4 mr-2" />
                          Sous-titre
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full justify-start"
                          onClick={() => handleAddElement('paragraph')}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Paragraphe
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full justify-start"
                          onClick={() => handleAddElement('formula')}
                        >
                          <Calculator className="h-4 w-4 mr-2" />
                          Formule
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full justify-start"
                          onClick={() => handleAddElement('example')}
                        >
                          <BookOpen className="h-4 w-4 mr-2" />
                          Exemple
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full justify-start"
                          onClick={() => handleAddElement('exercise')}
                        >
                          <BookOpen className="h-4 w-4 mr-2" />
                          Exercice
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Contenu du cours */}
              <Card className={isEditing ? 'lg:col-span-3' : 'lg:col-span-4'}>
                <CardContent className="p-8">
                  <div className="max-w-4xl mx-auto">
                    {courseContent.map((item) => (
                      <div key={item.id} className="group relative">
                        {isEditing && (
                          <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity mb-2">
                            <div className="flex space-x-1">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleEditElement(item)}
                              >
                                <Edit3 className="h-3 w-3" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeleteElement(item.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        )}
                        {renderContent(item)}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Aperçu du cours</CardTitle>
                <CardDescription>
                  Version finale telle qu'elle apparaîtra aux élèves
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-w-4xl mx-auto">
                  {courseContent.map((item) => (
                    <div key={item.id}>
                      {renderContent(item)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informations du cours</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Titre du cours
                    </label>
                    <Input placeholder="Titre du cours" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Description
                    </label>
                    <Textarea placeholder="Description du cours" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Niveau scolaire
                    </label>
                    <Input placeholder="Niveau scolaire" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Paramètres d'export</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Format d'export
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {EXPORT_FORMATS.map((format) => (
                        <Button
                          key={format.id}
                          variant="outline"
                          size="sm"
                          onClick={() => handleExport(format.id)}
                        >
                          {format.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Progression de la régénération IA */}
        {isRegenerating && regenerationSteps.length > 0 && (
          <div className="max-w-4xl mx-auto mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <RefreshCw className="h-5 w-5" />
                  <span>Régénération par l'IA</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {regenerationSteps.map((step) => (
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

        {/* Actions en bas */}
        <div className="flex justify-center space-x-4 mt-8">
          <Button 
            variant="outline"
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="min-w-[180px]"
          >
            {isRegenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                Régénération...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Générer à nouveau
              </>
            )}
          </Button>
          <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
            <DialogTrigger asChild>
              <Button className="min-w-[180px]">
                <Download className="h-4 w-4 mr-2" />
                Exporter le cours
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Choisir le format d'export</DialogTitle>
                <DialogDescription>
                  Sélectionnez le format dans lequel vous souhaitez exporter votre cours
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                {EXPORT_FORMATS.map((format) => (
                  <Button
                    key={format.id}
                    variant="outline"
                    onClick={() => handleExport(format.id)}
                    className="h-auto p-4 flex flex-col items-start space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span className="font-medium">{format.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground text-left">
                      {format.description}
                    </p>
                  </Button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
