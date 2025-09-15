import { Link } from 'react-router-dom';
import { ROUTES } from '../constants';
import { Button } from '../components/ui';
import { useAuth } from '../hooks/useAuth';

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6">
              Bienvenue sur{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
                Yello
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-3xl mx-auto">
              La plateforme d'éducation numérique qui révolutionne l'apprentissage en Afrique
            </p>
            <p className="text-lg text-muted-foreground/80 mb-12 max-w-2xl mx-auto">
              Transformez vos contenus pédagogiques en leçons interactives avec l'IA, 
              créez des classes virtuelles et suivez la progression de vos élèves en temps réel.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {isAuthenticated ? (
                <>
                  <Button size="lg" asChild className="text-lg px-8 py-4">
                    <Link to={ROUTES.DASHBOARD}>
                      Aller au tableau de bord
                    </Link>
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Connecté en tant que {user?.name}
                  </p>
                </>
              ) : (
                <>
                  <Button size="lg" asChild className="text-lg px-8 py-4">
                    <Link to={ROUTES.LOGIN}>
                      Se connecter
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild className="text-lg px-8 py-4">
                    <Link to={ROUTES.REGISTER}>
                      Créer un compte
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Pourquoi choisir Yello ?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Une solution complète adaptée aux réalités africaines pour moderniser l'éducation
            </p>
          </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-background rounded-lg border">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                IA Pédagogique
              </h3>
              <p className="text-muted-foreground">
                Transformez instantanément vos PDF et documents en leçons interactives grâce à l'intelligence artificielle.
              </p>
            </div>

            <div className="text-center p-6 bg-background rounded-lg border">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Mobile First
              </h3>
              <p className="text-muted-foreground">
                Optimisé pour les smartphones et les connexions lentes, accessible partout en Afrique.
              </p>
            </div>

            <div className="text-center p-6 bg-background rounded-lg border">
              <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Suivi en Temps Réel
              </h3>
              <p className="text-muted-foreground">
                Quiz auto-corrigés, rapports automatiques aux parents et tableau de bord pédagogique complet.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Prêt à révolutionner votre enseignement ?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers d'enseignants qui utilisent déjà Yello pour créer un apprentissage plus interactif et efficace.
          </p>
          
          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild className="text-lg px-8 py-4">
                <Link to={ROUTES.REGISTER}>
                  Commencer gratuitement
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8 py-4 border-white bg-black text-white hover:bg-white hover:text-blue-600">
                <Link to={ROUTES.ABOUT}>
                  En savoir plus
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
