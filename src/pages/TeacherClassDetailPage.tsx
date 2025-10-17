import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useClasse, useClasseStats, useDeleteClasse } from '../hooks/useClasses';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Users, 
  Calendar, 
  Clock, 
  BookOpen,
  BarChart3,
  Settings,
  UserPlus,
  MoreHorizontal,
  UserMinus,
  Search,
  AlertCircle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { ROUTES } from '../constants';
import { classeService } from '../services/classeService';
import type { ClasseStatus, StudentInClass, EnrollmentStatus } from '../types/classe';
import AddStudentModal from '../components/classe/AddStudentModal';
import { toast } from 'sonner';

const statusConfig: Record<ClasseStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  ACTIVE: { label: 'Active', variant: 'default' },
  INACTIVE: { label: 'Inactive', variant: 'secondary' },
  COMPLETED: { label: 'Terminée', variant: 'outline' },
  CANCELLED: { label: 'Annulée', variant: 'destructive' },
};

const enrollmentStatusConfig: Record<EnrollmentStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  ACTIVE: { label: 'Actif', variant: 'default' },
  INACTIVE: { label: 'Inactif', variant: 'secondary' },
  SUSPENDED: { label: 'Suspendu', variant: 'destructive' },
};

export default function TeacherClassDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [students, setStudents] = useState<StudentInClass[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsError, setStudentsError] = useState<string | null>(null);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Hooks
  const { 
    classe, 
    loading: classeLoading, 
    error: classeError, 
    refetch: refetchClasse 
  } = useClasse({ classId: id || '', enabled: true });
  
  const { 
    stats, 
    loading: statsLoading, 
    error: statsError 
  } = useClasseStats(id || '', true);
  
  const { 
    deleteClasse, 
    loading: deleteLoading 
  } = useDeleteClasse();

  // Charger les étudiants de la classe
  useEffect(() => {
    if (id && activeTab === 'students') {
      loadStudents();
    }
  }, [id, activeTab]);

  const loadStudents = async () => {
    if (!id) return;
    
    try {
      setStudentsLoading(true);
      setStudentsError(null);
      const response = await classeService.getClasseStudents(id);
      if (response.success && response.data) {
        setStudents(response.data);
      } else {
        setStudentsError('Erreur lors du chargement des étudiants');
      }
    } catch (err) {
      setStudentsError('Erreur lors du chargement des étudiants');
      console.error('Erreur:', err);
    } finally {
      setStudentsLoading(false);
    }
  };

  const handleRemoveStudent = async (studentId: string) => {
    if (!id) return;
    
    if (window.confirm('Êtes-vous sûr de vouloir retirer cet étudiant de la classe ?')) {
      try {
        const response = await classeService.unenrollStudent(id, studentId);
        if (response.success) {
          toast.success('Étudiant retiré avec succès');
          loadStudents(); // Recharger la liste
        } else {
          toast.error('Erreur lors du retrait de l\'étudiant');
        }
      } catch (err) {
        toast.error('Erreur lors du retrait de l\'étudiant');
        console.error('Erreur:', err);
      }
    }
  };

  const handleUpdateStudentStatus = async (studentId: string, newStatus: EnrollmentStatus) => {
    if (!id) return;
    
    try {
      const response = await classeService.updateStudentStatus(id, studentId, newStatus);
      if (response.success) {
        toast.success('Statut de l\'étudiant mis à jour');
        loadStudents(); // Recharger la liste
      } else {
        toast.error('Erreur lors de la mise à jour du statut');
      }
    } catch (err) {
      toast.error('Erreur lors de la mise à jour du statut');
      console.error('Erreur:', err);
    }
  };

  const handleStudentAdded = () => {
    loadStudents(); // Recharger la liste après ajout
  };

  // Filtrer les étudiants selon le terme de recherche
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.matricule?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.niveau?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Actions
  const handleEdit = () => {
    if (id) {
      navigate(ROUTES.TEACHER_CLASS_EDIT.replace(':id', id));
    }
  };

  const handleDelete = async () => {
    if (!id || !classe) return;
    
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la classe "${classe.className}" ?`)) {
      try {
        await deleteClasse(id);
        navigate(ROUTES.TEACHER_CLASSES);
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };


  const handleBack = () => {
    navigate(ROUTES.TEACHER_CLASSES);
  };

  if (classeLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 bg-muted rounded"></div>
              <div className="h-32 bg-muted rounded"></div>
            </div>
            <div className="space-y-6">
              <div className="h-32 bg-muted rounded"></div>
              <div className="h-48 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (classeError || !classe) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="text-destructive mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-foreground mb-1">Classe non trouvée</h3>
              <p className="text-muted-foreground mb-4">
                {classeError || 'Cette classe n\'existe pas ou vous n\'avez pas les permissions pour y accéder.'}
              </p>
              <Button onClick={handleBack}>
                Retour aux classes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusInfo = statusConfig[classe.status];
  const occupancyPercentage = classeService.getClassOccupancyPercentage(classe);
  const isFull = classeService.isClassFull(classe);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBack}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-foreground">{classe.className}</h1>
              <Badge variant={statusInfo.variant}>
                {statusInfo.label}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              {classe.description || 'Aucune description'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddStudentModal(true)}
              className="gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Ajouter étudiant
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleDelete}
                  className="text-destructive focus:text-destructive"
                  disabled={deleteLoading}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contenu principal */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Aperçu</TabsTrigger>
              <TabsTrigger value="students">Étudiants</TabsTrigger>
              <TabsTrigger value="stats">Statistiques</TabsTrigger>
              <TabsTrigger value="settings">Paramètres</TabsTrigger>
            </TabsList>

            {/* Onglet Aperçu */}
            <TabsContent value="overview" className="space-y-6">
              {/* Informations du cours */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Cours associé
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h3 className="font-semibold">{classe.course?.courseTitle}</h3>
                    <p className="text-muted-foreground">{classe.course?.description}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Horaire */}
              {classe.schedule && classe.schedule.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Horaire
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {classe.schedule.map((slot, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">
                              {classeService.getDayName(slot.dayOfWeek)}
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {classeService.formatTime(slot.startTime)} - {classeService.formatTime(slot.endTime)}
                            <span className="ml-2">({slot.duration} min)</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Dates */}
              {(classe.startDate || classe.endDate) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Période
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {classe.startDate && (
                        <div>
                          <p className="text-sm text-muted-foreground">Date de début</p>
                          <p className="font-medium">{classeService.formatDate(classe.startDate)}</p>
                        </div>
                      )}
                      {classe.endDate && (
                        <div>
                          <p className="text-sm text-muted-foreground">Date de fin</p>
                          <p className="font-medium">{classeService.formatDate(classe.endDate)}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Onglet Étudiants */}
            <TabsContent value="students">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Étudiants inscrits ({students.length})
                      </CardTitle>
                      <CardDescription>
                        Gérez les inscriptions de vos étudiants
                      </CardDescription>
                    </div>
                    <Button
                      onClick={() => setShowAddStudentModal(true)}
                      disabled={classe?.settings.currentStudents >= classe?.settings.maxStudents}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Ajouter des étudiants
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Barre de recherche */}
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Rechercher un étudiant..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Liste des étudiants */}
                  {studentsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : studentsError ? (
                    <div className="flex items-center justify-center py-8 text-red-600">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      {studentsError}
                    </div>
                  ) : filteredStudents.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>
                        {searchTerm ? 'Aucun étudiant trouvé' : 'Aucun étudiant inscrit'}
                      </p>
                      {!searchTerm && (
                        <p className="text-sm mt-2">
                          Cliquez sur "Ajouter des étudiants" pour commencer
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredStudents.map((student) => (
                        <div
                          key={student._id}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-medium text-sm">
                                {student.name.charAt(0)}{student.lastname.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">
                                {student.name} {student.lastname}
                              </h3>
                              <p className="text-sm text-gray-600">{student.email}</p>
                              <div className="flex items-center gap-2 mt-1">
                                {student.matricule && (
                                  <Badge variant="outline" className="text-xs">
                                    {student.matricule}
                                  </Badge>
                                )}
                                {student.niveau && (
                                  <Badge variant="secondary" className="text-xs">
                                    {student.niveau}
                                  </Badge>
                                )}
                                <Badge
                                  variant={enrollmentStatusConfig[student.enrollmentStatus as EnrollmentStatus]?.variant || 'outline'}
                                  className="text-xs"
                                >
                                  {enrollmentStatusConfig[student.enrollmentStatus as EnrollmentStatus]?.label || student.enrollmentStatus}
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                Inscrit le {new Date(student.joinedAt).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {student.enrollmentStatus === 'ACTIVE' ? (
                                  <DropdownMenuItem
                                    onClick={() => handleUpdateStudentStatus(student._id, 'INACTIVE')}
                                  >
                                    Suspendre
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem
                                    onClick={() => handleUpdateStudentStatus(student._id, 'ACTIVE')}
                                  >
                                    Réactiver
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  onClick={() => handleRemoveStudent(student._id)}
                                  className="text-red-600"
                                >
                                  <UserMinus className="h-4 w-4 mr-2" />
                                  Retirer de la classe
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Onglet Statistiques */}
            <TabsContent value="stats">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Statistiques
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {statsLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    </div>
                  ) : statsError ? (
                    <div className="text-center py-8 text-destructive">
                      <p>Erreur lors du chargement des statistiques</p>
                    </div>
                  ) : stats ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold">{stats.totalStudents}</p>
                        <p className="text-sm text-muted-foreground">Total étudiants</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold">{stats.activeStudents}</p>
                        <p className="text-sm text-muted-foreground">Actifs</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold">{stats.completedModules}</p>
                        <p className="text-sm text-muted-foreground">Modules terminés</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold">{stats.averageScore}%</p>
                        <p className="text-sm text-muted-foreground">Score moyen</p>
                      </div>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Onglet Paramètres */}
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Paramètres de la classe
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Capacité maximale</p>
                        <p className="text-sm text-muted-foreground">
                          {classe.settings.currentStudents} / {classe.settings.maxStudents} étudiants
                        </p>
                      </div>
                      <Badge variant={isFull ? 'destructive' : 'outline'}>
                        {occupancyPercentage}%
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Classe publique</p>
                        <p className="text-sm text-muted-foreground">
                          {classe.settings.isPublic ? 'Visible par tous' : 'Privée'}
                        </p>
                      </div>
                      <Badge variant={classe.settings.isPublic ? 'default' : 'secondary'}>
                        {classe.settings.isPublic ? 'Publique' : 'Privée'}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Approbation requise</p>
                        <p className="text-sm text-muted-foreground">
                          {classe.settings.requiresApproval ? 'Oui' : 'Non'}
                        </p>
                      </div>
                      <Badge variant={classe.settings.requiresApproval ? 'default' : 'secondary'}>
                        {classe.settings.requiresApproval ? 'Oui' : 'Non'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Résumé rapide */}
          <Card>
            <CardHeader>
              <CardTitle>Résumé</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Étudiants inscrits</span>
                <span className="font-medium">{classe.settings.currentStudents}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Capacité maximale</span>
                <span className="font-medium">{classe.settings.maxStudents}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Taux d'occupation</span>
                <span className="font-medium">{occupancyPercentage}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isFull ? 'bg-destructive' : occupancyPercentage > 80 ? 'bg-orange-500' : 'bg-primary'
                  }`}
                  style={{ width: `${Math.min(occupancyPercentage, 100)}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions rapides */}
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={handleEdit}
              >
                <Edit className="mr-2 h-4 w-4" />
                Modifier la classe
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setShowAddStudentModal(true)}
                disabled={classe?.settings.currentStudents >= classe?.settings.maxStudents}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Ajouter un étudiant
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal d'ajout d'étudiants */}
      {classe && (
        <AddStudentModal
          isOpen={showAddStudentModal}
          onClose={() => setShowAddStudentModal(false)}
          classId={classe._id}
          className={classe.className}
          currentStudents={classe.settings.currentStudents}
          maxStudents={classe.settings.maxStudents}
          onStudentAdded={handleStudentAdded}
        />
      )}
    </div>
  );
}
