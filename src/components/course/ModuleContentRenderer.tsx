import React from 'react';
import { Card, CardContent } from '../ui/card';

interface ModuleContentRendererProps {
  content: string;
  className?: string;
}

/**
 * Composant pour rendre le contenu d'un module avec formatage Markdown basique
 */
export const ModuleContentRenderer: React.FC<ModuleContentRendererProps> = ({
  content,
  className = '',
}) => {
  if (!content) {
    return (
      <div className={`text-muted-foreground italic ${className}`}>
        Aucun contenu disponible pour ce module.
      </div>
    );
  }

  // Fonction pour convertir le contenu en JSX
  const renderContent = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let currentList: string[] = [];
    let listType: 'ul' | 'ol' | null = null;

    const flushList = () => {
      if (currentList.length > 0) {
        if (listType === 'ul') {
          elements.push(
            <ul key={`list-${elements.length}`} className="list-disc list-inside space-y-1 my-2">
              {currentList.map((item, index) => (
                <li key={index} className="text-sm">
                  {renderInlineFormatting(item)}
                </li>
              ))}
            </ul>
          );
        } else if (listType === 'ol') {
          elements.push(
            <ol key={`list-${elements.length}`} className="list-decimal list-inside space-y-1 my-2">
              {currentList.map((item, index) => (
                <li key={index} className="text-sm">
                  {renderInlineFormatting(item)}
                </li>
              ))}
            </ol>
          );
        }
        currentList = [];
        listType = null;
      }
    };

    const renderInlineFormatting = (text: string) => {
      // Gérer le gras **text**
      let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      // Gérer l'italique *text*
      formatted = formatted.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');
      
      // Gérer les liens [text](url)
      formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');
      
      return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
    };

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      // Titres avec #
      if (trimmedLine.startsWith('#')) {
        flushList();
        const level = trimmedLine.match(/^#+/)?.[0].length || 1;
        const text = trimmedLine.replace(/^#+\s*/, '');
        const HeadingTag = `h${Math.min(level, 6)}` as keyof JSX.IntrinsicElements;
        
        elements.push(
          <HeadingTag 
            key={index} 
            className={`font-bold text-foreground my-3 ${
              level === 1 ? 'text-xl' : 
              level === 2 ? 'text-lg' : 
              level === 3 ? 'text-base' : 'text-sm'
            }`}
          >
            {text}
          </HeadingTag>
        );
        return;
      }
      
      // Listes avec •
      if (trimmedLine.startsWith('• ')) {
        if (listType !== 'ul') {
          flushList();
          listType = 'ul';
        }
        currentList.push(trimmedLine.substring(2));
        return;
      }
      
      // Listes numérotées
      if (/^\d+\.\s/.test(trimmedLine)) {
        if (listType !== 'ol') {
          flushList();
          listType = 'ol';
        }
        currentList.push(trimmedLine.replace(/^\d+\.\s/, ''));
        return;
      }
      
      // Lignes vides
      if (trimmedLine === '') {
        flushList();
        elements.push(<br key={`br-${index}`} />);
        return;
      }
      
      // Paragraphes normaux
      flushList();
      elements.push(
        <p key={index} className="text-sm text-foreground leading-relaxed my-2">
          {renderInlineFormatting(trimmedLine)}
        </p>
      );
    });

    // Flush la liste restante
    flushList();

    return <>{elements}</>;
  };

  return (
    <Card className={`${className}`}>
      <CardContent className="p-4">
        <div className="prose prose-sm max-w-none">
          {renderContent(content)}
        </div>
      </CardContent>
    </Card>
  );
};

export default ModuleContentRenderer;
