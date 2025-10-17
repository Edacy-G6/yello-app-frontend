import { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import CourseNavigation from '../components/layout/CourseNavigation';
import { quizService, type Quiz } from '../services';
import { 
  Search, 
  Plus, 
  BookOpen, 
  Users, 
  Calendar, 
  Edit3,
  Trash2,
  Eye,
  Play,
  BarChart3,
  Clock,
  Target,
  Loader2
} from 'lucide-react';

export default function QuizPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await quizService.getQuizzes();
      if (response.success && response.data) {
        setQuizzes(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des quiz');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'archived': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'draft': return 'Brouillon';
      case 'archived': return 'Archivé';
      default: return status;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Facile';
      case 'medium': return 'Moyen';
      case 'hard': return 'Difficile';
      default: return difficulty;
    }
  };

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quiz.courseTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || quiz.status === statusFilter;
    const matchesDifficulty = difficultyFilter === 'all' || quiz.difficulty === difficultyFilter;
    
    return matchesSearch && matchesStatus && matchesDifficulty;
  });

  const handleDelete = (quizId: number) => {
    console.log('Supprimer le quiz:', quizId);
  };

  const handleArchive = (quizId: number) => {
    console.log('Archiver le quiz:', quizId);
  };

  const handleActivate = (quizId: number) => {
    console.log('Activer le quiz:', quizId);
  };

  const handleEdit = (quizId: number) => {
    console.log('Éditer le quiz:', quizId);
  };

  const handlePreview = (quizId: number) => {
    console.log('Prévisualiser le quiz:', quizId);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Chargement des quiz...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={loadQuizzes} variant="outline">
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
                Mes Quiz
              </h1>
              <p className="text-lg text-muted-foreground">
                Créez et gérez vos quiz interactifs
              </p>
            </div>
            
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Quiz
            </Button>
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
                placeholder="Rechercher un quiz..."
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
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="archived">Archivé</SelectItem>
              </SelectContent>
            </Select>

            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Difficulté" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                <SelectItem value="easy">Facile</SelectItem>
                <SelectItem value="medium">Moyen</SelectItem>
                <SelectItem value="hard">Difficile</SelectItem>
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
                <SelectItem value="score">Score moyen</SelectItem>
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
                <span className="text-sm font-medium">Total Quiz</span>
              </div>
              <div className="text-2xl font-bold mt-1">{quizzes.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm font-medium">Actifs</span>
              </div>
              <div className="text-2xl font-bold mt-1">
                {quizzes.filter(q => q.status === 'active').length}
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
                {quizzes.filter(q => q.averageScore > 0).length > 0 
                  ? Math.round(quizzes.filter(q => q.averageScore > 0).reduce((sum, q) => sum + q.averageScore, 0) / quizzes.filter(q => q.averageScore > 0).length)
                  : 0
                }%
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Participants</span>
              </div>
              <div className="text-2xl font-bold mt-1">
                {quizzes.reduce((sum, q) => sum + q.studentCount, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liste des quiz */}
        <div className="space-y-4">
          {filteredQuizzes.map((quiz) => (
            <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start space-x-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-foreground">
                            {quiz.title}
                          </h3>
                          <Badge className={getStatusColor(quiz.status)}>
                            {getStatusLabel(quiz.status)}
                          </Badge>
                          <Badge variant="outline" className={getDifficultyColor(quiz.difficulty)}>
                            {getDifficultyLabel(quiz.difficulty)}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3">
                          Cours: {quiz.courseTitle}
                        </p>
                        
                        <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <BookOpen className="h-3 w-3" />
                            <span>{quiz.questionCount} questions</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-3 w-3" />
                            <span>{quiz.studentCount} participants</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{quiz.duration} min</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{quiz.createdAt}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        {quiz.averageScore > 0 && (
                          <div className="mb-2">
                            <div className="text-2xl font-bold text-foreground">
                              {quiz.averageScore}%
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Score moyen
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEdit(quiz.id)}
                    >
                      <Edit3 className="h-3 w-3 mr-1" />
                      Éditer
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handlePreview(quiz.id)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Prévisualiser
                    </Button>
                    
                    {quiz.status === 'active' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => console.log('Lancer le quiz:', quiz.id)}
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Lancer
                      </Button>
                    )}
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => console.log('Analytics du quiz:', quiz.id)}
                    >
                      <BarChart3 className="h-3 w-3 mr-1" />
                      Analytics
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {quiz.status === 'draft' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleActivate(quiz.id)}
                      >
                        Activer
                      </Button>
                    )}
                    
                    {quiz.status === 'active' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleArchive(quiz.id)}
                      >
                        Archiver
                      </Button>
                    )}
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDelete(quiz.id)}
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

        {/* Message si aucun quiz trouvé */}
        {filteredQuizzes.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Aucun quiz trouvé
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== 'all' || difficultyFilter !== 'all'
                ? 'Essayez de modifier vos filtres de recherche'
                : 'Commencez par créer votre premier quiz'
              }
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Créer un quiz
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
