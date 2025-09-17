import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants';

export default function RoleBasedRedirect() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      switch (user.role) {
        case 'teacher':
          navigate(ROUTES.TEACHER_DASHBOARD, { replace: true });
          break;
        case 'student':
          navigate(ROUTES.STUDENT_DASHBOARD, { replace: true });
          break;
        case 'parent':
          navigate(ROUTES.PARENT_DASHBOARD, { replace: true });
          break;
        case 'admin':
          navigate(ROUTES.ADMIN_DASHBOARD, { replace: true });
          break;
        default:
          navigate(ROUTES.DASHBOARD, { replace: true });
      }
    } else if (!isLoading && !isAuthenticated) {
      navigate(ROUTES.LOGIN, { replace: true });
    }
  }, [user, isAuthenticated, isLoading, navigate]);

  // Afficher un loader pendant la redirection
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirection en cours...</p>
      </div>
    </div>
  );
}
