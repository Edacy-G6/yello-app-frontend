import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Skeleton } from '../components/ui/skeleton';
import { ArrowLeft, BookOpen, AlertCircle } from 'lucide-react';
import { courseService } from '../services';
import StudentCourseViewer from '../components/course/StudentCourseViewer';
import QuizInterface from '../components/quiz/QuizInterface';
import type { Course } from '../types/course';
import { toast } from 'sonner';

export default function StudentCourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'course' | 'quiz'>('course');
  const [currentModuleId, setCurrentModuleId] = useState<string | null>(null);

  // Mock student progress - dans une vraie app, ceci viendrait de l'API
  const [studentProgress] = useState({
    completedModules: [],
    completedSections: [],
    quizScores: {} as Record<string, number>
  });

  useEffect(() => {
    if (courseId) {
      loadCourse();
    }
  }, [courseId]);

  const loadCourse = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await courseService.getCourseById(courseId!);
      
      if (response.success && response.data) {
        setCourse(response.data);
        if (response.data.modules && response.data.modules.length > 0) {
          setCurrentModuleId(response.data.modules[0]._id);
        }
      } else {
        throw new Error(response.message || 'Erreur lors du chargement du cours');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setError(errorMessage);
      toast.error('Erreur lors du chargement du cours');
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = (moduleId: string) => {
    setCurrentModuleId(moduleId);
    setCurrentView('quiz');
  };

  const handleBackToCourse = () => {
    setCurrentView('course');
  };

  const handleModuleChange = (moduleId: string) => {
    setCurrentModuleId(moduleId);
  };

  const handleQuizComplete = (results: any) => {
    toast.success(`Quiz terminé ! Score: ${results.score}%`);
    
    // Mettre à jour le score du quiz (dans une vraie app, sauvegarder via API)
    if (currentModuleId) {
      studentProgress.quizScores[currentModuleId] = results.score;
    }
    
    console.log('Résultats du quiz:', results);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10" />
              <Skeleton className="h-8 w-64" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1">
                <Card>
                  <CardContent className="p-4">
                    <Skeleton className="h-6 w-24 mb-4" />
                    <div className="space-y-2">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="lg:col-span-3">
                <Card>
                  <CardContent className="p-6">
                    <Skeleton className="h-8 w-3/4 mx-auto mb-4" />
                    <div className="space-y-4">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                      <Skeleton className="h-4 w-4/5" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Erreur</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
              <Button onClick={loadCourse}>
                Réessayer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Cours non trouvé</h2>
            <p className="text-gray-600 mb-4">
              Le cours demandé n'existe pas ou vous n'avez pas l'autorisation de le consulter.
            </p>
            <Button onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Si on est en mode quiz, afficher l'interface de quiz
  if (currentView === 'quiz' && currentModuleId) {
    const currentModule = course.modules?.find(m => m._id === currentModuleId);
    if (currentModule) {
      return (
        <QuizInterface
          moduleId={currentModuleId}
          moduleName={currentModule.name}
          qcmQuestions={currentModule.qcmQuestions}
          shortAnswerQuestions={currentModule.shortAnswerQuestions}
          fillInTheBlanksQuestions={currentModule.fillInTheBlanksQuestions}
          onComplete={handleQuizComplete}
          onBack={handleBackToCourse}
        />
      );
    }
  }

  // Sinon, afficher l'interface du cours pour étudiant
  return (
    <StudentCourseViewer
      course={course}
      onStartQuiz={handleStartQuiz}
      onModuleChange={handleModuleChange}
      studentProgress={studentProgress}
    />
  );
}
