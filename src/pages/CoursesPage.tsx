import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import CourseNavigation from '../components/layout/CourseNavigation';
import { SCHOOL_LEVELS, ROUTES } from '../constants';
import { courseService } from '../services/courseService';
import type { Course } from '../types/course';
import { CourseStatus } from '../types/course';
import { 
  Search, 
  Plus, 
  BookOpen, 
  Users, 
  Calendar, 
  MoreVertical,
  Edit3,
  Trash2,
  Eye,
  Download,
  Share2,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Charger les cours
  useEffect(() => {
    const loadCourses = async () => {
      try {
        setError(null);
        const response = await courseService.getCourses();
        if (response.success) {
          setCourses(response.data);
        } else {
          setError(response.message || 'Erreur lors du chargement des cours');
        }
      } catch (error) {
        console.error('Erreur lors du chargement des cours:', error);
        setError('Erreur lors du chargement des cours');
      }
    };

    loadCourses();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'published': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'archived': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Terminé';
      case 'published': return 'Publié';
      case 'draft': return 'Brouillon';
      case 'archived': return 'Archivé';
      default: return status;
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || course.status === statusFilter;
    const matchesLevel = levelFilter === 'all' || course.subject === levelFilter;
    
    return matchesSearch && matchesStatus && matchesLevel;
  });

  const handleDelete = async (courseId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce cours ? Cette action est irréversible.')) {
      return;
    }
    
    try {
      const response = await courseService.deleteCourse(courseId);
      if (response.success) {
        setCourses(courses.filter(c => c._id !== courseId));
        toast.success('Cours supprimé avec succès');
      } else {
        toast.error(response.message || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression du cours');
    }
  };

  const handlePublish = async (courseId: string) => {
    try {
      const response = await courseService.updateCourseStatus(courseId, 'published');
      if (response.success) {
        setCourses(courses.map(c => 
          c._id === courseId ? { ...c, status: CourseStatus.PUBLISHED } : c
        ));
        toast.success('Cours publié avec succès');
      } else {
        toast.error(response.message || 'Erreur lors de la publication');
      }
    } catch (error) {
      console.error('Erreur lors de la publication:', error);
      toast.error('Erreur lors de la publication du cours');
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Réessayer
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Mes Cours
              </h1>
              <p className="text-lg text-muted-foreground">
                Gérez et organisez tous vos cours
              </p>
            </div>
            
            <Link to={ROUTES.TEACHER_IMPORT_PDF}>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau Cours
              </Button>
            </Link>
          </div>
          
          {/* Navigation horizontale Cours/Quiz */}
          <CourseNavigation />
        </div>

        {/* Filtres et recherche */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un cours..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="draft">Brouillon</SelectItem>
                <SelectItem value="completed">Terminé</SelectItem>
                <SelectItem value="published">Publié</SelectItem>
                <SelectItem value="archived">Archivé</SelectItem>
              </SelectContent>
            </Select>

            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Niveau" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les niveaux</SelectItem>
                {SCHOOL_LEVELS.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Plus récent</SelectItem>
                <SelectItem value="oldest">Plus ancien</SelectItem>
                <SelectItem value="title">Titre A-Z</SelectItem>
                <SelectItem value="students">Nombre d'élèves</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Total</span>
              </div>
              <div className="text-2xl font-bold mt-1">{courses.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm font-medium">Publiés</span>
              </div>
              <div className="text-2xl font-bold mt-1">
                {courses.filter(c => c.status === 'published').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                <span className="text-sm font-medium">Brouillons</span>
              </div>
              <div className="text-2xl font-bold mt-1">
                {courses.filter(c => c.status === 'draft').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Élèves</span>
              </div>
              <div className="text-2xl font-bold mt-1">
                {courses.reduce((sum, c) => sum + c.studentCount, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liste des cours */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course._id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2 mb-2">
                      {course.title}
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(course.status)}>
                        {getStatusLabel(course.status)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {course.level?.toUpperCase() || 'N/A'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* Métadonnées */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3" />
                      <span>{course.studentCount} élèves</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BookOpen className="h-3 w-3" />
                      <span>{course.modules?.length || 0} modules</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{course.createdAt ? new Date(course.createdAt).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center space-x-2 pt-2">
                    <Link to={`/teacher/courses/${course._id}`}>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit3 className="h-3 w-3 mr-1" />
                        Voir
                      </Button>
                    </Link>
                    
                    <Button variant="outline" size="sm">
                      <Eye className="h-3 w-3" />
                    </Button>
                    
                    <Button variant="outline" size="sm">
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  {/* Actions contextuelles */}
                  <div className="flex items-center space-x-2 pt-2 border-t border-border">
                    {course.status === 'draft' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handlePublish(course._id)}
                        className="flex-1"
                      >
                        <Share2 className="h-3 w-3 mr-1" />
                        Publier
                      </Button>
                    )}
                    
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDelete(course._id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Message si aucun cours trouvé */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Aucun cours trouvé
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== 'all' || levelFilter !== 'all'
                ? 'Essayez de modifier vos filtres de recherche'
                : 'Commencez par créer votre premier cours'
              }
            </p>
            <div className="flex gap-2 justify-center">
              <Link to={ROUTES.TEACHER_COURSE_GENERATION}>
                <Button variant="outline">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Générer avec IA
                </Button>
              </Link>
              <Link to={ROUTES.TEACHER_IMPORT_PDF}>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer manuellement
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
