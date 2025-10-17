import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  Users, 
  Calendar, 
  Clock, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  BookOpen
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import type { ClasseListDto, ClasseStatus } from '../../types/classe';
import { classeService } from '../../services/classeService';

interface ClasseCardProps {
  classe: ClasseListDto;
  onEdit?: (classe: ClasseListDto) => void;
  onDelete?: (classe: ClasseListDto) => void;
  onView?: (classe: ClasseListDto) => void;
  showActions?: boolean;
}

const statusConfig: Record<ClasseStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  ACTIVE: { label: 'Active', variant: 'default' },
  INACTIVE: { label: 'Inactive', variant: 'secondary' },
  COMPLETED: { label: 'Terminée', variant: 'outline' },
  CANCELLED: { label: 'Annulée', variant: 'destructive' },
};

export function ClasseCard({ 
  classe, 
  onEdit, 
  onDelete, 
  onView, 
  showActions = true 
}: ClasseCardProps) {
  const statusInfo = statusConfig[classe.status];
  const occupancyPercentage = classeService.getClassOccupancyPercentage(classe);
  const isFull = classeService.isClassFull(classe);
  const isActive = classeService.isClassActive(classe);

  const handleView = () => {
    if (onView) {
      onView(classe);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(classe);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(classe);
    }
  };

  return (
    <Card className="h-full hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg font-semibold line-clamp-1">
              {classe.className}
            </CardTitle>
            <CardDescription className="line-clamp-2">
              {classe.description || 'Aucune description'}
            </CardDescription>
          </div>
          
          {showActions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleView}>
                  <Eye className="mr-2 h-4 w-4" />
                  Voir
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleDelete}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Informations du cours */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <BookOpen className="h-4 w-4" />
          <span className="line-clamp-1">{classe.courseTitle}</span>
        </div>

        {/* Statut et capacité */}
        <div className="flex items-center justify-between">
          <Badge variant={statusInfo.variant}>
            {statusInfo.label}
          </Badge>
          
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span className={isFull ? 'text-destructive font-medium' : ''}>
              {classe.currentStudents}/{classe.maxStudents}
            </span>
            <span className="text-xs">
              ({occupancyPercentage}%)
            </span>
          </div>
        </div>

        {/* Barre de progression de la capacité */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Capacité</span>
            <span>{occupancyPercentage}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                isFull 
                  ? 'bg-destructive' 
                  : occupancyPercentage > 80 
                    ? 'bg-orange-500' 
                    : 'bg-primary'
              }`}
              style={{ width: `${Math.min(occupancyPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Dates */}
        {(classe.startDate || classe.endDate) && (
          <div className="space-y-2">
            {classe.startDate && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  Début: {classeService.formatDate(classe.startDate)}
                </span>
              </div>
            )}
            {classe.endDate && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  Fin: {classeService.formatDate(classe.endDate)}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={handleView}
          >
            <Eye className="mr-2 h-4 w-4" />
            Voir détails
          </Button>
          
          {isActive && (
            <Button 
              variant="default" 
              size="sm" 
              className="flex-1"
              onClick={handleEdit}
            >
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
