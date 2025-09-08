import { ROUTES } from '../../constants';

export default function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Yello</h3>
            <p className="text-muted-foreground">
              Une application React moderne construite avec les meilleures pratiques
              et les dernières technologies.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href={ROUTES.HOME}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Accueil
                </a>
              </li>
              <li>
                <a
                  href={ROUTES.ABOUT}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  À propos
                </a>
              </li>
              <li>
                <a
                  href={ROUTES.CONTACT}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Technologies</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>React 18</li>
              <li>TypeScript</li>
              <li>Tailwind CSS</li>
              <li>shadcn/ui</li>
              <li>Vite</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; 2024 Yello. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
