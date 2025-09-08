import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants';
import { useTheme } from '../../hooks';

export default function Header() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-background shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link
              to={ROUTES.HOME}
              className="text-2xl font-bold text-primary"
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
