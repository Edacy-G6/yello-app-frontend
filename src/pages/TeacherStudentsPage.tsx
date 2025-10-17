import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Search,
  Plus,
  Users,
  Mail,
  Calendar,
  MoreVertical,
  Edit3,
  Eye,
  UserCheck,
  UserX,
} from 'lucide-react';
import AddStudentModal from '../components/student/AddStudentModal';
import { studentService, type Student } from '../services/studentService';
import { toast } from 'sonner';

export default function TeacherStudentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [students, setStudents] = useState<Student[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);

  // Charger les étudiants
  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await studentService.getStudents();
      if (response.success && response.data) {
        setStudents(response.data);
      } else {
        setError('Erreur lors du chargement des étudiants');
      }
    } catch (err) {
      setError('Erreur lors du chargement des étudiants');
      console.error('Erreur:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'suspended':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Actif';
      case 'inactive':
        return 'Inactif';
      case 'suspended':
        return 'Suspendu';
      default:
        return status;
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch =
      (student.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (student.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (student.email?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    const matchesStatus =
      statusFilter === 'all' || (student.active ? 'active' : 'inactive') === statusFilter;
    const matchesLevel = levelFilter === 'all' || student.grade === levelFilter;
    
    return matchesSearch && matchesStatus && matchesLevel;
  });

  const handleViewStudent = (studentId: string) => {
    console.log("Voir l'étudiant:", studentId);
  };

  const handleEditStudent = (studentId: string) => {
    console.log("Modifier l'étudiant:", studentId);
  };

  const handleToggleStatus = async (studentId: string) => {
    try {
      const student = students.find(s => s._id === studentId);
      if (!student) return;

      const newActiveStatus = !student.active;
      const response = await studentService.updateStudentProfile(
        { active: newActiveStatus },
        studentId
      );

      if (response.success) {
        toast.success(`Statut de l'étudiant mis à jour`);
        loadStudents();
      } else {
        toast.error('Erreur lors de la mise à jour du statut');
      }
    } catch (err) {
      toast.error('Erreur lors de la mise à jour du statut');
      console.error('Erreur:', err);
    }
  };

  const handleStudentAdded = () => {
    loadStudents();
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Chargement des étudiants...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Réessayer
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Mes Étudiants
              </h1>
              <p className="text-lg text-muted-foreground">
                Gérez et suivez vos étudiants
              </p>
            </div>

            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={() => setShowAddStudentModal(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un Étudiant
            </Button>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un étudiant..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="inactive">Inactif</SelectItem>
                <SelectItem value="suspended">Suspendu</SelectItem>
              </SelectContent>
            </Select>

            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Niveau" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les niveaux</SelectItem>
                <SelectItem value="6ème">6ème</SelectItem>
                <SelectItem value="5ème">5ème</SelectItem>
                <SelectItem value="4ème">4ème</SelectItem>
                <SelectItem value="3ème">3ème</SelectItem>
                <SelectItem value="2nde">2nde</SelectItem>
                <SelectItem value="1ère">1ère</SelectItem>
                <SelectItem value="Terminale">Terminale</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Total</span>
              </div>
              <div className="text-2xl font-bold mt-1">{students.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm font-medium">Actifs</span>
              </div>
              <div className="text-2xl font-bold mt-1">
                {students.filter(s => s.active).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                <span className="text-sm font-medium">Inactifs</span>
              </div>
              <div className="text-2xl font-bold mt-1">
                {students.filter(s => !s.active).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span className="text-sm font-medium">Moyenne Progression</span>
              </div>
              <div className="text-2xl font-bold mt-1">
                {Math.round(
                  students.reduce((sum, s) => sum + (s.completionRate || 0), 0) /
                    students.length || 0
                )}
                %
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liste des étudiants */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map(student => (
            <Card
              key={student._id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">
                      {student.name || ''} {student.lastname || ''}
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(student.active ? 'active' : 'inactive')}>
                        {getStatusLabel(student.active ? 'active' : 'inactive')}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {student.grade || 'N/A'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* Informations de contact */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      <span className="truncate">{student.email || 'N/A'}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>
                        Inscrit le{' '}
                        {student.enrollmentDate ? new Date(student.enrollmentDate).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>

                  {/* Progression */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progression</span>
                      <span>{student.completionRate || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${student.completionRate || 0}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Statistiques */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{student.totalQuizzes || 0} quiz</span>
                    <span>Score moyen: {student.averageScore || 0}%</span>
                  </div>

                  {/* Dernière activité */}
                  <div className="text-sm text-muted-foreground">
                    Dernière activité:{' '}
                    {student.lastActivity ? new Date(student.lastActivity).toLocaleDateString() : 'N/A'}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleViewStudent(student._id)}
                      className="flex-1"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Voir
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEditStudent(student._id)}
                    >
                      <Edit3 className="h-3 w-3" />
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleToggleStatus(student._id)}
                    >
                      {student.active ? (
                        <UserX className="h-3 w-3" />
                      ) : (
                        <UserCheck className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Message si aucun étudiant trouvé */}
        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Aucun étudiant trouvé
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== 'all' || levelFilter !== 'all'
                ? 'Essayez de modifier vos filtres de recherche'
                : 'Commencez par ajouter votre premier étudiant'}
            </p>
            <Button onClick={() => setShowAddStudentModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un Étudiant
            </Button>
          </div>
        )}

        {/* Modal d'ajout d'étudiant */}
        <AddStudentModal
          isOpen={showAddStudentModal}
          onClose={() => setShowAddStudentModal(false)}
          onStudentAdded={handleStudentAdded}
        />
      </div>
    </div>
  );
}
