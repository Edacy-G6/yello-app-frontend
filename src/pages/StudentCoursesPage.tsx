import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { studentService, type StudentProgress } from '../services';
import { 
  Search, 
  BookOpen, 
  Clock, 
  Target, 
  Play,
  Calendar,
  MoreVertical,
  Eye,
  Download,
  Loader2,
  AlertCircle
} from 'lucide-react';

export default function StudentCoursesPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');
  const [courses, setCourses] = useState<StudentProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStudentCourses();
  }, []);

  const loadStudentCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await studentService.getStudentCourses();
      if (response.success && response.data) {
        setCourses(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des cours');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'in-progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'not-started': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Terminé';
      case 'in-progress': return 'En cours';
      case 'not-started': return 'Non commencé';
      default: return status;
    }
  };


  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.courseTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || course.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });


  // Affichage du chargement
  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-lg text-muted-foreground">Chargement de vos cours...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Affichage de l'erreur
  if (error) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Erreur de chargement</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={loadStudentCourses} variant="outline">
                Réessayer
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Mes Cours
            </h1>
            <p className="text-lg text-muted-foreground">
              Gérez et suivez vos cours assignés
            </p>
          </div>
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
                <SelectItem value="not-started">Non commencé</SelectItem>
                <SelectItem value="in-progress">En cours</SelectItem>
                <SelectItem value="completed">Terminé</SelectItem>
              </SelectContent>
            </Select>


            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Plus récent</SelectItem>
                <SelectItem value="due">Échéance</SelectItem>
                <SelectItem value="progress">Progression</SelectItem>
                <SelectItem value="title">Titre A-Z</SelectItem>
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
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span className="text-sm font-medium">En cours</span>
              </div>
              <div className="text-2xl font-bold mt-1">
                {courses.filter(c => c.status === 'in-progress').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm font-medium">Terminés</span>
              </div>
              <div className="text-2xl font-bold mt-1">
                {courses.filter(c => c.status === 'completed').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Score Moyen</span>
              </div>
              <div className="text-2xl font-bold mt-1">
                {Math.round(courses.reduce((sum, c) => sum + c.averageScore, 0) / courses.length) || 0}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liste des cours */}
        <div className="space-y-6">
          {filteredCourses.map((course) => (
            <Card key={course.courseId} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start space-x-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-semibold text-foreground">
                            {course.courseTitle}
                          </h3>
                          <Badge className={getStatusColor(course.status)}>
                            {getStatusLabel(course.status)}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-4">
                          Cours ID: {course.courseId}
                        </p>
                        
                        {/* Progression */}
                        <div className="space-y-3 mb-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Progression générale</span>
                              <span>{course.progress}%</span>
                            </div>
                            <Progress value={course.progress} className="h-2" />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-2">
                              <BookOpen className="h-4 w-4" />
                              <span>{course.completedLessons}/{course.totalLessons} leçons</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Target className="h-4 w-4" />
                              <span>Score moyen: {course.averageScore}%</span>
                            </div>
                          </div>
                        </div>

                        {/* Informations supplémentaires */}
                        <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>Temps passé: {course.timeSpent} min</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>Dernière activité: {course.lastActivity}</span>
                          </div>
                        </div>

                      </div>
                      
                      <div className="text-right">
                        <div className="mb-4">
                          <div className="text-3xl font-bold text-foreground">
                            {course.averageScore}%
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Score moyen
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                  <div className="flex items-center space-x-2">
                    <Button 
                      className="bg-primary hover:bg-primary/90"
                      size="sm"
                      onClick={() => navigate(`/student/course/${course.courseId}`)}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {course.status === 'completed' ? 'Revoir' : course.status === 'not-started' ? 'Commencer' : 'Continuer'}
                    </Button>
                    
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Aperçu
                    </Button>
                    
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
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
              {searchTerm || statusFilter !== 'all'
                ? 'Essayez de modifier vos filtres de recherche'
                : 'Aucun cours assigné pour le moment'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
