import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Button } from '../components/ui/button';
import { analyticsService, type AnalyticsData, type DashboardStats } from '../services';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  BookOpen, 
  Target, 
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Loader2
} from 'lucide-react';

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [isLoading, setIsLoading] = useState(false);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalytics();
    loadStats();
  }, [selectedPeriod]);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await analyticsService.getAnalytics(selectedPeriod);
      if (response.success && response.data) {
        setAnalytics(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des analytics');
    }
  };

  const loadStats = async () => {
    try {
      const response = await analyticsService.getDashboardStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des statistiques:', err);
    }
  };

  const handleRefresh = async () => {
    await Promise.all([loadAnalytics(), loadStats()]);
  };

  const handleExport = async () => {
    try {
      const response = await analyticsService.exportAnalytics({
        format: 'csv',
        dateRange: {
          start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          end: new Date().toISOString()
        },
        dataTypes: ['students', 'courses', 'quizzes']
      });
      
      if (response.success && response.data) {
        const url = window.URL.createObjectURL(response.data);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-${selectedPeriod}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (err) {
      console.error('Erreur lors de l\'export:', err);
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

  if (isLoading && !analytics) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Chargement des analytics...</p>
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
            <Button onClick={handleRefresh} variant="outline">
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Analytics & Suivi
            </h1>
            <p className="text-lg text-muted-foreground">
              Suivez les performances de vos cours et de vos élèves
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
            >
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>

        {/* Filtres de période */}
        <div className="flex items-center space-x-2 mb-6">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Période :</span>
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

        {/* Cartes de statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cours</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCourses}</div>
              <p className="text-xs text-muted-foreground">
                +{stats.monthlyGrowth}% ce mois
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Élèves Actifs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudents}</div>
              <p className="text-xs text-muted-foreground">
                +12% ce mois
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taux de Réussite</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completionRate}%</div>
              <p className="text-xs text-muted-foreground">
                +3.2% ce mois
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Score Moyen</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageScore}/100</div>
              <p className="text-xs text-muted-foreground">
                +2.1 points ce mois
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Graphiques et analyses détaillées */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Graphique de progression mensuelle */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Progression Mensuelle</span>
              </CardTitle>
              <CardDescription>
                Évolution des cours et élèves sur {getPeriodLabel(selectedPeriod)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.monthlyStats.map((stat) => (
                  <div key={stat.month} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{stat.month}</span>
                      <span className="text-sm text-muted-foreground">
                        {stat.courses} cours, {stat.students} élèves
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span>Cours</span>
                        <span>{stat.courses}</span>
                      </div>
                      <Progress value={(stat.courses / 25) * 100} className="h-2" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span>Élèves</span>
                        <span>{stat.students}</span>
                      </div>
                      <Progress value={(stat.students / 200) * 100} className="h-2" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span>Réussite</span>
                        <span>{stat.completion}%</span>
                      </div>
                      <Progress value={stat.completion} className="h-2" />
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
                <Calendar className="h-5 w-5" />
                <span>Activité Récente</span>
              </CardTitle>
              <CardDescription>
                Dernières actions de vos élèves
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 border border-border rounded-lg">
                    <div className="flex-shrink-0">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'course_completed' ? 'bg-green-500' :
                        activity.type === 'quiz_taken' ? 'bg-blue-500' :
                        'bg-yellow-500'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground truncate">
                          {activity.student}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {activity.timestamp}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {activity.title}
                      </p>
                      {activity.score && (
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            Score: {activity.score}/100
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analyse détaillée par cours */}
        <Card>
          <CardHeader>
            <CardTitle>Performance par Cours</CardTitle>
            <CardDescription>
              Analyse détaillée de chaque cours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.recentActivity
                .filter(activity => activity.score)
                .map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-muted rounded-lg">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{activity.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {activity.student} • {activity.timestamp}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-lg font-bold text-foreground">
                          {activity.score}/100
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Score
                        </div>
                      </div>
                      <div className="w-20">
                        <Progress value={activity.score} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
