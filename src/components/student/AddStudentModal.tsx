import { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Search, UserPlus, Users, AlertCircle, Mail, Phone, GraduationCap } from 'lucide-react';
import { studentService } from '../../services/studentService';
import { classeService } from '../../services/classeService';
import { useAppStore } from '../../store/useAppStore';
import { toast } from 'sonner';

interface AvailableStudent {
  _id: string;
  name: string;
  lastname: string;
  email: string;
  phone?: string;
  grade?: string;
  active: boolean;
  matricule?: string;
  school?: string;
  date_naiss?: string;
  profil_img?: string;
  avatar?: string;
}

interface Class {
  _id: string;
  className: string;
  description?: string;
  currentStudents: number;
  maxStudents: number;
  teacherId: string;
  teacherName: string;
  courseId?: string | null;
  courseTitle?: string | null;
  status: string;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStudentAdded: () => void;
}

export default function AddStudentModal({
  isOpen,
  onClose,
  onStudentAdded,
}: AddStudentModalProps) {
  const { user } = useAppStore();
  const [availableStudents, setAvailableStudents] = useState<AvailableStudent[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<AvailableStudent[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [addingStudent, setAddingStudent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadAvailableStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await studentService.searchStudents('');
      if (response.success && response.data) {
        setAvailableStudents(response.data);
      } else {
        setError('Erreur lors du chargement des étudiants disponibles');
      }
    } catch (err) {
      setError('Erreur lors du chargement des étudiants disponibles');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadClasses = useCallback(async () => {
    try {
      setLoadingClasses(true);
      setError(null);
      
      if (!user?.id) {
        console.error('Utilisateur non connecté ou ID manquant');
        setError('Utilisateur non connecté');
        return;
      }
      
      console.log('Chargement des classes pour l\'enseignant:', user.id);
      const response = await classeService.getClassesByTeacher(user.id);
      
      if (response.success && response.data) {
        console.log('Classes chargées:', response.data);
        setClasses(response.data);
      } else {
        console.error('Erreur dans la réponse:', response);
        setError('Erreur lors du chargement des classes');
      }
    } catch (err) {
      console.error('Erreur lors du chargement des classes:', err);
      setError('Erreur lors du chargement des classes');
    } finally {
      setLoadingClasses(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (isOpen) {
      loadAvailableStudents();
      loadClasses();
    }
  }, [isOpen, loadClasses]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredStudents(availableStudents);
    } else {
      const filtered = availableStudents.filter(
        (student) =>
          student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.matricule?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.grade?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStudents(filtered);
    }
  }, [searchTerm, availableStudents]);

  const handleAddStudent = async (studentId: string) => {
    if (!selectedClass) {
      toast.error('Veuillez sélectionner une classe');
      return;
    }

    const selectedClassData = classes.find(c => c._id === selectedClass);
    if (selectedClassData && 
        selectedClassData.currentStudents >= selectedClassData.maxStudents) {
      toast.error('Cette classe est pleine');
      return;
    }

    try {
      setAddingStudent(studentId);
      const response = await classeService.enrollStudent(selectedClass, studentId);
      
      if (response.success) {
        toast.success('Étudiant ajouté avec succès');
        onStudentAdded();
        onClose();
      } else {
        toast.error('Erreur lors de l\'ajout de l\'étudiant');
      }
    } catch (err) {
      toast.error('Erreur lors de l\'ajout de l\'étudiant');
      console.error('Erreur:', err);
    } finally {
      setAddingStudent(null);
    }
  };

  const handleClose = () => {
    setSearchTerm('');
    setSelectedClass('');
    setError(null);
    onClose();
  };

  const getStatusColor = (active: boolean) => {
    return active 
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
  };

  const getStatusLabel = (active: boolean) => {
    return active ? 'Actif' : 'Inactif';
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Ajouter un Étudiant
          </DialogTitle>
          <DialogDescription>
            Recherchez et ajoutez un étudiant à une de vos classes
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col space-y-4">
          {/* Sélection de classe */}
          <div className="space-y-2">
            <Label htmlFor="class-select">Classe de destination</Label>
            <Select value={selectedClass} onValueChange={setSelectedClass} disabled={loadingClasses}>
              <SelectTrigger>
                <SelectValue placeholder={
                  loadingClasses 
                    ? "Chargement des classes..." 
                    : classes.length === 0 
                      ? "Aucune classe disponible" 
                      : "Sélectionnez une classe"
                } />
              </SelectTrigger>
              <SelectContent>
                {loadingClasses ? (
                  <SelectItem value="loading" disabled>
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary"></div>
                      <span>Chargement...</span>
                    </div>
                  </SelectItem>
                ) : classes.length === 0 ? (
                  <SelectItem value="no-classes" disabled>
                    Aucune classe disponible
                  </SelectItem>
                ) : (
                  classes.map((cls) => (
                    <SelectItem key={cls._id} value={cls._id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{cls.className}</span>
                        <span className="text-sm text-muted-foreground ml-2">
                          ({cls.currentStudents || 0}/{cls.maxStudents || 0})
                        </span>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
          </div>

          {/* Recherche */}
          <div className="space-y-2">
            <Label htmlFor="student-search">Rechercher un étudiant</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="student-search"
                placeholder="Nom, prénom, email ou matricule..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Liste des étudiants */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Chargement des étudiants...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 mb-4">{error}</p>
                <Button variant="outline" onClick={loadAvailableStudents}>
                  Réessayer
                </Button>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm ? 'Aucun étudiant trouvé' : 'Aucun étudiant disponible'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredStudents.map((student) => (
                  <Card key={student._id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">
                            {student.name} {student.lastname}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getStatusColor(student.active)}>
                              {getStatusLabel(student.active)}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {student.grade || 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          <span className="truncate">{student.email}</span>
                        </div>
                        {student.phone && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            <span>{student.phone}</span>
                          </div>
                        )}
                        {student.matricule && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <GraduationCap className="h-3 w-3" />
                            <span>Matricule: {student.matricule}</span>
                          </div>
                        )}
                        {student.school && (
                          <div className="text-sm text-muted-foreground">
                            École: {student.school}
                          </div>
                        )}
                      </div>

                      <Button
                        onClick={() => handleAddStudent(student._id)}
                        disabled={!selectedClass || addingStudent === student._id}
                        className="w-full"
                        size="sm"
                      >
                        {addingStudent === student._id ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                            Ajout en cours...
                          </>
                        ) : (
                          <>
                            <UserPlus className="h-3 w-3 mr-2" />
                            Ajouter à la classe
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            Annuler
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
