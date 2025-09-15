import { useNavigate, useLocation, Link } from 'react-router-dom';
import { LoginForm } from '../components/forms/LoginForm';
import { PublicRoute } from '../components/auth/ProtectedRoute';
import { ROUTES } from '../constants';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLoginSuccess = () => {
    // Récupérer la page d'origine depuis l'état de navigation
    const from = location.state?.from || ROUTES.DASHBOARD;
    navigate(from, { replace: true });
  };

  const handleLoginError = (error: string) => {
    console.error('Erreur de connexion:', error);
    // L'erreur est déjà gérée dans le hook useLogin
  };

  return (
    <PublicRoute>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <Link to={ROUTES.HOME} className="inline-block">
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 mb-2">
                Yello
              </h1>
            </Link>
            <p className="text-muted-foreground text-lg">
              Connectez-vous à votre espace éducatif
            </p>
            <p className="text-sm text-muted-foreground/80 mt-2">
              Plateforme d'éducation numérique pour l'Afrique
            </p>
          </div>
        </div>

        {/* Login Form */}
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <LoginForm 
            onSuccess={handleLoginSuccess}
            onError={handleLoginError}
          />
        </div>

        {/* Links */}
        <div className="mt-8 text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Pas encore de compte ?{' '}
            <Link
              to={ROUTES.REGISTER}
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              Créer un compte gratuitement
            </Link>
          </p>
          
          <div className="flex items-center justify-center space-x-4">
            <Link
              to={ROUTES.HOME}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Retour à l'accueil
            </Link>
            <span className="text-gray-300">•</span>
            <Link
              to="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Mot de passe oublié ?
            </Link>
          </div>
        </div>

        {/* Features Preview */}
        <div className="mt-12 sm:mx-auto sm:w-full sm:max-w-2xl">
          <div className="bg-background/50 backdrop-blur-sm rounded-lg p-6 border">
            <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
              Ce que vous pourrez faire avec Yello
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-blue-600">🤖</span>
                <span className="text-muted-foreground">Créer des leçons avec l'IA</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-600">📱</span>
                <span className="text-muted-foreground">Classes virtuelles mobiles</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-purple-600">📊</span>
                <span className="text-muted-foreground">Suivi des progrès</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicRoute>
  );
}
