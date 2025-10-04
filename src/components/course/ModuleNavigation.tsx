import { useState } from 'react';
import { Button } from '../ui/button';
import { CheckCircle, Circle } from 'lucide-react';
import type { Module } from '../../types';

interface ModuleNavigationProps {
  modules: Module[];
  activeModuleId: string;
  onModuleChange: (moduleId: string) => void;
  className?: string;
}

export default function ModuleNavigation({ 
  modules, 
  activeModuleId, 
  onModuleChange, 
  className = '' 
}: ModuleNavigationProps) {
  const sortedModules = [...modules].sort((a, b) => a.order - b.order);

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {sortedModules.map((module, index) => {
        const isActive = module.id === activeModuleId;
        const isCompleted = module.isCompleted;
        
        return (
          <Button
            key={module.id}
            variant={isActive ? "default" : "outline"}
            size="sm"
            onClick={() => onModuleChange(module.id)}
            className={`flex items-center space-x-2 px-4 py-2 ${
              isActive
                ? 'bg-background text-foreground shadow-sm border-2 border-primary'
                : 'bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            {isCompleted ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <Circle className="h-4 w-4" />
            )}
            <span className="font-medium">
              Module {index + 1}
            </span>
          </Button>
        );
      })}
    </div>
  );
}
