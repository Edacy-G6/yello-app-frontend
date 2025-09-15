import { useState } from 'react';
import type { JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { MOCK_COURSE_CONTENT, ROUTES } from '../constants';
import type { CourseContent } from '../types';
import { 
  Bold, 
  Italic, 
  List, 
  Download, 
  RefreshCw, 
  ArrowLeft,
  Eye,
  Save
} from 'lucide-react';

export default function CourseEditorPage() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [, setShowFinalization] = useState(false);

  // Utilisation des mocks centralisés
  const courseContent = MOCK_COURSE_CONTENT;

  const renderContent = (item: CourseContent) => {
    switch (item.type) {
      case 'heading':
        const HeadingTag = `h${item.level}` as keyof JSX.IntrinsicElements;
        const headingClasses = {
          1: 'text-2xl font-bold text-foreground mb-6 mt-8',
          2: 'text-xl font-semibold text-foreground mb-4 mt-6',
          3: 'text-lg font-medium text-foreground mb-3 mt-4'
        };
        return (
          <HeadingTag className={headingClasses[item.level]}>
            {item.content}
          </HeadingTag>
        );
      
      case 'formula':
        return (
          <div className="bg-muted p-4 rounded-lg my-4">
            <code className="text-lg font-mono text-foreground">
              {item.content}
            </code>
          </div>
        );
      
      case 'example':
        return (
          <div className="bg-primary/5 border-l-4 border-primary p-4 rounded-lg my-4">
            <p className="text-foreground whitespace-pre-line">
              {item.content}
            </p>
          </div>
        );
      
      case 'exercise':
        return (
          <div className="bg-green-500/5 border-l-4 border-green-500 p-4 rounded-lg my-4">
            <p className="text-foreground whitespace-pre-line">
              {item.content}
            </p>
          </div>
        );
      
      default:
        return (
          <p className="text-foreground mb-4 whitespace-pre-line">
            {item.content}
          </p>
        );
    }
  };

  const handleExport = () => {
    setShowFinalization(true);
  };

  const handleRegenerate = () => {
    // Logique de régénération
    console.log('Régénération du cours...');
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header avec navigation */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate(ROUTES.TEACHER_IMPORT_PDF)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Introduction_à_la_Physique_101
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Eye className="h-4 w-4 mr-2" />
              {isEditing ? 'Aperçu' : 'Édition'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => console.log('Sauvegarder')}
            >
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Barre d'outils d'édition */}
          {isEditing && (
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Outils d'édition</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Formatage
                  </label>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Bold className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Italic className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Éléments
                  </label>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      Ajouter un titre
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      Ajouter un exercice
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      Ajouter une formule
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contenu du cours */}
          <Card className={isEditing ? 'lg:col-span-3' : 'lg:col-span-4'}>
            <CardContent className="p-8">
              <div className="max-w-4xl mx-auto">
                {courseContent.map((item) => (
                  <div key={item.id} className="group">
                    {isEditing && (
                      <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity mb-2">
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Bold className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                    {renderContent(item)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions en bas */}
        <div className="flex justify-center space-x-4 mt-8">
          <Button 
            variant="outline"
            onClick={handleRegenerate}
            className="min-w-[180px]"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Générer à nouveau
          </Button>
          <Button 
            onClick={handleExport}
            className="min-w-[180px]"
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter le cours
          </Button>
        </div>
      </div>
    </div>
  );
}
