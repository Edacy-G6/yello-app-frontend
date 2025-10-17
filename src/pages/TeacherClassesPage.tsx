import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List,
  Users,
  BookOpen,
  Calendar
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { ClasseList } from '../components/classe/ClasseList';
import { useClasses } from '../hooks/useClasses';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants';
import type { ClasseListDto, ClasseStatus, ClasseFilters } from '../types/classe';

const statusOptions = [
  { value: 'all', label: 'Tous les statuts' },
  { value: 'ACTIVE', label: 'Actives' },
  { value: 'INACTIVE', label: 'Inactives' },
  { value: 'COMPLETED', label: 'Terminées' },
  { value: 'CANCELLED', label: 'Annulées' },
];

export default function TeacherClassesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<ClasseFilters>({});

  // Récupérer les classes de l'enseignant
  const { classes, loading, error, refetch } = useClasses({
    teacherId: user?.id,
    enabled: true,
    filters,
  });

  // Gérer la recherche
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setFilters(prev => ({
      ...prev,
      search: query || undefined,
    }));
  }, []);

  // Gérer le filtre de statut
  const handleStatusFilter = useCallback((status: string) => {
    setStatusFilter(status);
    setFilters(prev => ({
      ...prev,
      status: status === 'all' ? undefined : (status as ClasseStatus),
    }));
  }, []);

  // Actions sur les classes
  const handleViewClasse = useCallback((classe: ClasseListDto) => {
    navigate(ROUTES.TEACHER_CLASS_DETAIL.replace(':id', classe._id));
  }, [navigate]);

  const handleEditClasse = useCallback((classe: ClasseListDto) => {
    navigate(ROUTES.TEACHER_CLASS_EDIT.replace(':id', classe._id));
  }, [navigate]);

  const handleDeleteClasse = useCallback((classe: ClasseListDto) => {
    // TODO: Implémenter la confirmation de suppression
    console.log('Supprimer classe:', classe._id);
  }, []);

  const handleCreateClasse = useCallback(() => {
    navigate(ROUTES.TEACHER_CLASS_CREATE);
  }, [navigate]);

  // Statistiques rapides
  const activeClasses = classes.filter(c => c.status === 'ACTIVE').length;
  const totalStudents = classes.reduce((sum, c) => sum + c.currentStudents, 0);
  const completedClasses = classes.filter(c => c.status === 'COMPLETED').length;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Mes Classes Virtuelles</h1>
            <p className="text-muted-foreground mt-1">
              Gérez vos classes et suivez la progression de vos étudiants
            </p>
          </div>
          <Button onClick={handleCreateClasse} className="gap-2">
            <Plus className="h-4 w-4" />
            Créer une classe
          </Button>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Classes Actives</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeClasses}</div>
              <p className="text-xs text-muted-foreground">
                sur {classes.length} classes totales
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Étudiants Inscrits</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents}</div>
              <p className="text-xs text-muted-foreground">
                dans toutes vos classes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Classes Terminées</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedClasses}</div>
              <p className="text-xs text-muted-foreground">
                cours complétés
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filtres et recherche */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Filtres et Recherche</CardTitle>
          <CardDescription>
            Trouvez rapidement les classes que vous cherchez
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Recherche */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom de classe ou cours..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filtre de statut */}
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={handleStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Mode d'affichage */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des classes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {classes.length} classe{classes.length > 1 ? 's' : ''} trouvée{classes.length > 1 ? 's' : ''}
          </h2>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={refetch}
              disabled={loading}
            >
              Actualiser
            </Button>
          </div>
        </div>

        <ClasseList
          classes={classes}
          loading={loading}
          error={error}
          onView={handleViewClasse}
          onEdit={handleEditClasse}
          onDelete={handleDeleteClasse}
          showActions={true}
          emptyMessage="Vous n'avez pas encore créé de classe. Commencez par créer votre première classe virtuelle !"
        />
      </div>
    </div>
  );
}
