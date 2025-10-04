import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  Clock, 
  Users, 
  ArrowRight, 
  ArrowLeft,
  List,
  Bold,
  Italic,
  Sun,
  Moon
} from 'lucide-react';
import ModuleContentRenderer from './ModuleContentRenderer';
import QuizRenderer from './QuizRenderer';
import { useTheme } from '../../hooks/useTheme';
import type { Course } from '../../types/course';

interface CourseViewerProps {
  course: Course;
  onStartQuiz?: (moduleId: string) => void;
  onModuleChange?: (moduleId: string) => void;
}

export default function CourseViewer({ course, onStartQuiz, onModuleChange }: CourseViewerProps) {
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'course' | 'quiz'>('course');
  const { theme, toggleTheme } = useTheme();

  const currentModule = course.modules?.[currentModuleIndex];

  useEffect(() => {
    if (onModuleChange && currentModule) {
      onModuleChange(currentModule._id);
    }
  }, [currentModuleIndex, currentModule, onModuleChange]);

  const handleModuleChange = (index: number) => {
    setCurrentModuleIndex(index);
  };

  const handleStartQuiz = () => {
    if (onStartQuiz && currentModule) {
      onStartQuiz(currentModule._id);
    }
  };


  const formatDuration = (minutes?: number) => {
    if (!minutes) return 'Non défini';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header moderne */}
      <div className="bg-card border-b shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{course.title}</h1>
                <p className="text-muted-foreground mt-1">{course.subject}</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{formatDuration(course.duration)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{course.studentCount} étudiant{course.studentCount > 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <div className="">

          {/* Zone de contenu principal */}
          <div className="lg:col-span-6">
            <div className="space-y-6">
              {/* Navigation des modules en onglets */}
              <div className="flex gap-2 bg-card p-1 rounded-lg shadow-sm">
                {course.modules?.map((module, index) => (
                  <Button
                    key={module._id}
                    variant={currentModuleIndex === index ? "default" : "ghost"}
                    onClick={() => handleModuleChange(index)}
                    className={`flex-1 ${
                      currentModuleIndex === index 
                        ? 'bg-[#E3AC02] bg-[#E3AC02]/80 text-white' 
                        : 'hover:bg-muted'
                    }`}
                  >
                    Module {index + 1}
                  </Button>
                ))}
              </div>

              {/* Navigation Cours/Quiz */}
              <div className="flex items-center justify-between bg-card p-4 rounded-lg shadow-sm">
                <div className="flex gap-8">
                  <Button 
                    variant="ghost" 
                    className={`border-b-2 rounded-none px-0 pb-2 ${
                      activeTab === 'course' 
                        ? 'border-blue-600 text-blue-600' 
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                    onClick={() => setActiveTab('course')}
                  >
                    Cours
                  </Button>
                  <Button 
                    variant="ghost" 
                    className={`border-b-2 rounded-none px-0 pb-2 ${
                      activeTab === 'quiz' 
                        ? 'border-blue-600 text-blue-600' 
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                    onClick={() => setActiveTab('quiz')}
                  >
                    Quiz
                  </Button>
                </div>
                
                {/* Toolbar de formatage et thème */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    <List className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={toggleTheme}
                    title={`Basculer vers le mode ${theme === 'dark' ? 'clair' : 'sombre'}`}
                  >
                    {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Contenu du module */}
              {currentModule && (
                <Card className="shadow-sm">
                  <CardContent className="p-8">
                    <div className="space-y-8">
                      {/* Titre du module */}
                      <div className="text-center">
                        <h2 className="text-3xl font-bold uppercase text-foreground mb-4">
                          {currentModule.name}
                        </h2>
                        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                          <Badge variant="outline" className="px-3 py-1">
                            {formatDuration(currentModule.duration)}
                          </Badge>
                          <span>Module {currentModuleIndex + 1}</span>
                        </div>
                      </div>

                      {/* Contenu du module - Affiché seulement si activeTab === 'course' */}
                      {activeTab === 'course' && (
                        <div className="prose prose-lg max-w-none">
                          <ModuleContentRenderer 
                            content={currentModule.content}
                            className="mt-4"
                          />
                        </div>
                      )}

                      {/* Section Quiz */}
                      {activeTab === 'quiz' && (
                        <div className="mt-8 space-y-6">
                          {/* QCM Questions */}
                          {currentModule.qcmQuestions && currentModule.qcmQuestions.length > 0 && (
                            <QuizRenderer 
                              quiz={{
                                title: `Quiz QCM - ${currentModule.name}`,
                                type: 'multiple_choice',
                                questions: currentModule.qcmQuestions
                              }}
                            />
                          )}

                          {/* Short Answer Questions */}
                          {currentModule.shortAnswerQuestions && currentModule.shortAnswerQuestions.length > 0 && (
                            <QuizRenderer 
                              quiz={{
                                title: `Quiz Réponses Courtes - ${currentModule.name}`,
                                type: 'short_answer',
                                questions: currentModule.shortAnswerQuestions
                              }}
                            />
                          )}

                          {/* Fill in the Blanks Questions */}
                          {currentModule.fillInTheBlanksQuestions && currentModule.fillInTheBlanksQuestions.length > 0 && (
                            <QuizRenderer 
                              quiz={{
                                title: `Quiz Textes à Trous - ${currentModule.name}`,
                                type: 'fill_in_the_blanks',
                                questions: currentModule.fillInTheBlanksQuestions
                              }}
                            />
                          )}

                          {/* Bouton pour passer au quiz complet */}
                          <div className="flex justify-center pt-6">
                            <Button 
                              onClick={handleStartQuiz}
                              size="lg"
                              className="bg-[#E3AC02] bg-[#E3AC02]/80 text-white px-8 py-3"
                            >
                              Passer au quiz complet
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

