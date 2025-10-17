import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

import { 
  BookOpen, 
  Clock, 
  Users, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  Plus,
  FileText,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { courseService } from '../../services';
import type { Course, CourseStatus, CourseLevel } from '../../types/course';
import { toast } from 'sonner';
import { Skeleton } from '../ui/skeleton';

interface CourseListProps {
  onCreateCourse?: () => void;
  onGenerateCourse?: () => void;
  onEditCourse?: (course: Course) => void;
  onViewCourse?: (course: Course) => void;
  onDeleteCourse?: (course: Course) => void;
}

export default function CourseList({ 
  onCreateCourse, 
  onGenerateCourse, 
  onEditCourse, 
  onViewCourse, 
  onDeleteCourse 
}: CourseListProps) {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await courseService.getCourses();
      
      if (response.success && response.data) {
        setCourses(response.data);
      } else {
        throw new Error(response.message || 'Erreur lors du chargement des cours');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setError(errorMessage);
      toast.error('Erreur lors du chargement des cours');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (course: Course) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer le cours "${course.title}" ?`)) {
      return;
    }

    try {
      const response = await courseService.deleteCourse(course._id);
      
      if (response.success) {
        setCourses(prev => prev.filter(c => c._id !== course._id));
        toast.success('Cours supprimé avec succès');
        if (onDeleteCourse) {
          onDeleteCourse(course);
        }
      } else {
        throw new Error(response.message || 'Erreur lors de la suppression');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      toast.error('Erreur lors de la suppression du cours');
    }
  };

  const getStatusBadge = (status: CourseStatus) => {
    const variants = {
      draft: 'secondary',
      published: 'default',
      archived: 'outline',
    } as const;

    const labels = {
      draft: 'Brouillon',
      published: 'Publié',
      archived: 'Archivé',
    };

    return (
      <Badge variant={variants[status]}>
        {labels[status]}
      </Badge>
    );
  };

  const getLevelBadge = (level: CourseLevel) => {
    const variants = {
      beginner: 'default',
      intermediate: 'secondary',
      advanced: 'destructive',
    } as const;

    const labels = {
      beginner: 'Débutant',
      intermediate: 'Intermédiaire',
      advanced: 'Avancé',
    };

    return (
      <Badge variant={variants[level]}>
        {labels[level]}
      </Badge>
    );
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return 'Non défini';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Mes Cours</h2>
          <p className="text-muted-foreground">
            {courses.length} cours créé{courses.length > 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onGenerateCourse} className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Générer avec IA
          </Button>
          <Button onClick={onCreateCourse} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nouveau cours
          </Button>
        </div>
      </div>

      {/* Liste des cours */}
      {courses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun cours créé</h3>
            <p className="text-muted-foreground text-center mb-4">
              Commencez par créer votre premier cours ou générez-en un automatiquement avec l'IA
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onGenerateCourse}>
                <Sparkles className="h-4 w-4 mr-2" />
                Générer avec IA
              </Button>
              <Button onClick={onCreateCourse}>
                <Plus className="h-4 w-4 mr-2" />
                Créer manuellement
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <Card key={course._id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {course.description || 'Aucune description'}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate(`/teacher/courses/${course._id}`)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Voir
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEditCourse?.(course)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteCourse(course)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {getStatusBadge(course.status)}
                  {getLevelBadge(course.level)}
                </div>
                
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span>{course.subject}</span>
                  </div>
                  
                  {course.duration && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{formatDuration(course.duration)}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{course.studentCount} étudiant{course.studentCount > 1 ? 's' : ''}</span>
                  </div>
                </div>
                
                {course.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {course.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {course.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{course.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
