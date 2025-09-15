import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants';
import { useAuth } from '../../hooks/useAuth';

interface FooterProps {
  showSidebar?: boolean;
}

export default function Footer({ showSidebar = false }: FooterProps) {
  const { isAuthenticated } = useAuth();

  if (showSidebar) {
    // Footer simplifié pour les pages avec sidebar
    return (
      <footer className="bg-muted text-muted-foreground py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm">
            &copy; 2025 Yello Studio. Tous droits réservés.
          </p>
        </div>
      </footer>
    );
  }

  // Footer complet pour les pages sans sidebar
  return (
    <footer className="bg-muted text-muted-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
                Yello
              </span>
            </h3>
            <p className="text-muted-foreground">
              Plateforme d'éducation numérique qui révolutionne l'apprentissage
              en Afrique avec l'intelligence artificielle.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground">Produit</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link
                  to={ROUTES.ABOUT}
                  className="hover:text-foreground transition-colors"
                >
                  À propos
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTES.CONTACT}
                  className="hover:text-foreground transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Fonctionnalités
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground">Compte</h4>
            <ul className="space-y-2 text-muted-foreground">
              {isAuthenticated ? (
                <>
                  <li>
                    <Link
                      to={ROUTES.DASHBOARD}
                      className="hover:text-foreground transition-colors"
                    >
                      Tableau de bord
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={ROUTES.CLASSES}
                      className="hover:text-foreground transition-colors"
                    >
                      Mes classes
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      to={ROUTES.LOGIN}
                      className="hover:text-foreground transition-colors"
                    >
                      Connexion
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={ROUTES.REGISTER}
                      className="hover:text-foreground transition-colors"
                    >
                      Inscription
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground">Support</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Aide
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Communauté
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              &copy; 2025 Yello. Tous droits réservés.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                Politique de confidentialité
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                Conditions d'utilisation
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
