import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { studentService, type StudentProgress, type StudentStats, type StudentActivity } from '../services';
import { 
  BookOpen, 
  Clock, 
  Target, 
  TrendingUp, 
  Calendar,
  Play,
  CheckCircle,
  Trophy,
  Activity,
  Award,
  Loader2
} from 'lucide-react';

export default function StudentDashboardPage() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [courses, setCourses] = useState<StudentProgress[]>([]);
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [activities, setActivities] = useState<StudentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStudentData();
  }, []);

  const loadStudentData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [coursesResponse, statsResponse, activitiesResponse] = await Promise.all([
        studentService.getStudentCourses(),
        studentService.getStudentStats(),
        studentService.getStudentActivity(undefined, 10)
      ]);

      if (coursesResponse.success && coursesResponse.data) {
        setCourses(coursesResponse.data);
      }
      
      if (statsResponse.success && statsResponse.data) {
        setStats(statsResponse.data);
      }
      
      if (activitiesResponse.success && activitiesResponse.data) {
        setActivities(activitiesResponse.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'not_started': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Terminé';
      case 'in_progress': return 'En cours';
      case 'not_started': return 'Non commencé';
      case 'pending': return 'En attente';
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

  const formatStudyTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Chargement de votre tableau de bord...</p>
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
            <Button onClick={loadStudentData} variant="outline">
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
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Mon Tableau de Bord
          </h1>
          <p className="text-lg text-muted-foreground">
            Suivez votre progression et continuez votre apprentissage
          </p>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Cours Actifs</p>
                  <p className="text-2xl font-bold text-foreground">{progress.inProgressCourses}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Cours Terminés</p>
                  <p className="text-2xl font-bold text-foreground">{progress.completedCourses}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-yellow-500/10 rounded-lg">
                  <Target className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Score Moyen</p>
                  <p className="text-2xl font-bold text-foreground">{progress.averageScore}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <Clock className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Temps d'Étude</p>
                  <p className="text-2xl font-bold text-foreground">{formatStudyTime(progress.totalStudyTime)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contenu principal avec onglets */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="courses">Mes Cours</TabsTrigger>
            <TabsTrigger value="assignments">Devoirs</TabsTrigger>
            <TabsTrigger value="progress">Progression</TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Cours en cours */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Play className="h-5 w-5" />
                    <span>Cours en Cours</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {courses.filter(course => course.status === 'in_progress').map((course) => (
                      <div key={course.id} className="p-4 border border-border rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-foreground">{course.title}</h4>
                            <p className="text-sm text-muted-foreground">Par {course.teacher}</p>
                          </div>
                          <Badge className={getDifficultyColor(course.difficulty)}>
                            {getDifficultyLabel(course.difficulty)}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 mb-3">
                          <div className="flex items-center justify-between text-sm">
                            <span>Progression</span>
                            <span>{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                        </div>

                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center space-x-4">
                            <span>{course.completedLessons}/{course.totalLessons} leçons</span>
                            <span>{course.completedQuizzes}/{course.totalQuizzes} quiz</span>
                          </div>
                          <span>Échéance: {course.dueDate}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Activité récente */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5" />
                    <span>Activité Récente</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {progress.recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3 p-3 border border-border rounded-lg">
                        <div className="flex-shrink-0">
                          {activity.type === 'quiz_completed' ? (
                            <div className="p-2 bg-green-500/10 rounded-full">
                              <Target className="h-4 w-4 text-green-500" />
                            </div>
                          ) : activity.type === 'lesson_completed' ? (
                            <div className="p-2 bg-blue-500/10 rounded-full">
                              <BookOpen className="h-4 w-4 text-blue-500" />
                            </div>
                          ) : (
                            <div className="p-2 bg-yellow-500/10 rounded-full">
                              <Play className="h-4 w-4 text-yellow-500" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">
                            {activity.type === 'quiz_completed' && `Quiz terminé: ${activity.courseTitle}`}
                            {activity.type === 'lesson_completed' && `Leçon terminée: ${activity.lessonTitle}`}
                            {activity.type === 'course_started' && `Cours commencé: ${activity.courseTitle}`}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {activity.timestamp}
                            {activity.score && ` • Score: ${activity.score}%`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Mes Cours */}
          <TabsContent value="courses" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg line-clamp-2 mb-2">
                          {course.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">Par {course.teacher}</p>
                      </div>
                      <Badge className={getStatusColor(course.status)}>
                        {getStatusLabel(course.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      {/* Progression */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progression</span>
                          <span>{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>

                      {/* Statistiques */}
                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="block">Leçons</span>
                          <span className="font-medium text-foreground">
                            {course.completedLessons}/{course.totalLessons}
                          </span>
                        </div>
                        <div>
                          <span className="block">Quiz</span>
                          <span className="font-medium text-foreground">
                            {course.completedQuizzes}/{course.totalQuizzes}
                          </span>
                        </div>
                      </div>

                      {/* Score et difficulté */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className={getDifficultyColor(course.difficulty)}>
                            {getDifficultyLabel(course.difficulty)}
                          </Badge>
                          {course.score && (
                            <span className="text-sm font-medium text-foreground">
                              Score: {course.score}%
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {course.estimatedTime}min
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="pt-2">
                        <Button 
                          className="w-full" 
                          variant={course.status === 'completed' ? 'outline' : 'default'}
                        >
                          {course.status === 'completed' ? 'Voir le cours' : 'Continuer'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Devoirs */}
          <TabsContent value="assignments" className="mt-6">
            <div className="space-y-4">
              {assignments.map((assignment) => (
                <Card key={assignment.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-medium text-foreground">{assignment.title}</h4>
                          <Badge className={getStatusColor(assignment.status)}>
                            {getStatusLabel(assignment.status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {assignment.courseTitle}
                        </p>
                        
                        <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>Échéance: {assignment.dueDate}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{assignment.estimatedTime} min</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Target className="h-4 w-4" />
                            <span>{assignment.points} points</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {assignment.score && (
                          <div className="text-right">
                            <div className="text-lg font-bold text-foreground">
                              {assignment.score}/{assignment.points}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Score
                            </div>
                          </div>
                        )}
                        <Button variant="outline" size="sm">
                          {assignment.status === 'completed' ? 'Voir' : 'Commencer'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Progression */}
          <TabsContent value="progress" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Statistiques de progression */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Statistiques</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">Série actuelle</span>
                      <div className="flex items-center space-x-2">
                        <Trophy className="h-4 w-4 text-yellow-500" />
                        <span className="font-bold text-foreground">{progress.streak} jours</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Cours terminés</span>
                        <span className="font-medium text-foreground">
                          {progress.completedCourses}/{progress.totalCourses}
                        </span>
                      </div>
                      <Progress value={(progress.completedCourses / progress.totalCourses) * 100} className="h-2" />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Score moyen</span>
                        <span className="font-medium text-foreground">{progress.averageScore}%</span>
                      </div>
                      <Progress value={progress.averageScore} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Récompenses */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="h-5 w-5" />
                    <span>Récompenses</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {progress.achievements.map((achievement) => (
                      <div key={achievement.id} className="flex items-center space-x-3 p-3 border border-border rounded-lg">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">{achievement.title}</h4>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Obtenu le {achievement.earnedAt}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
