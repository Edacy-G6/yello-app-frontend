import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TeacherDashboardPage from './pages/TeacherDashboardPage';
import ImportPdfPage from './pages/ImportPdfPage';
import CourseEditorPage from './pages/CourseEditorPage';
import { AuthProvider, RoleBasedRedirect, ProtectedRoute } from './components/auth';
import { ROUTES } from './constants';

function App() {
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
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<TeacherDashboardPage />} />
            <Route path="import-pdf" element={<ImportPdfPage />} />
            <Route path="course-editor" element={<CourseEditorPage />} />
            <Route path="quiz" element={<div>Quiz Page (À implémenter)</div>} />
            <Route path="analytics" element={<div>Analytics Page (À implémenter)</div>} />
            <Route path="courses" element={<div>Courses Page (À implémenter)</div>} />
          </Route>
          
          {/* Autres routes protégées */}
          <Route path={ROUTES.CLASSES} element={<div>Classes Page (À implémenter)</div>} />
          <Route path={ROUTES.STUDENTS} element={<div>Students Page (À implémenter)</div>} />
          <Route path={ROUTES.REPORTS} element={<div>Reports Page (À implémenter)</div>} />

          {/* Route 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;