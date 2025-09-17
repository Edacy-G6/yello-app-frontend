import { useAuth } from '../hooks/useAuth';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { usePermissions } from '../hooks/useAuthHelpers';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { getRoleDisplayName, getUserDisplayName } = usePermissions();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const getDashboardContent = () => {
    if (!user) return null;

    const role = user.role;
    
    switch (role) {
      case 'teacher':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-2 text-foreground">Mes Classes</h3>
                <p className="text-muted-foreground mb-4">Gérez vos classes virtuelles</p>
                <Button className="w-full">
                  Voir mes classes
                </Button>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-2 text-foreground">Créer une Leçon</h3>
                <p className="text-muted-foreground mb-4">Transformez vos contenus avec l'IA</p>
                <Button className="w-full">
                  Créer une leçon
                </Button>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-2 text-foreground">Rapports</h3>
                <p className="text-muted-foreground mb-4">Suivez la progression de vos élèves</p>
                <Button className="w-full">
                  Voir les rapports
                </Button>
              </Card>
            </div>
          </div>
        );

      case 'student':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-2 text-foreground">Mes Cours</h3>
                <p className="text-muted-foreground mb-4">Accédez à vos leçons</p>
                <Button className="w-full">
                  Voir mes cours
                </Button>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-2 text-foreground">Quiz</h3>
                <p className="text-muted-foreground mb-4">Testez vos connaissances</p>
                <Button className="w-full">
                  Passer un quiz
                </Button>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-2 text-foreground">Progression</h3>
                <p className="text-muted-foreground mb-4">Suivez vos résultats</p>
                <Button className="w-full">
                  Voir ma progression
                </Button>
              </Card>
            </div>
          </div>
        );

      case 'parent':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-2 text-foreground">Mes Enfants</h3>
                <p className="text-muted-foreground mb-4">Suivez la progression de vos enfants</p>
                <Button className="w-full">
                  Voir les profils
                </Button>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-2 text-foreground">Rapports</h3>
                <p className="text-muted-foreground mb-4">Consultez les bulletins</p>
                <Button className="w-full">
                  Voir les rapports
                </Button>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-2 text-foreground">Communications</h3>
                <p className="text-muted-foreground mb-4">Messages des enseignants</p>
                <Button className="w-full">
                  Voir les messages
                </Button>
              </Card>
            </div>
          </div>
        );

      case 'admin':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-2 text-foreground">Gestion École</h3>
                <p className="text-muted-foreground mb-4">Administrez votre établissement</p>
                <Button className="w-full">
                  Gérer l'école
                </Button>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-2 text-foreground">Utilisateurs</h3>
                <p className="text-muted-foreground mb-4">Gérez les comptes utilisateurs</p>
                <Button className="w-full">
                  Gérer les utilisateurs
                </Button>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-2 text-foreground">Statistiques</h3>
                <p className="text-muted-foreground mb-4">Tableaux de bord détaillés</p>
                <Button className="w-full">
                  Voir les statistiques
                </Button>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-2 text-foreground">Paramètres</h3>
                <p className="text-muted-foreground mb-4">Configuration système</p>
                <Button className="w-full">
                  Paramètres
                </Button>
              </Card>
            </div>
          </div>
        );

      default:
        return (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">Tableau de bord</h3>
            <p className="text-muted-foreground">Contenu du tableau de bord pour votre rôle.</p>
          </Card>
        );
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <div className="bg-background shadow border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Tableau de bord
                </h1>
                <p className="text-muted-foreground">
                  Bienvenue, {getUserDisplayName()} ({user && getRoleDisplayName(user.role)})
                </p>
              </div>
              <Button onClick={handleLogout} variant="outline">
                Se déconnecter
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {getDashboardContent()}
        </div>
      </div>
    </ProtectedRoute>
  );
}
