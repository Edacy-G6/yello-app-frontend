import { Link } from 'react-router-dom';
import { ROUTES } from '../constants';
import { Button } from '../components/ui';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">
          Page non trouvée
        </h2>
        <p className="text-muted-foreground mb-8">
          Désolé, la page que vous recherchez n'existe pas.
        </p>
        <Button asChild>
          <Link to={ROUTES.HOME}>
            Retour à l'accueil
          </Link>
        </Button>
      </div>
    </div>
  );
}
