import { useState } from 'react';
import { Button } from '../ui/button';
import { ChevronDown, ChevronRight, BookOpen, HelpCircle } from 'lucide-react';
import type { Module, ModuleContent } from '../../types';

interface CourseOutlineProps {
  modules: Module[];
  activeModuleId: string;
  activeContentId?: string;
  onModuleChange: (moduleId: string) => void;
  onContentChange?: (contentId: string) => void;
  className?: string;
}

export default function CourseOutline({ 
  modules, 
  activeModuleId, 
  activeContentId,
  onModuleChange,
  onContentChange,
  className = '' 
}: CourseOutlineProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set([activeModuleId])
  );

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const sortedModules = [...modules].sort((a, b) => a.order - b.order);

  return (
    <div className={`bg-background border border-border rounded-lg p-4 ${className}`}>
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Table des matières
      </h3>
      
      <div className="space-y-2">
        {sortedModules.map((module) => {
          const isExpanded = expandedModules.has(module.id);
          const isActive = module.id === activeModuleId;
          const sortedContent = [...module.content].sort((a, b) => a.order - b.order);

          return (
            <div key={module.id} className="space-y-1">
              {/* Module header */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleModule(module.id)}
                  className="h-6 w-6 p-0"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onModuleChange(module.id)}
                  className={`flex-1 justify-start h-8 px-2 ${
                    isActive
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <BookOpen className="h-3 w-3 mr-2" />
                  <span className="text-sm font-medium truncate">
                    {module.title}
                  </span>
                </Button>
              </div>

              {/* Module content */}
              {isExpanded && (
                <div className="ml-6 space-y-1">
                  {sortedContent.map((content) => {
                    const isContentActive = content.id === activeContentId;
                    
                    return (
                      <Button
                        key={content.id}
                        variant="ghost"
                        size="sm"
                        onClick={() => onContentChange?.(content.id)}
                        className={`w-full justify-start h-7 px-2 text-xs ${
                          isContentActive
                            ? 'bg-accent text-accent-foreground'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {content.type === 'heading' && (
                          <div className={`w-1 h-1 rounded-full mr-2 ${
                            content.level === 1 ? 'bg-primary' :
                            content.level === 2 ? 'bg-primary/70' : 'bg-primary/40'
                          }`} />
                        )}
                        {content.type === 'section' && (
                          <div className="w-1 h-1 rounded-full mr-2 bg-blue-500" />
                        )}
                        {content.type === 'example' && (
                          <div className="w-1 h-1 rounded-full mr-2 bg-green-500" />
                        )}
                        {content.type === 'exercise' && (
                          <div className="w-1 h-1 rounded-full mr-2 bg-orange-500" />
                        )}
                        <span className="truncate">
                          {content.title || content.content}
                        </span>
                      </Button>
                    );
                  })}
                  
                  {/* Quiz du module */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onModuleChange(module.id)}
                    className="w-full justify-start h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <HelpCircle className="h-3 w-3 mr-2" />
                    <span className="truncate">
                      Quiz - {module.quiz.title}
                    </span>
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
