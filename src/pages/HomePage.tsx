import { Link } from 'react-router-dom';
import { ROUTES } from '../constants';
import { Button } from '../components/ui';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-6xl font-bold text-primary mb-6">
          Bienvenue sur {import.meta.env['VITE_APP_NAME'] || 'Yello'}
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Une application React moderne construite avec TypeScript, Tailwind CSS, shadcn/ui et les meilleures pratiques.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link to={ROUTES.ABOUT}>
              En savoir plus
            </Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link to={ROUTES.CONTACT}>
              Nous contacter
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
