import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { parentService, type ParentDashboard, type ChildProgress } from '../services';
import { 
  Users, 
  Clock, 
  Target, 
  TrendingUp, 
  Bell,
  Award,
  BookOpen,
  Activity,
  Download,
  MessageCircle,
  AlertCircle,
  CheckCircle,
  Star,
  Loader2
} from 'lucide-react';

export default function ParentDashboardPage() {
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [dashboard, setDashboard] = useState<ParentDashboard | null>(null);
  const [childProgress, setChildProgress] = useState<ChildProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadParentDashboard();
  }, []);

  useEffect(() => {
    if (selectedChild) {
      loadChildProgress(selectedChild);
    }
  }, [selectedChild]);

  const loadParentDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await parentService.getParentDashboard();
      if (response.success && response.data) {
        setDashboard(response.data);
        if (response.data.children.length > 0) {
          setSelectedChild(response.data.children[0].student.id);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement du dashboard');
    } finally {
      setLoading(false);
    }
  };

  const loadChildProgress = async (childId: string) => {
    try {
      const response = await parentService.getChildProgress(childId);
      if (response.success && response.data) {
        setChildProgress(response.data);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des progrès:', err);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'achievement': return <Award className="h-4 w-4 text-yellow-500" />;
      case 'assignment_due': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'progress_update': return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case 'course_completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'achievement': return 'bg-yellow-500/10 border-yellow-500/20';
      case 'assignment_due': return 'bg-red-500/10 border-red-500/20';
      case 'progress_update': return 'bg-blue-500/10 border-blue-500/20';
      case 'course_completed': return 'bg-green-500/10 border-green-500/20';
      default: return 'bg-gray-500/10 border-gray-500/20';
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
            <Button onClick={loadParentDashboard} variant="outline">
              Réessayer
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucune donnée disponible</p>
          </div>
        </div>
      </div>
    );
  }

  const unreadNotifications = dashboard.notifications.filter(n => !n.isRead).length;

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Tableau de Bord Parent
            </h1>
            <p className="text-lg text-muted-foreground">
              Suivez la progression de vos enfants
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="relative">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
              {unreadNotifications > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">
                  {unreadNotifications}
                </Badge>
              )}
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Exporter Rapport
            </Button>
          </div>
        </div>

        {/* Sélection d'enfant */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Sélectionner un enfant</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {children.map((child) => (
              <Card 
                key={child.id} 
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedChild === child.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedChild(child.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">{child.avatar}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{child.name}</h3>
                      <p className="text-sm text-muted-foreground">{child.grade} • {child.age} ans</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {child.status === 'active' ? 'Actif' : 'Inactif'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Dernière connexion: {child.lastLogin}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contenu principal */}
        {selectedChild ? (
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="progress">Progression</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="reports">Rapports</TabsTrigger>
            </TabsList>

            {/* Vue d'ensemble */}
            <TabsContent value="overview" className="mt-6">
              {(() => {
                const child = children.find(c => c.id === selectedChild);
                if (!child) return null;

                return (
                  <div className="space-y-6">
                    {/* Statistiques de l'enfant */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center space-x-4">
                            <div className="p-3 bg-primary/10 rounded-lg">
                              <BookOpen className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Cours Actifs</p>
                              <p className="text-2xl font-bold text-foreground">{child.totalCourses - child.completedCourses}</p>
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
                              <p className="text-2xl font-bold text-foreground">{child.completedCourses}</p>
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
                              <p className="text-2xl font-bold text-foreground">{child.averageScore}%</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center space-x-4">
                            <div className="p-3 bg-orange-500/10 rounded-lg">
                              <Clock className="h-6 w-6 text-orange-500" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Temps d'Étude</p>
                              <p className="text-2xl font-bold text-foreground">{formatStudyTime(child.studyTime)}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Série et objectifs */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Star className="h-5 w-5" />
                            <span>Série et Objectifs</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-6">
                            <div className="text-center p-6 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-lg">
                              <div className="text-4xl mb-2">{getStreakIcon(child.streak)}</div>
                              <div className={`text-3xl font-bold ${getStreakColor(child.streak)}`}>
                                {child.streak} jours
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                Série d'étude consécutive
                              </p>
                            </div>

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
                            {child.recentActivity.map((activity) => (
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
                                      <CheckCircle className="h-4 w-4 text-yellow-500" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-foreground">
                                    {activity.type === 'quiz_completed' && `Quiz terminé: ${activity.courseTitle}`}
                                    {activity.type === 'lesson_completed' && `Leçon terminée: ${activity.lessonTitle}`}
                                    {activity.type === 'course_completed' && `Cours terminé: ${activity.courseTitle}`}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {activity.timestamp}
                                    {'score' in activity && activity.score && ` • Score: ${activity.score}%`}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                );
              })()}
            </TabsContent>

            {/* Progression */}
            <TabsContent value="progress" className="mt-6">
              {(() => {
                const child = children.find(c => c.id === selectedChild);
                if (!child) return null;

                return (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Progression Détaillée</CardTitle>
                        <CardDescription>
                          Suivi de la progression de {child.name}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center p-4 border border-border rounded-lg">
                              <div className="text-2xl font-bold text-foreground">{child.totalCourses}</div>
                              <div className="text-sm text-muted-foreground">Cours Total</div>
                            </div>
                            <div className="text-center p-4 border border-border rounded-lg">
                              <div className="text-2xl font-bold text-foreground">{child.completedCourses}</div>
                              <div className="text-sm text-muted-foreground">Cours Terminés</div>
                            </div>
                            <div className="text-center p-4 border border-border rounded-lg">
                              <div className="text-2xl font-bold text-foreground">{child.upcomingAssignments}</div>
                              <div className="text-sm text-muted-foreground">Devoirs à Rendre</div>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span>Progression générale</span>
                                <span>{Math.round((child.completedCourses / child.totalCourses) * 100)}%</span>
                              </div>
                              <Progress value={(child.completedCourses / child.totalCourses) * 100} className="h-3" />
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span>Score moyen</span>
                                <span>{child.averageScore}%</span>
                              </div>
                              <Progress value={child.averageScore} className="h-3" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })()}
            </TabsContent>

            {/* Notifications */}
            <TabsContent value="notifications" className="mt-6">
              <div className="space-y-4">
                {notifications
                  .filter(n => n.childName === children.find(c => c.id === selectedChild)?.name)
                  .map((notification) => (
                    <Card key={notification.id} className={notification.isRead ? 'opacity-75' : ''}>
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}>
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium text-foreground">{notification.title}</h4>
                                <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                                <p className="text-xs text-muted-foreground mt-2">{notification.timestamp}</p>
                              </div>
                              {!notification.isRead && (
                                <Badge variant="outline" className="text-xs">
                                  Nouveau
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            {/* Rapports */}
            <TabsContent value="reports" className="mt-6">
              {(() => {
                const child = children.find(c => c.id === selectedChild);
                const report = reports.find(r => r.childId === selectedChild);
                if (!child || !report) return null;

                return (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Rapport de Progression - {report.period}</CardTitle>
                        <CardDescription>
                          Rapport détaillé pour {child.name}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          {/* Statistiques générales */}
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="text-center p-4 border border-border rounded-lg">
                              <div className="text-2xl font-bold text-foreground">{formatStudyTime(report.totalStudyTime)}</div>
                              <div className="text-sm text-muted-foreground">Temps d'Étude</div>
                            </div>
                            <div className="text-center p-4 border border-border rounded-lg">
                              <div className="text-2xl font-bold text-foreground">{report.completedLessons}</div>
                              <div className="text-sm text-muted-foreground">Leçons Terminées</div>
                            </div>
                            <div className="text-center p-4 border border-border rounded-lg">
                              <div className="text-2xl font-bold text-foreground">{report.completedQuizzes}</div>
                              <div className="text-sm text-muted-foreground">Quiz Terminés</div>
                            </div>
                            <div className="text-center p-4 border border-border rounded-lg">
                              <div className="text-2xl font-bold text-foreground">{report.averageScore}%</div>
                              <div className="text-sm text-muted-foreground">Score Moyen</div>
                            </div>
                          </div>

                          {/* Progression par cours */}
                          <div>
                            <h4 className="font-medium text-foreground mb-4">Progression par Cours</h4>
                            <div className="space-y-4">
                              {report.coursesProgress.map((course, index) => (
                                <div key={index} className="p-4 border border-border rounded-lg">
                                  <div className="flex items-center justify-between mb-2">
                                    <h5 className="font-medium text-foreground">{course.courseTitle}</h5>
                                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                      <span>Score: {course.score}%</span>
                                      <span>Temps: {formatStudyTime(course.timeSpent)}</span>
                                    </div>
                                  </div>
                                  <Progress value={course.progress} className="h-2" />
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Récompenses */}
                          <div>
                            <h4 className="font-medium text-foreground mb-4">Récompenses Obtenues</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {report.achievements.map((achievement, index) => (
                                <div key={index} className="p-4 border border-border rounded-lg">
                                  <div className="flex items-center space-x-3">
                                    <Award className="h-5 w-5 text-yellow-500" />
                                    <div>
                                      <h5 className="font-medium text-foreground">{achievement.title}</h5>
                                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                                      <p className="text-xs text-muted-foreground mt-1">
                                        Obtenu le {achievement.earnedAt}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Recommandations */}
                          <div>
                            <h4 className="font-medium text-foreground mb-4">Recommandations</h4>
                            <div className="space-y-2">
                              {report.recommendations.map((recommendation, index) => (
                                <div key={index} className="flex items-start space-x-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                  <MessageCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                                  <p className="text-sm text-foreground">{recommendation}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })()}
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Sélectionnez un enfant
            </h3>
            <p className="text-muted-foreground">
              Choisissez un enfant pour voir ses détails et sa progression
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
