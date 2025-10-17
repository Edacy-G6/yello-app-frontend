import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { studentService, type StudentProgress, type StudentStats, type StudentActivity } from '../services';
import { 
  Target, 
  Clock, 
  BookOpen,
  Trophy,
  Activity,
  BarChart3,
  Zap,
  Play,
  Loader2,
  AlertCircle
} from 'lucide-react';

export default function StudentProgressPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [courses, setCourses] = useState<StudentProgress[]>([]);
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [activities, setActivities] = useState<StudentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStudentData();
  }, [selectedPeriod]);

  const loadStudentData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [coursesResponse, statsResponse, activitiesResponse] = await Promise.all([
        studentService.getStudentCourses(),
        studentService.getStudentStats(),
        studentService.getStudentActivity(undefined, 20)
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

  const getPeriodLabel = (period: string) => {
    switch (period) {
      case 'week': return '7 derniers jours';
      case 'month': return '30 derniers jours';
      case 'year': return '12 derniers mois';
      default: return '30 derniers jours';
    }
  };

  const formatStudyTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 7) return 'text-yellow-500';
    if (streak >= 3) return 'text-orange-500';
    return 'text-green-500';
  };

  const getStreakIcon = (streak: number) => {
    if (streak >= 7) return '🔥';
    if (streak >= 3) return '⚡';
    return '🌟';
  };

  // Affichage du chargement
  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Chargement de votre progression...</p>
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
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Erreur de chargement</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={loadStudentData} variant="outline">
              Réessayer
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Vérification des données
  if (!stats) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucune donnée de progression disponible</p>
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
              Ma Progression
            </h1>
            <p className="text-lg text-muted-foreground">
              Suivez vos performances et vos accomplissements
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            {(['week', 'month', 'year'] as const).map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPeriod(period)}
              >
                {getPeriodLabel(period)}
              </Button>
            ))}
          </div>
        </div>

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Cours Terminés</p>
                  <p className="text-2xl font-bold text-foreground">{stats.completedCourses}</p>
                  <p className="text-xs text-muted-foreground">sur {stats.totalCourses}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <Target className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Score Moyen</p>
                  <p className="text-2xl font-bold text-foreground">{stats.averageScore}%</p>
                  <p className="text-xs text-muted-foreground">excellent</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-yellow-500/10 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Temps d'Étude</p>
                  <p className="text-2xl font-bold text-foreground">{formatStudyTime(stats.totalStudyTime)}</p>
                  <p className="text-xs text-muted-foreground">ce mois</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-orange-500/10 rounded-lg">
                  <Trophy className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Série Actuelle</p>
                  <p className="text-2xl font-bold text-foreground">{stats.streak}</p>
                  <p className="text-xs text-muted-foreground">jours consécutifs</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contenu principal avec onglets */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="courses">Progression par cours</TabsTrigger>
            <TabsTrigger value="achievements">Récompenses</TabsTrigger>
            <TabsTrigger value="activity">Activité</TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Graphique de progression */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Progression Générale</span>
                  </CardTitle>
                  <CardDescription>
                    Évolution de votre apprentissage sur {getPeriodLabel(selectedPeriod)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Cours terminés</span>
                        <span>{stats.completedCourses}/{stats.totalCourses}</span>
                      </div>
                      <Progress value={(stats.completedCourses / stats.totalCourses) * 100} className="h-3" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Score moyen</span>
                        <span>{stats.averageScore}%</span>
                      </div>
                      <Progress value={stats.averageScore} className="h-3" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Temps d'étude</span>
                        <span>{formatStudyTime(stats.totalStudyTime)}</span>
                      </div>
                      <Progress value={Math.min((stats.totalStudyTime / 300) * 100, 100)} className="h-3" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Série et objectifs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="h-5 w-5" />
                    <span>Objectifs et Série</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Série actuelle */}
                    <div className="text-center p-6 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-lg">
                      <div className="text-4xl mb-2">{getStreakIcon(stats.streak)}</div>
                      <div className={`text-3xl font-bold ${getStreakColor(stats.streak)}`}>
                        {stats.streak} jours
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Série d'étude consécutive
                      </p>
                    </div>

                    {/* Objectifs */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-foreground">Objectifs du mois</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Étudier 5 jours/semaine</span>
                          <span className="text-green-500">✓ Atteint</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Terminer 2 cours</span>
                          <span className="text-yellow-500">En cours</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Score moyen &gt; 80%</span>
                          <span className="text-green-500">✓ Atteint</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Progression par cours */}
          <TabsContent value="courses" className="mt-6">
            <div className="space-y-6">
              {courses.map((course) => (
                <Card key={course.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          {course.courseTitle}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Cours ID: {course.courseId}
                        </p>
                        
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Progression générale</span>
                              <span>{course.progress}%</span>
                            </div>
                            <Progress value={course.progress} className="h-2" />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-muted-foreground">Leçons</span>
                                <span className="font-medium">{course.completedLessons}/{course.totalLessons}</span>
                              </div>
                              <Progress value={(course.completedLessons / course.totalLessons) * 100} className="h-1" />
                            </div>
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-muted-foreground">Quiz</span>
                                <span className="font-medium">{course.completedQuizzes}/{course.totalQuizzes}</span>
                              </div>
                              <Progress value={(course.completedQuizzes / course.totalQuizzes) * 100} className="h-1" />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right ml-6">
                        <div className="mb-2">
                          <div className="text-2xl font-bold text-foreground">
                            {course.averageScore}%
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Score moyen
                          </div>
                        </div>
                        <Badge variant="outline">
                          {course.status === 'completed' ? 'Terminé' : course.status === 'in-progress' ? 'En cours' : 'Non commencé'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Récompenses */}
          <TabsContent value="achievements" className="mt-6">
            <div className="text-center py-12">
              <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Système de récompenses
              </h3>
              <p className="text-muted-foreground">
                Les récompenses seront bientôt disponibles
              </p>
            </div>
          </TabsContent>

          {/* Activité */}
          <TabsContent value="activity" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Activité Récente</span>
                </CardTitle>
                <CardDescription>
                  Vos dernières actions d'apprentissage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.map((activity, index) => (
                    <div key={activity.id} className="flex items-start space-x-4 p-4 border border-border rounded-lg">
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
                          {activity.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {activity.timestamp}
                          {activity.score && ` • Score: ${activity.score}%`}
                        </p>
                      </div>
                      {index === 0 && (
                        <Badge variant="outline" className="text-xs">
                          Récent
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
