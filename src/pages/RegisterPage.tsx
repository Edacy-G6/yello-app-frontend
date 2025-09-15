import { useNavigate, Link } from 'react-router-dom';
import { RegisterForm } from '../components/forms/RegisterForm';
import { PublicRoute } from '../components/auth/ProtectedRoute';
import { ROUTES } from '../constants';

export default function RegisterPage() {
  const navigate = useNavigate();

  const handleRegisterSuccess = () => {
    navigate(ROUTES.DASHBOARD, { replace: true });
  };

  const handleRegisterError = (error: string) => {
    console.error('Erreur d\'inscription:', error);
    // L'erreur est déjà gérée dans le hook useRegister
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
              Créez votre compte éducatif
            </p>
            <p className="text-sm text-muted-foreground/80 mt-2">
              Rejoignez la révolution éducative africaine
            </p>
          </div>
        </div>

        {/* Register Form */}
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <RegisterForm 
            onSuccess={handleRegisterSuccess}
            onError={handleRegisterError}
          />
        </div>

        {/* Links */}
        <div className="mt-8 text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Déjà un compte ?{' '}
            <Link
              to={ROUTES.LOGIN}
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              Se connecter
            </Link>
          </p>
          
          <div className="flex items-center justify-center">
            <Link
              to={ROUTES.HOME}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Retour à l'accueil
            </Link>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-12 sm:mx-auto sm:w-full sm:max-w-2xl">
          <div className="bg-background/50 backdrop-blur-sm rounded-lg p-6 border">
            <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
              Rejoignez Yello et profitez de :
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-green-600">✓</span>
                <span className="text-muted-foreground">Création de leçons avec l'IA</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-600">✓</span>
                <span className="text-muted-foreground">Classes virtuelles illimitées</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-600">✓</span>
                <span className="text-muted-foreground">Quiz et évaluations automatiques</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-600">✓</span>
                <span className="text-muted-foreground">Rapports de progression</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-600">✓</span>
                <span className="text-muted-foreground">Support mobile optimisé</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-600">✓</span>
                <span className="text-muted-foreground">Communauté d'enseignants</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicRoute>
  );
}
