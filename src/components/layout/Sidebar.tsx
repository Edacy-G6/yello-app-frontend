import { Link, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';
import { ROUTES } from '../../constants';
import { useAuth } from '../../hooks/useAuth';
// import { useTheme } from '../../hooks';
import { 
  Home, 
  Upload, 
  BookOpen, 
  HelpCircle, 
  BarChart3, 
  Settings,
  LogOut,
  Users,
  TrendingUp,
  Shield,
//   Sun,
//   Moon
} from 'lucide-react';

interface SidebarProps {
  className?: string;
  variant?: 'teacher' | 'student' | 'parent' | 'admin';
}

export default function Sidebar({ className = '', variant = 'teacher' }: SidebarProps) {
  const location = useLocation();
  const { logout } = useAuth();
  // const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  // Génération dynamique des éléments de navigation selon le rôle
  const getNavigationItems = () => {
    const getDashboardRoute = () => {
      switch (variant) {
        case 'teacher': return ROUTES.TEACHER_DASHBOARD;
        case 'student': return ROUTES.STUDENT_DASHBOARD;
        case 'parent': return ROUTES.PARENT_DASHBOARD;
        case 'admin': return ROUTES.ADMIN_DASHBOARD;
        default: return ROUTES.DASHBOARD;
      }
    };

    const baseItems = [
      {
        name: 'Accueil',
        href: getDashboardRoute(),
        icon: Home,
        active: isActive(getDashboardRoute()),
        roles: ['teacher', 'student', 'parent', 'admin']
      }
    ];

    const roleSpecificItems = {
      teacher: [
        {
          name: 'Importer PDF',
          href: ROUTES.TEACHER_IMPORT_PDF,
          icon: Upload,
          active: isActive(ROUTES.TEACHER_IMPORT_PDF),
          roles: ['teacher']
        },
        {
          name: 'Mes cours',
          href: ROUTES.TEACHER_COURSES,
          icon: BookOpen,
          active: isActive(ROUTES.TEACHER_COURSES),
          roles: ['teacher']
        },
        {
          name: 'Quiz',
          href: ROUTES.TEACHER_QUIZ,
          icon: HelpCircle,
          active: isActive(ROUTES.TEACHER_QUIZ),
          roles: ['teacher']
        },
        {
          name: 'Suivi',
          href: ROUTES.TEACHER_ANALYTICS,
          icon: BarChart3,
          active: isActive(ROUTES.TEACHER_ANALYTICS),
          roles: ['teacher']
        }
      ],
      student: [
        {
          name: 'Mes cours',
          href: ROUTES.STUDENT_COURSES,
          icon: BookOpen,
          active: isActive(ROUTES.STUDENT_COURSES),
          roles: ['student']
        },
        {
          name: 'Progrès',
          href: ROUTES.STUDENT_PROGRESS,
          icon: TrendingUp,
          active: isActive(ROUTES.STUDENT_PROGRESS),
          roles: ['student']
        }
      ],
      parent: [
        {
          name: 'Mes enfants',
          href: ROUTES.PARENT_CHILDREN,
          icon: Users,
          active: isActive(ROUTES.PARENT_CHILDREN),
          roles: ['parent']
        },
        {
          name: 'Rapports',
          href: ROUTES.PARENT_REPORTS,
          icon: BarChart3,
          active: isActive(ROUTES.PARENT_REPORTS),
          roles: ['parent']
        }
      ],
      admin: [
        {
          name: 'Utilisateurs',
          href: ROUTES.ADMIN_USERS,
          icon: Users,
          active: isActive(ROUTES.ADMIN_USERS),
          roles: ['admin']
        },
        {
          name: 'Écoles',
          href: ROUTES.ADMIN_SCHOOLS,
          icon: Shield,
          active: isActive(ROUTES.ADMIN_SCHOOLS),
          roles: ['admin']
        }
      ]
    };

    const allItems = [...baseItems, ...(roleSpecificItems[variant] || [])];
    
    // Filtrer selon le rôle actuel
    return allItems.filter(item => item.roles.includes(variant));
  };

  const navigationItems = getNavigationItems();

  return (
    <div className={`bg-background border-r border-border h-full flex flex-col ${className}`}>
      {/* Header du sidebar */}
      <div className="p-6 border-b border-border">
        <Link to={ROUTES.TEACHER_DASHBOARD} className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-[#E3AC02] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">Y</span>
          </div>
            <h1 className="text-lg font-bold text-foreground">Yello Studio</h1>
        </Link>
      </div>

      {/* Navigation principale */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.name} to={item.href}>
                <Button
                  variant={item.active ? "secondary" : "ghost"}
                  className={`w-full justify-start h-12 px-4 ${
                    item.active 
                      ? 'bg-accent text-accent-foreground shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  <span className="font-medium">{item.name}</span>
                </Button>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Section utilisateur et paramètres */}
      <div className="p-4 border-t border-border space-y-2">
        {/* Informations utilisateur */}
        {/* <div className="px-4 py-3 bg-muted/50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-primary font-semibold text-sm">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {user?.name || 'Utilisateur'}
              </p>
              <p className="text-xs text-muted-foreground capitalize">
                {user?.role || 'Enseignant'}
              </p>
            </div>
          </div>
        </div> */}

        {/* Toggle thème */}
        {/* <Button
          variant="ghost"
          onClick={toggleTheme}
          className="w-full justify-start h-12 px-4 text-muted-foreground hover:text-foreground hover:bg-muted"
          title={`Basculer vers le thème ${theme === 'light' ? 'sombre' : 'clair'}`}
        >
          {theme === 'light' ? (
            <Moon className="h-5 w-5 mr-3" />
          ) : (
            <Sun className="h-5 w-5 mr-3" />
          )}
          <span className="font-medium">
            {theme === 'light' ? 'Mode sombre' : 'Mode clair'}
          </span>
        </Button> */}

        {/* Paramètres */}
        <Link to={ROUTES.SETTINGS}>
          <Button
            variant="ghost"
            className="w-full justify-start h-12 px-4 text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <Settings className="h-5 w-5 mr-3" />
            <span className="font-medium">Paramètres</span>
          </Button>
        </Link>

        {/* Déconnexion */}
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start h-12 px-4 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span className="font-medium">Déconnexion</span>
        </Button>
      </div>
    </div>
  );
}
