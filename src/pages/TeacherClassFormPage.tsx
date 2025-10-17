import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCreateClasse, useUpdateClasse, useClasse } from '../hooks/useClasses';
import { courseService } from '../services/courseService';
import { ClasseForm } from '../components/classe/ClasseForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { ROUTES } from '../constants';
import type { CreateClasseDto, UpdateClasseDto, Course } from '../types';

export default function TeacherClassFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  // États
  const [courses, setCourses] = useState<Array<{ id: string; title: string; description?: string }>>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [coursesError, setCoursesError] = useState<string | null>(null);

  // Hooks pour les classes
  const { createClasse, loading: createLoading, error: createError } = useCreateClasse();
  const { updateClasse, loading: updateLoading, error: updateError } = useUpdateClasse();
  const { 
    classe, 
    loading: classeLoading, 
    error: classeError 
  } = useClasse({ 
    classId: id || '', 
    enabled: isEditMode 
  });

  // Charger les cours disponibles
  useEffect(() => {
    const loadCourses = async () => {
      try {
        setCoursesLoading(true);
        setCoursesError(null);
        
        const response = await courseService.getCourses();
        
        if (response.success && response.data) {
          const coursesData = response.data.map((course: Course) => ({
            id: course._id.toString(),
            title: course.title,
            description: course.description,
          }));
          setCourses(coursesData);
        } else {
          setCoursesError(response.message || 'Erreur lors du chargement des cours');
        }
      } catch (error) {
        setCoursesError('Erreur lors du chargement des cours');
        console.error('Erreur lors du chargement des cours:', error);
      } finally {
        setCoursesLoading(false);
      }
    };

    loadCourses();
  }, []);

  // Gérer la soumission du formulaire
  const handleSubmit = async (data: CreateClasseDto | UpdateClasseDto) => {
    try {
      if (isEditMode && id) {
        await updateClasse(id, data as UpdateClasseDto);
      } else {
        await createClasse(data as CreateClasseDto);
      }
      
      // Rediriger vers la liste des classes
      navigate(ROUTES.TEACHER_CLASSES);
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    }
  };

  const handleCancel = () => {
    navigate(ROUTES.TEACHER_CLASSES);
  };

  // États de chargement
  const isLoading = coursesLoading || (isEditMode && classeLoading);
  const isSubmitting = createLoading || updateLoading;
  const error = coursesError || (isEditMode ? classeError : null) || createError || updateError;

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">
                {isEditMode ? 'Chargement de la classe...' : 'Chargement des cours...'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="text-destructive mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-foreground mb-1">Erreur de chargement</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Réessayer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="text-muted-foreground mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-foreground mb-1">Aucun cours disponible</h3>
              <p className="text-muted-foreground mb-4">
                Vous devez d'abord créer un cours avant de pouvoir créer une classe.
              </p>
              <Button onClick={() => navigate(ROUTES.TEACHER_COURSES)}>
                Créer un cours
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {isEditMode ? 'Modifier la classe' : 'Créer une nouvelle classe'}
            </h1>
            <p className="text-muted-foreground">
              {isEditMode 
                ? 'Modifiez les informations de votre classe virtuelle'
                : 'Configurez votre nouvelle classe virtuelle et commencez à enseigner'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <ClasseForm
        initialData={classe}
        courses={courses}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={isSubmitting}
        mode={isEditMode ? 'edit' : 'create'}
      />

      {/* Message d'erreur de soumission */}
      {error && (
        <Card className="mt-6 border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="font-medium">Erreur lors de l'enregistrement</span>
            </div>
            <p className="text-sm text-destructive mt-1">{error}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
