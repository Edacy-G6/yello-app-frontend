import { Link, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useAuth } from '../hooks/useAuth';
import { MOCK_COURSES, MOCK_QUICK_START_STEPS, MOCK_DASHBOARD_STATS, ROUTES } from '../constants';
import { ImportPdfComponent } from '../components/teacher/ImportPdfComponent';
import { CourseEditor } from '../components/editor/CourseEditor';
import { 
  Upload, 
  BookOpen, 
  BarChart3, 
  FileText, 
  Clock, 
  Download, 
  Edit3 
} from 'lucide-react';

export default function TeacherDashboardPage() {
  const { user } = useAuth();
  const location = useLocation();
  
  // Détecter si on affiche un composant spécifique
  const isImportPdf = location.pathname.includes('import-pdf');
  const isCourseEditor = location.pathname.includes('course-editor');

  // Si on affiche le composant d'import PDF
  if (isImportPdf) {
    return <ImportPdfComponent />;
  }
  
  // Si on affiche l'éditeur de cours
  if (isCourseEditor) {
    const courseId = location.pathname.split('/').pop() || '';
    return <CourseEditor courseId={courseId} />;
  }

  // Sinon afficher le dashboard normal
  // Utilisation des mocks centralisés
  const recentCourses = MOCK_COURSES.slice(0, 3);
  const quickStartSteps = MOCK_QUICK_START_STEPS;
  const stats = MOCK_DASHBOARD_STATS;

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header de bienvenue */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Bienvenue, {user?.name}!
          </h1>
          <p className="text-lg text-muted-foreground">
            Prêt à créer vos cours intelligents
          </p>
        </div>

        {/* Cartes d'actions principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Importer un PDF */}
          <Card className="relative bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-primary">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Upload className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">Importer un PDF</CardTitle>
                </div>
                <span className="bg-white/20 text-xs px-2 py-1 rounded-full">
                  Nouveau
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-primary-foreground/90 mb-4">
                Uploadez votre document pour générer un cours
              </CardDescription>
              <Link to={ROUTES.TEACHER_IMPORT_PDF}>
                <Button className="w-full bg-white text-primary hover:bg-white/90 dark:bg-white dark:text-black dark:hover:bg-white/90 dark:font-medium">
                  Commencer
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Mes cours */}
          <Card className="hover:shadow-lg transition-shadow border-border bg-card text-card-foreground">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-muted rounded-lg">
                    <BookOpen className="h-6 w-6 text-foreground" />
                  </div>
                  <CardTitle className="text-xl">Mes cours</CardTitle>
                </div>
                <span className="text-2xl font-bold text-primary">{stats.totalCourses}</span>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                Voir la liste de vos cours existants
              </CardDescription>
              <Link to={ROUTES.TEACHER_COURSES}>
                <Button variant="outline" className="w-full border-border hover:bg-accent hover:text-accent-foreground">
                  Voir tout
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Suivi */}
          <Card className="hover:shadow-lg transition-shadow border-border bg-card text-card-foreground">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-muted rounded-lg">
                    <BarChart3 className="h-6 w-6 text-foreground" />
                  </div>
                  <CardTitle className="text-xl">Suivi</CardTitle>
                </div>
                <span className="text-green-600 dark:text-green-400 font-bold">+{stats.monthlyGrowth}%</span>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                Suivez vos performances
              </CardDescription>
              <Link to={ROUTES.TEACHER_ANALYTICS}>
                <Button variant="outline" className="w-full border-border hover:bg-accent hover:text-accent-foreground">
                  Analyser
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Cours récents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Cours récents</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCourses.map((course) => (
                  <div key={course.id} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-muted rounded">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{course.title}</h4>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {course.generatedAt}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="ghost">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Premier pas */}
          <Card>
            <CardHeader>
              <CardTitle>Premier pas...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {quickStartSteps.map((step) => (
                  <div key={step.id} className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      'isActive' in step && step.isActive 
                        ? 'bg-green-500 text-white' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {step.id}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-medium ${
                        'isActive' in step && step.isActive ? 'text-green-600' : 'text-foreground'
                      }`}>
                        {step.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
