import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants';
import { useTheme } from '../../hooks';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/button';
import { Menu, Bell, User } from 'lucide-react';

interface HeaderProps {
  showSidebar?: boolean;
  onToggleSidebar?: () => void;
}

export default function Header({ showSidebar = false, onToggleSidebar }: HeaderProps) {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  if (showSidebar) {
    // Header simplifié pour les pages avec sidebar
    return (
      <header className="bg-background border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Bouton toggle sidebar (mobile) */}
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Espace vide pour centrer le contenu sur desktop */}
          <div className="flex-1" />

          {/* Actions du header */}
          <div className="flex items-center space-x-4">
            {/* Toggle thème */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              title={`Basculer vers le thème ${theme === 'light' ? 'sombre' : 'clair'}`}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            {/* Notifications */}
            <button className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs"></span>
            </button>

            {/* Profil utilisateur */}
            <button className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
              <User className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>
    );
  }

  // Header complet pour les pages sans sidebar
  return (
    <header className="bg-background shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link
              to={ROUTES.HOME}
              className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600"
            >
              Yello
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <Link
              to={ROUTES.HOME}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive(ROUTES.HOME)
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Accueil
            </Link>
            <Link
              to={ROUTES.ABOUT}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive(ROUTES.ABOUT)
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              À propos
            </Link>
            <Link
              to={ROUTES.CONTACT}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive(ROUTES.CONTACT)
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Contact
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="hidden sm:flex items-center space-x-3">
                  <span className="text-sm text-muted-foreground">
                    Bonjour, <span className="font-medium text-foreground">{user?.name}</span>
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent text-accent-foreground">
                    {user?.role}
                  </span>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to={ROUTES.DASHBOARD}>
                    Tableau de bord
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Déconnexion
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to={ROUTES.LOGIN}>
                    Connexion
                  </Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to={ROUTES.REGISTER}>
                    S'inscrire
                  </Link>
                </Button>
              </>
            )}
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              title={`Basculer vers le thème ${theme === 'light' ? 'sombre' : 'clair'}`}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
