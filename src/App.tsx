import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TeacherDashboardPage from './pages/TeacherDashboardPage';
import AnalyticsPage from './pages/AnalyticsPage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import { CourseGenerationPage } from './pages/CourseGenerationPage';
import QuizPage from './pages/QuizPage';
import StudentDashboardPage from './pages/StudentDashboardPage';
import StudentCoursesPage from './pages/StudentCoursesPage';
import StudentProgressPage from './pages/StudentProgressPage';
import StudentCourseDetailPage from './pages/StudentCourseDetailPage';
import ParentDashboardPage from './pages/ParentDashboardPage';
import TeacherClassesPage from './pages/TeacherClassesPage';
import TeacherClassDetailPage from './pages/TeacherClassDetailPage';
import TeacherClassFormPage from './pages/TeacherClassFormPage';
import TeacherStudentsPage from './pages/TeacherStudentsPage';
import { AuthProvider, RoleBasedRedirect, ProtectedRoute } from './components/auth';
import { ROUTES } from './constants';
import { Toaster } from 'sonner';
import { useTheme } from './hooks/useTheme';

function App() {
  // Initialiser le thème
  useTheme();
  
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Routes publiques avec layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path={ROUTES.ABOUT} element={<AboutPage />} />
            <Route path={ROUTES.CONTACT} element={<ContactPage />} />
          </Route>

          {/* Routes d'authentification sans layout */}
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />

          {/* Routes protégées */}
          <Route path={ROUTES.DASHBOARD} element={<RoleBasedRedirect />} />
          
          {/* Routes enseignant - protégées avec layout */}
          <Route path="/teacher" element={
            <ProtectedRoute requiredRoles="teacher">
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<TeacherDashboardPage />} />
            {/* Composants intégrés dans TeacherDashboardPage */}
            <Route path="import-pdf" element={<TeacherDashboardPage />} />
            <Route path="course-editor/:id" element={<TeacherDashboardPage />} />
            <Route path="quiz" element={<QuizPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="courses" element={<CoursesPage />} />
            <Route path="courses/:courseId" element={<CourseDetailPage />} />
            <Route path="course-generation" element={<CourseGenerationPage />} />
            {/* Routes classes et étudiants */}
            <Route path="classes" element={<TeacherClassesPage />} />
            <Route path="classes/create" element={<TeacherClassFormPage />} />
            <Route path="classes/:id" element={<TeacherClassDetailPage />} />
            <Route path="classes/:id/edit" element={<TeacherClassFormPage />} />
            <Route path="students" element={<TeacherStudentsPage />} />
          </Route>
          
          {/* Routes étudiant - protégées avec layout */}
          <Route path="/student" element={
            <ProtectedRoute requiredRoles="student">
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboardPage />} />
            <Route path="courses" element={<StudentCoursesPage />} />
            <Route path="course/:courseId" element={<StudentCourseDetailPage />} />
            <Route path="progress" element={<StudentProgressPage />} />
          </Route>
          
          {/* Routes parent - protégées avec layout */}
          <Route path="/parent" element={
            <ProtectedRoute requiredRoles="parent">
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<ParentDashboardPage />} />
          </Route>
          
          {/* Routes quiz - protégées */}
          <Route path="/quiz" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
          </Route>
          
          {/* Autres routes protégées */}
          <Route path={ROUTES.CLASSES} element={<div>Classes Page (À implémenter)</div>} />
          <Route path={ROUTES.STUDENTS} element={<div>Students Page (À implémenter)</div>} />
          <Route path={ROUTES.REPORTS} element={<div>Reports Page (À implémenter)</div>} />

          {/* Route 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
      <Toaster 
        position="top-right"
        richColors
        closeButton
        expand={true}
        duration={4000}
      />
    </AuthProvider>
  );
}

export default App;