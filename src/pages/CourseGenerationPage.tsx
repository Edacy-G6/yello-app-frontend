import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Plus, History } from 'lucide-react';
import { CourseGenerationForm } from '../components/course/CourseGenerationForm';
import { CourseGenerationHistory } from '../components/course/CourseGenerationHistory';
import type { Course, GenerationProgress } from '../types/course';

export const CourseGenerationPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('generate');

  const handleCourseGenerated = (course: Course) => {
    // Rediriger vers la page de détail du cours généré
    navigate(`/courses/${course._id}`);
  };

  const handleViewGeneration = (generation: GenerationProgress) => {
    // Afficher les détails de la génération
    console.log('Voir génération:', generation);
    // TODO: Implémenter la vue détaillée
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/courses')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux cours
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Génération de cours par IA</h1>
            <p className="text-gray-600 mt-1">
              Transformez vos documents en cours interactifs avec l'intelligence artificielle
            </p>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generate" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Générer un cours
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Historique
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="mt-6">
          <div className="space-y-6">
            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-blue-900 mb-3">
                Comment ça marche ?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-200 rounded-full w-6 h-6 flex items-center justify-center text-blue-900 font-bold text-xs">
                    1
                  </div>
                  <div>
                    <strong>Uploadez votre document</strong>
                    <p className="mt-1">PDF, Word, TXT ou Markdown</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-200 rounded-full w-6 h-6 flex items-center justify-center text-blue-900 font-bold text-xs">
                    2
                  </div>
                  <div>
                    <strong>Configurez votre cours</strong>
                    <p className="mt-1">Titre, matière, niveau</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-200 rounded-full w-6 h-6 flex items-center justify-center text-blue-900 font-bold text-xs">
                    3
                  </div>
                  <div>
                    <strong>L'IA génère automatiquement</strong>
                    <p className="mt-1">Modules + Quiz interactifs</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulaires de génération */}
            <CourseGenerationForm onCourseGenerated={handleCourseGenerated} />
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <CourseGenerationHistory onViewGeneration={handleViewGeneration} />
        </TabsContent>
      </Tabs>

      {/* Informations supplémentaires */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="font-semibold text-green-900 mb-2">🚀 Rapide</h3>
          <p className="text-sm text-green-800">
            Génération automatique en quelques minutes grâce à l'IA
          </p>
        </div>
        
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <h3 className="font-semibold text-purple-900 mb-2">🎯 Personnalisé</h3>
          <p className="text-sm text-purple-800">
            Quiz adaptés à votre contenu avec différents types de questions
          </p>
        </div>
        
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <h3 className="font-semibold text-orange-900 mb-2">📚 Interactif</h3>
          <p className="text-sm text-orange-800">
            Modules structurés et quiz auto-corrigés pour vos élèves
          </p>
        </div>
      </div>
    </div>
  );
};
