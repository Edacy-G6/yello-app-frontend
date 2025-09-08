import { Card, CardHeader, CardTitle, CardContent } from '../components/ui';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-4xl font-bold">
              À propos de Yello
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              Yello est une application React moderne construite avec les dernières technologies
              et les meilleures pratiques de développement.
            </p>
            <div>
              <h2 className="text-2xl font-semibold mb-4">
                Technologies utilisées
              </h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>React 18 avec TypeScript</li>
                <li>Vite pour le build et le développement</li>
                <li>Tailwind CSS pour le styling</li>
                <li>shadcn/ui pour les composants</li>
                <li>React Router pour la navigation</li>
                <li>Zustand pour la gestion d'état</li>
                <li>Vitest pour les tests</li>
                <li>ESLint et Prettier pour la qualité du code</li>
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4">
                Architecture
              </h2>
              <p className="text-muted-foreground">
                L'application suit les principes SOLID et utilise une architecture modulaire
                avec une séparation claire des responsabilités.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
