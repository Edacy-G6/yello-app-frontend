import { useState } from 'react';
import { Button } from '../ui/button';
import { BookOpen, HelpCircle } from 'lucide-react';
import type { Module, ModuleContent, Quiz } from '../../types';

interface ModuleContentTabsProps {
  module: Module;
  className?: string;
}

export default function ModuleContentTabs({ module, className = '' }: ModuleContentTabsProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'quiz'>('content');

  const renderContent = () => {
    if (activeTab === 'content') {
      return <ModuleContentView content={module.content} />;
    } else {
      return <ModuleQuizView quiz={module.quiz} />;
    }
  };

  return (
    <div className={className}>
      {/* Navigation des onglets */}
      <div className="flex items-center space-x-1 bg-muted/30 p-1 rounded-lg mb-6">
        <Button
          variant={activeTab === 'content' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('content')}
          className={`flex items-center space-x-2 px-4 py-2 ${
            activeTab === 'content'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span className="font-medium">Cours</span>
        </Button>
        
        <Button
          variant={activeTab === 'quiz' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('quiz')}
          className={`flex items-center space-x-2 px-4 py-2 ${
            activeTab === 'quiz'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <HelpCircle className="h-4 w-4" />
          <span className="font-medium">Quiz</span>
        </Button>
      </div>

      {/* Contenu */}
      {renderContent()}
    </div>
  );
}

// Composant pour afficher le contenu du module
function ModuleContentView({ content }: { content: ModuleContent[] }) {
  const sortedContent = [...content].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      {sortedContent.map((item) => (
        <div key={item.id} className="prose prose-gray dark:prose-invert max-w-none">
          {item.type === 'heading' && (
            <h1 className={`text-foreground font-bold ${
              item.level === 1 ? 'text-3xl' : 
              item.level === 2 ? 'text-2xl' : 'text-xl'
            }`}>
              {item.content}
            </h1>
          )}
          
          {item.type === 'section' && (
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              {item.title || item.content}
            </h2>
          )}
          
          {item.type === 'paragraph' && (
            <p className="text-foreground leading-relaxed">
              {item.content}
            </p>
          )}
          
          {item.type === 'formula' && (
            <div className="bg-muted/50 p-4 rounded-lg border-l-4 border-primary">
              <code className="text-lg font-mono text-foreground">
                {item.content}
              </code>
            </div>
          )}
          
          {item.type === 'example' && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Exemple :
              </h4>
              <p className="text-blue-800 dark:text-blue-200">
                {item.content}
              </p>
            </div>
          )}
          
          {item.type === 'exercise' && (
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                Exercice :
              </h4>
              <p className="text-white dark:text-green-200">
                {item.content}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Composant pour afficher le quiz du module
function ModuleQuizView({ quiz }: { quiz: Quiz }) {
  if (!quiz.isActive) {
    return (
      <div className="text-center py-12">
        <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">
          Quiz non disponible
        </h3>
        <p className="text-muted-foreground">
          Ce quiz n'est pas encore activé.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-muted/50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          {quiz.title}
        </h3>
        {quiz.description && (
          <p className="text-muted-foreground mb-4">
            {quiz.description}
          </p>
        )}
        
        <div className="flex items-center space-x-6 text-sm text-muted-foreground">
          <span>{quiz.questions.length} questions</span>
          {quiz.duration && <span>{quiz.duration} minutes</span>}
          {quiz.passingScore && <span>Score minimum: {quiz.passingScore}%</span>}
        </div>
      </div>

      <div className="text-center">
        <Button size="lg" className="bg-primary hover:bg-primary/90">
          Commencer le quiz
        </Button>
      </div>
    </div>
  );
}
