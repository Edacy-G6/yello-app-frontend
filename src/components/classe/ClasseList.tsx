import React from 'react';
import { ClasseCard } from './ClasseCard';
import type { ClasseListDto } from '../../types/classe';

interface ClasseListProps {
  classes: ClasseListDto[];
  loading?: boolean;
  error?: string | null;
  onEdit?: (classe: ClasseListDto) => void;
  onDelete?: (classe: ClasseListDto) => void;
  onView?: (classe: ClasseListDto) => void;
  showActions?: boolean;
  emptyMessage?: string;
}

export function ClasseList({ 
  classes, 
  loading = false, 
  error, 
  onEdit, 
  onDelete, 
  onView, 
  showActions = true,
  emptyMessage = "Aucune classe trouvée"
}: ClasseListProps) {
  if (loading) {
    return <ClasseListSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-destructive mb-2">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-foreground mb-1">Erreur de chargement</h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="text-primary hover:underline"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (classes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-muted-foreground mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-foreground mb-1">Aucune classe</h3>
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {classes.map((classe) => (
        <ClasseCard
          key={classe._id}
          classe={classe}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
          showActions={showActions}
        />
      ))}
    </div>
  );
}

function ClasseListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="bg-card rounded-lg border p-6">
            <div className="space-y-4">
              {/* Header skeleton */}
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="h-5 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </div>
                <div className="h-8 w-8 bg-muted rounded"></div>
              </div>
              
              {/* Content skeleton */}
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="flex justify-between">
                  <div className="h-6 bg-muted rounded w-16"></div>
                  <div className="h-4 bg-muted rounded w-20"></div>
                </div>
                <div className="h-2 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
              
              {/* Actions skeleton */}
              <div className="flex space-x-2 pt-2">
                <div className="h-8 bg-muted rounded flex-1"></div>
                <div className="h-8 bg-muted rounded flex-1"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
